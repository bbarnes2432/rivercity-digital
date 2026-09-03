"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera";
import * as THREE from "three";
import { TEAL } from "./develop-material";

/* Four living glyphs for "What we build" — one tiny procedural object per
 * kind of work, each demonstrating the thing the card claims:
 *
 *   panes    Marketing sites   three stacked pages fanning open
 *   landing  Landing pages     one slab, one glowing edge: a single path
 *   grid     E-commerce        a 4×4 instanced grid of tiles that reshuffles
 *   box      Redesigns         a wireframe box that becomes solid
 *
 * Idle = still. Hover or tap = one reaction, damped, then rest. Nothing
 * loads: no models, no textures. Materials and geometries are module
 * singletons shared by all four cards.
 *
 * Palette note: the brief's 3D palette is teal edges on white surfaces in a
 * navy void. These sit on the cream "working" section, where a white surface
 * would vanish, so the surfaces are navy here — same hue system, inverted for
 * the ground. Teal still means one thing: edges. */

export type GlyphKind = "panes" | "landing" | "grid" | "box";

const NAVY = new THREE.Color("#101D31");
let FILL: THREE.MeshBasicMaterial | null = null;
let EDGE: THREE.LineBasicMaterial | null = null;
const fill = () => (FILL ??= new THREE.MeshBasicMaterial({ color: NAVY, toneMapped: false }));
const edge = () => (EDGE ??= new THREE.LineBasicMaterial({ color: TEAL, toneMapped: false, transparent: true, opacity: 0.95 }));

let PANE: THREE.PlaneGeometry | null = null;
let PANE_EDGES: THREE.EdgesGeometry | null = null;
let BOX: THREE.BoxGeometry | null = null;
let BOX_EDGES: THREE.EdgesGeometry | null = null;
let TILE: THREE.BoxGeometry | null = null;
const paneGeo = () => (PANE ??= new THREE.PlaneGeometry(1.0, 0.7));
const paneEdges = () => (PANE_EDGES ??= new THREE.EdgesGeometry(paneGeo()));
const boxGeo = () => (BOX ??= new THREE.BoxGeometry(1, 1, 1));
const boxEdges = () => (BOX_EDGES ??= new THREE.EdgesGeometry(boxGeo()));
const tileGeo = () => (TILE ??= new THREE.BoxGeometry(0.2, 0.06, 0.2));

type Props = {
  kind: GlyphKind;
  hovered: boolean;
  pointer: RefObject<{ x: number; y: number }>;
};

const CAMERA: Record<GlyphKind, [number, number, number]> = {
  panes: [0.9, 0.55, 2.9],
  landing: [0.6, 0.5, 2.9],
  grid: [1.5, 1.6, 2.4],
  box: [1.7, 1.3, 2.4],
};

function damp(cur: number, target: number, lambda: number, dt: number) {
  return THREE.MathUtils.damp(cur, target, lambda, dt);
}

export default function Glyph({ kind, hovered, pointer }: Props) {
  const root = useRef<THREE.Group>(null!);
  const a = useRef<THREE.Object3D>(null!);
  const b = useRef<THREE.Object3D>(null!);
  const c = useRef<THREE.Object3D>(null!);
  const inst = useRef<THREE.InstancedMesh>(null!);
  const solid = useRef<THREE.MeshBasicMaterial>(null!);
  const st = useRef({ t: 0, shuffleAt: -1 });

  // Grid: 16 tiles, home positions and a permutation to shuffle toward. A ref,
  // not useMemo: this is per-frame mutable state, and the React compiler lint
  // rightly refuses to let a hook's return value be mutated in a loop.
  const gridRef = useRef<{ home: THREE.Vector3[]; cur: THREE.Vector3[]; target: THREE.Vector3[]; m: THREE.Matrix4 } | null>(null);
  if (gridRef.current === null) {
    const home: THREE.Vector3[] = [];
    for (let i = 0; i < 16; i++) home.push(new THREE.Vector3(((i % 4) - 1.5) * 0.27, 0, (Math.floor(i / 4) - 1.5) * 0.27));
    gridRef.current = { home, cur: home.map((v) => v.clone()), target: home.map((v) => v.clone()), m: new THREE.Matrix4() };
  }

  useFrame((s, dt) => {
    const state = st.current;
    const before = state.t;
    state.t = damp(state.t, hovered ? 1 : 0, 6, dt);
    const t = state.t;
    const e = t * t * (3 - 2 * t); // smoothstep for the reaction
    let moving = Math.abs(state.t - before) > 1e-4;

    // A slight lean toward the pointer while hovered, on every kind.
    const px = hovered ? pointer.current.x : 0, py = hovered ? pointer.current.y : 0;
    root.current.rotation.y = damp(root.current.rotation.y, px * 0.25, 6, dt);
    root.current.rotation.x = damp(root.current.rotation.x, -py * 0.15, 6, dt);
    if (Math.abs(root.current.rotation.y - px * 0.25) > 1e-3) moving = true;

    if (kind === "panes") {
      // Fan: each pane rotates open around its bottom-left and steps aside.
      b.current.rotation.z = -0.22 * e; b.current.position.x = 0.16 * e; b.current.position.y = 0.06 * e;
      c.current.rotation.z = -0.44 * e; c.current.position.x = 0.32 * e; c.current.position.y = 0.12 * e;
    } else if (kind === "landing") {
      // The single glowing edge: brighter and wider on hover.
      const m = b.current as THREE.Mesh; const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.55 + 0.45 * e; m.scale.x = 1 + 0.06 * e;
      a.current.position.y = 0.04 * e;
    } else if (kind === "grid") {
      const grid = gridRef.current!;
      // Reshuffle once per hover: pick a new permutation, then damp toward it.
      if (hovered && state.shuffleAt < 0) {
        state.shuffleAt = 0;
        const idx = grid.home.map((_, i) => i);
        for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
        idx.forEach((h, i) => grid.target[i].copy(grid.home[h]));
      }
      if (!hovered) { state.shuffleAt = -1; grid.target.forEach((v, i) => v.copy(grid.home[i])); }
      let any = false;
      for (let i = 0; i < 16; i++) {
        const cur = grid.cur[i], tg = grid.target[i];
        const lift = Math.sin(Math.min(1, cur.distanceTo(tg) * 3) * Math.PI) * 0.12; // hop while travelling
        cur.x = damp(cur.x, tg.x, 7, dt); cur.z = damp(cur.z, tg.z, 7, dt);
        if (cur.distanceTo(tg) > 1e-3) any = true;
        grid.m.makeTranslation(cur.x, lift, cur.z);
        inst.current.setMatrixAt(i, grid.m);
      }
      inst.current.instanceMatrix.needsUpdate = true;
      if (any) moving = true;
    } else if (kind === "box") {
      // Wireframe becomes solid; the box turns a quarter to show it.
      solid.current.opacity = e;
      a.current.rotation.y = 0.5 * e;
    }

    if (moving) s.invalidate();
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={30} position={CAMERA[kind]} onUpdate={(cam) => cam.lookAt(0, kind === "grid" ? -0.05 : 0, 0)} />
      <group ref={root}>
        {kind === "panes" && (
          <group position={[-0.16, -0.06, 0]}>
            {/* Back to front. Each pane pivots at its bottom-left corner. */}
            <group ref={c} position={[0, 0, -0.26]}><group position={[0.5, 0.35, 0]}><mesh geometry={paneGeo()} material={fill()} /><lineSegments geometry={paneEdges()} material={edge()} /></group></group>
            <group ref={b} position={[0, 0, -0.13]}><group position={[0.5, 0.35, 0]}><mesh geometry={paneGeo()} material={fill()} /><lineSegments geometry={paneEdges()} material={edge()} /></group></group>
            <group ref={a}><group position={[0.5, 0.35, 0]}><mesh geometry={paneGeo()} material={fill()} /><lineSegments geometry={paneEdges()} material={edge()} /></group></group>
          </group>
        )}
        {kind === "landing" && (
          <group ref={a}>
            <mesh geometry={paneGeo()} material={fill()} scale={[1.1, 1.05, 1]} />
            <lineSegments geometry={paneEdges()} material={edge()} scale={[1.1, 1.05, 1]} />
            {/* The one path: a single button-shaped outline, and the glowing edge. */}
            <lineSegments geometry={paneEdges()} material={edge()} position={[-0.18, -0.1, 0.01]} scale={[0.42, 0.2, 1]} />
            <mesh ref={b as RefObject<THREE.Mesh>} position={[0, -0.39, 0.02]}>
              <planeGeometry args={[1.1, 0.035]} />
              <meshBasicMaterial color={TEAL} transparent opacity={0.55} toneMapped={false} />
            </mesh>
          </group>
        )}
        {kind === "grid" && (
          <instancedMesh ref={inst} args={[tileGeo(), fill(), 16]} position={[0, -0.05, 0]} />
        )}
        {kind === "box" && (
          <group ref={a} rotation={[0, 0, 0]}>
            <mesh geometry={boxGeo()} scale={0.98}>
              <meshBasicMaterial ref={solid} color={NAVY} transparent opacity={0} toneMapped={false} />
            </mesh>
            <lineSegments geometry={boxEdges()} material={edge()} />
          </group>
        )}
      </group>
    </>
  );
}
