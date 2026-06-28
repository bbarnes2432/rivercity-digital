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
import HookVideo from "../_components/HookVideo";
import {
  Building2,
  Code2,
  MapPin,
  ListChecks,
  Star,
  LineChart,
} from "lucide-react";
import "../styles/inner.css";

export const metadata: Metadata = {
  title: "Local SEO for St. Louis — Page 1 in Your Zip Code",
  description:
    "Local SEO for St. Louis businesses. Map Pack rankings, Google Business Profile optimization, citation building, review strategy. Free audit.",
  alternates: { canonical: "/local-seo-optimization" },
  openGraph: {
    title: "Local SEO — River City Digital",
    description: "Page 1 in your zip code. The Map Pack and the first three pins customers actually click.",
    url: "/local-seo-optimization",
  },
};

const SERVICE_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Local SEO Optimization",
  serviceType: "Local search engine optimization",
  provider: { "@type": "Organization", name: "River City Digital Co." },
  areaServed: { "@type": "City", name: "St. Louis" },
};

const TACTICS = [
  { t: "Google Business Profile", d: "Rebuilt as a primary citation source. Posts, photos, services, products, FAQ — the whole profile working as your second homepage.", Icon: Building2 },
  { t: "On-page Local SEO", d: "Schema, NAP consistency, location pages, city-and-service combinations that match how St. Louis people actually search.", Icon: Code2 },
  { t: "Map Pack rankings", d: "The 3-pin pack at the top of local results — the difference between a steady call volume and silence. We work it deliberately.", Icon: MapPin },
  { t: "Citation building", d: "Consistent NAP across the directories Google weights. Quality over volume — we'd rather have 30 right than 300 wrong.", Icon: ListChecks },
  { t: "Review strategy", d: "A real review request flow with templates, cadence, and response guidelines. Reviews compound with everything else.", Icon: Star },
  { t: "Reporting", d: "Monthly performance reports written like editorial — what moved, what didn't, what we're trying next. No dashboard ugliness.", Icon: LineChart },
];

const TIMELINE = [
  { n: "01", t: "Audit", w: "Week 1", d: "Where you rank today, what's broken, what your three closest competitors are doing better. Plain English." },
  { n: "02", t: "Cleanup", w: "Weeks 2–3", d: "GBP rebuild, citation fixes, schema, on-page SEO. The structural work that has to happen first." },
  { n: "03", t: "Content", w: "Weeks 4–8", d: "Service pages, location pages, blog cadence. Everything aimed at the queries your customers actually run." },
  { n: "04", t: "Compound", w: "Months 3+", d: "Rankings climb, reviews accumulate, the Map Pack tilts. We report and adjust monthly." },
];

export default function LocalSeoPage() {
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
              src="/assets/bg-st-louis-street.webp"
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
                { label: "Local SEO" },
              ]}
            />
            <div className="rcd-hero-inner" style={{ marginTop: 32 }}>
              <div className="rcd-hero-copy">
                <p className="t-eyebrow rcd-hero-eyebrow">Service · 02</p>
                <h1 className="t-display-1">Own the block.</h1>
                <p className="rcd-hero-tagline">Page 1 in your zip code.</p>
                <p className="rcd-hero-lede">
                  We get St. Louis businesses ranking on Google Maps and the local Map Pack —
                  the first three pins customers actually click.
                </p>
                <div className="rcd-hero-actions">
                  <Button href="/contact" size="lg" arrow>Check where I rank</Button>
                  <Button href="#how" size="lg" variant="ghost">How it works</Button>
                </div>
              </div>
            </div>
          </Container>
        </header>

        {/* Stats */}
        <Section mode="letterhead" pad="tight" className="tex-dots section--bg-pop-map">
          <Container>
            <div className="rcd-stat-grid fx-stagger">
              <Stat value={46} suffix="%" label="Local intent" caption="Share of Google searches with local intent. Most call within an hour." />
              <Stat value={76} suffix="%" label="Visit same day" caption="Of mobile-local-searchers visit a related business within 24 hours." />
              <Stat value={3} prefix="Top " label="Map Pack" caption="Where 80% of clicks land. Anything below the pack is rounding error." />
            </div>
          </Container>
        </Section>

        {/* Video */}
        <Section mode="working">
          <Container>
            <SectionHeader
              eyebrow="Watch · 1 Min"
              title="See how we get you found."
              lede="A quick look at how we get St. Louis businesses ranking on Google Maps and the local Map Pack."
            />
            <div className="rcd-hook-video-wrap fx-reveal">
              <HookVideo
                src="/assets/local-seo-video.mp4"
                poster="/assets/local-seo-poster.jpg"
                ctaLabel="See how we get you ranked"
              />
            </div>
          </Container>
        </Section>

        {/* What we work */}
        <Section mode="working" id="how" className="section--bg-street">
          <Container>
            <SectionHeader
              eyebrow="What we work"
              title="Local SEO, end to end."
              lede="Six things, all running in concert. Skip one and the others drag."
            />
            <div className="rcd-list-grid fx-stagger">
              {TACTICS.map(({ t, d, Icon }) => (
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
        <Section mode="sunken" className="section--bg-pins">
          <Container>
            <SectionHeader
              eyebrow="The compound"
              title="What 90 days looks like."
              lede="Local SEO compounds. Quick wins in week 2; the real lift hits month three."
            />
            <div className="rcd-stages fx-stagger" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
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

        {/* Without/With */}
        <Section mode="working">
          <Container>
            <SectionHeader
              eyebrow="The difference"
              title="Without us. With us."
            />
            <div className="rcd-then-now fx-reveal">
              <div className="rcd-then-now-side" data-side="then">
                <p className="rcd-then-now-label">Most local sites</p>
                <ul>
                  <li>Page 4 of Google for the things that matter</li>
                  <li>Map Pack appearance: never</li>
                  <li>NAP inconsistencies across 20+ directories</li>
                  <li>GBP filled out 40%, posts neglected</li>
                  <li>Reviews trickle in randomly</li>
                </ul>
              </div>
              <div className="rcd-then-now-side" data-side="now">
                <p className="rcd-then-now-label">With River City Digital</p>
                <ul>
                  <li>Page 1 for primary local terms within 90 days</li>
                  <li>Top 3 in the Map Pack for category</li>
                  <li>Clean NAP, monitored monthly</li>
                  <li>GBP run as a primary asset</li>
                  <li>Real review cadence — 4–8 new ones a month</li>
                </ul>
              </div>
            </div>
          </Container>
        </Section>

        {/* Cross-link to AI */}
        <Section mode="letterhead" pad="tight">
          <Container narrow>
            <div className="rcd-cross fx-reveal">
              <p className="t-eyebrow">Read also</p>
              <h3 className="t-h2" style={{ margin: "16px 0" }}>
                After we put you on the map, we put you in the answer.
              </h3>
              <p className="t-lede" style={{ marginBottom: 24 }}>
                Local SEO is the foundation. AI search visibility is the layer above it. If your customers are asking ChatGPT and Perplexity, they should hear your name.
              </p>
              <Link href="/ai-search-visibility" className="btn-link">
                See AI Search Visibility
                <span className="arr" />
              </Link>
            </div>
          </Container>
        </Section>

        <CtaBand
          eyebrow="Ready to climb"
          title="Check where you rank — free."
          lede="We'll show your current rankings, your top 3 competitors' rankings, and the gap. No commitment."
          primaryHref="/contact"
          primaryLabel="Check where I rank"
        />
      </main>

      <Footer />
      <ScrollReveal />
    </>
  );
}
