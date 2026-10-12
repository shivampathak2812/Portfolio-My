import importlib
import os
import subprocess
import sys
import textwrap
from pathlib import Path

import pytest

BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

HEAVY_MODULES = ("rag_engine", "chromadb", "langchain_groq", "langchain_core", "langchain", "langchain_community",
                 "sentence_transformers", "torch", "onnxruntime", "transformers")


@pytest.fixture
def load_main(monkeypatch):
    """Import a fresh ``main`` module with the given environment."""

    def _load(demo_mode: bool, groq_key=None, **extra_env):
        monkeypatch.setenv("DEMO_MODE", "true" if demo_mode else "false")
        if groq_key is None:
            monkeypatch.delenv("GROQ_API_KEY", raising=False)
        else:
            monkeypatch.setenv("GROQ_API_KEY", groq_key)
        monkeypatch.delenv("RAG_PRELOAD", raising=False)
        for key, value in extra_env.items():
            monkeypatch.setenv(key, value)
        # load_dotenv must not pull a developer's real .env into tests
        monkeypatch.setattr("dotenv.load_dotenv", lambda *a, **k: False)
        sys.modules.pop("main", None)
        return importlib.import_module("main")

    yield _load
    sys.modules.pop("main", None)


def run_isolated(code: str, env: dict) -> str:
    """Run Python in a fresh interpreter (clean sys.modules) from the backend dir; return stdout."""
    full_env = {k: v for k, v in os.environ.items() if k not in ("DEMO_MODE", "GROQ_API_KEY", "RAG_PRELOAD")}
    full_env.update(env)
    result = subprocess.run(
        [sys.executable, "-c", textwrap.dedent(code)],
        cwd=BACKEND_DIR, env=full_env, capture_output=True, text=True, timeout=120,
    )
    assert result.returncode == 0, result.stderr
    return result.stdout
