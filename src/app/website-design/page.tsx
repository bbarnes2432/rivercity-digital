import type { Metadata } from "next";
import Nav from "../_components/Nav";
import Footer from "../_components/Footer";
import Section from "../_components/Section";
import Container from "../_components/Container";
import SectionHeader from "../_components/SectionHeader";
import Button from "../_components/Button";
import CtaBand from "../_components/CtaBand";
import ScrollReveal from "../_components/ScrollReveal";
import CallLink from "../_components/CallLink";
import InlineContactSection from "../_components/InlineContactSection";
import Testimonials from "../_components/testimonials";
import MobileStickyCta from "../_components/MobileStickyCta";
import KineticMatrix from "@/components/ui/kinetic-matrix";
import ShaderBackground from "@/components/ui/shader-background";
import HeroPortal from "../_components/HeroPortal";
import Stage from "@/components/three/Stage";
import TubesCursor from "@/components/ui/tubes-cursor";
import Hallway from "./_components/Hallway";
import Showcase from "./_components/Showcase";
import LocalSection from "./_components/LocalSection";
import ButtonEnergy from "../_components/ButtonEnergy";
import HowWeBuild from "./_components/HowWeBuild";
import CustomBuildComparison from "./_components/CustomBuildComparison";
import BusinessSystems from "./_components/BusinessSystems";
import BuildSteps from "./_components/BuildSteps";
import WhatWeBuild from "./_components/WhatWeBuild";
import Standards from "./_components/Standards";
import "../styles/inner.css";

export const metadata: Metadata = {
  title: "Website Design for St. Louis Businesses",
  description:
    "Custom website design for St. Louis businesses. Help customers understand your services, trust your business, and get in touch. Request a free website mockup.",
  alternates: { canonical: "/website-design" },
  openGraph: {
    title: "Website Design — River City Digital",
    description: "Custom websites that make your services clear and contacting you easy. Serving St. Louis businesses. Request a free website mockup.",
    url: "/website-design",
  },
};

const SERVICE_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Website Design",
  serviceType: "Custom website design and development",
  provider: { "@type": "Organization", name: "River City Digital Co." },
  areaServed: { "@type": "City", name: "St. Louis" },
};




export default function WebsiteDesignPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_LD) }}
      />
      <HeroPortal />
      <Nav overlayMode="light-on-dark" primaryHref="/website-design#start" primaryLabel="Free mockup" />

      <Stage>
      <main id="main" className="rcd-world-page">
        {/* Hero — the ad's first impression, so it does the one thing a
            screenshot of a competitor can't: it responds.

            Three layers, bottom to top:
              1. ShaderBackground — the drifting WebGL gradient, in the slot the
                 photograph used to occupy. .rcd-hero-bg::after still paints its
                 navy scrim over it, which is what keeps white type legible no
                 matter where a bright blob drifts.
              2. KineticMatrix — the spring lattice, reacting to cursor or finger.
              3. The copy, the CTA and the phone number.
            Both layers pause when the hero scrolls out of view. */}
        <header className="rcd-hero rcd-hero--matrix" data-mode="civic-deep">
          <div className="rcd-hero-bg">
            <ShaderBackground className="absolute inset-0" />
          </div>
          {/* Fires after the 1900ms portal has fully finished, not during it.
              Overlapping the two put a canvas-wide shockwave on exactly the
              frames the aperture was already contending for, which is what made
              the tail of the entrance stutter. Now they read as a sequence:
              the door opens, then the grid answers. */}
          <KineticMatrix autoImpulseDelay={2050} />
          <div className="rcd-hero-grain" aria-hidden="true" />
          {/* The hero melts into the dark of the hall below. */}
          <div className="rcd-hero-melt" aria-hidden="true" />
          <Container>
            <div className="rcd-hero-inner" style={{ marginTop: 32 }}>
              <div className="rcd-hero-copy">
                {/* The H1 answers the search that pays to get here. Ads for
                    this page bid on "st louis web design" and "website design
                    st louis"; the old H1 ("No themes. No templates.") was a
                    positioning line that matched neither, and Google rated
                    landing page experience Below average on every one of those
                    keywords. The tagline explains the benefit. */}
                <h1 className="t-display-1">St. Louis<br />website design.</h1>
                <p className="rcd-hero-tagline">Make it easier for customers to choose you.</p>
                <p className="rcd-hero-lede">
                  We build custom websites that explain what you do, show why
                  customers trust you, and make it easy to call, book, or request a quote.
                </p>
                {/* Keep the mockup offer consistent through the form. */}
                <div className="rcd-hero-actions">
                  <Button href="/website-design#start" size="lg" arrow>Get my free website mockup</Button>
                  <CallLink context="hero" className="btn btn-ghost btn-lg" />
                </div>
                <div className="rcd-hero-meta">
                  <span className="rcd-hero-meta-item">Landing pages to custom platforms</span>
                  <span className="rcd-hero-meta-item">Free, with no obligation to build</span>
                </div>
              </div>
            </div>
          </Container>
        </header>



        {/* The work, first: the hallway. The shared canvas draws the corridor
            behind this section; the captions and the fallback grid are DOM. */}
        <Hallway />

        {/* What's possible: three live demonstrations on the shared canvas —
            a site pulled into its parts, a surface that answers the cursor,
            a word becoming another word. */}
        <Showcase />

        {/* What the client receives — a light chapter. */}
        <HowWeBuild />

        {/* Why we recommend a custom Next.js build over a template. */}
        <CustomBuildComparison />

        {/* Connect custom code to business workflows and software costs. */}
        <BusinessSystems />

        {/* The build, step by step: one step on screen at a time beside one
            of our sites being built on the shared canvas. */}
        <BuildSteps />

        {/* Project sizes from single landing pages to full platforms. */}
        <WhatWeBuild />

        {/* Right here in St. Louis: local, and not a number. Light. */}
        <LocalSection />

        {/* Standards: the checklist, a constellation behind it. */}
        <Standards />


        {/* Proof.
            This page asked people to spend money on a custom build and showed
            them no evidence anyone had ever been happy with one — the ads even
            run a "5.0 Star Google Rating" callout that the page did nothing
            with. These are the same testimonials the homepage has been using;
            they belong in front of paid traffic more than anywhere else. */}
        <Section mode="working" className="section--bg-coffee">
          <Container>
            <SectionHeader
              eyebrow="Testimonials"
              title="What our clients say."
              lede="Business owners share their experience with the process, the finished website, and the support."
            />
            <div className="fx-reveal">
              <Testimonials count={3} />
            </div>
          </Container>
        </Section>

        {/* Inline contact form. The block itself lives in
            <InlineContactSection /> now that /about and the other sitelink
            destinations need the same thing. */}
        <InlineContactSection
          id="start"
          eyebrow="Free website mockup"
          title="See what your website could look like."
          lede="One landing page or a full business platform: tell us what you need and which processes you'd like to improve. We'll follow up with any questions before preparing your free website mockup. No obligation to move forward."
          defaultService="New website"
          context="form-section"
          formVariant="website-mockup"
        />

        <CtaBand
          id="closing"
          eyebrow="Your next website"
          title="Start with a free mockup."
          lede="No project is too small. Whether you need a landing page or a complete custom platform, tell us what you're planning. Start with a free website mockup, then decide on the scope, timeline, and price."
          primaryHref="/website-design#start"
          primaryLabel="Get my free website mockup"
        />
      </main>
      </Stage>

      {/* Mobile shortcut back to the form once the hero has scrolled away.
          Hidden again near the form itself so it never covers its own target. */}
      <MobileStickyCta
        href="/website-design#start"
        label="Get my free website mockup"
        hideNearId="start"
      />

      <Footer />
      <ScrollReveal />
      <ButtonEnergy />
      {/* The tubes cursor: its own canvas over the whole page, mouse only. */}
      <TubesCursor />
    </>
  );
}
