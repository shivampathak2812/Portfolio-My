"""DEMO_MODE=true: predefined answers, no Groq key, no RAG / ChromaDB / embeddings."""

import pytest
from fastapi.testclient import TestClient

from conftest import HEAVY_MODULES, run_isolated


@pytest.fixture
def client(load_main):
    main = load_main(demo_mode=True)
    return TestClient(main.app)


def ask(client, message, history=None):
    response = client.post("/chat", json={"message": message, "history": history or []})
    assert response.status_code == 200
    return response.json()


@pytest.mark.parametrize(
    "question, expected",
    [
        ("What are his technical skills?", ["FastAPI", "PostgreSQL"]),
        ("Tell me about his projects", ["PHP Vibe Coder", "WorkLens", "HR Leave Assistant"]),
        ("What is his work experience?", ["Silicon Interfaces", "Northcorp Software"]),
        ("Where did he study? What is his education?", ["Graphic Era Hill University", "6.88"]),
        ("How can I contact him?", ["pathakshivam3738@gmail.com", "github.com/shivampathak2812"]),
        ("Tell me about WorkLens", ["XGBoost", "91%"]),
        ("Can I download his resume?", ["resume"]),
        ("Summarize Shivam in 30 seconds", ["Trainee Engineer", "Northcorp"]),
    ],
)
def test_demo_mode_answers_common_questions(client, question, expected):
    data = ask(client, question)
    for fact in expected:
        assert fact.lower() in data["answer"].lower(), f"{fact!r} missing from answer to {question!r}"
    assert data["actions"], "common questions should come with quick-action buttons"


@pytest.mark.parametrize(
    "question, expected",
    [
        ("What was his basketball achievement?", "National Basketball Championship"),
        ("Which model gives 91% F1?", "WorkLens"),
        ("Did he use FAISS anywhere?", "PHP Vibe Coder"),
    ],
)
def test_demo_mode_searches_facts_for_unmatched_questions(client, question, expected):
    # "his"/"which" must not trigger the greeting, and unmatched questions get real facts, not the canned menu
    data = ask(client, question)
    assert expected in data["answer"]
    assert "Try asking me" not in data["answer"]
    assert not data["answer"].startswith("Hi!")


def test_demo_mode_has_a_fallback_for_unknown_questions(client):
    data = ask(client, "What is the capital of Mongolia?")
    assert "Try asking me" in data["answer"]
    assert data["actions"]


def test_demo_mode_needs_no_groq_key(load_main, monkeypatch):
    monkeypatch.delenv("GROQ_API_KEY", raising=False)
    main = load_main(demo_mode=True)
    client = TestClient(main.app)
    assert ask(client, "what are his skills")["answer"]
    assert main.rag.snapshot()["status"] == "disabled"


def test_demo_mode_health_reports_demo_without_loading_rag(client):
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "healthy"
    assert body["mode"] == "demo"
    assert body["rag"]["status"] == "disabled"


def test_demo_mode_never_imports_rag_chromadb_or_embeddings():
    # Fresh interpreter so other tests' imports can't hide a leak
    out = run_isolated(
        """
        import sys
        from fastapi.testclient import TestClient
        import main
        client = TestClient(main.app)
        for q in ["hi", "skills", "projects", "experience", "education", "contact", "random question"]:
            assert client.post("/chat", json={"message": q, "history": []}).status_code == 200
        assert client.get("/health").status_code == 200
        print(",".join(sorted(m for m in sys.modules)))
        """,
        {"DEMO_MODE": "true", "GROQ_API_KEY": "gsk_should_not_be_used"},
    )
    loaded = set(out.strip().split(","))
    leaked = [m for m in HEAVY_MODULES if m in loaded]
    assert not leaked, f"demo mode imported heavy modules: {leaked}"


@pytest.mark.parametrize(
    "question",
    ["give me shivam experience in number not text", "How many years of experience does he have?", "Total experience?"],
)
def test_demo_mode_gives_experience_as_numbers(client, question):
    data = ask(client, question)
    assert "Total experience:" in data["answer"]
    assert "6 months" in data["answer"]  # Northcorp, Jan–Jun 2026


def test_experience_duration_counts_months():
    from datetime import date

    from local_replies import experience_duration_reply

    answer = experience_duration_reply(date(2026, 10, 15))["answer"]
    assert "Total experience: 10 months" in answer
    assert "**4 months** (Jul 2026 – Present)" in answer
