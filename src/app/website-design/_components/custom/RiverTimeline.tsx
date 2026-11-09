"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import BookCallLink from "@/app/_components/BookCallLink";
import CallLink from "@/app/_components/CallLink";
import { useScrollProgress } from "./use-scroll-progress";

/* How it works, custom look (Brandon's Nov 9, 2026 brief, pages 6 and 10).
 * The river timeline replaces all three earlier process sections. On wide
 * screens the line waves across the page, drawing itself as you scroll and
 * lighting each step as it reaches it; on phones it runs down the left. With
 * reduced motion or the pause toggle, the finished line shows with every step
 * lit. Copy is page 10, word for word. */
const STEPS = [
  { title: "Free intro call", text: "Your business, your customers, and what your site needs to do." },
  { title: "Agree on the plan", text: "Pages, features, timeline, and price, in writing before we build." },
  { title: "Design you approve", text: "You see and approve the design before we build." },
  { title: "Build and launch", text: "Most sites launch in about 2–3 weeks once content is ready." },
  { title: "Keep growing", text: "Care plans for updates, plus SEO and ads when you’re ready. You work directly with the people who built your site." },
];

// Node positions in the SVG's 1200 × 640 drawing: high, low, high, low, high.
// Steps on a crest carry their text above the line, steps in a dip below it,
// so the line never runs through the words.
const NODES = [[40, 280], [290, 420], [540, 280], [790, 420], [1040, 280]] as const;
const PATH = "M40 280 C 140 280, 190 420, 290 420 S 440 280, 540 280 S 690 420, 790 420 S 940 280, 1040 280 S 1165 350, 1200 375";
const FALLBACK = [0, 0.24, 0.48, 0.72, 0.94];

export default function RiverTimeline() {
  const section = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const [marks, setMarks] = useState<number[]>(FALLBACK);
  const { progress, still } = useScrollProgress(section, 0.82, 0.55);

  // Where each step sits along the line, as a share of the whole line: along
  // the wave on wide screens, down the list on phones.
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = path.current;
      const steps = list.current ? Array.from(list.current.children) as HTMLElement[] : [];
      const wide = line && line.getBoundingClientRect().width > 0;
      if (wide && line) {
        const total = line.getTotalLength();
        setMarks(NODES.map(([x]) => {
          let low = 0, high = total;
          for (let i = 0; i < 24; i++) {
            const mid = (low + high) / 2;
            if (line.getPointAtLength(mid).x < x) low = mid; else high = mid;
          }
          return low / total;
        }));
      } else if (list.current && steps.length) {
        const height = list.current.getBoundingClientRect().height || 1;
        setMarks(steps.map(step => Math.min(1, (step.offsetTop + 14) / height)));
      }
    };
    const queue = () => { if (!frame) frame = window.requestAnimationFrame(measure); };
    queue();
    window.addEventListener("resize", queue);
    return () => { window.removeEventListener("resize", queue); if (frame) window.cancelAnimationFrame(frame); };
  }, []);

  const lit = (index: number) => still || progress >= marks[index] - 0.005;

  return (
    <section className="cl-section cl-how" id="how-it-works" aria-labelledby="how-heading">
      <div className="cl-container">
        <div className="cl-how-head">
          <div>
            <p className="cl-eyebrow">How it works</p>
            <h2 id="how-heading" className="cl-heading">From first call to launch.<span className="cl-second">And beyond.</span></h2>
          </div>
          <p className="cl-slim-cta">
            Like what you see? <BookCallLink context="website-design-timeline" className="cl-text-link">Book a free call <ArrowRight size={14} aria-hidden="true" /></BookCallLink>
            <span className="cl-slim-cta-call">or call <CallLink context="website-design-timeline" className="cl-text-link cl-text-link-quiet" icon={false} /></span>
          </p>
        </div>
        <div className="cl-river" ref={section} style={{ "--cl-progress": progress } as CSSProperties} data-still={still || undefined}>
          <svg className="cl-river-svg" viewBox="0 0 1200 640" aria-hidden="true">
            <path className="cl-river-track" d={PATH} />
            <path ref={path} className="cl-river-drawn" d={PATH} pathLength={1} style={{ strokeDashoffset: 1 - progress }} />
            {NODES.map(([x, y], index) => (
              <g key={x} className="cl-river-node" data-lit={lit(index) || undefined}>
                <circle className="cl-river-halo" cx={x} cy={y} r="17" />
                <circle className="cl-river-dot" cx={x} cy={y} r="7.5" />
              </g>
            ))}
          </svg>
          <span className="cl-river-rail" aria-hidden="true"><span style={{ transform: `scaleY(${progress})` }} /></span>
          <ol className="cl-steps" ref={list}>
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="cl-step"
                data-lit={lit(index) || undefined}
                data-position={index % 2 ? "low" : "high"}
                style={{ "--x": `${((NODES[index][0] - 12) / 1200) * 100}%` } as CSSProperties}
              >
                <span className="cl-step-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
