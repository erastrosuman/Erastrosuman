import { createServerFn } from "@tanstack/react-start";
import { randomBytes } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { bookingFormSchema } from "../validations";

/**
 * Generate a unique public booking reference.
 * Format: AS-XXXXXX (6 alphanumeric characters)
 * Uses crypto.getRandomValues for cryptographic randomness.
 */
function generatePublicRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  const bytes = randomBytes(6);
  let ref = "AS-";
  for (let i = 0; i < 6; i++) {
    ref += chars[bytes[i] % chars.length];
  }
  return ref;
}

async function generateUniquePublicRef(db: SupabaseClient<Database>): Promise<string> {
  let publicRef = generatePublicRef();
  let attempts = 0;
  while (attempts < 5) {
    const { data: existing } = await db
      .from("bookings")
      .select("id")
      .eq("public_ref", publicRef)
      .maybeSingle();
    if (!existing) return publicRef;
    publicRef = generatePublicRef();
    attempts++;
  }
  throw new Error("Could not generate a unique booking reference. Please try again.");
}

/**
 * Create one or more bookings from a single checkout — one booking + one
 * order row per selected service, all sharing the same customer/birth
 * details. They stay separate rows (each service still gets its own
 * hand-written report), but are paid for together as a single Cashfree
 * charge: `createCashfreeOrder` and `verifyCashfreePayment` link them by
 * stamping the same `gateway_txn_id` across every order in the group.
 *
 * 1. Validates input
 * 2. Looks up all requested services by slug (verifies each exists & is active)
 * 3. Creates one booking + one order row per service
 * 4. Returns the whole group for payment initiation
 */
export const createBooking = createServerFn({ method: "POST" })
  .validator(bookingFormSchema)
  .handler(async ({ data }) => {
    const { getSupabaseAdmin } = await import("../supabase.server");
    const db = getSupabaseAdmin();

    const slugs = [...new Set(data.serviceSlugs)];

    // 1. Look up all requested services in one query
    const { data: serviceRows, error: svcError } = await db
      .from("services")
      .select("id, slug, name, price, delivery_text")
      .in("slug", slugs)
      .eq("active", true);

    if (svcError) {
      console.error("[booking] Service lookup failed:", svcError);
      throw new Error("Could not verify the selected readings. Please try again.");
    }

    const foundServices = (serviceRows ?? []) as {
      id: string;
      slug: string;
      name: string;
      price: number;
      delivery_text: string;
    }[];

    if (foundServices.length !== slugs.length) {
      const foundSlugs = new Set(foundServices.map((s) => s.slug));
      const missing = slugs.filter((s) => !foundSlugs.has(s));
      throw new Error(
        `${missing.length > 1 ? "Some of the selected readings are" : "One of the selected readings is"} no longer available. Please review your selection.`,
      );
    }

    // Preserve the order the user picked them in
    const orderedServices = slugs
      .map((slug) => foundServices.find((s) => s.slug === slug))
      .filter((s): s is (typeof foundServices)[number] => !!s);

    // 2. Create one booking + one order per service. Track everything
    // created so we can roll back cleanly if a later insert fails partway
    // through — we never want to leave the customer with some services
    // booked and others silently dropped.
    const created: {
      bookingId: string;
      orderId: string;
      publicRef: string;
      serviceName: string;
      amount: number;
      deliveryText: string;
    }[] = [];

    try {
      for (const service of orderedServices) {
        const publicRef = await generateUniquePublicRef(db);

        const { data: bookingData, error: bookingError } = await db
          .from("bookings")
          .insert({
            public_ref: publicRef,
            service_id: service.id,
            customer_name: data.name,
            customer_email: data.email,
            customer_phone: data.phone,
            date_of_birth: data.dateOfBirth,
            birth_time: data.birthTime,
            birth_place: data.birthPlace,
            question: data.question || null,
            status: "pending_payment" as const,
            amount: service.price,
            currency: "INR",
          })
          .select("id, public_ref, amount")
          .single();

        if (bookingError || !bookingData) {
          console.error("[booking] Insert failed:", bookingError);
          throw new Error("Failed to create booking. Please try again.");
        }

        const booking = bookingData as { id: string; public_ref: string; amount: number };

        const { data: orderData, error: orderError } = await db
          .from("orders")
          .insert({
            booking_id: booking.id,
            gateway: "cashfree",
            amount: service.price,
            status: "created" as const,
          })
          .select("id")
          .single();

        if (orderError || !orderData) {
          console.error("[booking] Order insert failed:", orderError);
          throw new Error("Failed to create order. Please try again.");
        }

        created.push({
          bookingId: booking.id,
          orderId: (orderData as { id: string }).id,
          publicRef: booking.public_ref,
          serviceName: service.name,
          amount: Number(service.price),
          deliveryText: service.delivery_text,
        });
      }
    } catch (err) {
      // Roll back anything we already inserted for this attempt so a
      // partial failure doesn't leave orphaned pending bookings behind.
      if (created.length > 0) {
        const bookingIds = created.map((c) => c.bookingId);
        await db.from("orders").delete().in("booking_id", bookingIds);
        await db.from("bookings").delete().in("id", bookingIds);
      }
      throw err;
    }

    const totalAmount = created.reduce((sum, c) => sum + c.amount, 0);

    // 3. Audit log — one entry summarizing the whole group
    const { error: auditError } = await db.from("audit_logs").insert({
      action: "booking_created",
      entity_type: "bookings",
      entity_id: created[0].bookingId,
      details: {
        groupRef: created[0].publicRef,
        services: created.map((c) => c.serviceName),
        email: data.email,
        totalAmount,
      },
    });
    if (auditError) {
      console.error("[booking] Audit log failed:", auditError);
    }

    return {
      success: true as const,
      groupRef: created[0].publicRef,
      totalAmount,
      bookings: created,
      customerName: data.name,
      customerEmail: data.email,
    };
  });
