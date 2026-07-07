import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { SectionEyebrow, OrnamentDivider } from "@/components/Ornaments";
import { RefreshCw, Mail, Globe, ArrowRight, ShieldCheck, XCircle, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund Policy — SudnadiAstro" },
      {
        name: "description",
        content:
          "Refund and cancellation policy for sudnadiastro.com astrology services. Understand our policy before making a purchase.",
      },
      { property: "og:title", content: "Refund Policy — SudnadiAstro" },
    ],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <SiteShell>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-deep via-indigo-deep/95 to-cream pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,175,55,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <SectionEyebrow>Legal</SectionEyebrow>
          <h1 className="font-display text-4xl md:text-5xl text-cream leading-tight">
            Refund Policy
          </h1>
          <p className="mt-4 text-cream/65 text-lg max-w-xl mx-auto">
            Please read our refund policy carefully before making any purchase.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-cream/50">
            <RefreshCw size={14} />
            <span>Effective Date: 12 July 2025</span>
          </div>
        </div>
      </section>

      {/* ── Key Highlight ── */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 -mt-6">
          <div className="bg-white rounded-2xl shadow-soft border border-saffron-border/30 p-6">
            <p className="text-sm font-medium text-indigo-deep mb-2">In Brief</p>
            <p className="text-text-body text-sm leading-relaxed">
              All astrology services are personalized and manually processed based on your unique birth data.
              Once delivered, <strong className="text-indigo-deep">no refund will be issued</strong>. Exceptions
              apply for duplicate payments, non-delivery, or technical errors.
            </p>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-3xl px-6 space-y-12">

          {/* Section 1 */}
          <article id="no-refund" className="scroll-mt-24">
            <div className="flex items-start gap-3 mb-3">
              <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-saffron-ghost flex items-center justify-center">
                <XCircle size={16} className="text-saffron-hover" />
              </div>
              <h2 className="font-display text-xl md:text-2xl text-indigo-deep">
                1. No Refund on Delivered Services
              </h2>
            </div>
            <p className="text-text-body leading-relaxed ml-11">
              All astrology services, reports, and consultations are personalized and manually processed based on
              your unique birth data. Therefore, once a service has been delivered (by email, phone, or any digital
              method), no refund will be issued under any circumstances.
            </p>
          </article>

          <div className="h-px bg-saffron-border/30" />

          {/* Section 2 */}
          <article id="exceptions" className="scroll-mt-24">
            <div className="flex items-start gap-3 mb-3">
              <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-saffron-ghost flex items-center justify-center">
                <ShieldCheck size={16} className="text-saffron-hover" />
              </div>
              <h2 className="font-display text-xl md:text-2xl text-indigo-deep">
                2. Exceptions to Refund Policy
              </h2>
            </div>
            <p className="text-text-body leading-relaxed ml-11 mb-4">
              A refund or replacement may be considered only in the following exceptional cases:
            </p>
            <div className="ml-11 space-y-3">
              {[
                {
                  title: "Duplicate Payment",
                  text: "If the same service was paid for more than once due to a technical or user error.",
                },
                {
                  title: "Service Not Delivered",
                  text: "If the paid service has not been delivered within the committed time and you have not received any update from us even after contacting support.",
                },
                {
                  title: "Incorrect Transaction",
                  text: "If a genuine mistake occurred during payment or a technical error led to the wrong amount being charged.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-xl border border-saffron-border/30 p-4"
                >
                  <h3 className="text-sm font-semibold text-indigo-deep mb-1">{item.title}</h3>
                  <p className="text-sm text-text-body leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 ml-11 bg-saffron-ghost/40 border border-saffron-border/30 rounded-lg px-4 py-3 text-sm text-text-body leading-relaxed">
              To claim a refund, you must notify us <strong className="text-indigo-deep">within 7 days</strong> of
              your transaction by writing to{" "}
              <a href="mailto:erastrosuman@gmail.com" className="text-saffron-hover font-medium hover:underline">
                erastrosuman@gmail.com
              </a>
              . Include your name, payment reference number, and the details of the issue.
            </div>
          </article>

          <div className="h-px bg-saffron-border/30" />

          {/* Section 3 */}
          <article id="no-refund-user-error" className="scroll-mt-24">
            <div className="flex items-start gap-3 mb-3">
              <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-saffron-ghost flex items-center justify-center">
                <AlertTriangle size={16} className="text-saffron-hover" />
              </div>
              <h2 className="font-display text-xl md:text-2xl text-indigo-deep">
                3. No Refund for User Errors
              </h2>
            </div>
            <p className="text-text-body leading-relaxed ml-11 mb-3">Refunds will not be issued for:</p>
            <ul className="ml-11 space-y-2">
              {[
                "Providing incorrect or incomplete birth details",
                "Change of mind after payment",
                "Dissatisfaction with the nature or content of the predictions (as astrology is interpretive and not guaranteed)",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-text-body">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-saffron flex-shrink-0" />
                  <span className="leading-relaxed text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <div className="h-px bg-saffron-border/30" />

          {/* Section 4 */}
          <article id="cancellation" className="scroll-mt-24">
            <h2 className="font-display text-xl md:text-2xl text-indigo-deep mb-3">
              4. Cancellation Policy
            </h2>
            <p className="text-text-body leading-relaxed">
              As our services are digital and personalized, cancellations are not possible once the order is placed
              and work has begun.
            </p>
          </article>

          <div className="h-px bg-saffron-border/30" />

          {/* Section 5 */}
          <article id="disputes" className="scroll-mt-24">
            <h2 className="font-display text-xl md:text-2xl text-indigo-deep mb-3">
              5. Payment Disputes
            </h2>
            <p className="text-text-body leading-relaxed">
              If you initiate a chargeback or dispute through your bank or payment provider without contacting us
              first, we reserve the right to block your access to our services and take appropriate legal or
              remedial actions.
            </p>
          </article>

          <OrnamentDivider />

          {/* Contact */}
          <article id="support" className="scroll-mt-24">
            <h2 className="font-display text-xl md:text-2xl text-indigo-deep mb-3">
              6. Contact for Support
            </h2>
            <p className="text-text-body leading-relaxed mb-4">
              For refund-related issues, please contact:
            </p>
            <div className="bg-white rounded-xl border border-saffron-border/30 p-5 space-y-3">
              <a href="mailto:erastrosuman@gmail.com" className="flex items-center gap-3 text-text-body hover:text-saffron-hover transition-colors">
                <Mail size={16} className="text-saffron" />
                <span>erastrosuman@gmail.com</span>
              </a>
              <a href="https://www.sudnadiastro.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-text-body hover:text-saffron-hover transition-colors">
                <Globe size={16} className="text-saffron" />
                <span>www.sudnadiastro.com</span>
              </a>
            </div>
            <p className="mt-4 text-sm text-text-muted italic">
              We aim to address all genuine concerns fairly and promptly.
            </p>
          </article>

          {/* Related Links */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Link
              to="/terms"
              className="flex items-center justify-between gap-2 px-5 py-3.5 bg-white border border-saffron-border/30 rounded-xl text-sm text-indigo-deep hover:border-saffron transition-colors group"
            >
              <span>Terms &amp; Conditions</span>
              <ArrowRight size={14} className="text-saffron group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/privacy"
              className="flex items-center justify-between gap-2 px-5 py-3.5 bg-white border border-saffron-border/30 rounded-xl text-sm text-indigo-deep hover:border-saffron transition-colors group"
            >
              <span>Privacy Policy</span>
              <ArrowRight size={14} className="text-saffron group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
