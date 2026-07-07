

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Send a transactional email via Resend.
 *
 * Server-only — the `.server.ts` suffix keeps the API key out of the
 * client bundle. Falls back gracefully if RESEND_API_KEY is missing
 * (logs a warning instead of crashing).
 *
 * The sender domain MUST be verified in Resend. If you see:
 *   "The domain ... is not verified"
 * Go to https://resend.com/domains and complete DNS verification.
 */
export async function sendEmail(opts: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || import.meta.env.FROM_EMAIL || "noreply@sudnadiastro.com";
  const fromName = process.env.FROM_NAME || import.meta.env.FROM_NAME || "SudnadiAstro";

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — email not sent:", opts.subject);
    return { success: false, error: "RESEND_API_KEY not configured. Set it in your .env and Vercel project settings." };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: Array.isArray(opts.to) ? opts.to : [opts.to],
        subject: opts.subject,
        html: opts.html,
        reply_to: opts.replyTo,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("[email] Resend API error:", res.status, errorBody);

      // Provide actionable error messages for common issues
      if (res.status === 403 && errorBody.includes("not verified")) {
        return {
          success: false,
          error: `Domain verification failed. "${fromEmail}" domain is not verified in Resend. Go to https://resend.com/domains to verify.`,
        };
      }

      if (res.status === 422) {
        return {
          success: false,
          error: `Invalid email parameters (422): ${errorBody}. Check that "${fromEmail}" is a valid sender address.`,
        };
      }

      return { success: false, error: `Resend API ${res.status}: ${errorBody}` };
    }

    const data = (await res.json()) as { id: string };
    return { success: true, id: data.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] Send failed:", message);
    return { success: false, error: message };
  }
}
