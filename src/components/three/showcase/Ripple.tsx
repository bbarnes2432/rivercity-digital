"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei/core/Texture";
import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera";
import * as THREE from "three";
import { texUrl } from "../tex";

/* Reads the room.
 *
 * A screenshot filling the tile, and a fragment shader that bends it around
 * the cursor: rings spread from wherever the pointer is, strongest when it
 * moves fast, with the colour channels pulled slightly apart along the crest
 * so the surface reads as liquid rather than as a wobble. Energy is fed by
 * pointer speed and drains on its own, so a still cursor leaves a still
 * picture and the canvas stops drawing. */

const VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const FRAG = /* glsl */ `
uniform sampler2D uMap; uniform vec2 uPointer; uniform float uForce; uniform float uTime; uniform float uAspect;
varying vec2 vUv;
void main(){
  vec2 p = (vUv - uPointer) * vec2(uAspect, 1.0);
  float d = length(p);
  float wave = sin(d * 30.0 - uTime * 7.5) * exp(-d * 4.2) * uForce;
  vec2 dir = d > 0.0001 ? p / d : vec2(0.0);
  vec2 off = dir * wave * 0.04 / vec2(uAspect, 1.0);
  float r = texture2D(uMap, vUv + off * 1.2).r;
  float g = texture2D(uMap, vUv + off).g;
  float b = texture2D(uMap, vUv + off * 0.8).b;
  vec3 col = vec3(r, g, b);
  col += vec3(0.30, 0.65, 0.68) * max(wave, 0.0) * 0.55;   // teal along the crest
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

let MAT: THREE.ShaderMaterial | null = null;
const mat = () =>
  (MAT ??= new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: null },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uForce: { value: 0 },
      uTime: { value: 0 },
      uAspect: { value: 1.78 },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
  }));

type Props = {
  src: string;
  pointer: RefObject<{ x: number; y: number; t: number; energy: number }>;
};

export default function Ripple({ src, pointer }: Props) {
  const mesh = useRef<THREE.Mesh>(null!);
  const st = useRef({ energy: 0, seen: 0, px: 0.5, py: 0.5, t: 0 });

  const map = useTexture(texUrl(src, 1080), (t) => {
    const tex = Array.isArray(t) ? t[0] : t;
    tex.colorSpace = THREE.SRGBColorSpace;
  }) as THREE.Texture;

  useFrame((s, dt) => {
    const c = st.current;
    const pt = pointer.current;
    c.px = THREE.MathUtils.damp(c.px, (pt.x + 1) / 2, 14, dt);
    c.py = THREE.MathUtils.damp(c.py, (pt.y + 1) / 2, 14, dt);
    // The view adds energy on every move (a running total, never reset);
    // this takes what is new since the last frame and drains it.
    c.energy = Math.min(1, c.energy + (pt.energy - c.seen));
    c.seen = pt.energy;
    c.energy = THREE.MathUtils.damp(c.energy, 0, 1.5, dt);
    c.t += dt;

    const aspect = s.size.width / s.size.height;
    const cam = s.camera as THREE.PerspectiveCamera;
    const h = 2 * cam.position.z * Math.tan((cam.fov * Math.PI) / 360);
    mesh.current.scale.set(h * aspect, h, 1);

    const u = mat().uniforms;
    u.uMap.value = map;
    (u.uPointer.value as THREE.Vector2).set(c.px, c.py);
    u.uForce.value = c.energy;
    u.uTime.value = c.t;
    u.uAspect.value = aspect;
    if (c.energy > 0.004 || performance.now() - pt.t < 120) s.invalidate();
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={40} position={[0, 0, 2]} />
      <mesh ref={mesh} material={mat()}>
        <planeGeometry args={[1, 1]} />
      </mesh>
    </>
  );
}
