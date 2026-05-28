"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, CheckCircle2, Terminal } from "lucide-react";

interface TimelineItem {
  role: string;
  company: string;
  duration: string;
  icon: React.ReactNode;
  description: string[];
  skills: string[];
  accentColor: string; // "purple" or "orange"
}

export default function Experience() {
  const experiences: TimelineItem[] = [
    {
      role: "AI Engineer Intern",
      company: "Northcorp Software (Remote)",
      duration: "Jan 2026 - PRESENT",
      icon: <Briefcase className="w-5 h-5" />,
      accentColor: "purple",
      description: [
        "Built 10+ REST API endpoints for AI-powered Talent Assessment Platform (TAP) using FastAPI and PostgreSQL — skill gap analysis, resume generation, and cover letter automation.",
        "Developed LLM features using Google Gemini API and RAG pipelines; managed PostgreSQL schema with SQLAlchemy async ORM, 5+ Alembic migrations, MinIO storage, and JWT + bcrypt auth.",
        "Deployed services via Docker Compose; contributed across design, development, and testing using GitLab workflow.",
      ],
      skills: [
        "FastAPI",
        "PostgreSQL",
        "Google Gemini API",
        "RAG Pipelines",
        "SQLAlchemy ORM",
        "Alembic",
        "MinIO",
        "Docker Compose",
        "GitLab Workflow",
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  return (
    <section
      id="experience"
      className="relative w-full fluid-py-section bg-background-cinematic overflow-hidden px-6 md:px-12 border-b border-white/5"
    >
      {/* Background Ambient Glows - Quiet Desaturated Blur */}
      <div className="absolute top-1/3 left-0 w-80 h-80 rounded-full bg-white/[0.005] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-80 h-80 rounded-full bg-white/[0.003] blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-left mb-16 md:mb-20 max-w-2xl">
          <div className="text-[10px] tracking-[0.3em] font-semibold text-white/40 mb-3 flex items-center space-x-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>03 / CHRONOLOGY</span>
          </div>
          <h2 className="font-display font-bold fluid-section-title leading-tight text-white uppercase tracking-wide">
            Professional <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">Experience</span>.
          </h2>
        </div>

        {/* Timeline Vector Structure */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative pl-6 md:pl-12 border-l border-white/10 space-y-12 max-w-4xl mx-auto"
        >
          {/* Full vertical timeline vector line overlay */}
          <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none" />

          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="relative group text-left"
            >
              {/* Timeline Connector Node */}
              <div
                className="absolute -left-[30px] md:-left-[54px] top-2.5 w-3 h-3 rounded-full border border-white/20 bg-[#030712] transition-all duration-300 z-10 group-hover:bg-white group-hover:border-white"
              />

              {/* Hover Tilt Glass Timeline Node Card */}
              <div className="p-6 md:p-8 rounded-2xl glass-panel border border-white/5 hover:border-white/10 transition-all duration-500 relative group overflow-hidden">
                {/* Accent flare glow in card background */}
                <div
                  className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-[0.015] blur-2xl group-hover:scale-110 transition-transform duration-500 pointer-events-none bg-white"
                />

                {/* Header: Role, Duration, and Location */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                  <div className="flex items-start space-x-4">
                    <div
                      className="p-2.5 rounded-xl border transition-all duration-300 bg-white/[0.02] border-white/5 text-white/80"
                    >
                      {exp.icon}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base md:text-lg tracking-wide text-white uppercase transition-all duration-300">
                        {exp.role}
                      </h3>
                      <p
                        className="text-xs font-semibold tracking-wider text-white/50"
                      >
                        {exp.company}
                      </p>
                    </div>
                  </div>

                  {/* Date badge */}
                  <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.02] border border-white/5 text-[9px] tracking-wider font-semibold text-white/50 w-fit self-start md:self-center">
                    <Calendar className="w-3 h-3" />
                    <span>{exp.duration}</span>
                  </div>
                </div>

                {/* Achievements List */}
                <ul className="space-y-3 mb-6 text-xs md:text-sm text-white/60 font-light leading-relaxed">
                  {exp.description.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start space-x-3">
                      <CheckCircle2
                        className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/30"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Specialized Skill Badges Row */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-md text-[9px] font-medium tracking-wide uppercase bg-white/[0.03] border border-white/5 text-white/40"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
