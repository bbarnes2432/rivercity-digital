import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Nav from "../_components/Nav";
import Footer from "../_components/Footer";
import Section from "../_components/Section";
import Container from "../_components/Container";
import ScrollReveal from "../_components/ScrollReveal";
import ThankYouConversion from "../_components/ThankYouConversion";

export const metadata: Metadata = {
  title: "Thank You",
  description:
    "Thanks for reaching out to River City Digital. We've got your note and will be in touch within a day — usually the same day.",
  alternates: { canonical: "/thank-you" },
  // A conversion landing page — keep it out of the index.
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  return (
    <>
      {/* Fires the Google Ads "Contact Us" conversion on arrival. */}
      <ThankYouConversion />

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
            <div className="rcd-hero-inner" style={{ marginTop: 32 }}>
              <div className="rcd-hero-copy">
                <p className="t-eyebrow rcd-hero-eyebrow fx-blur-in">Thank you</p>
                <h1 className="t-display-1 fx-blur-in">
                  Got it. We&apos;re on it.
                </h1>
                <p className="rcd-hero-tagline fx-blur-in">
                  Your note landed. We&apos;ll be in touch within a day — usually the same day.
                </p>
                <p className="rcd-hero-lede fx-blur-in">
                  We&apos;re a small St. Louis studio. The person who reads your message is the same
                  person who&apos;ll do the work. Keep an eye on your inbox.
                </p>
              </div>
            </div>
          </Container>
        </header>

        <Section mode="letterhead" className="section--bg-coffee">
          <Container>
            <div className="fx-reveal" style={{ maxWidth: 640 }}>
              <p className="t-eyebrow" style={{ marginBottom: 16 }}>
                While you wait
              </p>
              <h2 className="t-h2" style={{ margin: "0 0 16px" }}>
                A couple of things you might do next.
              </h2>
              <p className="t-lede" style={{ marginBottom: 32 }}>
                No need to do anything — we&apos;ll reach out. But if you&apos;d rather get the ball
                rolling, here are a few options.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                <a
                  href="https://calendly.com/hello-rivercitydigitalco/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-md"
                >
                  Book a 30-min call
                  <span className="btn-arr" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </span>
                </a>
                <Link href="/work" className="btn btn-secondary btn-md">
                  See our recent work
                </Link>
                <Link href="/notes" className="btn btn-secondary btn-md">
                  Read the studio notes
                </Link>
              </div>

              <p className="t-lede" style={{ marginTop: 32 }}>
                Prefer email? Reach us any time at{" "}
                <a href="mailto:hello@rivercitydigitalco.com">hello@rivercitydigitalco.com</a>.
              </p>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
      <ScrollReveal />
    </>
  );
}
