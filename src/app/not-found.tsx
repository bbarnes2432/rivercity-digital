import Link from "next/link";
import "./styles/not-found.css";
import Nav from "./_components/Nav";
import Footer from "./_components/Footer";
import Container from "./_components/Container";

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
              <svg className="rcd-404-pin" width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>
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
