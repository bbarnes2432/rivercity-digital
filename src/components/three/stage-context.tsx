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

/* Props for the build slab (§02 reveal and §04 timeline share it). */
export type BuildViewProps = {
  track: RefObject<HTMLDivElement | null>;
  src: string;
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
/* The icon-slot glyphs in "What we build". */
export type GlyphViewProps = {
  track: RefObject<HTMLDivElement | null>;
  hoverTrack: RefObject<HTMLElement | null>;
  kind: "panes" | "landing" | "grid" | "box";
};

/* The constellation behind the standards list. */
export type ConstellationViewProps = {
  track: RefObject<HTMLElement | null>;
  getSpread: () => number;
  getMask: () => [number, number];
};

export type StageComponents = {
  SlabView: ComponentType<SlabViewProps>;
  BuildView: ComponentType<BuildViewProps>;
  GlyphView: ComponentType<GlyphViewProps>;
  ConstellationView: ComponentType<ConstellationViewProps>;
};

export type StageState = {
  enabled: boolean;
  request: () => void;
  degrade: () => void;
  SlabView: ComponentType<SlabViewProps> | null;
  BuildView: ComponentType<BuildViewProps> | null;
  GlyphView: ComponentType<GlyphViewProps> | null;
  ConstellationView: ComponentType<ConstellationViewProps> | null;
};

export const StageContext = createContext<StageState>({
  enabled: false,
  request: () => {},
  degrade: () => {},
  SlabView: null,
  BuildView: null,
  GlyphView: null,
  ConstellationView: null,
});

export const useStage = () => useContext(StageContext);
