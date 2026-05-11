import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "./NewsletterForm";

const SERVICES = [
  { href: "/ai-search-visibility", label: "AI Search Visibility" },
  { href: "/local-seo-optimization", label: "Local SEO" },
  { href: "/website-design", label: "Website Design" },
  { href: "/digital-marketing", label: "Digital Marketing" },
];

const COMPANY = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Selected Work" },
  { href: "/notes", label: "Field Notes" },
  { href: "/service-areas", label: "Service Areas" },
  { href: "/contact", label: "Contact" },
];

const LEGAL = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-use", label: "Terms of Use" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="rcd-footer">
      {/* Prelude */}
      <div className="rcd-footer-prelude">
        <div className="container">
          <p className="rcd-footer-tagline t-display-2">
            Local Roots.<br />Built to Be Found.
          </p>
        </div>
      </div>

      {/* Newsletter */}
      <div className="rcd-footer-news">
        <div className="container rcd-footer-news-inner">
          <div className="rcd-footer-news-copy">
            <p className="rcd-footer-news-eyebrow">Filings · One email a month</p>
            <p className="rcd-footer-news-lede">
              What we&apos;re seeing in local search, what we&apos;re working on, the occasional
              rant. No pitches.
            </p>
          </div>
          <NewsletterForm source="footer" layout="compact" />
        </div>
      </div>

      <div className="container rcd-footer-main">
        <div className="rcd-footer-grid">
          <div className="rcd-footer-brand">
            <Link href="/" aria-label="River City Digital home" className="rcd-footer-logo">
              <Image
                src="/assets/logo-white.webp"
                alt="River City Digital Co."
                width={248}
                height={40}
                sizes="248px"
              />
            </Link>
            <p className="rcd-footer-blurb">
              A St. Louis digital studio building websites and search visibility for local businesses.
              Personally handled, here.
            </p>
            <a className="rcd-footer-mail" href="mailto:hello@rivercitydigitalco.com">
              hello@rivercitydigitalco.com
            </a>
          </div>

          <div className="rcd-footer-col">
            <p className="rcd-footer-label">Services</p>
            <ul>
              {SERVICES.map((s) => (
                <li key={s.href}><Link href={s.href}>{s.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="rcd-footer-col">
            <p className="rcd-footer-label">Studio</p>
            <ul>
              {COMPANY.map((s) => (
                <li key={s.href}><Link href={s.href}>{s.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="rcd-footer-col">
            <p className="rcd-footer-label">Filed from</p>
            <ul className="rcd-footer-meta">
              <li>St. Louis, Missouri</li>
              <li>Established 2026</li>
              <li>By appointment</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rcd-footer-bottom">
        <div className="container rcd-footer-bottom-inner">
          <p className="rcd-footer-copy">
            © {year} River City Digital Co. · Designed, written, and built in St. Louis.
          </p>
          <ul className="rcd-footer-legal">
            {LEGAL.map((l) => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
