"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Download, Play, Sparkles } from "lucide-react";
import { RESUME_FILENAME, RESUME_HASH, RESUME_URL, openResumeViewer } from "./resume";
import { scrollToTarget } from "./lenis";
import { openChatbot } from "./chatbot-events";
import {
  INTRO_VIDEO,
  getIntroHandoff,
  getIntroPhase,
  getServerIntroPhase,
  replayIntro,
  subscribeIntro,
} from "./intro";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const subscribeNothing = () => () => {};

export default function Hero() {
  const phase = useSyncExternalStore(subscribeIntro, getIntroPhase, getServerIntroPhase);
  // Hero content waits for the intro to hand off, then rises in
  const ready = phase === "done";
  // False in the server HTML and during hydration, true afterwards
  const hydrated = useSyncExternalStore(subscribeNothing, () => true, () => false);
  // The server HTML keeps the hero (and its H1) visible so it never depends on the
  // intro finishing; once hydrated it is hidden behind the opaque intro overlay
  // until the hand-off, which keeps the rise-in animation exactly as before
  const hidden = hydrated && !ready;

  const reveal = (i: number) => ({
    initial: false as const,
    animate: hidden ? { opacity: 0, y: 24 } : { opacity: 1, y: 0 },
    transition: hidden ? { duration: 0 } : { duration: 0.9, delay: 0.25 + i * 0.08, ease: EASE },
  });

  return (
    <section
      id="hero-section"
      className="relative w-full min-h-[100svh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 md:pt-36"
    >
      {/* Video avatar: the intro video lands here when it finishes */}
      <div id="hero-avatar-slot" className="relative w-28 h-28 md:w-32 md:h-32 mb-7">
        {ready && <VideoAvatar handoff={getIntroHandoff()} />}
      </div>

      <motion.div {...reveal(0)} className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs md:text-sm text-white/80">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-2 shadow-[0_0_10px_var(--accent-2)]" />
        Data &amp; AI/ML Engineer
      </motion.div>

      <motion.h1
        {...reveal(1)}
        className="font-display font-semibold tracking-[-0.045em] leading-[1.02] text-[clamp(2.6rem,7.4vw,6.6rem)] mt-6 mb-6 max-w-6xl"
      >
        <span className="block text-white text-[clamp(1.5rem,3.6vw,2.75rem)] tracking-[-0.03em] mb-3">Shivam Pathak</span>
        <span className="text-aurora block">Data &amp; AI Engineer</span>
        <span className="text-aurora block opacity-80">building what&apos;s next.</span>
      </motion.h1>

      <motion.p
        {...reveal(2)}
        className="max-w-2xl text-base md:text-xl font-light leading-relaxed text-white/65"
      >
        I&apos;m Shivam Pathak, a Data &amp; AI Engineer in Mumbai building ML models, LLM &amp; RAG applications, REST APIs and data pipelines — designed with care, shipped end to end.
      </motion.p>

      <motion.div {...reveal(3)} className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <a
          href="#projects"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget("#projects");
          }}
          className="btn-aurora rounded-full px-7 py-3.5 text-sm font-semibold"
        >
          View projects
        </a>
        <a
          href={RESUME_HASH}
          onClick={(e) => {
            e.preventDefault();
            openResumeViewer();
          }}
          className="glass-panel rounded-full px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
        >
          View resume
        </a>
        <a
          href={RESUME_URL}
          download={RESUME_FILENAME}
          aria-label="Download resume"
          title="Download resume"
          className="glass-panel rounded-full w-[50px] h-[50px] flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <Download className="w-4 h-4" />
        </a>
        <button
          type="button"
          onClick={openChatbot}
          className="glass-panel inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          Talk to Avix AI
          <Sparkles className="w-4 h-4 text-accent-soft" />
        </button>
      </motion.div>

      {/* Scroll cue */}
      <motion.button
        type="button"
        {...reveal(5)}
        onClick={() => scrollToTarget("#about")}
        className="hero-scroll-indicator absolute bottom-7 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-[10px] tracking-[0.25em] text-white/40 hover:text-white/80 transition-colors cursor-pointer"
      >
        SCROLL
        <span className="block w-px h-9 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.button>
    </section>
  );
}

function VideoAvatar({ handoff }: { handoff: boolean }) {
  return (
    <motion.button
      type="button"
      // After the intro glides into this spot the avatar appears instantly in place
      initial={handoff ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
      style={{ borderRadius: 9999 }}
      onClick={replayIntro}
      aria-label="Replay my video intro with sound"
      title="Replay my intro"
      className="aurora-ring absolute inset-0 rounded-full cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cinematic/60"
    >
      <span className="block w-full h-full rounded-full overflow-hidden bg-surface">
        {/* Silent loop: a living photo. Sound only plays when the visitor asks for it. */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={INTRO_VIDEO.poster}
          className="w-full h-full object-cover object-[50%_22%]"
        >
          <source src={INTRO_VIDEO.webm} type="video/webm" />
          <source src={INTRO_VIDEO.mp4} type="video/mp4" />
        </video>
      </span>
      <span className="btn-aurora absolute -bottom-0.5 -right-0.5 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
      </span>
    </motion.button>
  );
}
