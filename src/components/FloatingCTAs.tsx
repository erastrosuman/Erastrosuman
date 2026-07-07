import { MessageCircle, Phone } from "lucide-react";

export function FloatingCTAs() {
  return (
    <div className="fixed right-4 md:right-6 z-30 flex flex-col gap-3 bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] md:bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
      <a
        href="tel:+919717691644"
        aria-label="Call SudnadiAstro"
        className="lg:hidden inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-deep text-cream shadow-float hover:scale-105 transition-transform"
      >
        <Phone size={20} aria-hidden />
      </a>
      <a
        href="https://wa.me/919717691644?text=Hi%20Sudhansu%20ji%2C%20I%E2%80%99d%20like%20to%20ask%20about%20a%20reading"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-float hover:scale-105 transition-transform"
      >
        <MessageCircle size={26} aria-hidden />
      </a>
    </div>
  );
}
