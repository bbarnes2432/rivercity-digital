import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import CallLink from "../_components/CallLink";
import HeroPortal from "../_components/HeroPortal";
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
    description: "Custom websites for local businesses. Meet your St. Louis team and request a free mockup.",
    url: "/website-design",
    images: [{ url: "/assets/portfolio-wellness-collective.webp", width: 1440, height: 798, alt: "The Wellness Collective website, designed by River City Digital" }],
  },
};

const FAQS = [
  ["What does a custom website cost?", "The price depends on the pages and features you need. We give you a written price and plan before you decide to build."],
  ["What happens when I request a free mockup?", "We get in touch about your business, ideas, and logo. Then we create a preview of what your website could look like. The mockup is free, with no obligation. Building the working website is a separate paid project, with the price agreed first."],
  ["Can you redesign my existing website?", "Yes. Share your current website so we can see what to keep and what to improve."],
  ["How long does a project take?", "It depends on the size of the website and how soon your content is ready. We agree on a schedule before the build."],
  ["Will I own my website?", "Yes. You own your website’s code and domain. Hosting, maintenance, and other ongoing costs are listed separately in your proposal."],
  ["Will my website be ready for search and mobile?", "Yes. We design for phones and computers, write clear page titles, and set up your pages for search engines. Ongoing SEO is separate. No website can guarantee rankings or leads."],
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
            <p className="wd-eyebrow"><span className="wd-status-dot" /> Local &amp; family-owned · St. Louis</p>
            <h1 id="hero-heading">St. Louis<br /><em>website design.</em></h1>
            <p className="wd-hero-description">A website that shows what you do and makes it easy to contact you.<br className="wd-desktop-break" /> Start with a <strong>free mockup.</strong></p>
            <p className="wd-hero-detail">See what your website could look like, using your ideas and logo. No payment details. No obligation to build.</p>
            <div className="wd-actions"><a className="wd-button wd-button-mint" href="#start">Request my free mockup <ArrowUpRight size={19} /></a><CallLink context="website-design-hero" className="wd-button wd-hero-call">Call our St. Louis team</CallLink></div>
          </div>
          <MockupRequestForm />
        </div>
        <div className="wd-container wd-hero-bottom"><span>Custom design · Built for phones · A website you own</span><a href="#work">Explore the work <ArrowDown size={15} /></a></div>
      </section>
      <ClientProof />
      <CustomBuildIntroduction />
      <ProjectGallery />
      <ProjectConversation />
      <SearchFoundations />
      <CustomBuildComparison />
      <BuildCapabilities />
      <BuildProcess />
      <section className="wd-section wd-faq rcd-light" aria-labelledby="faq-heading"><div className="wd-container wd-faq-grid"><div data-entrance="rise"><p className="wd-eyebrow">Frequently asked questions</p><h2 id="faq-heading">Questions about<br />the build.</h2></div><div>{FAQS.map(([question, answer]) => <details className="wd-faq-item" data-entrance="unfold" key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>
      <section className="wd-section wd-contact rcd-light" id="final-request" aria-labelledby="contact-heading">
        <div className="wd-container wd-contact-grid"><div className="wd-contact-copy" data-entrance="rise"><p className="wd-eyebrow">Your business. Your website.</p><h2 id="contact-heading">See what your website<br />could look like.</h2><p>Share your ideas. Get a free mockup. Decide on the full website when you’re ready.</p><div className="wd-contact-direct"><span>Prefer to talk?</span><CallLink context="website-design-contact" className="wd-contact-number" /></div></div><div className="wd-contact-preview" data-entrance="rise"><p className="wd-eyebrow">Free design preview</p><h3>Request your free mockup.</h3><p>No payment details and no obligation. We agree on the price before building your website.</p><a className="wd-button wd-button-dark" href="#start">Request my free mockup <ArrowUpRight size={19} /></a></div></div>
      </section>
    </main>
    <StudioFooter /><StudioStickyContact /><TubesCursor mobileAmbient /><StudioMotion /><RecoveryFunnel />
  </div>;
}
