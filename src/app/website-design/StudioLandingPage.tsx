import HeroPortal from "../_components/HeroPortal";
import FeaturedBuilds from "../_components/showcase/FeaturedBuilds";
import DetailTiles from "../_components/showcase/DetailTiles";
import ReviewsShowcase from "../_components/showcase/ReviewsShowcase";
import StudioNavigation from "./_components/StudioNavigation";
import StudioStickyContact from "./_components/StudioStickyContact";
import StudioFooter from "./_components/StudioFooter";
import CustomBuildComparison from "./_components/CustomBuildComparison";
import SearchFoundations from "./_components/SearchFoundations";
import StudioMotion from "./_components/StudioMotion";
import RecoveryFunnel from "./_components/RecoveryFunnel";
import { PAGE_VERSION } from "@/lib/funnel-schema";
import "./website-design.css";
import "./website-details.css";
import "./website-conversion.css";
import "./website-contact.css";
import "./website-motion.css";
import "./website-hero-form.css";
import "./website-brand.css";
import "./website-portfolio.css";
import "./website-mockup-offer.css";
import "./website-video.css";
import "./website-focused.css";
import "./website-showcase.css";
import "./website-custom.css";
import CustomHero from "./_components/custom/CustomHero";
import RiverTimeline from "./_components/custom/RiverTimeline";
import WhatYouGet from "./_components/custom/WhatYouGet";
import CloseSection from "./_components/custom/CloseSection";
import { lora, poppins } from "./_components/custom/fonts";
import LandingPolicyProvider from "./_components/LandingPolicyProvider";

// FAQ copy from Brandon's Nov 8, 2026 notes (page 10). No mockup offer.
const FAQS = [
  ["How much does a website cost?", "It depends on what your site needs to do: how many pages, booking, an online store, or a client dashboard. We’ll walk through it on a quick call and give you a clear price in writing before any work starts."],
  ["Is the first call really free?", "Yes. The intro call is free, with no obligation. If you want to move forward, you get a written plan and price before any work starts."],
  ["Can you redesign my current website?", "Yes. Share your current site and we’ll show you what we’d keep, what we’d change, and why."],
  ["How long does it take?", "Most sites launch in about 2–3 weeks once we have your content. Bigger builds with stores or custom features take longer, and we’ll give you a timeline up front."],
  ["Will I own my website?", "Yes. You own your site, your code, and your domain. Hosting is separate, and you can move it anywhere."],
  ["Will my site show up on Google?", "Every site is built mobile-first and set up for search from day one. No website can guarantee rankings or leads, but we build yours to give it the best start."],
];

export default function StudioLandingPage({ market = "st-louis", focused = false }: { market?: "st-louis" | "chicago"; focused?: boolean }) {
  const chicago = market === "chicago";
  const city = chicago ? "Chicago" : "St. Louis";
  const landingPath = chicago ? "/chicago-web-design" : focused ? "/st-louis-web-design" : "/website-design";
  return <LandingPolicyProvider><div id="top" className={`wd-site cl-look ${lora.variable} ${poppins.variable}`} data-page-version={PAGE_VERSION} data-market={market} data-page-mode={focused ? "paid-landing" : "service"}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org", "@type": "Service", name: `${city} Website Design`,
      serviceType: "Custom website design and development",
      provider: { "@type": "Organization", name: "River City Digital Co." },
      areaServed: { "@type": "City", name: city },
    }) }} />
    <HeroPortal /><StudioNavigation focused={focused} landingPath={landingPath} />
    <main id="main" className="wd-page">
      <CustomHero city={city} />
      {/* The intro video is hidden while Brandon re-records the voiceover
          (Nov 9, 2026). It returns beside Seth Thompson's review once ready. */}
      <FeaturedBuilds heading={<div className="wd-section-heading" data-entrance="rise"><div><p className="wd-eyebrow">Recent client builds</p><h2 id="builds-heading">Real businesses.<br /><em>Websites of their own.</em></h2></div><p>Pick a build to watch its homepage scroll on a phone, top to bottom, the way its customers see it.</p></div>} />
      <DetailTiles heading={<div className="wd-section-heading" data-entrance="rise"><div><p className="wd-eyebrow">Made for one business</p><h2 id="details-heading">Features built<br /><em>around the business.</em></h2></div><p>Every website we build gets features planned around how that business works. A few favorites from recent projects.</p></div>} />
      <RiverTimeline />
      <WhatYouGet />
      <SearchFoundations />
      <CustomBuildComparison />
      <ReviewsShowcase heading={<><p className="wd-eyebrow">Google reviews</p><h2 id="reviews-heading">Straight from<br /><em>our clients.</em></h2></>} />
      <section className="wd-section wd-faq rcd-light" id="faq" aria-labelledby="faq-heading"><div className="wd-container wd-faq-grid"><div data-entrance="rise"><p className="wd-eyebrow">Frequently asked questions</p><h2 id="faq-heading">Questions about<br />the build.</h2></div><div>{FAQS.map(([question, answer]) => <details className="wd-faq-item" data-entrance="unfold" key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>
      <CloseSection landingPath={landingPath} />
    </main>
    <StudioFooter focused={focused} /><StudioStickyContact book /><StudioMotion /><RecoveryFunnel />
  </div></LandingPolicyProvider>;
}
