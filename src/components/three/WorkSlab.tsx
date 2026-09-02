"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei/core/Texture";
import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera";
import { easing } from "maath";
import * as THREE from "three";

/* A project screenshot as a "site slab": a gently bowed plane carrying the
 * WebP the page already ships, floating in the navy void with a faded
 * reflection beneath it. Tilts toward the pointer while hovered, settles when
 * it leaves. Unlit on purpose — screenshots are already lit, and no lights
 * means the cheapest material three has.
 *
 * Geometry and the reflection's fade mask are built ONCE at module scope and
 * shared by all eight cards (docs/advanced/scaling-performance: re-use, never
 * re-create). Only the texture differs per card, and useTexture caches those. */

const W = 1.44;
const H = 0.798; // 1440 / 798 — the screenshots' own aspect

function makeSlabGeometry() {
  const g = new THREE.PlaneGeometry(W, H, 32, 1);
  const pos = g.attributes.position as THREE.BufferAttribute;
  // A shallow cylindrical bow, edges toward the viewer, so the flat
  // screenshot reads as an object rather than a rectangle. Toward, not away,
  // on purpose: the DOM <img> sits flat underneath as the fallback, and edges
  // that recede would let a strip of it show past the slab's perspective.
  // Edges that advance grow ~2.5% and cover it.
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) / (W / 2);
    pos.setZ(i, 0.05 * x * x);
  }
  g.computeVertexNormals();
  return g;
}

function makeFadeMask() {
  // A 1×64 vertical gradient used as the reflection's alphaMap: opaque at the
  // slab's edge, gone by the bottom.
  const c = document.createElement("canvas");
  c.width = 1;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, 0, 64);
  grad.addColorStop(0, "#000");
  grad.addColorStop(1, "#fff");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

let SLAB_GEO: THREE.PlaneGeometry | null = null;
let FADE_MASK: THREE.CanvasTexture | null = null;
const getGeo = () => (SLAB_GEO ??= makeSlabGeometry());
const getMask = () => (FADE_MASK ??= makeFadeMask());

type Props = {
  src: string;
  hovered: boolean;
  /** Pointer position over the tracked box, each axis −1..1. Mutated by the
   *  owning View from DOM events; read here per frame, never via state. */
  pointer: RefObject<{ x: number; y: number }>;
};

const TEAL = new THREE.Color("#4CA5AD");

export default function WorkSlab({ src, hovered, pointer }: Props) {
  const group = useRef<THREE.Group>(null!);
  const line = useRef<THREE.Mesh>(null!);
  const reflection = useRef<THREE.MeshBasicMaterial>(null!);

  const map = useTexture(src, (t) => {
    const tex = t as THREE.Texture;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
  });

  // The owning WorkSlabView calls invalidate() on every hover change and
  // pointer move, so a prop change here always arrives with a frame.
  useFrame((state, delta) => {
    const g = group.current;
    const p = pointer.current;
    const targetX = hovered ? -p.y * 0.14 : 0;
    const targetY = hovered ? p.x * 0.22 : 0;
    const targetS = hovered ? 1.025 : 1;

    const before = g.rotation.x + g.rotation.y + g.scale.x;
    easing.dampE(g.rotation, [targetX, targetY, 0], 0.18, delta);
    easing.damp3(g.scale, targetS, 0.18, delta);
    easing.damp(reflection.current, "opacity", hovered ? 0.34 : 0.2, 0.25, delta);
    const lineMat = line.current.material as THREE.MeshBasicMaterial;
    easing.damp(lineMat, "opacity", hovered ? 0.9 : 0.35, 0.2, delta);
    const after = g.rotation.x + g.rotation.y + g.scale.x;

    // Keep asking for frames only while something is still moving.
    if (Math.abs(after - before) > 1e-5 || Math.abs(reflection.current.opacity - (hovered ? 0.34 : 0.2)) > 1e-3) {
      state.invalidate();
    }
  });

  return (
    <>
      {/* fov 28 at z 2.0 makes the visible width exactly 1.44 units — the slab's
          width — in a 1.44-aspect box, so the slab spans the box edge to edge
          and its 0.798 height lands on the same 309px the <img> occupies.
          The group's y puts the slab's top at the box's top; the remaining
          0.2 units below is the reflection band. */}
      <PerspectiveCamera makeDefault fov={28} position={[0, 0, 2.0]} />
      <group ref={group} position={[0, 0.101, 0]}>
        <mesh geometry={getGeo()}>
          <meshBasicMaterial map={map} toneMapped={false} />
        </mesh>
        {/* Teal hairline under the slab: the "edges" colour of the brand's 3D
            language, brightening on hover. */}
        <mesh ref={line} position={[0, -H / 2 - 0.012, 0.02]}>
          <planeGeometry args={[W * 0.92, 0.008]} />
          <meshBasicMaterial color={TEAL} transparent opacity={0.35} toneMapped={false} />
        </mesh>
        {/* The reflection: the same texture, mirrored, fading out downward. */}
        <mesh geometry={getGeo()} position={[0, -H - 0.03, 0]} scale={[1, -1, 1]}>
          <meshBasicMaterial
            ref={reflection}
            map={map}
            alphaMap={getMask()}
            transparent
            opacity={0.2}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </>
  );
}
