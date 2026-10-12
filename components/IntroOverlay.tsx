"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { Play, Volume2, VolumeX } from "lucide-react";
import { lockScroll, prefersReducedMotion, unlockScroll } from "./lenis";
import {
  INTRO_CAPTIONS,
  INTRO_VIDEO,
  clearIntroPrepaintFlag,
  finishIntro,
  getIntroPhase,
  getServerIntroPhase,
  playIntro,
  subscribeIntro,
} from "./intro";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function IntroOverlay() {
  const phase = useSyncExternalStore(subscribeIntro, getIntroPhase, getServerIntroPhase);
  const isOpen = phase !== "done";

  // Freeze the page (and Lenis) while the intro is up; Esc skips
  useEffect(() => {
    if (!isOpen) return;
    lockScroll();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") finishIntro();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <AnimatePresence onExitComplete={clearIntroPrepaintFlag}>
      {isOpen && (
        <motion.div
          key="intro"
          // Server-rendered welcome screen must be visible before hydration; replays fade in
          initial={phase === "playing" ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE } }}
          className="intro-overlay fixed inset-0 z-[1000] flex flex-col overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Video introduction"
          data-lenis-prevent
        >
          <IntroStage phase={phase} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IntroStage({ phase }: { phase: "welcome" | "playing" }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const handingOff = useRef(false);
  const [isMuted, setIsMuted] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  // Play from the start: with sound when the browser allows it, otherwise muted
  // with a "Tap for sound" prompt. Switches to the playing UI only once it really plays.
  const start = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.muted = false;
    video
      .play()
      .then(() => {
        setIsMuted(false);
        setNeedsTap(false);
        playIntro();
      })
      .catch(() => {
        // Sound needs a click first: browsers only allow muted autoplay
        video.muted = true;
        video
          .play()
          .then(() => {
            setIsMuted(true);
            setNeedsTap(true);
            playIntro();
          })
          // Autoplay fully blocked (e.g. battery saver): stay on the welcome screen's play button
          .catch(() => {});
      });
  };

  // Restart with sound after a muted autoplay
  const enableSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.muted = false;
    video.play().catch(() => {});
    setIsMuted(false);
    setNeedsTap(false);
  };

  // Autoplay as soon as the intro opens (first visit, or a replay)
  useEffect(() => {
    // Returning visitors briefly mount the hidden server-rendered welcome screen: never autoplay there
    if (getIntroPhase() === "done") return;
    if (phase === "playing") {
      animate(".intro-frame", { opacity: [0, 1], scale: [0.96, 1] }, { duration: 0.6, ease: EASE });
    } else if (prefersReducedMotion()) {
      // Reduced motion: wait for the visitor to press play
      return;
    }
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the video ends, glide the frame into the hero avatar's spot, then reveal the site
  const handOff = async () => {
    if (handingOff.current) return;
    handingOff.current = true;
    const slot = document.getElementById("hero-avatar-slot");
    const frame = scope.current?.querySelector<HTMLElement>(".intro-frame");
    if (!slot || !frame || window.scrollY > 200 || prefersReducedMotion()) {
      finishIntro();
      return;
    }
    const s = slot.getBoundingClientRect();
    const f = frame.getBoundingClientRect();
    await Promise.all([
      animate(".intro-controls", { opacity: 0 }, { duration: 0.2 }),
      animate(".intro-chrome", { opacity: 0 }, { duration: 0.3 }),
      animate(".intro-bg", { opacity: 0 }, { duration: 0.9, ease: EASE }),
      animate(
        frame,
        {
          x: s.left + s.width / 2 - (f.left + f.width / 2),
          y: s.top + s.height / 2 - (f.top + f.height / 2),
          width: s.width,
          height: s.height,
          borderRadius: s.width / 2,
        },
        { duration: 0.9, ease: EASE }
      ),
    ]);
    finishIntro(true);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    setNeedsTap(false);
  };

  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress(video.currentTime / video.duration);
    const cue = INTRO_CAPTIONS.find((c) => video.currentTime >= c.start && video.currentTime < c.end);
    setCaption(cue?.text ?? "");
  };

  const isPlaying = phase === "playing";

  return (
    <div ref={scope} className="relative flex flex-1 flex-col min-h-0">
      {/* Backdrop (fades away during the hand-off so the site shows through) */}
      <div className="intro-bg absolute inset-0 bg-background-cinematic" aria-hidden="true">
        <div className="aurora" />
      </div>

      {/* Top bar: name + skip, always available */}
      <div className="intro-chrome relative z-10 flex items-center justify-between px-5 md:px-10 pt-5 md:pt-7">
        <span className="font-display font-semibold text-sm tracking-tight text-white/80">Shivam Pathak</span>
        <button
          type="button"
          onClick={() => finishIntro()}
          className="glass-panel rounded-full px-4 py-2 text-xs md:text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cinematic/60"
        >
          Skip intro →
        </button>
      </div>

      <div className="relative z-10 flex flex-1 min-h-0 flex-col items-center justify-center gap-5 md:gap-6 px-5 pb-8">
        {/* Kept in the layout while playing (faded) so the frame never jumps */}
        <motion.p
          initial={false}
          animate={{ opacity: isPlaying ? 0 : 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="intro-chrome text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-accent-soft"
          aria-hidden={isPlaying}
        >
          A 10-second hello
        </motion.p>

        {/* Portrait glass frame. The video is always a dark scene, so its overlays keep the dark palette. */}
        <div className="intro-frame relative overflow-hidden rounded-[28px]" data-theme="dark">
          <video
            ref={videoRef}
            poster={INTRO_VIDEO.poster}
            playsInline
            preload="auto"
            onTimeUpdate={onTimeUpdate}
            onEnded={handOff}
            className="absolute inset-0 w-full h-full object-cover object-[50%_22%]"
          >
            <source src={INTRO_VIDEO.webm} type="video/webm" />
            <source src={INTRO_VIDEO.mp4} type="video/mp4" />
          </video>

          <div className="intro-controls absolute inset-0">
            {/* Bottom shade for legibility */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

            {!isPlaying ? (
              <>
                <button
                  type="button"
                  onClick={start}
                  aria-label="Play intro with sound"
                  className="absolute inset-0 flex items-center justify-center cursor-pointer group focus:outline-none"
                >
                  <span className="intro-play flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full text-white transition-transform duration-300 group-hover:scale-105">
                    <Play className="w-6 h-6 md:w-7 md:h-7 fill-current ml-1" />
                  </span>
                </button>
                <div className="absolute inset-x-0 bottom-0 p-5 pointer-events-none">
                  <p className="font-display font-semibold text-lg text-white">Shivam Pathak</p>
                  <p className="text-xs text-white/70 mt-0.5">Data &amp; AI Engineer</p>
                </div>
              </>
            ) : (
              <>
                {/* Muted autoplay: one big tap restarts the intro with sound */}
                {needsTap && (
                  <button
                    type="button"
                    onClick={enableSound}
                    aria-label="Restart the intro with sound"
                    className="absolute inset-0 flex items-center justify-center cursor-pointer group focus:outline-none"
                  >
                    <span className="intro-play inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition-transform duration-300 group-hover:scale-105">
                      <Volume2 className="w-4 h-4" />
                      Tap for sound
                    </span>
                  </button>
                )}
                {/* Captions: readable with the sound off */}
                {caption && (
                  <p className="absolute inset-x-4 bottom-12 text-center text-sm md:text-base font-medium text-white leading-snug [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">
                    {caption}
                  </p>
                )}
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  className="absolute top-3 right-3 flex items-center gap-2 rounded-full bg-black/45 backdrop-blur-md border border-white/15 px-3 py-2 text-white text-xs cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <div className="absolute inset-x-4 bottom-4 h-[3px] rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full rounded-full intro-progress" style={{ width: `${progress * 100}%` }} />
                </div>
              </>
            )}
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: isPlaying ? 0 : 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className={`intro-chrome flex flex-col items-center gap-3 ${isPlaying ? "pointer-events-none" : ""}`}
          aria-hidden={isPlaying}
        >
          <button
            type="button"
            onClick={start}
            className="btn-aurora inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Play className="w-4 h-4 fill-current" />
            Enter with sound
          </button>
          <p className="text-xs text-white/50">
            or press <kbd className="font-sans px-1.5 py-0.5 rounded border border-white/15 text-white/70">Esc</kbd> to go straight to the portfolio
          </p>
        </motion.div>
      </div>
    </div>
  );
}
