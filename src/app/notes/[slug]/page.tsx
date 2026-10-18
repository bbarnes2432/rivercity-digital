import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Nav from "../../_components/Nav";
import Footer from "../../_components/Footer";
import Section from "../../_components/Section";
import Container from "../../_components/Container";
import Breadcrumbs from "../../_components/Breadcrumbs";
import CtaBand from "../../_components/CtaBand";
import ScrollReveal from "../../_components/ScrollReveal";
import "../../styles/notes.css";
import { NOTES, getNote, NOTE_SLUGS, type Block } from "../_data";
import ReadingProgress from "../../_components/ReadingProgress";
import ArticleToc from "../../_components/ArticleToc";

function slugifyHeading(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&[lr]squo;/g, "")
    .replace(/&apos;/g, "")
    .replace(/&amp;/g, "and")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

function decodeHeading(text: string): string {
  return text
    .replace(/&[lr]squo;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, "");
}

/* Plain text for metadata and JSON-LD, where markup and entities don't render. */
function plain(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&[lr]squo;/g, "'")
    .replace(/&[lr]dquo;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return NOTE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const n = getNote(slug);
  if (!n) return { title: "Field Notes" };
  const cleanTitle = n.title.replace(/&[lr]squo;/g, "'").replace(/&apos;/g, "'");
  const cleanExcerpt = plain(n.metaDescription ?? n.excerpt);
  return {
    title: n.metaTitle ? { absolute: n.metaTitle } : cleanTitle,
    description: cleanExcerpt,
    alternates: { canonical: `/notes/${n.slug}` },
    openGraph: {
      type: "article",
      title: cleanTitle,
      description: cleanExcerpt,
      url: `/notes/${n.slug}`,
      publishedTime: n.date,
    },
  };
}

function renderBlock(b: Block, i: number) {
  switch (b.type) {
    case "h2":
      return (
        <h2
          key={i}
          id={slugifyHeading(b.text)}
          className="rcd-article-h2"
          dangerouslySetInnerHTML={{ __html: b.text }}
        />
      );
    case "h3":
      return (
        <h3
          key={i}
          className="rcd-article-h3"
          dangerouslySetInnerHTML={{ __html: b.text }}
        />
      );
    case "p":
      return (
        <p
          key={i}
          className="rcd-article-p"
          dangerouslySetInnerHTML={{ __html: b.text }}
        />
      );
    case "list": {
      const List = b.ordered ? "ol" : "ul";
      return (
        <List
          key={i}
          className={b.ordered ? "rcd-article-list rcd-article-list--ordered" : "rcd-article-list"}
        >
          {b.items.map((it, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: it }} />
          ))}
        </List>
      );
    }
    case "pullquote":
      return (
        <figure key={i} className="rcd-article-pullquote">
          <blockquote dangerouslySetInnerHTML={{ __html: `“${b.text}”` }} />
          {b.cite && <figcaption>— {b.cite}</figcaption>}
        </figure>
      );
    case "callout":
      return (
        <aside key={i} className="rcd-article-callout">
          <p
            className="rcd-article-callout-eyebrow"
            dangerouslySetInnerHTML={{ __html: b.eyebrow }}
          />
          <p
            className="rcd-article-callout-body"
            dangerouslySetInnerHTML={{ __html: b.text }}
          />
        </aside>
      );
    case "table":
      return (
        <div key={i} className="rcd-article-table-wrap">
          <table className="rcd-article-table">
            <thead>
              <tr>
                {b.head.map((h, j) => (
                  <th key={j} scope="col" dangerouslySetInnerHTML={{ __html: h }} />
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, j) => (
                <tr key={j}>
                  {row.map((cell, k) =>
                    k === 0 ? (
                      <th key={k} scope="row" dangerouslySetInnerHTML={{ __html: cell }} />
                    ) : (
                      <td key={k} dangerouslySetInnerHTML={{ __html: cell }} />
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "figure":
      return (
        <figure key={i} className="rcd-article-figure">
          <Image
            src={b.src}
            alt={b.alt}
            width={b.width}
            height={b.height}
            sizes="(min-width: 1024px) 640px, 100vw"
          />
          {b.caption && <figcaption dangerouslySetInnerHTML={{ __html: b.caption }} />}
        </figure>
      );
    case "faq":
      return (
        <div key={i} className="rcd-article-faq">
          {b.items.map((it, j) => (
            <div key={j} className="rcd-article-faq-item">
              <h3 className="rcd-article-h3" dangerouslySetInnerHTML={{ __html: it.q }} />
              <p className="rcd-article-faq-answer" dangerouslySetInnerHTML={{ __html: it.a }} />
            </div>
          ))}
        </div>
      );
    case "cta":
      return (
        <p key={i} className="rcd-article-cta">
          <Link href={b.href} className="btn btn-primary btn-lg">
            {b.label}
          </Link>
        </p>
      );
  }
}

export default async function NotePage({ params }: { params: Params }) {
  const { slug } = await params;
  const n = getNote(slug);
  if (!n) notFound();

  const cleanTitle = n.title.replace(/&[lr]squo;/g, "'").replace(/&apos;/g, "'");
  const idx = NOTES.findIndex((x) => x.slug === n.slug);
  const next = NOTES[(idx + 1) % NOTES.length];

  const figures = n.body.filter(
    (b): b is Extract<Block, { type: "figure" }> => b.type === "figure",
  );
  const faqs = n.body.flatMap((b) => (b.type === "faq" ? b.items : []));
  const faqLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: plain(f.q),
            acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
          })),
        }
      : null;

  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: cleanTitle,
    description: plain(n.metaDescription ?? n.excerpt),
    datePublished: n.date,
    ...(figures.length > 0 && {
      image: figures.map((f) => `https://rivercitydigitalco.com${f.src}`),
    }),
    author: {
      "@type": "Organization",
      name: "River City Digital Co.",
      url: "https://rivercitydigitalco.com",
    },
    publisher: {
      "@type": "Organization",
      name: "River City Digital Co.",
      logo: {
        "@type": "ImageObject",
        url: "https://rivercitydigitalco.com/assets/logo-color.webp",
      },
    },
    mainEntityOfPage: `https://rivercitydigitalco.com/notes/${n.slug}`,
  };

  const formattedDate = new Date(n.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  const tocItems = n.body
    .filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2")
    .map((b) => ({ id: slugifyHeading(b.text), text: decodeHeading(b.text) }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <Nav overlayMode="dark-on-light" />
      <ReadingProgress />

      <main id="main">
        <article className="rcd-article">
          <header className="rcd-article-hero">
            <Container>
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Field Notes", href: "/notes" },
                  { label: cleanTitle },
                ]}
              />
              <div className="rcd-article-hero-inner">
                <div className="rcd-article-meta">
                  <span className="rcd-article-category">{n.category}</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={n.date}>{formattedDate}</time>
                  <span aria-hidden="true">·</span>
                  <span>{n.readTime}</span>
                </div>
                <h1
                  className="rcd-article-title"
                  dangerouslySetInnerHTML={{ __html: n.title }}
                />
                <p
                  className="rcd-article-deck"
                  dangerouslySetInnerHTML={{ __html: n.deck }}
                />
              </div>
            </Container>
          </header>

          <Section mode="letterhead" pad="tight" className="tex-rules">
            <Container>
              <div className="rcd-article-layout">
                <aside className="rcd-article-toc">
                  <ArticleToc items={tocItems} />
                </aside>
                <div className="rcd-article-body fx-reveal">
                  {n.body.map((b, i) => renderBlock(b, i))}
                  <div className="rcd-article-signature" aria-hidden="true">
                    <span />
                    <span>RCD</span>
                    <span />
                  </div>
                </div>
              </div>
            </Container>
          </Section>

          {/* Next article */}
          <Section mode="letterhead" pad="tight">
            <Container narrow>
              <Link href={`/notes/${next.slug}`} className="rcd-article-next">
                <p className="rcd-article-next-label">Read next</p>
                <h3
                  className="rcd-article-next-title"
                  dangerouslySetInnerHTML={{ __html: next.title }}
                />
                <p
                  className="rcd-article-next-excerpt"
                  dangerouslySetInnerHTML={{ __html: next.excerpt }}
                />
              </Link>
            </Container>
          </Section>
        </article>

        <CtaBand
          eyebrow="Filed from St. Louis"
          title="Want a field note like this on your business?"
          lede="A free audit, written like one of these. No deck. No upsell."
          primaryHref="/contact"
          primaryLabel="Request an audit"
          secondaryHref="/notes"
          secondaryLabel="More notes"
        />
      </main>

      <Footer />
      <ScrollReveal />
    </>
  );
}
