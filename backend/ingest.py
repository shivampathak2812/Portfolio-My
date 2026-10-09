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
        He holds a Bachelor of Technology (B.Tech) in Computer Science and Engineering from Graphic Era Hill University, Haldwani (Graduated in June 2025) where he maintained a 6.88 CGPA.
        Shivam has certifications and accomplishments like being a TCS NQT 2025 Top 10% candidate, completing an Advanced Certification in Data Science (ML) from Seed Infotech, and representing his university in the National Basketball Championship.
        Shivam worked as an AI Engineer Intern at Northcorp Software from January 2026 to June 2026, and since July 2026 he has been a Trainee Engineer – Data Science & AI/ML at Silicon Interfaces Pvt. Ltd., Mumbai.
        Shivam's email address is pathakshivam3738@gmail.com, his GitHub profile is https://github.com/shivampathak2812, and his LinkedIn profile is https://www.linkedin.com/in/shivam-pathak-9a76ba246.
        """,
        metadata={"source": "bio", "category": "general"}
    ),
    
    # Work Experience Documents
    Document(
        page_content="""
        Shivam Pathak is an AI Engineer Intern at Northcorp Software from January 2026 to June 2026.
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
        Shivam Pathak's technical skills matrix is classified into four categories:
        1. AI/ML & Generative AI: Google Gemini API, LLaMA 3/3.3 models, Retrieval-Augmented Generation (RAG) pipelines, Natural Language Processing (NLP), Scikit-Learn, XGBoost, Pandas, NumPy, Matplotlib, Seaborn.
        2. Backend & Databases: FastAPI, Python, PostgreSQL, SQLAlchemy Async ORM, Alembic migrations, Redis caching, MinIO object storage, JWT + bcrypt authentication, REST API development.
        3. Data Engineering: ETL pipelines, Apache Airflow, data processing, data validation.
        4. Tools & DevOps: Docker Compose, Git, GitLab Workflow, Git/GitHub, Linux Bash, Excel analytical modeling (Pivot tables, slicers, KPI dashboards).
        """,
        metadata={"source": "skills", "category": "technical"}
    ),
    
    # Education Documents
    Document(
        page_content="""
        Shivam Pathak's academics and education:
        Degree: Bachelor of Technology (B.Tech) in Computer Science and Engineering (CSE).
        Institution: Graphic Era Hill University, Haldwani (July 2022 - June 2025).
        Status: Graduated (Degree Completed in June 2025).
        Academics: Achieved a 6.88 / 10.0 CGPA.
        Achievements and Certifications:
        - Shortlisted as a Top 10% candidate in TCS NQT 2025.
        - Completed Advanced Certification in Data Science (ML) from Seed Infotech (2026).
        - Completed Python Development Program by Cognifyz Technologies.
        - Represented his university in the National Basketball Championship.
        """,
        metadata={"source": "education", "category": "academic"}
    ),
    
    # Project 1: PHP Vibe Coder
    Document(
        page_content="""
        Project Title: PHP Vibe Coder
        GitHub Repository: https://github.com/shivampathak2812/PHP-VibeCoder.git
        Technologies: Python, Streamlit, Google Gemini (google-genai), RAG, Sentence Transformers (all-MiniLM-L6-v2), FAISS, PHP 8 CLI
        Description: Built an AI-assisted PHP development workspace that turns a plain-English requirement (with an optional document or image) into a complete PHP project.
        It retrieves relevant PHP documentation through Sentence Transformers embeddings and FAISS vector search (RAG) before Google Gemini generates code.
        Every generated file is checked with PHP's built-in syntax validator (php -l); failures are sent to a debugging agent that repairs and re-validates up to three times.
        It can also explain an existing PHP project's structure and code flow, and refactor a selected file while preserving its behavior.
        """,
        metadata={"source": "projects", "project": "PHP Vibe Coder", "accent": "purple"}
    ),
    
    # Project: WorkLens
    Document(
        page_content="""
        Project Title: WorkLens
        GitHub Repository: https://github.com/shivampathak2812/WorkLens.git
        Technologies: Python, XGBoost, FastAPI, React (Vite), Recharts, Pandas, Scikit-learn
        Description: Built an end-to-end employee attrition prediction and HR analytics platform.
        An optimized XGBoost classifier trained on the IBM HR Attrition dataset scores attrition risk from 15 core employee parameters, achieving a 91% F1-score and 83% test accuracy.
        A FastAPI backend serves prediction and outcome endpoints and logs prediction history; a React (Vite) multi-step form wizard and Recharts dashboard show attrition by department, risk distributions, and configurable HR alert thresholds.
        """,
        metadata={"source": "projects", "project": "WorkLens", "accent": "orange"}
    ),

    # Project: HR Leave Assistant
    Document(
        page_content="""
        Project Title: HR Leave Assistant
        GitHub Repository: https://github.com/shivampathak2812/HRLeaveAgent.git
        Live Demo: https://hr-leave-assistant.streamlit.app/
        Technologies: Python, LangGraph, Google Gemini, Streamlit, Pandas
        Description: Built an AI HR leave agent that lets an employee apply for leave in plain English.
        A LangGraph agent powered by Google Gemini looks up the employee in an Excel database, checks the request against the company rule book (probation, advance notice, max 5 consecutive days, leave balance), and either approves it and updates the database or explains why not.
        The Streamlit chat UI has employee and HR logins, live tool-call traces, uploads for custom rule books and databases, and an FAQ cache that answers common policy questions instantly.
        """,
        metadata={"source": "projects", "project": "HR Leave Assistant", "accent": "purple"}
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
