/**
 * Cashfree Payment Gateway utilities.
 * Server-only — never import from client code.
 *
 * Uses Cashfree PG API v2025-01-01.
 * Docs: https://www.cashfree.com/docs/api-reference/payments/latest/orders/create
 */

// ─── Config ─────────────────────────────────────────────────

export interface CashfreeConfig {
  appId: string;
  secretKey: string;
  mode: "sandbox" | "production";
}

export function getCashfreeConfig(): CashfreeConfig {
  const appId =
    process.env.CASHFREE_APP_ID || import.meta.env.CASHFREE_APP_ID;
  const secretKey =
    process.env.CASHFREE_SECRET_KEY || import.meta.env.CASHFREE_SECRET_KEY;
  const mode = (process.env.CASHFREE_MODE ||
    import.meta.env.CASHFREE_MODE ||
    "sandbox") as "sandbox" | "production";

  if (!appId || !secretKey) {
    const missing: string[] = [];
    if (!appId) missing.push("CASHFREE_APP_ID");
    if (!secretKey) missing.push("CASHFREE_SECRET_KEY");
    throw new Error(
      `[cashfree] Missing required environment variable(s): ${missing.join(", ")}. ` +
        "Set them in your .env file and in your Vercel project settings. " +
        "Without these, payment creation will fail.",
    );
  }

  return { appId, secretKey, mode };
}

// ─── URLs ───────────────────────────────────────────────────

const CASHFREE_URLS = {
  sandbox: "https://sandbox.cashfree.com/pg",
  production: "https://api.cashfree.com/pg",
} as const;

export function getCashfreeBaseUrl(mode: "sandbox" | "production"): string {
  return CASHFREE_URLS[mode];
}

// ─── API Version ────────────────────────────────────────────

const CF_API_VERSION = "2025-01-01";

// ─── Create Order ───────────────────────────────────────────

export interface CreateCashfreeOrderParams {
  orderId: string;
  orderAmount: number;
  orderCurrency?: string;
  customerDetails: {
    customerId: string;
    customerEmail: string;
    customerPhone: string;
    customerName: string;
  };
  returnUrl: string;
  notifyUrl?: string;
  orderNote?: string;
  orderTags?: Record<string, string>;
}

export interface CashfreeOrderResponse {
  cf_order_id: string;
  order_id: string;
  payment_session_id: string;
  order_status: string;
  order_amount: number;
  order_currency: string;
  order_expiry_time: string;
  created_at: string;
}

/**
 * Create an order via the Cashfree PG API.
 *
 * Returns the `payment_session_id` which is used by the frontend
 * Cashfree JS SDK to launch the checkout experience.
 */
export async function createCashfreeOrderApi(
  config: CashfreeConfig,
  params: CreateCashfreeOrderParams,
): Promise<CashfreeOrderResponse> {
  const baseUrl = getCashfreeBaseUrl(config.mode);

  const body: Record<string, unknown> = {
    order_id: params.orderId,
    order_amount: params.orderAmount,
    order_currency: params.orderCurrency ?? "INR",
    customer_details: {
      customer_id: params.customerDetails.customerId,
      customer_email: params.customerDetails.customerEmail,
      customer_phone: params.customerDetails.customerPhone,
      customer_name: params.customerDetails.customerName,
    },
    order_meta: {
      return_url:
        params.returnUrl +
        "?order_id={order_id}",
      ...(params.notifyUrl ? { notify_url: params.notifyUrl } : {}),
    },
  };

  if (params.orderNote) {
    body.order_note = params.orderNote;
  }

  if (params.orderTags) {
    body.order_tags = params.orderTags;
  }

  const response = await fetch(`${baseUrl}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-version": CF_API_VERSION,
      "x-client-id": config.appId,
      "x-client-secret": config.secretKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      "[cashfree] Create order failed:",
      response.status,
      errorBody,
    );
    throw new Error(
      `Cashfree order creation failed (HTTP ${response.status}): ${errorBody}`,
    );
  }

  return (await response.json()) as CashfreeOrderResponse;
}

// ─── Verify Order ───────────────────────────────────────────

export interface CashfreeOrderStatusResponse {
  cf_order_id: string;
  order_id: string;
  order_status: "ACTIVE" | "PAID" | "EXPIRED" | "TERMINATED" | "TERMINATION_REQUESTED";
  order_amount: number;
  order_currency: string;
  payment_session_id: string;
  created_at: string;
}

/**
 * Fetch order details from Cashfree to verify payment status.
 *
 * After the customer completes payment on Cashfree's checkout, they are
 * redirected to our `return_url`. We then call this API to confirm that
 * the order is actually PAID — never trust the frontend redirect alone.
 */
export async function verifyCashfreeOrderApi(
  config: CashfreeConfig,
  orderId: string,
): Promise<CashfreeOrderStatusResponse> {
  const baseUrl = getCashfreeBaseUrl(config.mode);

  const response = await fetch(`${baseUrl}/orders/${orderId}`, {
    method: "GET",
    headers: {
      "x-api-version": CF_API_VERSION,
      "x-client-id": config.appId,
      "x-client-secret": config.secretKey,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      "[cashfree] Verify order failed:",
      response.status,
      errorBody,
    );
    throw new Error(
      `Cashfree order verification failed (HTTP ${response.status}): ${errorBody}`,
    );
  }

  return (await response.json()) as CashfreeOrderStatusResponse;
}

// ─── Get Payments for an Order ──────────────────────────────

export interface CashfreePaymentEntity {
  cf_payment_id: string;
  order_id: string;
  payment_status: "SUCCESS" | "FAILED" | "USER_DROPPED" | "PENDING" | "CANCELLED" | "VOID" | "NOT_ATTEMPTED";
  payment_amount: number;
  payment_currency: string;
  payment_time: string;
  payment_completion_time?: string;
  payment_message: string;
  bank_reference?: string;
  payment_method: Record<string, unknown>;
  payment_group: string;
  error_details?: {
    error_code: string;
    error_description: string;
    error_reason: string;
    error_source: string;
  };
}

/**
 * Fetch all payments for an order.
 * Useful to get the `cf_payment_id` and detailed payment status.
 */
export async function getPaymentsForOrderApi(
  config: CashfreeConfig,
  orderId: string,
): Promise<CashfreePaymentEntity[]> {
  const baseUrl = getCashfreeBaseUrl(config.mode);

  const response = await fetch(`${baseUrl}/orders/${orderId}/payments`, {
    method: "GET",
    headers: {
      "x-api-version": CF_API_VERSION,
      "x-client-id": config.appId,
      "x-client-secret": config.secretKey,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      "[cashfree] Get payments failed:",
      response.status,
      errorBody,
    );
    throw new Error(
      `Cashfree get payments failed (HTTP ${response.status}): ${errorBody}`,
    );
  }

  return (await response.json()) as CashfreePaymentEntity[];
}
