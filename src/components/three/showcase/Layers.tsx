"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei/core/Texture";
import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera";
import * as THREE from "three";
import { TEAL } from "../develop-material";
import { texUrl } from "../tex";

/* Built in parts.
 *
 * One of our sites, sliced into six horizontal bands — header, hero, the
 * sections down the page — each its own plane with its own window of the
 * screenshot. Flat, they are the site. As the tile scrolls up (or on hover)
 * they pull apart along the depth axis and the teal edges draw in: the page
 * as the stack of components it actually is. A template is one flat picture;
 * this is the argument, made visible. The cursor turns the stack. */

const N = 6;
const W = 2.3;
const H = W / 1.8; // the screenshots' crop ratio

let STRIPS: THREE.PlaneGeometry[] | null = null;
let STRIP_EDGES: THREE.EdgesGeometry[] | null = null;
let EDGE_MAT: THREE.LineBasicMaterial | null = null;

function strips(): THREE.PlaneGeometry[] {
  if (STRIPS) return STRIPS;
  const out: THREE.PlaneGeometry[] = [];
  for (let i = 0; i < N; i++) {
    const g = new THREE.PlaneGeometry(W, H / N);
    // Strip i counts from the top; its window of the screenshot is one Nth.
    const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let k = 0; k < uv.count; k++) uv.setY(k, (N - 1 - i + uv.getY(k)) / N);
    uv.needsUpdate = true;
    out.push(g);
  }
  STRIPS = out;
  return out;
}
const stripEdges = () => (STRIP_EDGES ??= strips().map((g) => new THREE.EdgesGeometry(g)));
const edgeMat = () => (EDGE_MAT ??= new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0, toneMapped: false }));

type Props = {
  src: string;
  getProgress: () => number;
  hovered: boolean;
  pointer: RefObject<{ x: number; y: number; t: number }>;
};

export default function Layers({ src, getProgress, hovered, pointer }: Props) {
  const group = useRef<THREE.Group>(null!);
  const parts = useRef<THREE.Group[]>([]);
  const st = useRef({ e: 0, rx: 0, ry: 0 });

  const map = useTexture(texUrl(src, 1080), (t) => {
    const tex = Array.isArray(t) ? t[0] : t;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
  }) as THREE.Texture;

  useFrame((s, dt) => {
    const c = st.current;
    const p = getProgress();
    const target = Math.max(THREE.MathUtils.smoothstep(p, 0.12, 0.8), hovered ? 0.85 : 0);
    const before = c.e + c.rx + c.ry;
    c.e = THREE.MathUtils.damp(c.e, target, 3.5, dt);
    const px = hovered ? pointer.current.x : 0;
    const py = hovered ? pointer.current.y : 0;
    c.ry = THREE.MathUtils.damp(c.ry, 0.42 + px * 0.28, 4, dt);
    c.rx = THREE.MathUtils.damp(c.rx, -0.22 + py * 0.14, 4, dt);
    group.current.rotation.set(c.rx, c.ry, 0);
    for (let i = 0; i < N; i++) {
      const g = parts.current[i];
      if (!g) continue;
      const y0 = ((N - 1) / 2 - i) * (H / N);
      g.position.y = y0 * (1 + 0.22 * c.e);
      g.position.z = ((N - 1) / 2 - i) * 0.24 * c.e;
    }
    edgeMat().opacity = 0.9 * c.e;
    if (Math.abs(c.e + c.rx + c.ry - before) > 1e-4 || performance.now() - pointer.current.t < 120) s.invalidate();
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={34} position={[0, 0.1, 3.4]} />
      <group ref={group}>
        {strips().map((g, i) => (
          <group key={i} ref={(el) => { if (el) parts.current[i] = el; }}>
            <mesh geometry={g}>
              <meshBasicMaterial map={map} toneMapped={false} />
            </mesh>
            <lineSegments geometry={stripEdges()[i]} material={edgeMat()} position={[0, 0, 0.003]} />
          </group>
        ))}
      </group>
    </>
  );
}
