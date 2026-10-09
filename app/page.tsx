"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import CinematicIntro from "@/components/CinematicIntro";
import Experience from "@/components/Experience";

// Chatbot is a large, interaction-only widget — split it into its own client bundle
const Chatbot = dynamic(() => import("@/components/Chatbot"), { ssr: false });
// In-page resume viewer modal (pdf.js itself is lazy-loaded on first open)
const ResumeViewer = dynamic(() => import("@/components/ResumeViewer"), { ssr: false });

export default function Home() {
  const portfolioRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* 1. Fullscreen fixed cinematic video controller & ScrollTrigger scrubber */}
      <CinematicIntro portfolioRef={portfolioRef} />

      {/* 2. Actual Portfolio Content (Controlled via scroll progress, initially hidden) */}
      <div
        ref={portfolioRef}
        id="portfolio-content"
        className="relative z-50 flex flex-col flex-1 opacity-0 pointer-events-none"
        style={{ willChange: "opacity" }}
      >
        {/* Glassmorphic Global Navbar */}
        <Navbar />

        {/* Main Content Sections */}
        <main className="flex-grow">
          {/* Typographic Hero text & falling particles canvas */}
          <Hero />

          {/* Biography & portrait slide */}
          <About />

          {/* Academic credentials & milestones */}
          <Education />

          {/* Interactive spotlight skill matrix */}
          <Skills />

          {/* Professional experience chronology timeline */}
          <Experience />

          {/* Automated vector project panels */}
          <Projects />

          {/* Direct connection console terminal */}
          <Contact />
        </main>

        {/* Premium Cinematic AI Chatbot & Voice Assistant */}
        <Chatbot />
      </div>

      {/* 3. Resume viewer modal — opened from navbar, hero, contact, chatbot or /#resume */}
      <ResumeViewer />
    </>
  );
}

