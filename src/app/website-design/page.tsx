import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import CallLink from "../_components/CallLink";
import BookCallLink from "../_components/BookCallLink";
import HeroPortal from "../_components/HeroPortal";
import { EMAIL } from "../_components/contact-info";
import TubesCursor from "@/components/ui/tubes-cursor";
import KineticMatrix from "@/components/ui/kinetic-matrix";
import ShaderBackground from "@/components/ui/shader-background";
import StudioNavigation from "./_components/StudioNavigation";
import MockupRequestForm from "./_components/MockupRequestForm";
import StudioStickyContact from "./_components/StudioStickyContact";
import StudioFooter from "./_components/StudioFooter";
import CustomBuildComparison, { CustomBuildIntroduction } from "./_components/CustomBuildComparison";
import ProjectGallery from "./_components/ProjectGallery";
import SearchFoundations from "./_components/SearchFoundations";
import BusinessSystems from "./_components/BusinessSystems";
import { BuildCapabilities, BuildProcess } from "./_components/BuildDetails";
import StudioMotion from "./_components/StudioMotion";
import "./website-design.css";
import "./website-details.css";
import "./website-conversion.css";
import "./website-motion.css";

export const metadata: Metadata = {
  title: "Custom Website Design in St. Louis",
  description: "St. Louis website design and custom development. Compare custom websites with Wix and WordPress templates, explore our work, and request a free mockup.",
  alternates: { canonical: "/website-design" },
  openGraph: {
    title: "Custom website design and development | River City Digital",
    description: "Custom websites, ecommerce, customer portals, and business software. Designed and developed in St. Louis.",
    url: "/website-design",
    images: [{ url: "/assets/portfolio-wellness-collective.webp", width: 1440, height: 798, alt: "The Wellness Collective website, designed by River City Digital" }],
  },
};

const FAQS = [
  ["What does a custom website cost?", "The investment depends on the pages, content, and functionality your business needs. A focused service website and a custom online store have different scopes. We talk through your priorities and provide a written proposal before you commit."],
  ["What happens when I request a free mockup?", "We follow up to learn about your business and discuss a possible design direction. The mockup is a preview of what your website could look like, with no obligation to move forward. It is not a complete, ready-to-launch website."],
  ["Can you redesign my existing website?", "Yes. We can assess what is working, what customers struggle with, and what deserves a fresh start. If you have an existing website, include its address in your request so we have a place to begin."],
  ["How long does a project take?", "Timing depends on scope, content readiness, integrations, and feedback. We agree on a project schedule in the proposal and explain what we need from you before the work begins."],
  ["Will I own my website?", "Yes. You own your website and domain. We explain hosting, third-party subscriptions, and any ongoing support separately in your proposal, so you know what is included and what continues after launch."],
  ["Will my website be ready for search and mobile?", "We build responsive layouts, clear page structure, descriptive metadata, and a technical foundation for search. Ongoing SEO and content work can be scoped separately. Search rankings and business results depend on more than the website alone."],
];

export default function WebsiteDesignPage() {
  return <div className="wd-site">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org", "@type": "Service", name: "St. Louis Website Design",
      serviceType: "Custom website design and development",
      provider: { "@type": "Organization", name: "River City Digital Co." },
      areaServed: { "@type": "City", name: "St. Louis" },
    }) }} />
    <HeroPortal /><StudioNavigation />
    <main id="main" className="wd-page">
      <section className="wd-hero" aria-labelledby="hero-heading">
        <div className="wd-hero-effects" aria-hidden="true"><ShaderBackground className="wd-hero-shader" /><KineticMatrix autoImpulseDelay={2050} /></div>
        <div className="wd-container wd-hero-content">
          <div className="wd-hero-copy">
            <p className="wd-eyebrow"><span className="wd-status-dot" /> Your local team · St. Louis, Missouri</p>
            <h1 id="hero-heading">St. Louis<br /><em>website design.</em></h1>
            <p className="wd-hero-description">Custom websites that make your services clear<br className="wd-desktop-break" /> and your business easy to contact.</p>
            <p className="wd-hero-detail">You own the code and domain. We agree on the scope and cost before the build starts.</p>
            <div className="wd-actions"><CallLink context="website-design-hero" className="wd-button wd-button-mint">Talk through your project <ArrowUpRight size={18} /></CallLink><a className="wd-button wd-button-outline wd-hero-mockup" href="#start">Get a free mockup <ArrowUpRight size={19} /></a></div>
            <p className="wd-hero-phone">Call River City Digital: <CallLink context="website-design-hero-number" icon={false} /></p>
          </div>
        </div>
        <div className="wd-container wd-hero-bottom"><span>Custom design · SEO foundations · Full code ownership</span><a href="#work">Explore the work <ArrowDown size={15} /></a></div>
      </section>
      <CustomBuildIntroduction />
      <ProjectGallery />
      <SearchFoundations />
      <CustomBuildComparison />
      <BuildCapabilities />
      <BusinessSystems />
      <BuildProcess />
      <section className="wd-section wd-studio rcd-light" id="studio" aria-labelledby="studio-heading">
        <div className="wd-container">
          <div className="wd-section-heading" data-entrance="rise"><div><p className="wd-eyebrow">River City Digital / St. Louis, Missouri</p><h2 id="studio-heading">A local team that can<br />design it and build it.</h2></div><p>We’re based right here in St. Louis. Talk with our local team about the design, development, and tools your website needs, with one project plan for the work.</p></div>
          <div className="wd-local-grid">
            <figure className="wd-local-photo" data-entrance="image"><Image src="/assets/bg-st-louis-street.webp" alt="A downtown street scene with the Gateway Arch in the distance" width={1280} height={720} sizes="(max-width: 760px) 90vw, 52vw"/><figcaption><span>Based in St. Louis, Missouri</span><CallLink context="website-design-studio" className="wd-text-link">Talk with our team <ArrowUpRight size={17}/></CallLink></figcaption></figure>
            <figure className="wd-testimonial" data-entrance="card" data-entrance-delay="1"><span className="wd-eyebrow">A client’s experience</span><span className="wd-quote-mark" aria-hidden="true">“</span><blockquote>They aren&apos;t just building me a website—they&apos;re helping me build a brand.</blockquote><figcaption><span className="wd-review-avatar" aria-hidden="true">AP</span><div><strong>Angelita Pritchett</strong><span>The Wellness Collective · Google review</span></div></figcaption><Link href="/work/the-wellness-collective" className="wd-case-link">View the Wellness Collective project <ArrowUpRight size={15}/></Link></figure>
          </div>
        </div>
      </section>
      <section className="wd-section wd-contact rcd-light" aria-labelledby="contact-heading">
        <div className="wd-container wd-contact-grid"><div className="wd-contact-copy" data-entrance="rise"><p className="wd-eyebrow">Discuss your project</p><h2 id="contact-heading">Tell us what<br />you need built.</h2><p>Tell us what you want your website to do. We’ll follow up about your project and a free design mockup.</p><div className="wd-contact-direct"><span>Prefer to talk it through?</span><CallLink context="website-design-contact" className="wd-contact-number" /><BookCallLink context="website-design-contact" className="wd-text-link wd-link-dark">Choose a time for a 30-minute call <ArrowUpRight size={17} /></BookCallLink></div><a href={`mailto:${EMAIL}`} className="wd-contact-email">{EMAIL}</a></div><MockupRequestForm /></div>
      </section>
      <section className="wd-section wd-faq rcd-light" aria-labelledby="faq-heading"><div className="wd-container wd-faq-grid"><div data-entrance="rise"><p className="wd-eyebrow">Frequently asked questions</p><h2 id="faq-heading">Questions about<br />the build.</h2></div><div>{FAQS.map(([question, answer]) => <details className="wd-faq-item" data-entrance="unfold" key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>
    </main>
    <StudioFooter /><StudioStickyContact /><TubesCursor mobileAmbient /><StudioMotion />
  </div>;
}
