# 🌌 Shivam Pathak — Portfolio Experience

<p align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3BkbWVrZnltczhpbnZ2cHJmMzJkNWswbmFpczlsanRtOHRyNDRrayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjRrfIPjeiVyM/giphy.gif" alt="Cinematic Tech Grid Wave" width="800" style="border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);" />
</p>

<p align="center">
  <strong>An award-winning caliber, Apple-level polished, Vercel-style desaturated AI Engineer portfolio experience.</strong><br />
  Built using Next.js 15, React 19, TypeScript, Tailwind CSS v4, GSAP, Framer Motion, and vanilla Three.js.
</p>

<p align="center">
  <a href="https://github.com/shivampathak2812"><img src="https://img.shields.io/github/followers/shivampathak2812?label=Follow&style=social" alt="GitHub Followers" /></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js&logoColor=white&color=000000" alt="Next.js" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-blue?style=flat&logo=react&logoColor=61DAFB&color=20232A" alt="React 19" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind--v4-sky?style=flat&logo=tailwind-css&logoColor=38BDF8&color=0F172A" alt="Tailwind CSS v4" /></a>
  <a href="https://threejs.org"><img src="https://img.shields.io/badge/Three.js-WebGL-black?style=flat&logo=three.js&logoColor=white&color=111111" alt="Three.js" /></a>
  <a href="https://greensock.com/gsap/"><img src="https://img.shields.io/badge/GSAP-Scrub-green?style=flat&logo=greensock&logoColor=88CE02&color=000000" alt="GSAP Animation" /></a>
</p>

---

## 🔮 Refined & Polished Features

*   **🖤 Minimal Premium Obsidian Redesign:** Stripped noisy neons, text glows, and aggressive animations in favor of a luxury visual language inspired by Stripe, Apple, Linear, and Vercel:
    - *Obsidian Theme:* Implemented a deep, desaturated dark background (#030712) with elegant obsidian/silver visual hierarchies.
    - *Strategic Stillness:* Toned down fast bounce indicators, rotation vectors, and grid loops (compress, laser scans, analytics trucks) to achieve quiet spatial balance, prioritizing focus and readability.
*   **🤖 AVIX — Intelligent Chatbot & Branding Concierge:** Features complete custom branding and advanced generation controls:
    - *Transparent Custom Wing Logo:* Styled with a premium dark obsidian toggle button (`bg-[#030712] border-white/10`) to provide high-fidelity contrast for the custom transparent AVIX logo.
    - *Fullscreen Maximization:* Toggles seamlessly between floating bubble bounds and fullscreen dimensions with smooth CSS layout transitions (`transition-all duration-300`).
    - *Instant Fetch & Stream Stop:* Pauses active network fetch retry loops (via a master `AbortController` ref) and freezes typewriter stream intervals instantly, preserving text exactingly.
*   **🧠 Robust Fuzzy NLP Local RAG Engine:** Built a resilient offline client matching engine:
    - *Spellcheck Correction:* Automatically normalizes user typos (e.g. `proejct` -> `project`, `skillz` -> `skill`, `educaton` -> `education`).
    - *Singular/Plural Stemming:* Maps singular and plural nouns to single common roots so both `"projects"` and `"project"` match flawlessly.
    - *Token boundary matching:* Analyzes phrases on word boundaries, preventing false-positive greeting matches (e.g., matching the greeting `"hi"` inside the word `"his"`).
*   **🎬 Cinematic Entry Splash (`LET'S GO →`):** Clean entrance splash screen featuring a crisp tagline, a sleek rectangular entrance CTA, and desaturated, elegant layouts.
- **✨ Yellow Tagline Refinements:** Colored the main tagline label `"AI ENGINEER"` in a rich, highly professional yellow (`text-yellow-500`) on both the splash screen and main Hero layouts.
*   **✨ Three.js WebGL Bokeh Canvas:** Renders desaturated, slow-moving radial white and silver bokeh spheres, depth parallax tracking mouse inputs seamlessly at a solid 60 FPS.
*   **💻 7-Featured Projects Ledger:** Minimal desaturated project grid showing custom, static vector SVGs representing databases, API connectors, and logistics charts.

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
├── backend/                 # Python RAG Pipeline (FastAPI, ChromaDB, HuggingFace, LLaMA-3)
│   ├── main.py              # FastAPI service exposing /chat CORS endpoints
│   ├── ingest.py            # Local document ingestion, vectorization, and indexing
│   ├── rag_engine.py        # Vector search retriever and LLaMA-3 context pipeline
│   └── requirements.txt     # Python dependency list
├── components/
│   ├── Chatbot.tsx          # Sleek glassmorphic floating chat, fullscreen toggle, and stop button
│   ├── chatbotData.ts       # Shared knowledge database & robust fuzzy local NLP RAG engine
│   ├── Navbar.tsx           # Sticky transparent-to-blur opaque glass header
│   ├── CinematicIntro.tsx   # Entry splash card & ScrollTrigger video transition
│   ├── Hero.tsx             # Talking-head card and HUD media console taglines
│   ├── About.tsx            # Portrait photo depth frame & professional narrative
│   ├── Education.tsx        # Desaturated academic milestones and credentials card
│   ├── Skills.tsx           # Cursor-tracking radial hover lighting cards
│   ├── Experience.tsx       # Desaturated chronology timeline and skill badges
│   ├── Projects.tsx         # Clean 7-project grid with custom static SVGs
│   ├── Contact.tsx          # Minimialist closing copy terminal console
│   ├── Particles.tsx        # Vanilla Three.js WebGL canvas particle lerp provider
│   └── SmoothScroll.tsx     # Lenis kinetic scrolling & global mouse tracker
└── public/
    ├── resume/
    │   └── Resume_Shivam.pdf # Downloadable resume PDF
    ├── images/
    │   ├── profile.png      # Portrait photo (2.0 aspect ratio frame)
    │   └── avix-logo.png    # Custom AVIX transparent wings logo
    └── videos/
        └── hero-video.mp4   # Foreground cinema video asset
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

The chatbot automatically links to this vector retrieval retrieval engine when active. If offline, the frontend falls back silently to the browser-based fuzzy NLP matching engine.

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
    pip install -r requirements.txt
    ```
3.  **Ingest Vector Documents:** Vectorize resume facts and portfolio details into local ChromaDB:
    ```bash
    python ingest.py
    ```
4.  **Configure Environment Variables:**
    *   Create a `.env` file from the template: `cp .env.example .env`
    *   Add your Groq API Key: `GROQ_API_KEY=gsk_...`
5.  **Boot FastAPI Server:**
    ```bash
    python main.py
    ```
    *(The uvicorn server will boot on [http://localhost:8000](http://localhost:8000))*

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
