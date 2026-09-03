"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/* The software bill, made visible. Thirty-six cells, one per month at $500,
 * light up in sequence the first time the panel scrolls into view while the
 * total counts up to $18,000. The final figure is in the markup from the
 * start, so it is there before, without, and after the animation. */

const MONTHS = 36;
const PER_MONTH = 500;
const TOTAL = MONTHS * PER_MONTH;
const STEP_MS = 55;
const YEARS = ["Year 1", "Year 2", "Year 3"];

export default function CostStack() {
  const root = useRef<HTMLDivElement>(null);
  const amount = useRef<HTMLParagraphElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setOn(true);
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!on) return;
    const out = amount.current;
    if (!out) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dur = MONTHS * STEP_MS + 350;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      // A frame's timestamp can predate the performance.now() taken in the
      // effect, so clamp below as well as above or the first value goes
      // negative.
      const k = Math.max(0, Math.min(1, (t - t0) / dur));
      const eased = 1 - Math.pow(1 - k, 2.2);
      const v = k < 1 ? Math.round((TOTAL * eased) / 50) * 50 : TOTAL;
      out.textContent = `$${v.toLocaleString("en-US")}`;
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on]);

  return (
    <div ref={root} className="rcd-systems-stack" data-on={on ? "" : undefined}>
      <p className="rcd-systems-label">See what monthly software costs add up to</p>
      <p className="rcd-systems-legend"><i aria-hidden="true" />$500 / month <small>· one cell per month</small></p>
      <div className="rcd-systems-months" aria-hidden="true">
        {YEARS.map((y, row) => (
          <div className="rcd-systems-year" key={y}>
            <em>{y}</em>
            {Array.from({ length: 12 }, (_, m) => (
              <i key={m} style={{ "--i": row * 12 + m } as CSSProperties} />
            ))}
          </div>
        ))}
      </div>
      <p ref={amount} className="rcd-systems-amount">${TOTAL.toLocaleString("en-US")}</p>
      <p className="rcd-systems-over">over three years in subscriptions</p>
      <p className="rcd-systems-note">Illustrative software spend, not a custom build quote or savings estimate.</p>
      <span className="sr-only">{PER_MONTH} dollars a month for {MONTHS} months.</span>
    </div>
  );
}
