"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen, Trophy, Terminal, Calendar, CheckCircle2 } from "lucide-react";

export default function Education() {
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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  const achievements = [
    {
      title: "TCS National Qualifier Test (NQT) 2025",
      desc: "Shortlisted for the Ninja role interview, qualifying in the Top 10% of candidates nationwide.",
      icon: <Award className="w-4 h-4 text-accent-orange" />,
      accent: "orange",
    },
    {
      title: "Google Cloud Skills Boost Certification",
      desc: "Earned certification in Generative AI Fundamentals (2024).",
      icon: <Award className="w-4 h-4 text-accent-cinematic" />,
      accent: "purple",
    },
    {
      title: "Python Development Internship Certificate",
      desc: "Completed Python development program at Cognifyz Technologies (2024).",
      icon: <BookOpen className="w-4 h-4 text-accent-orange" />,
      accent: "orange",
    },
    {
      title: "National Basketball Championship Player",
      desc: "Represented Uttarakhand state at the National Basketball Championship, demonstrating excellent teamwork, leadership, and athletic execution under pressure.",
      icon: <Trophy className="w-4 h-4 text-accent-cinematic" />,
      accent: "purple",
    },
  ];

  return (
    <section
      id="education"
      className="relative w-full py-28 md:py-36 bg-background-cinematic overflow-hidden px-6 md:px-12 border-b border-white/5"
    >
      {/* Background Decorative Ambient Blobs */}
      <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full bg-accent-cinematic/[0.01] blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full bg-accent-orange/[0.01] blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
        >
          {/* Left Column: Academic Credentials Section */}
          <div className="col-span-1 lg:col-span-6 flex flex-col text-left justify-center lg:sticky lg:top-24">
            {/* Section Tagline */}
            <motion.div
              variants={itemVariants}
              className="text-[10px] tracking-[0.3em] font-bold text-accent-cinematic mb-3 flex items-center space-x-2 text-glow-accent"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>02 / ACADEMICS</span>
            </motion.div>

            {/* Editorial Title */}
            <motion.h2
              variants={itemVariants}
              className="font-display font-bold text-3xl md:text-5xl leading-tight text-white mb-8 uppercase tracking-wide"
            >
              Education & <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-cinematic to-accent-orange">Credentials</span>.
            </motion.h2>

            {/* University Glass Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="relative p-6 md:p-8 rounded-3xl glass-panel border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden group"
            >
              {/* Inner Glowing Gradient */}
              <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-accent-cinematic/10 to-accent-orange/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-accent-cinematic/15 text-accent-cinematic border border-accent-cinematic/20">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg md:text-xl tracking-wide text-white uppercase group-hover:text-glow-accent transition-all duration-300">
                        Graphic Era Hill University
                      </h3>
                      <p className="text-xs text-white/50 font-light mt-1">Haldwani, Uttarakhand</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <span className="text-[10px] tracking-wider font-semibold text-accent-orange uppercase block mb-1">
                      Degree Program
                    </span>
                    <p className="text-sm md:text-base font-light text-white leading-relaxed">
                      Bachelor of Technology (B.Tech) in Computer Science and Engineering
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-x-8 gap-y-4 pt-2">
                    <div>
                      <span className="text-[10px] tracking-wider font-semibold text-white/40 uppercase block mb-1">
                        Timeline
                      </span>
                      <div className="flex items-center space-x-1.5 text-xs text-white/60">
                        <Calendar className="w-3.5 h-3.5 text-accent-cinematic" />
                        <span>July 2022 – June 2025</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] tracking-wider font-semibold text-white/40 uppercase block mb-1">
                        Evaluation
                      </span>
                      <div className="flex items-center space-x-1.5 text-xs text-white/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent-orange" />
                        <span className="font-mono text-white">CGPA: 6.88 / 10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Achievements & Certifications Stack */}
          <div className="col-span-1 lg:col-span-6 space-y-6 text-left">
            <motion.div
              variants={itemVariants}
              className="text-[10px] tracking-[0.2em] font-semibold text-white/40 uppercase mb-4"
            >
              Key Milestones & Certifications
            </motion.div>

            {achievements.map((ach, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ x: 6 }}
                className="p-5 rounded-2xl glass-panel border border-white/5 hover:border-white/15 transition-all duration-300 flex items-start space-x-4 group"
              >
                <div
                  className={`p-2.5 rounded-xl border transition-all duration-300 ${
                    ach.accent === "orange"
                      ? "bg-accent-orange/10 border-accent-orange/20 text-accent-orange"
                      : "bg-accent-cinematic/10 border-accent-cinematic/20 text-accent-cinematic"
                  }`}
                >
                  {ach.icon}
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-wide mb-1 group-hover:text-glow-accent transition-all duration-300">
                    {ach.title}
                  </h4>
                  <p className="text-xs text-white/50 leading-relaxed font-light">{ach.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
