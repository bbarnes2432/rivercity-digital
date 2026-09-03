"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Container from "@/app/_components/Container";
import { PROJECTS } from "@/app/work/_data";
import { useStage } from "@/components/three/stage-context";

/* The build, step by step.
 *
 * A tall section with a sticky, viewport-high stage. On one side, one step
 * at a time — only the current step is on screen, and the next replaces it
 * as you scroll. On the other, one of our sites being built on the shared
 * canvas: the drafting table, the wireframe drawing in, the flat design
 * blocks developing like a print, the finished build, and at the last step
 * the launch — the slab lifts, lit, and a ring pulses across the table.
 * Scroll is the only control; the picture is exactly as far along as the
 * step beside it. Without a canvas, the finished site stands in. */

const STEPS = [
  { day: "Day 1", t: "Coffee", d: "We sit down with you — goals, customers, what's working, what's broken, what a good month looks like. We leave with a page list and a plan, not a mood board." },
  { day: "Days 2–4", t: "Wireframes", d: "Every page drawn as boxes before a single colour: where the headline goes, where the phone number goes, what a visitor sees first on a phone. You approve the structure before any visual work starts." },
  { day: "Days 5–8", t: "Design", d: "A design system for your brand — type, colour, spacing, components — and every page mocked with your real words and photos. No lorem ipsum, no stock template." },
  { day: "Days 9–12", t: "Build", d: "Hand-coded on Next.js. Schema markup, meta, sitemaps and analytics baked in. Tested on real phones. Lighthouse in the green before you ever see it." },
  { day: "Day 14", t: "Launch", d: "DNS, SSL, monitoring, Search Console. We hand you the keys and the code — and we still answer the phone." },
] as const;

const SAUCE = PROJECTS.find((p) => p.slug === "the-sauce-fix")!;

export default function BuildSteps() {
  const { BuildView, request } = useStage();
  const section = useRef<HTMLElement>(null);
  const shot = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [step, setStep] = useState(0);

  // The slab's stage is continuous, 0 → 4 across the section, so the picture
  // develops between steps rather than jumping at them.
  const getStage = useCallback(() => progress.current * 4, []);

  useEffect(() => {
    const sec = section.current;
    if (!sec) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / (r.height - vh)));
      progress.current = p;
      const n = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
      setStep((s) => (s === n ? s : n));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { request(); io.disconnect(); } }, { rootMargin: "600px 0px" });
    io.observe(sec);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [request]);

  return (
    <section ref={section} className="section section--civic-deep rcd-steps" data-theme="dark" data-step={step} aria-label="How we build, step by step">
      <div className="rcd-steps-stage">
        <Container>
          <header className="rcd-steps-head">
            <p className="t-eyebrow">The build · 14 days</p>
            <h2 className="t-h2">Watch one get built.</h2>
          </header>
          <div className="rcd-steps-grid">
            <ol className="rcd-steps-list">
              {STEPS.map((s, i) => (
                <li key={s.t} className="rcd-step" data-active={i === step ? "" : undefined} aria-hidden={i === step ? undefined : "true"}>
                  <span className="rcd-step-day">Step {i + 1} of {STEPS.length} · {s.day}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </li>
              ))}
              <li className="rcd-steps-rail" aria-hidden="true">
                {STEPS.map((s, i) => <i key={s.t} data-on={i <= step ? "" : undefined} />)}
              </li>
            </ol>
            <div ref={shot} className="rcd-steps-shot" data-3d={BuildView ? "" : undefined}>
              <Image src={SAUCE.img} alt={`${SAUCE.name} — the finished site`} width={1440} height={798} loading="lazy" sizes="(max-width: 900px) 92vw, 720px" />
              {BuildView && <BuildView track={shot} src={SAUCE.img} getStage={getStage} table />}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
