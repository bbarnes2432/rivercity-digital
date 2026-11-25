import type { Metadata } from "next";
import StLouisLandingPage from "./StLouisLandingPage";

export const metadata: Metadata = {
  title: "St. Louis Website Design — Discuss Your Project",
  description: "Custom websites from your local, family-owned St. Louis team. Discuss your website project and get a clear scope and price before you build.",
  keywords: ["St. Louis website design", "Custom website design", "St. Louis web design agency"],
  alternates: { canonical: "/st-louis-web-design" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "St. Louis website design | River City Digital",
    description: "Custom websites built around your business. Discuss your goals and website with our local, family-owned St. Louis team.",
    url: "/st-louis-web-design",
    images: [{ url: "/assets/bg-river.webp", width: 2752, height: 1536, alt: "The St. Louis riverfront and Gateway Arch" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "St. Louis website design | River City Digital",
    description: "Custom websites from our local, family-owned St. Louis marketing agency. Discuss your goals and plan your custom website with us.",
    images: ["/assets/bg-river.webp"],
  },
};

export default function StLouisWebsiteDesignLandingPage() {
  return <StLouisLandingPage />;
}
