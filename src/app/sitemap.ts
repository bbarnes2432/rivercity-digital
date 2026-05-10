import type { MetadataRoute } from "next";
import { PROJECT_SLUGS } from "./work/_data";
import { NOTE_SLUGS } from "./notes/_data";

const SITE_URL = "https://rivercitydigitalco.com";

const ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/ai-search-visibility", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/local-seo-optimization", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/website-design", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/digital-marketing", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/service-areas", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/work", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/notes", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms-of-use", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
  const work = PROJECT_SLUGS.map((slug) => ({
    url: `${SITE_URL}/work/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const notes = NOTE_SLUGS.map((slug) => ({
    url: `${SITE_URL}/notes/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));
  return [...base, ...work, ...notes];
}
