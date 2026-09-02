"use client";

import { createContext, useContext, type ComponentType, type RefObject } from "react";

/* Props for the per-card 3D view. Declared here — in a file that imports
 * nothing from three — so the rail can type against it without pulling three
 * into its own chunk. */
export type SlabViewProps = {
  track: RefObject<HTMLDivElement | null>;
  src: string;
  visible: boolean;
};

/* The Stage is the page's single WebGL canvas. Sections that want to draw into
 * it read this context: `enabled` says whether a canvas exists to draw into,
 * `request()` asks for one (it loads lazily, on demand), `degrade()` is the
 * PerformanceMonitor's exit, and `SlabView` is the view component itself —
 * null until the 3D chunk has arrived.
 *
 * SlabView is delivered THROUGH the context rather than imported by the rail
 * on purpose. Two dynamic imports that both reach three.js gave Turbopack two
 * async chunks with a full copy of three in each (measured: 866 KB, twice).
 * One boundary — StageInner — imports everything three-flavoured and hands
 * the rail its component; three exists in exactly one chunk. */
export type StageState = {
  enabled: boolean;
  request: () => void;
  degrade: () => void;
  SlabView: ComponentType<SlabViewProps> | null;
};

export const StageContext = createContext<StageState>({
  enabled: false,
  request: () => {},
  degrade: () => {},
  SlabView: null,
});

export const useStage = () => useContext(StageContext);
