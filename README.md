# 🌌 Shivam Pathak — Portfolio Experience

<p align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3BkbWVrZnltczhpbnZ2cHJmMzJkNWswbmFpczlsanRtOHRyNDRrayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjRrfIPjeiVyM/giphy.gif" alt="Cinematic Tech Grid Wave" width="800" style="border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);" />
</p>

<p align="center">
  <strong>An award-winning caliber, Apple-level polished, Vercel-style desaturated AI Engineer portfolio experience.</strong><br />
  Built using Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, and Lenis.
</p>

<p align="center">
  <a href="https://github.com/shivampathak2812"><img src="https://img.shields.io/github/followers/shivampathak2812?label=Follow&style=social" alt="GitHub Followers" /></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js&logoColor=white&color=000000" alt="Next.js" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-blue?style=flat&logo=react&logoColor=61DAFB&color=20232A" alt="React 19" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind--v4-sky?style=flat&logo=tailwind-css&logoColor=38BDF8&color=0F172A" alt="Tailwind CSS v4" /></a>
</p>

---

## 🔮 Refined & Polished Features

*   **🖤 Minimal Premium Obsidian Redesign:** Stripped noisy neons, text glows, and aggressive animations in favor of a luxury visual language inspired by Stripe, Apple, Linear, and Vercel:
    - *Obsidian Theme:* Implemented a deep, desaturated dark background (#030712) with elegant obsidian/silver visual hierarchies.
    - *Strategic Stillness:* Toned down fast bounce indicators, rotation vectors, and grid loops to achieve quiet spatial balance, prioritizing focus and readability.
*   **🤖 AVIX — Intelligent Chatbot & Branding Concierge:** Features complete custom branding and advanced generation controls:
    - *Transparent Custom Wing Logo:* Styled with a premium dark obsidian toggle button (`bg-[#030712] border-white/10`) to provide high-fidelity contrast for the custom transparent AVIX logo.
    - *Fullscreen Maximization:* Toggles seamlessly between floating bubble bounds and fullscreen dimensions with smooth CSS layout transitions.
    - *Instant Fetch & Stream Stop:* Pauses active network fetch retry loops (via a master `AbortController` ref) and freezes typewriter stream intervals instantly.
    - *Ask AVIX Branding:* Custom prompt and placeholder alignment (`"Ask AVIX..."`) to unify the assistant's persona.
*   **⚡ Silky-Smooth Mobile Performance Overhaul:** Adaptive rendering logic that scales features dynamically to maximize frame rates on smaller screens:
    - *Optimized Blurs & Preloads:* Capped heavy CSS backdrop blurs (8px → 3px) and deferred background video loading to prevent layout reflows on mobile.
*   **🎓 Graduated B.Tech Credentials (2022 - 2025):** Fully synchronized the RAG corpus database, Chroma vector stores, local fallback query maps, and frontend panel grids to present up-to-date academic timelines:
    - *Status:* Bachelor of Technology (B.Tech) in Computer Science and Engineering completed in **June 2025** from **Graphic Era Hill University, Haldwani** with a **6.88 CGPA**.
*   **🧠 Robust Fuzzy NLP Local RAG Engine:** Built a resilient offline client matching engine:
    - *Spellcheck Correction:* Automatically normalizes user typos (e.g. `proejct` -> `project`, `skillz` -> `skill`, `educaton` -> `education`).
    - *Singular/Plural Stemming:* Maps singular and plural nouns to single common roots so both `"projects"` and `"project"` match flawlessly.
    - *Token boundary matching:* Analyzes phrases on word boundaries, preventing false-positive greeting matches.
*   **🌌 Aurora Glass Design:** Slow-drifting aurora backdrop, frosted-glass panels, a floating glass navbar and Sora headings, applied consistently across every section (dark-only).
*   **🎥 Video Intro on Every Visit:** A 10-second personal video in a portrait glass frame that starts playing as soon as the site opens (muted with "Tap for sound" where browsers block audio). Always skippable (button or Esc) and replayable from the hero avatar or footer; when it ends, the frame glides into the hero's live video avatar.
*   **💻 7-Featured Projects Ledger:** Minimal desaturated project grid showing custom, static vector SVGs representing databases, API connectors, and logistics charts.
*   **⚙️ Zero-Error CI/CD Pipeline Purity:** Fully cleaned all core React/Next.js/TypeScript modules to satisfy strict code rules (no-explicit-any, hoisting, state hooks in effects, unescaped HTML entities), guaranteeing **100% build-and-lint purity** on GitHub Actions workflows.

---

## 🛠️ Technological Footprints

```
                     ┌──────────────────────────────────────┐
                     │          SHIVAM PATHAK STACK         │
                     └──────────────────┬───────────────────┘
                                        │
         ┌──────────────────────────────┼──────────────────────────────┐
         ▼                              ▼                              ▼
 ┌─────────────────┐            ┌─────────────────┐            ┌─────────────────┐
 │     AI / ML     │            │ DATA & BACKEND  │            │ TOOLS & DEVOPS  │
 ├─────────────────┤            ├─────────────────┤            ├─────────────────┤
 │ • Groq LLaMA-3  │            │ • FastAPI       │            │ • Docker        │
 │ • Gemini API    │            │ • PostgreSQL    │            │ • Git & GitLab  │
 │ • NLP & RAG     │            │ • Redis         │            │ • Linux Shell   │
 │ • Scikit-learn  │            │ • pandas/NumPy  │            │ • Next.js & TS  │
 └─────────────────┘            └─────────────────┘            └─────────────────┘
```

---

## 📂 Structural Blueprint

```bash
Shivam-Portfolio/
├── app/
│   ├── globals.css          # Cinematic film grain, atmosphere blobs, core colors
│   ├── layout.tsx           # Outfit/Inter Fonts integration and metadata SEO setup
│   └── page.tsx             # Application anchor coordinating Navbar & sections
├── backend/                 # Python RAG Pipeline (FastAPI, ChromaDB + ONNX MiniLM, Groq LLaMA-3)
│   ├── main.py              # FastAPI service: /health, /chat, DEMO_MODE and lazy RAG loading
│   ├── local_replies.py     # Predefined portfolio answers (demo mode and fallback)
│   ├── knowledge_base.py    # Portfolio documents indexed for RAG
│   ├── ingest.py            # Builds the ChromaDB index (build time only)
│   ├── rag_engine.py        # Vector search retriever and LLaMA-3 context pipeline
│   ├── tests/               # pytest suite (demo mode, RAG fallbacks, API contract)
│   └── requirements.txt     # Pinned Python dependencies
├── components/
│   ├── Chatbot.tsx          # Sleek glassmorphic floating chat, fullscreen toggle, and stop button
│   ├── chatbotData.ts       # Shared knowledge database & robust fuzzy local NLP RAG engine
│   ├── Navbar.tsx           # Floating glass pill navigation + theme toggle
│   ├── IntroOverlay.tsx     # Video intro on every visit (autoplay, skip, Esc, replay, hand-off)
│   ├── intro.ts             # Intro state, video sources and caption cues
│   ├── Hero.tsx             # Centred hero with the live video avatar
│   ├── About.tsx            # Portrait photo depth frame & professional narrative
│   ├── Education.tsx        # Desaturated academic milestones and credentials card
│   ├── Skills.tsx           # Cursor-tracking radial hover lighting cards
│   ├── Experience.tsx       # Desaturated chronology timeline and skill badges
│   ├── Projects.tsx         # Clean 7-project grid with custom static SVGs
│   ├── Contact.tsx          # Minimialist closing copy terminal console
│   └── SmoothScroll.tsx     # Lenis kinetic scrolling & global mouse tracker
└── public/
    ├── resume/
    │   └── Resume_Shivam.pdf # Downloadable resume PDF
    ├── images/
    │   ├── profile.png      # Portrait photo (2.0 aspect ratio frame)
    │   └── avix-logo.png    # Custom AVIX transparent wings logo
    └── videos/
        ├── intro.mp4        # Intro video (H.264, portrait crop)
        ├── intro.webm       # Intro video (VP9/Opus, smaller)
        └── intro-poster.jpg # Still frame shown before playback
```

---

## 🚀 Setting Up Locally

To replicate Shivam's cinematic portfolio and AI assistant experience:

### 1. Run the Next.js Frontend

1.  **Prerequisites:** Install Node.js (v18+) and npm.
2.  **Clone & Install:**
    ```bash
    git clone https://github.com/shivampathak2812/Portfolio-My.git
    cd Portfolio-My
    npm install
    ```
3.  **Boot Frontend:** Launch Next.js on port `3000`:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser!

### 2. Run the Python RAG Backend (Optional)

The chatbot automatically links to this backend when `NEXT_PUBLIC_BACKEND_URL` points at it. If it is offline, the frontend falls back silently to the browser-based fuzzy NLP matching engine.

The backend has two modes, chosen with the `DEMO_MODE` environment variable:

| Mode | What answers `/chat` | Needs | Memory (measured) |
| --- | --- | --- | --- |
| `DEMO_MODE=true` | Predefined portfolio answers (`local_replies.py`) | nothing | ~50 MB |
| `DEMO_MODE=false` (default) | Groq LLaMA-3 + ChromaDB retrieval, falling back to the predefined answers on any error | `GROQ_API_KEY`, `python ingest.py` | ~310 MB |

1.  **Navigate to Backend & Setup Environment:**
    ```bash
    cd backend
    python -m venv .venv
    # Windows:
    .venv\Scripts\activate
    # macOS/Linux:
    source .venv/bin/activate
    ```
2.  **Install Python Packages:**
    ```bash
    pip install -r requirements.txt        # add -dev to also install pytest
    ```
3.  **Configure Environment Variables:** create `backend/.env` with
    *   `DEMO_MODE=true` for predefined answers only, or
    *   `DEMO_MODE=false` and `GROQ_API_KEY=gsk_...` for Groq + RAG.
4.  **Build the Vector Index (RAG mode only):** embeds the portfolio documents into `chroma_db/` with ChromaDB's ONNX all-MiniLM-L6-v2 (no PyTorch). Re-run when `knowledge_base.py` changes:
    ```bash
    python ingest.py
    ```
5.  **Boot FastAPI Server:**
    ```bash
    uvicorn main:app --port 8000
    ```
    *(Check [http://localhost:8000/health](http://localhost:8000/health); run the tests with `pip install -r requirements-dev.txt && python -m pytest tests`)*

#### Deploying on Render (free 512 MB instance)

`render.yaml` describes the service: root directory `backend`, build `pip install -r requirements.txt && if [ "$DEMO_MODE" != "true" ]; then python ingest.py; fi`, start `uvicorn main:app --host 0.0.0.0 --port $PORT`, health check `/health`. Then set `NEXT_PUBLIC_BACKEND_URL=https://<your-service>.onrender.com` in Vercel and redeploy the frontend.

Optional backend variables: `ALLOWED_ORIGINS` (extra comma-separated CORS origins), `GROQ_MODEL`, `GROQ_TIMEOUT_SECONDS` (20), `RAG_RETRY_COOLDOWN_SECONDS` (300), `RAG_PRELOAD` (load RAG at startup instead of on the first chat), `LOG_LEVEL`.

### 3. Compiling a Production Bundle
Test type checking and build optimizations:
```bash
npm run build
npm run start
```

---

## 📬 Connectivity Linkages

*   **Email:** [pathakshivam3738@gmail.com](mailto:pathakshivam3738@gmail.com)
*   **GitHub:** [github.com/shivampathak2812](https://github.com/shivampathak2812)
*   **LinkedIn:** [linkedin.com/in/shivam-pathak-9a76ba246](https://linkedin.com/in/shivam-pathak-9a76ba246)
