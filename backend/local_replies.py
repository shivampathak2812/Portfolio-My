"""Lightweight, dependency-free answers for the AVIX portfolio assistant.

Scores the visitor's question against portfolio intents (skills, projects,
experience, education, contact, small talk) and returns a predefined answer in
the same ``{"answer": str, "actions": [...]}`` shape as the RAG pipeline.

Used for Demo Mode, for small talk in RAG mode, and as the fallback whenever
Groq or the vector index is unavailable. Imports nothing heavy, so it is safe on
Render's 512 MB free instance.
"""

import re
from datetime import date

from knowledge_base import PORTFOLIO_DOCUMENTS

# ─────────────────────────────────────────────────────────────────
# Scored intent matching for accurate backend fallback responses
# ─────────────────────────────────────────────────────────────────

def _has_phrase(q: str, phrase: str) -> bool:
    """Whole-word match (optional plural "s"), so "hi" does not fire inside "his" or "which"."""
    plural = "s?" if len(phrase) >= 4 else ""
    return re.search(r"(?<![a-z0-9])" + re.escape(phrase) + plural + r"(?![a-z0-9])", q) is not None


QUESTION_WORDS = ("is", "are", "does", "do", "did", "can", "could", "has", "have", "what", "which", "who",
                  "how", "where", "when", "why", "tell")


def _is_question(q: str) -> bool:
    return "?" in q or q.split(" ", 1)[0] in QUESTION_WORDS


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
        # "How many years of experience?" / "experience in numbers" -> computed durations
        {
            "intent": "experience_duration",
            "keywords": ["how many years", "how many months", "how much experience", "how long", "years of experience",
                         "months of experience", "total experience", "in number", "in numbers",
                         "duration", "how many year", "experience count", "numeric"],
            "boost": ["years", "months", "total"],
            "exclude": [],
            "weight": 5
        },
        {
            "intent": "experience",
            "keywords": ["experience", "internship", "northcorp", "work experience", "job", "role", "where does he work", "silicon interfaces", "trainee", "currently working", "current role"],
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
            "intent": "project_vibecoder",
            "keywords": ["vibecoder", "vibe coder", "php vibe", "php", "vibe coding", "code generator"],
            "boost": ["vibe", "php"],
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
            "intent": "project_worklens",
            "keywords": ["worklens", "work lens", "attrition", "employee attrition", "hr analytics"],
            "boost": ["xgboost", "attrition"],
            "exclude": [],
            "weight": 5
        },
        {
            "intent": "project_hrleave",
            "keywords": ["hr leave", "leave agent", "leave assistant", "hrleaveagent", "leave application", "leave request"],
            "boost": ["langgraph", "leave"],
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
            if _has_phrase(q, kw):
                score += entry["weight"]
        for bkw in entry["boost"]:
            if _has_phrase(q, bkw):
                score += 1
        # Exclusion penalty — heavily penalize if exclude words are present
        for exkw in entry["exclude"]:
            if _has_phrase(q, exkw):
                score -= 10
        # "Is he good at X?" is a question, not a compliment
        if entry["intent"] == "chitchat_compliment" and _is_question(q):
            score = 0
        if score > best_score:
            best_score = score
            best_intent = entry["intent"]

    return best_intent


# ─────────────────────────────────────────────────────────────────
# Keyword search over the portfolio facts, used when no intent matches
# ─────────────────────────────────────────────────────────────────

STOPWORDS = {
    "a", "an", "the", "is", "are", "was", "were", "be", "been", "do", "does", "did", "has", "have", "had",
    "he", "his", "him", "she", "her", "they", "them", "their", "you", "your", "i", "me", "my", "we", "our",
    "what", "which", "who", "whom", "whose", "when", "where", "why", "how", "can", "could", "would", "should",
    "will", "shall", "may", "might", "of", "in", "on", "at", "to", "for", "with", "about", "from", "by", "as",
    "and", "or", "but", "if", "so", "than", "that", "this", "these", "those", "it", "its", "any", "some",
    "tell", "know", "show", "give", "explain", "describe", "please", "shivam", "pathak", "much", "many",
    "there", "here", "all", "also", "just", "more", "most", "very", "use", "used", "using", "done",
}


def _tokens(text: str) -> set:
    words = re.findall(r"[a-z0-9+#.]+", text.lower())
    return {w.strip(".") for w in words if len(w.strip(".")) > 1 and w.strip(".") not in STOPWORDS}


def _matches(token: str, doc_tokens: set) -> bool:
    if token in doc_tokens:
        return True
    # Prefix match for longer words so "predict" finds "prediction" and "models" finds "model"
    if len(token) >= 4:
        stem = token[:-1] if token.endswith("s") else token
        return any(d.startswith(stem) or (len(d) >= 4 and token.startswith(d)) for d in doc_tokens)
    return False


def search_documents(query: str, limit: int = 2) -> list:
    """Return the text of the portfolio documents that best match the query's keywords."""
    query_tokens = _tokens(query)
    if not query_tokens:
        return []
    scored = []
    for doc in PORTFOLIO_DOCUMENTS:
        doc_tokens = _tokens(doc["text"])
        score = sum(1 for t in query_tokens if _matches(t, doc_tokens))
        if score:
            scored.append((score, doc["text"].strip()))
    if not scored:
        return []
    scored.sort(key=lambda item: item[0], reverse=True)
    best = scored[0][0]
    return [text for score, text in scored[:limit] if score == best or score >= 2]


# Roles with (start year, start month, end year, end month); end None = current role
EXPERIENCE_TIMELINE = [
    ("Trainee Engineer – Data Science & AI/ML", "Silicon Interfaces Pvt. Ltd., Mumbai", (2026, 7), None),
    ("AI Engineer Intern", "Northcorp Software", (2026, 1), (2026, 6)),
]


def _months_between(start: tuple, end: tuple) -> int:
    """Inclusive month count, e.g. Jan–Jun = 6."""
    return (end[0] - start[0]) * 12 + (end[1] - start[1]) + 1


def _format_months(months: int) -> str:
    years, rem = divmod(months, 12)
    parts = []
    if years:
        parts.append(f"{years} year{'s' if years != 1 else ''}")
    if rem or not years:
        parts.append(f"{rem} month{'s' if rem != 1 else ''}")
    return " ".join(parts)


def experience_months(today: date = None) -> list:
    """Months per role, in EXPERIENCE_TIMELINE order (current role counted up to this month)."""
    today = today or date.today()
    now = (today.year, today.month)
    return [_months_between(start, end or now) for _, _, start, end in EXPERIENCE_TIMELINE]


def experience_summary(today: date = None) -> str:
    """One-line computed durations, given to the LLM so it can quote exact numbers."""
    months = experience_months(today)
    total = sum(months)
    roles = "; ".join(f"{role} at {company}: {m} months" for (role, company, _, _), m in zip(EXPERIENCE_TIMELINE, months))
    return (f"Shivam's total professional experience is {total} months (about {total / 12:.1f} years) across "
            f"{len(months)} roles ({roles}). When asked about his experience, state these numbers.")


def experience_duration_reply(today: date = None) -> dict:
    today = today or date.today()
    now = (today.year, today.month)
    lines = []
    total = 0
    for role, company, start, end in EXPERIENCE_TIMELINE:
        months = _months_between(start, end or now)
        total += months
        period = f"{date(*start, 1):%b %Y} – {'Present' if end is None else f'{date(*end, 1):%b %Y}'}"
        lines.append(f"*   **{role}**, {company}: **{months} months** ({period})")
    return {
        "answer": f"**Total experience: {total} months (~{total / 12:.1f} years)**\n\n"
        + "\n".join(lines)
        + f"\n\n*   **Roles:** {len(EXPERIENCE_TIMELINE)}\n*   **REST API endpoints built at Northcorp:** 10+\n"
        "*   **Alembic migrations managed:** 5+",
        "actions": [{"label": "Go to Experience Timeline 💼", "type": "scroll", "target": "#experience"}],
    }


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
                {"label": "View PHP Vibe Coder 🐙", "type": "link", "target": "https://github.com/shivampathak2812/PHP-VibeCoder.git"}
            ]
        }

    if intent == "chitchat_capabilities":
        return {
            "answer": "Great question! Here's what I can do for you: 🎯\n\n*   📋 **Summarize** Shivam's profile in 30 seconds\n*   💼 **Explain** his work experience at Northcorp Software\n*   🧭 **Navigate** you to any section of this portfolio\n*   📄 **Download** his professional resume as a PDF\n*   🔍 **Deep dive** into any of his 9 projects\n*   ⚡ **List** his technical skills and certifications\n*   🎤 **Voice mode** — just tap the mic and talk to me!\n\nI'll also highlight and scroll to the relevant sections for you automatically!",
            "actions": [
                {"label": "Summarize Shivam ⏱️", "type": "scroll", "target": "trigger:summary"},
                {"label": "Show AI Projects 🧭", "type": "scroll", "target": "#projects"},
                {"label": "Download Resume 📄", "type": "download", "target": "/resume/Resume_Shivam.pdf"}
            ]
        }

    if intent == "chitchat_weather":
        return {
            "answer": "I wish I could check the weather for you! ☀️🌧️ But I'm specialized in navigating Shivam's portfolio — think of me as an indoor assistant! 😄\n\nHow about I show you something cool instead? Like his **PHP Vibe Coder** project that turns plain English into working PHP code with AI? 💻",
            "actions": [
                {"label": "See PHP Vibe Coder 🧭", "type": "scroll", "target": "#projects"},
                {"label": "View PHP Vibe Coder Code 🐙", "type": "link", "target": "https://github.com/shivampathak2812/PHP-VibeCoder.git"}
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
            "answer": "If I had to pick a favorite, I'd say I love talking about **PHP Vibe Coder** — it's Shivam's flagship AI project that combines Google Gemini, RAG over PHP docs with FAISS, and a self-healing debug agent! 💻⚡\n\nBut honestly, all 8 of his projects are impressive in their own way. Want me to walk you through them?",
            "actions": [
                {"label": "Show All Projects 🧭", "type": "scroll", "target": "#projects"},
                {"label": "View PHP Vibe Coder 🐙", "type": "link", "target": "https://github.com/shivampathak2812/PHP-VibeCoder.git"}
            ]
        }

    if intent == "resume":
        return {
            "answer": "I would be glad to help with that! You can **view Shivam Pathak's resume** right here on the site or **download the PDF**. It covers his experience, projects, skills, academics, and certifications in detail.",
            "actions": [
                {"label": "View Resume 👁", "type": "view", "target": "/resume/Resume_Shivam.pdf"},
                {"label": "Download Resume 📄", "type": "download", "target": "/resume/Resume_Shivam.pdf"}
            ]
        }

    if intent == "summary":
        return {
            "answer": "Here is a high-level **30-second executive summary** of Shivam:\n\n*   **Current Role:** **Trainee Engineer – Data Science & AI/ML** at **Silicon Interfaces Pvt. Ltd., Mumbai** (since Jul 2026), working on data preprocessing, EDA, feature engineering and ML model development with Python, SQL, Pandas and Scikit-learn.\n*   **Previous Role:** **AI Engineer Intern** at **Northcorp Software** (Jan 2026 - Jun 2026), building **FastAPI** REST endpoints and **RAG pipelines** with the **Google Gemini API**.\n*   **Core Skillsets:** High-performance Backend development (PostgreSQL, SQLAlchemy, Alembic, Docker) and artificial intelligence agents.\n*   **Academics:** Graduated with a B.Tech in CSE from **Graphic Era Hill University, Haldwani** (July 2022 - June 2025) with a **6.88 CGPA** and key accomplishments like a **TCS NQT Top 10%** selection.\n\nWould you like me to scroll down and show you his detailed skills or experience?",
            "actions": [
                {"label": "View Experience 💼", "type": "scroll", "target": "#experience"},
                {"label": "View Skills ⚡", "type": "scroll", "target": "#skills"}
            ]
        }

    if intent == "experience_duration":
        return experience_duration_reply()

    if intent == "experience":
        months = experience_months()
        total = sum(months)
        return {
            "answer": f"**Total experience: {total} months (~{total / 12:.1f} years)** across {len(months)} roles.\n\n"
            f"Shivam is currently a **Trainee Engineer – Data Science & AI/ML** at **Silicon Interfaces Pvt. Ltd., Mumbai** "
            f"(Jul 2026 - Present, **{months[0]} months**), working on Data Science and Machine Learning solutions with Python, SQL, "
            "Pandas, NumPy and Scikit-learn: data cleaning, EDA, feature engineering, model development and evaluation.\n\n"
            f"Before that, he worked as an **AI Engineer Intern** at **Northcorp Software** (Jan 2026 - Jun 2026, **{months[1]} months**).\n\n"
            "**Key Achievements at Northcorp:**\n*   Built 10+ REST API endpoints for the Talent Assessment Platform (TAP) using FastAPI and PostgreSQL.\n"
            "*   Developed LLM features using the Google Gemini API and structured RAG pipelines.\n"
            "*   Managed PostgreSQL schema with SQLAlchemy async ORM, 5+ Alembic migrations, MinIO storage, and secure JWT auth.\n"
            "*   Successfully deployed services via Docker Compose.\n\n"
            "I have automatically scrolled your window to his timeline below to see it in style!",
            "actions": [{"label": "Go to Experience Timeline 💼", "type": "scroll", "target": "#experience"}]
        }

    if intent == "skills":
        return {
            "answer": "Shivam's technical proficiency is balanced across AI engineering and modern backends:\n\n*   **AI/ML & Generative AI:** Google Gemini API, LLaMA 3, RAG pipelines, NLP, Scikit-Learn, XGBoost, Pandas, NumPy, Seaborn.\n*   **Backend & DBs:** FastAPI, Python, PostgreSQL, SQLAlchemy Async ORM, Alembic migrations, Redis Caching, MinIO object storage, secure JWT auth.\n*   **Tools & DevOps:** Docker Compose, Git, GitLab Workflow, Linux Bash, Excel KPIs.\n\nI have scrolled the page directly to his skills spotlight grid below!",
            "actions": [{"label": "Go to Skills Spotlight ⚡", "type": "scroll", "target": "#skills"}]
        }

    if intent == "education":
        return {
            "answer": "Shivam holds a **B.Tech in Computer Science and Engineering** from **Graphic Era Hill University, Haldwani** (July 2022 - June 2025) where he achieved a **6.88 CGPA**.\n\n**Academic Highlights:**\n*   Shortlisted as a Top 10% candidate in TCS NQT 2025.\n*   Completed Advanced Certification in Data Science (ML) from Seed Infotech (2026).\n*   Completed Python Development Program by Cognifyz Technologies.\n*   Represented his university in the National Basketball Championship.\n\nI have shifted your focus down to his academic credentials panel!",
            "actions": [{"label": "Go to Education 🎓", "type": "scroll", "target": "#education"}]
        }

    if intent == "contact":
        return {
            "answer": "You can connect with Shivam Pathak directly through the following channels:\n\n*   **Email:** pathakshivam3738@gmail.com\n*   **GitHub:** [github.com/shivampathak2812](https://github.com/shivampathak2812)\n*   **LinkedIn:** [linkedin.com/in/shivam-pathak-9a76ba246](https://linkedin.com/in/shivam-pathak-9a76ba246)\n\nI have smoothly scrolled the window to his contact console terminal at the bottom of the page!",
            "actions": [{"label": "Go to Contact Console ✉️", "type": "scroll", "target": "#contact"}]
        }

    # ── SPECIFIC PROJECT RESPONSES ──

    if intent == "project_vibecoder":
        return {
            "answer": "**PHP Vibe Coder** is Shivam's flagship AI project — an AI-assisted PHP development workspace:\n\n*   **Core Feature:** Turns a plain-English requirement (plus an optional document or image) into a complete PHP project using **Google Gemini**.\n*   **RAG Engine:** Retrieves relevant PHP documentation with **Sentence Transformers + FAISS** before generating code.\n*   **Self-Healing:** Validates every file with `php -l`; failures go to a **debugging agent** that retries up to 3 times.\n*   **Extras:** Explains existing PHP projects and refactors files while preserving behavior, all in a **Streamlit** UI.\n\nI've scrolled down to his project grid. Check out PHP Vibe Coder and its code!",
            "actions": [
                {"label": "Go to Projects Grid 🧭", "type": "scroll", "target": "#projects"},
                {"label": "View PHP Vibe Coder Code 🐙", "type": "link", "target": "https://github.com/shivampathak2812/PHP-VibeCoder.git"}
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

    if intent == "project_hrleave":
        return {
            "answer": "**HR Leave Assistant** is Shivam's AI agent for HR leave management:\n\n*   **Agent:** Built with **LangGraph** and **Google Gemini**. Employees apply for leave in plain English (e.g. \"I want 2 days leave on 2026-10-20\").\n*   **Rule enforcement:** Looks up the employee in an Excel database, checks probation, notice period, max consecutive days and balance against the company rule book, then approves (updating the database) or explains the rejection.\n*   **UI:** A **Streamlit** chat app with employee and HR logins, live tool-call traces, file uploads for custom rule books/databases, and an FAQ cache for instant answers.\n\nIt's deployed live, so you can try it yourself!",
            "actions": [
                {"label": "Try Live Demo 🚀", "type": "link", "target": "https://hr-leave-assistant.streamlit.app/"},
                {"label": "View HR Leave Code 🐙", "type": "link", "target": "https://github.com/shivampathak2812/HRLeaveAgent.git"},
                {"label": "Go to Projects Grid 🧭", "type": "scroll", "target": "#projects"}
            ]
        }

    if intent == "project_worklens":
        return {
            "answer": "**WorkLens** is Shivam's end-to-end HR analytics and employee attrition prediction platform:\n\n*   **ML Engine:** An optimized **XGBoost** classifier trained on the IBM HR Attrition dataset, achieving a **91% F1-score** and **83% test accuracy**.\n*   **Backend:** **FastAPI** prediction and outcome endpoints with prediction-history logging.\n*   **Frontend:** A **React (Vite)** multi-step form wizard plus a **Recharts** dashboard showing attrition by department, risk distribution, and configurable HR alerts.\n\nI've scrolled down to his project grid. Check out WorkLens and its code!",
            "actions": [
                {"label": "Go to Projects Grid 🧭", "type": "scroll", "target": "#projects"},
                {"label": "View WorkLens Code 🐙", "type": "link", "target": "https://github.com/shivampathak2812/WorkLens.git"}
            ]
        }

    # ── ALL PROJECTS ──
    if intent == "projects_all":
        return {
            "answer": "Shivam has designed **9 distinct software projects** matching his resume competencies:\n\n1.  **PHP Vibe Coder:** Gemini + RAG agent that generates, validates & refactors PHP projects.\n2.  **ATS-Pro-Analyzer:** NLP-based resume optimization portal.\n3.  **House Price Prediction:** Machine learning regression pricing model.\n4.  **Courier Partner App:** Python & FastAPI logistics coordinator.\n5.  **Matrix Calculator:** Responsive Javascript NxN algebra portal.\n6.  **Zomato Dashboard:** Excel analytic KPIs for 197K+ food delivery records.\n7.  **Exploratory Data Analysis:** Python, Pandas, and Seaborn statistical engine.\n8.  **WorkLens:** XGBoost employee attrition predictor (91% F1) with FastAPI & React dashboard.\n9.  **HR Leave Assistant:** LangGraph + Gemini agent that approves leave requests against an HR rule book (live on Streamlit).\n\nI have auto-scrolled your viewport to his project card deck. Feel free to explore details, click cards, or browse code repositories!",
            "actions": [
                {"label": "Go to Projects Showcase 🧭", "type": "scroll", "target": "#projects"}
            ]
        }

    # ── KNOWLEDGE BASE SEARCH ──
    # No intent matched: look the question up in the portfolio facts instead of
    # answering every unrecognised question with the same canned menu.
    hits = search_documents(query)
    if hits:
        return {
            "answer": "Here's what I know about that:\n\n" + "\n\n".join(hits)
            + "\n\nWant more detail? Ask me about a specific project, skill or role.",
            "actions": [
                {"label": "Show AI Projects 🧭", "type": "scroll", "target": "#projects"},
                {"label": "View Skills ⚡", "type": "scroll", "target": "#skills"}
            ]
        }

    # ── GENERIC FALLBACK ──
    return {
        "answer": "I'm **Shivam's AI Portfolio Assistant** — here to help you explore everything about his profile.\n\n**Try asking me things like:**\n*   *\"Tell me about his projects\"*\n*   *\"Summarize Shivam in 30 seconds\"*\n*   *\"What is his work experience at Northcorp?\"*\n*   *\"Tell me about PHP Vibe Coder\"*\n*   *\"What are his technical skills?\"*\n*   *\"Download his resume\"*\n\nI'll give you detailed, accurate answers with quick-action buttons!",
        "actions": [
            {"label": "Summarize Shivam ⏱️", "type": "scroll", "target": "trigger:summary"},
            {"label": "Show AI Projects 🧭", "type": "scroll", "target": "#projects"}
        ]
    }
