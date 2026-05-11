import type { Metadata } from "next";
import Image from "next/image";
import Nav from "../_components/Nav";
import Footer from "../_components/Footer";
import Section from "../_components/Section";
import Container from "../_components/Container";
import SectionHeader from "../_components/SectionHeader";
import CtaBand from "../_components/CtaBand";
import Button from "../_components/Button";
import Breadcrumbs from "../_components/Breadcrumbs";
import ScrollReveal from "../_components/ScrollReveal";

export const metadata: Metadata = {
  title: "About — Two of Us. One City. The Work.",
  description:
    "We're River City Digital — a small St. Louis studio building websites and search visibility for local businesses. Personally handled, here.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — River City Digital",
    description: "A small St. Louis studio. The same person who picks up the phone is the one writing your schema.",
    url: "/about",
  },
};

const STUDIO_TILES = [
  {
    id: "coffee-arch",
    label: "MORNING · CHEROKEE STREET",
    img: "/assets/bg-coffee-arch.webp",
  },
  {
    id: "strategy",
    label: "MID-AFTERNOON · IN PROGRESS",
    img: "/assets/bg-strategy.webp",
  },
  {
    id: "data",
    label: "EVENING REVIEW",
    img: "/assets/bg-data-results.webp",
  },
];

export default function AboutPage() {
  return (
    <>
      <Nav overlayMode="light-on-dark" />

      <main id="main">
        {/* Hero — pop-art Arch as the dark-overlaid background */}
        <header className="rcd-hero fx-parallax-hero" data-mode="civic-deep" data-mood="quiet">
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
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
            <div className="rcd-hero-inner" style={{ marginTop: 32 }}>
              <div className="rcd-hero-copy">
                <p className="t-eyebrow rcd-hero-eyebrow fx-blur-in">Filed from St. Louis · 04.2026</p>
                <h1 className="t-display-1 fx-blur-in">
                  Two of us.<br />One city.<br />The work.
                </h1>
                <p className="rcd-hero-tagline fx-blur-in">
                  A small St. Louis studio. Personally handled, here.
                </p>
                <p className="rcd-hero-lede fx-blur-in">
                  We make the websites here. Run the campaigns here. Pick up the phone — actually pick it up.
                  If you&apos;re a St. Louis owner who wants the work done by the same person who answers your emails,
                  we&apos;d like to talk.
                </p>
                <div className="rcd-hero-actions fx-blur-in">
                  <Button href="/contact" size="lg" arrow className="fx-shine">Talk to us</Button>
                  <Button href="/work" size="lg" variant="ghost">See the work</Button>
                </div>
              </div>
            </div>
          </Container>
        </header>

        {/* Letter from the owner */}
        <Section mode="letterhead" className="tex-rules">
          <Container>
            <div className="rcd-about-letter fx-reveal" style={{ maxWidth: 720, margin: "0 auto" }}>
              <p className="rcd-about-letter-meta">FILED FROM ST. LOUIS · 04.2026</p>
              <h2 className="t-h2" style={{ marginBottom: 32 }}>A letter from the owner.</h2>
              <p>
                We started River City Digital because we got tired of watching local owners pay national shops
                for templates and call summaries. Sites built somewhere else, by people who&apos;d never been to
                Soulard or driven Manchester at 5pm. Reports written by automated tools and forwarded by an
                account manager nobody had met.
              </p>
              <p>
                We thought there was a different way. Make the websites here. Run the campaigns here. Pick up the
                phone — actually pick it up. Treat each business like it&apos;s the only one we&apos;re working with that
                week, because functionally, it is.
              </p>
              <p>
                Every site we ship gets hand-coded. Every audit gets run by a person, not a tool. Every month, the
                report you get is something we wrote, not something a dashboard exported. If that sounds slower
                than the typical agency pitch — it is. It also tends to work.
              </p>
              <p>
                We&apos;re a small studio. We won&apos;t be a fit for everyone. If you&apos;re a St. Louis owner who wants the
                work done by the same person who answers your emails, we&apos;d like to talk.
              </p>
              <div className="rcd-about-letter-sign">
                Yours,
                <strong>Jon · Founder, River City Digital Co.</strong>
              </div>
            </div>
          </Container>
        </Section>

        {/* The Studio photo essay */}
        <Section mode="working">
          <Container>
            <SectionHeader
              eyebrow="The studio"
              title="Where the work gets made."
              lede="A small space in St. Louis. A window, a desk, books, coffee. The usual."
            />
            <div className="rcd-studio-grid fx-stagger">
              {STUDIO_TILES.map((t) => (
                <div key={t.id} className="rcd-studio-tile" data-label={t.label}>
                  <Image
                    src={t.img}
                    alt={t.label}
                    width={640}
                    height={480}
                    sizes="(max-width: 720px) 50vw, 33vw"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* What we read / what we use */}
        <Section mode="letterhead" className="section--bg-coffee">
          <Container narrow>
            <SectionHeader
              eyebrow="The shelf"
              title="What we read. What we use."
              lede="A short list of the things that shape how we work. Mostly underlined, occasionally argued with."
              align="left"
            />
            <div className="rcd-pulls fx-reveal" style={{ marginTop: 32 }}>
              <div className="rcd-pull">
                <h3>What we read</h3>
                <ul>
                  <li><em>The Pragmatic Programmer</em> — Hunt &amp; Thomas</li>
                  <li><em>Refactoring UI</em> — Wathan &amp; Schoger</li>
                  <li><em>The Brand Gap</em> — Marty Neumeier</li>
                  <li><em>Building a StoryBrand</em> — Donald Miller</li>
                  <li>The St. Louis Post-Dispatch · daily</li>
                  <li>Search Engine Land · Search Engine Journal</li>
                  <li>Anything by Rand Fishkin</li>
                </ul>
              </div>
              <div className="rcd-pull">
                <h3>What we use</h3>
                <ul>
                  <li>Next.js · Vercel · Resend</li>
                  <li>Figma · Linear · Notion</li>
                  <li>Google Search Console · Looker Studio</li>
                  <li>BrightLocal · SE Ranking</li>
                  <li>Klaviyo · Mailchimp · SendGrid</li>
                  <li>iA Writer · Sublime Text</li>
                  <li>Cherokee Street Coffee &amp; Sump</li>
                </ul>
              </div>
            </div>
          </Container>
        </Section>

        {/* The standard */}
        <Section mode="sunken" className="section--bg-strategy">
          <Container narrow>
            <SectionHeader
              eyebrow="The standard"
              title="What &lsquo;good work&rsquo; means here."
              align="left"
            />
            <ul className="list-numbered fx-stagger" style={{ marginTop: 32 }}>
              <li>
                <strong>The work is the deliverable.</strong> Not the deck. Not the meeting. The site, the campaign, the audit, the schema — that&apos;s what you&apos;re paying for, and that&apos;s what we ship.
              </li>
              <li>
                <strong>Speed is part of the brief.</strong> A slow site is a broken site. Every page we ship targets sub-1.2s LCP.
              </li>
              <li>
                <strong>Accessibility is the spec, not a checkbox.</strong> WCAG 2.1 AA on every page, every build, no exceptions.
              </li>
              <li>
                <strong>If we can&apos;t explain it in plain English, we don&apos;t understand it well enough to ship it.</strong> That includes schema, ad strategy, and the Map Pack.
              </li>
              <li>
                <strong>We answer emails the same day.</strong> Usually within an hour. If we&apos;re heads-down on a build, we&apos;ll tell you when to expect a real reply.
              </li>
              <li>
                <strong>We say no when we should.</strong> If we&apos;re not the right fit, we&apos;ll tell you and try to point you somewhere that is.
              </li>
            </ul>
          </Container>
        </Section>

        <CtaBand
          eyebrow="If we&apos;re a fit"
          title="The only way to find out is to talk."
          lede="A 30-minute call. Real conversation. We tell you whether we can help, and if not, who can."
          primaryHref="/contact"
          primaryLabel="Start the conversation"
        />
      </main>

      <Footer />
      <ScrollReveal />
    </>
  );
}
