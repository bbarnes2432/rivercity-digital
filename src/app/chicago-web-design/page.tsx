import type { Metadata } from "next";
import ChicagoLandingPage from "./ChicagoLandingPage";
import { CHICAGO_HERO_CLIPS } from "./hero-media";

export const metadata: Metadata = {
  title: "Chicago Website Design — Start With a Free Mockup",
  description: "Custom websites for Chicago businesses. Work directly with our family-owned studio. Request your free website mockup.",
  keywords: ["Chicago website design", "Custom website design", "Chicago web design agency"],
  alternates: { canonical: "/chicago-web-design" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Chicago website design | River City Digital",
    description: "See what your website could look like. Custom design for Chicago businesses, delivered by our family-owned studio.",
    url: "/chicago-web-design",
    images: [{ url: "/assets/chicago/chicago-day-skyline-desktop.webp", width: 1440, height: 810, alt: "Chicago website design by River City Digital" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chicago website design | River City Digital",
    description: "Custom websites for Chicago businesses. See what your website could look like with a free mockup.",
    images: [{ url: "/assets/chicago/chicago-day-skyline-desktop.webp", alt: "Chicago website design by River City Digital" }],
  },
};

export default function ChicagoWebsiteDesignPage() {
  const first = CHICAGO_HERO_CLIPS[0];
  return <>
    <link rel="preload" as="image" href={first.mobilePoster} media="(max-width: 760px)" fetchPriority="high" />
    <link rel="preload" as="image" href={first.poster} media="(min-width: 761px)" fetchPriority="high" />
    <ChicagoLandingPage />
  </>;
}
