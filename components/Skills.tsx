"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Brain, Database, Server, Settings, Terminal } from "lucide-react";

interface SkillItem {
  name: string;
}

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: SkillItem[];
  accentColor: string; // Tailored glow color class e.g., 'accent-cinematic' or 'accent-orange'
}

// 1. Unified Skill Card Component with Localized Cursor Spotlight Glow
function SkillCard({ category, idx }: { category: SkillCategory; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty("--card-mouse-x", `${x}px`);
    card.style.setProperty("--card-mouse-y", `${y}px`);
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      variants={itemVariants}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -2, scale: 1.002 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative rounded-2xl glass-panel border border-white/5 p-6 md:p-8 cursor-pointer select-none overflow-hidden group"
      style={{
        perspective: "1000px",
      }}
    >
      {/* Dynamic Cursor Spotlight Overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(
            220px circle at var(--card-mouse-x, 0px) var(--card-mouse-y, 0px),
            ${category.accentColor === "orange" ? "rgba(217, 119, 6, 0.04)" : "rgba(109, 40, 217, 0.04)"},
            rgba(59, 130, 246, 0.01) 50%,
            transparent 100%
          )`,
        }}
      />

      {/* Decorative Corner Glow */}
      <div
        className={`absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-10 blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none ${
          category.accentColor === "orange" ? "bg-accent-orange" : "bg-accent-cinematic"
        }`}
      />

      {/* Card Contents */}
      <div className="relative z-10">
        {/* Header Icon + Name */}
        <div className="flex items-center space-x-4 mb-6">
          <div
            className="p-3 rounded-xl border transition-all duration-300 bg-white/[0.02] border-white/5 text-white/80 group-hover:bg-white/5 group-hover:border-white/10"
          >
            {category.icon}
          </div>
          <h3 className="font-display font-bold text-sm tracking-[0.2em] text-white uppercase">
            {category.title}
          </h3>
        </div>

        {/* Bullet Skills Badges Grid */}
        <div className="flex flex-wrap gap-2.5">
          {category.skills.map((skill) => (
            <div
              key={skill.name}
              className="px-3.5 py-2 rounded-lg text-xs font-light text-white/70 bg-white/[0.02] border border-white/[0.04] group-hover:bg-white/[0.04] group-hover:border-white/[0.08] group-hover:text-white transition-all duration-300 flex items-center space-x-1.5"
            >
              <span
                className="w-1 h-1 rounded-full bg-white/30 group-hover:bg-white/60"
              />
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const categories: SkillCategory[] = [
    {
      title: "AI, ML & GenAI",
      icon: <Brain className="w-5 h-5" />,
      accentColor: "purple",
      skills: [
        { name: "LLM Integration" },
        { name: "Generative AI" },
        { name: "Google Gemini API" },
        { name: "RAG Pipelines" },
        { name: "NLP & TF-IDF" },
        { name: "Supervised Learning" },
        { name: "Model Evaluation" },
      ],
    },
    {
      title: "Data Science & Analysis",
      icon: <Database className="w-5 h-5" />,
      accentColor: "orange",
      skills: [
        { name: "Python & C++" },
        { name: "Pandas & NumPy" },
        { name: "Scikit-Learn" },
        { name: "Feature Engineering" },
        { name: "Exploratory Data Analysis" },
        { name: "Data Preprocessing" },
        { name: "Matplotlib & Seaborn" },
      ],
    },
    {
      title: "Databases & Backend",
      icon: <Server className="w-5 h-5" />,
      accentColor: "purple",
      skills: [
        { name: "FastAPI & REST APIs" },
        { name: "PostgreSQL & MySQL" },
        { name: "SQLAlchemy (Async ORM)" },
        { name: "Alembic Migrations" },
        { name: "MinIO Storage" },
        { name: "Pydantic Validation" },
      ],
    },
    {
      title: "Tools & DevOps",
      icon: <Settings className="w-5 h-5" />,
      accentColor: "orange",
      skills: [
        { name: "Docker & Docker Compose" },
        { name: "Git, GitHub & GitLab" },
        { name: "JWT & bcrypt" },
        { name: "Swagger API Docs" },
        { name: "VS Code & Jupyter" },
        { name: "Power BI & Excel" },
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  return (
    <section
      id="skills"
      className="relative w-full py-28 md:py-36 bg-background-cinematic overflow-hidden px-6 md:px-12 border-b border-white/5"
    >
      {/* Atmospheric glow blobs */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent-cinematic/[0.02] blur-[150px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-left mb-16 md:mb-20 max-w-2xl">
          <div className="text-[10px] tracking-[0.3em] font-semibold text-white/40 mb-3 flex items-center space-x-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>02 / SKILL MATRIX</span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl leading-tight text-white uppercase tracking-wide">
            Expertise & <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">Technologies</span>.
          </h2>
        </div>

        {/* Skill Matrix Staggered Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category, idx) => (
            <SkillCard key={category.title} category={category} idx={idx} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
