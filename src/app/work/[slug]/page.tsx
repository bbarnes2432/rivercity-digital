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
import "../../styles/work.css";
import { PROJECTS, getProject, PROJECT_SLUGS } from "../_data";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return PROJECT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: "Selected Work" };
  const title = `${p.name} — ${p.sector} in ${p.where}`;
  return {
    title,
    description: p.blurb,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      type: "article",
      title,
      description: p.blurb,
      url: `/work/${p.slug}`,
      images: [{ url: p.img }],
    },
  };
}

export default async function WorkCaseStudy({ params }: { params: Params }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const idx = PROJECTS.findIndex((x) => x.slug === p.slug);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  const ld = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.name,
    creator: {
      "@type": "Organization",
      name: "River City Digital Co.",
      url: "https://rivercitydigitalco.com",
    },
    about: p.sector,
    locationCreated: {
      "@type": "Place",
      name: p.where,
    },
    image: `https://rivercitydigitalco.com${p.img}`,
    description: p.blurb,
    datePublished: `${p.year}-01-01`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <Nav overlayMode="dark-on-light" />

      <main id="main">
        {/* Hero — editorial cover spread */}
        <header className="rcd-case-hero">
          <Container>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Selected Work", href: "/work" },
                { label: p.name },
              ]}
            />
            <div className="rcd-case-hero-grid">
              <div className="rcd-case-hero-copy">
                <p className="t-mono rcd-case-hero-meta">
                  {p.where.toUpperCase()} · {p.sector.toUpperCase()} · {p.year}
                </p>
                <h1 className="t-display-1 rcd-case-hero-title">{p.name}</h1>
                <p className="rcd-case-hero-lede">{p.blurb}</p>
                <ul className="rcd-case-services">
                  {p.services.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <figure className="rcd-case-hero-image fx-reveal">
                <Image
                  src={p.img}
                  alt={`${p.name} — ${p.sector} in ${p.where}`}
                  width={1600}
                  height={1000}
                  priority
                  sizes="(max-width: 880px) 100vw, 600px"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </figure>
            </div>
          </Container>
        </header>

        {/* The Brief */}
        <Section mode="letterhead" className="section--bg-strategy">
          <Container narrow>
            <div className="rcd-case-block fx-reveal">
              <p className="t-eyebrow rcd-case-block-eyebrow">The brief</p>
              <p className="rcd-case-block-body">{p.brief}</p>
            </div>
          </Container>
        </Section>

        {/* The Approach */}
        <Section mode="working" className="section--bg-build">
          <Container narrow>
            <div className="rcd-case-block">
              <p className="t-eyebrow rcd-case-block-eyebrow">The approach</p>
              <ol className="rcd-case-approach fx-stagger">
                {p.approach.map((step, i) => (
                  <li key={i}>
                    <span className="rcd-case-approach-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </Section>

        {/* Results */}
        <Section mode="civic-deep">
          <Container>
            <div className="rcd-case-results">
              <p className="t-eyebrow rcd-case-block-eyebrow" style={{ color: "var(--rcd-teal-400)" }}>
                The receipt
              </p>
              <h2 className="t-h2" style={{ color: "#fff", marginBottom: 48, maxWidth: 720 }}>
                What changed.
              </h2>
              <div className="rcd-case-results-grid fx-stagger">
                {p.results.map((r) => (
                  <div key={r.label} className="rcd-case-result">
                    <span className="rcd-case-result-value">{r.value}</span>
                    <span className="rcd-case-result-label">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* Pull quote */}
        {p.pullquote && (
          <Section mode="letterhead" className="section--bg-coffee" pad="tight">
            <Container narrow>
              <figure className="rcd-pullquote fx-reveal">
                <blockquote>“{p.pullquote.text}”</blockquote>
                <figcaption className="rcd-pullquote-cite">— {p.pullquote.cite}</figcaption>
              </figure>
            </Container>
          </Section>
        )}

        {/* Reflection */}
        <Section mode="sunken">
          <Container narrow>
            <div className="rcd-case-block fx-reveal">
              <p className="t-eyebrow rcd-case-block-eyebrow">What we&apos;d do differently</p>
              <p className="rcd-case-block-body">{p.reflection}</p>
            </div>
          </Container>
        </Section>

        {/* Next project nav */}
        <Section mode="letterhead" pad="tight">
          <Container>
            <Link href={`/work/${next.slug}`} className="rcd-case-next">
              <div>
                <p className="t-mono rcd-case-next-label">Next project</p>
                <h3 className="rcd-case-next-name">{next.name}</h3>
                <p className="rcd-case-next-blurb">{next.blurb}</p>
              </div>
              <div className="rcd-case-next-img">
                <Image
                  src={next.img}
                  alt={next.name}
                  width={400}
                  height={250}
                  sizes="(max-width: 720px) 50vw, 320px"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </Link>
          </Container>
        </Section>

        <CtaBand
          eyebrow="Let's build something"
          title="Tell us about your project."
          lede="Free audit. Honest scope. We come back same day."
          primaryHref="/contact"
          primaryLabel="Start the conversation"
          secondaryHref="/work"
          secondaryLabel="See more work"
        />
      </main>

      <Footer />
      <ScrollReveal />
    </>
  );
}
