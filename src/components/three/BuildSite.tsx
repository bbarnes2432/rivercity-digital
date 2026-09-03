"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera";
import * as THREE from "three";
import { world } from "./world-state";

/* A website being built, in three dimensions.
 *
 * Not a screenshot: a whole mock site — browser chrome, navigation, a hero
 * with headline, copy, two buttons and a picture, three feature cards, a
 * stats strip, a footer — as a stack of slabs with real depth, on a
 * drafting table. The section's scroll drives one number, the stage, 0 → 4,
 * and every part answers it in its own time:
 *
 *   0 → 1   Coffee → Wireframes   each part is drawn in as a teal outline
 *   1 → 2   → Design              the outlines fill: first grey, then colour
 *   2 → 3   → Build               parts lift off the page to their depth,
 *                                 the headline is typeset, the picture arrives
 *   3 → 4   → Launch              the site turns to face you, the buttons
 *                                 come forward, it floats
 *
 * Parts lag each other a little, so the site assembles top to bottom rather
 * than all at once. Everything is procedural; the one texture is the
 * headline, drawn on a canvas in the page's own display face. */

type Part = {
  x: number; y: number; w: number; h: number; z: number;
  color: string; wire?: string; order: number; raise?: number;
  radius?: number; text?: boolean; pop?: boolean;
};

const CREAM = "#F6F2EA", NAVY = "#101D31", TEAL = "#4CA5AD", TEAL_100 = "#EAF4F4", INK2 = "#6b7583", LINE = "#d8d3c8", WHITE = "#ffffff";
const W = 3.2, H = 2.1;

/* The site, top to bottom. y is up; the page is centred on 0. Depth z is
 * where the part settles at Build; raise is the extra it comes forward at
 * Launch. Order is the assembly order. */
const PARTS: Part[] = [
  // browser chrome
  { x: 0, y: H / 2 - 0.08, w: W, h: 0.16, z: 0.01, color: "#e9e5dc", order: 0 },
  { x: -W / 2 + 0.14, y: H / 2 - 0.08, w: 0.05, h: 0.05, z: 0.02, color: "#f0605d", order: 0 },
  { x: -W / 2 + 0.22, y: H / 2 - 0.08, w: 0.05, h: 0.05, z: 0.02, color: "#f2be4c", order: 0 },
  { x: -W / 2 + 0.30, y: H / 2 - 0.08, w: 0.05, h: 0.05, z: 0.02, color: "#59c66a", order: 0 },
  { x: 0.15, y: H / 2 - 0.08, w: 2.0, h: 0.08, z: 0.02, color: WHITE, order: 0 },
  // nav
  { x: -W / 2 + 0.28, y: H / 2 - 0.28, w: 0.16, h: 0.10, z: 0.03, color: TEAL, order: 1 },
  { x: -W / 2 + 0.62, y: H / 2 - 0.28, w: 0.42, h: 0.05, z: 0.03, color: NAVY, order: 1 },
  { x: 0.55, y: H / 2 - 0.28, w: 0.22, h: 0.04, z: 0.03, color: INK2, order: 2 },
  { x: 0.85, y: H / 2 - 0.28, w: 0.22, h: 0.04, z: 0.03, color: INK2, order: 2 },
  { x: 1.15, y: H / 2 - 0.28, w: 0.22, h: 0.04, z: 0.03, color: INK2, order: 2 },
  { x: W / 2 - 0.30, y: H / 2 - 0.28, w: 0.36, h: 0.10, z: 0.05, color: TEAL, order: 2, raise: 0.05, pop: true },
  // hero: headline (textured), copy, buttons
  // The headline block is a placeholder until Build, when the type is set on
  // it and the block itself goes page-coloured.
  { x: -W / 2 + 0.98, y: 0.44, w: 1.6, h: 0.42, z: 0.035, color: CREAM, order: 3, text: true },
  { x: -W / 2 + 0.85, y: 0.12, w: 1.34, h: 0.04, z: 0.03, color: INK2, order: 4 },
  { x: -W / 2 + 0.72, y: 0.04, w: 1.08, h: 0.04, z: 0.03, color: INK2, order: 4 },
  { x: -W / 2 + 0.52, y: -0.14, w: 0.68, h: 0.13, z: 0.07, color: TEAL, order: 5, raise: 0.07, pop: true },
  { x: -W / 2 + 1.28, y: -0.14, w: 0.62, h: 0.13, z: 0.06, color: WHITE, wire: NAVY, order: 5, raise: 0.05, pop: true },
  // hero picture
  { x: W / 2 - 0.68, y: 0.22, w: 1.1, h: 0.72, z: 0.05, color: "#7FC3C8", order: 3, raise: 0.03 },
  { x: W / 2 - 0.68, y: 0.22, w: 0.36, h: 0.36, z: 0.07, color: CREAM, order: 6, radius: 1 },
  // feature cards
  { x: -1.02, y: -0.52, w: 0.92, h: 0.34, z: 0.04, color: WHITE, order: 6, raise: 0.02 },
  { x: 0, y: -0.52, w: 0.92, h: 0.34, z: 0.04, color: WHITE, order: 7, raise: 0.02 },
  { x: 1.02, y: -0.52, w: 0.92, h: 0.34, z: 0.04, color: WHITE, order: 8, raise: 0.02 },
  { x: -1.36, y: -0.46, w: 0.12, h: 0.12, z: 0.06, color: TEAL_100, order: 7 },
  { x: -0.34, y: -0.46, w: 0.12, h: 0.12, z: 0.06, color: TEAL_100, order: 8 },
  { x: 0.68, y: -0.46, w: 0.12, h: 0.12, z: 0.06, color: TEAL_100, order: 9 },
  { x: -1.02, y: -0.60, w: 0.7, h: 0.03, z: 0.06, color: LINE, order: 8 },
  { x: 0, y: -0.60, w: 0.7, h: 0.03, z: 0.06, color: LINE, order: 9 },
  { x: 1.02, y: -0.60, w: 0.7, h: 0.03, z: 0.06, color: LINE, order: 10 },
  // stats strip + footer
  { x: 0, y: -0.84, w: W, h: 0.20, z: 0.02, color: NAVY, order: 10 },
  { x: -0.9, y: -0.84, w: 0.36, h: 0.07, z: 0.04, color: TEAL, order: 11 },
  { x: 0, y: -0.84, w: 0.36, h: 0.07, z: 0.04, color: TEAL, order: 11 },
  { x: 0.9, y: -0.84, w: 0.36, h: 0.07, z: 0.04, color: TEAL, order: 11 },
  { x: 0, y: -H / 2 + 0.06, w: W, h: 0.12, z: 0.015, color: "#0b1526", order: 12 },
];
const ORDERS = 13;

let HEADLINE: THREE.CanvasTexture | null = null;
function headline(): THREE.CanvasTexture {
  if (HEADLINE) return HEADLINE;
  const cv = document.createElement("canvas");
  cv.width = 1024; cv.height = 268;
  const ctx = cv.getContext("2d")!;
  const fam = getComputedStyle(document.body).getPropertyValue("--font-barlow").trim();
  ctx.fillStyle = NAVY;
  ctx.font = `700 118px ${fam ? fam + ", " : ""}"Barlow Condensed", Impact, sans-serif`;
  ctx.textBaseline = "top";
  ctx.fillText("FRESH ROASTS.", 8, 6);
  ctx.fillStyle = TEAL;
  ctx.fillText("FOUND ON GOOGLE.", 8, 134);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  HEADLINE = t;
  return t;
}

/* Module singletons: geometries shared by every part, one material per part
 * (each has its own colour and its own fill/depth state). */
type Res = { box: THREE.BoxGeometry; edges: THREE.EdgesGeometry; plane: THREE.PlaneGeometry; mats: THREE.MeshStandardMaterial[]; wires: THREE.LineBasicMaterial[]; page: THREE.MeshStandardMaterial; pageWire: THREE.LineBasicMaterial; textMat: THREE.MeshBasicMaterial; table: THREE.MeshBasicMaterial; shadow: THREE.MeshBasicMaterial };
let RES: Res | null = null;
function getRes(): Res {
  if (RES) return RES;
  const box = new THREE.BoxGeometry(1, 1, 1);
  RES = {
    box,
    edges: new THREE.EdgesGeometry(new THREE.PlaneGeometry(1, 1)),
    plane: new THREE.PlaneGeometry(1, 1),
    mats: PARTS.map((p) => new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.75, metalness: 0, transparent: true, opacity: 0 })),
    wires: PARTS.map((p) => new THREE.LineBasicMaterial({ color: p.wire ?? TEAL, transparent: true, opacity: 0, toneMapped: false })),
    page: new THREE.MeshStandardMaterial({ color: CREAM, roughness: 0.9, metalness: 0, transparent: true, opacity: 0 }),
    pageWire: new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0, toneMapped: false }),
    textMat: new THREE.MeshBasicMaterial({ map: null, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }),
    table: new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity: 0.16, toneMapped: false, depthWrite: false }),
    shadow: new THREE.MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0, depthWrite: false }),
  };
  return RES;
}

let GRID: THREE.CanvasTexture | null = null;
function grid(): THREE.CanvasTexture {
  if (GRID) return GRID;
  const cv = document.createElement("canvas");
  cv.width = cv.height = 256;
  const ctx = cv.getContext("2d")!;
  ctx.strokeStyle = "rgba(76,165,173,0.55)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 256; i += 32) { ctx.beginPath(); ctx.moveTo(i + 0.5, 0); ctx.lineTo(i + 0.5, 256); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i + 0.5); ctx.lineTo(256, i + 0.5); ctx.stroke(); }
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(9, 6);
  GRID = t;
  return t;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (v: number) => { const t = clamp01(v); return t * t * (3 - 2 * t); };

type Props = {
  getStage: () => number;
  hovered: boolean;
  pointer: RefObject<{ x: number; y: number }>;
  /** The view's box in the viewport, for telling the cursor where the site is. */
  getRect: () => DOMRect | null;
};

const CORNER = new THREE.Vector3();

export default function BuildSite({ getStage, hovered, pointer, getRect }: Props) {
  const site = useRef<THREE.Group>(null!);
  const parts = useRef<THREE.Group[]>([]);
  const textMesh = useRef<THREE.Mesh>(null!);
  const st = useRef({ stage: 0, t: 0, rx: 0, ry: 0 });

  useFrame((s, dt) => {
    const c = st.current;
    const r = getRes();
    const target = getStage();
    const before = c.stage + c.rx + c.ry;
    c.stage = THREE.MathUtils.damp(c.stage, target, 4, dt);
    c.t += dt;
    const S = c.stage;

    // Launch: the site turns to face you and floats; the cursor tilts it.
    const launch = ease((S - 3.2) / 0.8);
    const px = hovered ? pointer.current.x : 0, py = hovered ? pointer.current.y : 0;
    c.ry = THREE.MathUtils.damp(c.ry, THREE.MathUtils.lerp(0.42, 0.08, launch) + px * 0.18, 4, dt);
    c.rx = THREE.MathUtils.damp(c.rx, THREE.MathUtils.lerp(-0.22, -0.04, launch) + py * 0.1, 4, dt);
    site.current.rotation.set(c.rx, c.ry, 0);
    site.current.position.y = launch * (0.06 + Math.sin(c.t * 0.9) * 0.02);
    site.current.position.z = launch * 0.1;

    // The page itself: outline, then fill.
    r.pageWire.opacity = ease(S / 0.8) * (1 - ease((S - 1.6) / 0.6)) * 0.9;
    r.page.opacity = ease((S - 0.9) / 0.6);
    r.shadow.opacity = 0.35 * ease((S - 0.9) / 0.6);

    for (let i = 0; i < PARTS.length; i++) {
      const p = PARTS[i];
      const g = parts.current[i];
      if (!g) continue;
      const lag = (p.order / ORDERS) * 0.55;
      const wire = ease((S - 0.55 - lag) / 0.35);              // outline draws in
      const fill = ease((S - 1.55 - lag) / 0.4);               // grey fill
      const colour = ease((S - 2.0 - lag) / 0.5);              // colour arrives
      const depth = ease((S - 2.6 - lag) / 0.5);               // lifts to its depth
      const m = r.mats[i];
      m.opacity = fill;
      // Grey until Design; the headline's block ends up page-coloured (the type
      // is set on it), so it greys like the rest, then disappears into the page.
      m.color.set(p.color).lerp(new THREE.Color("#bdb8ad"), 1 - colour);
      r.wires[i].opacity = wire * (1 - fill) * 0.95;
      const z = 0.004 + p.z * depth + (p.raise ?? 0) * launch * (p.pop ? 1 + 0.35 * Math.sin(c.t * 2 + i) : 1);
      g.position.set(p.x, p.y, z);
      const sc = 0.001 + wire * 0.999;
      g.scale.set(p.w * sc, p.h * sc, 1);
      const mesh = g.children[0] as THREE.Mesh;
      mesh.scale.z = Math.max(0.002, p.z * 0.6 * depth + 0.006);
    }
    // The headline is typeset at Build.
    if (!r.textMat.map) { r.textMat.map = headline(); r.textMat.needsUpdate = true; }
    r.textMat.opacity = ease((S - 2.9) / 0.5);

    // Where the page is on the screen, for the cursor to pass behind it.
    const rect = getRect();
    if (rect && r.page.opacity > 0.05) {
      site.current.updateMatrixWorld();
      const poly: number[][] = [];
      let ok = true;
      for (const [lx, ly] of [[-W / 2, H / 2], [W / 2, H / 2], [W / 2, -H / 2], [-W / 2, -H / 2]]) {
        CORNER.set(lx, ly, 0.02);
        site.current.localToWorld(CORNER);
        CORNER.project(s.camera);
        if (CORNER.z > 1) { ok = false; break; }
        poly.push([rect.left + ((CORNER.x + 1) / 2) * rect.width, rect.top + ((1 - CORNER.y) / 2) * rect.height]);
      }
      world.site = ok ? poly : null;
      world.siteAt = performance.now();
    }

    const moving = Math.abs(c.stage + c.rx + c.ry - before) > 1e-4 || launch > 0.001;
    if (moving) s.invalidate();
  });

  const r = getRes();
  return (
    <>
      <PerspectiveCamera makeDefault fov={30} position={[0, 0.3, 4.15]} onUpdate={(cam) => cam.lookAt(0, -0.02, 0)} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[2.5, 3.5, 4]} intensity={3.2} />
      <directionalLight position={[-3, 1, 2]} intensity={0.9} color="#a8d8dc" />

      {/* The drafting table: a blueprint grid on nothing, and the site's shadow. */}
      <group position={[0, -H / 2 - 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh position={[0, 0.3, 0]}>
          <planeGeometry args={[5.2, 3.6]} />
          <meshBasicMaterial map={grid()} transparent opacity={0.22} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh geometry={r.plane} material={r.shadow} position={[0.1, 0.55, 0.002]} scale={[W * 0.95, 1.6, 1]} />
      </group>

      <group ref={site}>
        {/* The page. */}
        <mesh geometry={r.box} material={r.page} scale={[W, H, 0.03]} position={[0, 0, -0.015]} />
        <lineSegments geometry={r.edges} material={r.pageWire} scale={[W, H, 1]} position={[0, 0, 0.002]} />
        {/* Its parts. */}
        {PARTS.map((p, i) => (
          <group key={i} ref={(el) => { if (el) parts.current[i] = el; }} position={[p.x, p.y, 0.004]} scale={[p.w, p.h, 1]}>
            <mesh geometry={r.box} material={r.mats[i]} position={[0, 0, 0.003]} />
            <lineSegments geometry={r.edges} material={r.wires[i]} position={[0, 0, 0.004]} />
            {p.text && <mesh ref={textMesh} geometry={r.plane} material={r.textMat} position={[0, 0, 0.04]} scale={[1, 1, 1]} />}
          </group>
        ))}
      </group>
    </>
  );
}
