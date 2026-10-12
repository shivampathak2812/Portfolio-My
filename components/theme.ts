export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
const THEME_EVENT = "themechange";

/**
 * Runs inline in <head> before first paint so the page never flashes the wrong
 * theme: saved choice first, then the OS preference, falling back to dark.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","dark")}})();`;

export function getTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked (private mode) — the switch still applies for this visit
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Crossfade the whole page where the View Transitions API exists
  if (!reduceMotion && typeof document.startViewTransition === "function") {
    document.startViewTransition(() => applyTheme(theme));
  } else {
    applyTheme(theme);
  }
}

/** Subscribe to theme changes (toggle, or OS change when no choice is saved). */
export function subscribeTheme(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: light)");
  const onSystemChange = () => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {}
    if (saved !== "light" && saved !== "dark") applyTheme(media.matches ? "light" : "dark");
  };

  window.addEventListener(THEME_EVENT, callback);
  media.addEventListener("change", onSystemChange);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    media.removeEventListener("change", onSystemChange);
  };
}
