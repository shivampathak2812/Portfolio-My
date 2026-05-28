"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import Particles from "./Particles";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // GSAP Entrance Timeline Sequence for Typographic reveals
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Hide all typography and CTA buttons initially for smooth entry
      gsap.set([title1Ref.current, title2Ref.current], { y: 80, opacity: 0 });
      gsap.set(taglineRef.current, { opacity: 0, letterSpacing: "0.15em" });
      gsap.set(subtitleRef.current, { y: 25, opacity: 0 });
      gsap.set(buttonsRef.current, { y: 20, opacity: 0 });
      gsap.set(scrollIndicatorRef.current, { y: 20, opacity: 0 });

      // Trigger stagger entrance
      tl.to(taglineRef.current, { opacity: 1, letterSpacing: "0.25em", duration: 1.4, delay: 0.2 })
        .to(title1Ref.current, { y: 0, opacity: 1, duration: 1.5 }, "-=0.8")
        .to(title2Ref.current, { y: 0, opacity: 1, duration: 1.5 }, "-=1.2")
        .to(subtitleRef.current, { y: 0, opacity: 1, duration: 1.2 }, "-=1.0")
        .to(buttonsRef.current, { y: 0, opacity: 1, duration: 1.0 }, "-=0.8")
        .to(scrollIndicatorRef.current, { y: 0, opacity: 1, duration: 1.2 }, "-=0.8");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.querySelector("#about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[100svh] min-h-[600px] py-24 md:py-32 flex items-center justify-start bg-transparent overflow-hidden px-6 md:px-12 lg:px-24"
    >
      {/* LAYER 1: WebGL Floating Cinematic Particles Canvas Overlay */}
      <div className="absolute inset-0 w-full h-full z-15 pointer-events-none">
        <Particles />
      </div>

      {/* LAYER 2: Overlay Animated Portfolio Text & Brand Narrative */}
      <div className="relative z-30 max-w-5xl w-full select-none">
        {/* Tagline */}
        <div
          ref={taglineRef}
          className="text-[10px] md:text-xs tracking-[0.25em] font-semibold text-yellow-500 mb-4 uppercase inline-flex items-center space-x-2"
        >
          <span>AI ENGINEER</span>
        </div>

        {/* Stacked Giant Easing Name */}
        <h1 className="font-display font-black fluid-hero-title leading-[0.9] tracking-tight uppercase mb-6 flex flex-col">
          <span className="block overflow-hidden pb-1">
            <span ref={title1Ref} className="block text-white">
              SHIVAM
            </span>
          </span>
          <span className="block overflow-hidden py-1">
            <span
              ref={title2Ref}
              className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/50"
            >
              PATHAK
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="fluid-body-text text-white/70 max-w-xl mb-10 leading-relaxed font-light"
        >
          Building intelligent systems, modern web experiences, and scalable AI-powered products.
        </p>

        {/* CTA Glass buttons */}
        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-5"
        >
          <motion.a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
            }}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3.5 rounded-lg text-xs font-bold tracking-[0.15em] text-[#030712] bg-white border border-white text-center shadow-md hover:bg-white/90 transition-all duration-300 relative overflow-hidden"
          >
            <span className="relative z-10">VIEW PROJECTS</span>
          </motion.a>

          <motion.a
            href="/resume/Resume_Shivam.pdf"
            download="Shivam_Pathak_Resume.pdf"
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3.5 rounded-lg text-xs font-bold tracking-[0.15em] text-white border border-white/10 bg-transparent hover:bg-white/5 hover:border-white/20 text-center transition-all duration-300"
          >
            <span className="relative z-10">DOWNLOAD RESUME</span>
          </motion.a>
        </div>
      </div>

      {/* Interactive Bottom Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        onClick={scrollToAbout}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 cursor-pointer flex flex-col items-center group select-none hero-scroll-indicator"
      >
        <span className="text-[9px] tracking-[0.25em] font-medium text-white/40 group-hover:text-white transition-colors duration-300 mb-2.5">
          SCROLL
        </span>
        <div className="relative w-[1.5px] h-10 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            animate={{
              y: [-30, 30, -30],
            }}
            transition={{
              duration: 4.0,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-white/10"
          />
        </div>
      </div>
    </section>
  );
}
