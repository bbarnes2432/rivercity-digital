"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import Container from "@/app/_components/Container";
import { PROJECTS } from "@/app/work/_data";
import { useStage } from "@/components/three/stage-context";

/* §02 · The build reveal — "Built from the first wireframe."
 *
 * One real project, The Sauce Fix, as a slab that assembles in three beats as
 * this section scrolls into view: wireframe → surface → live. The slab is
 * painted by the shared Stage canvas into the box below; the <Image> in that
 * box is the fallback and the loading state, and the results, the quote and
 * the links are DOM.
 *
 * Progress is scroll position, read here and handed to the slab as a
 * function. No scroll-jacking: the visitor's scroll is the scrubber. */

const SAUCE = PROJECTS.find((p) => p.slug === "the-sauce-fix")!;
const LIVE_URL = "https://thesaucefix.com";

const BEATS = [
  { n: "01", t: "Wireframe", d: "Structure first. Where the headline goes, where the cart goes, before a single colour." },
  { n: "02", t: "Surface", d: "The brand's own illustration and type, laid onto that structure — not a theme with the logo swapped." },
  { n: "03", t: "Live", d: "Hand-coded, fast, and ready for a drop. The maker runs it without an agency in the loop." },
] as const;

export default function BuildReveal() {
  const { BuildView, request } = useStage();
  const section = useRef<HTMLElement>(null);
  const shot = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  /* Scroll progress → material stage, piecewise so the three labels and the
     picture agree. A linear map put the print half-developed while the label
     still said "Wireframe" (measured: ~49% of the slab opaque at the first
     beat). Now the first third only draws the wireframe in (0.85 → 1.0), the
     middle develops it (1 → 3), and the last quarter is live (3 → 3.7). */
  const getStage = useCallback(() => {
    const p = progress.current;
    if (p < 0.33) return 0.85 + (p / 0.33) * 0.15;
    if (p < 0.75) return 1 + ((p - 0.33) / 0.42) * 2;
    return 3 + ((p - 0.75) / 0.25) * 0.7;
  }, []);

  useEffect(() => {
    const sec = section.current;
    const box = shot.current;
    if (!sec || !box) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = box.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the box's top reaches the bottom of the viewport, 1 when the
      // box is centred in it.
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.5 + r.height * 0.5)));
      progress.current = p;
      const beat = p < 0.33 ? 1 : p < 0.75 ? 2 : 3;
      if (sec.dataset.beat !== String(beat)) sec.dataset.beat = String(beat);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          request();
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(sec);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [request]);

  return (
    <section ref={section} className="section section--civic-deep rcd-build" data-theme="dark" data-beat="1">
      <Container>
        <div className="rcd-build-head">
          <p className="t-eyebrow">Stage 02 · The build</p>
          <h2 className="t-h2">Built from the first wireframe.</h2>
          <p className="t-lede">
            Watch one of ours go from blueprint to live. {SAUCE.name}, a custom storefront for a
            small-batch maker in Iowa: no theme, no template &mdash; the structure first, then the
            surface, then the site.
          </p>
        </div>

        <div className="rcd-build-grid">
          <div className="rcd-build-stage">
            <div ref={shot} className="rcd-build-shot">
              <Image
                src={SAUCE.img}
                alt={`${SAUCE.name} — ${SAUCE.sector}`}
                width={1440}
                height={798}
                loading="lazy"
                sizes="(max-width: 900px) 92vw, 720px"
              />
              {BuildView && <BuildView track={shot} src={SAUCE.img} getStage={getStage} />}
            </div>
            <ol className="rcd-build-beats" aria-label="Build stages">
              {BEATS.map((b, i) => (
                <li key={b.n} className="rcd-build-beat" data-index={i + 1}>
                  <span className="rcd-build-beat-n">{b.n}</span>
                  <span className="rcd-build-beat-t">{b.t}</span>
                  <span className="rcd-build-beat-d">{b.d}</span>
                </li>
              ))}
            </ol>
          </div>

          <aside className="rcd-build-aside">
            <p className="rcd-build-meta">{SAUCE.sector} · {SAUCE.where} · {SAUCE.year}</p>
            <h3 className="rcd-build-name">{SAUCE.name}</h3>
            <p className="rcd-build-brief">{SAUCE.brief}</p>
            <dl className="rcd-rail-results">
              {SAUCE.results.map((r) => (
                <div key={r.label}>
                  <dt>{r.value}</dt>
                  <dd>{r.label}</dd>
                </div>
              ))}
            </dl>
            <div className="rcd-build-actions">
              <a href={LIVE_URL} target="_blank" rel="noopener noreferrer" className="rcd-build-live">
                Visit the live site <span aria-hidden="true">&rarr;</span>
              </a>
              <Link href={`/work/${SAUCE.slug}`} className="btn btn-ghost btn-md">Read the case study</Link>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
