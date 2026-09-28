import type { Metadata } from "next";
import StudioLandingPage from "./StudioLandingPage";

export const metadata: Metadata = {
  title: "Custom Website Design in St. Louis",
  description: "St. Louis website design and custom development. Compare custom websites with Wix and WordPress templates, explore our work, and request a free mockup.",
  alternates: { canonical: "/website-design" },
  openGraph: {
    title: "Custom website design and development | River City Digital",
    description: "Custom websites for local businesses. Meet your St. Louis team and request a free mockup.",
    url: "/website-design",
    images: [{ url: "/assets/portfolio-wellness-collective.webp", width: 1440, height: 798, alt: "The Wellness Collective website, designed by River City Digital" }],
  },
};

export default function WebsiteDesignPage() {
  return <StudioLandingPage />;
}
