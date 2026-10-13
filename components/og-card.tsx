import { ImageResponse } from "next/og";
import { JOB_TITLE, SITE_NAME } from "./site";

// Shared social preview card for opengraph-image and twitter-image (1200x630).
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = `${SITE_NAME} — ${JOB_TITLE} portfolio`;

export function renderOgCard() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(circle at 15% 20%, rgba(139,92,246,0.35), transparent 45%), radial-gradient(circle at 85% 80%, rgba(6,182,212,0.25), transparent 45%), #05060A",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 30, color: "rgba(255,255,255,0.6)", letterSpacing: 6 }}>
          WWW.SHIVAM-PATHAK.COM
        </div>
        <div style={{ fontSize: 104, fontWeight: 700, marginTop: 24, letterSpacing: -3 }}>
          {SITE_NAME}
        </div>
        <div style={{ fontSize: 48, marginTop: 8, color: "rgba(255,255,255,0.85)" }}>
          {JOB_TITLE}
        </div>
        <div style={{ fontSize: 30, marginTop: 40, color: "rgba(255,255,255,0.55)" }}>
          Python · LLMs · RAG · FastAPI · Data Engineering · Analytics
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
