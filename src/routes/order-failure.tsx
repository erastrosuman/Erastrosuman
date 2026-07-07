import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteShell } from "@/components/SiteShell";
import { AlertCircle, MessageCircle, ArrowRight, Loader2 } from "lucide-react";
import { z } from "zod";
import { getBookingByRef } from "@/lib/api/payment.functions";

const search = z.object({
  ref: z.string().optional(),
  error: z.string().optional(),
});

export const Route = createFileRoute("/order-failure")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Payment failed — SudnadiAstro" }, { name: "robots", content: "noindex" }] }),
  component: OrderFailure,
});

function OrderFailure() {
  const { ref, error: errorParam } = Route.useSearch();

  const [booking, setBooking] = useState<{
    publicRef: string;
    customerName: string;
    amount: number;
    serviceName: string;
    serviceSlug: string;
  } | null>(null);

  const [loading, setLoading] = useState(!!ref);

  useEffect(() => {
    if (!ref) return;

    async function fetchBooking() {
      try {
        const result = await getBookingByRef({ data: { publicRef: ref! } });
        if (result.success) {
          setBooking({
            publicRef: result.booking.publicRef,
            customerName: result.booking.customerName,
            amount: result.booking.amount,
            serviceName: result.booking.serviceName,
            serviceSlug: result.booking.serviceSlug,
          });
        }
      } catch {
        // Silently fail — we'll show a generic message
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [ref]);

  if (loading) {
    return (
      <SiteShell>
        <section className="py-24">
          <div className="mx-auto max-w-2xl px-5 text-center">
            <Loader2 size={40} className="mx-auto text-saffron animate-spin" />
            <p className="mt-4 text-text-body">Loading details…</p>
          </div>
        </section>
      </SiteShell>
    );
  }

  const errorMessages: Record<string, string> = {
    verification_failed: "We could not verify the payment response. Your card was not charged.",
  };

  const errorText = errorParam
    ? errorMessages[errorParam] ?? "The payment could not be completed."
    : "Your payment was not completed. No amount has been charged.";

  return (
    <SiteShell>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-5 md:px-6 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-red-100 text-red-500 inline-flex items-center justify-center">
            <AlertCircle size={40} strokeWidth={2} aria-hidden />
          </div>
          <h1 className="mt-7 font-display text-[40px] md:text-[52px] text-indigo-deep font-semibold leading-tight">
            Payment not completed.
          </h1>
          <p className="mt-3 text-text-body max-w-lg mx-auto">
            {booking?.customerName ? `Hi ${booking.customerName}, ` : ""}
            {errorText}
          </p>

          {booking && (
            <div className="mt-8 bg-white border border-border-light rounded-lg p-6 text-left shadow-warm">
              <dl className="space-y-3 text-sm">
                <Row label="Booking reference" value={booking.publicRef} />
                <Row label="Reading" value={booking.serviceName} />
                <Row label="Amount" value={`₹${booking.amount}`} />
                <Row label="Status" value="❌ Payment failed" />
              </dl>
            </div>
          )}

          <div className="mt-10 space-y-4">
            <h2 className="font-display text-[22px] text-indigo-deep font-semibold">
              What you can do
            </h2>
            <ul className="text-left max-w-md mx-auto space-y-3 text-[14.5px] text-text-body">
              <li className="flex items-start gap-3">
                <ArrowRight size={16} className="text-saffron mt-0.5 shrink-0" aria-hidden />
                <span><strong>Try again</strong> — go back to the checkout page and submit your booking again. You will not be charged twice.</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight size={16} className="text-saffron mt-0.5 shrink-0" aria-hidden />
                <span><strong>Use a different payment method</strong> — try another card or UPI.</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight size={16} className="text-saffron mt-0.5 shrink-0" aria-hidden />
                <span><strong>Contact us</strong> — reach out on WhatsApp if you need help.</span>
              </li>
            </ul>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <Link
              to="/checkout"
              search={booking?.serviceSlug ? { service: booking.serviceSlug } : {}}
              className="inline-flex items-center gap-2 bg-saffron text-white px-6 py-3 rounded-full font-semibold hover:bg-saffron-hover transition-colors"
            >
              <ArrowRight size={16} aria-hidden /> Try again
            </Link>
            <a
              href="https://wa.me/919717691644"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-semibold"
            >
              <MessageCircle size={16} aria-hidden /> Get help on WhatsApp
            </a>
            <Link
              to="/"
              className="inline-flex items-center bg-white border border-border-light px-6 py-3 rounded-full font-semibold text-indigo-deep hover:border-saffron"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-text-muted">{label}</dt>
      <dd className="font-medium text-indigo-deep text-right">{value}</dd>
    </div>
  );
}
