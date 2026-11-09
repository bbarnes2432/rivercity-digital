import { ArrowDown, ArrowUpRight, Check } from "lucide-react";
import CallLink from "../_components/CallLink";
import BookCallLink from "../_components/BookCallLink";
import HeroPortal from "../_components/HeroPortal";
import HookVideo from "../_components/HookVideo";
import TubesCursor from "@/components/ui/tubes-cursor";
import ScrollWall from "../_components/showcase/ScrollWall";
import MotionToggle from "../_components/showcase/MotionToggle";
import FeaturedBuilds from "../_components/showcase/FeaturedBuilds";
import DetailTiles from "../_components/showcase/DetailTiles";
import ReviewsShowcase from "../_components/showcase/ReviewsShowcase";
import StudioNavigation from "./_components/StudioNavigation";
import MockupRequestForm from "./_components/MockupRequestForm";
import StudioStickyContact from "./_components/StudioStickyContact";
import StudioFooter from "./_components/StudioFooter";
import CustomBuildComparison, { CustomBuildIntroduction } from "./_components/CustomBuildComparison";
import ProjectConversation from "./_components/ProjectConversation";
import SearchFoundations from "./_components/SearchFoundations";
import { BuildCapabilities, BuildProcess } from "./_components/BuildDetails";
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
import LandingPolicyProvider from "./_components/LandingPolicyProvider";
import ChicagoHeroBackground, { type HeroVideoClip } from "./_components/ChicagoHeroBackground";



// FAQ copy from Brandon's Nov 8, 2026 notes (page 10). No mockup offer.
const FAQS = [
  ["How much does a website cost?", "It depends on what your site needs to do: how many pages, booking, an online store, or a client dashboard. We’ll walk through it on a quick call and give you a clear price in writing before any work starts."],
  ["Is the first call really free?", "Yes. The intro call is free, with no obligation. If you want to move forward, you get a written plan and price before any work starts."],
  ["Can you redesign my current website?", "Yes. Share your current site and we’ll show you what we’d keep, what we’d change, and why."],
  ["How long does it take?", "Most sites launch in about 2–3 weeks once we have your content. Bigger builds with stores or custom features take longer, and we’ll give you a timeline up front."],
  ["Will I own my website?", "Yes. You own your site, your code, and your domain. Hosting is separate, and you can move it anywhere."],
  ["Will my site show up on Google?", "Every site is built mobile-first and set up for search from day one. No website can guarantee rankings or leads, but we build yours to give it the best start."],
];

const PROJECT_PROMISES = [
  "Free intro call, no obligation",
  "A clear plan and price before any work starts",
  "A real person follows up, usually the same business day",
];

export default function StudioLandingPage({ market = "st-louis", focused = false, heroVideoClips }: { market?: "st-louis" | "chicago"; focused?: boolean; heroVideoClips?: readonly HeroVideoClip[] }) {
  const chicago = market === "chicago";
  const city = chicago ? "Chicago" : "St. Louis";
  const landingPath = chicago ? "/chicago-web-design" : focused ? "/st-louis-web-design" : "/website-design";
  // Each market has its own VSL, with a silent preview loop until the viewer presses play.
  const vslName = chicago ? "river-city-chicago-vsl" : "river-city-st-louis-vsl";
  const vsl = { src: `/assets/vsl/${vslName}.mp4`, preview: `/assets/vsl/${vslName}-preview.mp4`, poster: `/assets/vsl/${vslName}-poster.jpg` };
  return <LandingPolicyProvider><div id="top" className="wd-site" data-page-version={PAGE_VERSION} data-market={market} data-page-mode={focused ? "paid-landing" : "service"}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org", "@type": "Service", name: `${city} Website Design`,
      serviceType: "Custom website design and development",
      provider: { "@type": "Organization", name: "River City Digital Co." },
      areaServed: { "@type": "City", name: city },
    }) }} />
    <HeroPortal /><StudioNavigation focused={focused} landingPath={landingPath} />
    <main id="main" className="wd-page">
      <section className={`wd-hero wd-hero-no-form${chicago ? " wd-hero-video" : ""}`} aria-labelledby="hero-heading">
        {chicago ? <ChicagoHeroBackground clips={heroVideoClips} /> : <ScrollWall />}
        <div className="wd-container wd-hero-content">
          <div className="wd-hero-copy">
            <p className="wd-eyebrow"><span className="wd-status-dot" /> Website design · Custom built</p>
            <h1 id="hero-heading">Custom website design.<br /><em>Built around your business.</em></h1>
            <p className="wd-hero-description">No templates and no page builders. Our family-owned team designs and builds your site from scratch, and you approve the design before we build a thing.</p>
            <div className="wd-actions"><BookCallLink context="website-design-hero" className="wd-button wd-button-mint">Book a free call <ArrowUpRight size={19} /></BookCallLink><CallLink context="website-design-hero" className="wd-button wd-hero-call" numberPrefix="Call us " /></div>
          </div>
        </div>
        <div className="wd-container wd-hero-bottom"><span>Rooted in {city} · Working across the Midwest · A website you own</span><span className="wd-hero-bottom-actions"><MotionToggle /><a href="#work">Explore the work <ArrowDown size={15} /></a></span></div>
      </section>
      <section className="wd-section wd-vsl rcd-light" id="why-river-city" aria-labelledby="why-river-city-heading">
        <div className="wd-container">
          <div className="wd-section-heading" data-entrance="rise">
            <div><p className="wd-eyebrow">Meet River City Digital</p><h2 id="why-river-city-heading">See how we build<br />your website.</h2></div>
            <p>A short look at how we design your website and help customers find and call you.</p>
          </div>
          <div className="wd-vsl-player" data-entrance="image">
            <HookVideo
              src={vsl.src}
              previewSrc={vsl.preview}
              poster={vsl.poster}
              ctaLabel="Watch: How we build your website"
              preload="none"
              captions={chicago ? undefined : `/assets/vsl/${vslName}.vtt`}
            />
          </div>
        </div>
      </section>
      <CustomBuildIntroduction />
      <FeaturedBuilds heading={<div className="wd-section-heading" data-entrance="rise"><div><p className="wd-eyebrow">Recent client builds</p><h2 id="builds-heading">Real businesses.<br /><em>Websites of their own.</em></h2></div><p>Pick a build to watch its homepage scroll on a phone, top to bottom, the way its customers see it.</p></div>} />
      <DetailTiles heading={<div className="wd-section-heading" data-entrance="rise"><div><p className="wd-eyebrow">Made for one business</p><h2 id="details-heading">Features built<br /><em>around the business.</em></h2></div><p>Every website we build gets features planned around how that business works. A few favorites from recent projects.</p></div>} />
      <section className="wd-section wd-project rcd-light" id="start" tabIndex={-1} aria-labelledby="project-heading">
        <div className="wd-container wd-project-grid">
          <div className="wd-project-copy" data-entrance="rise">
            <p className="wd-eyebrow">Start your project</p>
            <h2 id="project-heading">Tell us about your website.<br /><em>We’ll come back with a plan.</em></h2>
            <p>Tell us a little about your business and what you need. We’ll set up a quick call, then put together a clear plan and price in writing. No pressure, no surprises.</p>
            <ul className="wd-project-promises">{PROJECT_PROMISES.map(promise => <li key={promise}><Check size={18} aria-hidden="true" />{promise}</li>)}</ul>
            <p className="wd-project-direct"><span>Rather talk now?</span><CallLink context="website-design-project" className="wd-contact-number" /></p>
          </div>
          <MockupRequestForm focused={focused} landingPath={landingPath} offer="call" labelledBy="project-heading" />
        </div>
      </section>
      <ProjectConversation />
      <SearchFoundations />
      <CustomBuildComparison />
      <BuildCapabilities />
      <BuildProcess />
      <section className="wd-section wd-faq rcd-light" id="faq" aria-labelledby="faq-heading"><div className="wd-container wd-faq-grid"><div data-entrance="rise"><p className="wd-eyebrow">Frequently asked questions</p><h2 id="faq-heading">Questions about<br />the build.</h2></div><div>{FAQS.map(([question, answer]) => <details className="wd-faq-item" data-entrance="unfold" key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>
      <ReviewsShowcase heading={<><p className="wd-eyebrow">Google reviews</p><h2 id="reviews-heading">Straight from<br /><em>our clients.</em></h2></>} />
      <section className="wd-section wd-contact rcd-light" id="final-request" aria-labelledby="contact-heading">
        <div className="wd-container"><div className="wd-contact-copy" data-entrance="rise"><p className="wd-eyebrow">Your new website</p><h2 id="contact-heading">Ready for a website built around your business?<br /><em>Start with a free call.</em></h2><div className="wd-contact-actions"><BookCallLink context="website-design-final" className="wd-button wd-button-dark">Book a free call <ArrowUpRight size={19} /></BookCallLink><a className="wd-button wd-button-outline" href="/work">See our work <ArrowUpRight size={19} /></a></div><div className="wd-contact-direct"><span>Prefer to talk?</span><CallLink context="website-design-contact" className="wd-contact-number" /></div></div></div>
      </section>
    </main>
    <StudioFooter focused={focused} /><StudioStickyContact book /><TubesCursor mobileAmbient /><StudioMotion /><RecoveryFunnel />
  </div></LandingPolicyProvider>;
}
