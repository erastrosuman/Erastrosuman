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

// ─── List Services (admin — includes inactive) ──────────────

export const listServicesAdmin = createServerFn({ method: "POST" })
  .validator(z.object({ authToken: z.string() }))
  .handler(async ({ data }) => {
    await requireAdmin(`Bearer ${data.authToken}`);
    const { getSupabaseAdmin } = await import("../supabase.server");
    const db = getSupabaseAdmin();
    const { data: rows, error } = await db
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error("Failed to fetch services.");
    return { success: true as const, services: rows ?? [] };
  });

export const createService = createServerFn({ method: "POST" })
  .validator(
    z.object({
      authToken: z.string(),
      service: z.object({
        slug: z.string().min(1),
        name: z.string().min(1),
        price: z.number(),
        category: z.string().default("personal"),
        tagline: z.string().default(""),
        description: z.string().default(""),
        delivery_text: z.string().default(""),
        image_url: z.string().nullable().optional(),
        covers: z.array(z.string()).default([]),
        receive: z.array(z.string()).default([]),
        faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
        active: z.boolean().default(true),
        sort_order: z.number().default(0),
        seo_title: z.string().nullable().optional(),
        seo_description: z.string().nullable().optional(),
      }),
    }),
  )
  .handler(async ({ data }) => {
    const admin = await requireAdmin(`Bearer ${data.authToken}`);
    const { getSupabaseAdmin } = await import("../supabase.server");
    const db = getSupabaseAdmin();
    const { data: row, error } = await db.from("services").insert(data.service).select().single();
    if (error) throw new Error(`Failed to create service: ${error.message}`);
    await db.from("audit_logs").insert({
      actor_user_id: admin.userId,
      action: "service_created",
      entity_type: "services",
      entity_id: row.id,
      details: { slug: row.slug, name: row.name },
    });
    return { success: true as const, service: row };
  });

export const updateService = createServerFn({ method: "POST" })
  .validator(
    z.object({
      authToken: z.string(),
      id: z.string().uuid(),
      updates: z.object({
        slug: z.string().min(1).optional(),
        name: z.string().min(1).optional(),
        price: z.number().optional(),
        category: z.string().optional(),
        tagline: z.string().optional(),
        description: z.string().optional(),
        delivery_text: z.string().optional(),
        image_url: z.string().nullable().optional(),
        covers: z.array(z.string()).optional(),
        receive: z.array(z.string()).optional(),
        faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
        active: z.boolean().optional(),
        sort_order: z.number().optional(),
        seo_title: z.string().nullable().optional(),
        seo_description: z.string().nullable().optional(),
      }),
    }),
  )
  .handler(async ({ data }) => {
    const admin = await requireAdmin(`Bearer ${data.authToken}`);
    const { getSupabaseAdmin } = await import("../supabase.server");
    const db = getSupabaseAdmin();
    const { error } = await db.from("services").update(data.updates).eq("id", data.id);
    if (error) throw new Error(`Failed to update service: ${error.message}`);
    await db.from("audit_logs").insert({
      actor_user_id: admin.userId,
      action: "service_updated",
      entity_type: "services",
      entity_id: data.id,
      details: { fields: Object.keys(data.updates) },
    });
    return { success: true as const };
  });

export const deleteService = createServerFn({ method: "POST" })
  .validator(z.object({ authToken: z.string(), id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const admin = await requireAdmin(`Bearer ${data.authToken}`);
    const { getSupabaseAdmin } = await import("../supabase.server");
    const db = getSupabaseAdmin();
    const { error } = await db.from("services").update({ active: false }).eq("id", data.id);
    if (error) throw new Error(`Failed to delete service: ${error.message}`);
    await db.from("audit_logs").insert({
      actor_user_id: admin.userId,
      action: "service_deleted",
      entity_type: "services",
      entity_id: data.id,
      details: { method: "soft_delete" },
    });
    return { success: true as const };
  });

export const reorderServices = createServerFn({ method: "POST" })
  .validator(
    z.object({
      authToken: z.string(),
      order: z.array(z.object({ id: z.string().uuid(), sort_order: z.number() })),
    }),
  )
  .handler(async ({ data }) => {
    const admin = await requireAdmin(`Bearer ${data.authToken}`);
    const { getSupabaseAdmin } = await import("../supabase.server");
    const db = getSupabaseAdmin();
    await Promise.all(
      data.order.map(({ id, sort_order }) =>
        db.from("services").update({ sort_order }).eq("id", id),
      ),
    );
    await db.from("audit_logs").insert({
      actor_user_id: admin.userId,
      action: "services_reordered",
      entity_type: "services",
      details: { count: data.order.length },
    });
    return { success: true as const };
  });

export const duplicateService = createServerFn({ method: "POST" })
  .validator(z.object({ authToken: z.string(), id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const admin = await requireAdmin(`Bearer ${data.authToken}`);
    const { getSupabaseAdmin } = await import("../supabase.server");
    const db = getSupabaseAdmin();
    const { data: original, error: fetchError } = await db
      .from("services").select("*").eq("id", data.id).single();
    if (fetchError || !original) throw new Error("Service not found.");
    const { id: _id, created_at: _ca, updated_at: _ua, ...rest } = original;
    const copy = { ...rest, slug: `${original.slug}-copy`, name: `${original.name} (Copy)`, active: false };
    const { data: newRow, error: insertError } = await db.from("services").insert(copy).select().single();
    if (insertError) throw new Error(`Failed to duplicate: ${insertError.message}`);
    await db.from("audit_logs").insert({
      actor_user_id: admin.userId,
      action: "service_duplicated",
      entity_type: "services",
      entity_id: newRow.id,
      details: { originalId: data.id, newSlug: copy.slug },
    });
    return { success: true as const, service: newRow };
  });

// ─── Upload Image ────────────────────────────────────────────

export const uploadImage = createServerFn({ method: "POST" })
  .validator(
    z.object({
      authToken: z.string(),
      bucket: z.enum(["service-images", "blog-images"]),
      fileName: z.string().min(1),
      base64: z.string().min(1),
      contentType: z.string().default("image/jpeg"),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin(`Bearer ${data.authToken}`);
    const { getSupabaseAdmin } = await import("../supabase.server");
    const db = getSupabaseAdmin();
    const base64Data = data.base64.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const path = `${Date.now()}-${data.fileName}`;
    const { error } = await db.storage
      .from(data.bucket)
      .upload(path, buffer, { contentType: data.contentType, upsert: false });
    if (error) throw new Error(`Upload failed: ${error.message}`);
    const { data: urlData } = db.storage.from(data.bucket).getPublicUrl(path);
    return { success: true as const, publicUrl: urlData.publicUrl };
  });

// ─── Blog Post Admin Functions ──────────────────────────────

export const listBlogPostsAdmin = createServerFn({ method: "POST" })
  .validator(z.object({ authToken: z.string() }))
  .handler(async ({ data }) => {
    await requireAdmin(`Bearer ${data.authToken}`);
    const { getSupabaseAdmin } = await import("../supabase.server");
    const db = getSupabaseAdmin();
    const { data: rows, error } = await db
      .from("blog_posts").select("*").order("created_at", { ascending: false });
    if (error) throw new Error("Failed to fetch blog posts.");
    return { success: true as const, posts: rows ?? [] };
  });

export const createBlogPost = createServerFn({ method: "POST" })
  .validator(
    z.object({
      authToken: z.string(),
      post: z.object({
        slug: z.string().min(1),
        title: z.string().min(1),
        category: z.string().default(""),
        excerpt: z.string().default(""),
        body: z.string().default(""),
        read_time: z.number().default(5),
        published: z.boolean().default(false),
        published_at: z.string().nullable().optional(),
        hero_image_url: z.string().nullable().optional(),
        seo_title: z.string().nullable().optional(),
        seo_description: z.string().nullable().optional(),
      }),
    }),
  )
  .handler(async ({ data }) => {
    const admin = await requireAdmin(`Bearer ${data.authToken}`);
    const { getSupabaseAdmin } = await import("../supabase.server");
    const db = getSupabaseAdmin();
    const { data: row, error } = await db.from("blog_posts").insert(data.post).select().single();
    if (error) throw new Error(`Failed to create post: ${error.message}`);
    await db.from("audit_logs").insert({
      actor_user_id: admin.userId,
      action: "blog_post_created",
      entity_type: "blog_posts",
      entity_id: row.id,
      details: { slug: row.slug, title: row.title },
    });
    return { success: true as const, post: row };
  });

export const updateBlogPost = createServerFn({ method: "POST" })
  .validator(
    z.object({
      authToken: z.string(),
      id: z.string().uuid(),
      updates: z.object({
        slug: z.string().min(1).optional(),
        title: z.string().min(1).optional(),
        category: z.string().optional(),
        excerpt: z.string().optional(),
        body: z.string().optional(),
        read_time: z.number().optional(),
        published: z.boolean().optional(),
        published_at: z.string().nullable().optional(),
        hero_image_url: z.string().nullable().optional(),
        seo_title: z.string().nullable().optional(),
        seo_description: z.string().nullable().optional(),
      }),
    }),
  )
  .handler(async ({ data }) => {
    const admin = await requireAdmin(`Bearer ${data.authToken}`);
    const { getSupabaseAdmin } = await import("../supabase.server");
    const db = getSupabaseAdmin();
    const { error } = await db.from("blog_posts").update(data.updates).eq("id", data.id);
    if (error) throw new Error(`Failed to update post: ${error.message}`);
    await db.from("audit_logs").insert({
      actor_user_id: admin.userId,
      action: "blog_post_updated",
      entity_type: "blog_posts",
      entity_id: data.id,
      details: { fields: Object.keys(data.updates) },
    });
    return { success: true as const };
  });

export const deleteBlogPost = createServerFn({ method: "POST" })
  .validator(z.object({ authToken: z.string(), id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const admin = await requireAdmin(`Bearer ${data.authToken}`);
    const { getSupabaseAdmin } = await import("../supabase.server");
    const db = getSupabaseAdmin();
    const { error } = await db.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(`Failed to delete post: ${error.message}`);
    await db.from("audit_logs").insert({
      actor_user_id: admin.userId,
      action: "blog_post_deleted",
      entity_type: "blog_posts",
      entity_id: data.id,
      details: null,
    });
    return { success: true as const };
  });

export const publishBlogPost = createServerFn({ method: "POST" })
  .validator(z.object({ authToken: z.string(), id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const admin = await requireAdmin(`Bearer ${data.authToken}`);
    const { getSupabaseAdmin } = await import("../supabase.server");
    const db = getSupabaseAdmin();
    const { data: current } = await db
      .from("blog_posts").select("published_at").eq("id", data.id).single();
    const updates = {
      published: true,
      published_at: current?.published_at ?? new Date().toISOString(),
    };
    const { error } = await db.from("blog_posts").update(updates).eq("id", data.id);
    if (error) throw new Error(`Failed to publish post: ${error.message}`);
    await db.from("audit_logs").insert({
      actor_user_id: admin.userId,
      action: "blog_post_published",
      entity_type: "blog_posts",
      entity_id: data.id,
      details: { published_at: updates.published_at },
    });
    return { success: true as const };
  });
