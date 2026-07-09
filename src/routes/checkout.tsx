import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WizardProgress } from "@/components/WizardProgress";
import { services } from "@/data/services";
import { useCart } from "@/lib/cart";
import { ShieldCheck, Clock, ArrowRight, ArrowLeft, Loader2, Pencil, Check } from "lucide-react";
import { z } from "zod";
import { bookingFormSchema } from "@/lib/validations";
import { createBooking } from "@/lib/api/booking.functions";
import { createCashfreeOrder } from "@/lib/api/payment.functions";

const searchSchema = z.object({
  // Single-service deep link, e.g. from a ServiceCard's "Book now" button.
  service: z.string().optional(),
  // Comma-separated multi-service deep link, e.g. "kundli-report,career-report".
  services: z.string().optional(),
});

// ─── Form schema: the shared booking schema + a UI-only confirm checkbox ──

const checkoutSchema = bookingFormSchema.extend({
  confirmDetails: z.boolean().refine((v) => v === true, {
    message: "Please review and confirm your birth details before proceeding.",
  }),
});

type FormValues = z.infer<typeof checkoutSchema>;

// ─── Cashfree JS SDK loader ──────────────────────────────────

const CASHFREE_SDK_URL = "https://sdk.cashfree.com/js/v3/cashfree.js";

declare global {
  interface Window {
    Cashfree?: (options: { mode: "sandbox" | "production" }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: "_self" | "_blank" | "_modal";
      }) => Promise<{ error?: { message?: string }; paymentDetails?: unknown }>;
    };
  }
}

let cashfreeSdkPromise: Promise<void> | null = null;

function loadCashfreeSdk(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Cashfree SDK can only load in the browser."));
  }
  if (window.Cashfree) {
    return Promise.resolve();
  }
  if (cashfreeSdkPromise) {
    return cashfreeSdkPromise;
  }
  cashfreeSdkPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CASHFREE_SDK_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load the Cashfree payment SDK.")),
      );
      return;
    }
    const script = document.createElement("script");
    script.src = CASHFREE_SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      cashfreeSdkPromise = null;
      reject(new Error("Failed to load the Cashfree payment SDK."));
    };
    document.head.appendChild(script);
  });
  return cashfreeSdkPromise;
}

// Very approximate, occasionally-updated reference rate shown only as a
// courtesy for international visitors. The real charge always happens in
// INR via Cashfree — this is never used for the actual transaction.
const APPROX_USD_RATE = 1 / 87;
function approxUsd(inr: number): string {
  return `$${(inr * APPROX_USD_RATE).toFixed(0)}`;
}

export const Route = createFileRoute("/checkout")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [{ title: "Checkout — SudnadiAstro" }, { name: "robots", content: "noindex" }],
  }),
  component: CheckoutPage,
});

// ─── Wizard step definitions (one question at a time) ───────

type StepId =
  | "service"
  | "name"
  | "email"
  | "phone"
  | "seedNumber"
  | "dateOfBirth"
  | "birthTime"
  | "birthPlace"
  | "question"
  | "review";

// All possible steps — filtered dynamically based on cart contents.
const ALL_STEPS: { id: StepId; label: string; fields: (keyof FormValues)[] }[] = [
  { id: "service",    label: "Readings",       fields: ["serviceSlugs"] },
  { id: "name",       label: "Your name",      fields: ["name"] },
  { id: "email",      label: "Email",          fields: ["email"] },
  { id: "phone",      label: "Mobile",         fields: ["phone"] },
  // seedNumber replaces dateOfBirth for the "ask-question" service
  { id: "seedNumber", label: "Seed number",    fields: ["seedNumber"] },
  { id: "dateOfBirth",label: "Date of birth",  fields: ["dateOfBirth"] },
  { id: "birthTime",  label: "Time of birth",  fields: ["birthTime"] },
  { id: "birthPlace", label: "Place of birth", fields: ["birthPlace"] },
  { id: "question",   label: "Your question",  fields: [] },
  { id: "review",     label: "Confirm & pay",  fields: ["confirmDetails"] },
];

// Returns the active step list based on whether "ask-question" is in cart.
function buildSteps(isAskQuestion: boolean) {
  return ALL_STEPS.filter((s) => {
    if (isAskQuestion) {
      // For Ask a Question: show seedNumber, hide dateOfBirth and birthTime
      return s.id !== "dateOfBirth" && s.id !== "birthTime";
    } else {
      // For all other services: hide seedNumber
      return s.id !== "seedNumber";
    }
  });
}

function CheckoutPage() {
  const { service: presetSlug, services: presetSlugs } = Route.useSearch();
  const cart = useCart();

  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"idle" | "booking" | "payment" | "redirecting">(
    "idle",
  );
  const [stepIndex, setStepIndex] = useState(0);
  const cardTopRef = useRef<HTMLDivElement>(null);
  const seededFromUrl = useRef(false);

  // Preload the Cashfree SDK as soon as the checkout page mounts so it's
  // ready by the time the user submits the form.
  useEffect(() => {
    loadCashfreeSdk().catch((err) => console.error("Cashfree SDK preload failed:", err));
  }, []);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
    defaultValues: {
      serviceSlugs: [],
      name: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      birthTime: "",
      birthPlace: "",
      question: "",
      seedNumber: undefined,
      confirmDetails: false,
    },
  });

  // Seed the cart from a deep link (?service=slug or ?services=a,b) once,
  // without clobbering anything already sitting in the cart.
  useEffect(() => {
    if (seededFromUrl.current) return;
    seededFromUrl.current = true;
    const fromMulti =
      presetSlugs
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) ?? [];
    const fromSingle = presetSlug ? [presetSlug] : [];
    const validSlugs = new Set(services.map((s) => s.slug));
    for (const slug of [...fromMulti, ...fromSingle]) {
      if (validSlugs.has(slug)) cart.add(slug);
    }
    // If nothing was in the cart and nothing was in the URL, fall back to
    // the first service so the step never renders completely empty.
  }, [presetSlug, presetSlugs]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the form's serviceSlugs field in sync with the cart at all times.
  useEffect(() => {
    setValue("serviceSlugs", cart.slugs, { shouldValidate: false });
  }, [cart.slugs, setValue]);

  // Determine if the "Ask a Question" service is in the cart
  const isAskQuestion = cart.slugs.includes("ask-question");

  // Build the active steps list based on cart contents
  const STEPS = buildSteps(isAskQuestion);

  const name = watch("name");
  const email = watch("email");
  const phone = watch("phone");
  const dob = watch("dateOfBirth");
  const time = watch("birthTime");
  const place = watch("birthPlace");
  const question = watch("question");
  const seedNumber = watch("seedNumber");

  const isProcessing = checkoutStep !== "idle";
  const isLastStep = stepIndex === STEPS.length - 1;
  const total = cart.total;

  // Scroll the question card into view whenever the step changes, so the
  // user always lands at the top of the next question on mobile.
  useEffect(() => {
    cardTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [stepIndex]);

  async function goNext() {
    const fields = STEPS[stepIndex].fields;
    if (fields.length > 0) {
      const valid = await trigger(fields);
      if (!valid) return;
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function jumpTo(id: StepId) {
    const idx = STEPS.findIndex((s) => s.id === id);
    if (idx >= 0) setStepIndex(idx);
  }

  const onSubmit = handleSubmit(async (data) => {
    setCheckoutError(null);

    try {
      // Step 1: Create one booking + order per selected service
      setCheckoutStep("booking");
      const bookingResult = await createBooking({ data });

      if (!bookingResult.success) {
        throw new Error("Failed to create booking.");
      }

      // Services are now "spoken for" as real booking rows — clear the
      // cart so a later visit to /checkout starts fresh.
      cart.clear();

      // Step 2: Create ONE combined Cashfree order covering every service
      setCheckoutStep("payment");
      const cashfreeResult = await createCashfreeOrder({
        data: {
          orderIds: bookingResult.bookings.map((b) => b.orderId),
        },
      });

      if (!cashfreeResult.success) {
        throw new Error("Failed to initiate payment.");
      }

      // Step 3: Launch Cashfree's Drop-in checkout, which takes over the
      // page and redirects back to /api/cashfree-callback when done.
      setCheckoutStep("redirecting");
      await loadCashfreeSdk();

      if (!window.Cashfree) {
        throw new Error("Payment SDK failed to load. Please refresh and try again.");
      }

      const cashfree = window.Cashfree({ mode: cashfreeResult.mode });
      const result = await cashfree.checkout({
        paymentSessionId: cashfreeResult.paymentSessionId,
        redirectTarget: "_self",
      });

      if (result?.error) {
        throw new Error(result.error.message || "Payment could not be started.");
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      setCheckoutError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
      setCheckoutStep("idle");
    }
  });

  return (
    <div className="min-h-dvh flex flex-col bg-cream">
      <Header />
      <main id="main" className="flex-1 py-10 md:py-16 pb-32 lg:pb-16">
        <div className="mx-auto max-w-6xl px-5 md:px-6">
          <Link
            to="/services"
            className="text-sm text-saffron font-semibold hover:underline inline-flex items-center gap-1"
          >
            ← Continue browsing readings
          </Link>
          <h1 className="mt-3 font-display text-[34px] md:text-[44px] text-indigo-deep font-semibold">
            Complete your booking
          </h1>
          <p className="text-text-body mt-2 max-w-xl">
            Pick one reading or several — you'll pay for everything together in one secure checkout.
          </p>

          <div className="mt-8 grid lg:grid-cols-[1.5fr_1fr] gap-8">
            <form
              onSubmit={onSubmit}
              noValidate
              onKeyDown={(e) => {
                // Prevent the classic "single input in a form submits on
                // Enter" browser behavior from firing our final submit
                // handler prematurely on an earlier step — and instead use
                // Enter as a natural "Continue" shortcut. Let the textarea
                // (optional question step) keep normal newline behavior.
                if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
                  if (!isLastStep) {
                    e.preventDefault();
                    goNext();
                  }
                }
              }}
              className="bg-white border border-border-light rounded-lg p-6 md:p-8 shadow-warm"
            >
              <div ref={cardTopRef} />

              <WizardProgress
                current={stepIndex}
                total={STEPS.length}
                label={STEPS[stepIndex].label}
              />

              {checkoutError && (
                <div
                  className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700 mb-5"
                  role="alert"
                >
                  {checkoutError}
                </div>
              )}

              {/* ── Step: Choose reading(s) — multi-select ────── */}
              {STEPS[stepIndex].id === "service" && (
                <StepShell
                  eyebrow="Let's start with"
                  question="Which reading(s) would you like?"
                  hint="Select as many as you'd like — you'll pay for all of them in one checkout."
                >
                  <div className="grid sm:grid-cols-2 gap-3">
                    {services.map((s) => {
                      const checked = cart.isSelected(s.slug);
                      return (
                        <label
                          key={s.slug}
                          className={`flex items-start gap-3 px-4 py-3.5 rounded-md border cursor-pointer transition-colors ${
                            checked
                              ? "border-saffron bg-saffron-ghost"
                              : "border-border-light hover:border-saffron-border"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => cart.toggle(s.slug)}
                            className="mt-0.5 h-4 w-4 rounded border-border-light text-saffron focus:ring-saffron shrink-0"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium text-indigo-deep">{s.name}</span>
                              <span className="text-sm font-semibold text-gold shrink-0">
                                ₹{s.price}
                              </span>
                            </span>
                            <span className="block text-xs text-text-muted mt-0.5">
                              {s.tagline}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <FieldError message={errors.serviceSlugs?.message as string | undefined} />

                  {cart.count > 0 && (
                    <div className="mt-4 flex items-center justify-between bg-cream border border-border-warm rounded-md px-4 py-3">
                      <span className="text-sm text-text-body">
                        <strong className="text-indigo-deep">{cart.count}</strong> reading
                        {cart.count > 1 ? "s" : ""} selected
                      </span>
                      <span className="font-display text-lg text-gold font-semibold">₹{total}</span>
                    </div>
                  )}
                </StepShell>
              )}

              {/* ── Step: Name ────────────────────────────────── */}
              {STEPS[stepIndex].id === "name" && (
                <StepShell
                  eyebrow="About you"
                  question="What's your full name?"
                  hint="As it should appear on your reading."
                >
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    autoFocus
                    aria-invalid={!!errors.name}
                    {...register("name")}
                    className={bigInputCls(!!errors.name)}
                    placeholder="e.g. Priya Sharma"
                  />
                  <FieldError message={errors.name?.message} />
                </StepShell>
              )}

              {/* ── Step: Email ───────────────────────────────── */}
              {STEPS[stepIndex].id === "email" && (
                <StepShell
                  eyebrow="About you"
                  question="What's your email address?"
                  hint="Your reading(s) and receipt will be sent here."
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

              {/* ── Step: Phone ───────────────────────────────── */}
              {STEPS[stepIndex].id === "phone" && (
                <StepShell
                  eyebrow="About you"
                  question="What's your mobile number?"
                  hint="10 digits, no country code — used only for WhatsApp follow-up."
                >
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    autoFocus
                    aria-invalid={!!errors.phone}
                    {...register("phone")}
                    className={bigInputCls(!!errors.phone)}
                    placeholder="9876543210"
                  />
                  <FieldError message={errors.phone?.message} />
                </StepShell>
              )}

              {/* ── Step: Seed Number (Ask a Question only) ───── */}
              {STEPS[stepIndex].id === "seedNumber" && (
                <StepShell
                  eyebrow="Ask a Question"
                  question="Please select your seed number"
                  hint="This is a seed — please select one random number between 1 to 249."
                >
                  <input
                    id="seedNumber"
                    type="number"
                    min={1}
                    max={249}
                    autoFocus
                    inputMode="numeric"
                    aria-invalid={!!errors.seedNumber}
                    {...register("seedNumber", { valueAsNumber: true })}
                    className={bigInputCls(!!errors.seedNumber)}
                    placeholder="e.g. 116"
                  />
                  <FieldError message={errors.seedNumber?.message as string | undefined} />
                  <p className="mt-3 text-xs text-text-muted italic bg-cream/60 border border-border-light rounded px-3 py-2 leading-relaxed">
                    (Choose any number from 1 to 249 that comes to your mind at random — this seed
                    number is used as a unique reference for your question and helps the astrologer
                    personalise your reading.)
                  </p>
                </StepShell>
              )}

              {/* ── Step: Date of birth (non Ask-a-Question) ──── */}
              {STEPS[stepIndex].id === "dateOfBirth" && (
                <StepShell
                  eyebrow="Birth details"
                  question="What's your date of birth?"
                  hint="Used for every reading in this booking."
                >
                  <input
                    id="dateOfBirth"
                    type="date"
                    autoFocus
                    aria-invalid={!!errors.dateOfBirth}
                    {...register("dateOfBirth")}
                    className={bigInputCls(!!errors.dateOfBirth)}
                  />
                  <FieldError message={errors.dateOfBirth?.message} />
                </StepShell>
              )}

              {/* ── Step: Time of birth ───────────────────────── */}
              {STEPS[stepIndex].id === "birthTime" && (
                <StepShell
                  eyebrow="Birth details"
                  question="What time were you born?"
                  hint="An exact time (from hospital records) gives the most accurate reading. If unsure, give your closest estimate and mention it in the next step."
                >
                  <input
                    id="birthTime"
                    type="time"
                    autoFocus
                    aria-invalid={!!errors.birthTime}
                    {...register("birthTime")}
                    className={bigInputCls(!!errors.birthTime)}
                  />
                  <FieldError message={errors.birthTime?.message} />
                </StepShell>
              )}

              {/* ── Step: Place of birth ──────────────────────── */}
              {STEPS[stepIndex].id === "birthPlace" && (
                <StepShell
                  eyebrow="Birth details"
                  question="Where were you born?"
                  hint="City, state and country."
                >
                  <input
                    id="birthPlace"
                    type="text"
                    autoFocus
                    aria-invalid={!!errors.birthPlace}
                    {...register("birthPlace")}
                    className={bigInputCls(!!errors.birthPlace)}
                    placeholder="e.g. New Delhi, Delhi, India"
                  />
                  <FieldError message={errors.birthPlace?.message} />

                  <div className="mt-4 text-xs text-text-muted flex items-start gap-1.5 bg-cream/50 p-3 rounded border border-border-light">
                    <ShieldCheck size={14} className="text-saffron shrink-0 mt-0.5" aria-hidden />
                    <span>
                      <strong>Confidentiality guarantee:</strong> your birth details are used only
                      to construct your Vedic chart, and are never shared or sold.
                    </span>
                  </div>
                </StepShell>
              )}

              {/* ── Step: Question (optional) ─────────────────── */}
              {STEPS[stepIndex].id === "question" && (
                <StepShell
                  eyebrow="Optional"
                  question="Anything specific you'd like addressed?"
                  hint="Career, relationships, health — whatever's on your mind. Leave blank if you'd rather Sudhansu cover it generally."
                >
                  <textarea
                    id="question"
                    rows={5}
                    autoFocus
                    {...register("question")}
                    className={bigInputCls(false) + " resize-y"}
                    placeholder="Share details of your situation or question…"
                  />
                  <FieldError message={errors.question?.message} />
                </StepShell>
              )}

              {/* ── Step: Review & pay ────────────────────────── */}
              {STEPS[stepIndex].id === "review" && (
                <StepShell eyebrow="Almost done" question="Review your details">
                  <div className="divide-y divide-border-light border border-border-light rounded-md overflow-hidden">
                    <ReviewRow
                      label={`Reading${cart.count > 1 ? "s" : ""}`}
                      value={cart.items.map((s) => s.name).join(", ") || "—"}
                      onEdit={() => jumpTo("service")}
                    />
                    <ReviewRow label="Name" value={name || "—"} onEdit={() => jumpTo("name")} />
                    <ReviewRow label="Email" value={email || "—"} onEdit={() => jumpTo("email")} />
                    <ReviewRow label="Mobile" value={phone || "—"} onEdit={() => jumpTo("phone")} />
                    {isAskQuestion ? (
                      <ReviewRow
                        label="Seed Number"
                        value={seedNumber ? String(seedNumber) : "—"}
                        onEdit={() => jumpTo("seedNumber")}
                      />
                    ) : (
                      <>
                        <ReviewRow
                          label="Date of birth"
                          value={dob || "—"}
                          onEdit={() => jumpTo("dateOfBirth")}
                        />
                        <ReviewRow
                          label="Time of birth"
                          value={time || "—"}
                          onEdit={() => jumpTo("birthTime")}
                        />
                      </>
                    )}
                    <ReviewRow
                      label="Place of birth"
                      value={place || "—"}
                      onEdit={() => jumpTo("birthPlace")}
                    />
                    {question && (
                      <ReviewRow
                        label="Question"
                        value={question}
                        onEdit={() => jumpTo("question")}
                      />
                    )}
                  </div>

                  <div className="mt-5 bg-cream border border-border-warm rounded-md p-3.5 text-xs text-text-body space-y-1">
                    <p className="font-semibold text-indigo-deep">Secure gateway redirection</p>
                    <p className="leading-relaxed text-text-muted">
                      Clicking pay opens Cashfree's secure checkout. You can pay using{" "}
                      <strong>
                        UPI (GPay/PhonePe), Credit/Debit Cards, NetBanking, or Wallets
                      </strong>
                      . Once complete, you'll return here automatically.
                    </p>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        id="confirmDetails"
                        type="checkbox"
                        disabled={isProcessing}
                        {...register("confirmDetails")}
                        className="mt-1 h-4 w-4 rounded border-border-light text-saffron focus:ring-saffron focus:outline-none"
                      />
                      {isAskQuestion ? (
                        <span className="text-sm text-text-body leading-relaxed group-hover:text-indigo-deep select-none">
                          I confirm that my seed number (
                          <strong className="text-indigo-deep">{seedNumber ?? "not entered yet"}</strong>)
                          and place of birth (
                          <strong className="text-indigo-deep">{place || "not entered yet"}</strong>)
                          are correct.
                        </span>
                      ) : (
                        <span className="text-sm text-text-body leading-relaxed group-hover:text-indigo-deep select-none">
                          I confirm that my birth date (
                          <strong className="text-indigo-deep">{dob || "not entered yet"}</strong>),
                          time (
                          <strong className="text-indigo-deep">{time || "not entered yet"}</strong>),
                          and place (
                          <strong className="text-indigo-deep">{place || "not entered yet"}</strong>)
                          are correct
                          {cart.count > 1 ? ", and apply to every reading in this booking" : ""}.
                        </span>
                      )}
                    </label>
                    <FieldError message={errors.confirmDetails?.message} />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing || isSubmitting || cart.count === 0}
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-saffron text-white h-14 rounded-full font-semibold text-[16px] hover:bg-saffron-hover transition-colors disabled:opacity-60 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={18} className="animate-spin" aria-hidden />
                        {checkoutStep === "booking" && "Creating booking…"}
                        {checkoutStep === "payment" && "Preparing payment…"}
                        {checkoutStep === "redirecting" && "Redirecting to payment…"}
                      </>
                    ) : (
                      <>
                        {`Pay ₹${total}`} <ArrowRight size={18} aria-hidden />
                      </>
                    )}
                  </button>

                  <p className="mt-3 text-xs text-text-muted text-center flex items-center justify-center gap-1.5">
                    <ShieldCheck size={14} className="text-success shrink-0" aria-hidden />
                    <span>Secure checkout · Bank-grade 256-bit SSL encryption via Cashfree</span>
                  </p>
                </StepShell>
              )}

              {/* ── Navigation ─────────────────────────────────── */}
              {!isLastStep && (
                <div className="mt-7 flex items-center justify-between pt-5 border-t border-border-light">
                  {stepIndex > 0 ? (
                    <button
                      type="button"
                      onClick={goBack}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-indigo-deep transition-colors disabled:opacity-50"
                    >
                      <ArrowLeft size={16} aria-hidden /> Back
                    </button>
                  ) : (
                    <span />
                  )}
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-2 bg-saffron text-white px-7 py-3 rounded-full font-semibold text-[15px] hover:bg-saffron-hover transition-colors disabled:opacity-60"
                  >
                    Continue <ArrowRight size={16} aria-hidden />
                  </button>
                </div>
              )}
              {isLastStep && stepIndex > 0 && (
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-indigo-deep transition-colors disabled:opacity-50"
                  >
                    <ArrowLeft size={16} aria-hidden /> Back
                  </button>
                </div>
              )}
            </form>

            {/* Sticky summary */}
            <aside className="lg:sticky lg:top-28 self-start bg-parchment-grain border border-border-warm rounded-lg p-6">
              <h2 className="font-display text-xl text-indigo-deep">Order summary</h2>

              {cart.count === 0 ? (
                <p className="mt-4 text-sm text-text-muted">
                  No readings selected yet — pick at least one to continue.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-border-warm">
                  {cart.items.map((s) => (
                    <li
                      key={s.slug}
                      className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-indigo-deep text-sm truncate">{s.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">{s.delivery}</p>
                      </div>
                      <span className="text-sm font-semibold text-gold shrink-0">₹{s.price}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-5 pt-4 border-t border-border-warm flex items-center justify-between">
                <span className="font-display text-lg text-indigo-deep">Total</span>
                <div className="text-right">
                  <span className="font-display text-2xl text-gold font-semibold block">
                    ₹{total}
                  </span>
                  {total > 0 && (
                    <span className="text-[11px] text-text-muted">≈ {approxUsd(total)} USD</span>
                  )}
                </div>
              </div>
              <ul className="mt-6 space-y-2.5 text-[13px] text-text-body">
                <li className="flex items-start gap-2">
                  <Clock size={14} className="text-saffron mt-0.5 shrink-0" aria-hidden /> Delivered
                  to your inbox, one report per reading.
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck size={14} className="text-saffron mt-0.5 shrink-0" aria-hidden />{" "}
                  Birth details kept strictly private.
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-saffron mt-0.5 shrink-0" aria-hidden /> One round
                  of WhatsApp follow-up per reading.
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </main>

      {/* Mobile sticky nav bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-border-light shadow-[0_-4px_20px_rgba(19,19,58,0.06)] px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-widest text-text-muted font-mono">
            {cart.count > 0 ? `${cart.count} selected` : "Total"}
          </p>
          <p className="font-display text-xl text-gold font-semibold leading-none">₹{total}</p>
        </div>
        {isLastStep ? (
          <button
            type="button"
            onClick={() => onSubmit()}
            disabled={isProcessing || isSubmitting || cart.count === 0}
            className="flex-1 max-w-[240px] inline-flex items-center justify-center gap-2 bg-saffron text-white h-12 rounded-full font-semibold text-[15px] hover:bg-saffron-hover transition-colors disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden /> Processing…
              </>
            ) : (
              <>
                Pay now <ArrowRight size={16} aria-hidden />
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            disabled={isProcessing}
            className="flex-1 max-w-[240px] inline-flex items-center justify-center gap-2 bg-saffron text-white h-12 rounded-full font-semibold text-[15px] hover:bg-saffron-hover transition-colors disabled:opacity-60"
          >
            Continue <ArrowRight size={16} aria-hidden />
          </button>
        )}
      </div>

      <Footer />
    </div>
  );
}

// ─── Shared step UI pieces ───────────────────────────────────

function StepShell({
  eyebrow,
  question,
  hint,
  children,
}: {
  eyebrow: string;
  question: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <p className="text-[11px] font-mono uppercase tracking-widest text-saffron">{eyebrow}</p>
        <h2 className="font-display text-2xl md:text-[28px] text-indigo-deep font-semibold leading-tight">
          {question}
        </h2>
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

function ReviewRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-widest text-text-muted font-mono">{label}</p>
        <p className="text-sm font-medium text-indigo-deep truncate">{value}</p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-saffron hover:text-saffron-hover"
      >
        <Pencil size={12} aria-hidden /> Edit
      </button>
    </div>
  );
}

function bigInputCls(invalid: boolean) {
  return `w-full px-4 py-3.5 rounded-md bg-cream border ${
    invalid ? "border-error" : "border-border-light"
  } text-[17px] text-indigo-text focus:outline-none focus:border-saffron`;
}
