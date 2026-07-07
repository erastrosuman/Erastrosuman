import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingCTAs } from "./FloatingCTAs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function SiteShell({ children }: { children: ReactNode }) {
  useScrollAnimation();
  return (
    <div className="min-h-dvh flex flex-col bg-cream">
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingCTAs />
    </div>
  );
}
