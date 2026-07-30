import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# Initialize FastAPI App
app = FastAPI(title="Shivam Pathak AI Portfolio Assistant API")

# Configure CORS to allow connection from Next.js local port and Vercel domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "https://portfolio-my-ivory.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request schemas
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage]

# Import RAG Assistant dynamically to bypass error on initialization if DB isn't created yet
assistant = None

def get_assistant():
    global assistant
    if assistant is None:
        try:
            from rag_engine import PortfolioAssistant
            assistant = PortfolioAssistant()
        except Exception as e:
            print(f"Warning: Could not initialize RAG assistant: {e}")
            return None
    return assistant

@app.on_event("startup")
def startup_event():
    import threading
    # Pre-load/warmup the RAG assistant in a background thread to prevent first-request cold-start delay
    print("Warming up RAG assistant in background thread...")
    threading.Thread(target=get_assistant, daemon=True).start()

@app.get("/health")
def health_check():
    return {"status": "healthy", "engine": "FastAPI + LangChain + ChromaDB"}

@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    try:
        # Convert Pydantic history objects back to simple dicts
        history_dicts = [{"role": m.role, "content": m.content} for m in request.history]
        
        # Instantiate and query RAG assistant
        ai_assistant = get_assistant()
        if ai_assistant is not None:
            response_payload = ai_assistant.query(request.message, history_dicts)
            return response_payload
        else:
            # RAG engine not available, use local fallback
            return get_local_reply(request.message, history_dicts)
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        # Graceful fallback response
        return get_local_reply(request.message, [])


# ─────────────────────────────────────────────────────────────────
# Scored intent matching for accurate backend fallback responses
# ─────────────────────────────────────────────────────────────────

def score_intent(q: str) -> str:
    """Scores all intents and returns the best matching intent name."""
    intents = [
        {
            "intent": "greeting",
            "keywords": ["hello", "hi", "hey", "good morning", "good evening", "howdy", "hola", "hii", "how are you", "how r u", "how are you doing"],
            "boost": [],
            "exclude": ["project", "skill", "experience", "resume", "summarize", "education", "contact"],
            "weight": 1
        },
        {
            "intent": "chitchat_thanks",
            "keywords": ["thank you", "thanks", "thx", "thank u", "appreciate it"],
            "boost": [],
            "exclude": [],
            "weight": 3
        },
        {
            "intent": "chitchat_compliment",
            "keywords": ["nice", "awesome", "great", "cool", "wow", "good", "excellent", "superb", "amazing"],
            "boost": [],
            "exclude": ["experience", "project", "skill", "resume"],
            "weight": 2
        },
        {
            "intent": "chitchat_confirm",
            "keywords": ["ok", "okay", "got it", "fine", "sure", "yep", "yes", "understood"],
            "boost": [],
            "exclude": ["project", "resume", "experience"],
            "weight": 2
        },
        {
            "intent": "chitchat_bye",
            "keywords": ["bye", "goodbye", "see ya", "talk later", "exit"],
            "boost": [],
            "exclude": [],
            "weight": 3
        },
        {
            "intent": "chitchat_feeling",
            "keywords": ["i am fine", "i'm fine", "im fine", "i am good", "i'm good", "im good", "doing good", "doing great", "doing well", "not bad", "all good", "feeling good", "feeling great", "i'm doing", "am doing"],
            "boost": [],
            "exclude": ["project", "skill", "experience"],
            "weight": 3
        },
        {
            "intent": "chitchat_name",
            "keywords": ["what is your name", "what's your name", "whats your name", "who are you", "your name"],
            "boost": ["name", "called"],
            "exclude": ["shivam", "project", "skill"],
            "weight": 4
        },
        {
            "intent": "chitchat_joke",
            "keywords": ["tell me a joke", "joke", "make me laugh", "funny", "humor"],
            "boost": [],
            "exclude": ["project", "skill"],
            "weight": 3
        },
        {
            "intent": "chitchat_capabilities",
            "keywords": ["what can you do", "what do you do", "help me", "how can you help", "your capabilities", "what are you capable of", "what are your features"],
            "boost": ["help", "assist"],
            "exclude": ["shivam", "project"],
            "weight": 3
        },
        {
            "intent": "chitchat_weather",
            "keywords": ["weather", "temperature outside", "is it raining", "sunny today", "how's the weather", "hows the weather"],
            "boost": [],
            "exclude": [],
            "weight": 3
        },
        {
            "intent": "chitchat_age",
            "keywords": ["how old are you", "your age", "when were you born", "when were you made", "when were you created"],
            "boost": [],
            "exclude": ["shivam"],
            "weight": 3
        },
        {
            "intent": "chitchat_creator",
            "keywords": ["who made you", "who created you", "who built you", "who designed you", "who developed you"],
            "boost": [],
            "exclude": [],
            "weight": 4
        },
        {
            "intent": "chitchat_favorite",
            "keywords": ["favorite", "favourite", "what do you like", "do you like", "your favorite"],
            "boost": [],
            "exclude": ["project", "skill"],
            "weight": 2
        },
        {
            "intent": "resume",
            "keywords": ["resume", "cv", "download resume", "download cv", "pdf"],
            "boost": ["download"],
            "exclude": ["summarize", "summary", "explain", "describe", "tell me about", "what is in", "overview", "in simple words"],
            "weight": 3
        },
        {
            "intent": "summary",
            "keywords": ["summarize", "summary", "30 second", "who is shivam", "about shivam", "introduce", "introduction", "tell me about shivam", "who are you", "brief", "overview", "in simple words"],
            "boost": ["overview", "resume"],
            "exclude": [],
            "weight": 3
        },
        {
            "intent": "experience",
            "keywords": ["experience", "internship", "northcorp", "work experience", "job", "role", "where does he work"],
            "boost": ["intern", "employed", "company"],
            "exclude": [],
            "weight": 3
        },
        {
            "intent": "skills",
            "keywords": ["skills", "technologies", "tech stack", "what can he do", "capabilities", "proficiency", "programming languages"],
            "boost": ["fastapi", "python", "docker", "gemini", "databases", "redis", "postgresql"],
            "exclude": [],
            "weight": 3
        },
        {
            "intent": "education",
            "keywords": ["education", "university", "btech", "b.tech", "cgpa", "college", "degree", "graphic era", "academic", "certification"],
            "boost": ["graduation", "gpa"],
            "exclude": [],
            "weight": 3
        },
        {
            "intent": "contact",
            "keywords": ["contact", "email", "gmail", "phone", "hire", "reach", "connect", "link", "github", "linkedin", "profile", "social", "socials"],
            "boost": [],
            "exclude": [],
            "weight": 3
        },
        # Specific projects (higher weight)
        {
            "intent": "project_travelart",
            "keywords": ["travelart", "travel art", "travel itinerary", "travel project", "travel app"],
            "boost": ["travel"],
            "exclude": [],
            "weight": 5
        },
        {
            "intent": "project_ats",
            "keywords": ["ats", "ats-pro", "ats pro", "resume analyzer", "applicant tracking"],
            "boost": [],
            "exclude": [],
            "weight": 5
        },
        {
            "intent": "project_houseprice",
            "keywords": ["house price", "house prediction", "real estate", "price prediction"],
            "boost": ["regression", "scikit"],
            "exclude": [],
            "weight": 5
        },
        {
            "intent": "project_courier",
            "keywords": ["courier", "courier partner", "logistics", "delivery tracking"],
            "boost": [],
            "exclude": [],
            "weight": 5
        },
        {
            "intent": "project_matrix",
            "keywords": ["matrix calculator", "matrix", "nxn matrix"],
            "boost": ["determinant"],
            "exclude": [],
            "weight": 5
        },
        {
            "intent": "project_zomato",
            "keywords": ["zomato", "zomato dashboard", "food delivery dashboard"],
            "boost": ["pivot"],
            "exclude": [],
            "weight": 5
        },
        {
            "intent": "project_eda",
            "keywords": ["exploratory data analysis", "eda project", "data analysis project"],
            "boost": ["seaborn", "matplotlib", "heatmap"],
            "exclude": [],
            "weight": 4
        },
        # General projects (lower weight so specific ones win)
        {
            "intent": "projects_all",
            "keywords": ["project", "projects", "all projects", "portfolio projects", "show projects", "list projects", "his projects", "what projects", "how many projects", "what has he built", "built", "build"],
            "boost": ["showcase", "portfolio"],
            "exclude": [],
            "weight": 2
        }
    ]

    best_intent = "fallback"
    best_score = 0

    for entry in intents:
        score = 0
        for kw in entry["keywords"]:
            if kw in q:
                score += entry["weight"]
        for bkw in entry["boost"]:
            if bkw in q:
                score += 1
        # Exclusion penalty — heavily penalize if exclude words are present
        for exkw in entry["exclude"]:
            if exkw in q:
                score -= 10
        if score > best_score:
            best_score = score
            best_intent = entry["intent"]

    return best_intent


def get_local_reply(query: str, history: list) -> dict:
    """Scored intent-based local fallback for accurate responses."""
    q = query.lower().strip()
    intent = score_intent(q)

    if intent == "greeting":
        return {
            "answer": "Hi! 👋 I'm doing great, how are you doing today? I'm **Shivam's AI Portfolio Assistant**!\n\nI can tell you all about his projects, technical skills, work experience, education, and more.\n\n**Try asking me:**\n*   *\"Tell me about his projects\"*\n*   *\"Summarize Shivam in 30 seconds\"*\n*   *\"What is his work experience?\"*\n*   *\"Download his resume\"*",
            "actions": [
                {"label": "Summarize Shivam ⏱️", "type": "scroll", "target": "trigger:summary"},
                {"label": "Show AI Projects 🧭", "type": "scroll", "target": "#projects"},
                {"label": "Download Resume 📄", "type": "download", "target": "/resume/Resume_Shivam.pdf"}
            ]
        }

    if intent == "chitchat_thanks":
        return {
            "answer": "You're very welcome! 😊 I'm always happy to help you navigate Shivam's credentials. Let me know if you want to know about his projects, experience, or anything else!",
            "actions": [
                {"label": "Show Projects 🧭", "type": "scroll", "target": "#projects"},
                {"label": "Download Resume 📄", "type": "download", "target": "/resume/Resume_Shivam.pdf"}
            ]
        }

    if intent == "chitchat_compliment":
        return {
            "answer": "Thank you so much! Shivam puts a lot of dedication, high-fidelity effort, and clean engineering into all his work. ⚡\n\nWhat would you like to explore next? His work experience, technical skills, or AI projects?",
            "actions": [
                {"label": "View Projects 🧭", "type": "scroll", "target": "#projects"},
                {"label": "View Skills ⚡", "type": "scroll", "target": "#skills"}
            ]
        }

    if intent == "chitchat_confirm":
        return {
            "answer": "Awesome! 👍 Let me know whenever you're ready to check out his AI projects, backend skills, or download his resume.",
            "actions": [
                {"label": "Summarize Shivam ⏱️", "type": "scroll", "target": "trigger:summary"},
                {"label": "Download Resume 📄", "type": "download", "target": "/resume/Resume_Shivam.pdf"}
            ]
        }

    if intent == "chitchat_bye":
        return {
            "answer": "Goodbye! It was great chatting with you today. Have an amazing day ahead, and don't hesitate to reach out to Shivam directly at **pathakshivam3738@gmail.com**! 👋",
            "actions": [
                {"label": "Email Shivam ✉️", "type": "link", "target": "mailto:pathakshivam3738@gmail.com"}
            ]
        }

    if intent == "chitchat_feeling":
        return {
            "answer": "That's wonderful to hear! 😄 Glad you're doing well. Now, shall I tell you something interesting about Shivam's AI projects or his work experience at Northcorp? I've got some cool stuff to show you! 🚀",
            "actions": [
                {"label": "Summarize Shivam ⏱️", "type": "scroll", "target": "trigger:summary"},
                {"label": "Show AI Projects 🧭", "type": "scroll", "target": "#projects"}
            ]
        }

    if intent == "chitchat_name":
        return {
            "answer": "I'm **Avix** — Shivam Pathak's intelligent portfolio concierge! 🤖✨ I was built to help recruiters, collaborators, and visitors explore Shivam's work, skills, and achievements. Think of me as your personal guide to his professional profile.\n\n**Ask me anything** about his projects, experience, education, or skills!",
            "actions": [
                {"label": "Summarize Shivam ⏱️", "type": "scroll", "target": "trigger:summary"},
                {"label": "Show Skills ⚡", "type": "scroll", "target": "#skills"}
            ]
        }

    if intent == "chitchat_joke":
        return {
            "answer": "Here's one for you! 😂\n\nWhy do programmers prefer dark mode?\n\nBecause **light attracts bugs!** 🐛💡\n\nHaha, but seriously — Shivam doesn't just squash bugs, he builds entire AI systems! Want to see his work?",
            "actions": [
                {"label": "Show AI Projects 🧭", "type": "scroll", "target": "#projects"},
                {"label": "View TravelArt 🐙", "type": "link", "target": "https://github.com/shivampathak2812/TravelART.git"}
            ]
        }

    if intent == "chitchat_capabilities":
        return {
            "answer": "Great question! Here's what I can do for you: 🎯\n\n*   📋 **Summarize** Shivam's profile in 30 seconds\n*   💼 **Explain** his work experience at Northcorp Software\n*   🧭 **Navigate** you to any section of this portfolio\n*   📄 **Download** his professional resume as a PDF\n*   🔍 **Deep dive** into any of his 7 projects\n*   ⚡ **List** his technical skills and certifications\n*   🎤 **Voice mode** — just tap the mic and talk to me!\n\nI'll also highlight and scroll to the relevant sections for you automatically!",
            "actions": [
                {"label": "Summarize Shivam ⏱️", "type": "scroll", "target": "trigger:summary"},
                {"label": "Show AI Projects 🧭", "type": "scroll", "target": "#projects"},
                {"label": "Download Resume 📄", "type": "download", "target": "/resume/Resume_Shivam.pdf"}
            ]
        }

    if intent == "chitchat_weather":
        return {
            "answer": "I wish I could check the weather for you! ☀️🌧️ But I'm specialized in navigating Shivam's portfolio — think of me as an indoor assistant! 😄\n\nHow about I show you something cool instead? Like his **TravelArt** project that actually helps plan trips with AI? 🌍",
            "actions": [
                {"label": "See TravelArt 🧭", "type": "scroll", "target": "#projects"},
                {"label": "View TravelArt Code 🐙", "type": "link", "target": "https://github.com/shivampathak2812/TravelART.git"}
            ]
        }

    if intent == "chitchat_age":
        return {
            "answer": "I was born just recently — freshly coded and deployed! 🤖✨ Unlike traditional chatbots, I'm powered by **LLaMA 3** and a custom **RAG pipeline** built by Shivam himself.\n\nI might be young, but I know everything about Shivam's career! Want to learn more?",
            "actions": [
                {"label": "Summarize Shivam ⏱️", "type": "scroll", "target": "trigger:summary"},
                {"label": "View Skills ⚡", "type": "scroll", "target": "#skills"}
            ]
        }

    if intent == "chitchat_creator":
        return {
            "answer": "I was proudly built by **Shivam Pathak** himself! 🛠️✨ He designed me using a **FastAPI backend**, a **ChromaDB vector database** for semantic search, and **Groq LLaMA 3.3** as my brain.\n\nPretty cool, right? He built an AI assistant right into his portfolio! That's the kind of innovative engineer he is. 🚀",
            "actions": [
                {"label": "View His Skills ⚡", "type": "scroll", "target": "#skills"},
                {"label": "Contact Shivam ✉️", "type": "scroll", "target": "#contact"}
            ]
        }

    if intent == "chitchat_favorite":
        return {
            "answer": "If I had to pick a favorite, I'd say I love talking about **TravelArt** — it's Shivam's flagship AI project that combines LLaMA 3.3, Redis caching, and a beautiful React frontend! 🌍✈️\n\nBut honestly, all 7 of his projects are impressive in their own way. Want me to walk you through them?",
            "actions": [
                {"label": "Show All Projects 🧭", "type": "scroll", "target": "#projects"},
                {"label": "View TravelArt 🐙", "type": "link", "target": "https://github.com/shivampathak2812/TravelART.git"}
            ]
        }

    if intent == "resume":
        return {
            "answer": "I would be glad to help with that! I am initiating a direct download of **Shivam Pathak's Professional PDF Resume** for you right now. You can review his certifications, full academics, and internships in detail.",
            "actions": [{"label": "Download Resume 📄", "type": "download", "target": "/resume/Resume_Shivam.pdf"}]
        }

    if intent == "summary":
        return {
            "answer": "Here is a high-level **30-second executive summary** of Shivam:\n\n*   **Internship Experience:** He is currently an **AI Engineer Intern** at **Northcorp Software (Remote) (Freelance)**, where he builds async REST endpoints in **FastAPI** and designs **RAG pipelines** using the **Google Gemini API**.\n*   **Core Skillsets:** High-performance Backend development (PostgreSQL, SQLAlchemy, Alembic, Docker) and artificial intelligence agents.\n*   **Academics:** Graduated with a B.Tech in CSE from **Graphic Era Hill University, Haldwani** (July 2022 - June 2025) with a **6.88 CGPA** and key accomplishments like a **TCS NQT Top 10%** selection.\n\nWould you like me to scroll down and show you his detailed skills or experience?",
            "actions": [
                {"label": "View Experience 💼", "type": "scroll", "target": "#experience"},
                {"label": "View Skills ⚡", "type": "scroll", "target": "#skills"}
            ]
        }

    if intent == "experience":
        return {
            "answer": "Shivam worked as an **AI Engineer Intern** at **Northcorp Software (Remote) (Freelance)** (Jan 2026 - May 2026).\n\n**Key Achievements:**\n*   Built 10+ REST API endpoints for the Talent Assessment Platform (TAP) using FastAPI and PostgreSQL.\n*   Developed LLM features using the Google Gemini API and structured RAG pipelines.\n*   Managed PostgreSQL schema with SQLAlchemy async ORM, Alembic migrations, MinIO storage, and secure JWT auth.\n*   Successfully deployed services via Docker Compose.\n\nI have automatically scrolled your window to his timeline below to see it in style!",
            "actions": [{"label": "Go to Experience Timeline 💼", "type": "scroll", "target": "#experience"}]
        }

    if intent == "skills":
        return {
            "answer": "Shivam's technical proficiency is balanced across AI engineering and modern backends:\n\n*   **AI/ML & Generative AI:** Google Gemini API, LLaMA 3, RAG pipelines, NLP, Scikit-Learn, Pandas, NumPy, Seaborn.\n*   **Backend & DBs:** FastAPI, Python, PostgreSQL, SQLAlchemy Async ORM, Alembic migrations, Redis Caching, MinIO object storage, secure JWT auth.\n*   **Tools & DevOps:** Docker Compose, Git, GitLab Workflow, Linux Bash, Excel KPIs.\n\nI have scrolled the page directly to his skills spotlight grid below!",
            "actions": [{"label": "Go to Skills Spotlight ⚡", "type": "scroll", "target": "#skills"}]
        }

    if intent == "education":
        return {
            "answer": "Shivam holds a **B.Tech in Computer Science and Engineering** from **Graphic Era Hill University, Haldwani** (July 2022 - June 2025) where he achieved a **6.88 CGPA**.\n\n**Academic Highlights:**\n*   Shortlisted as a Top 10% candidate in TCS NQT 2025.\n*   Completed Google Cloud GenAI Certification.\n*   Completed Python Development Program by Cognifyz Technologies.\n*   Represented his university in the National Basketball Championship.\n\nI have shifted your focus down to his academic credentials panel!",
            "actions": [{"label": "Go to Education 🎓", "type": "scroll", "target": "#education"}]
        }

    if intent == "contact":
        return {
            "answer": "You can connect with Shivam Pathak directly through the following channels:\n\n*   **Email:** pathakshivam3738@gmail.com\n*   **GitHub:** [github.com/shivampathak2812](https://github.com/shivampathak2812)\n*   **LinkedIn:** [linkedin.com/in/shivam-pathak-9a76ba246](https://linkedin.com/in/shivam-pathak-9a76ba246)\n\nI have smoothly scrolled the window to his contact console terminal at the bottom of the page!",
            "actions": [{"label": "Go to Contact Console ✉️", "type": "scroll", "target": "#contact"}]
        }

    # ── SPECIFIC PROJECT RESPONSES ──

    if intent == "project_travelart":
        return {
            "answer": "**TravelArt** is Shivam's flagship AI project! It is a fully featured travel itinerary platform:\n\n*   **Core Feature:** Generates daily travel schedules using **Groq LLaMA 3.3** based on user parameters, supporting dynamic route edits.\n*   **Backend:** Powered by **FastAPI**, with **PostgreSQL** storage, **Redis caching** (reducing query latency by 60%), and **JWT + OTP** dual-layer authentication.\n\nI've scrolled down to his project grid. Check out the TravelArt dashboard and code!",
            "actions": [
                {"label": "Go to Projects Grid 🧭", "type": "scroll", "target": "#projects"},
                {"label": "View TravelArt Code 🐙", "type": "link", "target": "https://github.com/shivampathak2812/TravelART.git"}
            ]
        }

    if intent == "project_ats":
        return {
            "answer": "**ATS-Pro-Analyzer** is an intelligent HR tech platform built by Shivam:\n\n*   **Core Feature:** Compares candidate resumes with specific job roles, outputting a precise score, keyword gap map, and targeted bullet recommendations.\n*   **Tech Stack:** FastAPI, Groq LLaMA-3, Natural Language Processing (NLP), secure JWT auth.\n\nI've scrolled the screen to show you this card in the Projects showcase!",
            "actions": [
                {"label": "Go to Projects Grid 🧭", "type": "scroll", "target": "#projects"},
                {"label": "View ATS-Pro Code 🐙", "type": "link", "target": "https://github.com/shivampathak2812/ATS-Pro-Analyzer.git"}
            ]
        }

    if intent == "project_houseprice":
        return {
            "answer": "**House Price Prediction** is a machine learning analytics project:\n\n*   **Description:** Performs statistical price estimation using Regression algorithms in Python.\n*   **Tech Stack:** Scikit-Learn, Pandas, NumPy, Matplotlib, Jupyter Notebooks.\n*   **Feature:** Implements outlier detection, correlation analysis, and regression modeling to predict property valuations.\n\nTake a look at the model code on GitHub!",
            "actions": [
                {"label": "Go to Projects Grid 🧭", "type": "scroll", "target": "#projects"},
                {"label": "View ML Code 🐙", "type": "link", "target": "https://github.com/shivampathak2812/Machine_learning.git"}
            ]
        }

    if intent == "project_courier":
        return {
            "answer": "The **Courier Partner App** is a responsive backend tracking and logistics application:\n\n*   **Summary:** Optimizes delivery routing and logs dispatch states.\n*   **Tech Stack:** FastAPI, Python, SQLAlchemy ORM, and REST endpoints.\n\nView the logistics architecture!",
            "actions": [
                {"label": "Go to Projects Grid 🧭", "type": "scroll", "target": "#projects"},
                {"label": "View Courier Code 🐙", "type": "link", "target": "https://github.com/shivampathak2812/courier_partner.git"}
            ]
        }

    if intent == "project_matrix":
        return {
            "answer": "The **Matrix Calculator** is a responsive web application for algebraic computation:\n\n*   **Capability:** Solves complex NxN matrix equations (multiplication, transposition, determinants, inversion) in real-time.\n*   **Tech Stack:** Clean JavaScript (ES6), HTML5, CSS3, utilizing glassmorphic styles.\n\nExplore the web calculator code directly!",
            "actions": [
                {"label": "Go to Projects Grid 🧭", "type": "scroll", "target": "#projects"},
                {"label": "View Calculator Code 🐙", "type": "link", "target": "https://github.com/shivampathak2812/matrix_calculator.git"}
            ]
        }

    if intent == "project_zomato":
        return {
            "answer": "The **Zomato Dashboard** showcases Shivam's business intelligence and analysis capability:\n\n*   **Summary:** Analyzes a large-scale database containing 197,000+ food delivery entries to map market trends.\n*   **Tech Stack:** Excel, Pivot calculations, KPI mapping, data slicers, dynamic diagrams.\n\nInspect the spreadsheet formulas and dashboards on his repo!",
            "actions": [
                {"label": "Go to Projects Grid 🧭", "type": "scroll", "target": "#projects"},
                {"label": "View Zomato Repo 🐙", "type": "link", "target": "https://github.com/shivampathak2812/Zomato-Dashboard.git"}
            ]
        }

    if intent == "project_eda":
        return {
            "answer": "The **Exploratory Data Analysis** project focuses on core mathematical patterns and data engineering:\n\n*   **Summary:** Employs visualization models to uncover correlation spikes and outliers.\n*   **Tech Stack:** Python, Pandas, NumPy, Matplotlib, Seaborn.\n\nBrowse through the EDA plots and notebooks!",
            "actions": [
                {"label": "Go to Projects Grid 🧭", "type": "scroll", "target": "#projects"},
                {"label": "View EDA GitHub 🐙", "type": "link", "target": "https://github.com/shivampathak2812"}
            ]
        }

    # ── ALL PROJECTS ──
    if intent == "projects_all":
        return {
            "answer": "Shivam has designed **7 distinct software projects** matching his resume competencies:\n\n1.  **TravelArt:** LLaMA 3.3 & FastAPI itinerary planner.\n2.  **ATS-Pro-Analyzer:** NLP-based resume optimization portal.\n3.  **House Price Prediction:** Machine learning regression pricing model.\n4.  **Courier Partner App:** Python & FastAPI logistics coordinator.\n5.  **Matrix Calculator:** Responsive Javascript NxN algebra portal.\n6.  **Zomato Dashboard:** Excel analytic KPIs for 197K+ food delivery records.\n7.  **Exploratory Data Analysis:** Python, Pandas, and Seaborn statistical engine.\n\nI have auto-scrolled your viewport to his project card deck. Feel free to explore details, click cards, or browse code repositories!",
            "actions": [
                {"label": "Go to Projects Showcase 🧭", "type": "scroll", "target": "#projects"}
            ]
        }

    # ── GENERIC FALLBACK ──
    return {
        "answer": "I'm **Shivam's AI Portfolio Assistant** — here to help you explore everything about his profile.\n\n**Try asking me things like:**\n*   *\"Tell me about his projects\"*\n*   *\"Summarize Shivam in 30 seconds\"*\n*   *\"What is his work experience at Northcorp?\"*\n*   *\"Tell me about TravelArt\"*\n*   *\"What are his technical skills?\"*\n*   *\"Download his resume\"*\n\nI'll give you detailed, accurate answers with quick-action buttons!",
        "actions": [
            {"label": "Summarize Shivam ⏱️", "type": "scroll", "target": "trigger:summary"},
            {"label": "Show AI Projects 🧭", "type": "scroll", "target": "#projects"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    # Boot server on port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
