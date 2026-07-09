import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Phone, Mail } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Insights" },
  { to: "/contact", label: "Contact" },
  { to: "/terms", label: "Terms" },
  { to: "/privacy", label: "Privacy" },
  { to: "/refund", label: "Refunds" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  function isActive(to: string) {
    if (to === "/") return pathname === "/";
    return pathname === to || pathname.startsWith(to + "/");
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <header
        className={`sticky top-0 z-40 transition-shadow ${
          scrolled ? "shadow-[0_1px_0_var(--border-light)]" : ""
        }`}
      >
        {/* Top contact strip — desktop */}
        <div className="hidden md:block bg-indigo-deep text-cream/85">
          <div className="mx-auto max-w-7xl px-6 py-2 flex items-center justify-between text-xs font-mono">
            <span className="text-cream/60">Trusted by 500+ clients across India & abroad</span>
            <div className="flex items-center gap-6">
              <a
                href="tel:+919717691644"
                className="flex items-center gap-2 hover:text-cream transition-colors"
              >
                <Phone size={12} aria-hidden /> +91 97176 91644
              </a>
              <a
                href="mailto:Erssuman18@gmail.com"
                className="flex items-center gap-2 hover:text-cream transition-colors"
              >
                <Mail size={12} aria-hidden /> Erssuman18@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="bg-cream/95 backdrop-blur-sm border-b border-border-light">
          <div className="mx-auto max-w-7xl px-5 md:px-6 h-16 md:h-[72px] flex items-center justify-between">
            <Link
              to="/"
              className="flex items-baseline gap-1.5 font-display text-[22px] text-indigo-deep font-semibold tracking-tight"
            >
              SudnadiAstro <span className="text-saffron text-base">✦</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
              {navLinks.map((l) => {
                const active = isActive(l.to);
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`text-[13.5px] font-medium px-3 py-1.5 rounded-md transition-all ${
                      active
                        ? "bg-indigo-deep text-cream shadow-sm"
                        : "text-text-body hover:bg-saffron-ghost hover:text-saffron"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                to="/services"
                className="hidden md:inline-flex items-center bg-saffron text-white px-5 py-2.5 rounded-full font-semibold text-[14px] hover:bg-saffron-hover transition-all"
              >
                Book a Reading
              </Link>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full text-indigo-deep hover:bg-saffron-ghost"
              >
                <Menu size={22} aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer — always mounted, animated via CSS translate */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-indigo-deep/60 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
          aria-hidden
        />
        {/* Slide-in panel */}
        <div
          className={`absolute right-0 top-0 h-full w-[86%] max-w-sm bg-indigo-deep text-cream flex flex-col transition-transform duration-300 ease-in-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
            <span className="font-display text-xl">
              SudnadiAstro <span className="text-saffron">✦</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="w-11 h-11 inline-flex items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20"
            >
              <X size={22} aria-hidden />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto" aria-label="Mobile">
            {navLinks.map((l) => {
              const active = isActive(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`font-display text-[22px] px-4 py-3 rounded-lg transition-all ${
                    active
                      ? "bg-saffron/20 text-saffron-light border-l-4 border-saffron pl-3"
                      : "text-cream hover:bg-white/10 hover:text-saffron-light"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="px-6 pb-10 space-y-3" style={{ paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom, 0px))" }}>
            <Link
              to="/services"
              onClick={() => setOpen(false)}
              className="block text-center bg-saffron text-white py-3.5 rounded-full font-semibold active:scale-95 transition-transform"
            >
              Book a Reading
            </Link>
            <a
              href="tel:+919717691644"
              className="block text-center border border-white/30 py-3.5 rounded-full font-medium text-cream"
            >
              Call +91 97176 91644
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
