"use client";

import { useRef } from "react";
import { Globe, Rocket, ShoppingBag, RefreshCw, type LucideIcon } from "lucide-react";
import Container from "@/app/_components/Container";
import Section from "@/app/_components/Section";
import SectionHeader from "@/app/_components/SectionHeader";
import { useStage } from "@/components/three/stage-context";

/* What we build — four cards, each with a living glyph in its icon slot once
 * the Stage exists: pages fanning, a single glowing path, tiles reshuffling,
 * a wireframe turning solid. The lucide icon stays in the DOM underneath and
 * is exactly what shows without WebGL. Hover the card, not the square. */

type Kind = "panes" | "landing" | "grid" | "box";

const WHAT: { t: string; d: string; Icon: LucideIcon; kind: Kind }[] = [
  { t: "Marketing sites", d: "Custom-designed websites for restaurants, contractors, professional services, salons, retail. Built to convert.", Icon: Globe, kind: "panes" },
  { t: "Landing pages", d: "Single-purpose pages for ad campaigns or one-time launches. Quick to ship, sharp to convert.", Icon: Rocket, kind: "landing" },
  { t: "E-commerce", d: "Shopify and headless storefronts when you need product. Fast, custom-themed, search-ready.", Icon: ShoppingBag, kind: "grid" },
  { t: "Redesigns", d: "When the existing site is the constraint. We rebuild for speed, search, and the way customers actually use it.", Icon: RefreshCw, kind: "box" },
];

function Card({ t, d, Icon, kind }: (typeof WHAT)[number]) {
  const { GlyphView } = useStage();
  const card = useRef<HTMLElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  return (
    <article ref={card} className="rcd-list-card fx-lift" data-glyph={GlyphView ? "3d" : "icon"}>
      <div ref={slot} className="rcd-glyph" aria-hidden="true">
        <div className="rcd-list-card-icon">
          <Icon size={20} strokeWidth={1.8} />
        </div>
        {GlyphView && <GlyphView track={slot} hoverTrack={card} kind={kind} />}
      </div>
      <h3>{t}</h3>
      <p>{d}</p>
    </article>
  );
}

export default function WhatWeBuild() {
  return (
    <Section mode="working" className="section--bg-build">
      <Container>
        <SectionHeader
          eyebrow="What we build"
          title="Four kinds of work."
          lede="All custom. All hand-coded. All built to be found."
        />
        <div className="rcd-list-grid fx-stagger">
          {WHAT.map((w) => (
            <Card key={w.t} {...w} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
