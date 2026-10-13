"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import IntroOverlay from "@/components/IntroOverlay";
import Experience from "@/components/Experience";

// Chatbot is a large, interaction-only widget — split it into its own client bundle
const Chatbot = dynamic(() => import("@/components/Chatbot"), { ssr: false });
// In-page resume viewer modal (pdf.js itself is lazy-loaded on first open)
const ResumeViewer = dynamic(() => import("@/components/ResumeViewer"), { ssr: false });

export default function HomePage() {
  return (
    <>
      {/* 1. First-visit video intro (skippable, remembered, replayable) */}
      <IntroOverlay />

      {/* 2. Portfolio content */}
      <div id="portfolio-content" className="relative z-10 flex flex-col flex-1">
        {/* Glassmorphic Global Navbar */}
        <Navbar />

        {/* Main Content Sections */}
        <main className="flex-grow">
          {/* Centred hero with the intro video avatar */}
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

