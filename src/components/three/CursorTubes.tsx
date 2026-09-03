"use client";

import { useEffect, useRef } from "react";
import { invalidate, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { world } from "./world-state";

/* Tubes that trace the cursor.
 *
 * The reference was a CDN component that ships its own three.js, opens its
 * own WebGL context and paints a black full-screen canvas — three things the
 * page paid search lands on cannot afford. This is the same idea inside the
 * shared canvas: three glowing tubes ride a spline through the last half
 * second of pointer positions, the tail fades, and a click cycles the
 * palette. Rendered as a HUD pass with its own orthographic camera, after
 * the world, so the world's camera and fog never touch it.
 *
 * Off for touch (no cursor to trace) and under reduced motion. */

const PALETTES: [string, string, string][] = [
  ["#4CA5AD", "#F6F2EA", "#1B5E8C"],
  ["#7FC3C8", "#4CA5AD", "#F6F2EA"],
  ["#F6F2EA", "#1B5E8C", "#4CA5AD"],
];
const RADII = [7, 4.5, 2.6];
const OFFSETS: [number, number][] = [[0, 0], [5, -3], [-4, 4]];
const LIFE = 620; // ms a point survives
const MAX_POINTS = 28;

const VERT = /* glsl */ `
varying vec2 vUv; varying vec3 vN;
void main(){ vUv = uv; vN = normalMatrix * normal; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const FRAG = /* glsl */ `
uniform vec3 uColor; varying vec2 vUv; varying vec3 vN;
void main(){
  float rim = 0.45 + 0.55 * abs(vN.z);          // a fake light down the tube
  float tail = pow(vUv.x, 1.6);                  // fades toward the old end
  gl_FragColor = vec4(uColor * rim * 1.15, tail * 0.9);
  #include <colorspace_fragment>
}`;

export default function CursorTubes() {
  const size = useThree((s) => s.size);
  const sizeRef = useRef(size);
  // Everything the loop mutates lives in a lazily-filled ref.
  const R = useRef<{ hud: THREE.Scene; cam: THREE.OrthographicCamera; mats: THREE.ShaderMaterial[]; meshes: THREE.Mesh[] } | null>(null);
  if (R.current === null) {
    const mats = RADII.map((_, i) => new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(PALETTES[0][i]) } },
      vertexShader: VERT, fragmentShader: FRAG,
      transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
    }));
    const hud = new THREE.Scene();
    const meshes = mats.map((m) => { const mesh = new THREE.Mesh(new THREE.BufferGeometry(), m); mesh.frustumCulled = false; hud.add(mesh); return mesh; });
    R.current = { hud, cam: new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10), mats, meshes };
  }
  const points = useRef<{ x: number; y: number; t: number }[]>([]);
  const st = useRef({ palette: 0, enabled: false, dirty: false });

  useEffect(() => {
    sizeRef.current = size;
    const cam = R.current!.cam;
    cam.left = -size.width / 2; cam.right = size.width / 2; cam.top = size.height / 2; cam.bottom = -size.height / 2;
    cam.updateProjectionMatrix();
  }, [size]);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    st.current.enabled = fine && !reduced;
    if (!st.current.enabled) return;
    const move = (e: PointerEvent) => {
      const pts = points.current;
      const { width, height } = sizeRef.current;
      const x = e.clientX - width / 2, y = height / 2 - e.clientY;
      const last = pts[pts.length - 1];
      if (last && Math.hypot(last.x - x, last.y - y) < 3) return;
      pts.push({ x, y, t: performance.now() });
      if (pts.length > MAX_POINTS) pts.shift();
      st.current.dirty = true;
    };
    const click = () => {
      st.current.palette = (st.current.palette + 1) % PALETTES.length;
      PALETTES[st.current.palette].forEach((c, i) => (R.current!.mats[i].uniforms.uColor.value as THREE.Color).set(c));
      st.current.dirty = true;
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", click, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", click);
    };
  }, []);

  useFrame((s) => {
    if (!st.current.enabled) return;
    const now = performance.now();
    const pts = points.current;
    while (pts.length && now - pts[0].t > LIFE) { pts.shift(); st.current.dirty = true; }
    const alive = pts.length >= 3;
    if (st.current.dirty || alive) {
      st.current.dirty = false;
      for (let i = 0; i < RADII.length; i++) {
        const m = R.current!.meshes[i];
        m.geometry.dispose();
        if (alive) {
          const [ox, oy] = OFFSETS[i];
          const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p.x + ox, p.y + oy, 0)), false, "centripetal");
          m.geometry = new THREE.TubeGeometry(curve, Math.min(64, pts.length * 3), RADII[i], 7, false);
        } else {
          m.geometry = new THREE.BufferGeometry();
        }
      }
    }
    if (alive) {
      const { hud, cam } = R.current!;
      const prev = s.gl.autoClear;
      s.gl.autoClear = false;
      s.gl.setScissorTest(false);
      s.gl.setViewport(0, 0, s.size.width, s.size.height); // a view may have left it small
      s.gl.render(hud, cam);
      s.gl.autoClear = prev;
      s.invalidate(); // keep going until the tail has aged out
    }
  }, 100);

  // Pointer bookkeeping for the world (parallax) lives here too — one listener.
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    world.pointer.fine = fine;
    const move = (e: PointerEvent) => {
      world.pointer.x = e.clientX; world.pointer.y = e.clientY;
      world.pointer.nx = (e.clientX / window.innerWidth) * 2 - 1;
      world.pointer.ny = -((e.clientY / window.innerHeight) * 2 - 1);
      world.pointer.t = performance.now();
      invalidate();
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return null;
}
