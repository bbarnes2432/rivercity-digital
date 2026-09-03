"use client";

import { useEffect, useRef } from "react";
import { invalidate, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { world } from "./world-state";

/* Tubes that trace the cursor.
 *
 * Five glowing ribbons — pink, blue, violet, cyan, rose — braid around a
 * spline that follows the cursor with a little lag, so a fast gesture leaves
 * a long loop that keeps sweeping for a second and a half after the hand has
 * stopped. Each ribbon is drawn twice: a bright core, and a wide soft halo of
 * the same colour behind it, which is what gives the bloom without a
 * post-processing pass. The tail thins and fades; a click cycles the palette.
 *
 * Rendered as a HUD pass with its own orthographic camera, after everything
 * else, inside the page's one shared canvas. Off for touch (no cursor to
 * trace) and under reduced motion. */

const PALETTES: string[][] = [
  ["#ff2d95", "#3a5bff", "#8a3dff", "#22d3ee", "#ff6ad5"],
  ["#4CA5AD", "#F6F2EA", "#1B5E8C", "#7FC3C8", "#A8D8DC"],
  ["#ffb020", "#ff4d4d", "#ff8a3d", "#ffe066", "#ff5fa2"],
];
const RADII = [9, 6.5, 5, 3.6, 2.6];
const AMPS = [0, 9, 13, 16, 11]; // braid radius around the spline, px
const PHASES = [0, 1.3, 2.7, 4.1, 5.4];
const LIFE = 1600; // ms a point survives
const MAX_POINTS = 140;

const VERT = /* glsl */ `
uniform float uRadius;
varying vec2 vUv; varying vec3 vN;
void main(){
  vUv = uv; vN = normalMatrix * normal;
  // Taper: the tube thins toward the old end. TubeGeometry is a constant
  // radius; pulling each vertex back along its normal is the same thing.
  float t = 0.3 + 0.7 * smoothstep(0.0, 0.55, uv.x);
  vec3 p = position - normal * uRadius * (1.0 - t);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;
const CORE = /* glsl */ `
uniform vec3 uColor; varying vec2 vUv; varying vec3 vN;
void main(){
  float rim = pow(abs(vN.z), 1.1);
  float tail = smoothstep(0.0, 0.4, vUv.x);
  vec3 col = uColor * (0.55 + 0.75 * rim) + vec3(0.35) * pow(rim, 6.0);
  gl_FragColor = vec4(col, tail * (0.5 + 0.5 * rim));
  #include <colorspace_fragment>
}`;
const HALO = /* glsl */ `
uniform vec3 uColor; varying vec2 vUv; varying vec3 vN;
void main(){
  float rim = pow(abs(vN.z), 3.5);
  float tail = smoothstep(0.0, 0.45, vUv.x);
  gl_FragColor = vec4(uColor, tail * rim * 0.32);
  #include <colorspace_fragment>
}`;

type Res = { hud: THREE.Scene; cam: THREE.OrthographicCamera; core: THREE.ShaderMaterial[]; halo: THREE.ShaderMaterial[]; meshes: THREE.Mesh[] };

const mkMat = (frag: string, color: string, radius: number) =>
  new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uRadius: { value: radius } },
    vertexShader: VERT, fragmentShader: frag,
    transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
  });

export default function CursorTubes() {
  const size = useThree((s) => s.size);
  const sizeRef = useRef(size);
  const R = useRef<Res | null>(null);
  if (R.current === null) {
    const core = RADII.map((r, i) => mkMat(CORE, PALETTES[0][i], r));
    const halo = RADII.map((r, i) => mkMat(HALO, PALETTES[0][i], r * 2.8));
    const hud = new THREE.Scene();
    // Halos first, cores on top.
    const meshes = [...halo, ...core].map((m) => { const mesh = new THREE.Mesh(new THREE.BufferGeometry(), m); mesh.frustumCulled = false; hud.add(mesh); return mesh; });
    R.current = { hud, cam: new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10), core, halo, meshes };
  }
  const points = useRef<{ x: number; y: number; t: number }[]>([]);
  const st = useRef({ palette: 0, enabled: false, dirty: false, cx: 0, cy: 0, hx: 0, hy: 0, has: false, lastPush: 0 });

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
      const { width, height } = sizeRef.current;
      const c = st.current;
      c.cx = e.clientX - width / 2; c.cy = height / 2 - e.clientY;
      if (!c.has) { c.has = true; c.hx = c.cx; c.hy = c.cy; }
      c.dirty = true;
      invalidate();
    };
    const click = () => {
      const c = st.current;
      c.palette = (c.palette + 1) % PALETTES.length;
      const r = R.current!;
      PALETTES[c.palette].forEach((col, i) => {
        (r.core[i].uniforms.uColor.value as THREE.Color).set(col);
        (r.halo[i].uniforms.uColor.value as THREE.Color).set(col);
      });
      c.dirty = true;
      invalidate();
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", click, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", click);
    };
  }, []);

  useFrame((s, dt) => {
    const c = st.current;
    if (!c.enabled) return;
    const now = performance.now();
    const pts = points.current;

    // The head follows the cursor with a little lag, and the spline is the
    // head's history — this is what turns a jerky gesture into a ribbon.
    if (c.has) {
      const k = 1 - Math.exp(-Math.max(dt, 1 / 120) * 16); // dt is 0 on a stepped frame
      c.hx += (c.cx - c.hx) * k; c.hy += (c.cy - c.hy) * k;
      const last = pts[pts.length - 1];
      const far = !last || Math.hypot(last.x - c.hx, last.y - c.hy) > 1.5;
      if (far && now - c.lastPush > 8) {
        pts.push({ x: c.hx, y: c.hy, t: now });
        c.lastPush = now;
        if (pts.length > MAX_POINTS) pts.shift();
        c.dirty = true;
      }
    }
    while (pts.length && now - pts[0].t > LIFE) { pts.shift(); c.dirty = true; }

    const alive = pts.length >= 4;
    const r = R.current!;
    if (c.dirty || alive) {
      c.dirty = false;
      const time = now / 1000;
      for (let i = 0; i < RADII.length; i++) {
        let curve: THREE.CatmullRomCurve3 | null = null;
        if (alive) {
          const amp = AMPS[i];
          const v = pts.map((p, k) => {
            const a = PHASES[i] + k * 0.22 + time * 2.2;
            return new THREE.Vector3(p.x + Math.cos(a) * amp, p.y + Math.sin(a) * amp, 0);
          });
          curve = new THREE.CatmullRomCurve3(v, false, "centripetal", 0.5);
        }
        for (const which of [0, 1]) {
          const m = r.meshes[which * RADII.length + i];
          if (!m) continue;
          m.geometry.dispose();
          m.geometry = curve
            ? new THREE.TubeGeometry(curve, Math.min(200, pts.length * 2), which === 0 ? RADII[i] * 2.8 : RADII[i], 7, false)
            : new THREE.BufferGeometry();
        }
      }
    }
    if (alive) {
      const prev = s.gl.autoClear;
      s.gl.autoClear = false;
      s.gl.setScissorTest(false);
      s.gl.setViewport(0, 0, s.size.width, s.size.height);
      s.gl.render(r.hud, r.cam);
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
