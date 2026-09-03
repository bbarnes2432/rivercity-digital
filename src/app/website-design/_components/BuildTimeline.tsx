"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import Container from "@/app/_components/Container";
import SectionHeader from "@/app/_components/SectionHeader";
import { PROJECTS } from "@/app/work/_data";
import { useStage } from "@/components/three/stage-context";

/* §04 · The 14-day build — from coffee to launch, on a drafting table.
 *
 * The five cards are the page's own timeline, unchanged as content. Beside
 * them, one view holds the SAME slab as the build reveal — same geometry, same
 * texture, nothing new loads — stepping through five states as each card
 * comes up: an empty table, wireframes, flat design blocks, the full build,
 * and launch, where the slab lifts and a single ring pulses across the table.
 * That pulse is the beat the hero lattice plays on load. Bookends. */

const TIMELINE = [
  { n: "01", w: "Day 1", t: "Coffee", d: "We sit down — goals, customers, what's working, what's broken." },
  { n: "02", w: "Days 2–4", t: "Wireframes", d: "Page-by-page wireframes. You approve before any visual work." },
  { n: "03", w: "Days 5–8", t: "Design", d: "Custom design system + every page mocked. Real content, no lorem ipsum." },
  { n: "04", w: "Days 9–12", t: "Build", d: "Hand-coded — Next.js, fast, accessible. Schema and SEO baked in." },
  { n: "05", w: "Day 14", t: "Launch", d: "DNS, monitoring, analytics. We hand off the keys (we still answer the phone)." },
] as const;

const SAUCE = PROJECTS.find((p) => p.slug === "the-sauce-fix")!;

export default function BuildTimeline() {
  const { BuildView, request } = useStage();
  const section = useRef<HTMLElement>(null);
  const shot = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const stage = useRef(0);

  const getStage = useCallback(() => stage.current, []);

  useEffect(() => {
    const sec = section.current;
    const ol = list.current;
    if (!sec || !ol) return;
    const cards = Array.from(ol.querySelectorAll<HTMLElement>(".rcd-stage-card"));
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.68;
      // The stage is how many cards have risen past a line two-thirds down the
      // viewport: 0 before any, 4 once the last has.
      let n = 0;
      cards.forEach((c, i) => {
        if (c.getBoundingClientRect().top < line) n = i;
      });
      if (cards[0] && cards[0].getBoundingClientRect().top >= line) n = 0;
      if (stage.current !== n) {
        stage.current = n;
        cards.forEach((c, i) => c.toggleAttribute("data-active", i === n));
        sec.dataset.stage = String(n);
      }
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
    <section ref={section} className="section section--civic-deep rcd-tl" data-theme="dark" data-stage="0">
      <Container>
        <SectionHeader
          eyebrow="Stage 01 → 05 · The 14-day build"
          title="From coffee to launch."
          lede="A real timeline for a real marketing-site build. Bigger projects scale, but the rhythm is the same."
        />
        <div className="rcd-tl-grid">
          <div className="rcd-tl-stage">
            <div ref={shot} className="rcd-tl-shot" data-3d={BuildView ? "" : undefined}>
              <Image
                src={SAUCE.img}
                alt=""
                aria-hidden="true"
                width={1440}
                height={798}
                loading="lazy"
                sizes="(max-width: 900px) 92vw, 620px"
              />
              {BuildView && <BuildView track={shot} src={SAUCE.img} getStage={getStage} table />}
            </div>
          </div>
          <ol ref={list} className="rcd-tl-list">
            {TIMELINE.map((s, i) => (
              <li key={s.n} className="rcd-stage-card rcd-tl-card" data-active={i === 0 ? "" : undefined}>
                <div className="rcd-stage-num">{s.w.toUpperCase()}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
