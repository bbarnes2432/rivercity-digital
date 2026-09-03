"use client";

import { useRef } from "react";
import { Globe, Rocket, ShoppingBag, RefreshCw, type LucideIcon } from "lucide-react";
import Container from "@/app/_components/Container";
import Section from "@/app/_components/Section";
import SectionHeader from "@/app/_components/SectionHeader";
import { useStage } from "@/components/three/stage-context";

/* What we build — four cards, each topped by a navy stage tile holding a
 * living glyph once the Stage exists: pages fanning, a single glowing path,
 * tiles reshuffling, a wireframe turning solid. The lucide icon sits in the
 * tile underneath and is exactly what shows without WebGL. Hover the card. */

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
    <article ref={card} className="rcd-list-card rcd-what-card fx-lift" data-glyph={GlyphView ? "3d" : "icon"}>
      {/* The stage: a navy tile, 16:10, the full width of the card. The icon
          is the fallback, drawn large in teal; the glyph paints over it. */}
      <div ref={slot} className="rcd-glyph-stage" aria-hidden="true">
        <div className="rcd-glyph-icon">
          <Icon size={44} strokeWidth={1.5} />
        </div>
        {GlyphView && <GlyphView track={slot} hoverTrack={card} kind={kind} />}
      </div>
      <div className="rcd-what-body">
        <h3>{t}</h3>
        <p>{d}</p>
      </div>
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
