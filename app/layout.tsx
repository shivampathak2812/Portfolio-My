import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shivam Pathak | Data & AI Engineer",
  description: "Portfolio of Shivam Pathak, a Data & AI Engineer with hands-on experience in Python, SQL, Machine Learning, Data Science, LLMs, RAG, FastAPI, and PostgreSQL — building ML models, AI applications, REST APIs, and data pipelines.",
  keywords: ["Data Engineer", "AI Engineer", "Data Science", "Machine Learning", "LLM", "RAG", "ETL Pipelines", "Apache Airflow", "FastAPI", "PostgreSQL", "Python", "SQL", "Shivam Pathak"],
  authors: [{ name: "Shivam Pathak" }],
  openGraph: {
    title: "Shivam Pathak | Data & AI Engineer",
    description: "Data & AI Engineer building ML models, LLM/RAG applications, REST APIs, and data pipelines.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${inter.variable}`}
    >
      <body className="bg-background-cinematic text-white antialiased selection:bg-accent-cinematic/35 selection:text-white">
        {/* Static film grain overlay */}
        <div className="noise-overlay" />
        
        {/* Dynamic interactive mouse cursor tracker spotlight */}
        <div className="spotlight-glow" />

        {/* Lenis Smooth scrolling coordinator wrapper */}
        <SmoothScroll>
          <div className="relative z-10 flex min-h-screen flex-col">
            {children}
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
