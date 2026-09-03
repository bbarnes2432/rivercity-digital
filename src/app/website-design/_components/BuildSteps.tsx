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
 * as you scroll. On the other, a whole site being built in three dimensions
 * on the shared canvas (BuildSite): the outline drawn in, the blocks
 * filling with colour, the parts lifting to their depth, the headline set,
 * and at the last step the launch — the site turns to face you and the
 * buttons come forward. Scroll is the only control; the picture is exactly
 * as far along as the step beside it. Without a canvas, one of our finished
 * sites stands in. */

const STEPS = [
  {
    day: "Plan", t: "Define the project",
    d: "We discuss your business, customers, and goals. Together, we decide what the website needs to explain and what visitors should do next.",
    points: ["Review your current site and priorities", "Agree on the pages and features you need", "Confirm the scope, price, and timeline"],
    get: "A page list and a written project plan.",
  },
  {
    day: "Layout", t: "Plan the pages",
    d: "We map out the content and navigation before working on the visual design, so you can see how customers will move through the site.",
    points: ["Organize services and key information", "Place reviews and calls to action where they help", "Plan layouts for phone and desktop screens"],
    get: "Page layouts to review and approve.",
  },
  {
    day: "Design", t: "Review the design",
    d: "We turn the approved layouts into a complete design using your branding, copy, and images. You give feedback before we start development.",
    points: ["Apply typography, colors, and imagery", "Show how the pages look on desktop and mobile", "Refine the design through two rounds of revisions"],
    get: "Finished page designs ready for your approval.",
  },
  {
    day: "Development", t: "Build and test",
    d: "We develop the approved site and check the details that affect daily use, including load times, mobile layouts, forms, and navigation.",
    points: ["Set up page titles, descriptions, and search markup", "Optimize images and check performance", "Test links, forms, and layouts across devices"],
    get: "A working preview you can review on your own devices.",
  },
  {
    day: "Launch", t: "Go live",
    d: "Once you approve the site, we connect your domain and complete the launch checks. We walk you through access and support for future changes.",
    points: ["Connect the domain and secure connection", "Set up redirects for URLs that have changed", "Check analytics and Google Search Console"],
    get: "Your live website, site access, and a clear point of contact.",
  },
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
            <p className="t-eyebrow">From project plan to launch</p>
            <h2 className="t-h2">Know what happens next.</h2>
          </header>
          <div className="rcd-steps-grid">
            <ol className="rcd-steps-list">
              {STEPS.map((s, i) => (
                <li key={s.t} className="rcd-step" data-active={i === step ? "" : undefined} aria-hidden={i === step ? undefined : "true"}>
                  <span className="rcd-step-day">Step {i + 1} of {STEPS.length} · {s.day}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                  <ul className="rcd-step-points">
                    {s.points.map((pt) => <li key={pt}>{pt}</li>)}
                  </ul>
                  <p className="rcd-step-get"><span>You get</span> {s.get}</p>
                </li>
              ))}
              <li className="rcd-steps-rail" aria-hidden="true">
                {STEPS.map((s, i) => <i key={s.t} data-on={i <= step ? "" : undefined} />)}
              </li>
            </ol>
            <div ref={shot} className="rcd-steps-shot" data-3d={BuildView ? "" : undefined}>
              <Image src={SAUCE.img} alt={`${SAUCE.name} — the finished site`} width={1440} height={798} loading="lazy" sizes="(max-width: 900px) 92vw, 720px" />
              {BuildView && <BuildView track={shot} getStage={getStage} />}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
