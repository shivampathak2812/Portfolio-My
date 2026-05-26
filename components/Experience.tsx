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
      className="relative w-full py-28 md:py-36 bg-background-cinematic overflow-hidden px-6 md:px-12 border-b border-white/5"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-0 w-80 h-80 rounded-full bg-accent-cinematic/[0.015] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-80 h-80 rounded-full bg-accent-orange/[0.015] blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-left mb-16 md:mb-20 max-w-2xl">
          <div className="text-[10px] tracking-[0.3em] font-bold text-accent-orange mb-3 flex items-center space-x-2 text-glow-orange">
            <Terminal className="w-3.5 h-3.5" />
            <span>03 / CHRONOLOGY</span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl leading-tight text-white uppercase tracking-wide">
            Professional <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-cinematic to-accent-orange">Experience</span>.
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
          <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-accent-cinematic via-accent-orange to-transparent pointer-events-none" />

          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="relative group text-left"
            >
              {/* Timeline Connector Node */}
              <div
                className={`absolute -left-[31px] md:-left-[55px] top-1.5 w-4 h-4 rounded-full border-2 bg-[#0B0F19] transition-all duration-500 z-10 flex items-center justify-center ${
                  exp.accentColor === "orange"
                    ? "border-accent-orange group-hover:bg-accent-orange shadow-lg shadow-accent-orange/40"
                    : "border-accent-cinematic group-hover:bg-accent-cinematic shadow-lg shadow-accent-cinematic/40"
                }`}
              />

              {/* Hover Tilt Glass Timeline Node Card */}
              <div className="p-6 md:p-8 rounded-2xl glass-panel border border-white/5 hover:border-white/15 transition-all duration-500 relative group overflow-hidden">
                {/* Accent flare glow in card background */}
                <div
                  className={`absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-5 blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none ${
                    exp.accentColor === "orange" ? "bg-accent-orange" : "bg-accent-cinematic"
                  }`}
                />

                {/* Header: Role, Duration, and Location */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-2.5 rounded-xl border transition-all duration-300 ${
                        exp.accentColor === "orange"
                          ? "bg-accent-orange/10 border-accent-orange/20 text-accent-orange"
                          : "bg-accent-cinematic/10 border-accent-cinematic/20 text-accent-cinematic"
                      }`}
                    >
                      {exp.icon}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base md:text-lg tracking-wide text-white uppercase group-hover:text-glow-accent transition-all duration-300">
                        {exp.role}
                      </h3>
                      <p
                        className={`text-xs font-semibold tracking-wider ${
                          exp.accentColor === "orange" ? "text-accent-orange" : "text-accent-cinematic"
                        }`}
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
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          exp.accentColor === "orange" ? "text-accent-orange/60" : "text-accent-cinematic/60"
                        }`}
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
