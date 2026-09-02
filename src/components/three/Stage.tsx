"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState, type ComponentType, type ReactNode } from "react";
import { StageContext, type SlabViewProps } from "./stage-context";
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
 *   3. PerformanceMonitor's fallback → degrade() → same thing, at runtime.
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
  const [components, setComponents] = useState<{ SlabView: ComponentType<SlabViewProps> } | null>(null);

  // The WebGL probe runs here, inside the request, rather than in a mount
  // effect: request() only ever fires on the client, and a synchronous
  // setState in an effect body is what the React 19 lint rejects.
  const request = useCallback(() => {
    if (requested || !webglAvailable()) return;
    setDpr(Math.min(1.5, window.devicePixelRatio || 1));
    setRequested(true);
  }, [requested]);

  const degrade = useCallback(() => setDegraded(true), []);

  const enabled = requested && !degraded && !reducedMotion;

  const value = useMemo(
    () => ({ enabled, request, degrade, SlabView: enabled ? (components?.SlabView ?? null) : null }),
    [enabled, request, degrade, components],
  );

  return (
    <StageContext.Provider value={value}>
      {children}
      {enabled && (
        <StageInner dpr={dpr} onDecline={() => setDpr(1)} onFallback={degrade} onReady={setComponents} />
      )}
    </StageContext.Provider>
  );
}
