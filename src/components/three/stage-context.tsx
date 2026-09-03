"use client";

import { createContext, useContext, type ComponentType, type RefObject } from "react";

/* Props for the site being built (the build section). */
export type BuildViewProps = {
  track: RefObject<HTMLDivElement | null>;
  src?: string;
  /** Where the section wants the slab, 0..4 — read every frame. */
  getStage: () => number;
  table?: boolean;
  visible?: boolean;
};

/* The Stage is the page's single WebGL canvas. Sections that want to draw into
 * it read this context: `enabled` says whether a canvas exists to draw into,
 * `request()` asks for one (it loads lazily, on demand), `degrade()` is the
 * PerformanceMonitor's exit, and the view components are delivered here —
 * null until the 3D chunk has arrived.
 *
 * Components are delivered THROUGH the context rather than imported by the
 * sections on purpose. Two dynamic imports that both reach three.js gave
 * Turbopack two async chunks with a full copy of three in each (measured:
 * 866 KB, twice). One boundary — StageInner — imports everything
 * three-flavoured and hands the sections their components; three exists in
 * exactly one chunk. */
/* The constellation behind the standards list. */
export type ConstellationViewProps = {
  track: RefObject<HTMLElement | null>;
  getSpread: () => number;
  getMask: () => [number, number];
};

/* The three demonstrations in "What's possible". */
export type ShowcaseKind = "layers" | "ripple" | "words";
export type ShowcaseViewProps = {
  track: RefObject<HTMLDivElement | null>;
  kind: ShowcaseKind;
  src?: string;
  /** Scroll progress of the tile, 0..1 — read every frame. */
  getProgress: () => number;
};

export type StageComponents = {
  BuildView: ComponentType<BuildViewProps>;
  ConstellationView: ComponentType<ConstellationViewProps>;
  ShowcaseView: ComponentType<ShowcaseViewProps>;
};

export type StageState = {
  enabled: boolean;
  request: () => void;
  degrade: () => void;
  BuildView: ComponentType<BuildViewProps> | null;
  ConstellationView: ComponentType<ConstellationViewProps> | null;
  ShowcaseView: ComponentType<ShowcaseViewProps> | null;
};

export const StageContext = createContext<StageState>({
  enabled: false,
  request: () => {},
  degrade: () => {},
  BuildView: null,
  ConstellationView: null,
  ShowcaseView: null,
});

export const useStage = () => useContext(StageContext);
