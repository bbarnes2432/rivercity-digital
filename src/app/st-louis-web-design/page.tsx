import type { Metadata } from "next";
import StLouisLandingPage from "./StLouisLandingPage";

export const metadata: Metadata = {
  title: "St. Louis Website Design — Start With a Free Mockup",
  description: "Custom websites from your local, family-owned St. Louis team. See what your website could look like and request a free mockup.",
  keywords: ["St. Louis website design", "Custom website design", "St. Louis web design agency"],
  alternates: { canonical: "/st-louis-web-design" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "St. Louis website design | River City Digital",
    description: "See what your website could look like. Custom design from our local, family-owned St. Louis team.",
    url: "/st-louis-web-design",
    images: [{ url: "/assets/bg-river.webp", width: 2752, height: 1536, alt: "The St. Louis riverfront and Gateway Arch" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "St. Louis website design | River City Digital",
    description: "Custom websites from our local, family-owned St. Louis studio. See your design with a free mockup.",
    images: ["/assets/bg-river.webp"],
  },
};

export default function StLouisWebsiteDesignLandingPage() {
  return <StLouisLandingPage />;
}
