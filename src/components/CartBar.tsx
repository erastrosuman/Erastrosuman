import { useNavigate } from "@tanstack/react-router";
import { ShoppingCart, ArrowRight, X } from "lucide-react";
import { useCart } from "@/lib/cart";

/**
 * Persistent bottom bar shown across /services and service detail pages
 * whenever 1+ readings are selected, so people can keep browsing and add
 * more readings before paying for everything together in one checkout.
 */
export function CartBar() {
  const cart = useCart();
  const navigate = useNavigate();

  if (cart.count === 0) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 bg-indigo-deep text-cream shadow-[0_-4px_24px_rgba(19,19,58,0.25)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 flex items-center gap-3">
        <span className="hidden sm:inline-flex w-9 h-9 rounded-full bg-saffron/20 text-saffron items-center justify-center shrink-0">
          <ShoppingCart size={16} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-widest text-cream/60 font-mono">
            {cart.count} reading{cart.count > 1 ? "s" : ""} selected
          </p>
          <p className="text-sm text-cream truncate">{cart.items.map((s) => s.name).join(" · ")}</p>
        </div>
        <span className="font-display text-xl text-saffron-light font-semibold shrink-0">
          ₹{cart.total}
        </span>
        <button
          type="button"
          onClick={() => cart.clear()}
          aria-label="Clear selected readings"
          className="hidden sm:inline-flex w-9 h-9 rounded-full items-center justify-center text-cream/50 hover:text-cream hover:bg-white/10 transition-colors shrink-0"
        >
          <X size={16} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/checkout" })}
          className="inline-flex items-center gap-1.5 bg-saffron text-white h-11 px-5 rounded-full font-semibold text-sm hover:bg-saffron-hover transition-colors shrink-0"
        >
          Checkout <ArrowRight size={15} aria-hidden />
        </button>
      </div>
    </div>
  );
}
