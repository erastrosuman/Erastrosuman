// Server-only config. The .server.ts suffix prevents Vite from bundling
// this file into the client — values here never reach the browser.
//
// On Cloudflare Workers, env binds at REQUEST time. Module-scope reads
// (e.g. `const x = import.meta.env.X`) resolve to undefined — always read
// process.env INSIDE a function or handler.
//
// When to use which env-access pattern:
//   - .server.ts module (this file): server-only helpers reused across
//     handlers. Wrap reads in a function so they run per-request.
//   - inline process.env inside a createServerFn handler: one-off reads
//     not reused elsewhere.
//   - import.meta.env.VITE_FOO: PUBLIC config readable from both client
//     and server (analytics IDs, public URLs). Define in .env with the
//     VITE_ prefix. Never put secrets here — they ship to the browser.

export function getServerConfig() {
  const nodeEnv = process.env.NODE_ENV || import.meta.env.NODE_ENV;
  const isProduction = nodeEnv === "production";

  // Supabase
  const supabaseUrl = (process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || "").trim();
  const supabaseServiceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

  // Cashfree Payment Gateway
  const cashfreeAppId = (process.env.CASHFREE_APP_ID || import.meta.env.CASHFREE_APP_ID || "").trim();
  const cashfreeSecretKey = (process.env.CASHFREE_SECRET_KEY || import.meta.env.CASHFREE_SECRET_KEY || "").trim();
  const cashfreeMode = ((process.env.CASHFREE_MODE || import.meta.env.CASHFREE_MODE || "sandbox") as string).trim() as "sandbox" | "production";

  // Email (Resend)
  const resendApiKey = (process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY || "").trim();

  // App
  const appUrl = (process.env.APP_URL || import.meta.env.APP_URL || "").trim().replace(/\/+$/, "");
  const adminEmail = (process.env.ADMIN_EMAIL || import.meta.env.ADMIN_EMAIL || "").trim();
  const supportEmail = (process.env.SUPPORT_EMAIL || import.meta.env.SUPPORT_EMAIL || "").trim();

  // Validate critical config in production
  const errors: string[] = [];

  if (!appUrl) {
    errors.push("APP_URL is not set. Cashfree callbacks will fail — payments will succeed but your server will never know.");
  } else if (appUrl.includes("localhost") && isProduction) {
    errors.push(`APP_URL is "${appUrl}" — Cashfree callbacks will go to localhost instead of your production server.`);
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    errors.push("VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. Database operations will crash.");
  }

  if (!cashfreeAppId || !cashfreeSecretKey) {
    errors.push("CASHFREE_APP_ID or CASHFREE_SECRET_KEY is not set. Payment creation will crash.");
  }

  if (!resendApiKey) {
    errors.push("RESEND_API_KEY is not set. Emails will silently fail.");
  }

  if (errors.length > 0) {
    const prefix = isProduction ? "[config] CRITICAL" : "[config] WARNING";
    for (const err of errors) {
      console.error(`${prefix}: ${err}`);
    }
    // In production, crash immediately rather than silently failing
    if (isProduction) {
      throw new Error(
        `[config] Missing required environment variables for production:\n${errors.join("\n")}`
      );
    }
  }

  return {
    nodeEnv,
    supabaseUrl,
    supabaseServiceRoleKey,
    cashfreeAppId,
    cashfreeSecretKey,
    cashfreeMode,
    resendApiKey,
    appUrl,
    adminEmail,
    supportEmail,
  };
}
