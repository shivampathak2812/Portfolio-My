# 🌌 Shivam Pathak — Portfolio Experience

<p align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3BkbWVrZnltczhpbnZ2cHJmMzJkNWswbmFpczlsanRtOHRyNDRrayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjRrfIPjeiVyM/giphy.gif" alt="Cinematic Tech Grid Wave" width="800" style="border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);" />
</p>

<p align="center">
  <strong>An award-winning caliber, Apple-level polished, cinematic AI Engineer portfolio experience.</strong><br />
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

## 🔮 Interactive Features

*   **🤖 Premium AI Chatbot & Voice Assistant:** A floating glassmorphic concierge widget that acts as an interactive resume and recruiter guide:
    - *Sleek Floating Card UI:* Capped at `340px` wide and `500px` high with `24px` rounded corners and double-layered ambient shadows (deep black shadow + soft atmospheric purple halo glow).
    - *Voice Assistant Mode:* Integrates native **Web Speech STT/TTS** and an animated 7-bar Siri sound wave visualizer to converse with recruiters in real time.
    - *Conversational Memory & Stream:* Streams replies character-by-character using a blinking cursor caret, paired with a smart, jitter-free scroll-lock manager.
    - *Viewport Spotlight Focus:* Auto-scrolls the browser and highlights/glows the referenced portfolio section (Projects, Skills, Experience) while dimming the background.
    - *Hybrid RAG Failover:* First contacts a local FastAPI ChromaDB uvicorn server, falling back instantly to a browser-based NLP query router for zero-dependency uptime.
*   **🎬 Cinematic Entry Splash (`LET'S GO →`):** A high-fidelity theatrical splash screen that prompts user interaction (passing browser autoplay audio restrictions) before triggering a slow-motion video card scale-up and synchronized layout fade-in.
*   **🔊 Resilient Video Canvas fallback:** foreground talking-head video autoplays with mute dashboard toggles (Play/Pause, Soundwaves) and duplicates itself as a blurred dynamic back-layer at `blur-[120px]` to project matching ambient real-time light leaks.
*   **✨ Three.js WebGL Bokeh Canvas:** Renders 350 warm white and orange glowing bokeh particle spheres using additive shader blending, supporting smooth inertia mouse-tracking depth parallax (60 FPS).
*   **🔍 Spotlight Skills & Grid:** Hover-tracking card systems that dynamically project cursor radial light beams to illuminate specialized skills and tech categories.
*   **💻 7-Featured Projects Ledger:** Beautiful grid of glassmorphic project cards containing custom hand-drawn vector SVGs representing databases, API scanning lines, track logs, and analytics.

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
│   ├── Chatbot.tsx          # Sleek glassmorphic floating chat and voice assistant UI
│   ├── chatbotData.ts       # Shared knowledge ledger, client NLP engine & action maps
│   ├── Navbar.tsx           # Sticky transparent-to-blur opaque glass header
│   ├── CinematicIntro.tsx   # Entry splash card & ScrollTrigger video transition
│   ├── Hero.tsx             # Talking-head card and HUD media console
│   ├── About.tsx            # Portrait photo depth frame & professional narrative
│   ├── Education.tsx        # B.Tech CSE details and certificated accomplishments
│   ├── Skills.tsx           # Cursor-tracking radial hover lighting cards
│   ├── Experience.tsx       # AI Engineer timeline matching the PDF resume
│   ├── Projects.tsx         # Clean 7-project grid with custom programmatic SVGs
│   ├── Contact.tsx          # Minimialist closing console with copy-to-clipboard
│   ├── Particles.tsx        # Vanilla Three.js WebGL canvas particle lerp provider
│   └── SmoothScroll.tsx     # Lenis kinetic scrolling & global mouse tracker
└── public/
    ├── resume/
    │   └── Shivam-Resume.pdf # Downloadable resume PDF
    ├── images/
    │   └── profile.png      # Portrait photo (2.0 aspect ratio frame)
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

The chatbot automatically links to this vector retrieval engine when active. If offline, the frontend falls back silently to browser-based NLP matching.

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

## 🎨 Asset Customization Guide

You can easily personalize this portfolio for yourself by swapping these three core assets in the `/public` directory:

*   **Talking-Head Video:** Place your high-definition video in `public/videos/hero-video.mp4` (Autoplays seamlessly on scroll).
*   **Profile Portrait:** Swap `public/images/profile.png` with your portrait image (automatically centers in the depth frame).
*   **Resume Download:** Overwrite `public/resume/Shivam-Resume.pdf` with your PDF resume to link the Navbar and HUD buttons instantly.

---

## 📬 Connectivity Linkages

*   **Email:** [shivampathak.ai@gmail.com](mailto:shivampathak.ai@gmail.com)
*   **GitHub:** [github.com/shivampathak2812](https://github.com/shivampathak2812)
*   **LinkedIn:** [linkedin.com/in/shivampathak2812](https://linkedin.com/in/shivampathak2812)
