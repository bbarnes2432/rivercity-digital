import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Nav from "../_components/Nav";
import Footer from "../_components/Footer";
import Section from "../_components/Section";
import Container from "../_components/Container";
import SectionHeader from "../_components/SectionHeader";
import CtaBand from "../_components/CtaBand";
import Breadcrumbs from "../_components/Breadcrumbs";
import ScrollReveal from "../_components/ScrollReveal";
import "../styles/work.css";
import { PROJECTS } from "./_data";

export const metadata: Metadata = {
  title: "Selected Work",
  description: "A short selection of websites and search visibility projects River City Digital has shipped for St. Louis businesses.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Selected Work — River City Digital",
    description: "A short selection of recent St. Louis projects.",
    url: "/work",
  },
};

export default function WorkPage() {
  return (
    <>
      <Nav overlayMode="dark-on-light" />

      <main id="main">
        <header className="rcd-work-hero">
          <Container>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Selected Work" }]} />
            <div style={{ marginTop: 40, maxWidth: 720 }}>
              <p className="t-eyebrow" style={{ marginBottom: 16 }}>Selected work</p>
              <h1 className="t-display-1" style={{ color: "var(--ink-primary)", margin: "0 0 16px" }}>
                A short list.<br />Filed from St. Louis.
              </h1>
              <p className="t-lede" style={{ maxWidth: 580 }}>
                A short list of recent projects. Real businesses, real numbers, real owners
                we still talk to. More to come — we ship more often than we publish.
              </p>
            </div>
          </Container>
        </header>

        <Section mode="letterhead" className="section--bg-pins">
          <Container>
            <div className="rcd-work-grid fx-stagger">
              {PROJECTS.map((p) => (
                <Link href={`/work/${p.slug}`} key={p.slug} className="rcd-work-card">
                  <div className="rcd-work-card-img">
                    <Image
                      src={p.img}
                      alt={`${p.name} — ${p.sector} in ${p.where}`}
                      width={800}
                      height={500}
                      sizes="(max-width: 720px) 100vw, 50vw"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div className="rcd-work-card-body">
                    <div className="rcd-work-card-meta">
                      <span className="t-mono">{p.where.toUpperCase()} · {p.year}</span>
                    </div>
                    <h3 className="rcd-work-card-name">{p.name}</h3>
                    <p className="rcd-work-card-sector">{p.sector}</p>
                    <p className="rcd-work-card-blurb">{p.blurb}</p>
                    <ul className="rcd-work-card-tags">
                      {p.services.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>

        <CtaBand
          eyebrow="Want to be next"
          title="Tell us about your project."
          lede="We take on a small number of new projects each quarter. The conversation starts with a free audit."
          primaryHref="/contact"
          primaryLabel="Start the conversation"
        />
      </main>

      <Footer />
      <ScrollReveal />
    </>
  );
}
