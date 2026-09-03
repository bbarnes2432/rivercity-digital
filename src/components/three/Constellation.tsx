"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera";
import * as THREE from "three";
import { TEAL } from "./develop-material";

/* The constellation behind the standards list: ~600 points, one draw call,
 * a custom dot shader. Order emerging from noise: as each list item reveals,
 * the scattered field gathers into two aligned columns flanking the text,
 * and it brightens toward the pointer.
 *
 * Gathering to the FLANKS, not the centre, matters: the canvas paints above
 * the page, so a field that tightened inward would land on the text (the
 * first version did exactly that — measured, the text column read three
 * times brighter than the margins). A mask band over the text column still
 * dims any stragglers. Normal blending, not additive: additive on a cream
 * ground pushes teal toward white and vanishes. */

const COUNT = 600;

const VERT = /* glsl */ `
attribute float aSeed;
uniform float uTime;
uniform float uOrder;    // 0 = scattered, 1 = gathered into the flanks
uniform vec2 uPointer;   // NDC
uniform vec2 uMask;      // NDC x band [left, right] to dim
uniform float uAspect;
uniform float uDpr;
varying float vAlpha;
void main() {
  vec3 p = position;
  // The ordered position: same side, pushed out to a column in the margin,
  // y compressed a little so the columns read as columns.
  float side = position.x < 0.0 ? -1.0 : 1.0;
  float ax = abs(position.x) / 2.6;
  // Columns at ~0.63–0.90 of the view's half-width: clear of the text band
  // (measured at ±0.56) and fully on screen, where 1.75–2.45 was hugging the
  // edge and losing points to the drift.
  vec3 ordered = vec3(side * (1.55 + 0.65 * ax), position.y * 0.85, position.z * 0.5);
  p = mix(p, ordered, uOrder);
  p.x += sin(uTime * 0.35 + aSeed * 6.2831) * 0.03;
  p.y += cos(uTime * 0.29 + aSeed * 3.1) * 0.03;
  vec4 clip = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  vec2 ndc = clip.xy / clip.w;
  float d = length((ndc - uPointer) * vec2(uAspect, 1.0));
  float near = 1.0 - smoothstep(0.0, 0.55, d);
  float inBand = step(uMask.x, ndc.x) * step(ndc.x, uMask.y);
  float base = 0.38 + 0.3 * aSeed;
  vAlpha = (base + 0.6 * near) * mix(1.0, 0.12, inBand);
  gl_PointSize = (2.4 + 1.6 * aSeed + 3.0 * near) * uDpr;
  gl_Position = clip;
}
`;
const FRAG = /* glsl */ `
uniform vec3 uTeal;
varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  float soft = 1.0 - smoothstep(0.3, 0.5, r);
  gl_FragColor = vec4(uTeal, vAlpha * soft);
  #include <colorspace_fragment>
}
`;

type Props = {
  pointer: RefObject<{ x: number; y: number; present: number }>;
  getSpread: () => number;
  getMask: () => [number, number];
};

export default function Constellation({ pointer, getSpread, getMask }: Props) {
  const points = useRef<THREE.Points>(null!);
  const st = useRef({ spread: 1, px: 0, py: 0, presence: 0 });

  const geometry = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const seed = new Float32Array(COUNT);
    let s = 1234567;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (rnd() * 2 - 1) * 2.6;
      pos[i * 3 + 1] = (rnd() * 2 - 1) * 1.5;
      pos[i * 3 + 2] = (rnd() * 2 - 1) * 0.6;
      seed[i] = rnd();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uOrder: { value: 0 },
          uPointer: { value: new THREE.Vector2(9, 9) },
          uMask: { value: new THREE.Vector2(-0.4, 0.4) },
          uAspect: { value: 1 },
          uDpr: { value: 1 },
          uTeal: { value: TEAL },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      }),
    [],
  );

  // Development-only: the live material and points, so the canvas can be
  // bisected from the console when a pixel probe reads nothing.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const w = window as unknown as { __rcdConstellation?: unknown };
    w.__rcdConstellation = { material, points: points.current };
    return () => {
      delete w.__rcdConstellation;
    };
  }, [material]);

  useFrame((s, dt) => {
    const state = st.current;
    const mat = points.current.material as THREE.ShaderMaterial;
    const u = mat.uniforms;
    // getSpread() is 1 (nothing revealed) → 0.55 (all revealed); order is its inverse.
    const spreadTarget = getSpread();
    state.spread = THREE.MathUtils.damp(state.spread, spreadTarget, 2.5, dt);
    const order = (1 - state.spread) / 0.45;
    const p = pointer.current;
    state.px = THREE.MathUtils.damp(state.px, p.x, 8, dt);
    state.py = THREE.MathUtils.damp(state.py, p.y, 8, dt);
    state.presence = THREE.MathUtils.damp(state.presence, p.present, 6, dt);
    u.uTime.value += dt;
    u.uOrder.value = THREE.MathUtils.clamp(order, 0, 1);
    // When the pointer is away, park it far off so nothing brightens.
    u.uPointer.value.set(state.presence > 0.02 ? state.px : 9, state.presence > 0.02 ? state.py : 9);
    const [l, r] = getMask();
    u.uMask.value.set(l, r);
    u.uAspect.value = s.size.width / Math.max(1, s.size.height);
    u.uDpr.value = s.viewport.dpr;
    // The drift is gentle enough to let rest: request frames only while the
    // spread or the pointer are still settling.
    if (Math.abs(state.spread - spreadTarget) > 1e-3 || Math.abs(state.presence - p.present) > 1e-3 || state.presence > 0.02) {
      s.invalidate();
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={40} position={[0, 0, 3.4]} />
      <points ref={points} geometry={geometry} material={material} />
    </>
  );
}
