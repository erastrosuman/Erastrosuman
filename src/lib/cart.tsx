import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { services, type Service } from "@/data/services";

const STORAGE_KEY = "sudnadiastro_cart_v1";

function readStoredSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Only keep slugs that still correspond to a real, active service.
    const validSlugs = new Set(services.map((s) => s.slug));
    return parsed.filter((s): s is string => typeof s === "string" && validSlugs.has(s));
  } catch {
    return [];
  }
}

interface CartContextValue {
  /** Selected service slugs, in the order they were added. */
  slugs: string[];
  /** Resolved Service objects for the current selection. */
  items: Service[];
  /** Combined price of everything selected. */
  total: number;
  count: number;
  isSelected: (slug: string) => boolean;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  toggle: (slug: string) => void;
  clear: () => void;
  /** Replace the whole selection at once (e.g. seeding from a ?service= link). */
  setSlugs: (slugs: string[]) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugsState] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage once on mount (client-only).
  useEffect(() => {
    setSlugsState(readStoredSlugs());
    setHydrated(true);
  }, []);

  // Persist on every change, after initial hydration.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch {
      // Storage can fail in private browsing / quota-exceeded — the cart
      // still works for the current session via React state.
    }
  }, [slugs, hydrated]);

  const add = useCallback((slug: string) => {
    setSlugsState((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
  }, []);

  const remove = useCallback((slug: string) => {
    setSlugsState((prev) => prev.filter((s) => s !== slug));
  }, []);

  const toggle = useCallback((slug: string) => {
    setSlugsState((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }, []);

  const clear = useCallback(() => setSlugsState([]), []);

  const setSlugs = useCallback((next: string[]) => {
    setSlugsState([...new Set(next)]);
  }, []);

  const items = useMemo(
    () =>
      slugs.map((slug) => services.find((s) => s.slug === slug)).filter((s): s is Service => !!s),
    [slugs],
  );

  const total = useMemo(() => items.reduce((sum, s) => sum + s.price, 0), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      slugs,
      items,
      total,
      count: items.length,
      isSelected: (slug: string) => slugs.includes(slug),
      add,
      remove,
      toggle,
      clear,
      setSlugs,
    }),
    [slugs, items, total, add, remove, toggle, clear, setSlugs],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider.");
  }
  return ctx;
}
