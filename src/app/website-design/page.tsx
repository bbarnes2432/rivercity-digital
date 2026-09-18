import type { Metadata } from "next";
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
import ClientProof from "./_components/ClientProof";
import ProjectConversation from "./_components/ProjectConversation";
import SearchFoundations from "./_components/SearchFoundations";
import BusinessSystems from "./_components/BusinessSystems";
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
  ["What happens when I request a free mockup?", "We follow up to learn about your business, your design ideas, and your logo before preparing a PDF mockup. It shows a possible direction for what your website could look like, with no obligation to build. If you want to move forward, we agree on scope and price in a written proposal before development. The mockup is a design preview, not a complete, ready-to-launch website."],
  ["Can you redesign my existing website?", "Yes. We can assess what is working, what customers struggle with, and what deserves a fresh start. If you have an existing website, include its address in your request so we have a place to begin."],
  ["How long does a project take?", "Timing depends on scope, content readiness, integrations, and feedback. We agree on a project schedule in the proposal and explain what we need from you before the work begins."],
  ["Will I own my website?", "Yes. You own your website and domain. We explain hosting, third-party subscriptions, and any ongoing support separately in your proposal, so you know what is included and what continues after launch."],
  ["Will my website be ready for search and mobile?", "We build responsive layouts, clear page structure, descriptive metadata, and a technical foundation for search. Ongoing SEO and content work can be scoped separately. Search rankings and business results depend on more than the website alone."],
];

export default function WebsiteDesignPage() {
  return <div className="wd-site" data-page-version={PAGE_VERSION}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org", "@type": "Service", name: "St. Louis Website Design",
      serviceType: "Custom website design and development",
      provider: { "@type": "Organization", name: "River City Digital Co." },
      areaServed: { "@type": "City", name: "St. Louis" },
    }) }} />
    <HeroPortal /><StudioNavigation />
    <main id="main" className="wd-page">
      <section className="wd-hero wd-hero-with-form" aria-labelledby="hero-heading">
        <div className="wd-hero-effects" aria-hidden="true"><ShaderBackground className="wd-hero-shader" /><KineticMatrix autoImpulseDelay={2050} /></div>
        <div className="wd-container wd-hero-content">
          <div className="wd-hero-copy">
            <p className="wd-eyebrow"><span className="wd-status-dot" /> Your local team · St. Louis, Missouri</p>
            <h1 id="hero-heading">St. Louis<br /><em>website design.</em></h1>
            <p className="wd-hero-description">See what your new website could look like<br className="wd-desktop-break" /> with a <strong>free custom mockup.</strong></p>
            <p className="wd-hero-detail">A design preview for your business, with no obligation to build. If it feels like a fit, we agree on the scope and price before development.</p>
            <div className="wd-actions"><a className="wd-button wd-button-mint" href="#start">Request my free mockup <ArrowUpRight size={19} /></a><CallLink context="website-design-hero" className="wd-button wd-hero-call">Call our St. Louis team</CallLink></div>
            <p className="wd-hero-phone">Prefer a conversation? <CallLink context="website-design-hero-number" icon={false} /></p>
          </div>
          <MockupRequestForm />
        </div>
        <div className="wd-container wd-hero-bottom"><span>Custom design · SEO foundations · Full code ownership</span><a href="#work">Explore the work <ArrowDown size={15} /></a></div>
      </section>
      <ClientProof />
      <CustomBuildIntroduction />
      <ProjectGallery />
      <ProjectConversation />
      <SearchFoundations />
      <CustomBuildComparison />
      <BuildCapabilities />
      <BusinessSystems />
      <BuildProcess />
      <section className="wd-section wd-contact rcd-light" aria-labelledby="contact-heading">
        <div className="wd-container wd-contact-grid"><div className="wd-contact-copy" data-entrance="rise"><p className="wd-eyebrow">Discuss your project</p><h2 id="contact-heading">Tell us what<br />you need built.</h2><p>Start with a conversation about your business. Your free mockup is a preview of a possible design direction, with no obligation to build.</p><div className="wd-contact-direct"><span>Prefer to talk it through?</span><CallLink context="website-design-contact" className="wd-contact-number" /><BookCallLink context="website-design-contact" className="wd-text-link wd-link-dark">Choose a time for a 30-minute call <ArrowUpRight size={17} /></BookCallLink></div><a href={`mailto:${EMAIL}`} className="wd-contact-email">{EMAIL}</a></div><div className="wd-contact-preview" data-entrance="rise"><p className="wd-eyebrow">Free design preview</p><h3>Request your free mockup.</h3><p>We’ll follow up about your ideas and logo, then prepare a PDF preview of a possible website design. No obligation to build.</p><a className="wd-button wd-button-dark" href="#start">Request my free mockup <ArrowUpRight size={19} /></a></div></div>
      </section>
      <section className="wd-section wd-faq rcd-light" aria-labelledby="faq-heading"><div className="wd-container wd-faq-grid"><div data-entrance="rise"><p className="wd-eyebrow">Frequently asked questions</p><h2 id="faq-heading">Questions about<br />the build.</h2></div><div>{FAQS.map(([question, answer]) => <details className="wd-faq-item" data-entrance="unfold" key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>
    </main>
    <StudioFooter /><StudioStickyContact /><TubesCursor mobileAmbient /><StudioMotion /><RecoveryFunnel />
  </div>;
}
