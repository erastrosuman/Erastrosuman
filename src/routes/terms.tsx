import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { SectionEyebrow, OrnamentDivider } from "@/components/Ornaments";
import { FileText, Mail, Globe, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — SudnadiAstro" },
      {
        name: "description",
        content:
          "Terms and Conditions for sudnadiastro.com — read before using our astrology consultation services.",
      },
      { property: "og:title", content: "Terms & Conditions — SudnadiAstro" },
    ],
  }),
  component: TermsPage,
});

const sections = [
  {
    id: "services",
    title: "1. Services Offered",
    content: `sudnadiastro.com provides astrology-based consultations and reports derived from the user's date, time, and place of birth, using traditional Indian systems such as Nadi Astrology and Vedic Numerology.`,
    list: [
      "Kundli reports",
      "Career and finance predictions",
      "Love and marriage compatibility",
      "Health-related astrological analysis",
      "Specific question-based answers",
    ],
  },
  {
    id: "responsibility",
    title: "2. User Responsibility",
    content: "By using our services, you:",
    list: [
      "Agree to provide accurate and complete birth and personal details",
      "Understand that astrology is a traditional and interpretative science, not an exact prediction tool",
      "Accept full responsibility for any decisions made based on astrological readings",
    ],
  },
  {
    id: "no-guarantee",
    title: "3. No Guarantee of Results",
    content:
      "Astrological interpretations are based on ancient Indian methods and the accuracy of user-provided birth information. We do not guarantee that predictions or advice will be accurate or result in any specific outcomes. The information is provided for guidance and insight only, not as a substitute for medical, legal, financial, or professional advice.",
  },
  {
    id: "payment-refund",
    title: "4. Payment and Refund Policy",
    content:
      "All consultations and services offered on sudnadiastro.com are paid services. Once a service is availed and payment is made, it is non-refundable, except in cases where:",
    list: [
      "The service was not delivered at all",
      "There was a technical error or duplicate payment",
    ],
    note: "For such issues, users must contact us at erastrosuman@gmail.com within 7 days of purchase.",
  },
  {
    id: "ip",
    title: "5. Intellectual Property",
    content:
      "All content on this website — including text, images, charts, and reports — is the intellectual property of astrosuman.com and may not be copied, reproduced, or redistributed without prior written permission.",
  },
  {
    id: "privacy-data",
    title: "6. Privacy and Data Usage",
    content:
      "We respect your privacy and handle your personal data in accordance with our Privacy Policy. Your information will not be shared with third parties without consent, except as required by law.",
  },
  {
    id: "liability",
    title: "7. Limitation of Liability",
    content:
      "astrosuman.com, its owner(s), and affiliates shall not be held liable for any loss, damage, or inconvenience arising directly or indirectly from the use of our website or services.",
  },
  {
    id: "modification",
    title: "8. Modification of Terms",
    content:
      "We reserve the right to modify these Terms and Conditions at any time. Any changes will be posted on this page with an updated effective date. Continued use of the website implies acceptance of the revised terms.",
  },
  {
    id: "governing-law",
    title: "9. Governing Law",
    content:
      "These Terms and Conditions shall be governed by and interpreted in accordance with the laws of India, and any disputes shall be subject to the jurisdiction of the courts in Jamui, Bihar, India.",
  },
];

function TermsPage() {
  return (
    <SiteShell>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-deep via-indigo-deep/95 to-cream pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <SectionEyebrow>Legal</SectionEyebrow>
          <h1 className="font-display text-4xl md:text-5xl text-cream leading-tight">
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 text-cream/65 text-lg max-w-xl mx-auto">
            Please read these terms carefully before using our astrology consultation services.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-cream/50">
            <FileText size={14} />
            <span>Effective Date: 12 July 2025</span>
          </div>
        </div>
      </section>

      {/* ── Quick Nav ── */}
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-6 -mt-6">
          <div className="bg-white rounded-2xl shadow-soft border border-saffron-border/30 p-6">
            <p className="text-xs text-text-muted uppercase tracking-widest font-mono mb-3">Quick Navigation</p>
            <div className="flex flex-wrap gap-2">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="text-xs px-3 py-1.5 rounded-full bg-parchment text-indigo-deep hover:bg-saffron-ghost hover:text-saffron-hover transition-colors"
                >
                  {s.title.replace(/^\d+\.\s/, "")}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-3xl px-6 space-y-10">
          {/* Intro */}
          <div className="prose-section">
            <p className="text-text-body leading-relaxed">
              Welcome to{" "}
              <a href="https://www.sudnadiastro.com" className="text-saffron-hover font-medium hover:underline">
                astrosuman.com
              </a>
              . By accessing or using this website and its services, you agree to be bound by the following Terms and
              Conditions. If you do not agree to these terms, please do not use our website.
            </p>
          </div>

          <OrnamentDivider />

          {/* Sections */}
          {sections.map((section, i) => (
            <article key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="font-display text-xl md:text-2xl text-indigo-deep mb-3">
                {section.title}
              </h2>
              <p className="text-text-body leading-relaxed">{section.content}</p>
              {section.list && (
                <ul className="mt-4 space-y-2">
                  {section.list.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-text-body">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-saffron flex-shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.note && (
                <p className="mt-4 text-sm text-text-muted bg-saffron-ghost/40 border border-saffron-border/30 rounded-lg px-4 py-3">
                  {section.note}
                </p>
              )}
              {i < sections.length - 1 && (
                <div className="mt-10 h-px bg-saffron-border/30" />
              )}
            </article>
          ))}

          <OrnamentDivider />

          {/* Contact */}
          <article id="contact" className="scroll-mt-24">
            <h2 className="font-display text-xl md:text-2xl text-indigo-deep mb-3">
              10. Contact Us
            </h2>
            <p className="text-text-body leading-relaxed mb-4">
              For any questions or concerns regarding these Terms and Conditions, please contact:
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
              to="/privacy"
              className="flex items-center justify-between gap-2 px-5 py-3.5 bg-white border border-saffron-border/30 rounded-xl text-sm text-indigo-deep hover:border-saffron transition-colors group"
            >
              <span>Privacy Policy</span>
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
