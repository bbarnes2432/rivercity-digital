import type { Metadata } from "next";
import Image from "next/image";
import Nav from "../_components/Nav";
import Footer from "../_components/Footer";
import Section from "../_components/Section";
import Container from "../_components/Container";
import SectionHeader from "../_components/SectionHeader";
import Button from "../_components/Button";
import CtaBand from "../_components/CtaBand";
import ContactForm from "../_components/contact-form";
import Stat from "../_components/Stat";
import Breadcrumbs from "../_components/Breadcrumbs";
import ScrollReveal from "../_components/ScrollReveal";
import { Globe, Rocket, ShoppingBag, RefreshCw } from "lucide-react";
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

const WHAT = [
  { t: "Marketing sites", d: "Custom-designed websites for restaurants, contractors, professional services, salons, retail. Built to convert.", Icon: Globe },
  { t: "Landing pages", d: "Single-purpose pages for ad campaigns or one-time launches. Quick to ship, sharp to convert.", Icon: Rocket },
  { t: "E-commerce", d: "Shopify and headless storefronts when you need product. Fast, custom-themed, search-ready.", Icon: ShoppingBag },
  { t: "Redesigns", d: "When the existing site is the constraint. We rebuild for speed, search, and the way customers actually use it.", Icon: RefreshCw },
];

const TIMELINE = [
  { n: "01", w: "Day 1", t: "Coffee", d: "We sit down — goals, customers, what's working, what's broken." },
  { n: "02", w: "Days 2–4", t: "Wireframes", d: "Page-by-page wireframes. You approve before any visual work." },
  { n: "03", w: "Days 5–8", t: "Design", d: "Custom design system + every page mocked. Real content, no lorem ipsum." },
  { n: "04", w: "Days 9–12", t: "Build", d: "Hand-coded — Next.js, fast, accessible. Schema and SEO baked in." },
  { n: "05", w: "Day 14", t: "Launch", d: "DNS, monitoring, analytics. We hand off the keys (we still answer the phone)." },
];

const STANDARDS = [
  "Lighthouse 95+ on Performance, Accessibility, SEO, Best Practices",
  "First Contentful Paint under 1.2 seconds",
  "Largest Contentful Paint under 2.5 seconds",
  "Cumulative Layout Shift under 0.05",
  "Schema.org markup on every relevant page",
  "WCAG 2.1 AA accessibility — for real, not as a checkbox",
];

export default function WebsiteDesignPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_LD) }}
      />
      <Nav overlayMode="light-on-dark" />

      <main id="main">
        {/* Hero */}
        <header className="rcd-hero" data-mode="civic-deep">
          <div className="rcd-hero-bg" style={{ opacity: 0.42 }}>
            <Image
              src="/assets/bg-build-launch.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
          <div className="rcd-hero-grain" aria-hidden="true" />
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
                <h1 className="t-display-1">No themes.<br />No templates.</h1>
                <p className="rcd-hero-tagline">Built here. Built to be found.</p>
                <p className="rcd-hero-lede">
                  Custom websites for St. Louis businesses. Hand-coded. Fast.
                  Designed for Google and AI search from the first wireframe.
                </p>
                <div className="rcd-hero-actions">
                  <Button href="/contact" size="lg" arrow>Start a build</Button>
                  <Button href="/work" size="lg" variant="ghost">See selected work</Button>
                </div>
                <div className="rcd-hero-meta">
                  <span className="rcd-hero-meta-item">2-week typical launch</span>
                  <span className="rcd-hero-meta-item">No theme. No template.</span>
                </div>
              </div>
            </div>
          </Container>
        </header>

        {/* Stats */}
        <Section mode="letterhead" pad="tight" className="tex-dots section--bg-pop-laptop">
          <Container>
            <div className="rcd-stat-grid fx-stagger">
              <Stat value={1.2} suffix="s" decimals={1} label="LCP target" caption="Every site we ship targets sub-1.2s Largest Contentful Paint." />
              <Stat value={14} suffix=" days" label="Typical launch" caption="From kickoff to live, for marketing-site builds." />
              <Stat value={95} prefix="≥ " label="Lighthouse" caption="Performance, Accessibility, SEO, Best Practices — every site, every page." />
            </div>
          </Container>
        </Section>

        {/* What we build */}
        <Section mode="working" className="section--bg-build">
          <Container>
            <SectionHeader
              eyebrow="What we build"
              title="Four kinds of work."
              lede="All custom. All hand-coded. All built to be found."
            />
            <div className="rcd-list-grid fx-stagger">
              {WHAT.map(({ t, d, Icon }) => (
                <article key={t} className="rcd-list-card fx-lift">
                  <div className="rcd-list-card-icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </article>
              ))}
            </div>
          </Container>
        </Section>

        {/* Timeline */}
        <Section mode="sunken" className="section--bg-strategy">
          <Container>
            <SectionHeader
              eyebrow="The 14-day build"
              title="From coffee to launch."
              lede="A real timeline for a real marketing-site build. Bigger projects scale, but the rhythm is the same."
            />
            <div className="rcd-stages fx-stagger">
              {TIMELINE.map((s) => (
                <article key={s.n} className="rcd-stage-card">
                  <div className="rcd-stage-num">{s.w.toUpperCase()}</div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </article>
              ))}
            </div>
          </Container>
        </Section>

        {/* Standards */}
        <Section mode="working">
          <Container narrow>
            <SectionHeader
              eyebrow="Anatomy of a fast site"
              title="The standards we hold every build to."
              lede="Performance and accessibility aren't add-ons. They're the spec."
              align="left"
            />
            <ul className="list-check fx-stagger" style={{ marginTop: 32 }}>
              {STANDARDS.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </Container>
        </Section>

        {/* Inline contact form */}
        <Section mode="working" id="start" className="tex-dots rcd-inline-contact-section">
          <Container narrow>
            <div className="rcd-inline-contact fx-stagger">
              <div className="rcd-inline-contact-head">
                <p className="t-eyebrow">Start a build</p>
                <h2 className="t-h2">Tell us about your project.</h2>
                <p className="t-lede">
                  A few sentences is plenty. We&apos;ll come back with questions,
                  a real timeline, and a real number. Same-day reply most days.
                </p>
              </div>

              <div className="rcd-inline-contact-fast">
                <a
                  href="https://cal.com/rivercitydigital/15min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-md"
                >
                  Book a 15-min call
                </a>
                <span className="rcd-inline-contact-or" aria-hidden="true">
                  <span>or write us below</span>
                </span>
              </div>

              <div className="rcd-inline-contact-card">
                <ContactForm defaultService="New website" />
              </div>
            </div>
          </Container>
        </Section>

        <CtaBand
          eyebrow="Ready to build"
          title="Start a website that earns its keep."
          lede="Free 30-minute discovery call. We come back with a real plan, a real timeline, and a real number."
          primaryHref="/contact"
          primaryLabel="Start a build"
        />
      </main>

      <Footer />
      <ScrollReveal />
    </>
  );
}
