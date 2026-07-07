import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { SectionEyebrow, OrnamentDivider } from "@/components/Ornaments";
import { Shield, Mail, Globe, ArrowRight, Lock, Cookie, Database, UserCheck, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SudnadiAstro" },
      {
        name: "description",
        content:
          "Privacy Policy for sudnadiastro.com — how we collect, use, and protect your personal information.",
      },
      { property: "og:title", content: "Privacy Policy — SudnadiAstro" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteShell>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-deep via-indigo-deep/95 to-cream pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(212,175,55,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <SectionEyebrow>Legal</SectionEyebrow>
          <h1 className="font-display text-4xl md:text-5xl text-cream leading-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-cream/65 text-lg max-w-xl mx-auto">
            How we collect, use, and safeguard your personal information.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-cream/50">
            <Shield size={14} />
            <span>Effective Date: 13 July 2025</span>
          </div>
        </div>
      </section>

      {/* ── Disclaimer Banner ── */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 -mt-6">
          <div className="bg-white rounded-2xl shadow-soft border border-saffron-border/30 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="text-saffron mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-indigo-deep mb-1">Legal Disclaimer</p>
                <p className="text-sm text-text-body leading-relaxed">
                  The services and information provided on sudnadiastro.com are intended for general guidance purposes
                  only. Our astrological consultations, predictions, and reports are based on traditional Indian
                  astrology systems including Nadi Astrology and Vedic Numerology, calculated using the birth
                  details provided by the user. We do not claim to guarantee any specific outcomes. All astrological
                  insights should be considered as opinions based on ancient systems of knowledge and should not be
                  treated as absolute facts or substitutes for professional advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-3xl px-6 space-y-12">

          {/* Section 1 */}
          <article id="information-collected" className="scroll-mt-24">
            <div className="flex items-start gap-3 mb-3">
              <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-saffron-ghost flex items-center justify-center">
                <Database size={16} className="text-saffron-hover" />
              </div>
              <h2 className="font-display text-xl md:text-2xl text-indigo-deep">
                1. Information We Collect
              </h2>
            </div>
            <p className="text-text-body leading-relaxed ml-11 mb-4">
              When you use our services, we may collect the following types of personal information:
            </p>
            <div className="ml-11 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                "Full Name",
                "Email Address",
                "Date of Birth",
                "Time of Birth",
                "Place of Birth",
                "Gender",
              ].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-lg border border-saffron-border/30 px-3 py-2.5 text-sm text-indigo-deep text-center"
                >
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-3 ml-11 text-sm text-text-muted">
              We may also collect questions or concerns you submit for consultation.
            </p>
          </article>

          <div className="h-px bg-saffron-border/30" />

          {/* Section 2 */}
          <article id="how-we-use" className="scroll-mt-24">
            <div className="flex items-start gap-3 mb-3">
              <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-saffron-ghost flex items-center justify-center">
                <UserCheck size={16} className="text-saffron-hover" />
              </div>
              <h2 className="font-display text-xl md:text-2xl text-indigo-deep">
                2. How We Use Your Information
              </h2>
            </div>
            <p className="text-text-body leading-relaxed ml-11 mb-3">
              The information collected is used strictly to:
            </p>
            <ul className="ml-11 space-y-2">
              {[
                "Prepare personalized astrology reports",
                "Provide consultations and predictions",
                "Improve our services",
                "Communicate with you regarding your queries or reports",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-text-body">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-saffron flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 ml-11 text-sm bg-saffron-ghost/40 border border-saffron-border/30 rounded-lg px-4 py-3 text-text-body">
              We do <strong className="text-indigo-deep">not</strong> share your personal information with third
              parties for marketing or advertising purposes.
            </p>
          </article>

          <div className="h-px bg-saffron-border/30" />

          {/* Section 3 */}
          <article id="data-security" className="scroll-mt-24">
            <div className="flex items-start gap-3 mb-3">
              <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-saffron-ghost flex items-center justify-center">
                <Lock size={16} className="text-saffron-hover" />
              </div>
              <h2 className="font-display text-xl md:text-2xl text-indigo-deep">
                3. Data Security
              </h2>
            </div>
            <p className="text-text-body leading-relaxed ml-11">
              We take appropriate steps to secure your data against unauthorized access, alteration, disclosure, or
              destruction. However, no online transmission or storage system is 100% secure, and we cannot guarantee
              absolute security.
            </p>
          </article>

          <div className="h-px bg-saffron-border/30" />

          {/* Section 4 */}
          <article id="cookies" className="scroll-mt-24">
            <div className="flex items-start gap-3 mb-3">
              <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-saffron-ghost flex items-center justify-center">
                <Cookie size={16} className="text-saffron-hover" />
              </div>
              <h2 className="font-display text-xl md:text-2xl text-indigo-deep">
                4. Cookies and Tracking
              </h2>
            </div>
            <p className="text-text-body leading-relaxed ml-11">
              We may use cookies or similar technologies to enhance user experience and gather limited analytics data
              (e.g., visitor count, browser type). You may disable cookies in your browser settings.
            </p>
          </article>

          <div className="h-px bg-saffron-border/30" />

          {/* Section 5 */}
          <article id="data-retention" className="scroll-mt-24">
            <h2 className="font-display text-xl md:text-2xl text-indigo-deep mb-3">
              5. Data Retention
            </h2>
            <p className="text-text-body leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purpose for which it was
              collected, or as required by applicable law.
            </p>
          </article>

          <div className="h-px bg-saffron-border/30" />

          {/* Section 6 */}
          <article id="your-rights" className="scroll-mt-24">
            <h2 className="font-display text-xl md:text-2xl text-indigo-deep mb-3">
              6. Your Rights
            </h2>
            <p className="text-text-body leading-relaxed mb-3">You may request to:</p>
            <ul className="space-y-2 mb-4">
              {[
                "Access the data we hold about you",
                "Correct or update your personal information",
                "Delete your personal data (subject to legal and contractual obligations)",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-text-body">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-saffron flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-text-muted">
              To do so, contact us at{" "}
              <a href="mailto:erastrosuman@gmail.com" className="text-saffron-hover font-medium hover:underline">
                erastrosuman@gmail.com
              </a>{" "}
              or through the contact form on our website.
            </p>
          </article>

          <div className="h-px bg-saffron-border/30" />

          {/* Section 7 */}
          <article id="changes" className="scroll-mt-24">
            <h2 className="font-display text-xl md:text-2xl text-indigo-deep mb-3">
              7. Changes to This Policy
            </h2>
            <p className="text-text-body leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an
              updated effective date.
            </p>
          </article>

          <OrnamentDivider />

          {/* Contact */}
          <article id="contact" className="scroll-mt-24">
            <h2 className="font-display text-xl md:text-2xl text-indigo-deep mb-3">
              8. Contact Us
            </h2>
            <p className="text-text-body leading-relaxed mb-4">
              If you have any questions or concerns about this Privacy Policy, please contact:
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
              to="/refund"
              className="flex items-center justify-between gap-2 px-5 py-3.5 bg-white border border-saffron-border/30 rounded-xl text-sm text-indigo-deep hover:border-saffron transition-colors group"
            >
              <span>Refund Policy</span>
              <ArrowRight size={14} className="text-saffron group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
