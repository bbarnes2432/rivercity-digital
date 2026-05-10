import type { Metadata } from "next";
import Link from "next/link";
import Nav from "../_components/Nav";
import Footer from "../_components/Footer";
import Section from "../_components/Section";
import Container from "../_components/Container";
import CtaBand from "../_components/CtaBand";
import Breadcrumbs from "../_components/Breadcrumbs";
import ScrollReveal from "../_components/ScrollReveal";
import NewsletterForm from "../_components/NewsletterForm";
import "../styles/notes.css";
import { NOTES as POSTS } from "./_data";

export const metadata: Metadata = {
  title: "Field Notes",
  description: "Writing on local search, AI search visibility, websites, and the work, from a small St. Louis studio.",
  alternates: { canonical: "/notes" },
  openGraph: {
    title: "Field Notes — River City Digital",
    description: "Writing on local search, AI search visibility, and the work.",
    url: "/notes",
  },
};

const BLOG_LD = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Field Notes — River City Digital",
  url: "https://rivercitydigitalco.com/notes",
  blogPost: POSTS.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title.replace(/&[lr]squo;/g, "'"),
    datePublished: p.date,
    url: `https://rivercitydigitalco.com/notes/${p.slug}`,
  })),
};

export default function NotesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BLOG_LD) }}
      />
      <Nav overlayMode="dark-on-light" />

      <main id="main">
        <header className="rcd-notes-hero">
          <Container>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Field Notes" }]} />
            <div style={{ marginTop: 40, maxWidth: 720 }}>
              <p className="t-eyebrow" style={{ marginBottom: 16 }}>Field Notes</p>
              <h1 className="t-display-1" style={{ color: "var(--ink-primary)", margin: "0 0 16px" }}>
                Field Notes
              </h1>
              <p className="t-lede" style={{ maxWidth: 580 }}>
                Writing on local search, AI search visibility, websites, and the work.
                Filed quarterly, from St. Louis.
              </p>
            </div>
          </Container>
        </header>

        <Section mode="letterhead">
          <Container>
            <ul className="rcd-filing-grid fx-stagger">
              {POSTS.map((p) => {
                const d = new Date(p.date);
                const day = d.getDate();
                const month = d.toLocaleDateString("en-US", { month: "short" });
                const year = d.getFullYear();
                return (
                  <li key={p.slug}>
                    <Link href={`/notes/${p.slug}`} className="rcd-filing-card">
                      <div className="rcd-filing-postmark" aria-hidden="true">
                        <span className="rcd-filing-day">{day}</span>
                        <span className="rcd-filing-month">{month}</span>
                        <span className="rcd-filing-year">{year}</span>
                      </div>
                      <div className="rcd-filing-body">
                        <span className="rcd-filing-cat">{p.category}</span>
                        <h2
                          className="rcd-filing-title"
                          dangerouslySetInnerHTML={{ __html: p.title }}
                        />
                        <p
                          className="rcd-filing-excerpt"
                          dangerouslySetInnerHTML={{ __html: p.excerpt }}
                        />
                        <span className="rcd-filing-meta">{p.readTime}</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Container>
        </Section>

        <Section mode="letterhead" pad="tight">
          <Container narrow>
            <div className="rcd-news-block fx-reveal">
              <p className="t-eyebrow" style={{ marginBottom: 16 }}>One email a month</p>
              <h2 className="t-h2" style={{ margin: "0 0 12px" }}>Filed from St. Louis.</h2>
              <p className="t-lede" style={{ marginBottom: 28, maxWidth: 580 }}>
                What we&apos;re seeing in local search, what we&apos;re working on, and the occasional
                rant about Google&apos;s product team. No pitches.
              </p>
              <NewsletterForm source="notes-index" layout="full" />
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
      <ScrollReveal />
    </>
  );
}
