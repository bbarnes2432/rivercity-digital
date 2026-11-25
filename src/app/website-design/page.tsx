import type { Metadata } from "next";
import StudioLandingPage from "./StudioLandingPage";

export const metadata: Metadata = {
  title: { absolute: "Custom Web Design Company & Local Website Designer St. Charles & St. Louis MO - River City Digital Co." },
  description: "Custom websites designed around your brand and customers, built to get found on Google and AI search. Serving St. Louis, MO businesses. Book a call today!",
  alternates: { canonical: "/website-design" },
  openGraph: {
    title: "Custom website design and development | River City Digital",
    description: "Custom websites designed around your brand and customers, built to get found on Google and AI search. Serving St. Louis, MO businesses. Book a call today!",
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
