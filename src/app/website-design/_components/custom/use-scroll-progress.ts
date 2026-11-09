"use client";

import { RefObject, useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useMotionPaused } from "@/app/_components/showcase/motion-pause";

/* How far a section has been scrolled through, from 0 to 1, for the river
 * line and the checklist. `start` and `end` are points on the viewport (0 is
 * the top, 1 the bottom): progress is 0 while the section's top is below
 * `start` and reaches 1 when its bottom passes `end`.
 *
 * Returns `still: true` for reduced motion and for the site-wide pause, so the
 * sections can show their finished, motionless version instead. */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, start = 0.85, end = 0.6) {
  const reduced = useReducedMotion();
  const paused = useMotionPaused();
  const still = reduced || paused;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (still) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const element = ref.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const height = window.innerHeight;
      const begin = rect.top - height * start;
      const span = rect.height + height * (start - end);
      const value = span > 0 ? Math.min(1, Math.max(0, -begin / span)) : 1;
      setProgress(value);
    };
    const queue = () => { if (!frame) frame = window.requestAnimationFrame(measure); };
    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [ref, start, end, still]);

  return { progress: still ? 1 : progress, still };
}
