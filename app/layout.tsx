import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import JsonLd from "@/components/JsonLd";
import { OPEN_GRAPH, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/components/site";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  // Canonical URL, robots directives and og:url are set on the homepage only
  // (app/page.tsx), so 404 pages keep Next.js' own noindex without contradictions.
  // og:image / twitter:image come from app/opengraph-image.tsx and app/twitter-image.tsx
  openGraph: OPEN_GRAPH,
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
      className={`${sora.variable} ${inter.variable}`}
      data-theme="dark"
    >
      <body className="bg-background-cinematic text-white antialiased selection:bg-accent-cinematic/35 selection:text-white">
        {/* Schema.org Person / WebSite / ProfilePage structured data */}
        <JsonLd />

        {/* Without JavaScript the intro can't play or be skipped and scroll reveals never
            run: hide the overlay and show every section in its final state */}
        <noscript>
          <style>{`.intro-overlay{display:none!important}[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>

        {/* Aurora Glass backdrop: slow-drifting colour fields behind everything */}
        <div className="aurora" aria-hidden="true" />

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
