"""Build the AVIX vector index (ChromaDB) from ``knowledge_base.PORTFOLIO_DOCUMENTS``.

Run once when the knowledge base changes, e.g. in the Render *build* command:
    pip install -r requirements.txt && python ingest.py

Never run at server startup. Uses the same ONNX ``all-MiniLM-L6-v2`` embedding
as the runtime retriever (no PyTorch), and also downloads that model into
``backend/.models`` so the server doesn't have to fetch it later.
Not needed at all when DEMO_MODE=true.
"""

import shutil
import sys

from knowledge_base import PORTFOLIO_DOCUMENTS
from rag_engine import COLLECTION_NAME, DB_DIR, MODEL_DIR, chroma_client, get_embedding_function


def main() -> int:
    print("=========================================")
    print("Building AVIX portfolio vector index...")
    print("=========================================")

    if DB_DIR.exists():
        print(f"Removing previous index at {DB_DIR}")
        shutil.rmtree(DB_DIR)

    print(f"Loading ONNX embedding model all-MiniLM-L6-v2 (cache: {MODEL_DIR})...")
    embedding_function = get_embedding_function()

    client = chroma_client(DB_DIR)
    collection = client.create_collection(COLLECTION_NAME, embedding_function=embedding_function)
    collection.add(
        ids=[doc["id"] for doc in PORTFOLIO_DOCUMENTS],
        documents=[doc["text"] for doc in PORTFOLIO_DOCUMENTS],
        metadatas=[doc["metadata"] for doc in PORTFOLIO_DOCUMENTS],
    )

    count = collection.count()
    if count != len(PORTFOLIO_DOCUMENTS):
        print(f"ERROR: expected {len(PORTFOLIO_DOCUMENTS)} documents, index has {count}", file=sys.stderr)
        return 1

    print(f"\nIndexed {count} documents into {DB_DIR}")
    print("=========================================")
    return 0


if __name__ == "__main__":
    sys.exit(main())
