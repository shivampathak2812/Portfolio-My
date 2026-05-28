import os
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from prompts import SYSTEM_PROMPT

# Load environmental variables from .env file
load_dotenv()

# Global pointers to vector storage
DB_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")
EMBEDDINGS = None
DB = None

def get_vector_db():
    global EMBEDDINGS, DB
    if DB is None:
        if not os.path.exists(DB_DIR):
            raise FileNotFoundError(f"Vector Database directory not found at: {DB_DIR}. Please run ingest.py first!")
        EMBEDDINGS = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        import chromadb
        chroma_client = chromadb.PersistentClient(path=DB_DIR)
        DB = Chroma(client=chroma_client, embedding_function=EMBEDDINGS)
    return DB

class PortfolioAssistant:
    def __init__(self):
        # Fetch Groq API Key from environment
        self.api_key = os.getenv("GROQ_API_KEY")
        self.db = None
        
        try:
            self.db = get_vector_db()
        except Exception as e:
            import traceback
            print(f"Warning during DB initialization: {e}")
            traceback.print_exc()
            
        if self.api_key:
            # Initialize LLaMA 3 via Groq API (using supported llama-3.3-70b-versatile)
            self.llm = ChatGroq(
                temperature=0.3,
                model_name="llama-3.3-70b-versatile",
                groq_api_key=self.api_key
            )
        else:
            print("Warning: GROQ_API_KEY not found! The backend will operate in fallback mode using smart local replies.")
            self.llm = None

    def query(self, user_message: str, history: list) -> dict:
        """
        Retrieves context from Chroma DB and queries LLaMA 3 via Groq.
        Returns a dictionary containing the synthesized 'answer' and a list of contextual 'actions'.
        """
        q = user_message.lower()
        actions = []
        
        # 1. Inspect user intent and automatically register action buttons (matching frontend)
        if "resume" in q or "cv" in q or "download" in q:
            actions.append({"label": "Download Resume 📄", "type": "download", "target": "/resume/Resume_Shivam.pdf"})
            
        if "travelart" in q or "travel art" in q:
            actions.append({"label": "Go to Projects Grid 🧭", "type": "scroll", "target": "#projects"})
            actions.append({"label": "View TravelArt Code 🐙", "type": "link", "target": "https://github.com/shivampathak2812/TravelART.git"})
            
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

        # Intercept simple greetings & chitchat to respond instantly and warmly, or execute client failover
        from main import score_intent, get_local_reply  # noqa: E402
        intent_type = score_intent(q)
        chitchat_intents = [
            "greeting", "chitchat_thanks", "chitchat_compliment", "chitchat_confirm", "chitchat_bye",
            "chitchat_feeling", "chitchat_name", "chitchat_joke", "chitchat_capabilities",
            "chitchat_weather", "chitchat_age", "chitchat_creator", "chitchat_favorite"
        ]
        if intent_type in chitchat_intents or not self.llm or not self.db:
            reply = get_local_reply(user_message, history)
            return reply

        # 2. Perform semantic context search inside local Chroma DB (k=2 to reduce context overload)
        docs = self.db.similarity_search(user_message, k=2)
        context = "\n---\n".join([doc.page_content for doc in docs])
        
        # 3. Structure conversational memory logs
        memory_str = ""
        if history:
            memory_str = "\n".join([f"{msg['role'].capitalize()}: {msg['content']}" for msg in history[-4:]])

        # 4. Construct professional, recruiter-optimized prompt from prompts.py
        system_prompt = SYSTEM_PROMPT.format(
            context=context,
            memory_str=memory_str,
            user_message=user_message
        )

        try:
            # 5. Invoke LLaMA 3 model
            response = self.llm.invoke(system_prompt)
            answer_text = response.content.strip()
            # Normalize bullets and trim spacing
            answer_text = answer_text.replace("•", "-")
            
            # Format generic default actions if nothing specific was registered
            if not actions:
                actions.append({"label": "Summarize Shivam ⏱️", "type": "scroll", "target": "trigger:summary"})
                actions.append({"label": "Show AI Projects 🧭", "type": "scroll", "target": "#projects"})
                
            return {
                "answer": answer_text,
                "actions": actions
            }
        except Exception as e:
            print(f"Error querying Groq LLM: {e}")
            # Fallback to local reply if Groq API rate-limits or times out
            from main import get_local_reply  # noqa: E402
            return get_local_reply(user_message, history)
