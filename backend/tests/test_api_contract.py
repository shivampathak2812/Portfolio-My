"""The /chat and /health contract the Next.js chatbot (components/Chatbot.tsx) depends on."""

import pytest
from fastapi.testclient import TestClient


@pytest.fixture(params=[True, False], ids=["demo", "rag-without-key"])
def client(request, load_main):
    main = load_main(demo_mode=request.param, groq_key=None)
    return TestClient(main.app)


def assert_chat_shape(body):
    assert set(body) == {"answer", "actions"}
    assert isinstance(body["answer"], str) and body["answer"]
    assert isinstance(body["actions"], list)
    for action in body["actions"]:
        assert set(action) == {"label", "type", "target"}
        assert all(isinstance(action[k], str) for k in action)


def test_chat_accepts_frontend_payload(client):
    # Exactly what Chatbot.tsx sends: {message, history: [{role, content}]}
    payload = {
        "message": "What projects has he built?",
        "history": [
            {"role": "assistant", "content": "Hi, I'm Avix."},
            {"role": "user", "content": "hello"},
        ],
    }
    response = client.post("/chat", json=payload)
    assert response.status_code == 200
    assert_chat_shape(response.json())


def test_chat_history_is_optional(client):
    response = client.post("/chat", json={"message": "skills"})
    assert response.status_code == 200
    assert_chat_shape(response.json())


def test_very_long_messages_are_handled(client):
    response = client.post("/chat", json={"message": "skills " * 5000, "history": [{"role": "user", "content": "x" * 50000}] * 30})
    assert response.status_code == 200
    assert_chat_shape(response.json())


def test_invalid_payload_is_a_client_error(client):
    assert client.post("/chat", json={"history": []}).status_code == 422


def test_health_is_ok_and_cors_allows_the_site(client):
    response = client.get("/health", headers={"Origin": "https://portfolio-my-ivory.vercel.app"})
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert response.headers["access-control-allow-origin"] == "https://portfolio-my-ivory.vercel.app"
