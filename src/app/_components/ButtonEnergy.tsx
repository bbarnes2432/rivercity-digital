"use client";

import { useEffect } from "react";

/* Buttons fill with light from wherever the cursor touched them.
 *
 * The fill itself is CSS (.btn::after, a radial burst that grows over most
 * of a second while the pointer stays). This only tells each button where
 * the pointer came in, as two custom properties, so the burst starts there.
 * One delegated listener for the whole page. Renders nothing. */
export default function ButtonEnergy() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const b = t && t.closest<HTMLElement>(".btn");
      if (!b || b.dataset.energy === "on") return;
      const r = b.getBoundingClientRect();
      b.style.setProperty("--bx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
      b.style.setProperty("--by", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
      b.dataset.energy = "on";
    };
    const out = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const b = t && t.closest<HTMLElement>(".btn");
      const to = e.relatedTarget as Element | null;
      if (b && !(to && b.contains(to))) delete b.dataset.energy;
    };
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerout", out, { passive: true });
    return () => {
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
    };
  }, []);
  return null;
}
