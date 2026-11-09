import type { Metadata } from "next";
import StudioLandingPage from "./StudioLandingPage";

export const metadata: Metadata = {
  title: "Custom Website Design for Small Businesses",
  description: "Custom websites designed and built from scratch for small businesses across the Midwest. Book a free call to get started.",
  alternates: { canonical: "/website-design" },
  openGraph: {
    title: "Custom Website Design for Small Businesses | River City Digital",
    description: "Custom websites designed and built from scratch for small businesses across the Midwest. Book a free call to get started.",
    url: "/website-design",
    images: [{ url: "/assets/portfolio-wellness-collective.webp", width: 1440, height: 798, alt: "The Wellness Collective website, designed by River City Digital" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "River City Digital — Local Roots. Built to Be Found.",
    description: "St. Louis family-owned marketing agency. Custom websites, local SEO, AI search visibility.",
  },
};

export default function WebsiteDesignPage() {
  return <StudioLandingPage />;
}
