import os
import shutil
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.documents import Document

# 1. Compile structured portfolio details based directly on the resume and projects list
PORTFOLIO_DOCUMENTS = [
    # Bio Documents
    Document(
        page_content="""
        Shivam Pathak is an AI Engineer and Data Science Specialist. 
        He specializes in building intelligent systems, production-ready AI agents, Retrieval-Augmented Generation (RAG) pipelines, and scalable backends.
        He pursues a B.Tech in Computer Science and Engineering from Graphic Era Hill University, Dehradun (expected graduation 2026) where he maintains a 6.88 CGPA.
        Shivam has certifications and accomplishments like being a TCS NQT 2025 Top 10% candidate, obtaining a Google Cloud GenAI Certification, and representing Graphic Era in the National Basketball Championship.
        Shivam is currently employed as an AI Engineer Intern at Northcorp Software (Remote) since January 2026.
        Shivam's email address is pathakshivam3738@gmail.com, his GitHub profile is https://github.com/shivampathak2812, and his LinkedIn profile is https://www.linkedin.com/in/shivam-pathak-9a76ba246.
        """,
        metadata={"source": "bio", "category": "general"}
    ),
    
    # Work Experience Documents
    Document(
        page_content="""
        Shivam Pathak is an AI Engineer Intern at Northcorp Software (Remote) from January 2026 to Present.
        His core responsibilities and achievements in this role include:
        - Built 10+ REST API endpoints for AI-powered Talent Assessment Platform (TAP) using FastAPI and PostgreSQL, managing skill gap analysis, resume generation, and cover letter automation.
        - Developed LLM features using Google Gemini API and RAG pipelines; managed PostgreSQL schema with SQLAlchemy async ORM, 5+ Alembic migrations, MinIO storage, and JWT + bcrypt auth.
        - Deployed services via Docker Compose; contributed across design, development, and testing using GitLab workflow.
        In this role, he gained mastery in FastAPI, PostgreSQL, Google Gemini API, RAG Pipelines, SQLAlchemy ORM, Alembic migrations, MinIO, Docker Compose, and GitLab.
        """,
        metadata={"source": "experience", "category": "work"}
    ),
    
    # Skills Documents
    Document(
        page_content="""
        Shivam Pathak's technical skills matrix is classified into three categories:
        1. AI/ML & Generative AI: Google Gemini API, LLaMA 3/3.3 models, Retrieval-Augmented Generation (RAG) pipelines, Natural Language Processing (NLP), Scikit-Learn, Pandas, NumPy, Matplotlib, Seaborn.
        2. Backend & Databases: FastAPI, Python, PostgreSQL, SQLAlchemy Async ORM, Alembic migrations, Redis caching, MinIO object storage, JWT + bcrypt authentication, REST API development.
        3. Tools & DevOps: Docker Compose, Git, GitLab Workflow, Git/GitHub, Linux Bash, Excel analytical modeling (Pivot tables, slicers, KPI dashboards).
        """,
        metadata={"source": "skills", "category": "technical"}
    ),
    
    # Education Documents
    Document(
        page_content="""
        Shivam Pathak's academics and education:
        Degree: Bachelor of Technology (B.Tech) in Computer Science and Engineering (CSE).
        Institution: Graphic Era Hill University, Dehradun (2022 - 2026).
        Academics: Maintains a 6.88 / 10.0 CGPA.
        Achievements and Certifications:
        - Shortlisted as a Top 10% candidate in TCS NQT 2025.
        - Completed Google Cloud GenAI Certification.
        - Completed Python Development Program by Cognifyz Technologies.
        - Represented Graphic Era Hill University in the National Basketball Championship.
        """,
        metadata={"source": "education", "category": "academic"}
    ),
    
    # Project 1: TravelArt
    Document(
        page_content="""
        Project Title: TravelArt
        GitHub Repository: https://github.com/shivampathak2812/TravelART.git
        Technologies: FastAPI, React, PostgreSQL, Redis, Groq LLaMA 3.3, JWT + OTP Authentication
        Description: Built an AI-powered full-stack travel itinerary platform. 
        It integrates Groq LLaMA 3.3 to construct custom day-by-day travel routes, utilizing Redis caching to reduce query latency by 60%.
        Features secure JWT + OTP authentication, responsive React frontend, and dynamic AI trip modification based on user budgets and interests.
        """,
        metadata={"source": "projects", "project": "TravelArt", "accent": "purple"}
    ),
    
    # Project 2: ATS-Pro-Analyzer
    Document(
        page_content="""
        Project Title: ATS-Pro-Analyzer
        GitHub Repository: https://github.com/shivampathak2812/ATS-Pro-Analyzer.git
        Technologies: FastAPI, Groq LLaMA-3, Natural Language Processing (NLP), JWT Auth, Resume ATS
        Description: Built an AI-powered ATS Resume Analyzer.
        It compares candidate resumes with specific job roles, outputting a precise score, keyword gap map, and targeted bullet recommendations.
        Uses NLP parsing and Groq LLaMA 3 to score resumes against job descriptions, maximizing candidate ATS compatibility.
        """,
        metadata={"source": "projects", "project": "ATS-Pro-Analyzer", "accent": "orange"}
    ),
    
    # Project 3: House Price Prediction
    Document(
        page_content="""
        Project Title: House Price Prediction
        GitHub Repository: https://github.com/shivampathak2812/Machine_learning.git
        Technologies: Python, Scikit-Learn, Pandas, NumPy, Regression Models, EDA
        Description: Built a Machine Learning-based House Price Prediction system for real-estate price estimation.
        Implements regression models (Scikit-Learn) with statistical outlier removal and extensive feature engineering using Pandas and NumPy.
        Generates predictive analytics on property valuations.
        """,
        metadata={"source": "projects", "project": "House Price Prediction", "accent": "purple"}
    ),
    
    # Project 4: Courier Partner App
    Document(
        page_content="""
        Project Title: Courier Partner App
        GitHub Repository: https://github.com/shivampathak2812/courier_partner.git
        Technologies: FastAPI, Python, Logistics, REST API, Database ORM (SQLAlchemy)
        Description: Developed a modern courier management application with optimized delivery workflows and responsive UI.
        Saves dispatch routing logs via SQLAlchemy ORM, delivering real-time delivery status tracking for logistics managers.
        """,
        metadata={"source": "projects", "project": "Courier Partner App", "accent": "orange"}
    ),
    
    # Project 5: Matrix Calculator
    Document(
        page_content="""
        Project Title: Matrix Calculator
        GitHub Repository: https://github.com/shivampathak2812/matrix_calculator.git
        Technologies: HTML5, CSS3, JavaScript ES6, Matrix Algebra, Glassmorphism
        Description: Built a responsive Matrix Calculator supporting dynamic NxN matrix operations.
        Engineers client-side Matrix multiplication, transposition, determinants, and inversion with zero external dependencies.
        Matches glassmorphism design parameters.
        """,
        metadata={"source": "projects", "project": "Matrix Calculator", "accent": "purple"}
    ),
    
    # Project 6: Zomato Dashboard
    Document(
        page_content="""
        Project Title: Zomato Dashboard
        GitHub Repository: https://github.com/shivampathak2812/Zomato-Dashboard.git
        Technologies: Excel Analytics, KPI Dashboards, Pivot Tables, Data Visualization
        Description: Built a dynamic Zomato Excel Dashboard to analyze food delivery records and generate key operational business insights.
        Organizes massive unstructured CSV data with 197K+ records using advanced pivot calculations, interactive slicers, and KPI mapping.
        """,
        metadata={"source": "projects", "project": "Zomato Dashboard", "accent": "orange"}
    ),
    
    # Project 7: Exploratory Data Analysis
    Document(
        page_content="""
        Project Title: Exploratory Data Analysis
        GitHub Repository: https://github.com/shivampathak2812
        Technologies: Python, Pandas, NumPy, Matplotlib, Seaborn, Statistical EDA
        Description: Performed Exploratory Data Analysis (EDA) using statistical visualization modules to map core distributions.
        Creates heatmap matrices, scatter patterns, and statistical summaries to translate datasets into strategic business insights.
        """,
        metadata={"source": "projects", "project": "Exploratory Data Analysis", "accent": "purple"}
    )
]

def main():
    print("=========================================")
    print("Starting Portfolio Database Ingestion...")
    print("=========================================")
    
    # Path for chroma vector storage
    db_dir = os.path.join(os.path.dirname(__file__), "chroma_db")
    
    # Purge existing directory if present to allow fresh ingestion
    if os.path.exists(db_dir):
        print(f"Purging existing database directory at: {db_dir}")
        shutil.rmtree(db_dir)
        
    # Standard local HuggingFace embeddings running fully on local CPU
    print("Loading HuggingFace Embeddings Model (all-MiniLM-L6-v2)...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    # Create persistent Chroma Vector Store using native client
    print(f"Creating local vector database in: {db_dir}...")
    import chromadb
    chroma_client = chromadb.PersistentClient(path=db_dir)
    db = Chroma.from_documents(
        PORTFOLIO_DOCUMENTS,
        embeddings,
        client=chroma_client
    )
    
    print("\nIngestion completed successfully!")
    print(f"Total documents vectorized: {len(PORTFOLIO_DOCUMENTS)}")
    print("Chroma DB is successfully ready to accept local semantic queries!")
    print("=========================================")

if __name__ == "__main__":
    main()
