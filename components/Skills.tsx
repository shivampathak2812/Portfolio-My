"use client";

import React, { useRef, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Database,
  Server,
  Settings,
  Terminal,
  Workflow,
  Code2,
  BarChart3,
  Sparkles,
  Users,
} from "lucide-react";

// Detect touch device once at module level
const IS_TOUCH = typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;

interface SkillItem {
  name: string;
}

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: SkillItem[];
  accentColor: string;
}

// One consistent skill-card treatment, with a subtle cursor spotlight on desktop.
function SkillCard({ category }: { category: SkillCategory; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (IS_TOUCH || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--card-mouse-x", `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--card-mouse-y", `${e.clientY - rect.top}px`);
  };

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      variants={itemVariants}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="relative rounded-2xl glass-panel border border-white/5 p-6 md:p-7 select-none overflow-hidden group"
      style={{ perspective: "1000px" }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(220px circle at var(--card-mouse-x, 0px) var(--card-mouse-y, 0px), ${category.accentColor === "cyan" ? "rgba(6, 182, 212, 0.07)" : "rgba(139, 92, 246, 0.07)"}, transparent 75%)`,
        }}
      />
      <div className={`absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-10 blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none ${category.accentColor === "cyan" ? "bg-accent-soft" : "bg-accent-cinematic"}`} />
      <div className="relative z-10">
        <div className="flex items-center space-x-4 mb-5">
          <div className="aurora-icon p-3 rounded-xl transition-all duration-300">
            {category.icon}
          </div>
          <h3 className="font-display font-semibold text-base md:text-lg tracking-tight text-white">
            {category.title}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {category.skills.map((skill) => (
            <span
              key={skill.name}
              className="px-3 py-2 rounded-lg text-xs font-light text-white/75 bg-white/[0.025] border border-white/[0.06] group-hover:bg-white/[0.045] group-hover:border-white/[0.1] group-hover:text-white transition-all duration-300 inline-flex items-center gap-2"
            >
              <span className="w-1 h-1 rounded-full bg-white/35 group-hover:bg-white/70" />
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const MemoizedSkillCard = React.memo(SkillCard);

export default function Skills() {
  // Categories mirror the resume so visitors see the same, scannable skill taxonomy.
  const categories: SkillCategory[] = useMemo(() => [
    {
      title: "Programming & Analytics",
      icon: <Code2 className="w-5 h-5" />,
      accentColor: "cyan",
      skills: [
        { name: "Python" },
        { name: "SQL" },
        { name: "Pandas" },
        { name: "NumPy" },
        { name: "Exploratory Data Analysis" },
        { name: "Statistics" },
        { name: "Power BI" },
        { name: "Data Cleaning" },
        { name: "Data Visualization" },
      ],
    },
    {
      title: "Machine Learning & AI",
      icon: <Brain className="w-5 h-5" />,
      accentColor: "purple",
      skills: [
        { name: "Machine Learning" },
        { name: "Scikit-learn" },
        { name: "XGBoost" },
        { name: "PyTorch" },
        { name: "Deep Learning" },
        { name: "Neural Networks" },
        { name: "Regression & Classification" },
        { name: "Clustering" },
        { name: "Feature Engineering" },
        { name: "Model Evaluation" },
      ],
    },
    {
      title: "Generative AI & LLMs",
      icon: <Sparkles className="w-5 h-5" />,
      accentColor: "purple",
      skills: [
        { name: "NLP" },
        { name: "Generative AI" },
        { name: "LLMs" },
        { name: "RAG" },
        { name: "LangGraph" },
        { name: "Gemini API" },
        { name: "FAISS" },
        { name: "Vector Databases" },
        { name: "Prompt Engineering" },
        { name: "Agentic AI" },
        { name: "MLOps" },
      ],
    },
    {
      title: "Data Pipelines",
      icon: <Workflow className="w-5 h-5" />,
      accentColor: "cyan",
      skills: [
        { name: "ETL Pipelines" },
        { name: "Apache Airflow" },
        { name: "Apache Spark (PySpark)" },
        { name: "Data Processing" },
        { name: "Data Validation" },
      ],
    },
    {
      title: "Backend & Databases",
      icon: <Server className="w-5 h-5" />,
      accentColor: "purple",
      skills: [
        { name: "FastAPI" },
        { name: "REST APIs" },
        { name: "PostgreSQL" },
        { name: "MySQL" },
        { name: "SQLAlchemy" },
        { name: "Streamlit" },
      ],
    },
    {
      title: "Tools & DevOps",
      icon: <Settings className="w-5 h-5" />,
      accentColor: "cyan",
      skills: [
        { name: "Git & GitLab" },
        { name: "Docker" },
        { name: "Jupyter Notebook" },
        { name: "VS Code" },
        { name: "Google Colab" },
      ],
    },
    {
      title: "Soft Skills",
      icon: <Users className="w-5 h-5" />,
      accentColor: "purple",
      skills: [
        { name: "Problem-Solving" },
        { name: "Communication" },
        { name: "Collaboration" },
        { name: "Teamwork" },
        { name: "Leadership" },
        { name: "Adaptability" },
      ],
    },
  ], []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  return (
    <section
      id="skills"
      className="relative w-full fluid-py-section overflow-hidden px-6 md:px-12"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-radial from-accent-cinematic/[0.02] to-transparent to-70% pointer-events-none z-0" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-left mb-12 md:mb-16 max-w-2xl">
          <div className="text-[10px] tracking-[0.3em] font-semibold text-white/40 mb-3 flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>03 / SKILL MATRIX</span>
          </div>
          <h2 className="font-display font-semibold fluid-section-title leading-tight text-white tracking-tight">
            Expertise &{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
              Technologies
            </span>
            .
          </h2>
          <p className="mt-4 text-sm md:text-base text-white/55 leading-relaxed max-w-xl">
            A structured overview of the programming, analytics, AI, data engineering, backend, and collaboration skills listed on my resume.
          </p>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {categories.map((category, idx) => (
            <MemoizedSkillCard key={category.title} category={category} idx={idx} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
