"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera";
import * as THREE from "three";

/* Template → custom.
 *
 * Nine thousand points. Each has two homes — a pixel of the word TEMPLATE
 * and a pixel of the word CUSTOM, sampled from the page's own display face
 * drawn on an offscreen 2D canvas — and one number, 0..1, says how far along
 * the flight it is. Scroll moves the number; the vertex shader does the rest:
 * every point leaves a little later than its neighbour, arcs out of the
 * plane mid-flight, and settles. The cursor pushes points aside and they
 * drift back. Nothing is computed per frame on the CPU. */

const COUNT = 9000;
const WIDTH = 2.8; // world width of the wordmark
const FROM = "TEMPLATE";
const TO = "CUSTOM";

const VERT = /* glsl */ `
attribute vec3 aPos1; attribute vec3 aSeed;
uniform float uMix; uniform vec2 uPointer; uniform float uForce; uniform float uTime; uniform float uSize; uniform float uDpr;
varying float vA;
void main(){
  float m = smoothstep(0.0, 1.0, clamp((uMix - aSeed.x * 0.35) / 0.65, 0.0, 1.0));
  vec3 p = mix(position, aPos1, m);
  float arc = sin(m * 3.14159265);
  p.x += cos(aSeed.y) * aSeed.z * arc;
  p.y += sin(aSeed.y) * aSeed.z * arc * 0.6;
  p.z += arc * 0.5 * aSeed.z;
  p.x += sin(uTime * 0.8 + aSeed.y * 6.0) * 0.005;
  p.y += cos(uTime * 0.7 + aSeed.z * 9.0) * 0.005;
  vec2 d = p.xy - uPointer;
  float L = length(d);
  float R = 0.3;
  if (L < R) { float k = (R - L) / R; p.xy += (d / max(L, 0.001)) * k * k * 0.22 * uForce * (0.6 + 0.4 * aSeed.x); }
  vA = 0.2 + 0.8 * arc;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * uDpr * (1.0 + arc * 0.9) * (2.4 / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = /* glsl */ `
uniform vec3 uColorA; uniform vec3 uColorB;
varying float vA;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float r2 = dot(c, c);
  if (r2 > 0.25) discard;
  float soft = 1.0 - smoothstep(0.12, 0.25, r2);
  gl_FragColor = vec4(mix(uColorA, uColorB, vA), soft * (0.55 + 0.25 * vA));
  #include <colorspace_fragment>
}`;

/* Draw a word on a 2D canvas in the page's display face and return the
 * world-space xy of every other lit pixel. */
function sample(text: string): number[] {
  const cw = 1024, ch = 256;
  const cv = document.createElement("canvas");
  cv.width = cw; cv.height = ch;
  const ctx = cv.getContext("2d")!;
  const fam = getComputedStyle(document.body).getPropertyValue("--font-barlow").trim();
  const family = `${fam ? fam + ", " : ""}"Barlow Condensed", Impact, "Arial Narrow", sans-serif`;
  let size = 220;
  ctx.font = `700 ${size}px ${family}`;
  const w = ctx.measureText(text).width;
  if (w > cw * 0.94) { size = Math.floor(size * (cw * 0.94) / w); ctx.font = `700 ${size}px ${family}`; }
  ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#fff";
  ctx.fillText(text, cw / 2, ch / 2 + size * 0.04);
  const data = ctx.getImageData(0, 0, cw, ch).data;
  const pts: number[] = [];
  for (let y = 0; y < ch; y += 2) for (let x = 0; x < cw; x += 2) {
    if (data[(y * cw + x) * 4 + 3] > 100) pts.push(((x / cw) - 0.5) * WIDTH, -((y / ch) - 0.5) * (WIDTH / 4));
  }
  return pts;
}

let GEO: THREE.BufferGeometry | null = null;
let MAT: THREE.ShaderMaterial | null = null;

function geo(): THREE.BufferGeometry {
  if (GEO) return GEO;
  const a = sample(FROM), b = sample(TO);
  const na = a.length / 2, nb = b.length / 2;
  const p0 = new Float32Array(COUNT * 3), p1 = new Float32Array(COUNT * 3), seed = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const ia = Math.floor(Math.random() * na), ib = Math.floor(Math.random() * nb);
    p0[i * 3] = a[ia * 2]; p0[i * 3 + 1] = a[ia * 2 + 1];
    p1[i * 3] = b[ib * 2]; p1[i * 3 + 1] = b[ib * 2 + 1];
    // Leave order follows x, left to right, with some jitter; a heading and a
    // reach for the arc.
    seed[i * 3] = THREE.MathUtils.clamp((a[ia * 2] / WIDTH + 0.5) * 0.8 + Math.random() * 0.2, 0, 1);
    seed[i * 3 + 1] = Math.random() * Math.PI * 2;
    seed[i * 3 + 2] = 0.06 + Math.random() * 0.3;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(p0, 3));
  g.setAttribute("aPos1", new THREE.BufferAttribute(p1, 3));
  g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 3));
  GEO = g;
  return g;
}

const mat = () =>
  (MAT ??= new THREE.ShaderMaterial({
    uniforms: {
      uMix: { value: 0 },
      uPointer: { value: new THREE.Vector2(99, 99) },
      uForce: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 1.9 },
      uDpr: { value: 1 },
      uColorA: { value: new THREE.Color("#4CA5AD") },
      uColorB: { value: new THREE.Color("#F6F2EA") },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }));

type Props = {
  getProgress: () => number;
  hovered: boolean;
  pointer: RefObject<{ x: number; y: number; t: number }>;
};

export default function Words({ getProgress, hovered, pointer }: Props) {
  const grp = useRef<THREE.Group>(null!);
  const st = useRef({ mix: 0, force: 0, t: 0 });

  useFrame((s, dt) => {
    const c = st.current;
    const targetMix = THREE.MathUtils.smoothstep(getProgress(), 0.15, 0.85);
    const before = c.mix + c.force;
    c.mix = THREE.MathUtils.damp(c.mix, targetMix, 2.5, dt);
    c.force = THREE.MathUtils.damp(c.force, hovered ? 1 : 0, 5, dt);
    c.t += dt;

    const aspect = s.size.width / s.size.height;
    const cam = s.camera as THREE.PerspectiveCamera;
    const h = 2 * cam.position.z * Math.tan((cam.fov * Math.PI) / 360);
    const scale = Math.min(1, (h * aspect * 0.92) / WIDTH);
    grp.current.scale.setScalar(scale);

    const u = mat().uniforms;
    u.uMix.value = c.mix;
    u.uForce.value = c.force;
    u.uTime.value = c.t;
    u.uDpr.value = s.viewport.dpr;
    (u.uPointer.value as THREE.Vector2).set((pointer.current.x * h * aspect) / 2 / scale, (pointer.current.y * h) / 2 / scale);
    if (Math.abs(c.mix + c.force - before) > 1e-4 || performance.now() - pointer.current.t < 120) s.invalidate();
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={40} position={[0, 0, 2.4]} />
      <group ref={grp}>
        <points geometry={geo()} material={mat()} frustumCulled={false} />
      </group>
    </>
  );
}
