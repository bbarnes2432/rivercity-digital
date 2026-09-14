"use client";

import { useEffect, useRef } from "react";
import { world } from "@/components/three/world-state";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ambientTubeTarget } from "./tubes-ambient";
import { observeTubeOcclusion } from "./tubes-occlusion";

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
 * Touch can opt into an autonomous drift, with less geometry and a lower
 * pixel ratio. Reduced motion skips the canvas. Load after the page is idle;
 * desktop clicks re-roll the colours, as in the original. */

const TUBE_COLORS = ["#5e72e4", "#8965e0", "#f5365c"];
const LIGHT_COLORS = ["#21d4fd", "#b721ff", "#f4d03f", "#11cdef"];

type TubesApp = {
  three: {
    minPixelRatio: number;
    maxPixelRatio: number;
    size: { width: number; height: number; wWidth: number };
    onBeforeRender: (time: { elapsed: number; delta: number }) => void;
    render: () => void;
    resize: () => void;
  };
  tubes: {
    target: { x: number; y: number };
    update: (time: { elapsed: number; delta: number }) => void;
    setColors: (c: string[]) => void;
    setLightsColors: (c: string[]) => void;
  };
  dispose: () => void;
};

const randomColors = (count: number) =>
  Array.from({ length: count }, () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"));

export default function TubesCursor({ mobileAmbient = false }: { mobileAmbient?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const app = useRef<TubesApp | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const ambient = !window.matchMedia("(pointer: fine)").matches;
    if (ambient && !mobileAmbient) return;
    if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layer = wrap.current;
    world.cursorColors = LIGHT_COLORS.slice();

    let cancelled = false;
    let idle = 0;
    let usesIdleCallback = false;
    const start = () => {
      import("threejs-components/build/cursors/tubes1.min.js")
        .then((m) => {
          if (cancelled || !canvas.current) return;
          const a = m.default(canvas.current, {
            tubes: {
              ...(ambient ? { count: 10, minTubularSegments: 24, maxTubularSegments: 64 } : {}),
              colors: TUBE_COLORS,
              lights: { intensity: 200, colors: LIGHT_COLORS },
            },
          }) as TubesApp;
          // The library renders at 2× by default; 1.5× is plenty for a
          // bloomed cursor and half the pixels on a big display.
          a.three.minPixelRatio = 1;
          a.three.maxPixelRatio = ambient ? 1 : 1.5;
          a.three.resize();
          if (ambient) {
            // The library treats a swipe as pointer hover, which freezes its
            // idle path after a touch. Drive the same ribbons independently
            // on phones, without intercepting any touch or scroll events.
            a.three.onBeforeRender = (time) => {
              const target = ambientTubeTarget(time.elapsed, a.three.size);
              a.tubes.target.x = target.x;
              a.tubes.target.y = target.y;
              a.tubes.update(time);
            };
          }
          // A full light section can completely clip this fixed canvas. The
          // library's viewport observer cannot detect that. Preserve its
          // clock, but skip geometry and GPU work while no pixel can be seen.
          const beforeRender = a.three.onBeforeRender;
          const render = a.three.render;
          a.three.onBeforeRender = (time) => {
            if (!layer?.hasAttribute("data-covered")) beforeRender(time);
          };
          a.three.render = () => {
            if (!layer?.hasAttribute("data-covered")) render();
          };
          app.current = a;
          if (process.env.NODE_ENV !== "production") (window as unknown as { __rcdTubes?: unknown }).__rcdTubes = a;
        })
        .catch((err) => console.error("tubes cursor failed to load", err));
    };
    const go = () => {
      const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
      if (w.requestIdleCallback) {
        usesIdleCallback = true;
        idle = w.requestIdleCallback(start, { timeout: 3000 });
      }
      else idle = window.setTimeout(start, 1200);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });

    // Over a light chapter the cursor carries no light: the canvas fades out.
    const LIGHT_SEL = ".rcd-light, .section--working, .section--bg-coffee, .rcd-inline-contact-section, footer";
    let pointer: { x: number; y: number } | null = null;
    const updateLight = () => {
      if (!pointer) return;
      const el = document.elementFromPoint(pointer.x, pointer.y);
      const over = !!(el && el.closest(LIGHT_SEL));
      wrap.current?.toggleAttribute("data-off", over);
    };
    const move = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      updateLight();
    };
    // Mobile uses the section masks below, not the last finger position.
    if (!ambient) {
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("scroll", updateLight, { passive: true });
    }

    const click = () => {
      if (!app.current) return;
      const tubes = randomColors(3);
      const lights = randomColors(4);
      app.current.tubes.setColors(tubes);
      app.current.tubes.setLightsColors(lights);
      world.cursorColors = lights;
      world.cursorColorsAt = performance.now();
    };
    if (!ambient) window.addEventListener("click", click);

    return () => {
      cancelled = true;
      window.removeEventListener("load", go);
      window.removeEventListener("click", click);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", updateLight);
      if (usesIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      app.current?.dispose();
      app.current = null;
      layer?.removeAttribute("data-off");
    };
  }, [mobileAmbient, reducedMotion]);

  /* Things the cursor passes behind are cut out of this canvas: in the
     hallway, a screen that has come nearer than the cursor's plane; the
     site being built while it is on screen; any button the pointer is
     over, so the button fills with light in front of the cursor rather
     than under it; and the white part of a card that is filling. One clip-path polygon with holes: the outer rectangle,
     then each hole traced the opposite way round, joined by zero-width
     seams (nonzero fill). */
  useEffect(() => {
    const ambient = !window.matchMedia("(pointer: fine)").matches;
    if (!mobileAmbient && ambient) return;
    if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // The studio uses DOM masks; the home page also has continuously moving
    // 3D occluders and retains its existing per-frame world projection.
    if (wrap.current?.closest(".wd-site")) return observeTubeOcclusion(wrap.current, ambient);
    let raf = 0;
    let last = "";
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const el = wrap.current;
      if (!el || !app.current || document.hidden) return;
      const holes: number[][][] = [];
      if (world.active) for (const p of world.occluders) holes.push(p);
      if (world.siteOn && world.site) holes.push(world.site);
      // Keep controls, interface previews, and light sections above the glow.
      const masks = ambient
        ? ".btn, .wd-button, .wd-app-window, .rcd-light"
        : ".btn:hover, .wd-button:hover, .wd-app-window, .rcd-light";
      document.querySelectorAll<HTMLElement>(masks).forEach((b) => {
        const r = b.getBoundingClientRect();
        if (r.bottom <= 0 || r.top >= window.innerHeight) return;
        holes.push([[r.left, r.top], [r.right, r.top], [r.right, r.bottom], [r.left, r.bottom]]);
      });
      // The cards that fill with white: the cursor is behind exactly the part
      // that has gone white, so it rides in front of the glass and then
      // disappears behind the liquid as it rises.
      document.querySelectorAll<HTMLElement>(".rcd-tilt-fill i").forEach((f) => {
        const r = f.getBoundingClientRect();
        if (r.height < 2) return;
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
  }, [mobileAmbient, reducedMotion]);

  return (
    <div ref={wrap} className="rcd-tubes" data-mobile-ambient={mobileAmbient || undefined} aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  );
}
