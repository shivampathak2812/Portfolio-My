"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { User, Cpu, BrainCircuit } from "lucide-react";
import { GITHUB_URL, LINKEDIN_URL } from "./site";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <section
      id="about"
      className="relative w-full fluid-py-section overflow-hidden px-6 md:px-12"
    >
      {/* Background Decorative Ambient Blobs */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-radial from-accent-cinematic/[0.015] to-transparent to-70% pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-radial from-accent-soft/[0.005] to-transparent to-70% pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* Left Column: Portrait Glass Card Frame */}
          <motion.div
            variants={itemVariants}
            className="col-span-1 lg:col-span-5 flex justify-center lg:justify-start"
          >
            <motion.div
              whileHover={{ rotateY: -2, rotateX: 1, scale: 1.005 }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
              className="relative w-full max-w-[360px] aspect-[4/5] rounded-3xl p-2 glass-panel border border-white/5 shadow-xl shadow-black/40 group cursor-pointer"
              style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
            >
              {/* Outer Subtle Offset Border Accent */}
              <div className="absolute -inset-1 rounded-[30px] border border-white/5 opacity-40 group-hover:opacity-70 group-hover:border-white/10 transition-all duration-500 pointer-events-none" />

              {/* Photo Frame Container */}
              <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-background-cinematic border border-white/5">
                <Image
                  src="/images/profile.png"
                  alt="Portrait of Shivam Pathak, Data & AI Engineer"
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover brightness-[0.9] group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                />
                
                {/* Overlay vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Brand Narrative & Identity */}
          <div className="col-span-1 lg:col-span-7 flex flex-col text-left justify-center">
            {/* Section Tagline */}
            <motion.div
              variants={itemVariants}
              className="text-[10px] tracking-[0.3em] font-semibold text-white/40 mb-3 flex items-center space-x-2"
            >
              <User className="w-3.5 h-3.5" />
              <span>01 / IDENTITY</span>
            </motion.div>

            {/* Editorial Title */}
            <motion.h2
              variants={itemVariants}
              className="font-display font-semibold fluid-section-title leading-tight text-white mb-6 tracking-tight"
            >
              AI &amp; Data <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/60">Engineering</span>.
            </motion.h2>

            {/* Core Narrative Paragraphs */}
            <motion.div
              variants={itemVariants}
              className="space-y-6 text-sm md:text-base text-white/70 leading-relaxed font-light mb-8"
            >
              <p>
                I&apos;m <strong className="text-white font-medium">Shivam Pathak</strong>, a <strong className="text-white font-medium">Data & AI Engineer</strong> based in Mumbai, India, with hands-on experience in <strong className="text-white font-medium">Python</strong>, <strong className="text-white font-medium">SQL</strong>, <strong className="text-white font-medium">Machine Learning</strong>, <strong className="text-white font-medium">Data Science</strong>, <strong className="text-white font-medium">LLMs</strong>, <strong className="text-white font-medium">RAG</strong>, <strong className="text-white font-medium">FastAPI</strong>, and <strong className="text-white font-medium">PostgreSQL</strong>. Experienced in <strong className="text-white font-medium">data analysis</strong>, <strong className="text-white font-medium">ML model development</strong>, <strong className="text-white font-medium">AI applications</strong>, <strong className="text-white font-medium">REST APIs</strong>, and <strong className="text-white font-medium">data pipelines</strong>.
              </p>
            </motion.div>

            {/* Core Pillars HUD (Mini-cards) */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"
            >
              {/* Pillar 1 */}
              <div className="p-5 rounded-2xl glass-panel border border-white/5 flex items-start space-x-4">
                <div className="aurora-icon p-2.5 rounded-xl">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-sm md:text-base font-semibold tracking-tight text-white mb-1">Machine Learning</h3>
                  <p className="text-[11px] text-white/50 leading-relaxed font-light">
                    Building LLM features with the Gemini API, RAG pipelines and semantic search, plus agentic workflows with LangGraph.
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-5 rounded-2xl glass-panel border border-white/5 flex items-start space-x-4">
                <div className="aurora-icon p-2.5 rounded-xl">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-sm md:text-base font-semibold tracking-tight text-white mb-1">Full-Stack Engineering</h3>
                  <p className="text-[11px] text-white/50 leading-relaxed font-light">
                    FastAPI and PostgreSQL backends, Dockerized services, and interactive React and Streamlit frontends.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* At a glance: a plain-text, crawlable summary of who Shivam Pathak is.
                Every fact here already appears elsewhere on the site and on the resume. */}
            <motion.div
              variants={itemVariants}
              className="mt-8 rounded-2xl glass-panel border border-white/5 p-6"
            >
              <h3 className="font-display text-sm md:text-base font-semibold tracking-tight text-white mb-4">
                Shivam Pathak at a glance
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-x-6 gap-y-3 text-sm text-white/70 font-light leading-relaxed">
                <dt className="text-[11px] tracking-[0.2em] uppercase text-white/40 sm:pt-1">Role</dt>
                <dd>Trainee Engineer, Data Science &amp; AI/ML at Silicon Interfaces Pvt. Ltd., Mumbai (since July 2026).</dd>

                <dt className="text-[11px] tracking-[0.2em] uppercase text-white/40 sm:pt-1">Previously</dt>
                <dd>AI Engineer Intern at Northcorp Software (January – June 2026): FastAPI and PostgreSQL REST APIs and Gemini-powered RAG features for a talent assessment platform.</dd>

                <dt className="text-[11px] tracking-[0.2em] uppercase text-white/40 sm:pt-1">Education</dt>
                <dd>B.Tech in Computer Science and Engineering, Graphic Era Hill University (2022 – 2025).</dd>

                <dt className="text-[11px] tracking-[0.2em] uppercase text-white/40 sm:pt-1">Works with</dt>
                <dd>Python, SQL, Pandas, NumPy, Scikit-learn, XGBoost, FastAPI, PostgreSQL, Docker and the Google Gemini API.</dd>

                <dt className="text-[11px] tracking-[0.2em] uppercase text-white/40 sm:pt-1">Selected work</dt>
                <dd>
                  WorkLens, an XGBoost employee-attrition model (91% F1-score) with a FastAPI backend and React dashboard; HR Leave Assistant, a LangGraph and Gemini agent that handles leave requests; and PHP Vibe Coder, a RAG-based PHP project generator.
                </dd>

                <dt className="text-[11px] tracking-[0.2em] uppercase text-white/40 sm:pt-1">Profiles</dt>
                <dd>
                  <a href={LINKEDIN_URL} target="_blank" rel="me noopener noreferrer" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white transition-colors">LinkedIn</a>
                  {" · "}
                  <a href={GITHUB_URL} target="_blank" rel="me noopener noreferrer" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white transition-colors">GitHub</a>
                </dd>
              </dl>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
