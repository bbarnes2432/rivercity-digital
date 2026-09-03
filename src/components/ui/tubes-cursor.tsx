"use client";

import { useEffect, useRef } from "react";
import { world } from "@/components/three/world-state";

/* The tubes cursor — the threejs-components "tubes1" cursor, as is.
 *
 * Sixteen metallic tubes trail the pointer, lit by four coloured lights and
 * bloomed, on a transparent full-screen canvas above the page. The library
 * brings its own three.js and its own renderer, which is why it lives on
 * its own canvas rather than on the page's shared one: the two cannot share
 * a scene. What they do share is the light — the colours set here are also
 * the colours of the lights that follow the cursor through the hallway
 * (CursorLights), so the ribbons on top and the glow on the walls agree.
 *
 * Mouse only (there is no cursor to trail on touch), not under reduced
 * motion, and loaded after the page is idle — it is a large module. A click
 * anywhere re-rolls the colours, as in the original. */

const TUBE_COLORS = ["#5e72e4", "#8965e0", "#f5365c"];
const LIGHT_COLORS = ["#21d4fd", "#b721ff", "#f4d03f", "#11cdef"];

type TubesApp = {
  three: { minPixelRatio: number; maxPixelRatio: number; resize: () => void };
  tubes: { setColors: (c: string[]) => void; setLightsColors: (c: string[]) => void };
  dispose: () => void;
};

const randomColors = (count: number) =>
  Array.from({ length: count }, () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"));

export default function TubesCursor() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const app = useRef<TubesApp | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    world.cursorColors = LIGHT_COLORS.slice();

    let cancelled = false;
    let idle = 0;
    const start = () => {
      import("threejs-components/build/cursors/tubes1.min.js")
        .then((m) => {
          if (cancelled || !canvas.current) return;
          const a = m.default(canvas.current, {
            tubes: {
              colors: TUBE_COLORS,
              lights: { intensity: 200, colors: LIGHT_COLORS },
            },
          }) as TubesApp;
          // The library renders at 2× by default; 1.5× is plenty for a
          // bloomed cursor and half the pixels on a big display.
          a.three.minPixelRatio = 1;
          a.three.maxPixelRatio = 1.5;
          a.three.resize();
          app.current = a;
          if (process.env.NODE_ENV !== "production") (window as unknown as { __rcdTubes?: unknown }).__rcdTubes = a;
        })
        .catch((err) => console.error("tubes cursor failed to load", err));
    };
    const go = () => {
      const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
      if (w.requestIdleCallback) idle = w.requestIdleCallback(start, { timeout: 3000 });
      else idle = window.setTimeout(start, 1200);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });

    // Over a light chapter the cursor carries no light: the canvas fades out.
    const LIGHT_SEL = ".rcd-light, .section--working, .section--bg-coffee, .rcd-inline-contact-section, footer";
    const move = (e: PointerEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const over = !!(el && el.closest(LIGHT_SEL));
      wrap.current?.toggleAttribute("data-off", over);
    };
    window.addEventListener("pointermove", move, { passive: true });

    const click = () => {
      if (!app.current) return;
      const tubes = randomColors(3);
      const lights = randomColors(4);
      app.current.tubes.setColors(tubes);
      app.current.tubes.setLightsColors(lights);
      world.cursorColors = lights;
      world.cursorColorsAt = performance.now();
    };
    window.addEventListener("click", click);

    return () => {
      cancelled = true;
      window.removeEventListener("load", go);
      window.removeEventListener("click", click);
      window.removeEventListener("pointermove", move);
      window.clearTimeout(idle);
      app.current?.dispose();
      app.current = null;
    };
  }, []);

  /* Things the cursor passes behind are cut out of this canvas: in the
     hallway, a screen that has come nearer than the cursor's plane; the
     site being built while it is on screen; and any button the pointer is
     over, so the button fills with light in front of the cursor rather
     than under it. One clip-path polygon with holes: the outer rectangle,
     then each hole traced the opposite way round, joined by zero-width
     seams (nonzero fill). */
  useEffect(() => {
    let raf = 0;
    let last = "";
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const el = wrap.current;
      if (!el) return;
      const holes: number[][][] = [];
      if (world.active) for (const p of world.occluders) holes.push(p);
      if (world.siteOn && world.site) holes.push(world.site);
      document.querySelectorAll<HTMLElement>(".btn:hover").forEach((b) => {
        const r = b.getBoundingClientRect();
        holes.push([[r.left, r.top], [r.right, r.top], [r.right, r.bottom], [r.left, r.bottom]]);
      });
      if (holes.length === 0) {
        if (last !== "") { el.style.clipPath = ""; last = ""; }
        return;
      }
      const W = window.innerWidth, H = window.innerHeight;
      let path = `0px 0px, ${W}px 0px, ${W}px ${H}px, 0px ${H}px, 0px 0px`;
      for (const poly of holes) {
        // Outer runs clockwise (screen coordinates); the hole must not.
        let area = 0;
        for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; area += a[0] * b[1] - b[0] * a[1]; }
        const ring = area > 0 ? [...poly].reverse() : poly;
        const pts = ring.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`);
        path += `, ${pts[0]}, ${pts.join(", ")}, ${pts[0]}, 0px 0px`;
      }
      const next = `polygon(nonzero, ${path})`;
      if (next !== last) { el.style.clipPath = next; last = next; }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={wrap} className="rcd-tubes" aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  );
}
