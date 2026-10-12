"""AVIX portfolio assistant API (FastAPI).

Two modes, chosen with the ``DEMO_MODE`` environment variable:

* ``DEMO_MODE=true``  -> answers come from ``local_replies`` (predefined, keyword-
  scored portfolio answers). No Groq key, embedding model, vector index or
  LangChain import is needed, so memory stays far below Render's 512 MB limit.
* ``DEMO_MODE=false`` -> Groq + RAG (``rag_engine``). The heavy pieces are loaded
  lazily, once, in a background thread; until they are ready, or if loading
  fails, ``/chat`` keeps answering with the local replies instead of erroring.

The ``/chat`` request/response contract is unchanged:
    request:  {"message": str, "history": [{"role": str, "content": str}, ...]}
    response: {"answer": str, "actions": [{"label": str, "type": str, "target": str}, ...]}
"""

import logging
import os
import threading
import time
from contextlib import asynccontextmanager
from typing import List

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Re-exported for backwards compatibility (rag_engine and older code imported them from main)
from local_replies import get_local_reply, score_intent  # noqa: F401

load_dotenv()

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger("avix")


def env_flag(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None or value.strip() == "":
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


DEMO_MODE = env_flag("DEMO_MODE", False)
# Load the RAG stack at startup instead of on the first chat (off by default to keep boot light)
RAG_PRELOAD = env_flag("RAG_PRELOAD", False)
# After a failed RAG initialization, wait this long before trying again
RAG_RETRY_COOLDOWN_SECONDS = float(os.getenv("RAG_RETRY_COOLDOWN_SECONDS", "300"))
# Bound prompt size: long messages / histories are truncated, not rejected
MAX_MESSAGE_CHARS = 2000
MAX_HISTORY_MESSAGES = 10

DEFAULT_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://portfolio-my-ivory.vercel.app",
]
EXTRA_ORIGINS = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]


def groq_configured() -> bool:
    return bool(os.getenv("GROQ_API_KEY", "").strip())


class RagState:
    """Owns the lazily created RAG assistant.

    ``get()`` never blocks a request: the first call starts a background
    initialization and returns ``None`` (callers then answer locally). A failed
    initialization is remembered and only retried after a cooldown, so a broken
    index or missing model cannot make every request re-load heavy components.
    """

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self.assistant = None
        self.status = "disabled" if DEMO_MODE else "not_initialized"
        self.error = None
        self._last_attempt = 0.0
        self._loading = False

    def snapshot(self) -> dict:
        with self._lock:
            return {"status": self.status, "error": self.error}

    def get(self, wait: bool = False):
        if DEMO_MODE:
            return None
        if self.assistant is not None:
            return self.assistant
        with self._lock:
            if self.assistant is not None:
                return self.assistant
            if self._loading:
                return None
            if not groq_configured():
                # Without Groq the RAG answers can't be generated, so don't load embeddings/index at all
                self.status = "unavailable"
                self.error = "GROQ_API_KEY is not set; serving local replies"
                return None
            if self.status == "failed" and time.monotonic() - self._last_attempt < RAG_RETRY_COOLDOWN_SECONDS:
                return None
            self._loading = True
            self.status = "initializing"
            self._last_attempt = time.monotonic()
        if wait:
            self._initialize()
            return self.assistant
        threading.Thread(target=self._initialize, name="rag-init", daemon=True).start()
        return None

    def _initialize(self) -> None:
        started = time.monotonic()
        try:
            from rag_engine import PortfolioAssistant

            assistant = PortfolioAssistant()
            with self._lock:
                self.assistant = assistant
                self.status = "ready"
                self.error = None
            logger.info("RAG assistant ready in %.1fs (memory %s MB)", time.monotonic() - started, memory_mb())
        except Exception as exc:  # any failure -> keep serving local replies
            logger.exception("RAG initialization failed; serving local replies until retry")
            with self._lock:
                self.status = "failed"
                self.error = f"{type(exc).__name__}: {exc}"
        finally:
            with self._lock:
                self._loading = False


rag = RagState()


def memory_mb():
    """Resident memory of this process in MB (Linux), without extra dependencies."""
    try:
        with open("/proc/self/status") as f:
            for line in f:
                if line.startswith("VmRSS:"):
                    return round(int(line.split()[1]) / 1024, 1)
    except OSError:
        pass
    return None


@asynccontextmanager
async def lifespan(_app: FastAPI):
    mode = "demo" if DEMO_MODE else "rag"
    logger.info("AVIX API starting in %s mode (groq configured: %s)", mode, groq_configured())
    if not DEMO_MODE and RAG_PRELOAD:
        rag.get()
    yield


app = FastAPI(title="Shivam Pathak AI Portfolio Assistant API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=DEFAULT_ORIGINS + EXTRA_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []


class ChatAction(BaseModel):
    label: str
    type: str
    target: str


class ChatResponse(BaseModel):
    answer: str
    actions: List[ChatAction] = []


@app.get("/health")
def health_check():
    """Liveness + status. Never loads the RAG stack."""
    return {
        "status": "healthy",
        "mode": "demo" if DEMO_MODE else "rag",
        "engine": "FastAPI + local replies" if DEMO_MODE else "FastAPI + Groq + ChromaDB RAG",
        "groq_configured": groq_configured(),
        "rag": rag.snapshot(),
        "memory_mb": memory_mb(),
    }


@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    message = request.message[:MAX_MESSAGE_CHARS]
    history = [
        {"role": m.role, "content": m.content[:MAX_MESSAGE_CHARS]}
        for m in request.history[-MAX_HISTORY_MESSAGES:]
    ]

    if DEMO_MODE:
        return get_local_reply(message, history)

    assistant = rag.get()
    if assistant is None:
        return get_local_reply(message, history)
    try:
        return assistant.query(message, history)
    except Exception:
        logger.exception("RAG query failed; answering locally")
        return get_local_reply(message, history)


if __name__ == "__main__":
    import uvicorn

    # Local development entry point. On Render use the start command:
    #   uvicorn main:app --host 0.0.0.0 --port $PORT
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=env_flag("UVICORN_RELOAD", False),
    )
