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
    allow_origins=["http://localhost:3000", "https://portfolio-my-ivory.vercel.app"],
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
        from .rag_engine import PortfolioAssistant
        assistant = PortfolioAssistant()
    return assistant

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
        response_payload = ai_assistant.query(request.message, history_dicts)
        
        return response_payload
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        # Graceful fallback response
        return get_local_reply(request.message, [])

# High-fidelity Local Python Reply fallback if Groq API key or Chroma database is offline
def get_local_reply(query: str, history: list) -> dict:
    q = query.lower()
    actions = []
    
    # Check intent for resume downloads
    if "resume" in q or "cv" in q or "download" in q:
        return {
            "answer": "I would be glad to help with that! I am initiating a direct download of **Shivam Pathak's Professional PDF Resume** for you right now. You can review his certifications, full academics, and internships in detail.",
            "actions": [{"label": "Download Resume 📄", "type": "download", "target": "/resume/Shivam-Resume.pdf"}]
        }
        
    # Check intent for TravelArt project
    if "travelart" in q or "travel art" in q or "travel" in q:
        return {
            "answer": "**TravelArt** is Shivam's flagship AI project! It is a fully featured travel itinerary platform:\n\n*   **Core Feature:** Generates daily travel schedules using **Groq LLaMA 3.3** based on user parameters, supporting dynamic route edits.\n*   **Backend:** Powered by **FastAPI**, with **PostgreSQL** storage, **Redis caching** (reducing query latency by 60%), and **JWT + OTP** dual-layer authentication.\n\nI've scrolled down to his projects. Check out the TravelArt dashboard and code!",
            "actions": [
                {"label": "Go to Projects Grid 🧭", "type": "scroll", "target": "#projects"},
                {"label": "View TravelArt Code 🐙", "type": "link", "target": "https://github.com/shivampathak2812/TravelART.git"}
            ]
        }

    # Check intent for ATS Analyzer
    if "ats" in q or "ats-pro" in q or "analyzer" in q:
        return {
            "answer": "**ATS-Pro-Analyzer** is an intelligent HR tech platform built by Shivam:\n\n*   **Core Feature:** Compares candidate resumes with specific job roles, outputting a precise score, keyword gap map, and targeted bullet recommendations.\n*   **Tech Stack:** FastAPI, Groq LLaMA-3, Natural Language Processing (NLP), secure JWT auth.\n\nI've scrolled the screen to show you this card in the Projects showcase!",
            "actions": [
                {"label": "Go to Projects Grid 🧭", "type": "scroll", "target": "#projects"},
                {"label": "View ATS-Pro Code 🐙", "type": "link", "target": "https://github.com/shivampathak2812/ATS-Pro-Analyzer.git"}
            ]
        }

    # Check intent for Work Experience
    if "experience" in q or "northcorp" in q or "intern" in q or "work" in q:
        return {
            "answer": "Shivam is currently employed as an **AI Engineer Intern** at **Northcorp Software** (Remote, Jan 2026 - Present).\n\n**Internship Details & Accomplishments:**\n*   Built 10+ REST API endpoints for the Talent Assessment Platform (TAP) using FastAPI and PostgreSQL.\n*   Developed LLM features using the Google Gemini API and structured RAG pipelines.\n*   Managed PostgreSQL schema with SQLAlchemy async ORM, Alembic migrations, MinIO storage, and secure JWT auth.\n*   Successfully deployed services via Docker Compose.\n\nI have automatically scrolled your window to his timeline to see it in style!",
            "actions": [{"label": "Go to Experience Timeline 💼", "type": "scroll", "target": "#experience"}]
        }

    # Check intent for Skills
    if "skills" in q or "fastapi" in q or "python" in q or "docker" in q or "technologies" in q:
        return {
            "answer": "Shivam's technical proficiency is balanced across AI engineering and modern backends:\n\n*   **AI/ML & Generative AI:** Google Gemini API, LLaMA 3, RAG pipelines, NLP, Scikit-Learn, Pandas, NumPy, Seaborn.\n*   **Backend & DBs:** FastAPI, Python, PostgreSQL, SQLAlchemy Async ORM, Alembic migrations, Redis Caching, MinIO object storage, secure JWT auth.\n*   **Tools & DevOps:** Docker Compose, Git, GitLab Workflow, Linux Bash, Excel KPIs.\n\nI have scrolled the page directly to his skills spotlight grid below!",
            "actions": [{"label": "Go to Skills Spotlight ⚡", "type": "scroll", "target": "#skills"}]
        }

    # Check intent for Summary / Intro
    if "summarize" in q or "summary" in q or "30 seconds" in q or "who is" in q or "intro" in q:
        return {
            "answer": "Here is a high-level **30-second summary** of Shivam:\n\n*   **Internship:** He is currently an **AI Engineer Intern** at **Northcorp Software**, where he builds async REST endpoints in **FastAPI** and designs **RAG pipelines** using the **Google Gemini API**.\n*   **Core Skillsets:** High-performance Backend development (PostgreSQL, SQLAlchemy, Alembic, Docker) and artificial intelligence agents.\n*   **Academics:** Pursuing his B.Tech in CSE at **Graphic Era Hill University** (expected graduation 2026) with a **6.88 CGPA** and key accomplishments like a **TCS NQT Top 10%** selection.\n\nWould you like me to scroll down and show you his detailed skills or experience?",
            "actions": [
                {"label": "View Experience 💼", "type": "scroll", "target": "#experience"},
                {"label": "View Skills ⚡", "type": "scroll", "target": "#skills"}
            ]
        }

    # Generic response
    return {
        "answer": "Hi! I am **Shivam's AI Assistant**. I can help you explore his skills, B.Tech credentials, and 7 core software projects.\n\n**Ask me questions like:**\n*   *\"Can you summarize Shivam in 30 seconds?\"*\n*   *\"Tell me about the TravelArt AI travel itinerary project!\"*\n*   *\"Where did he intern? What did he build there?\"*\n*   *\"Download his official PDF resume.\"*",
        "actions": [
            {"label": "Summarize Shivam ⏱️", "type": "scroll", "target": "trigger:summary"},
            {"label": "Show AI Projects 🧭", "type": "scroll", "target": "#projects"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    # Boot server on port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
