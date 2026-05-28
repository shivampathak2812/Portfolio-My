// Shared Knowledge Database for Shivam Pathak's AI Portfolio Assistant

export interface ChatAction {
  label: string;
  type: "scroll" | "download" | "link";
  target: string;
}

export interface RAGResponse {
  answer: string;
  actions?: ChatAction[];
}

export const KNOWLEDGE_BASE = {
  bio: {
    summary30s: "Shivam Pathak is an AI Engineer Intern at Northcorp Software with a strong foundation in building production-ready AI agents, LLM pipelines (RAG), and scalable backends. He leverages technologies like FastAPI, PostgreSQL, Google Gemini API, LangChain, and Docker to construct highly responsive enterprise portals. He is also a B.Tech CSE candidate from Graphic Era Hill University with a 6.88 CGPA.",
    professional: "Shivam specializes in bridging AI/ML models with clean, high-performance backends. His focus lies in GenAI engineering, semantic document parsing (RAG pipelines), and asynchronous database management (SQLAlchemy ORM). He is fully equipped to hit the ground running in fast-paced software teams building next-generation intelligent applications.",
  },
  experience: {
    role: "AI Engineer Intern",
    company: "Northcorp Software (Remote)",
    duration: "Jan 2026 - Present",
    details: [
      "Built 10+ REST API endpoints for AI-powered Talent Assessment Platform (TAP) using FastAPI and PostgreSQL, managing skill gap analysis, resume generation, and cover letter automation.",
      "Developed LLM features using Google Gemini API and RAG pipelines; managed PostgreSQL schemas with SQLAlchemy async ORMs, 5+ Alembic migrations, MinIO storage, and secure JWT + bcrypt authentication.",
      "Deployed microservices using Docker Compose and successfully engineered workflows across design, development, and testing via GitLab."
    ],
    skills: ["FastAPI", "PostgreSQL", "Google Gemini API", "RAG Pipelines", "SQLAlchemy ORM", "Alembic", "MinIO", "Docker Compose", "GitLab Workflow"]
  },
  projects: [
    {
      title: "TravelArt",
      description: "An AI-powered full-stack travel itinerary platform featuring secure JWT + OTP authentication and dynamic AI trip modification.",
      techStack: "FastAPI, React, PostgreSQL, Redis, Groq LLaMA 3.3, JWT + OTP",
      github: "https://github.com/shivampathak2812/TravelART.git",
      highlights: "Integrates Groq LLaMA 3.3 to construct custom day-by-day travel routes, utilizing Redis caching to reduce latency by 60%."
    },
    {
      title: "ATS-Pro-Analyzer",
      description: "An AI-powered ATS Resume Analyzer to optimize resume content for maximum Applicant Tracking System compatibility.",
      techStack: "FastAPI, Groq LLaMA-3, NLP, JWT Auth, Resume ATS",
      github: "https://github.com/shivampathak2812/ATS-Pro-Analyzer.git",
      highlights: "Leverages NLP parsing and Groq LLaMA 3 to score resumes against job roles, suggesting bullet point improvements."
    },
    {
      title: "House Price Prediction",
      description: "A Machine Learning-based real-estate price prediction and predictive analytics application.",
      techStack: "Python, Scikit-Learn, Pandas, NumPy, Regression Models, EDA",
      github: "https://github.com/shivampathak2812/Machine_learning.git",
      highlights: "Implements regression models (Scikit-Learn) with statistical outlier removal and feature engineering using Pandas and NumPy."
    },
    {
      title: "Courier Partner App",
      description: "A modern courier management application with optimized delivery workflows and responsive logistics tracking.",
      techStack: "FastAPI, Python, Logistics routing, REST API, Database ORM",
      github: "https://github.com/shivampathak2812/courier_partner.git",
      highlights: "Saves dispatch routing logs via SQLAlchemy ORM, delivering real-time delivery status tracking for logistics managers."
    },
    {
      title: "Matrix Calculator",
      description: "A responsive NxN Matrix Calculator supporting dynamic matrix algebra operations with premium glassmorphic visual designs.",
      techStack: "HTML5, CSS3, JavaScript ES6, Matrix Algebra, Glassmorphism",
      github: "https://github.com/shivampathak2812/matrix_calculator.git",
      highlights: "Engineers client-side Matrix multiplication, transposition, determinants, and inversion with zero external dependencies."
    },
    {
      title: "Zomato Dashboard",
      description: "A dynamic Zomato Excel Dashboard to analyze 197K+ food delivery records and generate key operational business insights.",
      techStack: "Excel Analytics, KPI Dashboards, Pivot Tables, Data Visualization",
      github: "https://github.com/shivampathak2812/Zomato-Dashboard.git",
      highlights: "Organizes massive unstructured CSV data using advanced pivot calculations, interactive slicers, and KPI mapping."
    },
    {
      title: "Exploratory Data Analysis",
      description: "A statistical data analysis project mapping core distributions and variables to extract patterns and correlations.",
      techStack: "Python, Pandas, NumPy, Matplotlib, Seaborn, Statistical EDA",
      github: "https://github.com/shivampathak2812",
      highlights: "Creates heatmap matrices, scatter patterns, and statistical summaries to translate datasets into strategic insights."
    }
  ],
  skills: {
    aiml: ["Google Gemini API", "LLaMA 3/3.3", "RAG Pipelines", "Scikit-Learn", "NLP", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
    backend: ["FastAPI", "Python", "PostgreSQL", "SQLAlchemy ORM", "Alembic", "Redis", "MinIO", "JWT + bcrypt Auth", "REST APIs"],
    tools: ["Docker Compose", "Git", "GitLab Workflow", "Git/GitHub", "Linux Bash", "Excel (KPI Dashboards, Pivot Tables)"]
  },
  education: {
    institution: "Graphic Era Hill University, Dehradun",
    degree: "B.Tech in Computer Science and Engineering",
    duration: "2022 - 2026",
    cgpa: "6.88 / 10.0",
    achievements: [
      "Shortlisted as a Top 10% candidate in TCS NQT 2025.",
      "Completed Google Cloud GenAI Certification.",
      "Completed Python Development Program by Cognifyz Technologies.",
      "Represented the university in the National Basketball Championship."
    ]
  }
};

// ─────────────────────────────────────────────────────────────────
// Intent-based scoring engine for accurate local fallback responses
// ─────────────────────────────────────────────────────────────────

interface IntentMatch {
  intent: string;
  score: number;
}

function scoreIntent(queryText: string): IntentMatch {
  // 1. Clean typos and punctuation
  const cleanQ = queryText.toLowerCase().trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, " ") // replace punctuation with spaces
    .replace(/\s+/g, " ");

  // Typo/Spell checking dictionary
  const spellingMap: { [key: string]: string } = {
    "proejct": "project",
    "proejcts": "project",
    "projct": "project",
    "projcts": "project",
    "porject": "project",
    "porjects": "project",
    "peoject": "project",
    "peojects": "project",
    "prjct": "project",
    "prjcts": "project",
    "skillz": "skill",
    "skil": "skill",
    "skils": "skill",
    "skills": "skill",
    "expeirnce": "experience",
    "experince": "experience",
    "exprience": "experience",
    "experienc": "experience",
    "internshp": "internship",
    "resum": "resume",
    "resumee": "resume",
    "educaton": "education",
    "colg": "college",
    "universty": "university",
    "conatct": "contact",
    "contct": "contact",
    "travelart": "travelart",
    "travel-art": "travelart",
    "ats-pro": "ats",
    "atspro": "ats"
  };

  const words = cleanQ.split(" ").filter(w => w.length > 0);
  const correctedWords = words.map(w => spellingMap[w] || w);
  
  // Stemming function for robust singular/plural mapping
  const stemWord = (w: string): string => {
    if (w.endsWith("ies")) {
      return w.slice(0, -3) + "y";
    }
    if (w.endsWith("es") && !w.endsWith("ces") && !w.endsWith("ses") && !w.endsWith("x")) {
      return w.slice(0, -2);
    }
    if (w.endsWith("s") && !w.endsWith("ss") && !w.endsWith("is") && !w.endsWith("us") && w.length > 2) {
      return w.slice(0, -1);
    }
    return w;
  };

  const stemmedWords = correctedWords.map(stemWord);

  const intents: { intent: string; keywords: string[][]; boost: string[][]; exclude: string[]; weight: number }[] = [
    // Greetings — catch "hi", "hello", "hey" but NOT if combined with substantive words
    {
      intent: "greeting",
      keywords: [["hello"], ["hi"], ["hey"], ["good", "morning"], ["good", "evening"], ["howdy"], ["hola"], ["how", "are", "you"], ["how", "r", "u"]],
      boost: [],
      exclude: ["project", "skill", "experience", "resume", "summarize", "education", "contact", "travelart", "ats"],
      weight: 1
    },
    {
      intent: "chitchat_thanks",
      keywords: [["thank", "you"], ["thanks"], ["thx"], ["thank", "u"], ["appreciate"]],
      boost: [],
      exclude: [],
      weight: 3
    },
    {
      intent: "chitchat_compliment",
      keywords: [["nice"], ["awesome"], ["great"], ["cool"], ["wow"], ["good"], ["excellent"], ["superb"], ["amazing"]],
      boost: [],
      exclude: ["experience", "project", "skill", "resume"],
      weight: 2
    },
    {
      intent: "chitchat_confirm",
      keywords: [["ok"], ["okay"], ["fine"], ["sure"], ["yep"], ["yes"], ["understood"]],
      boost: [],
      exclude: ["project", "resume", "experience"],
      weight: 2
    },
    {
      intent: "chitchat_bye",
      keywords: [["bye"], ["goodbye"], ["see", "ya"], ["talk", "later"], ["exit"]],
      boost: [],
      exclude: [],
      weight: 3
    },
    {
      intent: "chitchat_feeling",
      keywords: [["i", "am", "fine"], ["i'm", "fine"], ["im", "fine"], ["i", "am", "good"], ["i'm", "good"], ["im", "good"], ["doing", "good"], ["doing", "great"], ["doing", "well"]],
      boost: [],
      exclude: ["project", "skill", "experience"],
      weight: 3
    },
    {
      intent: "chitchat_name",
      keywords: [["what", "is", "your", "name"], ["what's", "your", "name"], ["whats", "your", "name"], ["who", "are", "you"], ["your", "name"]],
      boost: [["name"], ["called"]],
      exclude: ["shivam", "project", "skill"],
      weight: 4
    },
    {
      intent: "chitchat_joke",
      keywords: [["joke"], ["make", "me", "laugh"], ["funny"], ["humor"]],
      boost: [],
      exclude: ["project", "skill"],
      weight: 3
    },
    {
      intent: "chitchat_capabilities",
      keywords: [["what", "can", "you", "do"], ["what", "do", "you", "do"], ["help", "me"], ["how", "can", "you", "help"], ["capabilities"], ["features"]],
      boost: [["help"], ["assist"]],
      exclude: ["shivam", "project"],
      weight: 3
    },
    {
      intent: "chitchat_weather",
      keywords: [["weather"], ["temperature"], ["rain"], ["sunny"]],
      boost: [],
      exclude: [],
      weight: 3
    },
    {
      intent: "chitchat_age",
      keywords: [["how", "old", "are", "you"], ["your", "age"], ["when", "were", "you", "born"], ["when", "were", "you", "created"]],
      boost: [],
      exclude: ["shivam"],
      weight: 3
    },
    {
      intent: "chitchat_creator",
      keywords: [["who", "made", "you"], ["who", "created", "you"], ["who", "built", "you"], ["who", "designed", "you"], ["who", "developed", "you"]],
      boost: [],
      exclude: [],
      weight: 4
    },
    {
      intent: "chitchat_favorite",
      keywords: [["favorite"], ["favourite"], ["what", "do", "you", "like"], ["your", "favorite"]],
      boost: [],
      exclude: ["project", "skill"],
      weight: 2
    },
    // Resume / CV download
    {
      intent: "resume",
      keywords: [["resume"], ["cv"], ["pdf"]],
      boost: [["download"]],
      exclude: ["summarize", "summary", "explain", "describe", "tell", "what", "overview"],
      weight: 3
    },
    // 30-second summary / who is Shivam
    {
      intent: "summary",
      keywords: [["summarize"], ["summary"], ["30", "second"], ["who", "is", "shivam"], ["about", "shivam"], ["introduce"], ["introduction"], ["brief"], ["overview"]],
      boost: [["30s"], ["overview"], ["resume"]],
      exclude: [],
      weight: 3
    },
    // Work experience / internship
    {
      intent: "experience",
      keywords: [["experience"], ["internship"], ["northcorp"], ["work"], ["job"], ["role"], ["where", "does", "he", "work"]],
      boost: [["intern"], ["employed"], ["company"]],
      exclude: [],
      weight: 3
    },
    // Technical skills
    {
      intent: "skills",
      keywords: [["skill"], ["technology"], ["tech", "stack"], ["techstack"], ["capability"], ["proficiency"], ["programming"], ["language"]],
      boost: [["fastapi"], ["python"], ["docker"], ["gemini"], ["database"], ["redis"], ["postgresql"]],
      exclude: [],
      weight: 3
    },
    // Education
    {
      intent: "education",
      keywords: [["education"], ["university"], ["btech"], ["b.tech"], ["cgpa"], ["college"], ["degree"], ["graphic", "era"], ["academic"], ["certification"]],
      boost: [["graduation"], ["gpa"]],
      exclude: [],
      weight: 3
    },
    // Contact info
    {
      intent: "contact",
      keywords: [["contact"], ["email"], ["gmail"], ["phone"], ["hire"], ["reach"], ["connect"], ["link"], ["github"], ["linkedin"], ["profile"], ["social"]],
      boost: [],
      exclude: [],
      weight: 3
    },
    // SPECIFIC PROJECT INTENTS
    {
      intent: "project_travelart",
      keywords: [["travelart"], ["travel", "art"], ["travel", "itinerary"], ["travel", "project"], ["travel", "app"]],
      boost: [["travel"]],
      exclude: [],
      weight: 5
    },
    {
      intent: "project_ats",
      keywords: [["ats"], ["ats-pro"], ["ats", "pro"], ["resume", "analyzer"], ["applicant", "tracking"]],
      boost: [],
      exclude: [],
      weight: 5
    },
    {
      intent: "project_houseprice",
      keywords: [["house", "price"], ["house", "prediction"], ["real", "estate"], ["price", "prediction"]],
      boost: [["regression"], ["scikit"]],
      exclude: [],
      weight: 5
    },
    {
      intent: "project_courier",
      keywords: [["courier"], ["logistics"], ["delivery", "tracking"]],
      boost: [],
      exclude: [],
      weight: 5
    },
    {
      intent: "project_matrix",
      keywords: [["matrix", "calculator"], ["matrix"], ["nxn", "matrix"]],
      boost: [["determinant"], ["transposition"]],
      exclude: [],
      weight: 5
    },
    {
      intent: "project_zomato",
      keywords: [["zomato"], ["food", "delivery", "dashboard"]],
      boost: [["pivot"]],
      exclude: [],
      weight: 5
    },
    {
      intent: "project_eda",
      keywords: [["exploratory", "data", "analysis"], ["eda"]],
      boost: [["seaborn"], ["matplotlib"], ["heatmap"]],
      exclude: [],
      weight: 4
    },
    // GENERAL PROJECTS
    {
      intent: "projects_all",
      keywords: [["project"], ["build"], ["built"], ["creation"], ["showcase"], ["portfolio"]],
      boost: [["showcase"], ["portfolio"]],
      exclude: [],
      weight: 2
    }
  ];

  let bestIntent = "fallback";
  let bestScore = 0;

  for (const entry of intents) {
    let score = 0;

    // Check if any keyword sub-array matches (all elements of sub-array must match query words)
    for (const kwArray of entry.keywords) {
      const allMatched = kwArray.every(kwWord => {
        const stemmedKw = stemWord(kwWord);
        return stemmedWords.includes(stemmedKw);
      });
      if (allMatched) {
        score += entry.weight;
      }
    }

    // Check boost
    for (const bkwArray of entry.boost) {
      const allMatched = bkwArray.every(bkwWord => {
        const stemmedBkw = stemWord(bkwWord);
        return stemmedWords.includes(stemmedBkw);
      });
      if (allMatched) {
        score += 1;
      }
    }

    // Check exclusion (if any excluded word matches stemmed query, heavily penalize)
    for (const exkw of entry.exclude) {
      const stemmedEx = stemWord(exkw);
      if (stemmedWords.includes(stemmedEx)) {
        score -= 10;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestIntent = entry.intent;
    }
  }

  return { intent: bestIntent, score: bestScore };
}

// High-fidelity local NLP fallback engine for zero-dependency execution
export function queryLocalRAG(query: string, history: { role: string; content: string }[]): RAGResponse {
  const q = query.toLowerCase().trim();

  // Run scored intent matching
  const { intent } = scoreIntent(q);

  switch (intent) {

    case "greeting":
      return {
        answer: "Hi! 👋 I'm doing great, how are you doing today? I'm **Shivam's AI Portfolio Assistant**!\n\nI can tell you all about his projects, technical skills, work experience, education, and more.\n\n**Try asking me:**\n*   *\"Tell me about his projects\"*\n*   *\"Summarize Shivam in 30 seconds\"*\n*   *\"What is his work experience?\"*\n*   *\"Download his resume\"*",
        actions: [
          { label: "Summarize Shivam ⏱️", type: "scroll", target: "trigger:summary" },
          { label: "Show AI Projects 🧭", type: "scroll", target: "#projects" },
          { label: "Download Resume 📄", type: "download", target: "/resume/Resume_Shivam.pdf" }
        ]
      };

    case "chitchat_thanks":
      return {
        answer: "You're very welcome! 😊 I'm always happy to help you navigate Shivam's credentials. Let me know if you want to know about his projects, experience, or anything else!",
        actions: [
          { label: "Show Projects 🧭", type: "scroll", target: "#projects" },
          { label: "Download Resume 📄", type: "download", target: "/resume/Resume_Shivam.pdf" }
        ]
      };

    case "chitchat_compliment":
      return {
        answer: "Thank you so much! Shivam puts a lot of dedication, high-fidelity effort, and clean engineering into all his work. ⚡\n\nWhat would you like to explore next? His work experience, technical skills, or AI projects?",
        actions: [
          { label: "View Projects 🧭", type: "scroll", target: "#projects" },
          { label: "View Skills ⚡", type: "scroll", target: "#skills" }
        ]
      };

    case "chitchat_confirm":
      return {
        answer: "Awesome! 👍 Let me know whenever you're ready to check out his AI projects, backend skills, or download his resume.",
        actions: [
          { label: "Summarize Shivam ⏱️", type: "scroll", target: "trigger:summary" },
          { label: "Download Resume 📄", type: "download", target: "/resume/Resume_Shivam.pdf" }
        ]
      };

    case "chitchat_bye":
      return {
        answer: "Goodbye! It was great chatting with you today. Have an amazing day ahead, and don't hesitate to reach out to Shivam directly at **pathakshivam3738@gmail.com**! 👋",
        actions: [
          { label: "Email Shivam ✉️", type: "link", target: "mailto:pathakshivam3738@gmail.com" }
        ]
      };

    case "chitchat_feeling":
      return {
        answer: "That's wonderful to hear! 😄 Glad you're doing well. Now, shall I tell you something interesting about Shivam's AI projects or his work experience at Northcorp? I've got some cool stuff to show you! 🚀",
        actions: [
          { label: "Summarize Shivam ⏱️", type: "scroll", target: "trigger:summary" },
          { label: "Show AI Projects 🧭", type: "scroll", target: "#projects" }
        ]
      };

    case "chitchat_name":
      return {
        answer: "I'm **Avix** — Shivam Pathak's intelligent portfolio concierge! 🤖✨ I was built to help recruiters, collaborators, and visitors explore Shivam's work, skills, and achievements. Think of me as your personal guide to his professional profile.\n\n**Ask me anything** about his projects, experience, education, or skills!",
        actions: [
          { label: "Summarize Shivam ⏱️", type: "scroll", target: "trigger:summary" },
          { label: "Show Skills ⚡", type: "scroll", target: "#skills" }
        ]
      };

    case "chitchat_joke":
      return {
        answer: "Here's one for you! 😂\n\nWhy do programmers prefer dark mode?\n\nBecause **light attracts bugs!** 🐛💡\n\nHaha, but seriously — Shivam doesn't just squash bugs, he builds entire AI systems! Want to see his work?",
        actions: [
          { label: "Show AI Projects 🧭", type: "scroll", target: "#projects" },
          { label: "View TravelArt 🐙", type: "link", target: "https://github.com/shivampathak2812/TravelART.git" }
        ]
      };

    case "chitchat_capabilities":
      return {
        answer: "Great question! Here's what I can do for you: 🎯\n\n*   📋 **Summarize** Shivam's profile in 30 seconds\n*   💼 **Explain** his work experience at Northcorp Software\n*   🧭 **Navigate** you to any section of this portfolio\n*   📄 **Download** his professional resume as a PDF\n*   🔍 **Deep dive** into any of his 7 projects\n*   ⚡ **List** his technical skills and certifications\n*   🎤 **Voice mode** — just tap the mic and talk to me!\n\nI'll also highlight and scroll to the relevant sections for you automatically!",
        actions: [
          { label: "Summarize Shivam ⏱️", type: "scroll", target: "trigger:summary" },
          { label: "Show AI Projects 🧭", type: "scroll", target: "#projects" },
          { label: "Download Resume 📄", type: "download", target: "/resume/Resume_Shivam.pdf" }
        ]
      };

    case "chitchat_weather":
      return {
        answer: "I wish I could check the weather for you! ☀️🌧️ But I'm specialized in navigating Shivam's portfolio — think of me as an indoor assistant! 😄\n\nHow about I show you something cool instead? Like his **TravelArt** project that actually helps plan trips with AI? 🌍",
        actions: [
          { label: "See TravelArt 🧭", type: "scroll", target: "#projects" },
          { label: "View TravelArt Code 🐙", type: "link", target: "https://github.com/shivampathak2812/TravelART.git" }
        ]
      };

    case "chitchat_age":
      return {
        answer: "I was born just recently — freshly coded and deployed! 🤖✨ Unlike traditional chatbots, I'm powered by **LLaMA 3** and a custom **RAG pipeline** built by Shivam himself.\n\nI might be young, but I know everything about Shivam's career! Want to learn more?",
        actions: [
          { label: "Summarize Shivam ⏱️", type: "scroll", target: "trigger:summary" },
          { label: "View Skills ⚡", type: "scroll", target: "#skills" }
        ]
      };

    case "chitchat_creator":
      return {
        answer: "I was proudly built by **Shivam Pathak** himself! 🛠️✨ He designed me using a **FastAPI backend**, a **ChromaDB vector database** for semantic search, and **Groq LLaMA 3.3** as my brain.\n\nPretty cool, right? He built an AI assistant right into his portfolio! That's the kind of innovative engineer he is. 🚀",
        actions: [
          { label: "View His Skills ⚡", type: "scroll", target: "#skills" },
          { label: "Contact Shivam ✉️", type: "scroll", target: "#contact" }
        ]
      };

    case "chitchat_favorite":
      return {
        answer: "If I had to pick a favorite, I'd say I love talking about **TravelArt** — it's Shivam's flagship AI project that combines LLaMA 3.3, Redis caching, and a beautiful React frontend! 🌍✈️\n\nBut honestly, all 7 of his projects are impressive in their own way. Want me to walk you through them?",
        actions: [
          { label: "Show All Projects 🧭", type: "scroll", target: "#projects" },
          { label: "View TravelArt 🐙", type: "link", target: "https://github.com/shivampathak2812/TravelART.git" }
        ]
      };

    case "resume":
      return {
        answer: "I would be glad to help with that! I am initiating a direct download of **Shivam Pathak's Professional PDF Resume** for you right now. You can review his certifications, full academics, and internships in detail.",
        actions: [
          { label: "Download Resume 📄", type: "download", target: "/resume/Resume_Shivam.pdf" }
        ]
      };

    case "summary":
      return {
        answer: `Here is a high-level **30-second executive summary** of Shivam:\n\n*   **Internship Experience:** He is currently an **AI Engineer Intern** at **Northcorp Software**, where he builds async REST endpoints in **FastAPI** and designs **RAG pipelines** using the **Google Gemini API**.\n*   **Core Skillsets:** High-performance Backend development (PostgreSQL, SQLAlchemy, Alembic, Docker) and artificial intelligence agents.\n*   **Academics:** Pursuing his B.Tech in CSE at **Graphic Era Hill University** (expected graduation 2026) with a **6.88 CGPA** and key accomplishments like a **TCS NQT Top 10%** selection.\n\nWould you like me to scroll down and show you his detailed skills or experience?`,
        actions: [
          { label: "View Experience 💼", type: "scroll", target: "#experience" },
          { label: "View Skills ⚡", type: "scroll", target: "#skills" }
        ]
      };

    case "experience": {
      const details = KNOWLEDGE_BASE.experience.details.map(d => `* ${d}`).join("\n");
      return {
        answer: `Shivam is currently employed as an **AI Engineer Intern** at **Northcorp Software** (Remote, Jan 2026 - Present).\n\n**Key Achievements:**\n${details}\n\n**Internship Tech Stack:**\n\`${KNOWLEDGE_BASE.experience.skills.join(", ")}\`.\n\nI have automatically scrolled your window to his timeline below to see it in style!`,
        actions: [
          { label: "Go to Experience Timeline 💼", type: "scroll", target: "#experience" }
        ]
      };
    }

    case "skills":
      return {
        answer: `Shivam's technical proficiency is balanced across AI engineering and modern backends:\n\n*   **AI/ML & GenAI:** Google Gemini API, LLaMA 3, Retrieval-Augmented Generation (RAG) pipelines, NLP, Scikit-Learn, Pandas, NumPy.\n*   **Backend & DBs:** FastAPI, Python, PostgreSQL, SQLAlchemy Async ORM, Alembic migrations, Redis Caching, MinIO object storage, JWT secure auth.\n*   **Tools & DevOps:** Docker Compose, GitLab workflow, Git/GitHub, Linux Bash, Excel analytical modeling.\n\nI have scrolled the page directly to his interactive spotlight skill grid below!`,
        actions: [
          { label: "Go to Skills Spotlight ⚡", type: "scroll", target: "#skills" }
        ]
      };

    case "education": {
      const achievements = KNOWLEDGE_BASE.education.achievements.map(a => `* ${a}`).join("\n");
      return {
        answer: `Shivam is pursuing a **B.Tech in Computer Science and Engineering** at **Graphic Era Hill University, Dehradun** (2022 - 2026) where he maintains a **6.88 CGPA**.\n\n**Academic Highlights:**\n${achievements}\n\nI have shifted your focus down to his academic credentials panel!`,
        actions: [
          { label: "Go to Education 🎓", type: "scroll", target: "#education" }
        ]
      };
    }

    case "contact":
      return {
        answer: `You can connect with Shivam Pathak directly through the following channels:\n\n*   **Email:** pathakshivam3738@gmail.com (You can click his contact console to copy it instantly!)\n*   **GitHub:** [github.com/shivampathak2812](https://github.com/shivampathak2812)\n*   **LinkedIn:** [linkedin.com/in/shivam-pathak-9a76ba246](https://linkedin.com/in/shivam-pathak-9a76ba246)\n\nI have smoothly scrolled the window to his contact console terminal at the bottom of the page!`,
        actions: [
          { label: "Go to Contact Console ✉️", type: "scroll", target: "#contact" }
        ]
      };

    // ── SPECIFIC PROJECT RESPONSES ──

    case "project_travelart": {
      const proj = KNOWLEDGE_BASE.projects[0];
      return {
        answer: `**TravelArt** is Shivam's flagship AI project! It is a fully featured travel itinerary platform:\n\n*   **Core Feature:** Generates daily travel schedules using **Groq LLaMA 3.3** based on user parameters, supporting dynamic route edits.\n*   **Backend:** Powered by **FastAPI**, with **PostgreSQL** storage, **Redis caching** (reducing query latency by 60%), and **JWT + OTP** dual-layer authentication.\n\nI've scrolled down to his project grid. Check out the TravelArt dashboard and code!`,
        actions: [
          { label: "Go to Projects Grid 🧭", type: "scroll", target: "#projects" },
          { label: "View TravelArt Code 🐙", type: "link", target: proj.github }
        ]
      };
    }

    case "project_ats": {
      const proj = KNOWLEDGE_BASE.projects[1];
      return {
        answer: `**ATS-Pro-Analyzer** is an intelligent HR tech platform built by Shivam:\n\n*   **Core Feature:** Compares candidate resumes with specific job roles, outputting a precise score, keyword gap map, and targeted bullet recommendations.\n*   **Tech Stack:** FastAPI, Groq LLaMA-3, Natural Language Processing (NLP), secure JWT auth.\n\nI've scrolled the screen to show you this card in the Projects showcase!`,
        actions: [
          { label: "Go to Projects Grid 🧭", type: "scroll", target: "#projects" },
          { label: "View ATS-Pro Code 🐙", type: "link", target: proj.github }
        ]
      };
    }

    case "project_houseprice": {
      const proj = KNOWLEDGE_BASE.projects[2];
      return {
        answer: `**House Price Prediction** is a machine learning analytics project:\n\n*   **Description:** Performs statistical price estimation using Regression algorithms in Python.\n*   **Tech Stack:** Scikit-Learn, Pandas, NumPy, Matplotlib, Jupyter Notebooks.\n*   **Feature:** Implements outlier detection, correlation analysis, and regression modeling to predict property valuations.\n\nTake a look at the model code on GitHub!`,
        actions: [
          { label: "Go to Projects Grid 🧭", type: "scroll", target: "#projects" },
          { label: "View ML Code 🐙", type: "link", target: proj.github }
        ]
      };
    }

    case "project_courier": {
      const proj = KNOWLEDGE_BASE.projects[3];
      return {
        answer: `The **Courier Partner App** is a responsive backend tracking and logistics application:\n\n*   **Summary:** Optimizes delivery routing and logs dispatch states.\n*   **Tech Stack:** FastAPI, Python, SQLAlchemy ORM, and REST endpoints.\n\nView the logistics architecture!`,
        actions: [
          { label: "Go to Projects Grid 🧭", type: "scroll", target: "#projects" },
          { label: "View Courier Code 🐙", type: "link", target: proj.github }
        ]
      };
    }

    case "project_matrix": {
      const proj = KNOWLEDGE_BASE.projects[4];
      return {
        answer: `The **Matrix Calculator** is a responsive web application for algebraic computation:\n\n*   **Capability:** Solves complex NxN matrix equations (multiplication, transposition, determinants, inversion) in real-time.\n*   **Tech Stack:** Clean JavaScript (ES6), HTML5, CSS3, utilizing glassmorphic styles.\n\nExplore the web calculator code directly!`,
        actions: [
          { label: "Go to Projects Grid 🧭", type: "scroll", target: "#projects" },
          { label: "View Calculator Code 🐙", type: "link", target: proj.github }
        ]
      };
    }

    case "project_zomato": {
      const proj = KNOWLEDGE_BASE.projects[5];
      return {
        answer: `The **Zomato Dashboard** showcases Shivam's business intelligence and analysis capability:\n\n*   **Summary:** Analyzes a large-scale database containing 197,000+ food delivery entries to map market trends.\n*   **Tech Stack:** Excel, Pivot calculations, KPI mapping, data slicers, dynamic diagrams.\n\nInspect the spreadsheet formulas and dashboards on his repo!`,
        actions: [
          { label: "Go to Projects Grid 🧭", type: "scroll", target: "#projects" },
          { label: "View Zomato Repo 🐙", type: "link", target: proj.github }
        ]
      };
    }

    case "project_eda": {
      const proj = KNOWLEDGE_BASE.projects[6];
      return {
        answer: `The **Exploratory Data Analysis** project focuses on core mathematical patterns and data engineering:\n\n*   **Summary:** Employs visualization models to uncover correlation spikes and outliers.\n*   **Tech Stack:** Python, Pandas, NumPy, Matplotlib, Seaborn.\n\nBrowse through the EDA plots and notebooks!`,
        actions: [
          { label: "Go to Projects Grid 🧭", type: "scroll", target: "#projects" },
          { label: "View EDA GitHub 🐙", type: "link", target: proj.github }
        ]
      };
    }

    // ── ALL PROJECTS — lists all 7 projects clearly ──
    case "projects_all":
      return {
        answer: `Shivam has designed **7 distinct software projects** matching his resume competencies:\n\n1.  **TravelArt:** LLaMA 3.3 & FastAPI itinerary planner.\n2.  **ATS-Pro-Analyzer:** NLP-based resume optimization portal.\n3.  **House Price Prediction:** Machine learning regression pricing model.\n4.  **Courier Partner App:** Python & FastAPI logistics coordinator.\n5.  **Matrix Calculator:** Responsive Javascript NxN algebra portal.\n6.  **Zomato Dashboard:** Excel analytic KPIs for 197K+ food delivery records.\n7.  **Exploratory Data Analysis:** Python, Pandas, and Seaborn statistical engine.\n\nI have auto-scrolled your viewport to his project card deck. Feel free to explore details, click cards, or browse code repositories!`,
        actions: [
          { label: "Go to Projects Showcase 🧭", type: "scroll", target: "#projects" }
        ]
      };

    // ── FALLBACK ──
    default: {
      // Check conversational follow-ups using history context
      const lastUserMsg = history.length >= 2 ? history[history.length - 2].content.toLowerCase() : "";
      if (q.includes("tech stack") || q.includes("technologies used") || q.includes("what code")) {
        if (lastUserMsg.includes("travelart") || lastUserMsg.includes("travel")) {
          const proj = KNOWLEDGE_BASE.projects[0];
          return {
            answer: `TravelArt was constructed using:\n*   **Backend:** FastAPI, Python, Redis (Caching/Speed), SQLAlchemy ORM.\n*   **Frontend:** React, Tailwind CSS.\n*   **AI Engine:** Groq LLaMA 3.3 model integrations.\n*   **Database:** PostgreSQL.\n\nYou can review the complete code architecture directly on his GitHub!`,
            actions: [{ label: "View TravelArt GitHub 🐙", type: "link", target: proj.github }]
          };
        }
        if (lastUserMsg.includes("ats") || lastUserMsg.includes("analyzer")) {
          const proj = KNOWLEDGE_BASE.projects[1];
          return {
            answer: `ATS-Pro-Analyzer leverages:\n*   **Core Engine:** Groq LLaMA-3, Natural Language Processing (NLP).\n*   **Backend:** FastAPI (Python), REST APIs.\n*   **Security:** JWT Token & bcrypt authentication.\n\nCheck out the GitHub repo for implementation details!`,
            actions: [{ label: "View ATS-Pro GitHub 🐙", type: "link", target: proj.github }]
          };
        }
      }

      // Professional default fallback
      return {
        answer: "I'm **Shivam's AI Portfolio Assistant** — here to help you explore everything about his profile.\n\n**Try asking me things like:**\n*   *\"Tell me about his projects\"*\n*   *\"Summarize Shivam in 30 seconds\"*\n*   *\"What is his work experience at Northcorp?\"*\n*   *\"Tell me about TravelArt\"*\n*   *\"What are his technical skills?\"*\n*   *\"Download his resume\"*\n\nI'll give you detailed, accurate answers with quick-action buttons!",
        actions: [
          { label: "Summarize Shivam ⏱️", type: "scroll", target: "trigger:summary" },
          { label: "Show AI Projects 🧭", type: "scroll", target: "#projects" }
        ]
      };
    }
  }
}
