// First-visit video intro: shared state for the welcome overlay and the hero
// avatar that the intro video "lands" in when it finishes.

export type IntroPhase = "welcome" | "playing" | "done";

export const INTRO_STORAGE_KEY = "intro-seen";
export const INTRO_VIDEO = { mp4: "/videos/intro.mp4", webm: "/videos/intro.webm", poster: "/videos/intro-poster.jpg" };

/**
 * Caption cues for the intro video (seconds). Shown over the video while it
 * plays; left empty until the spoken words are provided.
 */
export const INTRO_CAPTIONS: { start: number; end: number; text: string }[] = [];

/** Runs in <head> before paint: returning visitors never see the welcome screen flash. */
export const introInitScript = `(function(){try{if(localStorage.getItem("${INTRO_STORAGE_KEY}")==="1")document.documentElement.setAttribute("data-intro","seen")}catch(e){}})();`;

const listeners = new Set<() => void>();
let phase: IntroPhase | null = null;
// Whether the finishing video glided into the hero avatar (the avatar then appears in place)
let handoff = false;

function emit() {
  listeners.forEach((l) => l());
}

export function getIntroPhase(): IntroPhase {
  if (phase === null) {
    let seen = false;
    try {
      seen = localStorage.getItem(INTRO_STORAGE_KEY) === "1";
    } catch {}
    phase = seen ? "done" : "welcome";
  }
  return phase;
}

export const getServerIntroPhase = (): IntroPhase => "welcome";

export function subscribeIntro(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getIntroHandoff() {
  return handoff;
}

export function playIntro() {
  phase = "playing";
  emit();
}

export function finishIntro(glidedIntoAvatar = false) {
  try {
    localStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch {}
  handoff = glidedIntoAvatar;
  phase = "done";
  emit();
}

/** Replays the intro with sound (hero avatar, footer link). */
export function replayIntro() {
  playIntro();
}

/** Clears the pre-paint "seen" flag so later replays can show the overlay. */
export function clearIntroPrepaintFlag() {
  document.documentElement.removeAttribute("data-intro");
}
