"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { FolderGit2, Github, Code2, Cpu, Users, Calculator, Truck, Home, TrendingUp, Activity } from "lucide-react";

interface Project {
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  accentClass: string; // Color key for accents
  graphic: React.ReactNode; // SVG programmatic visualization
}

export default function Projects() {
  // Memoize project data + inline SVG graphics to prevent expensive re-creation on re-renders
  const featuredProjects: Project[] = useMemo(() => [
    {
      title: "PHP Vibe Coder",
      description: "Built an AI-assisted PHP development workspace with Streamlit and Google Gemini that turns plain-English requirements into complete PHP projects, using RAG over PHP docs (Sentence Transformers + FAISS) and auto-validating code with a self-healing debug agent.",
      tags: ["Python", "Google Gemini", "RAG", "FAISS", "Streamlit", "AI Agents"],
      githubUrl: "https://github.com/shivampathak2812/PHP-VibeCoder.git",
      accentClass: "purple",
      graphic: (
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-[#030712] flex items-center justify-center p-6 overflow-hidden">
          <svg className="w-full h-full text-white/10" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="30" y="18" width="140" height="84" rx="6" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="rgba(255,255,255,0.01)" />
            <line x1="30" y1="30" x2="170" y2="30" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <circle cx="38" cy="24" r="1.5" className="fill-white/30" />
            <circle cx="44" cy="24" r="1.5" className="fill-white/20" />
            <circle cx="50" cy="24" r="1.5" className="fill-white/10" />
            <line x1="42" y1="42" x2="110" y2="42" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
            <line x1="50" y1="52" x2="130" y2="52" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            <line x1="50" y1="62" x2="100" y2="62" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            <line x1="42" y1="72" x2="90" y2="72" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
            <foreignObject x="95" y="70" width="70" height="26" className="overflow-visible">
              <div className="bg-black/70 border border-white/5 rounded px-1.5 py-1 flex items-center justify-between space-x-1">
                <span className="text-[5px] tracking-wider text-white/50 uppercase">php -l</span>
                <span className="text-[6px] font-bold text-white tracking-wide">✓ PASSED</span>
              </div>
            </foreignObject>
          </svg>
          <Code2 className="absolute top-4 right-4 w-5 h-5 text-white/20" />
        </div>
      ),
    },
    {
      title: "WorkLens",
      description: "Built an end-to-end employee attrition prediction system with an XGBoost classifier achieving 91% F1-score and 83% test accuracy, served via FastAPI with a React HR analytics dashboard.",
      tags: ["Python", "XGBoost", "FastAPI", "React", "Recharts", "HR Analytics"],
      githubUrl: "https://github.com/shivampathak2812/WorkLens.git",
      accentClass: "orange",
      graphic: (
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-[#030712] flex items-center justify-center p-6 overflow-hidden">
          <svg className="w-full h-full text-white/10" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="25" y1="100" x2="175" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
            <rect x="35" y="70" width="14" height="30" rx="2" fill="rgba(255,255,255,0.05)" />
            <rect x="57" y="55" width="14" height="45" rx="2" fill="rgba(255,255,255,0.08)" />
            <rect x="79" y="78" width="14" height="22" rx="2" fill="rgba(255,255,255,0.05)" />
            <rect x="101" y="45" width="14" height="55" rx="2" fill="rgba(255,255,255,0.12)" />
            <rect x="123" y="62" width="14" height="38" rx="2" fill="rgba(255,255,255,0.06)" />
            <foreignObject x="110" y="18" width="62" height="28" className="overflow-visible">
              <div className="bg-black/70 border border-white/5 rounded px-1 flex flex-col items-center justify-center">
                <span className="text-[4px] text-white/40 tracking-widest font-black uppercase">ATTRITION</span>
                <span className="text-[7px] font-bold text-white tracking-tighter">91% F1</span>
              </div>
            </foreignObject>
          </svg>
          <Users className="absolute top-4 left-4 w-5 h-5 text-white/20" />
        </div>
      ),
    },
    {
      title: "ATS-Pro-Analyzer",
      description: "Built an AI-powered ATS Resume Analyzer using FastAPI, NLP, Groq LLaMA-3, and JWT authentication to optimize resumes for maximum ATS compatibility.",
      tags: ["FastAPI", "Groq LLaMA-3", "NLP", "JWT Auth", "Resume ATS"],
      githubUrl: "https://github.com/shivampathak2812/ATS-Pro-Analyzer.git",
      accentClass: "orange",
      graphic: (
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-[#030712] flex items-center justify-center p-6 overflow-hidden">
          <svg className="w-full h-full text-white/10" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="50" y="15" width="100" height="90" rx="6" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
            <line x1="60" y1="35" x2="140" y2="35" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
            <line x1="60" y1="50" x2="120" y2="50" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
            <line x1="60" y1="65" x2="130" y2="65" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
            <line x1="45" y1="55" x2="155" y2="55" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
            <foreignObject x="110" y="65" width="45" height="32" className="overflow-visible">
              <div className="bg-black/75 border border-white/5 rounded p-1 flex flex-col items-center justify-center">
                <span className="text-[4px] text-white/40 tracking-widest font-black uppercase">ATS</span>
                <span className="text-[7px] font-bold text-white tracking-tighter">92% MATCH</span>
              </div>
            </foreignObject>
            <Cpu className="absolute top-4 right-4 w-5 h-5 text-white/20" />
          </svg>
        </div>
      ),
    },
    {
      title: "House Price Prediction",
      description: "Built a Machine Learning-based House Price Prediction system using Python, Pandas, NumPy, and Scikit-learn for predictive analytics and real-estate price estimation.",
      tags: ["Python", "Scikit-Learn", "Pandas", "NumPy", "Regression", "EDA"],
      githubUrl: "https://github.com/shivampathak2812/Machine_learning.git",
      accentClass: "purple",
      graphic: (
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-[#030712] flex items-center justify-center p-6 overflow-hidden">
          <svg className="w-full h-full text-white/10" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
            <line x1="20" y1="20" x2="20" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
            <line x1="20" y1="90" x2="170" y2="30" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="2,2" />
            <circle cx="40" cy="85" r="2.5" className="fill-white/30" />
            <circle cx="70" cy="70" r="2.5" className="fill-white/20" />
            <circle cx="100" cy="55" r="2.5" className="fill-white/40" />
            <circle cx="130" cy="48" r="2.5" className="fill-white/20" />
            <circle cx="160" cy="35" r="2.5" className="fill-white/30" />
            <foreignObject x="25" y="25" width="58" height="26" className="overflow-visible">
              <div className="bg-black/70 border border-white/5 rounded px-1 flex flex-col items-center justify-center">
                <span className="text-[4px] text-white/40 tracking-widest font-black uppercase">REAL-ESTATE</span>
                <span className="text-[7px] font-bold text-white tracking-tighter">$485K EST.</span>
              </div>
            </foreignObject>
            <Home className="absolute bottom-4 right-4 w-5 h-5 text-white/20" />
          </svg>
        </div>
      ),
    },
    {
      title: "Courier Partner App",
      description: "Developed a modern courier management application with optimized delivery workflow, responsive UI, and scalable backend architecture for efficient logistics management.",
      tags: ["FastAPI", "Python", "Logistics", "REST API", "Database ORM"],
      githubUrl: "https://github.com/shivampathak2812/courier_partner.git",
      accentClass: "orange",
      graphic: (
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-[#030712] flex items-center justify-center p-6 overflow-hidden">
          <svg className="w-full h-full text-white/10" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="40" r="3" className="fill-white/20" />
            <circle cx="150" cy="40" r="3" className="fill-white/20" />
            <circle cx="100" cy="80" r="3" className="fill-white/30" />
            <line x1="50" y1="40" x2="100" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1="150" y1="40" x2="100" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <foreignObject x="50" y="20" width="100" height="30" className="overflow-visible">
              <div className="bg-black/60 border border-white/5 rounded-md px-1.5 py-1 flex items-center justify-center space-x-1">
                <span className="text-[5px] font-bold text-white/60 tracking-widest uppercase">STATUS: COMPLETED</span>
              </div>
            </foreignObject>
          </svg>
          <Truck className="absolute w-8 h-8 text-white/10" />
        </div>
      ),
    },
    {
      title: "Matrix Calculator",
      description: "Built a responsive Matrix Calculator using HTML, CSS, and JavaScript (ES6) supporting dynamic NxN matrix operations with optimized performance and glassmorphism UI.",
      tags: ["HTML5", "CSS3", "JavaScript ES6", "Matrix Algebra", "Glassmorphism"],
      githubUrl: "https://github.com/shivampathak2812/matrix_calculator.git",
      accentClass: "purple",
      graphic: (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 to-[#0B0F19] flex items-center justify-center p-6 overflow-hidden">
          <div className="w-full h-full flex flex-col justify-center items-center font-mono opacity-25 select-none">
            <div className="text-[9px] text-accent-cinematic tracking-widest">[ 1  0  3 ]</div>
            <div className="text-[9px] text-white/50 tracking-widest my-1">[ 0  1  2 ]</div>
            <div className="text-[9px] text-accent-orange tracking-widest">[ 4  2  1 ]</div>
          </div>
          <foreignObject x="55" y="45" width="90" height="30" className="overflow-visible">
            <div className="bg-black/65 border border-white/10 rounded-md p-1 flex items-center justify-center space-x-2 backdrop-blur-sm shadow-md">
              <Calculator className="w-3.5 h-3.5 text-white/40" />
              <span className="text-[6px] font-bold text-white tracking-wider">N × N CALCULATOR</span>
            </div>
          </foreignObject>
        </div>
      ),
    },
    {
      title: "Zomato Dashboard",
      description: "Built a dynamic Zomato Excel Dashboard using Pivot Tables, KPI cards, slicers, and charts to analyze 197K+ food delivery records and generate business insights.",
      tags: ["Excel Analytics", "KPI Dashboards", "Pivot Tables", "Data Visualization", "Data Analytics"],
      githubUrl: "https://github.com/shivampathak2812/Zomato-Dashboard.git",
      accentClass: "orange",
      graphic: (
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-[#030712] flex items-center justify-center p-6 overflow-hidden">
          <svg className="w-full h-full text-white/10" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="40" height="30" rx="3" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.05)" />
            <rect x="80" y="20" width="40" height="30" rx="3" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.05)" />
            <rect x="140" y="20" width="40" height="30" rx="3" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.05)" />
            <circle cx="40" cy="35" r="4" fill="none" stroke="rgba(255,255,255,0.2)" />
            <line x1="88" y1="30" x2="112" y2="30" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" />
            <line x1="88" y1="38" x2="105" y2="38" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
            <line x1="148" y1="30" x2="172" y2="30" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" />
            <line x1="148" y1="38" x2="162" y2="38" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
            <foreignObject x="45" y="70" width="110" height="30" className="overflow-visible">
              <div className="bg-black/70 border border-white/5 rounded px-1.5 py-1 text-center">
                <span className="text-[5px] text-white/50 tracking-widest font-black uppercase">197K+ RECORDS</span>
              </div>
            </foreignObject>
            <TrendingUp className="absolute top-4 right-4 w-5 h-5 text-white/20" />
          </svg>
        </div>
      ),
    },
    {
      title: "Exploratory Data Analysis",
      description: "Performed Exploratory Data Analysis (EDA) using Python, Pandas, NumPy, Matplotlib, and Seaborn to analyze data patterns, correlations, and distributions to generate business insights.",
      tags: ["Python", "Pandas & NumPy", "Matplotlib", "Seaborn", "Statistical EDA", "Business Insights"],
      githubUrl: "https://github.com/shivampathak2812",
      accentClass: "purple",
      graphic: (
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-[#030712] flex items-center justify-center p-6 overflow-hidden">
          <svg className="w-full h-full text-white/10" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y="25" width="20" height="20" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" />
            <rect x="47" y="25" width="20" height="20" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.05)" />
            <rect x="25" y="47" width="20" height="20" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.05)" />
            <rect x="47" y="47" width="20" height="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" />
            <path d="M80 85 Q 120 15 160 85" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none" />
            <line x1="75" y1="85" x2="165" y2="85" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
            <Activity className="absolute top-4 right-4 w-5 h-5 text-white/20" />
          </svg>
        </div>
      ),
    },
  ], []);

  // Container variants for elegant staggered slide-up reveals on viewport enter
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 16,
      },
    },
  };

  return (
    <section
      id="projects"
      className="relative w-full fluid-py-section bg-background-cinematic border-b border-white/5 overflow-hidden"
    >
      {/* Decorative Atmosphere Glow Blobs */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-cinematic/[0.012] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-accent-orange/[0.012] blur-[150px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-left mb-12 md:mb-16">
          <div className="text-[10px] tracking-[0.3em] font-semibold text-white/40 mb-2 flex items-center space-x-2">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>05 / PORTFOLIO</span>
          </div>
          <h2 className="font-display font-bold fluid-section-title leading-tight text-white uppercase tracking-wide">
            Featured <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">Projects</span>.
          </h2>
        </div>

        {/* Clean, high-performance responsive grid layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full mx-auto"
        >
          {featuredProjects.map((project) => {
            
            // Build custom glowing hover borders and shadows based on brand accents
            const borderGlowHover = "hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:border-white/15";

            return (
              <motion.div
                key={project.title}
                variants={cardVariants}
                className={`group rounded-2xl overflow-hidden glass-panel border border-white/5 flex flex-col h-grow cursor-pointer transition-all duration-500 hover:-translate-y-1 ${borderGlowHover}`}
              >
                {/* Widescreen Graphic Panel (16:10 aspect ratio fits SVGs beautifully) */}
                <div className="relative w-full aspect-[16/10] border-b border-white/5 overflow-hidden">
                  <div className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105">
                    {project.graphic}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/90 via-transparent to-transparent z-10" />
                </div>

                {/* Info Ledger */}
                <div className="p-5 md:p-6 flex flex-col flex-grow text-left">
                  {/* Technology badging */}
                  <div className="flex flex-wrap gap-1.5 mb-4 z-20">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md text-[7px] font-medium tracking-wide uppercase bg-white/[0.03] border border-white/5 text-white/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-sm md:text-base tracking-wide text-white uppercase mb-2 group-hover:text-glow-accent transition-all duration-300">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[10px] md:text-xs text-white/50 leading-relaxed font-light mb-4 flex-grow line-clamp-3">
                    {project.description}
                  </p>

                  {/* Action Link */}
                  <div className="flex items-center space-x-4 pt-4 border-t border-white/5 mt-auto z-20">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-[9px] font-semibold tracking-wider text-white/60 hover:text-white transition-colors duration-300 group/link"
                    >
                      <Github className="w-3.5 h-3.5 text-accent-cinematic group-hover/link:scale-110 transition-transform duration-300" />
                      <span>SOURCE</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
