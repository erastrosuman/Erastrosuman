import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";

export function TestimonialsCarousel() {
  const [i, setI] = useState(0);
  const total = testimonials.length;
  const go = (n: number) => setI((n + total) % total);

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${i * 100}%)` }}
          aria-live="polite"
        >
          {testimonials.map((t) => (
            <div key={t.id} className="w-full shrink-0 px-2 md:px-4">
              <article className="relative bg-parchment-grain border border-border-warm rounded-lg p-7 md:p-10 max-w-3xl mx-auto">
                <span
                  aria-hidden
                  className="absolute top-3 left-5 font-display text-[100px] md:text-[140px] leading-none text-saffron/15 select-none"
                >
                  &ldquo;
                </span>
                <p className="relative font-display text-[19px] md:text-[22px] leading-[1.55] text-indigo-deep italic">
                  {t.text}
                </p>
                <div className="mt-6 pt-5 border-t border-border-warm flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-indigo-deep text-[15px]">{t.name}</p>
                    <p className="text-text-muted text-xs mt-0.5">{t.label}</p>
                  </div>
                  <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: t.rating }).map((_, k) => (
                      <Star key={k} size={14} className="fill-gold-light text-gold-light" aria-hidden />
                    ))}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mt-8">
        <button
          type="button"
          onClick={() => go(i - 1)}
          aria-label="Previous testimonial"
          className="w-11 h-11 rounded-full border border-border-warm bg-cream hover:bg-saffron hover:text-white hover:border-saffron transition-colors inline-flex items-center justify-center"
        >
          <ChevronLeft size={18} aria-hidden />
        </button>
        <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial slides">
          {testimonials.map((_, k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={k === i}
              aria-label={`Go to testimonial ${k + 1}`}
              onClick={() => setI(k)}
              className={`h-2 rounded-full transition-all ${
                k === i ? "w-7 bg-saffron" : "w-2 bg-border-warm hover:bg-saffron-border"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(i + 1)}
          aria-label="Next testimonial"
          className="w-11 h-11 rounded-full border border-border-warm bg-cream hover:bg-saffron hover:text-white hover:border-saffron transition-colors inline-flex items-center justify-center"
        >
          <ChevronRight size={18} aria-hidden />
        </button>
      </div>
    </div>
  );
}
