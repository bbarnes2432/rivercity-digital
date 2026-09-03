"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { StageContext, type StageComponents } from "./stage-context";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* ONE canvas for the whole page.
 *
 * The hero already runs a WebGL context (the shader) and a 2D canvas (the
 * lattice). The rest of the page adds exactly one more, shared by every 3D
 * moment below the hero through drei's <View>. Not one per section.
 *
 * Three gates, in order:
 *   1. Nothing loads until a section asks (request()), which the Work rail
 *      does when it comes within ~900px of the viewport. three.js is not in
 *      the initial bundle and never touches the LCP.
 *   2. prefers-reduced-motion, or no WebGL → the canvas never mounts. The DOM
 *      already carries the screenshots, so the page is simply the 2D page.
 *   3. WebGL context loss -> degrade() -> same thing, at runtime. (drei's
 *      PerformanceMonitor was tried and removed: it cannot read a
 *      demand-rendered canvas and tore the Stage down while idle.)
 *
 * The canvas itself lives in StageInner, imported dynamically with ssr:false
 * so three.js lands in its own async chunk. */
const StageInner = dynamic(() => import("./StageInner"), { ssr: false });

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function Stage({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const [requested, setRequested] = useState(false);
  const [degraded, setDegraded] = useState(false);
  const [dpr, setDpr] = useState(1);
  // Filled in by StageInner once its chunk has loaded.
  const [components, setComponents] = useState<StageComponents | null>(null);
  const pending = useRef(false);

  // The WebGL probe runs here, inside the request, rather than in a mount
  // effect: request() only ever fires on the client, and a synchronous
  // setState in an effect body is what the React 19 lint rejects.
  const request = useCallback(() => {
    if (requested || pending.current || !webglAvailable()) return;
    pending.current = true;
    const go = () => {
      setDpr(Math.min(1.5, window.devicePixelRatio || 1));
      setRequested(true);
    };
    /* The build reveal sits right under the proof bar, so on a tall screen its
       observer fires during initial load. The contract is that the 3D chunk is
       requested only AFTER the hero has painted: wait for the load event, then
       for an idle slot, before the ~190 KB download starts. */
    const idle = () => {
      const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
      if (w.requestIdleCallback) w.requestIdleCallback(go, { timeout: 2500 });
      else window.setTimeout(go, 800);
    };
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  }, [requested]);

  const degrade = useCallback(() => setDegraded(true), []);

  const enabled = requested && !degraded && !reducedMotion;

  const value = useMemo(
    () => ({
      enabled,
      request,
      degrade,
      SlabView: enabled ? (components?.SlabView ?? null) : null,
      BuildView: enabled ? (components?.BuildView ?? null) : null,
      GlyphView: enabled ? (components?.GlyphView ?? null) : null,
      ConstellationView: enabled ? (components?.ConstellationView ?? null) : null,
    }),
    [enabled, request, degrade, components],
  );

  return (
    <StageContext.Provider value={value}>
      {children}
      {enabled && (
        <StageInner dpr={dpr} onFallback={degrade} onReady={setComponents} />
      )}
    </StageContext.Provider>
  );
}
