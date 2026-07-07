import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteShell } from "@/components/SiteShell";
import { services } from "@/data/services";
import { Check, MessageCircle, Loader2 } from "lucide-react";
import { z } from "zod";
import { getBookingByRef } from "@/lib/api/payment.functions";

const search = z.object({
  ref: z.string().optional(),
  // Legacy support for old query params
  id: z.string().optional(),
  service: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
});

export const Route = createFileRoute("/order-success")({
  validateSearch: search,
  head: () => ({
    meta: [{ title: "Booking confirmed — SudnadiAstro" }, { name: "robots", content: "noindex" }],
  }),
  component: OrderSuccess,
});

function OrderSuccess() {
  const { ref, id, service: slug, name, email } = Route.useSearch();

  const [booking, setBooking] = useState<{
    publicRef: string;
    customerName: string;
    customerEmail: string;
    amount: number;
    status: string;
    serviceName: string;
    deliveryText: string;
    groupServices: { name: string; amount: number; deliveryText: string }[];
  } | null>(null);

  const [order, setOrder] = useState<{
    status: string;
    transactionId: string | null;
    paymentId: string | null;
  } | null>(null);

  const [loading, setLoading] = useState(!!ref);
  const [error, setError] = useState<string | null>(null);

  // Fetch booking data from Supabase if ref is available
  useEffect(() => {
    if (!ref) return;

    async function fetchBooking() {
      try {
        const result = await getBookingByRef({ data: { publicRef: ref! } });
        if (result.success) {
          setBooking(result.booking);
          setOrder(result.order ?? null);
        } else {
          setError("Booking not found.");
        }
      } catch (err) {
        console.error("Failed to fetch booking:", err);
        setError("Could not load booking details.");
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [ref]);

  // Fallback to legacy query params
  const service = services.find((s) => s.slug === slug);
  const displayName = booking?.customerName ?? name ?? "";
  const displayEmail = booking?.customerEmail ?? email ?? "";
  const displayRef = booking?.publicRef ?? ref ?? id ?? "—";
  const displayService = booking?.serviceName ?? service?.name ?? "";
  const displayAmount = booking ? `₹${booking.amount}` : service ? `₹${service.price}` : "";
  const displayDelivery = booking?.deliveryText ?? service?.delivery ?? "3–5 business days";

  if (loading) {
    return (
      <SiteShell>
        <section className="py-24">
          <div className="mx-auto max-w-2xl px-5 text-center">
            <Loader2 size={40} className="mx-auto text-saffron animate-spin" />
            <p className="mt-4 text-text-body">Loading your booking details…</p>
          </div>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-5 md:px-6 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-success/15 text-success inline-flex items-center justify-center">
            <Check size={40} strokeWidth={2.5} aria-hidden />
          </div>
          <h1 className="mt-7 font-display text-[40px] md:text-[52px] text-indigo-deep font-semibold leading-tight">
            Booking confirmed.
          </h1>
          <p className="mt-3 text-text-body">
            Thank you{displayName ? `, ${displayName}` : ""}. Sudhansu has received your request and
            will begin preparing your reading
            {booking && booking.groupServices.length > 1 ? "s" : ""}.
          </p>

          {error && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-700">
              {error} Showing basic confirmation details.
            </div>
          )}

          <div className="mt-10 bg-white border border-border-light rounded-lg p-7 text-left shadow-warm">
            <div className="flex items-center justify-between pb-4 border-b border-border-light">
              <span className="text-xs uppercase tracking-widest text-text-muted font-mono">
                Booking reference
              </span>
              <span className="font-mono text-sm text-indigo-deep font-semibold">{displayRef}</span>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              {booking && booking.groupServices.length > 1 ? (
                <div className="pb-1">
                  <dt className="text-text-muted mb-2">
                    Readings ({booking.groupServices.length})
                  </dt>
                  <dd className="space-y-1.5">
                    {booking.groupServices.map((s, i) => (
                      <div key={i} className="flex justify-between gap-4 text-[13.5px]">
                        <span className="text-text-body">{s.name}</span>
                        <span className="font-medium text-indigo-deep">₹{s.amount}</span>
                      </div>
                    ))}
                  </dd>
                </div>
              ) : (
                displayService && <Row label="Reading" value={displayService} />
              )}
              {displayAmount && (
                <Row
                  label={booking && booking.groupServices.length > 1 ? "Total paid" : "Amount"}
                  value={displayAmount}
                />
              )}
              <Row label="Delivery" value={displayDelivery} />
              {displayEmail && <Row label="Delivered to" value={displayEmail} />}
              {order?.transactionId && <Row label="Transaction ID" value={order.transactionId} />}
              {booking?.status && (
                <Row
                  label="Status"
                  value={
                    booking.status === "paid"
                      ? "✅ Payment received"
                      : booking.status === "processing"
                        ? "🔄 Processing"
                        : booking.status === "completed"
                          ? "✅ Completed"
                          : booking.status
                  }
                />
              )}
            </dl>
          </div>

          <h2 className="mt-12 font-display text-[26px] md:text-[30px] text-indigo-deep font-semibold">
            What happens next
          </h2>
          <ol className="mt-6 space-y-4 text-left">
            {[
              {
                n: 1,
                title: "Sudhansu reviews your details",
                text: "He'll cross-check your birth time and place to ensure accuracy.",
              },
              {
                n: 2,
                title: "Your reading is prepared by hand",
                text: "Drawn from your specific chart — no templates.",
              },
              { n: 3, title: "PDF arrives in your inbox", text: `Within ${displayDelivery}.` },
            ].map((s) => (
              <li
                key={s.n}
                className="flex gap-4 bg-cream-warm/60 border border-border-warm rounded-md p-4"
              >
                <span className="w-9 h-9 rounded-full bg-saffron text-white inline-flex items-center justify-center font-display font-semibold shrink-0">
                  {s.n}
                </span>
                <div>
                  <p className="font-semibold text-indigo-deep">{s.title}</p>
                  <p className="text-sm text-text-body mt-0.5">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <a
              href="https://wa.me/919717691644"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-semibold"
            >
              <MessageCircle size={16} aria-hidden /> Message on WhatsApp
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
