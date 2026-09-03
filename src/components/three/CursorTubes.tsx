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
 * Two homes. Over the page, the ribbons are a HUD pass drawn last, in pixel
 * space. In the hallway they are IN the room: the same geometry hung on a
 * plane 2.6 m in front of the camera, following it, with point lights
 * riding the ribbon in its colours — so the walls, the floor and the screens
 * light up wherever the cursor has just been. The hallway has no other
 * light. Off for touch (no cursor to trace) and under reduced motion. */

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
const DEPTH = 2.6; // metres in front of the camera, in the hallway
const LIGHT_AT = [1, 0.78, 0.55, 0.32]; // where along the ribbon the lights ride (1 = head)

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
  vec3 col = uColor * (0.5 + 0.6 * rim) + vec3(0.18) * pow(rim, 6.0);
  gl_FragColor = vec4(col, tail * (0.45 + 0.4 * rim));
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

type Res = {
  group: THREE.Group; // follows the camera in the hall; identity over the page
  inner: THREE.Group; // pushed DEPTH metres ahead in the hall
  cam: THREE.OrthographicCamera;
  core: THREE.ShaderMaterial[];
  halo: THREE.ShaderMaterial[];
  meshes: THREE.Mesh[];
  lights: THREE.PointLight[];
};

const lightColor = (hex: string) => new THREE.Color(hex).lerp(new THREE.Color("#ffffff"), 0.45);

const mkMat = (frag: string, color: string, radius: number) =>
  new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uRadius: { value: radius } },
    vertexShader: VERT, fragmentShader: frag,
    transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
  });

export default function CursorTubes() {
  const size = useThree((s) => s.size);
  const scene = useThree((s) => s.scene);
  const sizeRef = useRef(size);
  const R = useRef<Res | null>(null);
  if (R.current === null) {
    const core = RADII.map((r, i) => mkMat(CORE, PALETTES[0][i], r));
    const halo = RADII.map((r, i) => mkMat(HALO, PALETTES[0][i], r * 2.8));
    const group = new THREE.Group();
    const inner = new THREE.Group();
    group.add(inner);
    // Halos first, cores on top.
    const meshes = [...halo, ...core].map((m) => { const mesh = new THREE.Mesh(new THREE.BufferGeometry(), m); mesh.frustumCulled = false; mesh.renderOrder = 10; inner.add(mesh); return mesh; });
    // The lights are the ribbon's colours pulled halfway to white: a coloured
    // glow on the walls, not a paint job.
    const lights = LIGHT_AT.map((_, j) => { const l = new THREE.PointLight(lightColor(PALETTES[0][j]), 0, 9, 2); inner.add(l); return l; });
    R.current = { group, inner, cam: new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10), core, halo, meshes, lights };
  }
  const points = useRef<{ x: number; y: number; t: number }[]>([]);
  const st = useRef({ palette: 0, enabled: false, dirty: false, cx: 0, cy: 0, hx: 0, hy: 0, has: false, lastPush: 0 });

  // The group lives in the root scene, so the hallway's render pass draws
  // the ribbons in the room and their lights reach its walls.
  useEffect(() => {
    const g = R.current!.group;
    scene.add(g);
    return () => { scene.remove(g); };
  }, [scene]);

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
        if (r.lights[i]) r.lights[i].color.copy(lightColor(col));
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

  /* Geometry, placement and lights — before the world renders (priority
     -1), so the room sees this frame's ribbon, not last frame's. */
  useFrame((s, dt) => {
    const c = st.current;
    const r = R.current!;
    if (!c.enabled) { r.group.visible = false; return; }
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

    if (world.active) {
      // In the room: the pixel-space ribbon hung on a plane DEPTH metres
      // ahead of the camera, scaled so a pixel is a pixel at that distance.
      const cam = s.camera as THREE.PerspectiveCamera;
      const visH = 2 * DEPTH * Math.tan((cam.fov * Math.PI) / 360);
      const k = visH / s.size.height;
      r.group.position.copy(cam.position);
      r.group.quaternion.copy(cam.quaternion);
      r.group.scale.setScalar(k);
      r.inner.position.set(0, 0, -DEPTH / k);
      r.group.visible = true;
      // Lights ride the ribbon: the head always (the cursor itself glows),
      // the rest spaced down the tail while it lives.
      const n = pts.length;
      const enter = world.enter;
      r.lights.forEach((l, j) => {
        if (j === 0 && c.has) {
          l.position.set(c.hx, c.hy, 0);
          l.intensity = 11 * enter;
        } else if (alive) {
          const p = pts[Math.max(0, Math.min(n - 1, Math.round((n - 1) * LIGHT_AT[j])))];
          l.position.set(p.x, p.y, 0);
          l.intensity = 7 * enter * LIGHT_AT[j];
        } else {
          l.intensity = 0;
        }
      });
    } else {
      r.group.position.set(0, 0, 0);
      r.group.quaternion.identity();
      r.group.scale.setScalar(1);
      r.inner.position.set(0, 0, 0);
      r.group.visible = alive;
      r.lights.forEach((l) => { l.intensity = 0; });
    }
    if (alive || (world.active && c.has)) s.invalidate();
  }, -1);

  /* Over the page (not the hall): the HUD pass, drawn last. */
  useFrame((s) => {
    const c = st.current;
    const r = R.current!;
    if (!c.enabled || world.active || !r.group.visible) return;
    const prev = s.gl.autoClear;
    s.gl.autoClear = false;
    s.gl.setScissorTest(false);
    s.gl.setViewport(0, 0, s.size.width, s.size.height);
    s.gl.render(r.group, r.cam);
    s.gl.autoClear = prev;
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
