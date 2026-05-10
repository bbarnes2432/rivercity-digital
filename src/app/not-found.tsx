import Link from "next/link";
import "./styles/not-found.css";
import Nav from "./_components/Nav";
import Footer from "./_components/Footer";
import Container from "./_components/Container";
import MissouriMark from "./_components/MissouriMark";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <>
      <Nav overlayMode="dark-on-light" />
      <main id="main" className="rcd-404">
        <Container narrow>
          <div className="rcd-404-inner">
            <p className="t-mono rcd-404-meta">ERROR · 404 · NOT FOUND</p>
            <h1 className="t-display-1">This page wasn&apos;t found.</h1>
            <p className="rcd-404-tagline">
              Like an unclaimed Google Business Profile — just sort of out there.
            </p>

            <div className="rcd-404-mark" aria-hidden="true">
              <MissouriMark size={200} outlineColor="var(--ink-primary)" />
              <svg className="rcd-404-x" width="48" height="48" viewBox="0 0 24 24">
                <path d="M5 5 L19 19 M19 5 L5 19" stroke="var(--rcd-red-500)" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

            <div className="rcd-404-where">
              <p className="t-label">Where you might have meant to go</p>
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/ai-search-visibility">AI Search Visibility</Link></li>
                <li><Link href="/local-seo-optimization">Local SEO</Link></li>
                <li><Link href="/website-design">Website Design</Link></li>
                <li><Link href="/digital-marketing">Digital Marketing</Link></li>
                <li><Link href="/service-areas">Service Areas</Link></li>
                <li><Link href="/about">About</Link></li>
              </ul>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
