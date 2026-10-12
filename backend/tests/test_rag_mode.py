"""DEMO_MODE=false: Groq + RAG with graceful fallbacks (no network or models needed)."""

import sys
import types

import pytest
from fastapi.testclient import TestClient

from conftest import run_isolated


def install_fake_rag_engine(monkeypatch, assistant_factory):
    """Replace rag_engine with a stub so tests never load ChromaDB/ONNX or call Groq."""
    module = types.ModuleType("rag_engine")
    module.PortfolioAssistant = assistant_factory
    monkeypatch.setitem(sys.modules, "rag_engine", module)
    return module


class FakeAssistant:
    created = 0

    def __init__(self):
        type(self).created += 1

    def query(self, message, history):
        return {"answer": f"RAG answer to: {message}", "actions": [{"label": "Go", "type": "scroll", "target": "#projects"}]}


def test_normal_mode_answers_with_rag_once_ready(load_main, monkeypatch):
    FakeAssistant.created = 0
    install_fake_rag_engine(monkeypatch, FakeAssistant)
    main = load_main(demo_mode=False, groq_key="gsk_test")
    client = TestClient(main.app)

    # The first chat starts a background load and is answered locally instead of blocking
    first = client.post("/chat", json={"message": "Tell me about WorkLens", "history": []})
    assert first.status_code == 200
    assert "WorkLens" in first.json()["answer"]

    main.rag.get(wait=True)  # deterministic in tests (normally the background thread finishes it)
    assert main.rag.snapshot()["status"] == "ready"

    second = client.post("/chat", json={"message": "Tell me about WorkLens", "history": []})
    assert second.json()["answer"] == "RAG answer to: Tell me about WorkLens"
    assert FakeAssistant.created == 1, "the assistant (and its models) must only be created once"


def test_missing_groq_key_skips_rag_and_answers_locally(load_main, monkeypatch):
    FakeAssistant.created = 0
    install_fake_rag_engine(monkeypatch, FakeAssistant)
    main = load_main(demo_mode=False, groq_key=None)
    client = TestClient(main.app)

    response = client.post("/chat", json={"message": "What are his skills?", "history": []})
    assert response.status_code == 200
    assert "FastAPI" in response.json()["answer"]
    assert FakeAssistant.created == 0, "no embeddings/index should load without a Groq key"
    assert main.rag.snapshot()["status"] == "unavailable"
    assert client.get("/health").json()["groq_configured"] is False


def test_rag_init_failure_falls_back_and_is_not_retried_every_request(load_main, monkeypatch):
    attempts = {"n": 0}

    def broken_assistant():
        attempts["n"] += 1
        raise RuntimeError("vector index corrupted")

    install_fake_rag_engine(monkeypatch, broken_assistant)
    main = load_main(demo_mode=False, groq_key="gsk_test")
    client = TestClient(main.app)

    main.rag.get(wait=True)
    snapshot = main.rag.snapshot()
    assert snapshot["status"] == "failed"
    assert "vector index corrupted" in snapshot["error"]

    for _ in range(5):
        response = client.post("/chat", json={"message": "What are his skills?", "history": []})
        assert response.status_code == 200
        assert "FastAPI" in response.json()["answer"]
    assert attempts["n"] == 1, "failed initialization must wait for the cooldown before retrying"

    # After the cooldown it tries again
    monkeypatch.setattr(main, "RAG_RETRY_COOLDOWN_SECONDS", 0)
    main.rag.get(wait=True)
    assert attempts["n"] == 2
    assert client.get("/health").json()["rag"]["status"] == "failed"


def test_rag_query_error_falls_back_to_local_reply(load_main, monkeypatch):
    class ExplodingAssistant:
        def query(self, message, history):
            raise TimeoutError("Groq timed out")

    install_fake_rag_engine(monkeypatch, ExplodingAssistant)
    main = load_main(demo_mode=False, groq_key="gsk_test")
    main.rag.get(wait=True)
    response = TestClient(main.app).post("/chat", json={"message": "How can I contact him?", "history": []})
    assert response.status_code == 200
    assert "pathakshivam3738@gmail.com" in response.json()["answer"]


def test_health_does_not_load_rag_stack():
    out = run_isolated(
        """
        import sys
        from fastapi.testclient import TestClient
        import main
        body = TestClient(main.app).get("/health").json()
        print(body["mode"], body["rag"]["status"], "rag_engine" in sys.modules, "chromadb" in sys.modules)
        """,
        {"DEMO_MODE": "false", "GROQ_API_KEY": "gsk_test"},
    )
    assert out.split() == ["rag", "not_initialized", "False", "False"]


# ── rag_engine itself (real module, fake collection / LLM) ──


@pytest.fixture
def rag_engine(monkeypatch):
    sys.modules.pop("rag_engine", None)
    import rag_engine

    yield rag_engine
    sys.modules.pop("rag_engine", None)


class FakeCollection:
    def __init__(self):
        self.queries = []

    def query(self, query_texts, n_results):
        self.queries.append(query_texts[0])
        return {"documents": [["Project Title: WorkLens. XGBoost attrition model with 91% F1-score."][:n_results]]}


class FakeLLM:
    def __init__(self, answer="WorkLens predicts attrition with XGBoost • 91% F1.", error=None):
        self.answer, self.error, self.prompts = answer, error, []

    def invoke(self, prompt):
        self.prompts.append(prompt)
        if self.error:
            raise self.error
        return types.SimpleNamespace(content=self.answer)


def test_assistant_uses_retrieved_context_and_groq(rag_engine):
    llm = FakeLLM()
    assistant = rag_engine.PortfolioAssistant(api_key="gsk_test", collection=FakeCollection(), llm=llm)
    reply = assistant.query("Tell me about WorkLens", [{"role": "user", "content": "hi"}])
    assert reply["answer"] == "WorkLens predicts attrition with XGBoost - 91% F1."
    assert any(a["target"] == "https://github.com/shivampathak2812/WorkLens.git" for a in reply["actions"])
    assert "91% F1-score" in llm.prompts[0], "retrieved context must reach the prompt"


def test_assistant_answers_small_talk_locally(rag_engine):
    llm = FakeLLM()
    assistant = rag_engine.PortfolioAssistant(api_key="gsk_test", collection=FakeCollection(), llm=llm)
    assert "Avix" in assistant.query("What is your name?", [])["answer"]
    assert llm.prompts == []


def test_assistant_falls_back_when_groq_fails(rag_engine):
    assistant = rag_engine.PortfolioAssistant(
        api_key="gsk_test", collection=FakeCollection(), llm=FakeLLM(error=RuntimeError("429 rate limited"))
    )
    reply = assistant.query("What is his education?", [])
    assert "Graphic Era Hill University" in reply["answer"]


def test_assistant_requires_groq_key(rag_engine, monkeypatch):
    monkeypatch.delenv("GROQ_API_KEY", raising=False)
    with pytest.raises(rag_engine.RagUnavailable, match="GROQ_API_KEY"):
        rag_engine.PortfolioAssistant(collection=FakeCollection())


def test_missing_vector_index_is_reported_clearly(rag_engine, monkeypatch, tmp_path):
    monkeypatch.setattr(rag_engine, "DB_DIR", tmp_path / "does-not-exist")
    with pytest.raises(rag_engine.RagUnavailable, match="ingest.py"):
        rag_engine.open_collection()
