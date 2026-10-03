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
import ChicagoHeroBackground from "../website-design/_components/ChicagoHeroBackground";
import StudioMotion from "../website-design/_components/StudioMotion";
import RecoveryFunnel from "../website-design/_components/RecoveryFunnel";
import { PAGE_VERSION } from "@/lib/funnel-schema";
import { CHICAGO_HERO_CLIPS } from "./hero-media";
import ChicagoProjectGallery from "./ChicagoProjectGallery";
import ChicagoReviews from "./ChicagoReviews";
import { MockupJourney, SearchVisibility, CompactComparison } from "./ChicagoStorySections";
import { NeighborhoodTicker, RiverThread } from "./ChicagoRiverDetails";
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
import "./chicago-editorial.css";

const FAQS = [
  ["What do I get with the free mockup?", "A preview of what your website could look like, based on your business, ideas and logo. We talk with you first, then prepare your design direction. No payment details or obligation. The working website is a separate paid project."],
  ["What will my website include?", "We agree on your pages, features and content before building. Your custom design, mobile layout, clear contact options and technical search setup are part of that conversation. You receive a written scope and price before you decide."],
  ["Will my website show up on Google and AI search?", "We build clear service pages, structured content and technical search foundations so search engines can understand your business. Rankings and AI recommendations depend on many factors and cannot be guaranteed. Ongoing content and SEO work are scoped separately. The search graphics on this page are illustrations, not actual results."],
  ["How is a custom site different from a template?", "We design around your content and build the agreed experience instead of starting with a ready-made page layout. WordPress and other platforms can also be customised and perform well. Speed depends on the implementation, content and hosting; no platform alone guarantees it. Hosted builders can limit code portability. We hand over your site's code and domain."],
  ["Will I own the website, and does it need upkeep?", "You own your code and domain when the project is complete. Every website needs appropriate hosting, updates and occasional maintenance. We explain the ongoing services and costs separately, so you know what you are choosing."],
  ["Can you redesign my existing website?", "Yes. We review what you want to keep, what needs to improve, and which pages and links should carry over. Your design and written scope are agreed before development."],
  ["How do we work together?", "You work directly with our family-owned team by phone, email and video call. We plan the project together, review your design, agree on a schedule and get your approval before launch. We serve Chicago and the surrounding communities remotely."],
];

export default function ChicagoLandingPage() {
  return <LandingPolicyProvider><div id="top" className="wd-site chicago-editorial" data-page-version={PAGE_VERSION} data-design="chicago-launch-2026-10-02" data-market="chicago" data-page-mode="paid-landing">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Service", name: "Chicago Website Design", serviceType: "Custom website design and development", provider: { "@type": "Organization", name: "River City Digital Co." }, areaServed: { "@type": "City", name: "Chicago" } }) }} />
    <StudioNavigation focused landingPath="/chicago-web-design" />
    <main id="main" className="wd-page">
      <section className="wd-hero ch-hero" aria-labelledby="hero-heading">
        <div className="ch-hero-film"><ChicagoHeroBackground clips={CHICAGO_HERO_CLIPS} />
          <div className="wd-container ch-hero-title">
            <p className="ch-hero-eyebrow">Chicago-area businesses <span aria-hidden="true">·</span> Free mockup</p>
            <h1 id="hero-heading">Custom websites for<br /><span>Chicago-area businesses.</span></h1>
            <p className="ch-hero-description">Show customers what makes your business different—and make it easy to get in touch. Start with a free mockup before you commit to the build.</p>
            <div className="ch-hero-actions"><a href="#start" className="wd-button wd-button-mint">Get my free mockup <ArrowUpRight size={18} aria-hidden="true" /></a><CallLink context="chicago-hero" className="wd-button ch-hero-call" numberPrefix="Call " /></div>
          </div>
          <div className="wd-container ch-hero-footnote"><span>Family-owned. Personally built.</span><a href="#meet-river-city">Meet River City <ArrowDown size={15} aria-hidden="true" /></a></div>
        </div>
      </section>
      <NeighborhoodTicker />
      <div className="ch-river-journey"><RiverThread />
        <section className="wd-section ch-start rcd-light" id="meet-river-city" aria-label="Meet River City and request your free mockup" data-river-stop>
          <div className="wd-container ch-start-layout">
            <div className="ch-vsl" data-entrance="image"><HookVideo src="/assets/vsl/river-city-chicago-vsl.mp4" poster="/assets/vsl/river-city-chicago-vsl-poster.jpg" ctaLabel="Meet River City. See how we build." preload="none" /><p>A look at the people, the work, and your next website.</p>
              <figure className="ch-client-proof"><blockquote>“{CLIENT_REVIEW.excerpt}”</blockquote><figcaption><strong>{CLIENT_REVIEW.author}</strong><span>{CLIENT_REVIEW.business}</span><a href={CLIENT_REVIEW.url} target="_blank" rel="noopener noreferrer">Read her Google review <ArrowUpRight size={12} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></figcaption></figure>
            </div>
            <MockupRequestForm focused compact landingPath="/chicago-web-design" nextStep="We’ll contact you about your business and design ideas, then prepare your free mockup. You’ll receive a written scope and price before any website build begins." />
          </div>
        </section>
        <section className="wd-section ch-connection rcd-light" id="studio" aria-labelledby="studio-heading" data-river-stop>
          <div className="wd-container ch-connection-layout">
            <figure className="ch-river-photo" data-entrance="image"><Image src="/assets/chicago/chicago-river-story.webp" alt="Chicago River between downtown towers and raised bridges" width={1920} height={1080} sizes="(max-width: 800px) 100vw, 760px" /><figcaption>Two river cities. One shared way of doing business.</figcaption></figure>
            <div className="ch-connection-copy" data-entrance="rise"><h2 id="studio-heading">Chicago’s a<br />river city too.</h2><p>So is St. Louis. We’re River City Digital, a family-owned web design studio working with businesses up and down the Midwest.</p><p>Custom websites for businesses in Chicago, Naperville, Arlington Heights and surrounding communities.</p><p>You work directly with us from first mockup to launch. No account managers, no runaround, and a website you own when it’s done.</p><span className="ch-handled">From our family to your business.</span></div>
          </div>
        </section>
        {/* Awaiting authentic before/after screenshots from Linda's project. */}
        <MockupJourney />
        <ChicagoProjectGallery />
        <Suspense fallback={null}><ChicagoReviews /></Suspense>
        <SearchVisibility />
        <CompactComparison />
        <section className="wd-section ch-faq rcd-light" id="faq" aria-labelledby="faq-heading" data-river-stop><div className="wd-container ch-faq-layout"><div data-entrance="rise"><h2 id="faq-heading">A few things<br />worth knowing.</h2></div><div>{FAQS.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>
      </div>
      <section className="wd-section ch-final" id="final-request" aria-labelledby="contact-heading"><div className="wd-container ch-final-content"><h2 id="contact-heading">See what your website<br />could look like.</h2><p>Your business. Your ideas. A design you can see first.</p><a className="wd-button wd-button-mint" href="#start">Get my free mockup <ArrowUpRight size={20} aria-hidden="true" /></a><CallLink context="chicago-final" className="ch-final-call" numberPrefix="Or call " /></div><svg className="ch-skyline" viewBox="0 0 1440 170" preserveAspectRatio="none" aria-hidden="true"><path d="M0 155H55V120H84V94H112V132H151V73H180V111H215V54H228V23H235V5H241V23H250V54H263V103H289V80H333V130H363V57H387V42H421V57H443V132H475V110H511V87H536V101H560V140H604V68H628V40H636V16H640V40H651V68H676V119H716V84H743V116H778V54H805V38H826V54H843V127H881V99H910V44H936V13H942V44H961V85H986V134H1021V62H1062V106H1094V80H1119V47H1140V80H1161V139H1198V99H1234V119H1267V77H1281V61H1304V77H1326V136H1361V102H1395V149H1440V170H0Z" fill="currentColor" /></svg></section>
    </main>
    <StudioFooter focused market="chicago" /><StudioStickyContact /><StudioMotion /><RecoveryFunnel />
  </div></LandingPolicyProvider>;
}
