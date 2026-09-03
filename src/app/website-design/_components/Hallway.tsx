"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Container from "@/app/_components/Container";
import { PROJECTS, type CaseStudy } from "@/app/work/_data";
import { useStage } from "@/components/three/stage-context";
import { world } from "@/components/three/world-state";

/* The hallway — the work, first, as a walk.
 *
 * A tall section with a sticky, viewport-high stage. The shared canvas draws
 * the room behind it; this owns the words. As the visitor scrolls, the
 * camera walks the hall and the eight screens pass left and right; the world
 * reports which screen is beside the visitor, and that screen's caption pops
 * up, centred at the foot of the hall, with its result and its links. Every
 * caption is real text with real links, and when there is no canvas the
 * same section is a plain grid of the eight screenshots — the floor, not a
 * degraded state. */

const ORDER = [
  "lucky-puppy",
  "shear-fantasy",
  "lovely-nails",
  "pet-planet",
  "the-sauce-fix",
  "mend-health",
  "the-wellness-collective",
  "confetti-and-co",
];
const LIVE: Record<string, string> = {
  "the-sauce-fix": "https://thesaucefix.com",
  "mend-health": "https://www.mendhealthmo.com/",
  "the-wellness-collective": "https://wellnesscollectivehub.com/",
};
const SITES = ORDER.map((s) => PROJECTS.find((p) => p.slug === s)).filter((p): p is CaseStudy => !!p);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export default function Hallway() {
  const { enabled, request } = useStage();
  const section = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(-1);
  const [start, setStart] = useState(true);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let raf = 0;
    let poll = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      world.progress = clamp01(-r.top / (r.height - vh));
      // The room's lights come up as the section arrives, over most of a
      // viewport, so the hero hands over to darkness and the hall lights up.
      world.enter = clamp01((vh - r.top) / (vh * 0.9));
      world.active = r.top < vh && r.bottom > 0;
      // Scroll also refreshes the caption, so it never waits on the poll.
      // No caption in the first steps (the heading has the floor) or at the
      // door (the last screen has passed; the next chapter fills the view).
      const p = world.progress;
      const show = world.active && p > 0.02 && p < 0.9 ? world.index : -1;
      setIndex((i) => (i === show ? i : show));
      setStart(p < 0.03);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    // The world says which screen is beside the visitor. The camera keeps
    // moving after the wheel stops, so poll rather than listen; setState
    // with the same value is free.
    const tick = () => {
      poll = requestAnimationFrame(tick);
      if (!world.active) return;
      const p = world.progress;
      const show = p > 0.02 && p < 0.9 ? world.index : -1;
      setIndex((i) => (i === show ? i : show));
      setStart(p < 0.03);
    };
    update();
    poll = requestAnimationFrame(tick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { request(); io.disconnect(); } }, { rootMargin: "600px 0px" });
    io.observe(el);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      cancelAnimationFrame(poll);
      io.disconnect();
      world.active = false;
    };
  }, [request]);

  return (
    <section ref={section} className="rcd-hall" data-3d={enabled ? "" : undefined} data-index={index} data-start={start ? "" : undefined} aria-label="Selected work">
      <div className="rcd-hall-stage">
        <Container>
          <header className="rcd-hall-head">
            <p className="t-eyebrow">Selected work · Filed from St. Louis</p>
            <h2 className="t-display-2">Walk the hall.</h2>
            <p className="t-lede">Eight sites we built, hung where you can see them. Keep scrolling.</p>
          </header>

          <ol className="rcd-hall-caps">
            {SITES.map((p, i) => {
              const live = LIVE[p.slug];
              const r0 = p.results[0];
              return (
                <li key={p.slug} className="rcd-hall-cap" data-active={i === index ? "" : undefined} aria-hidden={i === index ? undefined : "true"}>
                  <span className="rcd-hall-cap-n">{String(i + 1).padStart(2, "0")} / {String(SITES.length).padStart(2, "0")} · {p.sector} · {p.where}</span>
                  <h3 className="rcd-hall-cap-name">{p.name}</h3>
                  {r0 && <p className="rcd-hall-cap-result"><b>{r0.value}</b> {r0.label}</p>}
                  <p className="rcd-hall-cap-links">
                    <Link href={`/work/${p.slug}`} className="btn btn-primary btn-sm" tabIndex={i === index ? 0 : -1}>Read the case study</Link>
                    {live && <a href={live} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" tabIndex={i === index ? 0 : -1}>Visit the live site</a>}
                  </p>
                </li>
              );
            })}
          </ol>
        </Container>
      </div>

      {/* The floor: without a canvas this is the whole section — eight
          screenshots in a grid, every one a real image and a real link. With
          the canvas it is hidden, and the walk is the section. */}
      <div className="rcd-hall-fallback">
        <Container>
          <ul className="rcd-hall-grid">
            {SITES.map((p) => (
              <li key={p.slug}>
                <Link href={`/work/${p.slug}`}>
                  <Image src={p.img} alt={`${p.name} — ${p.sector} in ${p.where}`} width={1440} height={798} loading="lazy" sizes="(max-width: 720px) 92vw, 45vw" />
                  <span>{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
}
