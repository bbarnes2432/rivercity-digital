import type { Metadata } from "next";
import StudioLandingPage from "../website-design/StudioLandingPage";
import { CHICAGO_HERO_MEDIA } from "./hero-media";

export const metadata: Metadata = {
  title: "Chicago Website Design — Start With a Free Mockup",
  description: "Custom websites for Chicago businesses. Work directly with our family-owned St. Louis studio, wherever you are. Request your free website mockup.",
  alternates: { canonical: "/chicago-web-design" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Chicago website design | River City Digital",
    description: "See what your website could look like. Custom design for Chicago businesses, delivered remotely by our St. Louis studio.",
    url: "/chicago-web-design",
  },
};

export default function ChicagoWebsiteDesignPage() {
  return <StudioLandingPage market="chicago" heroVideoSrc={CHICAGO_HERO_MEDIA.src} heroVideoMobileSrc={CHICAGO_HERO_MEDIA.mobileSrc} heroVideoPoster={CHICAGO_HERO_MEDIA.poster} heroVideoMobilePoster={CHICAGO_HERO_MEDIA.mobilePoster} />;
}
