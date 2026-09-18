import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import CallLink from "../_components/CallLink";
import BookCallLink from "../_components/BookCallLink";
import { EMAIL } from "../_components/contact-info";
import StudioNavigation from "./_components/StudioNavigation";
import MockupRequestForm from "./_components/MockupRequestForm";
import StudioStickyContact from "./_components/StudioStickyContact";
import StudioFooter from "./_components/StudioFooter";
import CustomBuildComparison from "./_components/CustomBuildComparison";
import ProjectGallery from "./_components/ProjectGallery";
import ClientProof from "./_components/ClientProof";
import SearchFoundations from "./_components/SearchFoundations";
import BusinessSystems from "./_components/BusinessSystems";
import { BuildCapabilities, BuildProcess } from "./_components/BuildDetails";
import TechnicalDetails from "./_components/TechnicalDetails";
import RecoveryFunnel from "./_components/RecoveryFunnel";
import "./website-design.css";
import "./website-details.css";
import "./website-conversion.css";
import "./website-contact.css";
import "./website-recovery.css";

export const metadata: Metadata = {
  title: "Custom Website Design in St. Louis",
  description: "Custom website design in St. Louis. See our real client work and request a free website mockup, with no obligation to build. Or call our local team.",
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
  return <div className="wd-site wd-recovery" data-page-version="mockup-recovery-2026-09-18">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org", "@type": "Service", name: "St. Louis Website Design",
      serviceType: "Custom website design and development",
      provider: { "@type": "Organization", name: "River City Digital Co." },
      areaServed: { "@type": "City", name: "St. Louis" },
    }) }} />
    <StudioNavigation />
    <main id="main" className="wd-page">
      <section className="wd-hero" aria-labelledby="hero-heading">
        <div className="wd-container wd-hero-content">
          <div className="wd-hero-copy">
            <p className="wd-eyebrow"><span className="wd-status-dot" /> Your local team · St. Louis, Missouri</p>
            <h1 id="hero-heading">St. Louis<br /><em>website design.</em></h1>
            <p className="wd-hero-description">See what your new website could look like<br className="wd-desktop-break" /> with a <strong>free custom mockup.</strong></p>
            <p className="wd-hero-detail">A design preview for your business, with no obligation to build. If it feels like a fit, we agree on the scope and price before development.</p>
            <div className="wd-actions"><a className="wd-button wd-button-mint" href="#start">Request my free mockup <ArrowUpRight size={19} /></a><CallLink context="website-design-hero" className="wd-button wd-recovery-call">Call our St. Louis team</CallLink></div>
            <p className="wd-hero-phone">Prefer a conversation? <CallLink context="website-design-hero-number" icon={false} /></p>
            <a href="#work" className="wd-hero-work"><Image src="/assets/portfolio-wellness-collective.webp" width={240} height={133} sizes="120px" alt="A real website we designed for The Wellness Collective" /><span>Made for real businesses.<strong>Explore our website projects <ArrowDown size={14} /></strong></span></a>
          </div>
          <MockupRequestForm />
        </div>
        <div className="wd-container wd-hero-bottom"><span>Custom design · SEO foundations · Full code ownership</span><a href="#work">Explore the work <ArrowDown size={15} /></a></div>
      </section>
      <ClientProof />
      <ProjectGallery />
      <section className="wd-section wd-recovery-scope rcd-light" aria-labelledby="scope-heading"><div className="wd-container">
        <p className="wd-eyebrow">Built around your business</p><h2 id="scope-heading">A clear website.<br />An easy next step.</h2>
        <div className="wd-recovery-cards"><article><h3>Help customers choose you.</h3><p>Clear service pages, real work and an easy way to call or inquire. Designed for mobile as well as desktop.</p></article><article><h3>Know what you’re buying.</h3><p>Your proposal sets out the pages, features, revisions, price and schedule. Hosting and ongoing support are explained separately.</p></article><article><h3>Keep control after launch.</h3><p>You own your website’s code and domain. We plan search foundations, forms and any important redirects as part of the build.</p></article></div>
      </div></section>
      <section className="wd-section wd-process" aria-labelledby="preview-process-heading"><div className="wd-container">
        <p className="wd-eyebrow">From free preview to finished website</p><h2 id="preview-process-heading">See the direction.<br />Then decide.</h2>
        <ol className="wd-recovery-steps"><li><span>01</span><h3>Tell us about your business.</h3><p>Request a mockup or call us. We’ll follow up to understand your services, customers and website needs.</p></li><li><span>02</span><h3>Discuss a design preview.</h3><p>See a possible direction for your website. The free mockup is a preview, not a complete website, and carries no obligation to build.</p></li><li><span>03</span><h3>Choose whether to move forward.</h3><p>If you want us to build it, we prepare a written scope and price. Development starts after you agree to the project.</p></li></ol>
        <a className="wd-button wd-button-mint" href="#start">Request my free mockup <ArrowUpRight size={18} /></a>
      </div></section>
      <section className="wd-section wd-contact rcd-light" aria-labelledby="contact-heading">
        <div className="wd-container wd-contact-grid"><div className="wd-contact-copy"><p className="wd-eyebrow">Your local St. Louis team</p><h2 id="contact-heading">Want to talk<br />it through?</h2><p>A new website or a redesign starts with understanding your business. Tell us what you want to improve, and we’ll discuss the options.</p><a className="wd-button wd-button-dark" href="#start">Request a free mockup <ArrowUpRight size={18} /></a></div><div className="wd-contact-direct"><CallLink context="website-design-contact" className="wd-contact-number" /><BookCallLink context="website-design-contact" className="wd-text-link wd-link-dark">Choose a time for a 30-minute call <ArrowUpRight size={17} /></BookCallLink><a href={`mailto:${EMAIL}`} className="wd-contact-email">{EMAIL}</a></div></div>
      </section>
      <section className="wd-section wd-faq rcd-light" aria-labelledby="faq-heading"><div className="wd-container wd-faq-grid"><div data-entrance="rise"><p className="wd-eyebrow">Frequently asked questions</p><h2 id="faq-heading">Questions about<br />the build.</h2></div><div>{FAQS.map(([question, answer]) => <details className="wd-faq-item" data-entrance="unfold" key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>
      <TechnicalDetails><SearchFoundations /><CustomBuildComparison /><BuildCapabilities /><BusinessSystems /><BuildProcess /></TechnicalDetails>
    </main>
    <StudioFooter /><StudioStickyContact /><RecoveryFunnel />
  </div>;
}
