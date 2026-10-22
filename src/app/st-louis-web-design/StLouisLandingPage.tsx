import Image from "next/image";
import { Suspense } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import HookVideo from "../_components/HookVideo";
import CallLink from "../_components/CallLink";
import StudioNavigation from "../website-design/_components/StudioNavigation";
import StudioFooter from "../website-design/_components/StudioFooter";
import StudioStickyContact from "../website-design/_components/StudioStickyContact";
import MockupRequestForm from "../website-design/_components/MockupRequestForm";
import { CLIENT_REVIEW } from "../website-design/_components/client-review";
import LandingPolicyProvider from "../website-design/_components/LandingPolicyProvider";
import StudioMotion from "../website-design/_components/StudioMotion";
import RecoveryFunnel from "../website-design/_components/RecoveryFunnel";
import { PAGE_VERSION } from "@/lib/funnel-schema";
import { landingFaqs } from "../chicago-web-design/landing-faqs";
import StLouisProjectGallery from "./StLouisProjectGallery";
import ChicagoReviews from "../chicago-web-design/ChicagoReviews";
import { MockupJourney, SearchVisibility, CompactComparison } from "../chicago-web-design/ChicagoStorySections";
import { NeighborhoodTicker, RiverThread } from "../chicago-web-design/ChicagoRiverDetails";
import "../website-design/website-design.css";
import "../website-design/website-details.css";
import "../website-design/website-conversion.css";
import "../website-design/website-contact.css";
import "../website-design/website-motion.css";
import "../website-design/website-hero-form.css";
import "../website-design/website-brand.css";
import "../website-design/website-portfolio.css";
import "../website-design/website-mockup-offer.css";
import "../website-design/website-video.css";
import "../website-design/website-focused.css";
import "../chicago-web-design/chicago-editorial.css";
import "./st-louis-editorial.css";

const STL_COMMUNITIES = ["Clayton", "Ladue", "Kirkwood", "Webster Groves", "Chesterfield", "Ballwin", "Creve Coeur", "St. Charles", "O’Fallon", "St. Peters", "Wentzville", "Lake St. Louis", "Troy", "Edwardsville"];

const FAQS = landingFaqs("st-louis");

export default function StLouisLandingPage() {
  return <LandingPolicyProvider><div id="top" className="wd-site chicago-editorial st-louis-editorial" data-page-version={PAGE_VERSION} data-design="st-louis-editorial-2026-10-05" data-market="st-louis" data-page-mode="paid-landing">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Service", name: "St. Louis Website Design", serviceType: "Custom website design and development", provider: { "@type": "Organization", name: "River City Digital Co." }, areaServed: { "@type": "City", name: "St. Louis" } }) }} />
    <StudioNavigation focused landingPath="/st-louis-web-design" />
    <main id="main" className="wd-page">
      <section className="wd-hero ch-hero" aria-labelledby="hero-heading">
        <div className="ch-hero-film"><div className="stl-hero-photo" aria-hidden="true"><Image src="/assets/bg-river.webp" alt="" fill sizes="100vw" preload /><div className="stl-hero-shade" /></div>
          <div className="wd-container ch-hero-title">
            <p className="ch-hero-eyebrow">St. Louis web design <span aria-hidden="true">·</span> Local &amp; family-owned</p>
            <h1 id="hero-heading">Custom websites for<br /><span>St. Louis businesses.</span></h1>
            <p className="ch-hero-description">Work directly with a local, family-owned team to build a website around your business. Start with a free mockup before you commit to the build.</p>
            <div className="ch-hero-actions"><a href="#start" className="wd-button wd-button-mint">Get my free mockup <ArrowUpRight size={18} aria-hidden="true" /></a><CallLink context="st-louis-hero" className="wd-button ch-hero-call" numberPrefix="Call " /></div>
          </div>
          <div className="wd-container ch-hero-footnote"><span>Personally involved. Start to finish.</span><a href="#meet-river-city">Meet River City <ArrowDown size={15} aria-hidden="true" /></a></div>
        </div>
      </section>
      <NeighborhoodTicker communities={STL_COMMUNITIES} label="St. Louis and surrounding communities" />
      <div className="ch-river-journey"><RiverThread />
        <section className="wd-section ch-start rcd-light" id="meet-river-city" aria-label="Meet River City and request your free mockup" data-river-stop>
          <div className="wd-container ch-start-layout">
            <div className="ch-vsl" data-entrance="image"><HookVideo src="/assets/vsl/river-city-st-louis-vsl.mp4" poster="/assets/vsl/river-city-st-louis-vsl-poster.jpg" ctaLabel="Meet River City. See how we build." preload="none" /><p>Get to know River City and how we approach your website.</p>
              <figure className="ch-client-proof"><blockquote>“{CLIENT_REVIEW.excerpt}”</blockquote><figcaption><strong>{CLIENT_REVIEW.author}</strong><span>{CLIENT_REVIEW.business}</span><a href={CLIENT_REVIEW.url} target="_blank" rel="noopener noreferrer">Read her Google review <ArrowUpRight size={12} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></figcaption></figure>
            </div>
            <MockupRequestForm focused compact landingPath="/st-louis-web-design" nextStep="You’ll hear from our team about your business and design ideas, then we’ll prepare your free mockup. You’ll receive a written scope and price before any website build begins." />
          </div>
        </section>
        <section className="wd-section ch-connection rcd-light" id="studio" aria-labelledby="studio-heading" data-river-stop>
          <div className="wd-container ch-connection-layout">
            <figure className="ch-river-photo" data-entrance="image"><Image src="/assets/bg-st-louis-street.webp" alt="A St. Louis street looking toward the Gateway Arch" width={1280} height={720} sizes="(max-width: 800px) 100vw, 760px" /><figcaption>Built here. For businesses like yours.</figcaption></figure>
            <div className="ch-connection-copy" data-entrance="rise"><h2 id="studio-heading">Local enough to<br />meet in person.</h2><p>We’re River City Digital, a family-owned web design studio based in St. Louis.</p><p>We take the time to understand your business, explain your options and build around what you need. You work directly with us—and we can meet in person to talk it through.</p><p>A clear scope and price before we build. A website you own when it’s done.</p><span className="ch-handled">From our family to your business.</span></div>
          </div>
        </section>
        <MockupJourney />
        <StLouisProjectGallery />
        <Suspense fallback={null}><ChicagoReviews market="st-louis" /></Suspense>
        <SearchVisibility city="St. Louis" />
        <CompactComparison />
        <section className="wd-section ch-faq rcd-light" id="faq" aria-labelledby="faq-heading" data-river-stop><div className="wd-container ch-faq-layout"><div data-entrance="rise"><h2 id="faq-heading">A few things<br />worth knowing.</h2></div><div>{FAQS.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>
      </div>
      <section className="wd-section ch-final" id="final-request" aria-labelledby="contact-heading"><div className="wd-container ch-final-content"><h2 id="contact-heading">See what your website<br />could look like.</h2><p>Your business. Your ideas. A design you can see first.</p><a className="wd-button wd-button-mint" href="#start">Get my free mockup <ArrowUpRight size={20} aria-hidden="true" /></a><CallLink context="st-louis-final" className="ch-final-call" numberPrefix="Or call " /></div><svg className="ch-skyline stl-skyline" viewBox="0 0 1440 180" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><path d="M0 165H140V125H185V100H224V142H285V83H333V144H391V110H443V155H488V92H527V150H602V125H652V165H815V115H859V88H902V149H946V117H989V145H1050V82H1094V138H1160V111H1211V157H1300V133H1360V165H1440V180H0Z" fill="currentColor"/><path d="M680 170C686 62 711 16 738 16C765 16 790 62 796 170L787 170C778 77 758 24 738 24C718 24 698 77 689 170Z" fill="currentColor"/></svg></section>
    </main>
    <StudioFooter focused market="st-louis" /><StudioStickyContact /><StudioMotion /><RecoveryFunnel />
  </div></LandingPolicyProvider>;
}
