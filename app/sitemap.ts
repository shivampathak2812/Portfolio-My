import type { MetadataRoute } from "next";
import { SITE_URL } from "@/components/site";

// The portfolio is a single page (sections are #anchors, which don't belong in a
// sitemap), so the homepage is the only canonical URL. lastModified is omitted
// on purpose: a per-build timestamp would be inaccurate and Google ignores it.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
