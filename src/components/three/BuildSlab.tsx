"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera";
import { useTexture } from "@react-three/drei/core/Texture";
import { easing } from "maath";
import * as THREE from "three";
import { makeDevelopMaterial, TEAL } from "./develop-material";

/* The build slab: one site being built, from blueprint to live.
 *
 * Used twice on the page — §02 scrubs it through wireframe → surface → live
 * as the section scrolls in; §04 steps it through the five timeline states as
 * each card reveals. Same geometry, same texture (useTexture caches by URL),
 * same material. The only difference is what getStage() returns.
 *
 * getStage is read every frame and damped toward, never set as state: the
 * DOM side owns "where are we", this side owns "get there smoothly". */

const W = 1.44;
const H = 0.798;

let SLAB_GEO: THREE.PlaneGeometry | null = null;
// 64×36 segments: enough for the develop ripple to read as a surface, not a
// polygon. The rail's slab is 32×1 because it only bows.
const getGeo = () => (SLAB_GEO ??= new THREE.PlaneGeometry(W, H, 64, 36));

let TABLE_TEX: THREE.CanvasTexture | null = null;
function getTableTexture() {
  if (TABLE_TEX) return TABLE_TEX;
  // The drafting table: a blueprint grid on nothing. 256px tile, repeated.
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, 256, 256);
  ctx.strokeStyle = "rgba(76,165,173,0.55)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 256; i += 32) {
    ctx.beginPath(); ctx.moveTo(i + 0.5, 0); ctx.lineTo(i + 0.5, 256); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i + 0.5); ctx.lineTo(256, i + 0.5); ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(6, 4);
  t.colorSpace = THREE.NoColorSpace;
  TABLE_TEX = t;
  return t;
}

type Props = {
  src: string;
  /** The stage to head toward, 0..4. Read each frame. */
  getStage: () => number;
  /** Draw the drafting table and the launch ring (the timeline). */
  table?: boolean;
  hovered: boolean;
  pointer: RefObject<{ x: number; y: number }>;
};

export default function BuildSlab({ src, getStage, table = false, hovered, pointer }: Props) {
  const group = useRef<THREE.Group>(null!);
  const mesh = useRef<THREE.Mesh>(null!);
  const ring = useRef<THREE.Mesh>(null!);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null!);
  const state = useRef({ stage: 0, ringT: -1, lastStage: 0 });

  const map = useTexture(src, (t) => {
    const tex = t as THREE.Texture;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
  });

  const material = useMemo(() => makeDevelopMaterial(map), [map]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((s, delta) => {
    const st = state.current;
    const target = THREE.MathUtils.clamp(getStage(), 0, 4);
    // Toward the target. A touch slower than the rail's tilt so the develop
    // reads as a process, not a switch.
    st.stage = THREE.MathUtils.damp(st.stage, target, 4.2, delta);
    // Through the mesh ref, not the memoised value: per-frame mutation of a
    // hook result is what the React compiler lint forbids; a ref is the sanctioned
    // escape hatch for exactly this.
    const mat = mesh.current.material as ReturnType<typeof makeDevelopMaterial>;
    mat.uniforms.uStage.value = st.stage;
    mat.uniforms.uTime.value += delta;

    // Launch: the lift, and one ring pulse across the table — the same beat the
    // hero lattice plays on load. Fires once each time the stage crosses 3.9.
    const live = THREE.MathUtils.clamp((st.stage - 3.0), 0, 1);
    const g = group.current;
    const targetY = 0.06 * live;
    const targetZ = 0.10 * live;
    const tiltX = hovered && st.stage > 2.9 ? -pointer.current.y * 0.12 : 0;
    const tiltY = hovered && st.stage > 2.9 ? pointer.current.x * 0.20 : -0.10 * (1 - live);
    const before = g.position.y + g.position.z + g.rotation.x + g.rotation.y;
    easing.damp(g.position, "y", targetY, 0.3, delta);
    easing.damp(g.position, "z", targetZ, 0.3, delta);
    easing.dampE(g.rotation, [tiltX, tiltY, 0], 0.22, delta);
    const after = g.position.y + g.position.z + g.rotation.x + g.rotation.y;

    if (st.lastStage < 3.9 && st.stage >= 3.9) st.ringT = 0;
    st.lastStage = st.stage;
    let ringMoving = false;
    if (table && st.ringT >= 0) {
      st.ringT += delta;
      const t = st.ringT / 1.3;
      if (t >= 1) {
        st.ringT = -1;
        ringMat.current.opacity = 0;
      } else {
        const e = 1 - Math.pow(1 - t, 3);
        ring.current.scale.setScalar(0.15 + e * 2.4);
        ringMat.current.opacity = 0.85 * (1 - e);
        ringMoving = true;
      }
    }

    if (Math.abs(st.stage - target) > 1e-3 || Math.abs(after - before) > 1e-5 || ringMoving) {
      s.invalidate();
    }
  });

  return (
    <>
      {/* Slightly above and in front, looking down at the table, so the table
          reads as a surface receding behind the upright slab. */}
      <PerspectiveCamera makeDefault fov={28} position={[0, 0.42, 2.12]} onUpdate={(c) => c.lookAt(0, 0.02, 0)} />
      <group ref={group} position={[0, 0, 0]}>
        <mesh ref={mesh} geometry={getGeo()} material={material} />
      </group>
      {table && (
        <group position={[0, -H / 2 - 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh position={[0, 0.2, 0]}>
            <planeGeometry args={[3.6, 2.4]} />
            <meshBasicMaterial map={getTableTexture()} transparent opacity={0.28} depthWrite={false} toneMapped={false} />
          </mesh>
          <mesh ref={ring} position={[0, 0.1, 0.001]} scale={0.15}>
            <ringGeometry args={[0.46, 0.5, 64]} />
            <meshBasicMaterial ref={ringMat} color={TEAL} transparent opacity={0} depthWrite={false} toneMapped={false} />
          </mesh>
        </group>
      )}
    </>
  );
}
