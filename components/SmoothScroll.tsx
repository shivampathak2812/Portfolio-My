"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { MotionConfig } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, setLenis } from "./lenis";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1. Lenis smooth scroll — skipped entirely for reduced-motion users
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (!prefersReducedMotion()) {
      lenis = new Lenis({
        // Frame-rate independent lerp feels lighter than a fixed duration
        lerp: 0.1,
        wheelMultiplier: 1,
        smoothWheel: true,
        // Keep native touch momentum on phones — it is already smooth there
        syncTouch: false,
      });
      setLenis(lenis);

      // 2. Drive Lenis from GSAP's ticker so ScrollTrigger scrubs/pins read the
      // exact same scroll position every frame (removes pinned-section jitter)
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // 3. Cursor spotlight: rAF-throttled and written to the spotlight element only
    // (custom properties on <html> force a style recalc of the whole document)
    const spotlight = document.querySelector<HTMLElement>(".spotlight-glow");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let pointerFrame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        spotlight?.style.setProperty("--mouse-x", `${pointerX}px`);
        spotlight?.style.setProperty("--mouse-y", `${pointerY}px`);
      });
    };

    if (spotlight && finePointer) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
    }

    return () => {
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
      cancelAnimationFrame(pointerFrame);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  // Framer Motion honours the OS "reduce motion" setting site-wide
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
