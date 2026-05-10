import { ReactNode } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import Container from "./Container";
import Breadcrumbs from "./Breadcrumbs";
import MissouriMark from "./MissouriMark";

type Section = { id: string; heading: string; body: ReactNode };

type Props = {
  title: string;
  preface?: string;
  lastUpdated: string;
  sections: Section[];
  breadcrumbLabel: string;
};

export default function LegalPage({
  title,
  preface,
  lastUpdated,
  sections,
  breadcrumbLabel,
}: Props) {
  return (
    <>
      <Nav overlayMode="dark-on-light" />
      <main id="main" className="rcd-legal-main">
        <Container narrow>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: breadcrumbLabel },
            ]}
            className="rcd-legal-crumbs"
          />
          <header className="rcd-legal-head">
            <p className="t-mono rcd-legal-meta">
              EFFECTIVE · {lastUpdated} · ST. LOUIS, MO
            </p>
            <h1 className="t-display-2">{title}</h1>
            {preface && (
              <p className="rcd-legal-preface">{preface}</p>
            )}
          </header>

          <nav aria-label="Table of contents" className="rcd-legal-toc">
            <p className="t-label" style={{ marginBottom: 12, color: "var(--ink-tertiary)" }}>Contents</p>
            <ol>
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    <span className="rcd-legal-toc-num">{String(i + 1).padStart(2, "0")}</span>
                    <span>{s.heading}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="rcd-legal-body">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id}>
                <h2><span className="t-mono rcd-legal-section-num">{String(i + 1).padStart(2, "0")}</span> {s.heading}</h2>
                {s.body}
              </section>
            ))}
          </article>

          <footer className="rcd-legal-foot">
            <div className="ornament" aria-hidden="true">
              <span className="ornament-dot" />
            </div>
            <p className="t-mono rcd-legal-foot-meta">
              FILED IN ST. LOUIS, MISSOURI · {lastUpdated.toUpperCase()} · BY THE SAME PEOPLE WHO BUILT THIS WEBSITE.
            </p>
            <div className="rcd-legal-stamp" aria-hidden="true">
              <MissouriMark size={48} showPin outlineColor="var(--ink-tertiary)" />
            </div>
          </footer>
        </Container>
      </main>
      <Footer />
    </>
  );
}
