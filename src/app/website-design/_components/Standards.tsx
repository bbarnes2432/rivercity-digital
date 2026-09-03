"use client";

import { useCallback, useEffect, useRef } from "react";
import Container from "@/app/_components/Container";
import SectionHeader from "@/app/_components/SectionHeader";
import { useStage } from "@/components/three/stage-context";

/* Standards — the checklist, with a constellation behind it once the Stage
 * exists: ~600 teal points that brighten toward the pointer and pull tighter
 * as each item reveals. Order emerging from noise. The list is the content;
 * without WebGL this is the same list on the same cream. */

const STANDARDS = [
  "Lighthouse 95+ on Performance, Accessibility, SEO, Best Practices",
  "First Contentful Paint under 1.2 seconds",
  "Largest Contentful Paint under 2.5 seconds",
  "Cumulative Layout Shift under 0.05",
  "Schema.org markup on every relevant page",
  "WCAG 2.1 AA accessibility — for real, not as a checkbox",
];

export default function Standards() {
  const { ConstellationView } = useStage();
  const section = useRef<HTMLElement>(null);
  const column = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const revealed = useRef(0);

  // 1.0 (wide) with nothing revealed → 0.55 (tight) with everything revealed.
  const getSpread = useCallback(() => 1 - 0.45 * revealed.current, []);
  // The text column, in the section's NDC x — the band the points dim inside.
  const getMask = useCallback((): [number, number] => {
    const s = section.current, c = column.current;
    if (!s || !c) return [-0.4, 0.4];
    const sr = s.getBoundingClientRect(), cr = c.getBoundingClientRect();
    const l = ((cr.left - sr.left) / sr.width) * 2 - 1;
    const r = ((cr.right - sr.left) / sr.width) * 2 - 1;
    return [l, r];
  }, []);

  useEffect(() => {
    const ul = list.current;
    if (!ul) return;
    const items = Array.from(ul.children) as HTMLElement[];
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.8;
      let n = 0;
      items.forEach((li) => { if (li.getBoundingClientRect().top < line) n++; });
      revealed.current = n / items.length;
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
    <section ref={section} className="section section--civic-deep rcd-standards" data-theme="dark">
      {ConstellationView && (
        <div className="rcd-standards-stage" aria-hidden="true">
          <ConstellationView track={section} getSpread={getSpread} getMask={getMask} />
        </div>
      )}
      <Container narrow>
        <div ref={column}>
          <SectionHeader
            eyebrow="Anatomy of a fast site"
            title="The standards we hold every build to."
            lede="Performance and accessibility aren't add-ons. They're the spec."
            align="left"
          />
          <ul ref={list} className="list-check fx-stagger" style={{ marginTop: 32 }}>
            {STANDARDS.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
