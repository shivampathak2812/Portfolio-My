import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shivam Pathak | AI Engineer & Data Science Specialist",
  description: "Cinematic portfolio of Shivam Pathak, an AI Engineer and Data Science Enthusiast building intelligent systems, modern web experiences, and scalable AI products.",
  keywords: ["AI Engineer", "Data Science", "Machine Learning", "FastAPI", "Next.js", "React", "Three.js", "Shivam Pathak"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} scroll-smooth`}
    >
      <body className="bg-background-cinematic text-white antialiased selection:bg-accent-cinematic/30 selection:text-white">
        {/* Sub-pixel GPU-accelerated film noise grain overlay */}
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
