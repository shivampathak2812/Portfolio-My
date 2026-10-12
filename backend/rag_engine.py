"""Groq + RAG answering for the AVIX portfolio assistant (used when DEMO_MODE=false).

Memory notes (Render free tier = 512 MB):
* Embeddings use ChromaDB's ONNX build of ``all-MiniLM-L6-v2`` (onnxruntime ships
  with chromadb). The previous ``HuggingFaceEmbeddings`` path imported PyTorch +
  sentence-transformers, which alone pushed the process past 512 MB.
* Everything here is created once, lazily, by ``main.RagState`` -- never at import.
* The vector index is built ahead of time by ``ingest.py`` (Render build step),
  never at server startup.
"""

import logging
import os
from pathlib import Path

from local_replies import get_local_reply, score_intent
from prompts import SYSTEM_PROMPT

logger = logging.getLogger("avix.rag")

BACKEND_DIR = Path(__file__).resolve().parent
DB_DIR = Path(os.getenv("CHROMA_DB_DIR", BACKEND_DIR / "chroma_db"))
# Keep the ONNX model inside the project so a build-time download is still there at runtime
MODEL_DIR = Path(os.getenv("EMBEDDING_MODEL_DIR", BACKEND_DIR / ".models" / "all-MiniLM-L6-v2"))
COLLECTION_NAME = "portfolio"
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
GROQ_TIMEOUT_SECONDS = float(os.getenv("GROQ_TIMEOUT_SECONDS", "20"))
TOP_K = 2

CHITCHAT_INTENTS = {
    "greeting", "chitchat_thanks", "chitchat_compliment", "chitchat_confirm", "chitchat_bye",
    "chitchat_feeling", "chitchat_name", "chitchat_joke", "chitchat_capabilities",
    "chitchat_weather", "chitchat_age", "chitchat_creator", "chitchat_favorite",
}


class RagUnavailable(RuntimeError):
    """RAG cannot run (missing key, missing/empty index). The API falls back to local replies."""


def get_embedding_function():
    """ONNX all-MiniLM-L6-v2 from ChromaDB (no PyTorch). Shared by ingest and runtime."""
    from chromadb.utils.embedding_functions import ONNXMiniLM_L6_V2

    ef = ONNXMiniLM_L6_V2(preferred_providers=["CPUExecutionProvider"])
    ef.DOWNLOAD_PATH = MODEL_DIR
    return ef


def chroma_client(path: Path):
    import chromadb
    from chromadb.config import Settings

    return chromadb.PersistentClient(path=str(path), settings=Settings(anonymized_telemetry=False))


def open_collection():
    if not DB_DIR.is_dir():
        raise RagUnavailable(
            f"Vector index not found at {DB_DIR}. Build it with `python ingest.py` "
            "(run it in the Render build command, not at startup)."
        )
    client = chroma_client(DB_DIR)
    try:
        collection = client.get_collection(COLLECTION_NAME, embedding_function=get_embedding_function())
    except Exception as exc:
        raise RagUnavailable(
            f"Collection '{COLLECTION_NAME}' missing in {DB_DIR} ({exc}). Re-run `python ingest.py`."
        ) from exc
    if collection.count() == 0:
        raise RagUnavailable(f"Collection '{COLLECTION_NAME}' is empty. Re-run `python ingest.py`.")
    return collection


def intent_actions(q: str) -> list:
    """Quick-action buttons matching the frontend, based on the question's keywords."""
    actions = []
    if "resume" in q or "cv" in q or "download" in q:
        actions.append({"label": "Download Resume 📄", "type": "download", "target": "/resume/Resume_Shivam.pdf"})
    if "vibecoder" in q or "vibe coder" in q or "php" in q:
        actions.append({"label": "Go to Projects Grid 🧭", "type": "scroll", "target": "#projects"})
        actions.append({"label": "View PHP Vibe Coder Code 🐙", "type": "link", "target": "https://github.com/shivampathak2812/PHP-VibeCoder.git"})
    if "worklens" in q or "work lens" in q or "attrition" in q:
        actions.append({"label": "Go to Projects Grid 🧭", "type": "scroll", "target": "#projects"})
        actions.append({"label": "View WorkLens Code 🐙", "type": "link", "target": "https://github.com/shivampathak2812/WorkLens.git"})
    if "ats" in q or "ats-pro" in q or "analyzer" in q:
        actions.append({"label": "Go to Projects Grid 🧭", "type": "scroll", "target": "#projects"})
        actions.append({"label": "View ATS-Pro Code 🐙", "type": "link", "target": "https://github.com/shivampathak2812/ATS-Pro-Analyzer.git"})
    if "experience" in q or "northcorp" in q or "intern" in q or "work" in q:
        actions.append({"label": "Go to Experience Timeline 💼", "type": "scroll", "target": "#experience"})
    if "skills" in q or "fastapi" in q or "python" in q or "docker" in q or "technologies" in q:
        actions.append({"label": "Go to Skills Spotlight ⚡", "type": "scroll", "target": "#skills"})
    if "education" in q or "university" in q or "btech" in q or "cgpa" in q:
        actions.append({"label": "Go to Education 🎓", "type": "scroll", "target": "#education"})
    if "contact" in q or "gmail" in q or "email" in q or "hire" in q:
        actions.append({"label": "Go to Contact Console ✉️", "type": "scroll", "target": "#contact"})
    return actions


class PortfolioAssistant:
    def __init__(self, api_key=None, collection=None, llm=None):
        self.api_key = api_key or os.getenv("GROQ_API_KEY", "").strip()
        if not self.api_key and llm is None:
            raise RagUnavailable("GROQ_API_KEY is not set")

        self.collection = collection if collection is not None else open_collection()
        # Load the ONNX model now, so the first visitor question doesn't pay for it
        self.collection.query(query_texts=["warm up"], n_results=1)

        if llm is None:
            from langchain_groq import ChatGroq

            llm = ChatGroq(
                model=GROQ_MODEL,
                api_key=self.api_key,
                temperature=0.3,
                timeout=GROQ_TIMEOUT_SECONDS,
                max_retries=1,
            )
        self.llm = llm

    def retrieve(self, question: str, k: int = TOP_K) -> list:
        result = self.collection.query(query_texts=[question], n_results=k)
        return (result.get("documents") or [[]])[0]

    def query(self, user_message: str, history: list) -> dict:
        """Answer with Groq using retrieved portfolio context. Returns {"answer", "actions"}."""
        q = user_message.lower()

        # Small talk is answered instantly from the local replies
        if score_intent(q) in CHITCHAT_INTENTS:
            return get_local_reply(user_message, history)

        try:
            context = "\n---\n".join(self.retrieve(user_message))
            memory_str = "\n".join(
                f"{msg['role'].capitalize()}: {msg['content']}" for msg in (history or [])[-4:]
            )
            prompt = SYSTEM_PROMPT.format(context=context, memory_str=memory_str, user_message=user_message)
            response = self.llm.invoke(prompt)
            answer_text = str(response.content).strip().replace("•", "-")
            if not answer_text:
                raise ValueError("empty answer from Groq")
        except Exception:
            # Rate limits, timeouts, network or retrieval errors: answer locally instead of failing
            logger.exception("Groq/RAG answer failed; using local reply")
            return get_local_reply(user_message, history)

        actions = intent_actions(q) or [
            {"label": "Summarize Shivam ⏱️", "type": "scroll", "target": "trigger:summary"},
            {"label": "Show AI Projects 🧭", "type": "scroll", "target": "#projects"},
        ]
        return {"answer": answer_text, "actions": actions}
