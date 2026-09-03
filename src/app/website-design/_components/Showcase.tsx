"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import Container from "@/app/_components/Container";
import SectionHeader from "@/app/_components/SectionHeader";
import { PROJECTS } from "@/app/work/_data";
import { useStage, type ShowcaseKind } from "@/components/three/stage-context";

/* What's possible — three demonstrations, running live in the page.
 *
 * After the hallway has shown the work, this shows the kind of thing a
 * template cannot do, each one a small piece of hand-written WebGL on the
 * shared canvas: a site pulled apart into its components, a surface that
 * answers the cursor, and a word that becomes another word. The copy is the
 * pitch; the tile is the proof. Without a canvas each tile is the still it
 * describes — a screenshot, or the word set in type. */

const SAUCE = PROJECTS.find((p) => p.slug === "the-sauce-fix")!;
const PET = PROJECTS.find((p) => p.slug === "pet-planet")!;

type Demo = { kind: ShowcaseKind; n: string; t: string; d: string; hint: string; src?: string; alt?: string };

const DEMOS: Demo[] = [
  {
    kind: "layers",
    n: "01",
    t: "Built in parts.",
    d: "A template is one flat picture with your logo pasted on. Ours is built in parts — header, hero, menu, story, footer — each its own component, each with its own decisions. That is why a change to one never breaks the others.",
    hint: "Scroll to pull it apart · move to turn it",
    src: SAUCE.img,
    alt: `${SAUCE.name} — the site, in layers`,
  },
  {
    kind: "ripple",
    n: "02",
    t: "Reads the room.",
    d: "Move across it. The surface answers your cursor — a few lines of shader, written for this page, not a plugin bolted on. We use moments like this sparingly, where a visitor is deciding, and never where they slow anyone down.",
    hint: "Move your cursor across it",
    src: PET.img,
    alt: `${PET.name} — the site, as a surface`,
  },
  {
    kind: "words",
    n: "03",
    t: "Template becomes custom.",
    d: "Nine thousand points, set in our own type, and one word becoming another as you scroll. Type, motion and layout are written for the business every time — never picked from a theme and never the same twice.",
    hint: "Scroll to change the word · push the cursor through it",
  },
];

function Tile({ demo }: { demo: Demo }) {
  const { ShowcaseView } = useStage();
  const box = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const getProgress = useCallback(() => progress.current, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      // 0 as the tile's top reaches the bottom of the viewport, 1 once it is
      // centred — the same scrubber the build reveal uses.
      progress.current = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.5 + r.height * 0.5)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <figure className="rcd-show-tile fx-reveal" data-kind={demo.kind}>
      <div ref={box} className="rcd-show-stage" data-3d={ShowcaseView ? "" : undefined}>
        {demo.src ? (
          <Image src={demo.src} alt={demo.alt ?? ""} width={1440} height={798} loading="lazy" sizes="(max-width: 900px) 92vw, 720px" />
        ) : (
          <div className="rcd-show-words" aria-hidden="true"><span>Custom</span></div>
        )}
        {ShowcaseView && <ShowcaseView track={box} kind={demo.kind} src={demo.src} getProgress={getProgress} />}
      </div>
      <figcaption className="rcd-show-cap">
        <span className="rcd-show-n">{demo.n} / 03</span>
        <h3>{demo.t}</h3>
        <p>{demo.d}</p>
        <span className="rcd-show-hint">{demo.hint}</span>
      </figcaption>
    </figure>
  );
}

export default function Showcase() {
  const { request } = useStage();
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = section.current;
    if (!sec) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { request(); io.disconnect(); } }, { rootMargin: "600px 0px" });
    io.observe(sec);
    return () => io.disconnect();
  }, [request]);

  return (
    <section ref={section} className="section section--civic-deep rcd-show" data-theme="dark">
      <Container>
        <SectionHeader
          className="fx-reveal"
          eyebrow="What's possible · Live, not a video"
          title="Things a template can't do."
          lede="Three small demonstrations, running right now in this page. Every one is hand-written — the same way we would build yours."
        />
        <div className="rcd-show-list">
          {DEMOS.map((demo) => (
            <Tile key={demo.kind} demo={demo} />
          ))}
        </div>
      </Container>
    </section>
  );
}
