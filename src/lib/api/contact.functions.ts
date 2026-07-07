import { createServerFn } from "@tanstack/react-start";
import { contactAdminNotification, contactAutoReply } from "../email/templates";
import { contactFormSchema } from "../validations";

/**
 * Submit a contact message.
 *
 * 1. Validates input
 * 2. Inserts into contact_messages table
 * 3. Sends admin notification email
 * 4. Sends auto-reply to user
 * 5. Logs to audit_logs
 */
export const submitContactMessage = createServerFn({ method: "POST" })
  .validator(contactFormSchema)
  .handler(async ({ data }) => {
    const { getSupabaseAdmin } = await import("../supabase.server");
    const { sendEmail } = await import("../email/send-email.server");
    const { getServerConfig } = await import("../config.server");
    const db = getSupabaseAdmin();
    const config = getServerConfig();

    // 0. Rate limiting: max 5 messages per email per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: recentCount, error: countError } = await db
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("email", data.email)
      .gte("created_at", oneHourAgo);

    if (!countError && recentCount !== null && recentCount >= 5) {
      throw new Error(
        "You've sent several messages recently. Please wait a while before sending another.",
      );
    }

    // 1. Insert contact message
    const { data: message, error: insertError } = await db
      .from("contact_messages")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        topic: data.topic,
        message: data.message,
        status: "new" as const,
      })
      .select("id")
      .single();

    if (insertError || !message) {
      console.error("[contact] Insert failed:", insertError);
      throw new Error("Failed to save your message. Please try again.");
    }

    const messageId = (message as { id: string }).id;

    const emailErrors: string[] = [];

    // 2. Send admin notification
    const adminEmail = config.adminEmail || "Erssuman18@gmail.com";
    try {
      const adminEmailResult = await sendEmail({
        to: adminEmail,
        subject: `New contact: ${data.topic} — ${data.name}`,
        html: contactAdminNotification(data),
        replyTo: data.email,
      });
      if (!adminEmailResult.success) {
        console.error("[contact] Admin email failed:", adminEmailResult.error);
        emailErrors.push(`Admin notification: ${adminEmailResult.error}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[contact] Admin email exception:", msg);
      emailErrors.push(`Admin notification: ${msg}`);
    }

    // 3. Send auto-reply to user
    try {
      const replyResult = await sendEmail({
        to: data.email,
        subject: "We received your message — SudnadiAstro",
        html: contactAutoReply({ name: data.name }),
      });
      if (!replyResult.success) {
        console.error("[contact] Auto-reply failed:", replyResult.error);
        emailErrors.push(`Auto-reply: ${replyResult.error}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[contact] Auto-reply exception:", msg);
      emailErrors.push(`Auto-reply: ${msg}`);
    }

    // 4. Audit log
    const { error: auditError } = await db.from("audit_logs")
      .insert({
        action: "contact_message_created",
        entity_type: "contact_messages",
        entity_id: messageId,
        details: {
          name: data.name,
          email: data.email,
          topic: data.topic,
          emailErrors: emailErrors.length > 0 ? emailErrors : undefined,
        },
      });
    if (auditError) {
      console.error("[contact] Audit log failed:", auditError);
    }

    return {
      success: true as const,
      messageId,
      emailWarnings: emailErrors.length > 0 ? emailErrors : undefined,
    };
  });
