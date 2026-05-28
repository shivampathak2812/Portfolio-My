"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Volume2, VolumeX, Play, Pause } from "lucide-react";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface CinematicIntroProps {
  portfolioRef: React.RefObject<HTMLDivElement | null>;
}

export default function CinematicIntro({ portfolioRef }: CinematicIntroProps) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [hasEntered, setHasEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [videoSrc, setVideoSrc] = useState("/videos/hero-video.mp4");

  const FALLBACK_VIDEO_URL = "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c05427d2c35788129dec292869e5d262&profile_id=139&oauth2_token_id=57447761";

  const handleVideoError = () => {
    console.warn("Local hero-video.mp4 not found. Loading fallback CDN video.");
    setVideoSrc(FALLBACK_VIDEO_URL);
  };

  // 1. Lock screen scrolling before entry gesture
  useEffect(() => {
    if (!hasEntered) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [hasEntered]);

  const handleEnterExperience = () => {
    setHasEntered(true);
    setIsMuted(false);

    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.volume = 1;
      video.play().catch(err => console.log("Video playback block: ", err));
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play().catch(err => console.log(err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuteState = !isMuted;
      videoRef.current.muted = nextMuteState;
      setIsMuted(nextMuteState);
    }
  };

  // 2. High-Performance Scroll-Driven GSAP Scrub Transition with responsive matchMedia & ResizeObserver
  useEffect(() => {
    if (!hasEntered || !spacerRef.current || !videoContainerRef.current || !videoRef.current) return;

    const video = videoRef.current;
    const portfolio = portfolioRef.current;
    const spacer = spacerRef.current;

    // Use GSAP's matchMedia for responsive animations and scaling limits
    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      const { isDesktop } = context.conditions as any;

      // Pin spacing must be false to let next section slide up naturally
      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: spacer,
          start: "top top",
          end: "bottom top",
          scrub: true,
          pin: videoContainerRef.current,
          pinSpacing: false,
          onUpdate: (self) => {
            // Dynamic volume linear decay based on scroll progress
            if (video && !isMuted) {
              const currentVolume = Math.max(0, Math.min(1, 1 - self.progress));
              video.volume = currentVolume;
              
              // Sync muted state visually if volume hits 0
              if (currentVolume === 0 && !video.muted) {
                video.muted = true;
              } else if (currentVolume > 0 && video.muted) {
                video.muted = false;
              }
            }
          },
        },
      });

      // Scrub visual transitions: scale is clamped and moderated based on viewport aspect ratio
      scrollTimeline.to(video, {
        scale: isDesktop ? 1.05 : 1.015,
        opacity: 0,
        duration: 0.4,
        ease: "power1.out",
      }, 0);

      // Portfolio fades in completely from 5% to 45% of scroll (almost instantly!)
      if (portfolio) {
        // Set initial state: locked from clicks
        gsap.set(portfolio, { opacity: 0, pointerEvents: "none" });

        scrollTimeline.to(portfolio, {
          opacity: 1,
          pointerEvents: "auto",
          duration: 0.4,
          ease: "power1.out",
        }, 0.05);
      }
    });

    // Highly performant ResizeObserver to recalculate ScrollTrigger markers on browser zoom shifts
    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    
    resizeObserver.observe(spacer);
    if (videoContainerRef.current) {
      resizeObserver.observe(videoContainerRef.current);
    }

    // Clean up ScrollTrigger, matchMedia context and ResizeObserver on unmount
    return () => {
      resizeObserver.disconnect();
      mm.revert();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === spacer) {
          trigger.kill();
        }
      });
    };
  }, [hasEntered, isMuted, portfolioRef]);

  return (
    <>
      {/* Theatrical Entry Splash Card */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#030712] px-6 text-center select-none"
          >
            <div className="absolute w-[350px] h-[350px] bg-accent-cinematic/2 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="max-w-md flex flex-col items-center relative z-10"
            >
              <div className="text-[10px] tracking-[0.4em] font-semibold text-yellow-500 mb-4 uppercase">
                AI ENGINEER
              </div>

              <h1 className="font-display font-black text-4xl md:text-5xl tracking-[0.2em] text-white uppercase mb-8">
                SHIVAM PATHAK
              </h1>

              <button
                onClick={handleEnterExperience}
                className="group relative overflow-hidden px-7 py-3 rounded-lg text-[10px] font-bold tracking-[0.2em] text-white border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-98 flex items-center space-x-2 cursor-pointer focus:outline-none"
              >
                <Sparkles className="w-3.5 h-3.5 text-white/60" />
                <span className="relative z-10">{"LET'S GO →"}</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Immersive Fixed Video Container (Scroll Pinned) */}
      <div
        ref={videoContainerRef}
        className="fixed top-0 left-0 w-full h-screen z-40 overflow-hidden bg-background-cinematic pointer-events-none"
      >
        {/* Soft static GPU-optimized ambient glow */}
        <div 
          className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-20"
          style={{
            background: "radial-gradient(circle at center, rgba(109, 40, 217, 0.08) 0%, rgba(217, 119, 6, 0.03) 50%, transparent 100%)",
          }}
        />

        <video
          ref={videoRef}
          src={videoSrc}
          loop
          playsInline
          onError={handleVideoError}
          className="w-full h-full object-cover brightness-[0.35] scale-100 block"
          style={{ 
            willChange: "transform, opacity",
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden",
          }}
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 w-full h-full bg-radial-vignette pointer-events-none bg-gradient-to-t from-background-cinematic via-transparent to-transparent" />

        {/* Small floating HUD controls (bottom right) */}
        {hasEntered && (
          <div className="absolute bottom-6 right-6 md:right-12 z-50 flex items-center space-x-4 pointer-events-auto">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-accent-cinematic/70 hover:border-accent-cinematic/40 flex items-center justify-center text-white transition-all duration-300 focus:outline-none active:scale-90 cursor-pointer"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>

            {/* Mute/Unmute Button */}
            <button
              onClick={toggleMute}
              className={`w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center text-white transition-all duration-300 focus:outline-none active:scale-90 cursor-pointer ${
                isMuted
                  ? "bg-black/60 border-white/10 hover:bg-white/15"
                  : "bg-white text-black border-white hover:bg-white/90"
              }`}
              aria-label={isMuted ? "Unmute sound" : "Mute sound"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* 4. Dedicated Scroll Spacer Track (Triggers the transition) */}
      {hasEntered && (
        <div ref={spacerRef} className="relative w-full h-[15vh] bg-transparent pointer-events-none" />
      )}
    </>
  );
}
