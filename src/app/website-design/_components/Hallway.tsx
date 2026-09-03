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

/* Four lines at the top of the hall, spread along the walk with room
 * between them, each fading out before the next fades in. Bands are
 * fractions of the walk; outside a band nothing is shown. */
const HEADLINES: { from: number; to: number; text: string }[] = [
  { from: 0, to: 0.1, text: "Eight sites. No templates. Walk the hall." },
  { from: 0.16, to: 0.38, text: "Built for the phone call, not the award." },
  { from: 0.44, to: 0.66, text: "Designed to be found on Google." },
  { from: 0.72, to: 0.92, text: "Yours to keep. No subscription, no lock-in." },
];
const bandFor = (p: number) => HEADLINES.findIndex((h) => p >= h.from && p < h.to);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export default function Hallway() {
  const { enabled, request } = useStage();
  const section = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(-1);
  const [band, setBand] = useState(0);

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
      const show = world.active && p > 0.02 && p < 0.9 && world.caption.on ? world.index : -1;
      setIndex((i) => (i === show ? i : show));
      headline();
      place();
      veil();
    };
    // The caption hangs under its screen, wherever the screen is.
    // Which headline the walk is at. A change fades the current one out,
    // then brings the next in — never a hard cut.
    // Which headline the walk is at; the CSS fades the old one out and the
    // new one in. Same value is a free no-op.
    const headline = () => {
      const want = bandFor(world.progress);
      setBand((b) => (b === want ? b : want));
    };
    // The last stretch fades to the page's own navy, in the DOM, so what
    // meets the next chapter is the same colour it is.
    const veil = () => {
      const v = el.querySelector<HTMLElement>(".rcd-hall-veil");
      if (v) v.style.opacity = String(Math.min(1, Math.max(0, (world.progress - 0.9) / 0.08)));
    };
    const place = () => {
      const cap = el.querySelector<HTMLElement>(".rcd-hall-cap[data-active]");
      if (!cap) return;
      const half = cap.offsetWidth / 2 + 16;
      const x = Math.min(window.innerWidth - half, Math.max(half, world.caption.x));
      cap.style.left = `${x.toFixed(1)}px`;
      cap.style.top = `${Math.min(window.innerHeight - 40, world.caption.y).toFixed(1)}px`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    // The world says which screen is beside the visitor. The camera keeps
    // moving after the wheel stops, so poll rather than listen; setState
    // with the same value is free.
    const tick = () => {
      poll = requestAnimationFrame(tick);
      if (!world.active) return;
      const p = world.progress;
      const show = p > 0.02 && p < 0.9 && world.caption.on ? world.index : -1;
      setIndex((i) => (i === show ? i : show));
      headline();
      place();
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
    <section ref={section} className="rcd-hall" data-3d={enabled ? "" : undefined} data-index={index} aria-label="Selected work">
      <div className="rcd-hall-stage">
        <div className="rcd-hall-veil" aria-hidden="true" />
        <Container>
          <header className="rcd-hall-head">
            <p className="t-eyebrow">Selected work · Filed from St. Louis</p>
            {/* All four in the same place; the one for this stretch of the walk is on. */}
            <div className="rcd-hall-headlines">
              {HEADLINES.map((h, i) => (
                <h2 key={h.text} className="rcd-hall-headline" data-on={band === i ? "" : undefined} aria-hidden={band === i ? undefined : "true"}>{h.text}</h2>
              ))}
            </div>
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
