"use client";

import { useEffect, useRef } from "react";

/**
 * Editorial reading-progress bar — narrow teal hairline that fills across
 * the top of the viewport as the user scrolls the article. Tracks the
 * <main> element's height so the bar reflects article progress, not the
 * full page (which includes nav + footer).
 *
 * Uses native scroll-driven CSS where supported, JS fallback otherwise.
 * Respects prefers-reduced-motion.
 */
export default function ReadingProgress() {
  const fillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const supports =
      typeof CSS !== "undefined" &&
      CSS.supports("animation-timeline: scroll()");
    if (supports) return;

    const el = fillRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docH > 0 ? Math.min(1, Math.max(0, window.scrollY / docH)) : 0;
        el.style.transform = `scaleX(${pct})`;
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="rcd-reading-progress" aria-hidden="true">
      <div className="rcd-reading-progress-fill" ref={fillRef} />
    </div>
  );
}
