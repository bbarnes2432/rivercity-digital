"use client";

import { useEffect, useRef } from "react";
import { invalidate, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";
import { world } from "./world-state";

/* The tubes cursor — the threejs-components "tubes1" cursor, rebuilt inside
 * the page's own canvas so it can be IN the hallway rather than painted over
 * it.
 *
 * Same construction as the original: sixteen metal tubes (metalness 1,
 * roughness 0.25) of random radius and length, each a chain of points where
 * the head chases the pointer (with a little per-tube noise so they fan out)
 * and every point behind chases the one in front — that is what turns a
 * gesture into a ribbon that overshoots and settles. Four coloured point
 * lights ride with the head; they are all the light the tubes get, which is
 * where the dark bodies and coloured rims come from. Bloom is applied by
 * Composite, over the whole frame, threshold 0, as in the original.
 *
 * Over the page the tubes live in a scene of their own and are added on top
 * of whatever the canvas already holds. In the hallway they are moved into
 * the room, two and a half metres ahead of the camera, and their four
 * lights are the room's only light: short range, so they light the wall or
 * the floor they are near and nothing further. The tubes fade out over the
 * light chapters. Mouse only; a click re-rolls the colours. */

const TUBE_COLORS = ["#5e72e4", "#8965e0", "#f5365c"];
const LIGHT_COLORS = ["#21d4fd", "#b721ff", "#f4d03f", "#11cdef"];
const COUNT = 16;
const MIN_R = 0.005, MAX_R = 0.05;
const MIN_SEG = 32, MAX_SEG = 128;
const LERP = 0.5;
const NOISE = 0.05;
const RADIAL = 8;
/* The original's camera sits 5 units from the tubes; sizes are in that
 * space. In the hall the same group is scaled to sit DEPTH metres ahead. */
const CAM = 5;
const DEPTH = 2.6;
const SCALE = DEPTH / CAM;
/* The four lights ride the longest tube: at its head and a quarter, half and
 * three quarters of the way back, a little toward the camera, so the whole
 * ribbon is lit and the room lights up along its path, nowhere else. */
const LIGHT_AT = [0, 0.25, 0.5, 0.75];
const LIGHT_LIFT = 1.0;
const LIGHT_INTENSITY = 6;
const LIGHT_REACH = 3.0; // metres, in the world
const LIGHT_SEL = ".rcd-light, .section--working, .section--bg-coffee, .rcd-inline-contact-section, footer";

const noise = new ImprovedNoise();

const randomColors = (n: number) =>
  Array.from({ length: n }, () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"));

function gradient(stops: string[], t: number): THREE.Color {
  const cs = stops.map((s) => new THREE.Color(s));
  const i = Math.min(1, Math.max(0, t)) * (cs.length - 1);
  const n = Math.floor(i);
  if (n >= cs.length - 1) return cs[cs.length - 1];
  return cs[n].clone().lerp(cs[n + 1], i - n);
}

class Tube extends THREE.Mesh<THREE.TubeGeometry, THREE.MeshStandardMaterial> {
  points: THREE.Vector3[];
  curve: THREE.CatmullRomCurve3;
  radius: number;
  segs: number;
  timeDelta = 100 * Math.random();
  to = new THREE.Vector3();

  constructor(segs: number, radius: number, material: THREE.MeshStandardMaterial) {
    const points = Array.from({ length: segs + 1 }, (_, i) => new THREE.Vector3(0, 0, (-i / segs) * 2));
    const curve = new THREE.CatmullRomCurve3(points);
    super(new THREE.TubeGeometry(curve, segs, radius, RADIAL, false), material);
    this.points = points;
    this.curve = curve;
    this.radius = radius;
    this.segs = segs;
    this.frustumCulled = false;
    this.update();
  }

  lerpTo(target: THREE.Vector3, elapsed: number) {
    const td = this.timeDelta;
    const ax = 0.01 * target.x + 0.04 * elapsed + td;
    const ay = 0.01 * target.y + 0.048 * elapsed + td;
    const az = 0.01 * target.z + 0.06 * elapsed + td;
    this.to.copy(target);
    this.to.x += noise.noise(ax, ay, az) * 2 * NOISE;
    this.to.y += noise.noise(ay + 31.7, az + 11.3, ax) * 2 * NOISE;
    this.to.z += noise.noise(az + 7.9, ax + 3.1, ay + 19.4) * 2 * NOISE;
    this.points[0].lerp(this.to, LERP);
    for (let i = 1; i < this.points.length; i++) this.points[i].lerp(this.points[i - 1], LERP);
    this.update();
  }

  /* Rebuild the ring of vertices around each point: the radius swells to the
   * middle and tapers to both ends, as in the original. */
  update() {
    const { segs, radius, points } = this;
    this.curve.updateArcLengths();
    const frames = this.curve.computeFrenetFrames(points.length, false);
    const pos = this.geometry.attributes.position as THREE.BufferAttribute;
    const nor = this.geometry.attributes.normal as THREE.BufferAttribute;
    let d = 0;
    for (let e = 0; e <= segs; e++) {
      const c = Math.sin((e / segs) * Math.PI) * radius;
      const l = points[e];
      const N = frames.normals[e], B = frames.binormals[e];
      for (let j = 0; j <= RADIAL; j++) {
        const t = (j / RADIAL) * Math.PI * 2, s = Math.sin(t), r = -Math.cos(t);
        let ux = r * N.x + s * B.x, uy = r * N.y + s * B.y, uz = r * N.z + s * B.z;
        const len = Math.hypot(ux, uy, uz) || 1;
        ux /= len; uy /= len; uz /= len;
        pos.setXYZ(d, l.x + c * ux, l.y + c * uy, l.z + c * uz);
        nor.setXYZ(d, ux, uy, uz);
        d++;
      }
    }
    pos.needsUpdate = true;
    nor.needsUpdate = true;
  }
}

/* Module singleton: Composite reads it every frame. */
type Tubes = {
  group: THREE.Group;
  inner: THREE.Group;
  cursorScene: THREE.Scene;
  tubes: Tube[];
  lights: THREE.PointLight[];
  longest: Tube;
  elapsed: number;
  fade: number;
  visible: boolean;
};
let T: Tubes | null = null;
export function getTubes(): Tubes {
  if (T) return T;
  const group = new THREE.Group();
  const inner = new THREE.Group();
  group.add(inner);
  const tubes: Tube[] = [];
  for (let i = 0; i < COUNT; i++) {
    const mat = new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0.25, color: gradient(TUBE_COLORS, i / (COUNT - 1)) });
    const t = new Tube(THREE.MathUtils.randInt(MIN_SEG, MAX_SEG), THREE.MathUtils.randFloat(MIN_R, MAX_R), mat);
    tubes.push(t);
    inner.add(t);
  }
  const lights = LIGHT_COLORS.map((c) => { const l = new THREE.PointLight(c, 0, LIGHT_REACH, 2); inner.add(l); return l; });
  const cursorScene = new THREE.Scene();
  cursorScene.add(group);
  const longest = tubes.reduce((a, b) => (b.segs > a.segs ? b : a), tubes[0]);
  T = { group, inner, cursorScene, tubes, lights, longest, elapsed: 0, fade: 1, visible: false };
  return T;
}

export default function CursorTubes() {
  const scene = useThree((s) => s.scene);
  const st = useRef({ enabled: false, nx: 0, ny: 0, has: false, overLight: false, inHall: false, target: new THREE.Vector3(), settled: 0 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    st.current.enabled = fine && !reduced;
    world.pointer.fine = fine;
    if (!st.current.enabled) return;
    const move = (e: PointerEvent) => {
      const c = st.current;
      c.nx = (e.clientX / window.innerWidth) * 2 - 1;
      c.ny = -((e.clientY / window.innerHeight) * 2 - 1);
      c.has = true;
      // Over a light chapter the cursor carries no light.
      const el = document.elementFromPoint(e.clientX, e.clientY);
      c.overLight = !!(el && el.closest(LIGHT_SEL));
      world.pointer.x = e.clientX; world.pointer.y = e.clientY;
      world.pointer.nx = c.nx; world.pointer.ny = c.ny;
      world.pointer.t = performance.now();
      invalidate();
    };
    const click = () => {
      const t = getTubes();
      const tc = randomColors(3), lc = randomColors(4);
      t.tubes.forEach((tube, i) => tube.material.color.copy(gradient(tc, i / (COUNT - 1))));
      t.lights.forEach((l, i) => l.color.set(lc[i]));
      invalidate();
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("click", click);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("click", click);
    };
  }, []);

  useEffect(() => {
    const t = getTubes();
    return () => { t.cursorScene.add(t.group); };
  }, []);

  /* After the world has placed the camera (priority 0), before Composite
     renders (50). */
  useFrame((s, dt) => {
    const c = st.current;
    const t = getTubes();
    if (!c.enabled || !c.has) { t.visible = false; t.group.visible = false; return; }

    const inHall = world.active;
    if (inHall !== c.inHall) {
      c.inHall = inHall;
      (inHall ? scene : t.cursorScene).add(t.group);
    }
    const wantFade = c.overLight ? 0 : 1;
    t.fade = THREE.MathUtils.damp(t.fade, wantFade, 8, dt);

    // The cursor plane: CAM units ahead in the original's space, scaled to
    // DEPTH metres ahead of whichever camera is current.
    const cam = s.camera as THREE.PerspectiveCamera;
    cam.updateMatrixWorld();
    t.group.position.copy(cam.position);
    t.group.quaternion.copy(cam.quaternion);
    t.group.scale.setScalar(SCALE);
    t.inner.position.set(0, 0, -CAM);
    const wH = 2 * CAM * Math.tan((cam.fov * Math.PI) / 360);
    const wW = wH * (s.size.width / s.size.height);
    c.target.set((c.nx * wW) / 2, (c.ny * wH) / 2, 0);

    t.elapsed += dt;
    for (const tube of t.tubes) tube.lerpTo(c.target, t.elapsed);
    const head = t.tubes[0].points[0];
    const tail = t.tubes[0].points[t.tubes[0].points.length - 1];
    const moving = head.distanceTo(c.target) > 1e-3 || tail.distanceTo(head) > 1e-3;

    const boost = inHall ? 0.3 + 0.7 * world.enter : 1;
    const chain = t.longest.points;
    t.lights.forEach((l, j) => {
      const p = chain[Math.round((chain.length - 1) * LIGHT_AT[j])];
      l.position.set(p.x, p.y, p.z + LIGHT_LIFT);
      l.intensity = LIGHT_INTENSITY * t.fade * boost;
    });
    t.visible = t.fade > 0.01;
    t.group.visible = t.visible;
    if (moving || Math.abs(t.fade - wantFade) > 1e-3) s.invalidate();
  }, 1);

  return null;
}
