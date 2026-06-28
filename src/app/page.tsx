import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./styles/home.css";
import Nav from "./_components/Nav";
import Footer from "./_components/Footer";
import Button from "./_components/Button";
import Faq from "./_components/Faq";
import ContactForm from "./_components/contact-form";
import Testimonials from "./_components/testimonials";
import ScrollReveal from "./_components/ScrollReveal";
import MobileStickyCta from "./_components/MobileStickyCta";
import HookVideo from "./_components/HookVideo";

export const metadata: Metadata = {
  title: "St. Louis Digital Marketing Studio — Local Roots. Built to Be Found.",
  description:
    "River City Digital — a St. Louis digital studio building modern, search-ready websites and AI search visibility for local businesses. Custom work, personally handled.",
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
    a: "Every project is personally handled — start to finish — by a local St. Louis team. There's no rotating account manager, no support ticket queue. You work directly with the people doing the work, building a real partnership instead of feeling like a number in a national agency's pipeline. Every website and campaign is custom-built for the St. Louis market.",
  },
  {
    q: "What is AI Search Visibility, and why does my business need it?",
    a: "AI Search Visibility is the practice of optimizing your business so AI tools like ChatGPT, Google Gemini, Perplexity, and Claude recommend you when potential customers ask for local services. Increasingly, people skip Google entirely and ask AI directly: \"Who's the best contractor in St. Louis?\" If your business isn't structured for AI to find and recommend, you're invisible to a fast-growing slice of search traffic. We make sure AI tools know who you are and put your name first.",
  },
  {
    q: "How is AI Search different from regular Local SEO?",
    a: "Local SEO covers everything that helps you rank in Google's local results — the Map Pack, organic search rankings below the map, Google Business Profile optimization, local directory citations, review management, and on-page SEO targeting local keywords. It's the full system that puts your business in front of customers searching on Google. AI Search Visibility goes further by structuring your content, schema, citations, and authority signals so AI models like ChatGPT, Gemini, and Perplexity cite your business when generating answers. Both work together: Local SEO captures Google traffic across the entire search results page, AI Visibility captures the new generation of search happening inside AI tools. We do both.",
  },
  {
    q: "How long does it take to build a custom website?",
    a: "Most websites launch in two to three weeks from project kickoff, depending on complexity, content readiness, and revision rounds. Larger projects with custom functionality, e-commerce, or extensive content can take longer. We give you a realistic timeline upfront and update you at every step — no surprises.",
  },
  {
    q: "Who will I be working with on my project?",
    a: "You'll work directly with our St. Louis team — one consistent point of contact from your first conversation through launch and beyond. No rotating account managers, no support tickets, no being passed around a national agency. We bring in trusted specialists when a project benefits from deeper expertise, but you always have one local person who knows your business, your goals, and your project inside and out.",
  },
  {
    q: "Do you require a contract?",
    a: "Yes. Ongoing services like Local SEO and Digital Marketing are structured as 6 to 12 month engagements. SEO and paid advertising require time to compound results, and short-term commitments rarely produce the outcomes business owners are looking for. We're transparent about timelines and report on performance throughout.",
  },
  {
    q: "What areas around St. Louis do you serve?",
    a: "We work with businesses across the greater St. Louis metro area, spanning both Missouri and Illinois. Our service area includes St. Louis City, Clayton, Ladue, Ballwin, Chesterfield, Creve Coeur, Town and Country, Kirkwood, Webster Groves, Florissant, O'Fallon, St. Charles, St. Peters, Wentzville, Lake St. Louis, Troy, Warrenton, Moscow Mills, Belleville, and Edwardsville. If your business serves the greater St. Louis region on either side of the river, we can help.",
  },
  {
    q: "How do I know if my current website is hurting my business?",
    a: "The most common signs: low Google rankings, high bounce rates, slow loading speeds, unprofessional design, no leads coming through the contact form, and zero presence in AI search results. We offer a free audit that shows you exactly where you stand on Google, in the Map Pack, on AI tools, and on technical performance — so you can make an informed decision before changing anything.",
  },
  {
    q: "What's included in the free audit?",
    a: "The free audit covers: your current Google rankings for key local search terms, Map Pack visibility, AI search visibility (whether ChatGPT, Gemini, and Perplexity recommend you), website performance and SEO health, top three competitor comparison, and a clear list of priorities to fix first. No pressure, no pitch — just a useful report you can act on.",
  },
  {
    q: "Do you work with businesses outside of St. Louis?",
    a: "Our focus is the St. Louis metro because local expertise matters — we know this market, these customers, and the specific platforms and directories that drive results here. If you're outside the region, we'll be straightforward about whether we're the right fit before taking on the project.",
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
    title: "AI Search Visibility",
    desc: "Get recommended by ChatGPT, Gemini, and Perplexity when customers ask AI who to call.",
    img: "/assets/card-ai-search.webp",
    alt: "AI search visibility for St. Louis businesses — phone showing AI chat recommendation",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </svg>
    ),
  },
  {
    href: "/local-seo-optimization",
    title: "Local SEO Optimization",
    desc: "Rank on Page 1 of Google and dominate the local Map Pack for searches that matter.",
    img: "/assets/card-local-seo.webp",
    alt: "Local SEO services for St. Louis — 3D map pin over miniature St. Louis skyline",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    href: "/website-design",
    title: "Website Design",
    desc: "Custom St. Louis websites built from scratch — no templates, optimized for Google and AI search.",
    img: "/assets/card-website-design.webp",
    alt: "Custom website design for St. Louis businesses — MacBook with navy and teal layout blocks",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="14" x="2" y="3" rx="2" />
        <line x1="8" x2="16" y1="21" y2="21" />
        <line x1="12" x2="12" y1="17" y2="21" />
      </svg>
    ),
  },
  {
    href: "/digital-marketing",
    title: "Digital Marketing",
    desc: "Google Ads, Meta Ads, Social Media, and Email — campaigns that actually convert.",
    img: "/assets/card-digital-marketing.webp",
    alt: "Digital marketing for St. Louis — phone showing social media ad with brand colors",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
];

const PROCESS = [
  {
    n: "01",
    title: "Discovery",
    desc: "We learn about your business, goals, and audience — no jargon, just a real conversation.",
    img: "/assets/process-discovery.webp",
    alt: "Discovery — two St. Louis professionals talking across a coffee table",
  },
  {
    n: "02",
    title: "Strategy",
    desc: "A custom plan covering design, SEO, and content tailored to your St. Louis market.",
    img: "/assets/process-strategy.webp",
    alt: "Strategy — overhead workspace with sticky notes labeled Discovery, Strategy, Build, Grow",
  },
  {
    n: "03",
    title: "Build & Launch",
    desc: "Your site or campaign comes to life — you see progress at every step.",
    img: "/assets/process-build-launch.webp",
    alt: "Build & launch — hands working on a MacBook with navy and teal layout shapes",
  },
  {
    n: "04",
    title: "Grow",
    desc: "We monitor performance and keep optimizing so your results keep climbing.",
    img: "/assets/process-grow.webp",
    alt: "Grow — happy customers walking into a modern St. Louis storefront at golden hour",
  },
];

const TRUST = [
  {
    label: "5.0 Google Rating",
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
      </svg>
    ),
  },
  {
    label: "St. Louis Based & Owned",
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: "Built for AI Search",
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </svg>
    ),
  },
  {
    label: "Free Audit Available",
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="m9 15 2 2 4-4" />
      </svg>
    ),
  },
];

const COMPARISON = [
  { row: "Communication", without: "Rotating account managers", with: "One dedicated point of contact, start to finish" },
  { row: "Work", without: "Distributed across departments", with: "Personally handled, every project" },
  { row: "Websites", without: "Template-based builds", with: "Custom from scratch, every time" },
  { row: "SEO", without: "Basic checkbox SEO", with: "Built for Google AND AI search" },
  { row: "Support", without: "Ticket queue and email", with: "Responsive, real-person help" },
  { row: "Feel", without: "Just another client", with: "A real business partnership" },
];

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const Check = () => (
  <svg className="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

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
        <header className="rcd-home-hero">
          <div className="rcd-home-hero-bg">
            <Image
              src="/assets/hero-the-lou.webp"
              alt="St. Louis skyline"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
          <div className="rcd-home-hero-scrim" aria-hidden="true" />
          <div className="rcd-home-hero-inner">
            <div className="rcd-home-hero-copy">
              <div className="rcd-home-hero-eyebrow fx-blur-in">
                <span className="rcd-home-hero-eyebrow-rule" />
                <span className="rcd-home-hero-eyebrow-text">St. Louis, Missouri</span>
              </div>
              <h1 className="fx-blur-in">River City<br />Digital</h1>
              <p className="rcd-home-hero-tagline fx-blur-in">Local Roots. Built to Be Found.</p>
              <p className="rcd-home-hero-lede fx-blur-in">
                We create modern, search-ready websites for local businesses — built for Google and the new era of AI search.
              </p>
              <p className="rcd-home-hero-sub fx-blur-in">
                St. Louis-based. Personally handled — clean, fast websites that get found.
              </p>
              <div className="rcd-home-hero-cta fx-blur-in">
                <Button href="#contact" size="lg" arrow className="fx-shine">Get a Free Audit</Button>
                <Button href="#services" size="lg" variant="ghost">See What We Do</Button>
              </div>
              <div className="rcd-home-hero-chips fx-blur-in">
                <span className="chip">
                  <svg className="star" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                  </svg>
                  5.0 Google Rating
                </span>
                <span className="chip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                  Local & Personal
                </span>
                <span className="chip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                  </svg>
                  Built for AI Search
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ============ TRUST BAR ============ */}
        <section className="rcd-trust-bar">
          <div className="rcd-trust-grid fx-stagger">
            {TRUST.map((t) => (
              <div key={t.label} className="rcd-trust-item fx-reveal">
                <span className="ico">{t.svg}</span>
                <span>{t.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ============ SERVICES ============ */}
        <section id="services" className="rcd-home-sec light tex-grain">
          <div className="container">
            <div className="rcd-home-sec-head fx-reveal">
              <div className="label">What We Do</div>
              <h2>Everything Your St. Louis Business Needs to <span className="accent">Get Found</span></h2>
              <p>Four services. One point of contact. Built around how customers actually search today — on Google, on maps, and now on AI tools like ChatGPT and Gemini.</p>
            </div>
            <div className="rcd-svc-grid rcd-svc-grid--image fx-stagger">
              {SERVICES.map((s) => (
                <Link key={s.href} href={s.href} className="rcd-svc-card">
                  <div className="rcd-svc-card-img">
                    <Image
                      src={s.img}
                      alt={s.alt}
                      width={640}
                      height={400}
                      sizes="(max-width: 540px) 100vw, (max-width: 1100px) 50vw, 25vw"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div className="rcd-svc-card-inner">
                    <span className="rcd-svc-card-ico">{s.icon}</span>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    <span className="rcd-svc-card-more">
                      Learn More
                      <Arrow />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============ STL BREAK ============ */}
        <section className="rcd-stl-break" aria-label="Built for St. Louis businesses">
          <div className="container">
            <div className="rcd-stl-break-inner fx-reveal">
              <span className="rcd-stl-break-label">
                <span className="dot" />
                Built for St. Louis
              </span>
              <h2>Built for Real St. Louis Businesses</h2>
              <p>
                We know this market because we live and work here. Every project is shaped by an understanding
                of how St. Louis customers actually search, shop, and choose.
              </p>
            </div>
          </div>
        </section>

        {/* ============ WHY RIVER CITY DIGITAL ============ */}
        <section className="rcd-home-sec dark bg-deeper">
          <div className="rcd-why-grid fx-reveal">
            <div className="rcd-why-copy fx-reveal">
              <div className="label">Why River City Digital</div>
              <h2>Real People.<br />Real Work.<br /><span className="accent">Real Results.</span></h2>
              <p>
                River City Digital isn&apos;t a faceless agency with a revolving door of account managers.
                It&apos;s a hands-on operation based right here in St. Louis — local, accessible, and
                personally invested in every project.
              </p>
              <p>
                <strong>Every project is handled personally — start to finish.</strong> One dedicated
                point of contact, no rotating account managers, no ticket queues. Just clean, modern
                websites and campaigns built for businesses that want to be found.
              </p>
            </div>
            <div className="rcd-why-stack fx-stagger">
              <div className="rcd-why-tile fx-reveal">
                <h4>Personally Handled</h4>
                <p>Every project from first call to launch — one point of contact, start to finish.</p>
              </div>
              <div className="rcd-why-tile fx-reveal">
                <h4>St. Louis Based</h4>
                <p>We know this city, these customers, and this market better than any national agency ever could.</p>
              </div>
              <div className="rcd-why-tile fx-reveal">
                <h4>Direct Communication</h4>
                <p>Real people, real conversations — no support tickets, no rotating account managers, no being passed around.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ VIDEO ============ */}
        <section className="rcd-home-sec light bg-white">
          <div className="container">
            <div className="rcd-home-sec-head fx-reveal">
              <div className="label">Watch · 1 Min</div>
              <h2>Why Choose <span className="accent">River City Digital</span></h2>
              <p>See why St. Louis businesses choose River City Digital Co. to get found on Google and recommended by AI.</p>
            </div>
            <div className="rcd-hook-video-wrap fx-reveal">
              <HookVideo
                src="/assets/why-river-city-digital.mp4"
                poster="/assets/why-river-city-digital-poster.jpg"
                ctaLabel="Learn all about why us here"
              />
            </div>
          </div>
        </section>

        {/* ============ STATS BAR ============ */}
        <section className="rcd-home-sec light tex-grain" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="rcd-stats-grid fx-stagger">
            <div className="rcd-stat-cell fx-reveal">
              <div className="num">87<small>%</small></div>
              <span className="rule" />
              <div className="lbl">AI Brand Visibility Score</div>
            </div>
            <div className="rcd-stat-cell fx-reveal">
              <div className="num">5.0<small>★</small></div>
              <span className="rule" />
              <div className="lbl">Google Rating</div>
            </div>
            <div className="rcd-stat-cell fx-reveal">
              <div className="num">2-3<small>wk</small></div>
              <span className="rule" />
              <div className="lbl">Average Site Launch Time</div>
            </div>
          </div>
        </section>

        {/* ============ COMPARISON ============ */}
        <section className="rcd-home-sec dark bg-deeper">
          <div className="container">
            <div className="rcd-home-sec-head fx-reveal">
              <div className="label">The Difference</div>
              <h2>River City Digital vs. <span className="accent">The Big Agencies</span></h2>
              <p>Most agencies make you feel like a ticket number. We don&apos;t work that way.</p>
            </div>
            <div className="rcd-cmp-wrap fx-reveal">
              <div className="rcd-cmp">
                <div className="rcd-cmp-row head">
                  <div className="rcd-cmp-cell" />
                  <div className="rcd-cmp-cell without">Big Agencies</div>
                  <div className="rcd-cmp-cell with">River City Digital</div>
                </div>
                {COMPARISON.map((c) => (
                  <div key={c.row} className="rcd-cmp-row">
                    <div className="rcd-cmp-cell label">{c.row}</div>
                    <div className="rcd-cmp-cell without">{c.without}</div>
                    <div className="rcd-cmp-cell with">
                      <Check />
                      <span>{c.with}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ PROCESS ============ */}
        <section className="rcd-home-sec light">
          <div className="container">
            <div className="rcd-home-sec-head fx-reveal">
              <div className="label">The Process</div>
              <h2>How <span className="accent">It Works</span></h2>
              <p>Four steps, one point of contact, no surprises.</p>
            </div>
            <div className="rcd-process fx-stagger">
              {PROCESS.map((p) => (
                <article key={p.n} className="rcd-process-card fx-reveal">
                  <div className="rcd-process-card-img">
                    <Image
                      src={p.img}
                      alt={p.alt}
                      width={480}
                      height={320}
                      sizes="(max-width: 1100px) 50vw, 25vw"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div className="rcd-process-card-body">
                    <div className="rcd-process-num">STEP {p.n}</div>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ TESTIMONIALS ============ */}
        <section id="testimonials" className="rcd-home-sec dark bg-deeper">
          <div className="container">
            <div className="rcd-home-sec-head fx-reveal">
              <div className="label">Testimonials</div>
              <h2>What St. Louis <span className="accent">Businesses Say</span></h2>
            </div>
            <div className="rcd-quote-grid-wrap fx-reveal">
              <Testimonials count={3} />
            </div>
            <aside className="rcd-next-success fx-reveal" aria-label="Be our next success story">
              <div className="rcd-next-success-img">
                <Image
                  src="/assets/portrait-happy-client.webp"
                  alt="Happy St. Louis business owner outside her storefront"
                  fill
                  sizes="(max-width: 880px) 100vw, 480px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div>
                <span className="rcd-next-success-eyebrow">
                  <span className="dot" />
                  New Client Spots Open
                </span>
                <h3>Want to Be Our Next<br />Success Story?</h3>
                <p>
                  We&apos;re working with our first wave of St. Louis businesses. Be one of them — start
                  with a free audit and see exactly where you stand on Google and AI search.
                </p>
                <Button href="#contact" size="lg" arrow className="fx-shine">Get Free Audit</Button>
              </div>
            </aside>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section id="faq" className="rcd-home-sec light tex-grain">
          <div className="container">
            <div className="rcd-home-sec-head fx-reveal">
              <div className="label">FAQ</div>
              <h2>Frequently Asked <span className="accent">Questions</span></h2>
              <p>Everything you need to know about working with River City Digital.</p>
            </div>
            <div className="rcd-home-faq-wrap fx-reveal">
              <Faq items={FAQ_ITEMS} />
            </div>
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className="rcd-home-cta">
          <div className="rcd-home-cta-inner fx-reveal">
            <h2>Ready to Grow Your<br /><span className="accent">St. Louis Business?</span></h2>
            <p className="lede">
              Get a free, no-obligation website and SEO audit. We&apos;ll show you exactly where you stand
              and how to get ahead of the competition.
            </p>
            <div className="rcd-home-cta-buttons">
              <Button href="#contact" size="lg" arrow className="fx-shine">Get Your Free Audit</Button>
              <Button href="mailto:hello@rivercitydigitalco.com" size="lg" variant="ghost">Email Us Directly</Button>
            </div>
            <span className="rcd-home-cta-email">
              or reach us at <a href="mailto:hello@rivercitydigitalco.com">hello@rivercitydigitalco.com</a>
            </span>
          </div>
        </section>

        {/* ============ CONTACT ============ */}
        <section id="contact" className="rcd-home-sec bg-cream rcd-home-contact tex-grain">
          <div className="container">
            <div className="rcd-home-sec-head fx-reveal" style={{ textAlign: "left", maxWidth: "none", marginBottom: "var(--s-7)" }}>
              <div className="rcd-home-contact-eyebrow">Contact</div>
              <h2>Let&apos;s Build Something That Gets Found</h2>
              <p style={{ maxWidth: 640, margin: "0" }}>
                Reach out and we&apos;ll put together a free audit of your current site — or talk through building something new. No pressure, no pitch decks.
              </p>
            </div>
            <div className="rcd-home-contact-grid fx-reveal">
              <div>
                <div className="rcd-home-contact-rows">
                  <div className="rcd-home-contact-row">
                    <span className="ci">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </span>
                    <div className="ctext">St. Louis, Missouri &amp; Surrounding Areas</div>
                  </div>
                  <div className="rcd-home-contact-row">
                    <span className="ci">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                      </svg>
                    </span>
                    <div className="ctext">
                      <a href="mailto:hello@rivercitydigitalco.com">hello@rivercitydigitalco.com</a>
                    </div>
                  </div>
                  <div className="rcd-home-contact-row">
                    <span className="ci">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    </span>
                    <div className="ctext">Response within 24 hours — usually same day</div>
                  </div>
                </div>
              </div>
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollReveal />
      <MobileStickyCta href="#contact" label="Start a free audit" hideNearId="contact" />
    </>
  );
}
