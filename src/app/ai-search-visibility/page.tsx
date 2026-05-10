import type { Metadata } from "next";
import Link from "next/link";
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
import "../styles/inner.css";

export const metadata: Metadata = {
  title: "AI Search Visibility for St. Louis Businesses",
  description:
    "Get recommended by ChatGPT, Gemini, and Perplexity. AI search visibility audits and optimization for St. Louis local businesses.",
  alternates: { canonical: "/ai-search-visibility" },
  openGraph: {
    title: "AI Search Visibility — River City Digital",
    description: "Be the answer ChatGPT, Gemini, and Perplexity give when customers ask who to call in St. Louis.",
    url: "/ai-search-visibility",
  },
};

const SERVICE_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AI Search Visibility",
  serviceType: "AI search optimization (GEO)",
  provider: { "@type": "Organization", name: "River City Digital Co." },
  areaServed: { "@type": "City", name: "St. Louis" },
  description:
    "Optimization to be cited and recommended by AI search engines including ChatGPT, Google Gemini, Perplexity, and Claude.",
};

const STAGES = [
  { n: "01", t: "Web crawl", d: "Make every page discoverable, fast, and structured. The basics AI scrapers prioritize." },
  { n: "02", t: "Schema", d: "LocalBusiness, Service, Review, FAQ — the structured data that tells AI exactly who you are." },
  { n: "03", t: "Citations", d: "Consistent NAP across the directories AI weighs heaviest. Quality, not volume." },
  { n: "04", t: "Profile", d: "Google Business Profile rebuilt as a primary source — the GBP is now half the answer." },
  { n: "05", t: "Output", d: "We monitor AI results monthly. When you're cited, we know. When you're not, we fix it." },
];

const FIELD_REPORTS = [
  {
    where: "WEBSTER GROVES",
    when: "MAR 2026",
    subject: "Independent HVAC contractor, 12 employees.",
    body: "Pre-engagement: 0 mentions across ChatGPT, Gemini, Perplexity. 90 days in: cited by name in 8 of 12 category queries. Phone calls up ~40%. Owner: 'ChatGPT is now our second-best lead source.'",
  },
  {
    where: "CLAYTON",
    when: "FEB 2026",
    subject: "Estate-planning attorney, solo practice.",
    body: "Pre: cited by Gemini once for an obscure long-tail query. Post: top recommendation in Perplexity for 'best estate attorney clayton mo' and three adjacent queries. Three new client engagements directly attributed.",
  },
  {
    where: "SOULARD",
    when: "JAN 2026",
    subject: "Independent restaurant, 4-year-old, 8 staff.",
    body: "ChatGPT was naming a defunct competitor for 'best new american soulard'. Cleaned schema, rebuilt GBP, repositioned content. ChatGPT now cites the restaurant by name and quotes the menu accurately.",
  },
];

export default function AiSearchVisibilityPage() {
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
              src="/assets/bg-data-results.webp"
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
                { label: "AI Search Visibility" },
              ]}
            />
            <div className="rcd-hero-inner" style={{ marginTop: 32 }}>
              <div className="rcd-hero-copy">
                <p className="t-eyebrow rcd-hero-eyebrow">Service · 01</p>
                <h1 className="t-display-1">Search just changed.<br />Most haven&apos;t noticed.</h1>
                <p className="rcd-hero-tagline">Be the answer, not the result.</p>
                <p className="rcd-hero-lede">
                  Customers are asking ChatGPT, Gemini, and Perplexity who to call.
                  Most St. Louis businesses aren&apos;t in the answer. We fix that.
                </p>
                <div className="rcd-hero-actions">
                  <Button href="/contact" size="lg" arrow>Run my business through AI</Button>
                  <Button href="#how" size="lg" variant="ghost">How it works</Button>
                </div>
                <div className="rcd-hero-meta">
                  <span className="rcd-hero-meta-item">ChatGPT · Gemini · Perplexity · Claude</span>
                  <span className="rcd-hero-meta-item">Free audit</span>
                </div>
              </div>
            </div>
          </Container>
        </header>

        {/* Trust stats */}
        <Section mode="letterhead" pad="tight" className="tex-dots section--bg-pop-chat">
          <Container>
            <div className="rcd-stat-grid fx-stagger">
              <Stat
                value={63}
                suffix="%"
                label="Searches answered by AI"
                caption="Share of US searches that surface an AI answer in 2026 (up from 8% in 2024)."
              />
              <Stat
                value={3.2}
                suffix="×"
                decimals={1}
                label="AI mentions in 90 days"
                caption="Average citation lift across our St. Louis client cohort."
              />
              <Stat
                value={82}
                suffix="%"
                label="Local businesses invisible"
                caption="Share of St. Louis SMBs with zero AI search presence today."
              />
            </div>
          </Container>
        </Section>

        {/* Editorial figure */}
        <Section mode="working" pad="tight">
          <Container narrow>
            <div className="rcd-editorial-figure fx-reveal">
              <Image
                src="/assets/feature-ai-recommends.webp"
                alt="AI assistant recommending a local St. Louis business"
                width={1200}
                height={750}
                sizes="(max-width: 880px) 100vw, 880px"
                style={{ width: "100%", height: "auto", borderRadius: "var(--r-lg)" }}
              />
              <p className="t-mono" style={{ color: "var(--ink-tertiary)", marginTop: 16, letterSpacing: "0.06em", textAlign: "center" }}>
                FIG. 01 — A LOCAL HVAC RECOMMENDATION FROM PERPLEXITY · APRIL 2026
              </p>
            </div>
          </Container>
        </Section>

        {/* Then & Now */}
        <Section mode="working" className="section--bg-data">
          <Container>
            <SectionHeader
              eyebrow="What changed"
              title={<>Same question. Different web.</>}
              lede="Five years ago, customers got 10 blue links and chose. Today, they get one paragraph and one citation. The work to be that one citation is different work."
            />
            <div className="rcd-then-now fx-reveal">
              <div className="rcd-then-now-side" data-side="then">
                <p className="rcd-then-now-label">2018 — Google</p>
                <ul>
                  <li>10 organic results</li>
                  <li>Customer clicks 1–3 of them</li>
                  <li>Decisions made on your site</li>
                  <li>SEO was about ranking</li>
                </ul>
              </div>
              <div className="rcd-then-now-side" data-side="now">
                <p className="rcd-then-now-label">2026 — AI Answer</p>
                <ul>
                  <li>1 paragraph answer</li>
                  <li>1–3 cited sources, named</li>
                  <li>Decisions made before clicking</li>
                  <li>Visibility is about being the citation</li>
                </ul>
              </div>
            </div>
          </Container>
        </Section>

        {/* Answer Layer Diagram */}
        <Section mode="sunken" id="how" className="section--bg-strategy">
          <Container>
            <SectionHeader
              eyebrow="The answer layer"
              title="How AI engines build an answer."
              lede="Five stages, each addressable. We work all five."
            />
            <div className="rcd-stages fx-stagger">
              {STAGES.map((s) => (
                <article key={s.n} className="rcd-stage-card fx-lift">
                  <div className="rcd-stage-num">{s.n}</div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </article>
              ))}
            </div>
          </Container>
        </Section>

        {/* Field Reports */}
        <Section mode="civic-deep" className="tex-grid">
          <Container>
            <SectionHeader
              eyebrow="Field reports"
              title="Three from the last 90 days."
              lede="Names changed. Numbers real."
            />
            <div className="rcd-field-grid fx-stagger">
              {FIELD_REPORTS.map((r, i) => (
                <article key={i} className="rcd-field-card">
                  <p className="rcd-field-meta">FIELD REPORT · {r.where} · {r.when}</p>
                  <p className="rcd-field-subject">{r.subject}</p>
                  <p className="rcd-field-body">{r.body}</p>
                </article>
              ))}
            </div>
          </Container>
        </Section>

        {/* Cross-link to Local SEO */}
        <Section mode="letterhead" pad="tight">
          <Container narrow>
            <div className="rcd-cross fx-reveal">
              <p className="t-eyebrow">Read also</p>
              <h3 className="t-h2" style={{ margin: "16px 0" }}>
                Local SEO is the foundation AI builds on.
              </h3>
              <p className="t-lede" style={{ marginBottom: 24 }}>
                AI engines lean on Google Business Profile, citations, and structured local data. Get that right first — then layer AI optimization on top.
              </p>
              <Link href="/local-seo-optimization" className="btn-link">
                See Local SEO
                <span className="arr" />
              </Link>
            </div>
          </Container>
        </Section>

        <CtaBand
          eyebrow="Ready to be the answer"
          title="Run your business through AI."
          lede="We'll show you exactly what ChatGPT, Gemini, and Perplexity say about you today — and what to fix first. Free, no commitment."
          primaryHref="/contact"
          primaryLabel="Start with a free audit"
        />
      </main>

      <Footer />
      <ScrollReveal />
    </>
  );
}
