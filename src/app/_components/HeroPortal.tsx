"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  /** How long the reveal runs, in ms. MUST match the `rcd-portal-open`
   *  duration in Hero.css — if this is shorter, the node unmounts mid-animation
   *  and the veil pops off screen instead of fading out. */
  duration?: number;
};

/* The entrance: a full-viewport veil with an aperture that opens from the
 * centre, so the page arrives as though you stepped through it.
 *
 * Three deliberate decisions:
 *
 * FIXED AND OUTSIDE THE HERO. Rendered above <Nav> rather than inside
 * .rcd-hero, because .rcd-hero sets `isolation: isolate` — a stacking context
 * that would trap the veil beneath the navigation and break the illusion at
 * the top of the screen.
 *
 * IT DELETES ITSELF. The element unmounts once the reveal is over. A permanent
 * pointer-events:none overlay on the page paid search lands on is a liability
 * for no benefit, and the timer is also the safety net for the point below.
 *
 * IT NEVER BLOCKS THE PAGE. The reveal is driven by an animated @property
 * custom property, which needs Chrome 85+/Safari 16.4+/Firefox 128+. Anywhere
 * that fails, the radius simply never animates — so the same keyframes also
 * fade opacity to 0, and this timer removes the node regardless. A visitor can
 * never be left staring at a veil that did not open.
 *
 * Reduced motion skips it entirely: nothing renders, and the hero is just
 * there. */
export default function HeroPortal({ duration = 1900 }: Props) {
  const reducedMotion = useReducedMotion();
  // Starts false on the server and on first client render, so the veil is in
  // the initial HTML and covers the page before it can be seen uncovered.
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    // No synchronous setState here: the reduced-motion case is already handled
    // by the render guard below, so the effect only needs to arm the timer.
    if (reducedMotion) return;
    const id = window.setTimeout(() => setFinished(true), duration + 120);
    return () => window.clearTimeout(id);
  }, [duration, reducedMotion]);

  if (reducedMotion || finished) return null;

  return <div className="rcd-portal" aria-hidden="true" />;
}
