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
import HookVideo from "../_components/HookVideo";
import CallLink from "../_components/CallLink";
import InlineContactSection from "../_components/InlineContactSection";
import Testimonials from "../_components/testimonials";
import MobileStickyCta from "../_components/MobileStickyCta";
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

/* Recent examples. `domain` is the canonical live host — it renders in the
   browser chrome, so a staging URL here would read as unfinished work. */
const EXAMPLES = [
  {
    name: "Mend Health",
    domain: "mendhealthmo.com",
    href: "https://www.mendhealthmo.com/",
    meta: "Chiropractic · Kirkwood, MO",
    what:
      "Soft tissue and chiropractic care. Deep service architecture, service-area pages, and booking built into the site.",
    img: "/assets/portfolio-mend-health.webp",
    alt: "Mend Health homepage — a deep green hero reading Soft Tissue Expertise to Keep You Active",
  },
  {
    name: "The Wellness Collective",
    domain: "wellnesscollectivehub.com",
    href: "https://wellnesscollectivehub.com/",
    meta: "Wellness practice · St. Louis",
    what:
      "A brand-led build for a wellness and therapy practice — custom illustration, its own type system, and session booking on the page.",
    img: "/assets/portfolio-wellness-collective.webp",
    alt: "The Wellness Collective homepage — illustrated lavender field under the words Find your way home",
  },
  {
    name: "Always Clean",
    domain: "alwaysclean.biz",
    href: "https://alwaysclean.biz/",
    meta: "Commercial cleaning · Quad Cities",
    what:
      "Commercial janitorial and exterior cleaning under one roof. Service-area pages across the Quad Cities, with a quote request never more than a click away.",
    img: "/assets/portfolio-always-clean-davenport.webp",
    alt: "Always Clean homepage — a sunlit window wall behind the words The Quad Cities' one crew for inside and out",
  },
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

        {/* Video */}
        <Section mode="working">
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

        {/* Featured Website of the Month */}
        <Section mode="sunken">
          <Container>
            <div className="rcd-featured fx-reveal">
              <a
                href="https://thesaucefix.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rcd-featured-media"
                aria-label="Visit The Sauce Fix — opens in a new tab"
              >
                <Image
                  src="/assets/portfolio-sauce-fix.webp"
                  alt="The Sauce Fix — custom direct-to-consumer hot sauce storefront"
                  fill
                  sizes="(max-width: 900px) 100vw, 560px"
                  style={{ objectFit: "cover" }}
                />
                <span className="rcd-featured-badge">Featured Website of the Month</span>
              </a>
              <div className="rcd-featured-body">
                <p className="t-eyebrow">The Sauce Fix · Small-batch hot sauce</p>
                <h2 className="t-h2">A custom storefront built to sell out every drop.</h2>
                <p className="t-lede">
                  A direct-to-consumer site for a maker who grows, ferments, and bottles every
                  batch by hand — designed around the drop model, with clean in-stock / sold-out
                  states and email capture to keep fans warm between batches.
                </p>
                <ul className="list-check" style={{ margin: "20px 0 28px" }}>
                  <li>Custom DTC storefront — no bloated template</li>
                  <li>Built for limited drops and clean checkout</li>
                  <li>Email capture between batches</li>
                </ul>
                <div className="rcd-featured-actions">
                  <Button
                    href="https://thesaucefix.com"
                    size="lg"
                    arrow
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit the live site
                  </Button>
                  <Button href="/work/the-sauce-fix" size="lg" variant="ghost">
                    Read the case study
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Recent examples */}
        <Section mode="working">
          <Container>
            <SectionHeader
              eyebrow="Recent examples"
              title="Three we shipped lately."
              lede="Different industries, same approach. Every one of these is a live site — click any of them through."
            />
            <div className="rcd-examples fx-stagger">
              {EXAMPLES.map((ex) => (
                <figure key={ex.domain} className="rcd-example">
                  <a
                    href={ex.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rcd-example-frame fx-lift"
                    aria-label={`Visit ${ex.name} — opens in a new tab`}
                  >
                    <span className="rcd-example-chrome" aria-hidden="true">
                      <span className="rcd-example-dots">
                        <i />
                        <i />
                        <i />
                      </span>
                      <span className="rcd-example-url">{ex.domain}</span>
                    </span>
                    <span className="rcd-example-shot">
                      <Image
                        src={ex.img}
                        alt={ex.alt}
                        width={1440}
                        height={798}
                        loading="lazy"
                        sizes="(max-width: 900px) 92vw, 33vw"
                      />
                    </span>
                  </a>
                  <figcaption className="rcd-example-body">
                    <p className="rcd-example-meta">{ex.meta}</p>
                    <h3 className="rcd-example-name">{ex.name}</h3>
                    <p className="rcd-example-what">{ex.what}</p>
                  </figcaption>
                </figure>
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

      {/* Mobile shortcut back to the form once the hero has scrolled away.
          Hidden again near the form itself so it never covers its own target. */}
      <MobileStickyCta
        href="#start"
        label="Get my free website audit"
        hideNearId="start"
      />

      <Footer />
      <ScrollReveal />
    </>
  );
}
