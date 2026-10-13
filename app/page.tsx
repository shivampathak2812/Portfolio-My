import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { OPEN_GRAPH } from "@/components/site";

// Homepage-only indexing signals: the canonical URL and robots directives live
// here rather than in the root layout, so they never leak onto 404 pages.
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    ...OPEN_GRAPH,
    url: "/",
  },
};

export default function Page() {
  return <HomePage />;
}
