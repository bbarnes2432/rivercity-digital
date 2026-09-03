import type { Metadata } from "next";
import Nav from "../_components/Nav";
import Footer from "../_components/Footer";
import Section from "../_components/Section";
import Container from "../_components/Container";
import SectionHeader from "../_components/SectionHeader";
import Button from "../_components/Button";
import CtaBand from "../_components/CtaBand";
import Breadcrumbs from "../_components/Breadcrumbs";
import ScrollReveal from "../_components/ScrollReveal";
import HookVideo from "../_components/HookVideo";
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
import HowWeBuild from "./_components/HowWeBuild";
import BuildSteps from "./_components/BuildSteps";
import WhatWeBuild from "./_components/WhatWeBuild";
import Standards from "./_components/Standards";
import "../styles/inner.css";

export const metadata: Metadata = {
  title: "Website Design for St. Louis Businesses",
  description:
    "Custom websites for St. Louis businesses. No themes, no templates. Built for Google and AI search from the first wireframe. Live in 2 weeks.",
  alternates: { canonical: "/website-design" },
  openGraph: {
    title: "Website Design — River City Digital",
    description: "No themes. No templates. No swap-the-logo. Custom-built websites for St. Louis businesses.",
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
      <Nav overlayMode="light-on-dark" />

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
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Services" },
                { label: "Website Design" },
              ]}
            />
            <div className="rcd-hero-inner" style={{ marginTop: 32 }}>
              <div className="rcd-hero-copy">
                <p className="t-eyebrow rcd-hero-eyebrow">Service · 03</p>
                {/* The H1 answers the search that pays to get here. Ads for
                    this page bid on "st louis web design" and "website design
                    st louis"; the old H1 ("No themes. No templates.") was a
                    positioning line that matched neither, and Google rated
                    landing page experience Below average on every one of those
                    keywords. The brand line keeps its place as the tagline. */}
                <h1 className="t-display-1">St. Louis<br />website design.</h1>
                <p className="rcd-hero-tagline">No themes. No templates.</p>
                <p className="rcd-hero-lede">
                  Custom websites for St. Louis businesses. Hand-coded. Fast.
                  Designed for Google and AI search from the first wireframe.
                </p>
                {/* The ads promise a free website audit in the headline, the
                    callout and a sitelink. The hero used to answer that with
                    "Start a build" — a much larger commitment — and send people
                    to /contact, a second page load away from the form sitting
                    further down this one. Now it offers what was advertised and
                    scrolls to the form in place. */}
                <div className="rcd-hero-actions">
                  <Button href="#start" size="lg" arrow>Get my free website audit</Button>
                  <CallLink context="hero" className="btn btn-ghost btn-lg" />
                </div>
                <div className="rcd-hero-meta">
                  <span className="rcd-hero-meta-item">2-week typical launch</span>
                  <span className="rcd-hero-meta-item">Free, no-obligation audit</span>
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

        {/* How we build: the stack, and why — a light chapter. */}
        <HowWeBuild />

        {/* The build, step by step: one step on screen at a time beside one
            of our sites being built on the shared canvas. */}
        <BuildSteps />

        {/* What we build: four cards that tilt toward the cursor. Light. */}
        <WhatWeBuild />

        {/* Standards: the checklist, a constellation behind it. */}
        <Standards />

        {/* Video */}
        <Section mode="working" className="rcd-video rcd-light">
          <Container>
            <SectionHeader
              eyebrow="Watch · 40 Sec"
              title="See how we build."
              lede="A quick look at how we design and build custom, search-ready websites for St. Louis businesses."
            />
            <div className="rcd-hook-video-wrap fx-reveal">
              <HookVideo
                src="/assets/web-design-video.mp4"
                poster="/assets/web-design-poster.jpg"
                ctaLabel="See how we build your site"
              />
            </div>
          </Container>
        </Section>

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
              title="What St. Louis businesses say."
              lede="Restaurants, contractors, salons and shops around the metro — the people these builds are actually for."
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
          eyebrow="Start a build"
          title="Tell us about your project."
          lede="A few sentences is plenty. We&rsquo;ll come back with questions, a real timeline, and a real number. Same-day reply most days."
          defaultService="New website"
          context="form-section"
        />

        <CtaBand
          id="closing"
          eyebrow="Ready to build"
          title="Start a website that earns its keep."
          lede="Free 30-minute discovery call. We come back with a real plan, a real timeline, and a real number."
          primaryHref="#start"
          primaryLabel="Get my free website audit"
        />
      </main>
      </Stage>

      {/* Mobile shortcut back to the form once the hero has scrolled away.
          Hidden again near the form itself so it never covers its own target. */}
      <MobileStickyCta
        href="#start"
        label="Get my free website audit"
        hideNearId="start"
      />

      <Footer />
      <ScrollReveal />
      {/* The tubes cursor: its own canvas over the whole page, mouse only. */}
      <TubesCursor />
    </>
  );
}
