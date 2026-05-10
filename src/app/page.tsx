import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./styles/home.css";
import Nav from "./_components/Nav";
import Footer from "./_components/Footer";
import Section from "./_components/Section";
import Container from "./_components/Container";
import SectionHeader from "./_components/SectionHeader";
import Button from "./_components/Button";
import CtaBand from "./_components/CtaBand";
import Faq from "./_components/Faq";
import Stat from "./_components/Stat";
import ContactForm from "./_components/contact-form";
import Testimonials from "./_components/testimonials";
import ScrollReveal from "./_components/ScrollReveal";
import MissouriMark from "./_components/MissouriMark";
import MobileStickyCta from "./_components/MobileStickyCta";
import HeroDateline from "./_components/HeroDateline";
import PhotoBand from "./_components/PhotoBand";
import Folio from "./_components/Folio";

export const metadata: Metadata = {
  title: "St. Louis Digital Marketing Studio — Local Roots. Built to Be Found.",
  description:
    "We build websites and search visibility for St. Louis businesses. Custom work, made here, by the people who answer your emails.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "River City Digital Co. — Local Roots. Built to Be Found.",
    description:
      "St. Louis digital marketing studio. Custom websites, local SEO, AI search visibility.",
    url: "/",
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "What makes River City Digital different from other St. Louis marketing agencies?",
    a: "Every project is personally handled — start to finish — by a local St. Louis team. There's no rotating account manager, no support ticket queue. You work directly with the people doing the work. Every website and campaign is custom-built for the St. Louis market.",
  },
  {
    q: "What is AI Search Visibility, and why does my business need it?",
    a: "AI Search Visibility is the practice of optimizing your business so AI tools like ChatGPT, Google Gemini, Perplexity, and Claude recommend you when potential customers ask for local services. Increasingly, people skip Google entirely and ask AI directly. If your business isn't structured for AI to find and recommend, you're invisible to a fast-growing slice of search traffic.",
  },
  {
    q: "How is AI Search different from regular Local SEO?",
    a: "Local SEO covers everything that helps you rank in Google's local results — Map Pack, organic search, Google Business Profile, citations, reviews. AI Search Visibility goes further by structuring your content, schema, and authority signals so AI models cite your business when generating answers. Both work together. We do both.",
  },
  {
    q: "How long does it take to build a custom website?",
    a: "Most websites launch in 2 to 3 weeks from project kickoff, depending on complexity, content readiness, and revision rounds. Larger projects with custom functionality, e-commerce, or extensive content can take longer. We give you a realistic timeline upfront and update you at every step.",
  },
  {
    q: "Who will I be working with on my project?",
    a: "You'll work directly with our St. Louis team — one consistent point of contact from your first conversation through launch and beyond. No rotating account managers, no support tickets, no being passed around a national agency.",
  },
  {
    q: "Do you require a contract?",
    a: "Yes. Ongoing services like Local SEO and Digital Marketing are structured as 6 to 12 month engagements. SEO and paid advertising require time to compound results, and short-term commitments rarely produce the outcomes business owners are looking for. We're transparent about timelines and report on performance throughout.",
  },
  {
    q: "What areas around St. Louis do you serve?",
    a: "We work with businesses across the greater St. Louis metro — both Missouri and Illinois. Service area includes St. Louis City, Clayton, Ladue, Ballwin, Chesterfield, Creve Coeur, Town and Country, Kirkwood, Webster Groves, Florissant, O'Fallon, St. Charles, St. Peters, Wentzville, Belleville, and Edwardsville.",
  },
  {
    q: "What's included in the free audit?",
    a: "The audit covers your current Google rankings for key local search terms, Map Pack visibility, AI search visibility (whether ChatGPT, Gemini, and Perplexity recommend you), website performance and SEO health, top three competitor comparison, and a clear list of priorities to fix first.",
  },
];

const FAQ_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((it) => ({
    "@type": "Question",
    name: it.q,
    acceptedAnswer: { "@type": "Answer", text: it.a },
  })),
};

const SERVICES = [
  {
    href: "/ai-search-visibility",
    eyebrow: "01 / Service",
    title: "AI Search Visibility",
    desc: "Be the answer ChatGPT, Gemini, and Perplexity give when customers ask who to call in St. Louis.",
    img: "/assets/card-ai-search.webp",
    alt: "Phone showing an AI chatbot recommending a St. Louis business",
  },
  {
    href: "/local-seo-optimization",
    eyebrow: "02 / Service",
    title: "Local SEO",
    desc: "Page 1 of Google, the Map Pack, and the first three pins customers actually click.",
    img: "/assets/card-local-seo.webp",
    alt: "3D map pin floating over a miniature St. Louis skyline",
  },
  {
    href: "/website-design",
    eyebrow: "03 / Service",
    title: "Website Design",
    desc: "Custom-built sites for St. Louis businesses. No themes. No templates. No swap-the-logo.",
    img: "/assets/card-website-design.webp",
    alt: "MacBook screen showing a clean cream and navy website design",
  },
  {
    href: "/digital-marketing",
    eyebrow: "04 / Service",
    title: "Digital Marketing",
    desc: "Google Ads, Meta, social, and email — managed personally by the same St. Louis person who set them up.",
    img: "/assets/card-digital-marketing.webp",
    alt: "Stylized graphic showing channel mix for digital marketing",
  },
];

const PROCESS = [
  {
    n: "01",
    title: "Discovery",
    when: "Week 1",
    desc: "We sit down — coffee, real conversation. Goals, customers, constraints. We come back with the plan, not a slide deck.",
    img: "/assets/process-discovery.webp",
  },
  {
    n: "02",
    title: "Strategy",
    when: "Week 1",
    desc: "Wireframes, content outline, SEO plan, schema spec. You see exactly what we'll build before a single pixel ships.",
    img: "/assets/process-strategy.webp",
  },
  {
    n: "03",
    title: "Build",
    when: "Weeks 2–3",
    desc: "Custom design and development. Hand-coded, fast, and search-ready from the first wireframe — not retrofitted later.",
    img: "/assets/process-build-launch.webp",
  },
  {
    n: "04",
    title: "Grow",
    when: "Ongoing",
    desc: "We don't ship and disappear. Local SEO, AI visibility, ads, monthly reports — all from the same St. Louis person who built it.",
    img: "/assets/process-grow.webp",
  },
];

const SERVICE_AREA_PILLS = [
  "St. Louis", "Clayton", "Chesterfield", "Kirkwood", "Webster Groves",
  "Ballwin", "Creve Coeur", "St. Charles", "O'Fallon", "Wentzville",
];

const HERO_FILINGS = [
  { date: "Filed Apr 2026", text: "Webster Groves HVAC: page 4 → top of the Map Pack" },
  { date: "Filed Mar 2026", text: "ChatGPT now cites three of our St. Louis clients" },
  { date: "Filed Feb 2026", text: "Kirkwood boutique: 2.1× lead volume, 90 days" },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }}
      />

      <Nav overlayMode="light-on-dark" />

      <main id="main">
        {/* ============ HERO ============ */}
        <header className="rcd-hero fx-parallax-hero" data-mode="civic-deep">
          <div className="rcd-hero-bg">
            <Image
              src="/assets/hero-the-lou.webp"
              alt="St. Louis cityscape at dusk"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
          <div className="rcd-hero-grain" aria-hidden="true" />

          <Container>
            <div className="rcd-hero-inner">
              <div className="rcd-hero-copy">
                <p className="t-eyebrow rcd-hero-eyebrow fx-blur-in">Filed from St. Louis · 2026</p>
                <h1 className="t-display-1">
                  <span className="fx-mask-rise" style={{ display: "block" }}>Local Roots.</span>
                  <span
                    className="rcd-hero-italic fx-mask-rise"
                    style={{ display: "block", ["--reveal-delay" as string]: "180ms" }}
                  >
                    Built to be found.
                  </span>
                </h1>
                <p className="rcd-hero-tagline fx-blur-in">A St. Louis digital studio for local businesses.</p>
                <p className="rcd-hero-lede fx-blur-in">
                  We build websites and search visibility for St. Louis businesses.
                  Custom work, made here, by the people who answer your emails.
                </p>
                <div className="rcd-hero-actions fx-blur-in">
                  <Button href="#contact" size="lg" arrow className="fx-shine">Start with a free audit</Button>
                  <Button href="/work" size="lg" variant="ghost">Read the work</Button>
                </div>
                <div className="rcd-hero-meta">
                  <span className="rcd-hero-meta-item">5.0 Google Rating</span>
                  <span className="rcd-hero-meta-item">St. Louis based</span>
                  <span className="rcd-hero-meta-item">Built for AI search</span>
                </div>
                <HeroDateline filings={HERO_FILINGS} />
              </div>
            </div>
          </Container>
          <span className="rcd-hero-scroll-cue" aria-hidden="true">SCROLL</span>
        </header>

        {/* ============ TRUST + STATS ============ */}
        <Section mode="letterhead" pad="tight" id="trust" className="section--teal-tint tex-dots">
          <Container>
            <div className="rcd-stat-grid fx-stagger">
              <Stat
                value={87}
                suffix="%"
                label="AI visibility lift"
                caption="Average improvement in ChatGPT/Gemini/Perplexity recommendations within 90 days."
              />
              <Stat
                value={2.5}
                suffix=" wks"
                decimals={1}
                label="Typical launch"
                caption="Most custom builds go live in 2–3 weeks from kickoff."
              />
              <Stat
                value={5.0}
                suffix=" ★"
                decimals={1}
                label="Google rating"
                caption="From St. Louis business owners we've worked with directly."
              />
            </div>
          </Container>
        </Section>

        <div className="section-ornament" aria-hidden="true">
          <span className="section-ornament-mark" />
        </div>

        {/* ============ SERVICES ============ */}
        <Section mode="working" id="services" className="section--bg-pins tex-grid">
          <Container>
            <SectionHeader
              folio="01"
              folioTitle="Services"
              folioDate="What we do"
              eyebrow="What we do"
              title={<>Four services. One <span style={{ color: "var(--accent-hover)" }}>St. Louis</span> studio.</>}
              lede="From a single landing page to a full local-search and ads operation — everything personally handled, here."
            />
            <div className="rcd-svc-grid rcd-svc-grid--columns fx-stagger">
              {SERVICES.map((s, i) => (
                <Link key={s.href} href={s.href} className="rcd-svc-card fx-lift">
                  <div className="rcd-svc-card-num">
                    <span className="rcd-svc-card-num-glyph">{String(i + 1).padStart(2, "0")}</span>
                    <span className="rcd-svc-card-num-label">SERVICE</span>
                  </div>
                  <div className="rcd-svc-card-body">
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    <span className="rcd-svc-card-cta">
                      Learn more
                      <span className="arr" />
                    </span>
                  </div>
                  <div className="rcd-svc-card-mark" aria-hidden="true">
                    <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                      <path
                        d="M50 5 L50 30 M50 70 L50 95 M5 50 L30 50 M70 50 L95 50"
                        stroke="currentColor"
                        strokeWidth="0.6"
                        strokeLinecap="round"
                        opacity="0.4"
                      />
                      <circle cx="50" cy="50" r="14" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.4" />
                      <circle cx="50" cy="50" r="3" fill="currentColor" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>

        {/* ============ THE RECEIPT ============ */}
        <Section mode="letterhead" id="proof" className="section--bg-data">
          <Container>
            <SectionHeader
              folio="02"
              folioTitle="The Receipt"
              folioDate="Filed Mar 2026"
              eyebrow="The receipt"
              title={<>Page 4 to Page 1.<br />A St. Louis HVAC contractor, 90 days.</>}
              lede="Same query. Same business. Schema, citations, and a Google Business Profile rebuild — between."
            />
            <figure className="rcd-receipt-figure fx-blur-in">
              <div className="rcd-receipt-photo fx-zoom-wrap">
                <Image
                  src="/assets/proof-receipt-desk.webp"
                  alt="A printed Google Search Results page annotated in red pen — Map Pack circled, 'Page 4 (Before)' written next to a yellow-highlighted earlier ranking, '+ schema fix' on a yellow post-it"
                  width={2048}
                  height={1536}
                  sizes="(max-width: 880px) 100vw, 880px"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
              <figcaption className="rcd-receipt-caption">
                <span className="rcd-receipt-caption-mono">FILED FROM WEBSTER GROVES · MAR 2026</span>
                <span className="rcd-receipt-caption-text">
                  The same query, same business — page 4 of Google before, top of the Map Pack 90 days later.
                  Cited by ChatGPT and Perplexity for the category.
                </span>
              </figcaption>
            </figure>
          </Container>
        </Section>

        {/* ============ PROCESS ============ */}
        <Section mode="sunken" id="process" className="section--bg-strategy">
          <Container>
            <SectionHeader
              folio="03"
              folioTitle="Process"
              folioDate="How we work"
              eyebrow="How we work"
              title="Four weeks. One person. Real conversations."
              lede="No project managers, no ticket queues, no staged hand-offs. The same person who picks up the phone is the one writing your schema."
            />
            <div className="rcd-process fx-stagger">
              {PROCESS.map((p) => (
                <article key={p.n} className="rcd-process-card fx-lift">
                  <div className="rcd-process-card-img">
                    <Image
                      src={p.img}
                      alt={`${p.title} — step ${p.n} in our process`}
                      width={480}
                      height={320}
                      sizes="(max-width: 980px) 50vw, 25vw"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div className="rcd-process-card-body">
                    <div className="rcd-process-num">STEP {p.n}</div>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                    <div className="rcd-process-card-when">{p.when.toUpperCase()}</div>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </Section>

        {/* ============ PHOTO BAND ============ */}
        <Section mode="letterhead" pad="tight">
          <Container>
            <PhotoBand
              eyebrow="The studio"
              title={<>Made here.<br />By the people on the phone.</>}
              body="No rotating account managers. No support tickets. The same St. Louis person who picks up your call is the one writing your schema, shipping your site, and reading your Search Console reports."
              ctaHref="/about"
              ctaLabel="Meet the studio"
              imageSrc="/assets/bg-coffee-arch.webp"
              imageAlt="A coffee mug in front of a window framing the Gateway Arch at dawn"
            />
          </Container>
        </Section>

        {/* ============ TESTIMONIALS ============ */}
        <Section mode="civic-deep" id="testimonials" className="tex-arcs">
          <Container>
            <div className="rcd-testimonial-split">
              <aside className="rcd-testimonial-rail fx-reveal">
                <Folio number="04" title="Field Notes" date="From the owners" tone="dark" />
                <p className="rcd-testimonial-rail-eyebrow">Notes from the field</p>
                <h2 className="rcd-testimonial-rail-title">What St. Louis businesses say.</h2>
                <p className="rcd-testimonial-rail-lede">
                  Three notes from owners we&apos;ve worked with — same first phone call, same person who shipped the work.
                </p>
                <Link href="/notes" className="rcd-testimonial-rail-link">
                  Read more notes
                  <span aria-hidden="true">→</span>
                </Link>
              </aside>
              <div className="rcd-testimonial-stack">
                <Testimonials count={3} />
              </div>
            </div>
          </Container>
        </Section>

        {/* ============ WHERE WE WORK ============ */}
        <Section mode="letterhead" pad="tight" id="where" className="section--bg-pins">
          <Container>
            <div className="fx-reveal" style={{ textAlign: "center" }}>
              <p className="t-eyebrow" style={{ justifyContent: "center", marginBottom: 24 }}>Where we work</p>
              <h2 className="t-h2" style={{ margin: "0 0 12px", maxWidth: 720, marginInline: "auto" }}>
                Every block. Every neighborhood.
              </h2>
              <p className="t-lede" style={{ maxWidth: 640, marginInline: "auto", marginBottom: 36 }}>
                We work with businesses across the greater St. Louis metro — Missouri and Illinois.
              </p>
              <div className="rcd-pills" style={{ marginBottom: 32 }}>
                {SERVICE_AREA_PILLS.map((c) => (
                  <Link key={c} href="/service-areas">{c}</Link>
                ))}
              </div>
              <Link href="/service-areas" className="btn-link">
                See the full service area map
                <span className="arr" />
              </Link>
            </div>
          </Container>
        </Section>

        {/* ============ FAQ ============ */}
        <Section mode="working" id="faq" className="section--bg-faq">
          <Container>
            <SectionHeader
              folio="05"
              folioTitle="Questions"
              folioDate="Answered"
              eyebrow="FAQ"
              title="Questions, answered."
              lede="Mostly the things St. Louis owners ask in our first conversation."
            />
            <Faq items={FAQ_ITEMS} />
          </Container>
        </Section>

        {/* ============ CTA ============ */}
        <CtaBand
          eyebrow="Ready to start"
          title={<>Let&apos;s get your business found.</>}
          lede="Free audit. No commitment. Real St. Louis people on the other end."
          primaryHref="#contact"
          primaryLabel="Start with a free audit"
          secondaryHref="/service-areas"
          secondaryLabel="See where we work"
        />

        {/* ============ CONTACT ============ */}
        <Section mode="letterhead" id="contact" className="section--bg-coffee">
          <Container>
            <div className="rcd-contact-grid">
              <div>
                <p className="t-eyebrow" style={{ marginBottom: 16 }}>Contact</p>
                <h2 className="t-display-2" style={{ margin: "0 0 16px", maxWidth: 460 }}>
                  Tell us about it.
                </h2>
                <p className="t-lede" style={{ maxWidth: 460, marginBottom: 32 }}>
                  A few sentences is plenty. We come back with questions — usually same day.
                </p>
                <ul className="rcd-contact-list">
                  <li>
                    <span className="t-mono" style={{ color: "var(--ink-tertiary)" }}>EMAIL</span>
                    <a href="mailto:hello@rivercitydigitalco.com">hello@rivercitydigitalco.com</a>
                  </li>
                  <li>
                    <span className="t-mono" style={{ color: "var(--ink-tertiary)" }}>BASED IN</span>
                    <span>St. Louis, Missouri</span>
                  </li>
                  <li>
                    <span className="t-mono" style={{ color: "var(--ink-tertiary)" }}>RESPONSE</span>
                    <span>Within a day. Usually same day.</span>
                  </li>
                </ul>
                <div style={{ marginTop: 32, opacity: 0.5 }} className="fx-float-slow">
                  <MissouriMark size={64} showPin outlineColor="var(--ink-secondary)" />
                </div>
              </div>
              <div>
                <ContactForm />
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
      <ScrollReveal />
      <MobileStickyCta href="#contact" label="Start a free audit" hideNearId="contact" />
    </>
  );
}
