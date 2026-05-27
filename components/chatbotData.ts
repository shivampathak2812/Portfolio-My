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
      highlights: "Leverages NLP parsing and Groq LLaMA 3 to score resumes against job descriptions, suggesting bullet point improvements."
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

// High-fidelity local NLP fallback engine for zero-dependency execution
export function queryLocalRAG(query: string, history: { role: string; content: string }[]): RAGResponse {
  const q = query.toLowerCase();

  // 1. Resume Download / CV query
  if (q.includes("resume") || q.includes("cv") || q.includes("download")) {
    return {
      answer: "I would be glad to help with that! I am initiating a direct download of **Shivam Pathak's Professional PDF Resume** for you right now. You can review his certifications, full academics, and internships in detail.",
      actions: [
        { label: "Download Resume 📄", type: "download", target: "/resume/Shivam-Resume.pdf" }
      ]
    };
  }

  // 2. 30-Second Summary / Who is Shivam
  if (q.includes("summarize") || q.includes("summary") || q.includes("30 seconds") || q.includes("who is") || q.includes("about shivam") || q.includes("intro")) {
    return {
      answer: `Here is a high-level **30-second executive summary** of Shivam:\n\n*   **Internship Experience:** He is currently an **AI Engineer Intern** at **Northcorp Software**, where he builds async REST endpoints in **FastAPI** and designs **RAG pipelines** using the **Google Gemini API**.\n*   **Core Skillsets:** High-performance Backend development (PostgreSQL, SQLAlchemy, Alembic, Docker) and artificial intelligence agents.\n*   **Academics:** Pursuing his B.Tech in CSE at **Graphic Era Hill University** (expected graduation 2026) with a **6.88 CGPA** and key accomplishments like a **TCS NQT Top 10%** selection.\n\nWould you like me to scroll down and show you his detailed skills or experience?`,
      actions: [
        { label: "View Experience 💼", type: "scroll", target: "#experience" },
        { label: "View Skills ⚡", type: "scroll", target: "#skills" }
      ]
    };
  }

  // 3. Experience / Internship Section
  if (q.includes("experience") || q.includes("internship") || q.includes("northcorp") || q.includes("work") || q.includes("job")) {
    const details = KNOWLEDGE_BASE.experience.details.map(d => `* ${d}`).join("\n");
    return {
      answer: `Shivam is currently employed as an **AI Engineer Intern** at **Northcorp Software** (Remote, Jan 2026 - Present).\n\n**Key Achievements:**\n${details}\n\n**Internship Tech Stack:**\n\`${KNOWLEDGE_BASE.experience.skills.join(", ")}\`.\n\nI have automatically scrolled your window to his timeline below to see it in style!`,
      actions: [
        { label: "Go to Experience Timeline 💼", type: "scroll", target: "#experience" }
      ]
    };
  }

  // 4. Skills / Tech stack Section
  if (q.includes("skills") || q.includes("skills matrix") || q.includes("technologies") || q.includes("fastapi") || q.includes("python") || q.includes("gemini") || q.includes("docker") || q.includes("databases")) {
    return {
      answer: `Shivam's technical proficiency is balanced across AI engineering and modern backends:\n\n*   **AI/ML & GenAI:** Google Gemini API, LLaMA 3, Retrieval-Augmented Generation (RAG) pipelines, NLP, Scikit-Learn, Pandas, NumPy.\n*   **Backend & DBs:** FastAPI, Python, PostgreSQL, SQLAlchemy Async ORM, Alembic migrations, Redis Caching, MinIO object storage, JWT secure auth.\n*   **Tools & DevOps:** Docker Compose, GitLab workflow, Git/GitHub, Linux Bash, Excel analytical modeling.\n\nI have scrolled the page directly to his interactive spotlight skill grid below!`,
      actions: [
        { label: "Go to Skills Spotlight ⚡", type: "scroll", target: "#skills" }
      ]
    };
  }

  // 5. Education Section
  if (q.includes("education") || q.includes("university") || q.includes("btech") || q.includes("cgpa") || q.includes("college") || q.includes("degree")) {
    const achievements = KNOWLEDGE_BASE.education.achievements.map(a => `* ${a}`).join("\n");
    return {
      answer: `Shivam is pursuing a **B.Tech in Computer Science and Engineering** at **Graphic Era Hill University, Dehradun** (2022 - 2026) where he maintains a **6.88 CGPA**.\n\n**Academic Highlights:**\n${achievements}\n\nI have shifted your focus down to his academic credentials panel!`,
      actions: [
        { label: "Go to Education 🎓", type: "scroll", target: "#education" }
      ]
    };
  }

  // 6. Project specific queries
  // 6a. TravelArt
  if (q.includes("travelart") || q.includes("travel art") || q.includes("travel")) {
    const proj = KNOWLEDGE_BASE.projects[0];
    return {
      answer: `**TravelArt** is Shivam's flagship AI project! It is a fully featured travel itinerary platform:\n\n*   **Core Feature:** Generates daily travel schedules using **Groq LLaMA 3.3** based on user parameters, supporting dynamic route edits.\n*   **Backend:** Powered by **FastAPI**, with **PostgreSQL** storage, **Redis caching** (reducing query latency by 60%), and **JWT + OTP** dual-layer authentication.\n\nI've scrolled down to his project grid. Check out the TravelArt dashboard and code!`,
      actions: [
        { label: "Go to Projects Grid 🧭", type: "scroll", target: "#projects" },
        { label: "View TravelArt Code 🐙", type: "link", target: proj.github }
      ]
    };
  }

  // 6b. ATS-Pro-Analyzer
  if (q.includes("ats") || q.includes("ats-pro") || q.includes("ats pro") || q.includes("resume analyzer") || q.includes("analyzer")) {
    const proj = KNOWLEDGE_BASE.projects[1];
    return {
      answer: `**ATS-Pro-Analyzer** is an intelligent HR tech platform built by Shivam:\n\n*   **Core Feature:** Compares candidate resumes with specific job roles, outputting a precise score, keyword gap map, and targeted bullet recommendations.\n*   **Tech Stack:** FastAPI, Groq LLaMA-3, Natural Language Processing (NLP), secure JWT auth.\n\nI've scrolled the screen to show you this card in the Projects showcase!`,
      actions: [
        { label: "Go to Projects Grid 🧭", type: "scroll", target: "#projects" },
        { label: "View ATS-Pro Code 🐙", type: "link", target: proj.github }
      ]
    };
  }

  // 6c. House Price Prediction
  if (q.includes("house") || q.includes("house price") || q.includes("real estate") || q.includes("prediction")) {
    const proj = KNOWLEDGE_BASE.projects[2];
    return {
      answer: `**House Price Prediction** is a machine learning analytics project:\n\n*   **Description:** Performs statistical price estimation using Regression algorithms in Python.\n*   **Tech Stack:** Scikit-Learn, Pandas, NumPy, Matplotlib, Jupyter Notebooks.\n*   **Feature:** Implements outlier detection, correlation analysis, and regression modeling to predict property valuations.\n\nTake a look at the model code on GitHub!`,
      actions: [
        { label: "Go to Projects Grid 🧭", type: "scroll", target: "#projects" },
        { label: "View ML Code 🐙", type: "link", target: proj.github }
      ]
    };
  }

  // 6d. General Projects Query
  if (q.includes("projects") || q.includes("portfolio projects") || q.includes("travelart") || q.includes("calculator") || q.includes("dashboard")) {
    return {
      answer: `Shivam has designed **7 distinct software projects** matching his resume competencies:\n\n1.  **TravelArt:** LLaMA 3.3 & FastAPI itinerary planner.\n2.  **ATS-Pro-Analyzer:** NLP-based resume optimization portal.\n3.  **House Price Prediction:** Machine learning regression pricing model.\n4.  **Courier Partner App:** Python & FastAPI logistics coordinator.\n5.  **Matrix Calculator:** Responsive Javascript NxN algebra portal.\n6.  **Zomato Dashboard:** Excel analytic KPIs for 197K+ food delivery records.\n7.  **Exploratory Data Analysis:** Python, Pandas, and Seaborn statistical engine.\n\nI have auto-scrolled your viewport to his project card deck. Feel free to explore details, click cards, or browse code repositories!`,
      actions: [
        { label: "Go to Projects Showcase 🧭", type: "scroll", target: "#projects" }
      ]
    };
  }

  // 6e. Matrix Calculator
  if (q.includes("matrix") || q.includes("calculator")) {
    const proj = KNOWLEDGE_BASE.projects[4];
    return {
      answer: `The **Matrix Calculator** is a responsive web application for algebraic computation:\n\n*   **Capability:** Solves complex NxN matrix equations (multiplication, transposition, determinants, inversion) in real-time.\n*   **Tech Stack:** Clean JavaScript (ES6), HTML5, CSS3, utilizing glassmorphic styles.\n\nExplore the web calculator code directly!`,
      actions: [
        { label: "Go to Projects Grid 🧭", type: "scroll", target: "#projects" },
        { label: "View Calculator Code 🐙", type: "link", target: proj.github }
      ]
    };
  }

  // 6f. Zomato Dashboard
  if (q.includes("zomato") || q.includes("excel") || q.includes("dashboard")) {
    const proj = KNOWLEDGE_BASE.projects[5];
    return {
      answer: `The **Zomato Dashboard** showcases Shivam's business intelligence and analysis capability:\n\n*   **Summary:** Analyzes a large-scale database containing 197,000+ food delivery entries to map market trends.\n*   **Tech Stack:** Excel, Pivot calculations, KPI mapping, data slicers, dynamic diagrams.\n\nInspect the spreadsheet formulas and dashboards on his repo!`,
      actions: [
        { label: "Go to Projects Grid 🧭", type: "scroll", target: "#projects" },
        { label: "View Zomato Repo 🐙", type: "link", target: proj.github }
      ]
    };
  }

  // 6g. Courier Partner App
  if (q.includes("courier") || q.includes("partner") || q.includes("logistics") || q.includes("truck")) {
    const proj = KNOWLEDGE_BASE.projects[3];
    return {
      answer: `The **Courier Partner App** is a responsive backend tracking and logistics application:\n\n*   **Summary:** Optimizes delivery routing and logs dispatch states.\n*   **Tech Stack:** FastAPI, Python, SQLAlchemy ORM, and REST endpoints.\n\nView the logistics architecture!`,
      actions: [
        { label: "Go to Projects Grid 🧭", type: "scroll", target: "#projects" },
        { label: "View Courier Code 🐙", type: "link", target: proj.github }
      ]
    };
  }

  // 6h. Exploratory Data Analysis
  if (q.includes("exploratory") || q.includes("eda") || q.includes("analysis") || q.includes("seaborn") || q.includes("matplotlib")) {
    const proj = KNOWLEDGE_BASE.projects[6];
    return {
      answer: `The **Exploratory Data Analysis** project focuses on core mathematical patterns and data engineering:\n\n*   **Summary:** Employs visualization models to uncover correlation spikes and outliers.\n*   **Tech Stack:** Python, Pandas, NumPy, Matplotlib, Seaborn.\n\nBrowse through the EDA plots and notebooks!`,
      actions: [
        { label: "Go to Projects Grid 🧭", type: "scroll", target: "#projects" },
        { label: "View EDA GitHub 🐙", type: "link", target: proj.github }
      ]
    };
  }

  // 7. Contact query
  if (q.includes("contact") || q.includes("email") || q.includes("gmail") || q.includes("phone") || q.includes("hire") || q.includes("github") || q.includes("linkedin")) {
    return {
      answer: `You can connect with Shivam Pathak directly through the following channels:\n\n*   **Email:** shivampathak.ai@gmail.com (You can click his contact console to copy it instantly!)\n*   **GitHub:** [github.com/shivampathak2812](https://github.com/shivampathak2812)\n*   **LinkedIn:** Available in his official resume profile.\n\nI have smoothly scrolled the window to his contact console terminal at the bottom of the page!`,
      actions: [
        { label: "Go to Contact Console ✉️", type: "scroll", target: "#contact" }
      ]
    };
  }

  // 8. Dynamic Follow-ups and Memory Helpers
  // If the user says "what tech stack" and the last question was about travelart
  const lastUserMsg = history.length >= 2 ? history[history.length - 2].content.toLowerCase() : "";
  if (q.includes("tech stack") || q.includes("technologies") || q.includes("what code")) {
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

  // 9. Generic Default / Fallback Guide
  return {
    answer: "Hi! I am **Shivam's AI Assistant**. I can help you explore his skills, B.Tech credentials, and 7 core software projects.\n\n**Ask me questions like:**\n*   *\"Can you summarize Shivam in 30 seconds?\"*\n*   *\"Tell me about the TravelArt AI travel itinerary project!\"*\n*   *\"Where did he intern? What did he build there?\"*\n*   *\"Download his official PDF resume.\"*\n\nFeel free to explore or use the Voice mode microphone in the chat box!",
    actions: [
      { label: "Summarize Shivam ⏱️", type: "scroll", target: "trigger:summary" },
      { label: "Show AI Projects 🧭", type: "scroll", target: "#projects" }
    ]
  };
}
