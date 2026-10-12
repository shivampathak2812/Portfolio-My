import type Lenis from "lenis";

// Single Lenis instance shared by every component (set by <SmoothScroll />).
let instance: Lenis | null = null;
let lockCount = 0;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
  // Child effects (e.g. the intro splash) can lock scrolling before Lenis exists
  if (lenis && lockCount > 0) lenis.stop();
}

export function getLenis() {
  return instance;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Smoothly scroll to a selector / element / offset. Routes through Lenis when it
 * is running so programmatic scrolls share the same easing as wheel scrolls,
 * and falls back to native scrolling otherwise.
 */
export function scrollToTarget(
  target: string | HTMLElement | number,
  { offset = 0, block = "start" }: { offset?: number; block?: "start" | "center" } = {}
) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (el === null) return;

  let centerOffset = offset;
  if (block === "center" && typeof el !== "number") {
    centerOffset += -(window.innerHeight - Math.min(el.offsetHeight, window.innerHeight)) / 2;
  }

  if (instance) {
    instance.scrollTo(el, { offset: centerOffset, duration: 1.1 });
    return;
  }

  const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
  if (typeof el === "number") {
    window.scrollTo({ top: el + offset, behavior });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + centerOffset;
    window.scrollTo({ top, behavior });
  }
}

/** Ref-counted page scroll lock (modals, intro splash) that also pauses Lenis. */
export function lockScroll() {
  lockCount++;
  if (lockCount === 1) {
    instance?.stop();
    document.documentElement.style.overflow = "hidden";
  }
}

export function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.documentElement.style.overflow = "";
    instance?.start();
  }
}
