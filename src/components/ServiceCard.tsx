import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Clock, ShoppingCart, Check } from "lucide-react";
import { categoryColors, categoryLabel, type Service } from "@/data/services";
import { useCart } from "@/lib/cart";

export function ServiceCard({ service, delay = 0 }: { service: Service; delay?: number }) {
  const { bg, text } = categoryColors[service.category];
  const cart = useCart();
  const navigate = useNavigate();
  const selected = cart.isSelected(service.slug);

  return (
    <article
      data-animate
      data-animate-delay={delay}
      className="tilt-card group bg-white rounded-lg overflow-hidden border border-border-light shadow-warm flex flex-col relative"
    >
      {/* Multi-select toggle */}
      <button
        type="button"
        onClick={() => cart.toggle(service.slug)}
        aria-pressed={selected}
        aria-label={
          selected ? `Remove ${service.name} from selection` : `Add ${service.name} to selection`
        }
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full inline-flex items-center justify-center border-2 transition-colors ${
          selected
            ? "bg-saffron border-saffron text-white"
            : "bg-white/90 border-white text-transparent hover:border-saffron-border"
        }`}
      >
        <Check size={16} aria-hidden />
      </button>

      <Link
        to="/services/$slug"
        params={{ slug: service.slug }}
        className="block focus-visible:outline-none"
      >
        <div className="relative aspect-[5/4] overflow-hidden bg-cream-warm">
          {service.image ? (
            <img
              src={service.image}
              alt={`Illustration for ${service.name}`}
              loading="lazy"
              width={800}
              height={640}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-saffron-ghost via-cream-warm to-parchment flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.04]">
              <span className="font-display text-[80px] text-saffron/25 select-none" aria-hidden>✦</span>
            </div>
          )}
          <span
            className={`absolute top-3 left-3 ${bg} ${text} text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full`}
          >
            {categoryLabel[service.category]}
          </span>
        </div>
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-[22px] leading-tight text-indigo-deep">
          <Link
            to="/services/$slug"
            params={{ slug: service.slug }}
            className="hover:text-saffron transition-colors"
          >
            {service.name}
          </Link>
        </h3>
        <p className="mt-2 text-saffron-hover text-sm italic">{service.tagline}</p>
        <p className="mt-3 text-[14.5px] text-text-body leading-relaxed line-clamp-3">
          {service.desc}
        </p>

        {/* Price + delivery info */}
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between pb-4 border-b border-border-light">
            <span className="font-display text-2xl text-gold font-semibold">₹{service.price}</span>
            <span className="flex items-center gap-1 text-[12px] text-text-muted">
              <Clock size={12} aria-hidden /> {service.delivery}
            </span>
          </div>

          {/* Two action buttons — like Swiggy/Zomato cards */}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => {
                cart.add(service.slug);
                navigate({ to: "/checkout" });
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-saffron text-white h-11 rounded-full font-semibold text-[13.5px] hover:bg-saffron-hover transition-all hover:-translate-y-0.5"
            >
              <ShoppingCart size={14} aria-hidden /> Book now
            </button>
            <Link
              to="/services/$slug"
              params={{ slug: service.slug }}
              className="inline-flex items-center justify-center gap-1 border-2 border-border-light text-text-body h-11 px-4 rounded-full text-[13px] font-medium hover:border-saffron hover:text-saffron transition-colors"
            >
              Details <ArrowRight size={13} aria-hidden />
            </Link>
          </div>
          <button
            type="button"
            onClick={() => cart.toggle(service.slug)}
            className={`mt-2 w-full text-center text-[12.5px] font-medium py-1.5 rounded-full transition-colors ${
              selected ? "text-saffron-hover" : "text-text-muted hover:text-saffron"
            }`}
          >
            {selected
              ? "✓ Added — combine with more readings"
              : "+ Add to combine with other readings"}
          </button>
        </div>
      </div>
    </article>
  );
}
