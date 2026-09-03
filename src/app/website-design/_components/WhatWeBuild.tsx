"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, Rocket, ShoppingBag, RefreshCw, type LucideIcon } from "lucide-react";
import Container from "@/app/_components/Container";
import SectionHeader from "@/app/_components/SectionHeader";

/* What we build — four kinds of work as four dark glass cards, two by two,
 * each tilting toward the cursor in three dimensions with a teal glow that
 * follows the pointer, the icon and the words lifted off the card at
 * different depths, and three things you get with each. Plain CSS
 * transforms driven by custom properties; no canvas. Under reduced motion,
 * or on touch, the cards are flat and just as readable. */

const WHAT: { n: string; t: string; d: string; gets: [string, string, string]; Icon: LucideIcon }[] = [
  { n: "01", t: "Marketing sites", d: "Custom-designed websites for restaurants, contractors, professional services, salons, retail. Built to convert.", gets: ["Custom design, no theme", "Schema and SEO built in", "Lighthouse 95+"], Icon: Globe },
  { n: "02", t: "Landing pages", d: "Single-purpose pages for ad campaigns or one-time launches. Quick to ship, sharp to convert.", gets: ["One page, one goal", "Built for paid traffic", "Live in days"], Icon: Rocket },
  { n: "03", t: "E-commerce", d: "Shopify and headless storefronts when you need product. Fast, custom-themed, search-ready.", gets: ["Shopify or headless", "Fast checkout", "Product pages that rank"], Icon: ShoppingBag },
  { n: "04", t: "Redesigns", d: "When the existing site is the constraint. We rebuild for speed, search, and the way customers actually use it.", gets: ["Rankings kept, redirects mapped", "Faster on day one", "Same phone number, new site"], Icon: RefreshCw },
];

function Card({ n, t, d, gets, Icon }: (typeof WHAT)[number]) {
  const el = useRef<HTMLElement>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const card = el.current;
    if (!card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    let nx = 0, ny = 0;
    const apply = () => {
      raf = 0;
      card.style.setProperty("--ry", `${(nx * 8).toFixed(2)}deg`);
      card.style.setProperty("--rx", `${(-ny * 8).toFixed(2)}deg`);
      card.style.setProperty("--mx", `${((nx + 1) * 50).toFixed(1)}%`);
      card.style.setProperty("--my", `${((ny + 1) * 50).toFixed(1)}%`);
    };
    const move = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const enter = (e: PointerEvent) => { setHover(true); move(e); };
    const leave = () => {
      setHover(false);
      nx = 0; ny = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    card.addEventListener("pointermove", move, { passive: true });
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    return () => {
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <article ref={el} className="rcd-tilt" data-hover={hover ? "" : undefined}>
      <div className="rcd-tilt-top">
        <span className="rcd-tilt-n">{n}</span>
        <div className="rcd-tilt-icon" aria-hidden="true">
          <Icon size={26} strokeWidth={1.6} />
        </div>
      </div>
      <h3>{t}</h3>
      <p>{d}</p>
      <ul className="rcd-tilt-gets">
        {gets.map((g) => <li key={g}>{g}</li>)}
      </ul>
    </article>
  );
}

export default function WhatWeBuild() {
  return (
    <section className="section section--civic-deep rcd-what" data-theme="dark">
      <Container>
        <SectionHeader
          className="fx-reveal"
          eyebrow="What we build"
          title="Four kinds of work."
          lede="All custom. All hand-coded. All built to be found."
        />
        <div className="rcd-tilt-grid fx-stagger">
          {WHAT.map((w) => (
            <Card key={w.t} {...w} />
          ))}
        </div>
      </Container>
    </section>
  );
}
