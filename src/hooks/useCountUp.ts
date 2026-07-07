import { useEffect, useRef } from "react";

export function useCountUp(target: number, duration = 1800, decimals = 0) {
  const elRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = eased * target;
          el.textContent = decimals ? val.toFixed(decimals) : String(Math.floor(val));
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = decimals ? target.toFixed(decimals) : String(target);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration, decimals]);
  return elRef;
}
