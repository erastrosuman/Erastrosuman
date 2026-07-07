import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Check if the requesting user is an admin.
 */
async function requireAdmin(authHeader?: string) {
  if (!authHeader) {
    throw new Error("Authentication required.");
  }

  const token = authHeader.replace("Bearer ", "");
  const { getSupabaseAdmin } = await import("../supabase.server");
  const db = getSupabaseAdmin();

  const {
    data: { user },
    error,
  } = await db.auth.getUser(token);

  if (error || !user) {
    throw new Error("Invalid or expired session.");
  }

  const { data: profileData } = await db
    .from("admin_profiles")
    .select("role, full_name")
    .eq("user_id", user.id)
    .single();

  if (!profileData) {
    throw new Error("Access denied — not an admin.");
  }

  const profile = profileData as { role: string; full_name: string };
  return { userId: user.id, role: profile.role, name: profile.full_name };
}

// ─── Admin Dashboard Stats ─────────────────────────────────

export const getAdminStats = createServerFn({ method: "POST" })
  .validator(z.object({ authToken: z.string() }))
  .handler(async ({ data }) => {
    await requireAdmin(`Bearer ${data.authToken}`);
    const { getSupabaseAdmin } = await import("../supabase.server");
    const db = getSupabaseAdmin();

    const [
      totalBookings,
      pendingBookings,
      paidBookings,
      completedBookings,
      failedOrders,
      contactMessages,
      unreadMessages,
      revenueResult,
      bookingsByService,
      recentBookingsResult,
    ] = await Promise.all([
      db.from("bookings").select("id", { count: "exact", head: true }),
      db
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending_payment"),
      db.from("bookings").select("id", { count: "exact", head: true }).eq("status", "paid"),
      db.from("bookings").select("id", { count: "exact", head: true }).eq("status", "completed"),
      db.from("orders").select("id", { count: "exact", head: true }).eq("status", "failure"),
      db.from("contact_messages").select("id", { count: "exact", head: true }),
      db.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
      db.from("orders").select("amount").eq("status", "success"),
      db
        .from("bookings")
        .select("services(name)")
        .in("status", ["paid", "processing", "completed"]),
      db
        .from("bookings")
        .select(
          "id, public_ref, customer_name, customer_email, amount, status, created_at, services(name)",
        )
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    // Calculate total revenue
    const revenueRows = (revenueResult.data ?? []) as Array<{ amount: number }>;
    const totalRevenue = revenueRows.reduce((sum, row) => sum + Number(row.amount), 0);

    // Count bookings by service
    const serviceCounts: Record<string, number> = {};
    const serviceRows = (bookingsByService.data ?? []) as Array<{
      services: { name: string } | null;
    }>;
    for (const row of serviceRows) {
      const name = row.services?.name ?? "Unknown";
      serviceCounts[name] = (serviceCounts[name] || 0) + 1;
    }

    // Map recent bookings
    const recentRows = (recentBookingsResult.data ?? []) as Array<{
      id: string;
      public_ref: string;
      customer_name: string;
      customer_email: string;
      amount: number;
      status: string;
      created_at: string;
      services: { name: string } | null;
    }>;

    return {
      success: true as const,
      stats: {
        totalBookings: totalBookings.count ?? 0,
        pendingBookings: pendingBookings.count ?? 0,
        paidBookings: paidBookings.count ?? 0,
        completedBookings: completedBookings.count ?? 0,
        failedOrders: failedOrders.count ?? 0,
        totalContactMessages: contactMessages.count ?? 0,
        unreadMessages: unreadMessages.count ?? 0,
        totalRevenue,
        bookingsByService: serviceCounts,
      },
      recentBookings: recentRows.map((b) => ({
        id: b.id,
        publicRef: b.public_ref,
        customerName: b.customer_name,
        customerEmail: b.customer_email,
        amount: Number(b.amount),
        status: b.status,
        createdAt: b.created_at,
        serviceName: b.services?.name ?? "Unknown",
      })),
    };
  });

// ─── Update Site Settings ───────────────────────────────────

export const updateSiteSettings = createServerFn({ method: "POST" })
  .validator(
    z.object({
      authToken: z.string(),
      settings: z.array(z.object({ key: z.string(), value: z.unknown() })),
    }),
  )
  .handler(async ({ data }) => {
    const admin = await requireAdmin(`Bearer ${data.authToken}`);
    const { getSupabaseAdmin } = await import("../supabase.server");
    const db = getSupabaseAdmin();

    for (const setting of data.settings) {
      await db
        .from("site_settings")
        .upsert({ key: setting.key, value: setting.value }, { onConflict: "key" });
    }

    await db.from("audit_logs").insert({
      actor_user_id: admin.userId,
      action: "site_settings_updated",
      entity_type: "site_settings",
      details: { keys: data.settings.map((s) => s.key) },
    });

    return { success: true as const };
  });

// ─── Update Booking Status ──────────────────────────────────

export const updateBookingStatus = createServerFn({ method: "POST" })
  .validator(
    z.object({
      authToken: z.string(),
      bookingId: z.string().uuid(),
      status: z.enum(["processing", "completed", "cancelled"]),
      notes: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const admin = await requireAdmin(`Bearer ${data.authToken}`);
    const { getSupabaseAdmin } = await import("../supabase.server");
    const db = getSupabaseAdmin();

    const updateFields: { status: (typeof data)["status"]; notes?: string } = {
      status: data.status,
    };
    if (data.notes !== undefined) updateFields.notes = data.notes;

    const { error } = await db.from("bookings").update(updateFields).eq("id", data.bookingId);

    if (error) {
      throw new Error("Failed to update booking status.");
    }

    await db.from("audit_logs").insert({
      actor_user_id: admin.userId,
      action: "booking_status_updated",
      entity_type: "bookings",
      entity_id: data.bookingId,
      details: { newStatus: data.status, notes: data.notes },
    });

    return { success: true as const };
  });

// ─── Update Contact Message Status ──────────────────────────

export const updateContactStatus = createServerFn({ method: "POST" })
  .validator(
    z.object({
      authToken: z.string(),
      messageId: z.string().uuid(),
      status: z.enum(["read", "replied", "closed"]),
    }),
  )
  .handler(async ({ data }) => {
    const admin = await requireAdmin(`Bearer ${data.authToken}`);
    const { getSupabaseAdmin } = await import("../supabase.server");
    const db = getSupabaseAdmin();

    const { error } = await db
      .from("contact_messages")
      .update({ status: data.status as "read" | "replied" | "closed" })
      .eq("id", data.messageId);

    if (error) {
      throw new Error("Failed to update message status.");
    }

    await db.from("audit_logs").insert({
      actor_user_id: admin.userId,
      action: "contact_status_updated",
      entity_type: "contact_messages",
      entity_id: data.messageId,
      details: { newStatus: data.status },
    });

    return { success: true as const };
  });
