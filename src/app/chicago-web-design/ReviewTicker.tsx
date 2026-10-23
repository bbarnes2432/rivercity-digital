"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import styles from "./ChicagoReviews.module.css";

// A finite, swipeable row keeps every review and source link accessible.
// Advancing one card at a time leaves a readable pause between movements.
export default function ReviewTicker({ children, count }: { children: ReactNode; count: number }) {
  const row = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const interacting = useRef(false);

  function advance(direction: number, automatic = false) {
    const element = row.current;
    if (!element) return;
    const step = (element.firstElementChild?.getBoundingClientRect().width ?? 360) + 18;
    const end = element.scrollWidth - element.clientWidth;
    const target = direction > 0 && element.scrollLeft >= end - 2
      ? 0
      : direction < 0 && element.scrollLeft <= 2 ? end : element.scrollLeft + step * direction;
    element.scrollTo({ left: Math.max(0, Math.min(end, target)), behavior: reducedMotion ? "instant" : "smooth" });
    if (!automatic) setPaused(true);
  }

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = row.current;
    if (!element || paused || reducedMotion || count < 2) return;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.3 });
    observer.observe(element);
    const timer = window.setInterval(() => {
      if (!visible || document.hidden || interacting.current || element.contains(document.activeElement)) return;
      const end = element.scrollWidth - element.clientWidth;
      if (end <= 1) return;
      const step = (element.firstElementChild?.getBoundingClientRect().width ?? 360) + 18;
      element.scrollTo({ left: element.scrollLeft >= end - 2 ? 0 : Math.min(end, element.scrollLeft + step), behavior: "smooth" });
    }, 7000);
    return () => { observer.disconnect(); window.clearInterval(timer); };
  }, [paused, reducedMotion, count]);

  return <div className={styles.ticker}>
    <div className={styles.tickerTools}>
      <p>Real experiences. In our clients’ words.</p>
      {count > 1 && <div className={styles.controls}>
        {!reducedMotion && <button type="button" onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? "Resume review scrolling" : "Pause review scrolling"}>
          {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}{paused ? "Resume" : "Pause"}
        </button>}
        <button type="button" aria-label="Previous reviews" onClick={() => advance(-1)}><ArrowLeft size={18} aria-hidden="true" /></button>
        <button type="button" aria-label="Next reviews" onClick={() => advance(1)}><ArrowRight size={18} aria-hidden="true" /></button>
      </div>}
    </div>
    <div ref={row} className={styles.reviewRow} role="region" aria-label="Client reviews. Swipe or use the arrow buttons to browse." tabIndex={0}
      onPointerEnter={() => { interacting.current = true; }} onPointerLeave={() => { interacting.current = false; }}
      onTouchStart={() => setPaused(true)} onWheel={() => setPaused(true)}
      onKeyDown={(event) => { if (event.target !== event.currentTarget) return; if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); advance(event.key === "ArrowRight" ? 1 : -1); } }}>
      {children}
    </div>
  </div>;
}
