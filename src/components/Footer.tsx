import { Link } from "@tanstack/react-router";
import { Phone, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-indigo-deep text-cream/85 mt-16">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="font-display text-2xl text-cream">
            SudnadiAstro <span className="text-saffron">✦</span>
          </div>
          <p className="mt-4 text-sm max-w-sm text-cream/70 leading-relaxed">
            Personalised Nadi Astrology, Numerology and Vedic Card readings by Sudhansu Suman.
            Every reading is researched and written by hand — never auto-generated.
          </p>
          <div className="mt-6 flex flex-col gap-2 text-sm">
            <a href="tel:+919717691644" className="flex items-center gap-2 hover:text-saffron">
              <Phone size={14} aria-hidden /> +91 97176 91644
            </a>
            <a href="mailto:Erssuman18@gmail.com" className="flex items-center gap-2 hover:text-saffron">
              <Mail size={14} aria-hidden /> Erssuman18@gmail.com
            </a>
            <a
              href="https://wa.me/919717691644"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-saffron"
            >
              <MessageCircle size={14} aria-hidden /> WhatsApp
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-cream text-sm font-semibold tracking-widest uppercase mb-4">Explore</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/services" className="hover:text-saffron">All Services</Link></li>
            <li><Link to="/about" className="hover:text-saffron">About Sudhansu</Link></li>
            <li><Link to="/blog" className="hover:text-saffron">Insights</Link></li>
            <li><Link to="/contact" className="hover:text-saffron">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-cream text-sm font-semibold tracking-widest uppercase mb-4">Popular Readings</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/services/$slug" params={{ slug: "kundli-report" }} className="hover:text-saffron">Kundli Report</Link></li>
            <li><Link to="/services/$slug" params={{ slug: "career-report" }} className="hover:text-saffron">Career Report</Link></li>
            <li><Link to="/services/$slug" params={{ slug: "love-marriage" }} className="hover:text-saffron">Love & Marriage</Link></li>
            <li><Link to="/services/$slug" params={{ slug: "gemstone-report" }} className="hover:text-saffron">Gemstone Report</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-cream text-sm font-semibold tracking-widest uppercase mb-4">Legal</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/terms" className="hover:text-saffron">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-saffron">Privacy Policy</Link></li>
            <li><Link to="/refund" className="hover:text-saffron">Refund Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-cream/50 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} SudnadiAstro. Crafted with care in India.</span>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-saffron transition-colors">Terms & Conditions</Link>
            <span className="text-cream/20">|</span>
            <Link to="/privacy" className="hover:text-saffron transition-colors">Privacy Policy</Link>
            <span className="text-cream/20">|</span>
            <Link to="/refund" className="hover:text-saffron transition-colors">Refund Policy</Link>
          </div>
          <span className="font-mono">सत्यमेव जयते</span>
        </div>
      </div>
    </footer>
  );
}
