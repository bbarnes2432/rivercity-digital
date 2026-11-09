import type { Metadata } from "next";
import StLouisLandingPage from "./StLouisLandingPage";

export const metadata: Metadata = {
  title: "St. Louis Website Design — Start With a Free Call",
  description: "Custom websites from your local, family-owned St. Louis team. Book a free call to talk through the website your business needs.",
  keywords: ["St. Louis website design", "Custom website design", "St. Louis web design agency"],
  alternates: { canonical: "/st-louis-web-design" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "St. Louis website design | River City Digital",
    description: "Custom website design from our local, family-owned St. Louis team. Start with a free call.",
    url: "/st-louis-web-design",
    images: [{ url: "/assets/bg-river.webp", width: 2752, height: 1536, alt: "The St. Louis riverfront and Gateway Arch" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "St. Louis website design | River City Digital",
    description: "Custom websites from our local, family-owned St. Louis marketing agency. Start with a free call.",
    images: ["/assets/bg-river.webp"],
  },
};

export default function StLouisWebsiteDesignLandingPage() {
  return <StLouisLandingPage />;
}
