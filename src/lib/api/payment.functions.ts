import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { CashfreeConfig, CashfreeOrderStatusResponse } from "./cashfree.server";
import { bookingConfirmation, bookingAdminAlert, paymentFailureNotice } from "../email/templates";

// ─── Server-only helpers (dynamically imported inside handlers) ──

async function getServerDeps() {
  const [{ getSupabaseAdmin }, { getServerConfig }, { sendEmail }, cashfree] = await Promise.all([
    import("../supabase.server"),
    import("../config.server"),
    import("../email/send-email.server"),
    import("./cashfree.server"),
  ]);
  return { getSupabaseAdmin, getServerConfig, sendEmail, ...cashfree };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Cashfree occasionally reports "ACTIVE" for a second or two right after
 * the redirect back to us, before flipping to a final "PAID" status —
 * most commonly with UPI. Poll briefly instead of declaring the payment
 * failed on the first check, to avoid false "payment failed" emails for
 * payments that actually succeeded.
 */
async function pollCashfreeOrderStatus(
  verifyFn: (config: CashfreeConfig, orderId: string) => Promise<CashfreeOrderStatusResponse>,
  cashfreeConfig: CashfreeConfig,
  orderId: string,
  attempts = 3,
  delayMs = 1500,
): Promise<CashfreeOrderStatusResponse> {
  let last = await verifyFn(cashfreeConfig, orderId);
  for (let i = 1; i < attempts && last.order_status === "ACTIVE"; i++) {
    await sleep(delayMs);
    last = await verifyFn(cashfreeConfig, orderId);
  }
  return last;
}

type ServiceLine = { name: string; amount: number; deliveryText: string };

/** Short, human note describing the group of services for Cashfree's order_note field. */
function summarizeServiceNames(names: string[]): string {
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} + ${names[1]}`;
  return `${names[0]} + ${names.length - 1} more readings`;
}

/** The longest delivery estimate in the group — what we tell the customer to expect. */
function longestDeliveryText(lines: ServiceLine[]): string {
  return lines.reduce(
    (longest, l) => (l.deliveryText.length > longest.length ? l.deliveryText : longest),
    lines[0]?.deliveryText ?? "3–5 business days",
  );
}

// ─── Create Cashfree Order (covers one or many services at once) ────

export const createCashfreeOrder = createServerFn({ method: "POST" })
  .validator(
    z.object({
      orderIds: z.array(z.string().uuid()).min(1).max(9),
    }),
  )
  .handler(async ({ data }) => {
    const { getSupabaseAdmin, getServerConfig, getCashfreeConfig, createCashfreeOrderApi } =
      await getServerDeps();
    const db = getSupabaseAdmin();
    const config = getServerConfig();
    const cashfree = getCashfreeConfig();

    // Look up every order in the group, along with its booking
    const { data: orderRows, error: oErr } = await db
      .from("orders")
      .select(
        "id, status, amount, booking_id, bookings(customer_name, customer_email, customer_phone, status, services(name))",
      )
      .in("id", data.orderIds);

    if (oErr) {
      console.error("[cashfree] Order group lookup failed:", oErr);
      throw new Error("Could not find your booking. Please try again.");
    }

    type OrderWithBooking = {
      id: string;
      status: string;
      amount: number;
      booking_id: string;
      bookings: {
        customer_name: string;
        customer_email: string;
        customer_phone: string;
        status: string;
        services: { name: string } | null;
      } | null;
    };

    const orders = (orderRows ?? []) as OrderWithBooking[];

    if (orders.length !== data.orderIds.length) {
      throw new Error("One or more items in your booking could not be found.");
    }

    if (orders.some((o) => !o.bookings)) {
      throw new Error("Could not load booking details for this order.");
    }

    // Every order in a group must belong to the same customer — this is
    // just a sanity check against mixed/stale order ids, not a real
    // security boundary (order ids are opaque UUIDs anyway).
    const emails = new Set(orders.map((o) => o.bookings!.customer_email));
    if (emails.size > 1) {
      throw new Error("These bookings belong to different customers and cannot be paid together.");
    }

    if (orders.some((o) => o.status !== "created")) {
      throw new Error("This booking has already been submitted for payment.");
    }

    const primary = orders[0].bookings!;
    const amount = Math.round(orders.reduce((sum, o) => sum + Number(o.amount), 0) * 100) / 100;
    const serviceNames = orders.map((o) => o.bookings!.services?.name ?? "Astrology Reading");

    const orderPrefix = orders[0].id.replace(/-/g, "").slice(0, 20);
    const suffix = Date.now().toString(36).slice(-5);
    const cfClientOrderId = `${orderPrefix}${suffix}`;
    const returnUrl = `${config.appUrl}/api/cashfree-callback`;

    const cfOrder = await createCashfreeOrderApi(cashfree, {
      orderId: cfClientOrderId,
      orderAmount: amount,
      orderCurrency: "INR",
      customerDetails: {
        customerId: orders[0].booking_id.replace(/-/g, ""),
        customerEmail: primary.customer_email,
        customerPhone: primary.customer_phone,
        customerName: primary.customer_name,
      },
      returnUrl,
      orderNote: summarizeServiceNames(serviceNames),
      orderTags: { order_count: String(orders.length) },
    });

    // Stamp every order in the group with the same Cashfree reference in
    // one bulk update — this is what links them together for the
    // callback later, and it MUST succeed: if this write silently failed,
    // the customer could be charged with no way for the callback to ever
    // find these orders again.
    const { error: updateErr } = await db
      .from("orders")
      .update({
        gateway_txn_id: cfClientOrderId,
        status: "pending" as const,
        raw_request: {
          order_id: cfClientOrderId,
          order_amount: amount,
          order_currency: "INR",
          customer_email: primary.customer_email,
          return_url: returnUrl,
          order_ids: data.orderIds,
        } as unknown as Record<string, unknown>,
        raw_response: cfOrder as unknown as Record<string, unknown>,
      })
      .in("id", data.orderIds);

    if (updateErr) {
      console.error("[cashfree] Failed to persist order group reference:", updateErr);
      throw new Error("Failed to prepare payment. Please try again.");
    }

    return {
      success: true as const,
      paymentSessionId: cfOrder.payment_session_id,
      cfOrderId: cfClientOrderId,
      mode: cashfree.mode,
    };
  });

// ─── Verify Cashfree Payment (Callback) ─────────────────────

export const verifyCashfreePayment = createServerFn({ method: "POST" })
  .validator(z.object({ orderId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const {
      getSupabaseAdmin,
      getServerConfig,
      getCashfreeConfig,
      verifyCashfreeOrderApi,
      getPaymentsForOrderApi,
      sendEmail,
    } = await getServerDeps();
    const db = getSupabaseAdmin();
    const config = getServerConfig();
    const cashfree = getCashfreeConfig();

    // 1. Find every order sharing this gateway_txn_id — the whole group
    // that was paid for together.
    const { data: orderRows, error: orderErr } = await db
      .from("orders")
      .select("id, booking_id, status")
      .eq("gateway_txn_id", data.orderId);

    if (orderErr || !orderRows || orderRows.length === 0) {
      console.error("[cashfree] Order group not found for order_id:", data.orderId);
      throw new Error("Order not found for this transaction.");
    }

    const groupOrders = orderRows as { id: string; booking_id: string; status: string }[];
    const bookingIdsInGroup = groupOrders.map((o) => o.booking_id);

    async function primaryPublicRef(): Promise<string> {
      const { data: rows } = await db
        .from("bookings")
        .select("public_ref, created_at")
        .in("id", bookingIdsInGroup)
        .order("created_at", { ascending: true })
        .limit(1);
      return (rows?.[0] as { public_ref: string } | undefined)?.public_ref ?? "";
    }

    // 2. Idempotency: if the whole group is already settled, don't process again
    if (groupOrders.every((o) => o.status === "success")) {
      return {
        success: true as const,
        publicRef: await primaryPublicRef(),
        status: "already_processed" as const,
        paymentStatus: "success" as const,
      };
    }

    // 3. Verify with Cashfree's API — never trust the redirect alone.
    // Poll briefly if Cashfree still reports "ACTIVE" in case the status
    // hasn't finalized yet (common with UPI right after redirect).
    const orderStatus = await pollCashfreeOrderStatus(
      verifyCashfreeOrderApi,
      cashfree,
      data.orderId,
    );
    const isSuccess = orderStatus.order_status === "PAID";

    // 4. If paid, fetch the payment entity for the gateway payment id and
    // richer payload to store.
    let cfPaymentId: string | null = null;
    let rawResponse: unknown = orderStatus;

    if (isSuccess) {
      try {
        const payments = await getPaymentsForOrderApi(cashfree, data.orderId);
        const successPayment = payments.find((p) => p.payment_status === "SUCCESS") ?? payments[0];
        if (successPayment) {
          cfPaymentId = successPayment.cf_payment_id;
          rawResponse = successPayment;
        }
      } catch (err) {
        console.error("[cashfree] Failed to fetch payment details:", err);
      }
    }

    const newOrderStatus = isSuccess ? ("success" as const) : ("failure" as const);
    const newBookingStatus = isSuccess ? ("paid" as const) : ("failed" as const);

    // 5. Update every order in the group — guarded on status still being
    // "pending" so that if this callback somehow runs twice concurrently
    // (React effect re-fire, user hitting back/forward, a duplicate
    // redirect), only the first caller actually flips the status and
    // sends emails. The second caller sees zero rows affected and exits
    // quietly with the already-settled state instead of re-processing.
    const { data: updatedOrderRows, error: orderUpdateError } = await db
      .from("orders")
      .update({
        status: newOrderStatus,
        gateway_payment_id: cfPaymentId,
        raw_response: rawResponse as unknown as Record<string, unknown>,
      })
      .eq("gateway_txn_id", data.orderId)
      .eq("status", "pending")
      .select("id, booking_id");

    if (orderUpdateError) {
      console.error("[cashfree] Failed to update order group status:", orderUpdateError);
      throw new Error("Failed to update order status after payment verification.");
    }

    if (!updatedOrderRows || updatedOrderRows.length === 0) {
      // Another concurrent call already processed this group. Return the
      // settled state without re-sending emails or duplicating records.
      const { data: currentOrders } = await db
        .from("orders")
        .select("status")
        .eq("gateway_txn_id", data.orderId);

      const settled = (currentOrders as { status: string }[] | null)?.every(
        (o) => o.status === "success",
      );

      return {
        success: true as const,
        publicRef: await primaryPublicRef(),
        status: "already_processed" as const,
        paymentStatus: settled ? ("success" as const) : ("failure" as const),
      };
    }

    const updatedBookingIds = updatedOrderRows.map((o) => (o as { booking_id: string }).booking_id);

    // 6. Update every booking in the group
    const { error: bookingUpdateError } = await db
      .from("bookings")
      .update({ status: newBookingStatus })
      .in("id", updatedBookingIds);

    if (bookingUpdateError) {
      console.error("[cashfree] Failed to update booking group status:", bookingUpdateError);
      throw new Error("Failed to update booking status after payment verification.");
    }

    // 7. Log one payment event per order in the group, in a single bulk insert
    await db.from("payments").insert(
      updatedOrderRows.map((o) => ({
        order_id: (o as { id: string }).id,
        event_type: "cashfree_callback",
        event_status: orderStatus.order_status,
        raw_payload: rawResponse as unknown as Record<string, unknown>,
      })),
    );

    // 8. Fetch full booking + service details for the group, oldest first
    // (the oldest booking is treated as the "primary" one for the
    // customer-facing reference).
    const { data: bookingRows } = await db
      .from("bookings")
      .select(
        "public_ref, customer_name, customer_email, customer_phone, amount, question, created_at, services(name, delivery_text)",
      )
      .in("id", updatedBookingIds)
      .order("created_at", { ascending: true });

    type BookingWithService = {
      public_ref: string;
      customer_name: string;
      customer_email: string;
      customer_phone: string;
      amount: number;
      question: string | null;
      services: { name: string; delivery_text: string } | null;
    };

    const bookings = (bookingRows ?? []) as BookingWithService[];
    let publicRef = "";

    if (bookings.length > 0) {
      const primaryBk = bookings[0];
      publicRef = primaryBk.public_ref;

      const serviceLines: ServiceLine[] = bookings.map((b) => ({
        name: b.services?.name ?? "Astrology Reading",
        amount: Number(b.amount),
        deliveryText: b.services?.delivery_text ?? "3–5 business days",
      }));
      const totalAmount = serviceLines.reduce((sum, l) => sum + l.amount, 0);
      const deliveryText = longestDeliveryText(serviceLines);

      if (isSuccess) {
        sendEmail({
          to: primaryBk.customer_email,
          subject: `Booking confirmed — ${summarizeServiceNames(serviceLines.map((l) => l.name))} · ${publicRef}`,
          html: bookingConfirmation({
            customerName: primaryBk.customer_name,
            services: serviceLines,
            publicRef,
            totalAmount,
            deliveryText,
            transactionId: cfPaymentId ?? data.orderId,
          }),
        }).catch((err) => console.error("[cashfree] Confirmation email failed:", err));

        const adminEmail = config.adminEmail || "Erssuman18@gmail.com";
        sendEmail({
          to: adminEmail,
          subject: `✅ Payment received — ${publicRef} · ₹${totalAmount}`,
          html: bookingAdminAlert({
            customerName: primaryBk.customer_name,
            customerEmail: primaryBk.customer_email,
            customerPhone: primaryBk.customer_phone,
            services: serviceLines,
            publicRef,
            totalAmount,
            question: primaryBk.question ?? undefined,
          }),
        }).catch((err) => console.error("[cashfree] Admin alert email failed:", err));
      } else {
        sendEmail({
          to: primaryBk.customer_email,
          subject: `Payment not completed — ${publicRef}`,
          html: paymentFailureNotice({
            customerName: primaryBk.customer_name,
            services: serviceLines,
            publicRef,
            totalAmount,
            error: orderStatus.order_status,
          }),
        }).catch((err) => console.error("[cashfree] Failure email failed:", err));
      }
    }

    // 9. Audit log — one combined entry for the group
    await db.from("audit_logs").insert({
      action: isSuccess ? "payment_success" : "payment_failure",
      entity_type: "orders",
      entity_id: updatedOrderRows[0].id as string,
      details: {
        cfOrderId: data.orderId,
        cfPaymentId,
        amount: orderStatus.order_amount,
        status: orderStatus.order_status,
        bookingRef: publicRef,
        orderCount: updatedOrderRows.length,
      },
    });

    return {
      success: true as const,
      publicRef,
      paymentStatus: newOrderStatus,
    };
  });

// ─── Fetch Booking by Public Ref (for the success/failure page) ────

export const getBookingByRef = createServerFn({ method: "POST" })
  .validator(z.object({ publicRef: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { getSupabaseAdmin } = await getServerDeps();
    const db = getSupabaseAdmin();

    const { data: bookingData, error } = await db
      .from("bookings")
      .select(
        "id, public_ref, customer_name, customer_email, amount, currency, status, question, created_at, services(name, delivery_text, slug), orders(id, status, gateway_txn_id, gateway_payment_id, amount)",
      )
      .eq("public_ref", data.publicRef)
      .single();

    if (error || !bookingData) {
      return { success: false as const, error: "Booking not found." };
    }

    type BookingRow = {
      id: string;
      public_ref: string;
      customer_name: string;
      customer_email: string;
      amount: number;
      currency: string;
      status: string;
      question: string | null;
      created_at: string;
      services: { name: string; delivery_text: string; slug: string } | null;
      orders: Array<{
        id: string;
        status: string;
        gateway_txn_id: string | null;
        gateway_payment_id: string | null;
        amount: number;
      }>;
    };

    const booking = bookingData as BookingRow;
    const latestOrder = booking.orders?.[0] ?? null;

    // If this booking's order is part of a multi-service group (shares a
    // gateway_txn_id with sibling orders), fetch the whole group so the
    // success page can list every service, not just this one.
    let groupServices: { name: string; amount: number; deliveryText: string }[] = [
      {
        name: booking.services?.name ?? "Astrology Reading",
        amount: Number(booking.amount),
        deliveryText: booking.services?.delivery_text ?? "3–5 business days",
      },
    ];
    let groupTotal = Number(booking.amount);

    if (latestOrder?.gateway_txn_id) {
      const { data: siblingOrders } = await db
        .from("orders")
        .select("booking_id")
        .eq("gateway_txn_id", latestOrder.gateway_txn_id);

      const siblingBookingIds =
        (siblingOrders as { booking_id: string }[] | null)?.map((o) => o.booking_id) ?? [];

      if (siblingBookingIds.length > 1) {
        const { data: siblingBookings } = await db
          .from("bookings")
          .select("amount, created_at, services(name, delivery_text)")
          .in("id", siblingBookingIds)
          .order("created_at", { ascending: true });

        const rows = (siblingBookings ?? []) as {
          amount: number;
          services: { name: string; delivery_text: string } | null;
        }[];

        if (rows.length > 0) {
          groupServices = rows.map((r) => ({
            name: r.services?.name ?? "Astrology Reading",
            amount: Number(r.amount),
            deliveryText: r.services?.delivery_text ?? "3–5 business days",
          }));
          groupTotal = groupServices.reduce((sum, s) => sum + s.amount, 0);
        }
      }
    }

    return {
      success: true as const,
      booking: {
        publicRef: booking.public_ref,
        customerName: booking.customer_name,
        customerEmail: booking.customer_email,
        amount: groupTotal,
        currency: booking.currency,
        status: booking.status,
        createdAt: booking.created_at,
        serviceName: booking.services?.name ?? "Astrology Reading",
        serviceSlug: booking.services?.slug ?? "",
        deliveryText: booking.services?.delivery_text ?? "3–5 business days",
        groupServices,
      },
      order: latestOrder
        ? {
            status: latestOrder.status,
            transactionId: latestOrder.gateway_txn_id,
            paymentId: latestOrder.gateway_payment_id,
          }
        : null,
    };
  });
