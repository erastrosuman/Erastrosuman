import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiteShell } from "@/components/SiteShell";
import { ConstellationBg, SectionEyebrow } from "@/components/Ornaments";
import { WizardProgress } from "@/components/WizardProgress";
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Check,
  Send,
  ChevronDown,
  ChevronRight,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { submitContactMessage } from "@/lib/api/contact.functions";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";
import astrologerImg from "@/assets/astrologer.jpg";

const quickReplies = [
  {
    label: "Which reading is right for me?",
    msg: "Hi Sudhansu ji, I'm not sure which reading fits my situation. Can you help me decide?",
  },
  {
    label: "I have a specific question",
    msg: "Hi Sudhansu ji, I have one specific question I'd like guidance on.",
  },
  {
    label: "Check Kundli compatibility",
    msg: "Hi Sudhansu ji, I'd like to do Kundli matching for marriage. Could you guide me?",
  },
];

const faqs = [
  {
    q: "How fast will I hear back?",
    a: "WhatsApp messages usually get a reply within a few hours during the day. Email and the form below — within 24 hours.",
  },
  {
    q: "Do you do live phone consultations?",
    a: "Most readings are delivered as a detailed written PDF, with one round of WhatsApp follow-up included. Live calls are available on request for an additional fee.",
  },
  {
    q: "Can I get a reading if I don't know my exact birth time?",
    a: "Yes — but accuracy improves significantly with an exact time. Hospital records, birth certificates or your mother's recollection all work. Tell us what you have.",
  },
  {
    q: "Is my information kept private?",
    a: "Always. Birth details, questions and reports are confidential — never shared, sold or used in marketing.",
  },
];

const topics = [
  "General question",
  "Recommend a reading for me",
  "Custom consultation",
  "Existing booking",
];

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Sudhansu Suman — SudnadiAstro" },
      {
        name: "description",
        content: "Talk to Sudhansu directly — WhatsApp, phone, email, or the message form.",
      },
      { property: "og:title", content: "Contact — SudnadiAstro" },
      { property: "og:description", content: "Get in touch with Sudhansu Suman." },
    ],
  }),
  component: ContactPage,
});

type FormValues = ContactFormData;

// ─── Wizard step definitions (one question at a time) ────────

type StepId = "name" | "email" | "phone" | "topic" | "message";

const STEPS: { id: StepId; label: string; fields: (keyof FormValues)[] }[] = [
  { id: "name", label: "Your name", fields: ["name"] },
  { id: "email", label: "Email", fields: ["email"] },
  { id: "phone", label: "Phone", fields: ["phone"] },
  { id: "topic", label: "Topic", fields: ["topic"] },
  { id: "message", label: "Message", fields: ["message"] },
];

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const cardTopRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", phone: "", topic: "", message: "" },
  });

  const isLastStep = stepIndex === STEPS.length - 1;

  useEffect(() => {
    cardTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [stepIndex]);

  async function goNext() {
    const valid = await trigger(STEPS[stepIndex].fields);
    if (!valid) return;
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);
    try {
      await submitContactMessage({ data });
      setSent(true);
      setStepIndex(0);
      reset();
    } catch (err) {
      console.error("Contact submission failed:", err);
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  });

  return (
    <SiteShell>
      <section className="relative bg-indigo-deep text-cream pt-16 md:pt-24 pb-16 overflow-hidden">
        <ConstellationBg color="#F4854A" className="opacity-25" />
        <div className="relative mx-auto max-w-3xl px-5 md:px-6 text-center">
          <SectionEyebrow>Get in touch</SectionEyebrow>
          <h1 className="font-display text-[40px] md:text-[58px] leading-[1.05] text-cream font-semibold">
            Talk to Sudhansu directly.
          </h1>
          <p className="mt-4 text-cream/75 max-w-xl mx-auto">
            Quickest reply on WhatsApp. Detailed questions are welcome by email or through the form
            below.
          </p>
          <p className="mt-3 inline-flex items-center gap-2 text-[12.5px] font-mono uppercase tracking-widest text-saffron-light">
            <Clock size={12} aria-hidden /> Typical reply in a few hours
          </p>
        </div>
      </section>

      {/* QUICK REPLIES */}
      <section className="-mt-8 relative z-10">
        <div className="mx-auto max-w-5xl px-5 md:px-6">
          <div className="bg-white border border-border-light rounded-lg p-5 md:p-6 shadow-warm">
            <p className="text-[12px] font-mono uppercase tracking-widest text-text-muted mb-3">
              Start a WhatsApp chat — pick a question
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {quickReplies.map((q) => (
                <a
                  key={q.label}
                  href={`https://wa.me/919717691644?text=${encodeURIComponent(q.msg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-left text-[14px] text-indigo-deep bg-cream hover:bg-saffron-ghost border border-border-warm hover:border-saffron-border rounded-md px-4 py-3 transition-colors"
                >
                  <MessageCircle size={16} className="text-[#25D366] mt-0.5 shrink-0" aria-hidden />
                  <span className="leading-snug">{q.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-5 md:px-6 grid lg:grid-cols-[1.4fr_1fr] gap-10">
          {/* FORM */}
          <div className="bg-white border-t-4 border-saffron border-x border-b border-border-light rounded-lg p-7 md:p-10 shadow-warm">
            {sent ? (
              <div className="text-center py-10">
                <div className="mx-auto w-14 h-14 rounded-full bg-success/15 text-success inline-flex items-center justify-center">
                  <Check size={28} aria-hidden />
                </div>
                <h2 className="mt-5 font-display text-[28px] text-indigo-deep">Message sent.</h2>
                <p className="mt-2 text-text-body">Sudhansu will reply within 24 hours.</p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 text-saffron font-semibold border-b-2 border-saffron-border hover:border-saffron pb-0.5"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                noValidate
                onKeyDown={(e) => {
                  // Avoid the "single text field submits form on Enter"
                  // browser quirk on earlier steps; use Enter as Continue.
                  if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
                    if (!isLastStep) {
                      e.preventDefault();
                      goNext();
                    }
                  }
                }}
              >
                <div ref={cardTopRef} />

                <div className="space-y-2 pb-4 mb-5 border-b border-border-light">
                  <h2 className="font-display text-[26px] text-indigo-deep leading-tight">
                    Ask Your Question
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-text-body">
                    <span className="inline-flex items-center gap-1.5 font-medium text-indigo-deep">
                      <Clock size={13} className="text-saffron" />
                      Typical replies: WhatsApp: ~2 hrs | Email/Form: ~24 hrs
                    </span>
                    <span className="text-text-muted">
                      Have a quick question?{" "}
                      <a href="#faqs" className="underline font-semibold hover:text-saffron">
                        Check FAQs
                      </a>{" "}
                      or{" "}
                      <Link to="/services" className="underline font-semibold hover:text-saffron">
                        Readings
                      </Link>
                    </span>
                  </div>
                </div>

                <WizardProgress
                  current={stepIndex}
                  total={STEPS.length}
                  label={STEPS[stepIndex].label}
                />

                {submitError && (
                  <div
                    className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700 mb-5"
                    role="alert"
                  >
                    {submitError}
                  </div>
                )}

                {/* ── Step: Name ─────────────────────────────── */}
                {STEPS[stepIndex].id === "name" && (
                  <StepShell question="What's your name?">
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      autoFocus
                      aria-invalid={!!errors.name}
                      {...register("name")}
                      className={bigInputCls(!!errors.name)}
                      placeholder="Enter your name"
                    />
                    <FieldError message={errors.name?.message} />
                  </StepShell>
                )}

                {/* ── Step: Email ────────────────────────────── */}
                {STEPS[stepIndex].id === "email" && (
                  <StepShell
                    question="What's your email address?"
                    hint="Sudhansu's reply will be sent here."
                  >
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      autoFocus
                      inputMode="email"
                      aria-invalid={!!errors.email}
                      {...register("email")}
                      className={bigInputCls(!!errors.email)}
                      placeholder="you@example.com"
                    />
                    <FieldError message={errors.email?.message} />
                  </StepShell>
                )}

                {/* ── Step: Phone (optional) ─────────────────── */}
                {STEPS[stepIndex].id === "phone" && (
                  <StepShell
                    question="What's your phone number?"
                    hint="Optional — only used for WhatsApp follow-up."
                  >
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      autoFocus
                      aria-invalid={!!errors.phone}
                      {...register("phone")}
                      className={bigInputCls(!!errors.phone)}
                      placeholder="e.g. +91 98765 43210"
                    />
                    <FieldError message={errors.phone?.message} />
                  </StepShell>
                )}

                {/* ── Step: Topic ────────────────────────────── */}
                {STEPS[stepIndex].id === "topic" && (
                  <StepShell question="What's this about?">
                    <div className="grid sm:grid-cols-2 gap-3">
                      {topics.map((t) => (
                        <label
                          key={t}
                          className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-md border cursor-pointer transition-colors has-[:checked]:border-saffron has-[:checked]:bg-saffron-ghost border-border-light hover:border-saffron-border"
                        >
                          <input
                            type="radio"
                            value={t}
                            {...register("topic")}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium text-indigo-deep">{t}</span>
                          <ChevronRight size={16} className="text-saffron shrink-0" aria-hidden />
                        </label>
                      ))}
                    </div>
                    <FieldError message={errors.topic?.message} />
                  </StepShell>
                )}

                {/* ── Step: Message ──────────────────────────── */}
                {STEPS[stepIndex].id === "message" && (
                  <StepShell
                    question="What would you like to say?"
                    hint="A few sentences helps Sudhansu prepare a useful reply."
                  >
                    <textarea
                      id="message"
                      rows={6}
                      autoFocus
                      aria-invalid={!!errors.message}
                      {...register("message")}
                      className={bigInputCls(!!errors.message) + " resize-y"}
                      placeholder="Share details of your request or situation..."
                    />
                    <FieldError message={errors.message?.message} />

                    <div className="mt-4 flex items-start gap-2.5 bg-cream/50 border border-border-warm rounded-md p-3 text-xs text-text-body">
                      <ShieldCheck size={16} className="text-saffron mt-0.5 shrink-0" aria-hidden />
                      <p>
                        <strong>100% Privacy Guaranteed:</strong> Your contact information is kept
                        strictly confidential. We never sell, share, or spam.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-saffron text-white px-7 py-3.5 rounded-full font-semibold hover:bg-saffron-hover transition-colors disabled:opacity-60"
                    >
                      <Send size={16} aria-hidden /> {isSubmitting ? "Sending…" : "Send message"}
                    </button>

                    <p className="mt-3 text-[11px] text-text-muted leading-relaxed">
                      What happens next? A copy of this request will be sent to your email. Sudhansu
                      personally reviews all messages and will respond within typical reply times.
                    </p>
                  </StepShell>
                )}

                {/* ── Navigation ─────────────────────────────── */}
                {!isLastStep && (
                  <div className="mt-7 flex items-center justify-between pt-5 border-t border-border-light">
                    {stepIndex > 0 ? (
                      <button
                        type="button"
                        onClick={goBack}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-indigo-deep transition-colors"
                      >
                        <ArrowLeft size={16} aria-hidden /> Back
                      </button>
                    ) : (
                      <span />
                    )}
                    <button
                      type="button"
                      onClick={goNext}
                      className="inline-flex items-center gap-2 bg-saffron text-white px-7 py-3 rounded-full font-semibold text-[15px] hover:bg-saffron-hover transition-colors"
                    >
                      Continue <ChevronRight size={16} aria-hidden />
                    </button>
                  </div>
                )}
                {isLastStep && stepIndex > 0 && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-indigo-deep transition-colors"
                    >
                      <ArrowLeft size={16} aria-hidden /> Back
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* SIDE */}
          <aside className="space-y-6">
            {/* Sudhansu Profile Card - Humanizing & Trust signals */}
            <div className="bg-parchment-grain border border-border-warm rounded-lg p-6 shadow-warm">
              <div className="flex items-center gap-4">
                <img
                  src={astrologerImg}
                  alt="Portrait of Sudhansu Suman"
                  className="w-16 h-16 rounded-full object-cover border border-saffron-border shrink-0 shadow-sm"
                />
                <div>
                  <h3 className="font-display text-lg text-indigo-deep font-semibold">
                    Sudhansu Suman
                  </h3>
                  <p className="text-xs font-mono uppercase tracking-wider text-saffron font-medium">
                    Nadi Astrologer & Numerologist
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-700 font-medium">
                    <Award size={12} className="shrink-0" />
                    <span>Trained under master Umang Taneja</span>
                  </div>
                </div>
              </div>
              <blockquote className="mt-4 text-[13.5px] text-text-body leading-relaxed italic border-l-2 border-saffron-border pl-3">
                "I personally study every chart and draft every report by hand. No automated
                software templates, just practical guidance for your life."
              </blockquote>

              <div className="mt-5 pt-4 border-t border-border-warm space-y-2">
                <div className="flex items-center gap-2.5 text-xs text-text-body font-medium">
                  <Sparkles size={14} className="text-saffron shrink-0" />
                  <span>10+ Years Consultative Practice</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-text-body font-medium">
                  <ShieldCheck size={14} className="text-saffron shrink-0" />
                  <span>500+ Horoscopes Personally Read</span>
                </div>
              </div>
            </div>

            {/* Direct Contact Links */}
            <div className="space-y-3">
              <p className="text-[11px] font-mono uppercase tracking-widest text-text-muted px-1">
                Other Contact Methods
              </p>
              <ContactItem
                icon={MessageCircle}
                label="WhatsApp — fastest reply"
                value="+91 97176 91644"
                href="https://wa.me/919717691644"
              />
              <ContactItem
                icon={Phone}
                label="Direct Call"
                value="+91 97176 91644"
                href="tel:+919717691644"
              />
              <ContactItem
                icon={Mail}
                label="Email Address"
                value="Erssuman18@gmail.com"
                href="mailto:Erssuman18@gmail.com"
              />
              <div className="bg-cream-warm border border-border-warm rounded-lg p-6 flex items-start gap-3">
                <MapPin size={18} className="text-saffron mt-0.5 shrink-0" aria-hidden />
                <div>
                  <p className="text-xs uppercase tracking-widest text-text-muted font-mono">
                    Based in
                  </p>
                  <p className="font-display text-lg text-indigo-deep mt-0.5">
                    Delhi NCR · serving worldwide
                  </p>
                  <p className="text-sm text-text-body mt-1">
                    All readings delivered digitally by email.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-3xl px-5 md:px-6">
          <SectionEyebrow>Before you ask</SectionEyebrow>
          <h2 className="font-display text-[30px] md:text-[38px] text-indigo-deep font-semibold">
            Common questions
          </h2>
          <div className="mt-7 space-y-3">
            {faqs.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function StepShell({
  question,
  hint,
  children,
}: {
  question: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="font-display text-xl md:text-2xl text-indigo-deep font-semibold leading-tight">
          {question}
        </h3>
        {hint && <p className="text-sm text-text-muted leading-relaxed">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs text-error" role="alert">
      {message}
    </p>
  );
}

function FaqItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="bg-white border border-border-light rounded-md overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 text-left p-5 hover:bg-cream"
      >
        <span className="font-display text-[17px] text-indigo-deep">{q}</span>
        <ChevronDown
          size={18}
          className={`text-saffron shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && <div className="px-5 pb-5 text-text-body leading-relaxed text-[14.5px]">{a}</div>}
    </div>
  );
}

function bigInputCls(invalid: boolean) {
  return `w-full px-4 py-3.5 rounded-md bg-cream border ${
    invalid ? "border-error" : "border-border-light"
  } text-[17px] text-indigo-text focus:outline-none focus:border-saffron`;
}

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="flex items-center gap-4 bg-white border border-border-light rounded-lg p-5 hover:border-saffron hover:shadow-warm transition-all"
    >
      <span className="w-11 h-11 rounded-full bg-saffron-ghost text-saffron inline-flex items-center justify-center shrink-0">
        <Icon size={18} aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-widest text-text-muted font-mono">{label}</p>
        <p className="font-semibold text-indigo-deep truncate">{value}</p>
      </div>
    </a>
  );
}
