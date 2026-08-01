import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { z } from "zod";

/**
 * Cashfree callback route.
 *
 * Cashfree redirects the browser here via `return_url` after the customer
 * finishes (or abandons) the Drop-in checkout. The return_url was created
 * with a `?order_id={order_id}` template that Cashfree fills in with the
 * order id we gave it at order-creation time.
 *
 * We NEVER trust the redirect alone — the actual payment status is fetched
 * server-side from Cashfree's `GET /orders/{order_id}` API.
 *
 * Flow:
 *   User pays on Cashfree → Cashfree redirects to
 *   /api/cashfree-callback?order_id=...
 *   → This page renders a "Verifying..." spinner
 *   → useEffect fires verifyCashfreePayment server function
 *   → On result, we navigate to /order-success or /order-failure
 */

// ─── Server function for verification ───────────────────────

const processCashfreeCallbackServer = createServerFn({ method: "POST" })
  .validator(z.object({ orderId: z.string().min(1) }))
  .handler(async ({ data }) => {
    // Dynamically import to keep server-only deps out of client bundle
    const { verifyCashfreePayment } = await import("@/lib/api/payment.functions");

    try {
      const result = await verifyCashfreePayment({
        data: { orderId: data.orderId },
      });

      return {
        success: true as const,
        paymentStatus: result.paymentStatus,
        publicRef: result.publicRef,
        alreadyProcessed: result.status === "already_processed",
      };
    } catch (err) {
      console.error("[cashfree-callback] Server verification failed:", err);
      return {
        success: false as const,
        publicRef: "",
        error: err instanceof Error ? err.message : "Verification failed",
      };
    }
  });

// ─── Route definition ───────────────────────────────────────

const callbackSearch = z
  .object({
    order_id: z.string().optional(),
    order_token: z.string().optional(),
  })
  .passthrough();

export const Route = createFileRoute("/api/cashfree-callback")({
  validateSearch: callbackSearch,
  head: () => ({
    meta: [
      { title: "Processing payment — SudnadiAstro" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CashfreeCallbackPage,
});

function CashfreeCallbackPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [error, setError] = useState<string | null>(null);
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    // Prevent double-processing
    if (processed) return;

    // If we have no order id in the URL, there's nothing to verify
    if (!search.order_id) {
      navigate({ to: "/", replace: true });
      return;
    }

    let cancelled = false;

    async function processCallback() {
      try {
        const result = await processCashfreeCallbackServer({
          data: { orderId: search.order_id! },
        });

        if (cancelled) return;
        setProcessed(true);

        if (
          result.success &&
          result.paymentStatus === "success"
        ) {
          navigate({
            to: "/order-success",
            search: { ref: result.publicRef },
            replace: true,
          });
        } else if (result.success) {
          navigate({
            to: "/order-failure",
            search: { ref: result.publicRef },
            replace: true,
          });
        } else {
          // Verification failed
          setError(result.error || "Payment verification failed.");
          setTimeout(() => {
            if (!cancelled) {
              navigate({
                to: "/order-failure",
                search: { ref: "", error: "verification_failed" },
                replace: true,
              });
            }
          }, 2000);
        }
      } catch (err) {
        if (cancelled) return;
        console.error("[cashfree-callback] Verification failed:", err);
        setError("Payment verification failed. Redirecting...");
        setTimeout(() => {
          if (!cancelled) {
            navigate({
              to: "/order-failure",
              search: { ref: "", error: "verification_failed" },
              replace: true,
            });
          }
        }, 2000);
      }
    }

    processCallback();

    return () => {
      cancelled = true;
    };
  }, [search.order_id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-dvh flex items-center justify-center bg-cream">
      <div className="text-center max-w-sm px-5">
        {error ? (
          <>
            <div className="mx-auto w-14 h-14 rounded-full bg-red-100 text-red-500 inline-flex items-center justify-center text-2xl">
              !
            </div>
            <p className="mt-4 font-display text-xl text-indigo-deep">
              {error}
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Redirecting you shortly…
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto w-14 h-14 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
            <p className="mt-5 font-display text-xl text-indigo-deep">
              Verifying your payment…
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Please do not close this page. You'll be redirected shortly.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
