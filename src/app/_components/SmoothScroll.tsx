"use client";

import { useEffect } from "react";

/* A heavier scroll.
 *
 * On a mouse or trackpad, wheel input no longer jumps the page: it sets a
 * target, and the page eases toward it each frame, so scrolling has a
 * little weight and settles rather than stops. Touch, keyboard and the
 * scrollbar stay native. Off under reduced motion, off entirely on coarse
 * pointers, and it switches itself off if the machine cannot keep frames
 * coming — a slow inertial scroll is worse than none. Renders nothing. */

const EASE = 0.22; // fraction of the remaining distance closed per frame at 60 fps: a little weight, not a delay
const SLOW_FRAME = 40; // ms; a run of these means the machine is struggling and native scroll is kinder
const MAX_STEP = 140; // px per wheel notch, whatever the device reports

export default function SmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let raf = 0;
    let last = 0;
    let idle = true;
    let slow = 0;
    let off = false;

    const max = () => document.documentElement.scrollHeight - window.innerHeight;
    const loop = (now: number) => {
      const raw = now - (last || now);
      last = now;
      // If frames keep coming late, hand the wheel back to the browser for good.
      slow = raw > SLOW_FRAME ? slow + 1 : 0;
      if (slow >= 6) { off = true; idle = true; raf = 0; return; }
      const dt = Math.min(48, raw);
      const k = 1 - Math.pow(1 - EASE, dt / 16.7);
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.4) {
        current = target;
        // "instant", or the page's own scroll-behavior: smooth would turn each
        // step into its own animation and the page would barely move.
        window.scrollTo({ top: current, behavior: "instant" });
        idle = true;
        raf = 0;
        return;
      }
      window.scrollTo({ top: current, behavior: "instant" });
      raf = requestAnimationFrame(loop);
    };
    const wheel = (e: WheelEvent) => {
      if (off || e.ctrlKey) return; // switched off, or pinch-zoom
      // Anything that scrolls on its own (a code block, a horizontal table)
      // keeps native behaviour when the wheel is over it.
      let el = e.target as HTMLElement | null;
      while (el && el !== document.body) {
        const cs = getComputedStyle(el);
        if ((cs.overflowY === "auto" || cs.overflowY === "scroll") && el.scrollHeight > el.clientHeight + 1) return;
        el = el.parentElement;
      }
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1;
      const dy = Math.max(-MAX_STEP * 3, Math.min(MAX_STEP * 3, e.deltaY * unit));
      if (idle) { current = window.scrollY; target = current; idle = false; }
      target = Math.max(0, Math.min(max(), target + dy));
      if (!raf) { last = 0; raf = requestAnimationFrame(loop); }
    };
    // If something else moves the page (a hash link, a key, the scrollbar),
    // start from there next time rather than snapping back.
    const sync = () => { if (idle) { target = window.scrollY; current = target; } };

    window.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("scroll", sync, { passive: true });
    return () => {
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("scroll", sync);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
