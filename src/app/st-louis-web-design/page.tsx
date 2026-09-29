import type { Metadata } from "next";
import StudioLandingPage from "../website-design/StudioLandingPage";

export const metadata: Metadata = {
  title: "St. Louis Website Design — Start With a Free Mockup",
  description: "Custom websites from your local, family-owned St. Louis team. See what your website could look like and request a free mockup.",
  alternates: { canonical: "/st-louis-web-design" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "St. Louis website design | River City Digital",
    description: "See what your website could look like. Custom design from our local, family-owned St. Louis team.",
    url: "/st-louis-web-design",
    images: [{ url: "/assets/portfolio-wellness-collective.webp", width: 1440, height: 798, alt: "The Wellness Collective website, designed by River City Digital" }],
  },
};

export default function StLouisWebsiteDesignLandingPage() {
  return <StudioLandingPage focused />;
}
