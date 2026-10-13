// Video intro shown on every visit: shared state for the welcome overlay and the hero
// avatar that the intro video "lands" in when it finishes.

export type IntroPhase = "welcome" | "playing" | "done";

export const INTRO_VIDEO = { mp4: "/videos/intro.mp4", webm: "/videos/intro.webm", poster: "/videos/intro-poster.jpg" };

/**
 * Caption cues for the intro video (seconds). Shown over the video while it
 * plays; left empty until the spoken words are provided.
 */
export const INTRO_CAPTIONS: { start: number; end: number; text: string }[] = [];

const listeners = new Set<() => void>();
// Every page load starts on the intro
let phase: IntroPhase = "welcome";
// Whether the finishing video glided into the hero avatar (the avatar then appears in place)
let handoff = false;

function emit() {
  listeners.forEach((l) => l());
}

export function getIntroPhase(): IntroPhase {
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
  // Fallback timers may fire after the intro already ended
  if (phase === "done") return;
  handoff = glidedIntoAvatar;
  phase = "done";
  emit();
}

/** Replays the intro with sound (hero avatar, footer link). */
export function replayIntro() {
  playIntro();
}

