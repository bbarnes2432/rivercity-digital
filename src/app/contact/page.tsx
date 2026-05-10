import type { Metadata } from "next";
import Image from "next/image";
import Nav from "../_components/Nav";
import Footer from "../_components/Footer";
import Section from "../_components/Section";
import Container from "../_components/Container";
import Breadcrumbs from "../_components/Breadcrumbs";
import ScrollReveal from "../_components/ScrollReveal";
import MissouriMark from "../_components/MissouriMark";
import ContactForm from "../_components/contact-form";
import "./contact.css";

const SITE_URL = "https://rivercitydigitalco.com";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to a real St. Louis person. Free audit, honest scope, response within a day. Email, phone, or book a 15-minute call.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — River City Digital",
    description:
      "Free audit. Honest scope. Real St. Louis people on the other end.",
    url: "/contact",
  },
};

const CONTACT_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}#contact`,
  name: "River City Digital Co.",
  url: `${SITE_URL}/contact`,
  email: "hello@rivercitydigitalco.com",
  image: `${SITE_URL}/assets/logo-color.webp`,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "St. Louis",
    addressRegion: "MO",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 38.627,
    longitude: -90.1994,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Greater St. Louis Metropolitan Area",
  },
};

const HOURS = [
  { d: "Mon – Fri", h: "9 a.m. – 6 p.m. CT" },
  { d: "Saturday", h: "By appointment" },
  { d: "Sunday", h: "Closed" },
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_LD) }}
      />
      <Nav overlayMode="light-on-dark" />

      <main id="main">
        {/* Hero — STL skyline photo as the dark-overlaid background */}
        <header className="rcd-hero fx-parallax-hero" data-mode="civic-deep" data-mood="live">
          <div className="rcd-hero-bg">
            <Image
              src="/assets/hero-skyline.webp"
              alt="St. Louis skyline at dusk with the Gateway Arch"
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
                { label: "Contact" },
              ]}
            />
            <div className="rcd-hero-inner" style={{ marginTop: 32 }}>
              <div className="rcd-hero-copy">
                <p className="t-eyebrow rcd-hero-eyebrow fx-blur-in">Contact</p>
                <h1 className="t-display-1 fx-blur-in">
                  Tell us about it.
                </h1>
                <p className="rcd-hero-tagline fx-blur-in">
                  A few sentences is plenty. Same-day reply most days.
                </p>
                <p className="rcd-hero-lede fx-blur-in">
                  We&apos;re a small studio. The person who picks up the phone is the same
                  person who&apos;ll do the work. We answer email within a day — usually within an hour.
                </p>
              </div>
            </div>
          </Container>
        </header>

        <Section mode="letterhead" className="section--bg-coffee">
          <Container>
            <div className="rcd-contact-page-grid">
              <aside className="rcd-contact-page-aside fx-reveal">
                <div className="rcd-contact-page-card">
                  <p className="t-eyebrow no-rule" style={{ marginBottom: 16 }}>
                    Direct
                  </p>
                  <ul className="rcd-contact-page-direct">
                    <li>
                      <span className="t-mono rcd-contact-page-key">EMAIL</span>
                      <a href="mailto:hello@rivercitydigitalco.com">
                        hello@rivercitydigitalco.com
                      </a>
                    </li>
                    <li>
                      <span className="t-mono rcd-contact-page-key">RESPONSE</span>
                      <span>Within a day. Usually same day.</span>
                    </li>
                    <li>
                      <span className="t-mono rcd-contact-page-key">BASED IN</span>
                      <span>St. Louis, Missouri</span>
                    </li>
                  </ul>
                </div>

                <div className="rcd-contact-page-card">
                  <p className="t-eyebrow no-rule" style={{ marginBottom: 16 }}>
                    Hours
                  </p>
                  <ul className="rcd-contact-page-hours">
                    {HOURS.map((h) => (
                      <li key={h.d}>
                        <span>{h.d}</span>
                        <span>{h.h}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="rcd-contact-page-hours-note">
                    All times Central. Email is faster than the phone for most things.
                  </p>
                </div>

                <div className="rcd-contact-page-card rcd-contact-page-book">
                  <p className="t-eyebrow no-rule" style={{ marginBottom: 16 }}>
                    Or just book a call
                  </p>
                  <p className="rcd-contact-page-book-body">
                    Pick a 15-minute slot. We come back with a real read on your
                    project before the call ends.
                  </p>
                  <a
                    href="https://cal.com/rivercitydigital/15min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-md"
                  >
                    Book a 15-min call
                    <span className="btn-arr" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                    </span>
                  </a>
                  <p className="rcd-contact-page-book-fine">
                    Opens cal.com in a new tab.
                  </p>
                </div>

                <div className="rcd-contact-page-stamp" aria-hidden="true">
                  <MissouriMark size={84} showPin outlineColor="var(--ink-secondary)" />
                </div>
              </aside>

              <div className="rcd-contact-page-form">
                <p className="t-eyebrow" style={{ marginBottom: 16 }}>
                  Send a note
                </p>
                <h2 className="t-h2" style={{ margin: "0 0 16px" }}>
                  We&apos;ll come back with questions.
                </h2>
                <p className="t-lede" style={{ marginBottom: 32 }}>
                  Tell us where you are and where you&apos;d like to be. Three sentences is fine.
                </p>
                <ContactForm />
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
      <ScrollReveal />
    </>
  );
}
