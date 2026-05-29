import type { Metadata } from "next";
import Image from "next/image";
import Nav from "../_components/Nav";
import Footer from "../_components/Footer";
import Section from "../_components/Section";
import Container from "../_components/Container";
import SectionHeader from "../_components/SectionHeader";
import Button from "../_components/Button";
import CtaBand from "../_components/CtaBand";
import Stat from "../_components/Stat";
import Breadcrumbs from "../_components/Breadcrumbs";
import ScrollReveal from "../_components/ScrollReveal";
import { Search, MessageCircle, Megaphone, Mail } from "lucide-react";
import "../styles/inner.css";

export const metadata: Metadata = {
  title: "Digital Marketing for St. Louis Businesses",
  description:
    "Google Ads, Meta, social, and email — managed personally by St. Louis people. We treat your ad budget like our own.",
  alternates: { canonical: "/digital-marketing" },
  openGraph: {
    title: "Digital Marketing — River City Digital",
    description: "Spend like a local. Convert like one. Personally managed paid media for St. Louis businesses.",
    url: "/digital-marketing",
  },
};

const SERVICE_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Digital Marketing",
  serviceType: "Paid media management (Google Ads, Meta, social, email)",
  provider: { "@type": "Organization", name: "River City Digital Co." },
  areaServed: { "@type": "City", name: "St. Louis" },
};

const PAINS = [
  { num: "01", text: "Wasted spend" },
  { num: "02", text: "No real local targeting" },
  { num: "03", text: "Generic creative that nobody hits" },
  { num: "04", text: "No follow-up. No nurture. No system." },
];

const CHANNELS = [
  { t: "Google Ads", d: "Search, Performance Max, Local Service Ads. We build, we test, we report — every dollar tied to a query and a result.", Icon: Search },
  { t: "Meta Ads", d: "Facebook + Instagram. Custom creative, real audiences, the kind of testing offshore agencies don't bother with.", Icon: MessageCircle },
  { t: "Social management", d: "Two posts a week, written here, in your voice. Plus quarterly content shoots if you want them.", Icon: Megaphone },
  { t: "Email & SMS", d: "Welcome flows, monthly newsletter, transactional emails. Klaviyo, Mailchimp, SendGrid — pick your poison.", Icon: Mail },
];

const TIMELINE = [
  { n: "01", w: "Week 1", t: "Audit", d: "We pull the last 90 days of spend. We tell you what worked, what burned. No diplomatic dancing." },
  { n: "02", w: "Week 2", t: "Build", d: "New campaign architecture. Real audiences, fresh creative, conversion tracking that actually works." },
  { n: "03", w: "Weeks 3+", t: "Run", d: "We manage daily. We test weekly. We report monthly with the metrics owners actually care about." },
  { n: "04", w: "Quarterly", t: "Adjust", d: "Strategy review. Channel mix re-balancing. New creative. The ongoing part of ongoing." },
];

export default function DigitalMarketingPage() {
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
              src="/assets/bg-grow.webp"
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
                { label: "Digital Marketing" },
              ]}
            />
            <div className="rcd-hero-inner" style={{ marginTop: 32 }}>
              <div className="rcd-hero-copy">
                <p className="t-eyebrow rcd-hero-eyebrow">Service · 04</p>
                <h1 className="t-display-1">The cheapest ad<br />is the one that<br />converts.</h1>
                <p className="rcd-hero-tagline">Spend like a local. Convert like one.</p>
                <p className="rcd-hero-lede">
                  Google Ads, Meta, social, and email — managed personally by the same St. Louis person who built your campaigns.
                  Every dollar accounted for.
                </p>
                <div className="rcd-hero-actions">
                  <Button href="/contact" size="lg" arrow>Get my free audit</Button>
                  <Button href="#how" size="lg" variant="ghost">How it works</Button>
                </div>
              </div>
            </div>
          </Container>
        </header>

        {/* Stats */}
        <Section mode="letterhead" pad="tight" className="tex-dots section--bg-pop-arrows">
          <Container>
            <div className="rcd-stat-grid fx-stagger">
              <Stat value={4} suffix="×" label="Lift in qualified leads" caption="Average from rebuild engagements vs. their previous agency." />
              <Stat value={63} suffix="%" label="Less wasted spend" caption="What we typically reclaim by tightening targeting and creative." />
              <Stat value={30} suffix=" days" label="To first signal" caption="Inside a month, you'll know whether the new architecture is working." />
            </div>
          </Container>
        </Section>

        {/* Pain manifesto */}
        <Section mode="working" className="section--bg-grow">
          <Container narrow>
            <SectionHeader
              eyebrow="Why St. Louis owners come to us"
              title="The four reasons."
              lede="Said another way: every campaign we inherit has at least three of these."
              align="left"
            />
            <div className="rcd-pain fx-stagger" style={{ marginTop: 32 }}>
              {PAINS.map((p) => (
                <div key={p.num} className="rcd-pain-line">
                  <span className="num">{p.num}</span>
                  <span>{p.text}</span>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Editorial figure */}
        <Section mode="working" pad="tight">
          <Container narrow>
            <div className="rcd-editorial-figure fx-reveal">
              <Image
                src="/assets/feature-vs-agencies.webp"
                alt="Comparison of a national agency's spend distribution vs. River City Digital's"
                width={1200}
                height={750}
                sizes="(max-width: 880px) 100vw, 880px"
                style={{ width: "100%", height: "auto", borderRadius: "var(--r-lg)" }}
              />
              <p className="t-mono" style={{ color: "var(--ink-tertiary)", marginTop: 16, letterSpacing: "0.06em", textAlign: "center" }}>
                FIG. 01 — WHERE A $1,000 AD BUDGET GOES, NATIONAL AGENCY VS. LOCAL STUDIO
              </p>
            </div>
          </Container>
        </Section>

        {/* Channels */}
        <Section mode="sunken" id="how" className="section--bg-data">
          <Container>
            <SectionHeader
              eyebrow="Channels"
              title="Four levers, run together."
              lede="The mix is different for every business. The discipline is the same."
            />
            <div className="rcd-list-grid fx-stagger">
              {CHANNELS.map(({ t, d, Icon }) => (
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
        <Section mode="working">
          <Container>
            <SectionHeader
              eyebrow="How we run it"
              title="What the first 90 days looks like."
            />
            <div className="rcd-stages rcd-stages--4 fx-stagger">
              {TIMELINE.map((s) => (
                <article key={s.n} className="rcd-stage-card">
                  <div className="rcd-stage-num">{s.n} · {s.w.toUpperCase()}</div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </article>
              ))}
            </div>
          </Container>
        </Section>

        <CtaBand
          eyebrow="Ready to spend smarter"
          title="Let us audit your last 90 days."
          lede="Free, no commitment. We'll tell you what worked, what burned, and what we'd do differently."
          primaryHref="/contact"
          primaryLabel="Free 90-day audit"
        />
      </main>

      <Footer />
      <ScrollReveal />
    </>
  );
}
