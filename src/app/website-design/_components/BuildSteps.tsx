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
    day: "Day 1", t: "Coffee",
    d: "We sit down with you — goals, customers, what's working, what's broken, what a good month looks like. We leave with a page list and a plan, not a mood board.",
    points: ["Who your customers are and what they type into Google", "Every page the site needs, and the one thing each page must do", "The phone number, the form, the booking link — where conversions happen"],
    get: "A page list and a written plan, in your inbox the same day.",
  },
  {
    day: "Days 2–4", t: "Wireframes",
    d: "Every page drawn as boxes before a single colour: where the headline goes, where the phone number goes, what a visitor sees first on a phone.",
    points: ["Phone layouts first, since that is where most visitors are", "Headline, proof, and the call to action above the fold on every page", "Navigation that gets a stranger to the phone in two taps"],
    get: "Clickable wireframes of every page. You approve them before any visual work starts.",
  },
  {
    day: "Days 5–8", t: "Design",
    d: "A design system for your brand — type, colour, spacing, components — and every page mocked with your real words and photos. No lorem ipsum, no stock template.",
    points: ["Type and colour chosen for your business, not picked from a theme", "Real photography and real copy in every mock, so what you approve is what you get", "Buttons, cards and forms designed once and reused everywhere"],
    get: "Finished designs of every page, on desktop and phone, with two rounds of changes.",
  },
  {
    day: "Days 9–12", t: "Build",
    d: "Hand-coded on Next.js. Schema markup, meta, sitemaps and analytics baked in. Tested on real phones. Lighthouse in the green before you ever see it.",
    points: ["Schema.org markup on every page so Google and AI search read it right", "Images sized and served for speed; nothing over budget", "Tested on real iPhones and Androids, not a simulator"],
    get: "A staging link you can open on your own phone, with a Lighthouse report attached.",
  },
  {
    day: "Day 14", t: "Launch",
    d: "DNS, SSL, monitoring, Search Console. We hand you the keys and the code — and we still answer the phone.",
    points: ["Domain, certificate and redirects handled, so nothing you had already earned is lost", "Search Console and analytics connected and checked", "Uptime monitoring that pages us, not you"],
    get: "A live site, the repository in your name, and a number you can call.",
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
