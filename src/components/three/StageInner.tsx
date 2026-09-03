"use client";

import { Canvas, advance, invalidate, useFrame, useThree } from "@react-three/fiber";
/* Deep imports, not the drei barrel. The barrel re-exports ~100 components
   and Turbopack did not shake it: importing two names cost the whole thing. */
import { View } from "@react-three/drei/web/View";
import { PerformanceMonitor } from "@react-three/drei/core/PerformanceMonitor";
import { useEffect } from "react";
import WorkSlabView from "./WorkSlabView";
import BuildSlabView from "./BuildSlabView";
import GlyphView from "./GlyphView";
import ConstellationView from "./ConstellationView";
import type { StageComponents } from "./stage-context";

type Props = {
  dpr: number;
  onDecline: () => void;
  onFallback: () => void;
  /** Hands the rail its view component. Called once, on mount, so the only
   *  dynamic boundary on the page is this file and three.js ships once. */
  onReady: (c: StageComponents) => void;
};

/* Clears the whole canvas at the start of every frame, scissor off.
 *
 * With <View>, each viewport only ever draws inside its own scissor rect. When
 * a view is hidden or unmounted — a card flipping to its results side — nobody
 * clears the rect it used to occupy, and under frameloop="demand" the canvas
 * keeps its last frame indefinitely. The stale slab would sit on top of the
 * DOM back face. This runs first (negative priority) and wipes it. */
function ClearFirst() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    gl.setClearColor(0x000000, 0);
  }, [gl]);
  useFrame(({ gl: g }) => {
    g.setScissorTest(false);
    g.clear(true, true, false);
  }, -10);
  return null;
}

/* Development-only. Exposes a synchronous "render one frame now" plus the GL
 * context on window, so the canvas can be verified by reading its pixels
 * rather than by screenshot — under frameloop="demand" a headless capture can
 * wait forever for a frame that nothing has asked for. Compiled out of
 * production builds by the NODE_ENV check. */
function DevHook() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const w = window as unknown as { __rcdStage?: unknown };
    /* invalidate is exposed alongside advance on purpose: under
       frameloop="demand", advance() only renders roots that have a pending
       invalidation, so a probe must call invalidate() first or it reads back
       whatever frame was last presented — or nothing. */
    w.__rcdStage = { gl, invalidate, advance: () => advance(performance.now(), true) };
    return () => {
      delete w.__rcdStage;
    };
  }, [gl]);
  return null;
}

export default function StageInner({ dpr, onDecline, onFallback, onReady }: Props) {
  useEffect(() => {
    onReady({ SlabView: WorkSlabView, BuildView: BuildSlabView, GlyphView, ConstellationView });
  }, [onReady]);

  /* frameloop="demand" means nothing renders unless something calls
   * invalidate(). Views re-read their DOM rect every frame, so scrolling and
   * resizing must request one — coalesced to a single frame each. */
  useEffect(() => {
    let raf = 0;
    const kick = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        invalidate();
      });
    };
    window.addEventListener("scroll", kick, { passive: true, capture: true });
    window.addEventListener("resize", kick);
    kick();
    return () => {
      window.removeEventListener("scroll", kick, true);
      window.removeEventListener("resize", kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Canvas
      frameloop="demand"
      dpr={dpr}
      gl={{ antialias: false, alpha: true, stencil: false, powerPreference: "high-performance" }}
      /* Fixed and full-viewport, painting only inside view rects; transparent
         everywhere else. pointer-events:none is what lets the DOM underneath
         keep every click and scroll — the views listen to their own DOM boxes,
         not to this canvas. z-index sits below --z-nav so a slab scrolling
         under the navigation never paints over it. */
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: "var(--z-stage)",
      }}
      aria-hidden="true"
    >
      <ClearFirst />
      <DevHook />
      <PerformanceMonitor onDecline={onDecline} onFallback={onFallback} flipflops={3}>
        <View.Port />
      </PerformanceMonitor>
    </Canvas>
  );
}
