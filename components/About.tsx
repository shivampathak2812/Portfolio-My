"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { User, Cpu, BrainCircuit } from "lucide-react";

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
      className="relative w-full fluid-py-section bg-background-cinematic overflow-hidden px-6 md:px-12 border-b border-white/5"
    >
      {/* Background Decorative Ambient Blobs */}
      <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-accent-cinematic/[0.015] blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full bg-accent-orange/[0.005] blur-[100px] pointer-events-none z-0" />

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
                  alt="Shivam Pathak Profile Photo"
                  fill
                  sizes="(max-w-768px) 100vw, 360px"
                  className="object-cover brightness-[0.9] group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                  priority
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
              className="font-display font-bold fluid-section-title leading-tight text-white mb-6 uppercase tracking-wide"
            >
              Engineering <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/60">Intelligence</span>.
            </motion.h2>

            {/* Core Narrative Paragraphs */}
            <motion.div
              variants={itemVariants}
              className="space-y-6 text-sm md:text-base text-white/70 leading-relaxed font-light mb-8"
            >
              <p>
                <strong className="text-white font-medium">AI Engineer</strong> with experience in <strong className="text-white font-medium">Python</strong>, <strong className="text-white font-medium">FastAPI</strong>, <strong className="text-white font-medium">PostgreSQL</strong>, <strong className="text-white font-medium">LLMs</strong>, <strong className="text-white font-medium">RAG</strong>, and <strong className="text-white font-medium">Machine Learning</strong>. Skilled in <strong className="text-white font-medium">Data Science</strong>, <strong className="text-white font-medium">SQL</strong>, <strong className="text-white font-medium">Scikit-learn</strong>, and <strong className="text-white font-medium">AI application development</strong>.
              </p>
            </motion.div>

            {/* Core Pillars HUD (Mini-cards) */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"
            >
              {/* Pillar 1 */}
              <div className="p-5 rounded-2xl glass-panel border border-white/5 flex items-start space-x-4">
                <div className="p-2.5 rounded-xl bg-white/[0.03] text-white/70 border border-white/10">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs tracking-[0.15em] font-bold text-white mb-1 uppercase">Machine Learning</h3>
                  <p className="text-[11px] text-white/50 leading-relaxed font-light">
                    Fine-tuning large language models, setting up semantic searches, and engineering agentic prompts.
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-5 rounded-2xl glass-panel border border-white/5 flex items-start space-x-4">
                <div className="p-2.5 rounded-xl bg-white/[0.03] text-white/70 border border-white/10">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs tracking-[0.15em] font-bold text-white mb-1 uppercase">Full-Stack Architect</h3>
                  <p className="text-[11px] text-white/50 leading-relaxed font-light">
                    Dockerized backend pipelines, highly interactive frontends, and low-latency API engines.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
