"use client";

import { useEffect, useRef } from "react";
import { invalidate, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { world } from "./world-state";

/* The light the cursor throws in the hallway.
 *
 * The tubes cursor (components/ui/tubes-cursor) draws its ribbons on its own
 * canvas above the page. This is its light in the room: four point lights in
 * the cursor's colours, hung on a plane 2.6 m in front of the camera and
 * following it, one at the cursor and three spaced back along the path the
 * cursor just took. The walls, floor and screens come up wherever the
 * ribbons are and fall back to dark. The hallway has no other light.
 *
 * The head lags the pointer a little and the trail is its history, the same
 * way the library moves its tubes, so the glow sits under the ribbons. */

const DEPTH = 2.6;
const LIFE = 1200; // ms a trail point survives
const MAX_POINTS = 80;
const AT = [1, 0.75, 0.5, 0.25]; // where along the trail each light rides (1 = head)
const INTENSITY = [4.5, 2.5, 1.8, 1.2];

const lightColor = (hex: string) => new THREE.Color(hex).lerp(new THREE.Color("#ffffff"), 0.35);

type Res = { group: THREE.Group; inner: THREE.Group; lights: THREE.PointLight[] };

export default function CursorLights() {
  const size = useThree((s) => s.size);
  const scene = useThree((s) => s.scene);
  const sizeRef = useRef(size);
  const R = useRef<Res | null>(null);
  if (R.current === null) {
    const group = new THREE.Group();
    const inner = new THREE.Group();
    group.add(inner);
    const lights = AT.map(() => { const l = new THREE.PointLight("#ffffff", 0, 3.5, 2); inner.add(l); return l; });
    R.current = { group, inner, lights };
  }
  const points = useRef<{ x: number; y: number; t: number }[]>([]);
  const st = useRef({ enabled: false, cx: 0, cy: 0, hx: 0, hy: 0, has: false, lastPush: 0, colorsAt: -1 });

  useEffect(() => {
    const g = R.current!.group;
    scene.add(g);
    return () => { scene.remove(g); };
  }, [scene]);

  useEffect(() => { sizeRef.current = size; }, [size]);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    st.current.enabled = fine && !reduced;
    world.pointer.fine = fine;
    const move = (e: PointerEvent) => {
      const { width, height } = sizeRef.current;
      const c = st.current;
      c.cx = e.clientX - width / 2; c.cy = height / 2 - e.clientY;
      if (!c.has) { c.has = true; c.hx = c.cx; c.hy = c.cy; }
      world.pointer.x = e.clientX; world.pointer.y = e.clientY;
      world.pointer.nx = (e.clientX / window.innerWidth) * 2 - 1;
      world.pointer.ny = -((e.clientY / window.innerHeight) * 2 - 1);
      world.pointer.t = performance.now();
      invalidate();
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  /* Before the world renders (priority -1), so the room sees this frame's
     light, not last frame's. */
  useFrame((s, dt) => {
    const c = st.current;
    const r = R.current!;
    if (!c.enabled || !world.active) { r.group.visible = false; return; }
    const now = performance.now();
    const pts = points.current;

    if (c.has) {
      const k = 1 - Math.exp(-Math.max(dt, 1 / 120) * 14);
      c.hx += (c.cx - c.hx) * k; c.hy += (c.cy - c.hy) * k;
      const last = pts[pts.length - 1];
      if ((!last || Math.hypot(last.x - c.hx, last.y - c.hy) > 2) && now - c.lastPush > 8) {
        pts.push({ x: c.hx, y: c.hy, t: now });
        c.lastPush = now;
        if (pts.length > MAX_POINTS) pts.shift();
      }
    }
    while (pts.length && now - pts[0].t > LIFE) pts.shift();

    // Colours follow the cursor's (a click re-rolls them).
    if (world.cursorColorsAt !== c.colorsAt) {
      c.colorsAt = world.cursorColorsAt;
      world.cursorColors.forEach((hex, j) => { if (r.lights[j]) r.lights[j].color.copy(lightColor(hex)); });
    }

    // The pixel-space trail hung on a plane DEPTH metres ahead of the camera,
    // scaled so a pixel is a pixel at that distance.
    const cam = s.camera as THREE.PerspectiveCamera;
    const visH = 2 * DEPTH * Math.tan((cam.fov * Math.PI) / 360);
    const k = visH / s.size.height;
    r.group.position.copy(cam.position);
    r.group.quaternion.copy(cam.quaternion);
    r.group.scale.setScalar(k);
    r.inner.position.set(0, 0, -DEPTH / k);
    r.group.visible = true;

    const n = pts.length;
    const enter = world.enter;
    r.lights.forEach((l, j) => {
      if (j === 0 && c.has) {
        l.position.set(c.hx, c.hy, 0);
        l.intensity = INTENSITY[0] * enter;
      } else if (n >= 3) {
        const p = pts[Math.max(0, Math.min(n - 1, Math.round((n - 1) * AT[j])))];
        l.position.set(p.x, p.y, 0);
        l.intensity = INTENSITY[j] * enter;
      } else {
        l.intensity = 0;
      }
    });
    if (n > 0 || now - world.pointer.t < 200) s.invalidate();
  }, -1);

  return null;
}
