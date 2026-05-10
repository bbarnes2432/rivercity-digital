import type { Metadata } from "next";
import Image from "next/image";
import Nav from "../_components/Nav";
import Footer from "../_components/Footer";
import Section from "../_components/Section";
import Container from "../_components/Container";
import SectionHeader from "../_components/SectionHeader";
import Button from "../_components/Button";
import CtaBand from "../_components/CtaBand";
import Breadcrumbs from "../_components/Breadcrumbs";
import ScrollReveal from "../_components/ScrollReveal";
import MissouriMark from "../_components/MissouriMark";
import Ticker from "../_components/Ticker";
import "../styles/service-areas.css";

export const metadata: Metadata = {
  title: "Service Areas — Every Block. Every Neighborhood.",
  description:
    "We work with businesses across the greater St. Louis metro — Soulard, Clayton, Webster Groves, Kirkwood, Chesterfield, O'Fallon, St. Charles, and beyond.",
  alternates: { canonical: "/service-areas" },
  openGraph: {
    title: "Service Areas — River City Digital",
    description: "Every block. Every neighborhood. A St. Louis agency that knows St. Louis.",
    url: "/service-areas",
  },
};

const PLACES_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    "St. Louis", "Clayton", "Chesterfield", "O'Fallon",
    "St. Charles", "Kirkwood", "Webster Groves", "Ballwin",
    "Soulard", "The Hill", "Lafayette Square", "Tower Grove",
    "Maplewood", "Creve Coeur", "Wentzville", "Belleville",
    "Edwardsville",
  ].map((name, i) => ({
    "@type": "Place",
    position: i + 1,
    name,
    address: {
      "@type": "PostalAddress",
      addressRegion: name === "Belleville" || name === "Edwardsville" ? "IL" : "MO",
      addressLocality: name,
      addressCountry: "US",
    },
  })),
};

type Area = {
  id: string;
  name: string;
  blurb: string;
  vibe: string;
  topQueries: string[];
  region: "city" | "south" | "west" | "north" | "stcharles" | "il";
};

const AREAS: Area[] = [
  {
    id: "soulard",
    name: "Soulard",
    blurb: "Brick warehouses, the farmers market, restaurants packed at 9pm.",
    vibe: "Friday evenings, search peaks for restaurants and patios.",
    topQueries: ["restaurants near soulard market", "patio open soulard", "live music soulard"],
    region: "city",
  },
  {
    id: "the-hill",
    name: "The Hill",
    blurb: "Italian flags on porches, family-run delis, the same six blocks for a hundred years.",
    vibe: "Lunch and dinner — Italian categories dominate.",
    topQueries: ["pasta delivery the hill", "italian deli st louis", "best italian the hill"],
    region: "city",
  },
  {
    id: "tower-grove",
    name: "Tower Grove",
    blurb: "Boutiques on Grand, the park on weekends, third-wave coffee.",
    vibe: "Saturday mornings — coffee, brunch, vintage retail.",
    topQueries: ["coffee tower grove", "vintage shops st louis", "brunch tower grove"],
    region: "city",
  },
  {
    id: "lafayette-square",
    name: "Lafayette Square",
    blurb: "Painted ladies, the park, weddings every Saturday in summer.",
    vibe: "Event-driven — venues, photographers, caterers.",
    topQueries: ["wedding venue lafayette square", "event photography st louis"],
    region: "city",
  },
  {
    id: "clayton",
    name: "Clayton",
    blurb: "Mid-century professional buildings, the courthouse, white-collar lunch hour.",
    vibe: "Professional services dominate — law, finance, dentistry.",
    topQueries: ["estate attorney clayton mo", "dentist near clayton", "financial advisor clayton"],
    region: "west",
  },
  {
    id: "kirkwood",
    name: "Kirkwood",
    blurb: "The train station, downtown shops, family-owned for two generations.",
    vibe: "Local-business density. Word-of-mouth still matters here.",
    topQueries: ["plumber kirkwood mo", "pediatrician kirkwood", "kirkwood dry cleaner"],
    region: "south",
  },
  {
    id: "webster-groves",
    name: "Webster Groves",
    blurb: "Craftsman porches, Big Bend, the high school on Friday nights.",
    vibe: "Heavy local-search volume — home services, schools, dining.",
    topQueries: ["roofer webster groves", "tutor webster groves", "best dinner webster groves"],
    region: "south",
  },
  {
    id: "maplewood",
    name: "Maplewood",
    blurb: "Manchester Road, walkable downtown, the kind of place that feels like a small town in a big metro.",
    vibe: "Independent retail-heavy. Saturdays bring searches by the hour.",
    topQueries: ["shops manchester maplewood", "best brunch maplewood", "maplewood mo coffee"],
    region: "south",
  },
  {
    id: "chesterfield",
    name: "Chesterfield",
    blurb: "The valley, the mall, the long commercial corridors that go for miles.",
    vibe: "Suburban — service businesses, professional, fitness, retail.",
    topQueries: ["dentist chesterfield mo", "gym near chesterfield valley", "salon chesterfield"],
    region: "west",
  },
  {
    id: "ballwin",
    name: "Ballwin & Ellisville",
    blurb: "Subdivision-dense, schools strong, Manchester Road through the middle.",
    vibe: "Family services — pediatricians, swim, music lessons, summer camps.",
    topQueries: ["pediatric dentist ballwin", "swim lessons ballwin", "lawn care ellisville"],
    region: "west",
  },
  {
    id: "creve-coeur",
    name: "Creve Coeur",
    blurb: "Office parks, hospitals, the lake on summer evenings.",
    vibe: "Medical and professional services, plus office-adjacent retail.",
    topQueries: ["physical therapy creve coeur", "best lunch creve coeur", "creve coeur dentist"],
    region: "west",
  },
  {
    id: "ofallon",
    name: "O'Fallon",
    blurb: "Fast-growing, family-heavy, big-box anchors with local shops between.",
    vibe: "Home services boom — HVAC, roofing, landscaping, contractors.",
    topQueries: ["hvac ofallon mo", "roofer ofallon", "ofallon contractor"],
    region: "stcharles",
  },
  {
    id: "st-charles",
    name: "St. Charles",
    blurb: "Historic Main Street, brick sidewalks, the Missouri River at the end of the street.",
    vibe: "Tourism + locals — restaurants, retail, professional services.",
    topQueries: ["main street st charles", "wedding venue st charles", "dentist st charles mo"],
    region: "stcharles",
  },
  {
    id: "wentzville",
    name: "Wentzville",
    blurb: "GM plant, growing fast, lots of newer subdivisions.",
    vibe: "Home services + local trades. Growing competitive set.",
    topQueries: ["wentzville hvac", "wentzville landscaping", "wentzville plumber"],
    region: "stcharles",
  },
  {
    id: "florissant",
    name: "Florissant",
    blurb: "Old downtown, suburban scale, generations of family businesses.",
    vibe: "Mix of professional services and home services.",
    topQueries: ["florissant dentist", "florissant insurance", "florissant auto repair"],
    region: "north",
  },
  {
    id: "belleville",
    name: "Belleville, IL",
    blurb: "Across the river, the metro east, square downtown.",
    vibe: "Independent retail and professional services.",
    topQueries: ["belleville il restaurant", "belleville dentist", "belleville auto repair"],
    region: "il",
  },
  {
    id: "edwardsville",
    name: "Edwardsville, IL",
    blurb: "SIUE, downtown SaintLouis Street, growing professional class.",
    vibe: "Professional, medical, education-adjacent.",
    topQueries: ["edwardsville orthodontist", "edwardsville coffee", "edwardsville lunch"],
    region: "il",
  },
];

const REGIONS: Record<string, string> = {
  city: "St. Louis City",
  south: "South County",
  west: "West County",
  north: "North County",
  stcharles: "St. Charles County",
  il: "Metro East (Illinois)",
};


export default function ServiceAreasPage() {
  const grouped = AREAS.reduce<Record<string, Area[]>>((acc, a) => {
    if (!acc[a.region]) acc[a.region] = [];
    acc[a.region].push(a);
    return acc;
  }, {});

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PLACES_LD) }}
      />
      <Nav overlayMode="light-on-dark" />

      <main id="main">
        {/* Hero — pop-art Arch as the dark-overlaid background */}
        <header className="rcd-hero fx-parallax-hero" data-mode="civic-deep">
          <div className="rcd-hero-bg">
            <Image
              src="/assets/hero-pop-arch.webp"
              alt="A bold pop-art illustration of the St. Louis skyline at sunset"
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
                { label: "Service Areas" },
              ]}
            />
            <div className="rcd-hero-inner" style={{ marginTop: 32 }}>
              <div className="rcd-hero-copy">
                <p className="t-eyebrow rcd-hero-eyebrow fx-blur-in">Service Areas</p>
                <h1 className="t-display-1 fx-blur-in">
                  Every block.<br />Every neighborhood.
                </h1>
                <p className="rcd-hero-tagline fx-blur-in">
                  A St. Louis agency that actually knows St. Louis.
                </p>
                <p className="rcd-hero-lede fx-blur-in">
                  We work with businesses across the greater St. Louis metro — Missouri and Illinois.
                  We live here. We eat at your competitors&apos; restaurants. We know what I-270 to Manchester
                  feels like at 5 p.m.
                </p>
                <div className="rcd-hero-actions fx-blur-in">
                  <Button href="/contact" size="lg" arrow className="fx-shine">Get a free audit</Button>
                </div>
              </div>
            </div>
          </Container>
        </header>

        {/* News-crawl ticker — every neighborhood we work in, scrolling */}
        <Ticker
          label="Filed in"
          items={AREAS.map((a) => a.name)}
          tone="light"
        />

        {/* Quick city jump */}
        <Section mode="letterhead" pad="tight">
          <Container>
            <div className="rcd-areas-jump fx-reveal">
              <p className="t-label" style={{ color: "var(--ink-tertiary)", marginBottom: 16 }}>Jump to</p>
              <div className="rcd-pills">
                {AREAS.slice(0, 12).map((a) => (
                  <a key={a.id} href={`#${a.id}`}>{a.name}</a>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* The grouped editorial cards */}
        {Object.entries(grouped).map(([region, areas]) => (
          <Section
            key={region}
            mode={region === "city" ? "working" : region === "il" ? "civic" : "letterhead"}
            className={
              region === "city" ? "section--bg-soulard"
              : region === "south" ? "section--bg-the-hill"
              : region === "west" ? "section--bg-clayton"
              : region === "stcharles" ? "section--bg-river"
              : ""
            }
          >
            <Container>
              <p className="t-eyebrow" style={{ marginBottom: 16 }}>
                {REGIONS[region]}
              </p>
              <h2 className="t-h2" style={{ marginBottom: 48, maxWidth: 720 }}>
                {region === "city" && "The neighborhoods that built the city."}
                {region === "south" && "South County — where word of mouth still matters."}
                {region === "west" && "West County — professional and growing."}
                {region === "stcharles" && "St. Charles County — fast-moving and family-heavy."}
                {region === "north" && "North County — old downtowns, generations of business."}
                {region === "il" && "Metro East — across the river."}
              </h2>
              <div className="rcd-areas-grid fx-stagger">
                {areas.map((a) => (
                  <article key={a.id} id={a.id} className="rcd-area-card">
                    <header className="rcd-area-card-head">
                      <h3>{a.name}</h3>
                      <span className="rcd-area-pin">
                        <MissouriMark size={32} showPin outlineColor="currentColor" />
                      </span>
                    </header>
                    <p className="rcd-area-blurb">{a.blurb}</p>
                    <p className="rcd-area-vibe">{a.vibe}</p>
                    <div className="rcd-area-queries">
                      <p className="t-mono" style={{ marginBottom: 6, opacity: 0.6 }}>TOP TRENDING SEARCHES</p>
                      <ul>
                        {a.topQueries.map((q) => (
                          <li key={q}>&ldquo;{q}&rdquo;</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </Container>
          </Section>
        ))}

        <CtaBand
          eyebrow="Working in your block"
          title="Let&apos;s talk about your neighborhood."
          lede="If your zip code isn't here yet, ask anyway. We say no when we should — but most of the metro is in scope."
          primaryHref="/contact"
          primaryLabel="Talk to a local"
        />
      </main>

      <Footer />
      <ScrollReveal />
    </>
  );
}
