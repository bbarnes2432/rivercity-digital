"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei/core/Texture";
import * as THREE from "three";
import { PROJECTS } from "@/app/work/_data";
import { world } from "./world-state";
import { texUrl } from "./tex";

/* The hallway.
 *
 * A dark room in the root of the shared canvas: matte walls, a floor with a
 * faint reflection, and eight screens mounted along the walls, alternating
 * left and right. Each screen is the only light in its stretch of the hall —
 * a point light in its colour (the average of the screenshot) throws it onto
 * the wall, the floor and the ceiling, and a soft halo of the same colour
 * bleeds across the wall behind it. Fog takes the far end into black.
 *
 * Scroll progress in the hallway section walks the camera. Screens ahead
 * are dark until you come within a few metres, then light up; the whole room
 * comes up from black as the section enters the viewport. At the far end is
 * a doorway showing the next part of the page — by the end of the section
 * the camera is in it, and the page carries on down as normal.
 *
 * The DOM owns the words (captions, links, the no-WebGL grid). This owns the
 * walk. It draws only while the hallway section is on screen. */

const ORDER = [
  "lucky-puppy",
  "shear-fantasy",
  "lovely-nails",
  "pet-planet",
  "the-sauce-fix",
  "mend-health",
  "the-wellness-collective",
  "confetti-and-co",
];
const SITES = ORDER.map((slug) => PROJECTS.find((p) => p.slug === slug)!);

const SPACING = 3.6; // metres between screens
const FIRST_Z = -3.0;
const LAST_Z = FIRST_Z - SPACING * (SITES.length - 1);
const DOOR_Z = LAST_Z - 3.6;
const START_Z = 1.6; // camera at progress 0
const DOOR_W = 3.6;
const DOOR_H = 2.25;
// Camera at progress 1: exactly far enough back that the door fills the view.
const END_Z = DOOR_Z + DOOR_H / (2 * Math.tan((42 * Math.PI) / 360));
const HALF = 2.7; // wall x
const FLOOR = -1.45;
const CEIL = 1.55;
const SW = 2.0; // screen width; 1.8:1 is the screenshots' crop ratio
const SH = SW / 1.8;
const LEAN = Math.PI / 2 - 0.55; // a wall screen, angled a little toward the walker
const ROOM_NEAR = 4;
const ROOM_FAR = DOOR_Z - 1.5;
const ROOM_MID = (ROOM_NEAR + ROOM_FAR) / 2;

/* A soft radial spot: the light a screen bleeds onto the wall behind it, and
 * the glow around the doorway. */
let HALO_TEX: THREE.CanvasTexture | null = null;
function haloTex(): THREE.CanvasTexture {
  if (HALO_TEX) return HALO_TEX;
  const cv = document.createElement("canvas");
  cv.width = cv.height = 256;
  const ctx = cv.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.45)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  HALO_TEX = new THREE.CanvasTexture(cv);
  return HALO_TEX;
}

/* The doorway at the end of the hall shows the next chapter's opening —
 * the same words the page shows once you are through. */
let DOOR_TEX: THREE.CanvasTexture | null = null;
function doorTex(): THREE.CanvasTexture {
  if (DOOR_TEX) return DOOR_TEX;
  const cw = 1024, ch = Math.round(1024 * (DOOR_H / DOOR_W));
  const cv = document.createElement("canvas");
  cv.width = cw; cv.height = ch;
  const ctx = cv.getContext("2d")!;
  const css = getComputedStyle(document.body);
  const barlow = css.getPropertyValue("--font-barlow").trim() || '"Barlow Condensed"';
  const inter = css.getPropertyValue("--font-inter").trim() || "Inter";
  const mono = css.getPropertyValue("--font-mono").trim() || "monospace";
  ctx.fillStyle = "#101D31";
  ctx.fillRect(0, 0, cw, ch);
  ctx.textAlign = "center";
  ctx.fillStyle = "#7FC3C8";
  ctx.font = `600 22px ${mono}`;
  ctx.fillText("W H A T ' S   P O S S I B L E   ·   L I V E ,   N O T   A   V I D E O", cw / 2, ch * 0.3);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 118px ${barlow}, "Barlow Condensed", sans-serif`;
  ctx.fillText("THINGS A TEMPLATE", cw / 2, ch * 0.3 + 128);
  ctx.fillText("CAN'T DO.", cw / 2, ch * 0.3 + 244);
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = `400 26px ${inter}, sans-serif`;
  ctx.fillText("Three small demonstrations, running right now in this page.", cw / 2, ch * 0.3 + 312);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  DOOR_TEX = t;
  return t;
}

/* Module singletons: the render loop mutates these, and the React compiler
 * lint refuses a hook return value or a ref read during render. One World
 * per page; they live with it. */
type Res = {
  wallMat: THREE.MeshStandardMaterial;
  floorMat: THREE.MeshStandardMaterial;
  bezelMat: THREE.MeshStandardMaterial;
  screenMats: THREE.MeshBasicMaterial[];
  reflMats: THREE.MeshBasicMaterial[];
  haloMats: THREE.MeshBasicMaterial[];
  doorMat: THREE.MeshBasicMaterial;
  doorGlow: THREE.MeshBasicMaterial;
  fog: THREE.FogExp2;
  colors: THREE.Color[];
  screenGeo: THREE.PlaneGeometry;
  bezelGeo: THREE.BoxGeometry;
  haloGeo: THREE.PlaneGeometry;
  floorGeo: THREE.PlaneGeometry;
  wallGeo: THREE.PlaneGeometry;
  doorGeo: THREE.PlaneGeometry;
  doorGlowGeo: THREE.PlaneGeometry;
};
let RES: Res | null = null;
function getRes(): Res {
  if (RES) return RES;
  const n = SITES.length;
  const halo = haloTex();
  RES = {
    wallMat: new THREE.MeshStandardMaterial({ color: "#0c1424", roughness: 0.92, metalness: 0.04 }),
    floorMat: new THREE.MeshStandardMaterial({ color: "#070c16", roughness: 0.5, metalness: 0.12, transparent: true, opacity: 0.86 }),
    bezelMat: new THREE.MeshStandardMaterial({ color: "#0a0d14", roughness: 0.45, metalness: 0.35 }),
    screenMats: Array.from({ length: n }, () => new THREE.MeshBasicMaterial({ toneMapped: false, color: 0x000000 })),
    reflMats: Array.from({ length: n }, () => new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })),
    haloMats: Array.from({ length: n }, () => new THREE.MeshBasicMaterial({ map: halo, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })),
    doorMat: new THREE.MeshBasicMaterial({ toneMapped: false, color: 0x000000 }),
    doorGlow: new THREE.MeshBasicMaterial({ map: halo, color: "#F6F2EA", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
    fog: new THREE.FogExp2(new THREE.Color("#04070d"), 0.085),
    colors: Array.from({ length: n }, () => new THREE.Color("#4CA5AD")),
    screenGeo: new THREE.PlaneGeometry(SW, SH),
    bezelGeo: new THREE.BoxGeometry(SW + 0.12, SH + 0.12, 0.06),
    haloGeo: new THREE.PlaneGeometry(4.6, 3.0),
    floorGeo: new THREE.PlaneGeometry(HALF * 2, ROOM_NEAR - ROOM_FAR),
    wallGeo: new THREE.PlaneGeometry(ROOM_NEAR - ROOM_FAR, CEIL - FLOOR),
    doorGeo: new THREE.PlaneGeometry(DOOR_W, DOOR_H),
    doorGlowGeo: new THREE.PlaneGeometry(DOOR_W * 1.9, DOOR_H * 2.1),
  };
  return RES;
}

/* The colour a screen throws: its average, pushed toward something a TV in
 * a dark room actually looks like — saturated, not too dark. */
function screenColor(img: HTMLImageElement | ImageBitmap): THREE.Color {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 8;
  const ctx = cv.getContext("2d")!;
  ctx.drawImage(img, 0, 0, 8, 8);
  const d = ctx.getImageData(0, 0, 8, 8).data;
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
  const k = d.length / 4;
  const c = new THREE.Color(r / k / 255, g / k / 255, b / k / 255);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, Math.max(hsl.s, 0.6), THREE.MathUtils.clamp(hsl.l, 0.5, 0.62));
  return c;
}

export default function World() {
  const group = useRef<THREE.Group>(null!);
  const lights = useRef<THREE.PointLight[]>([]);
  const doorLight = useRef<THREE.PointLight>(null!);
  const st = useRef({ z: START_Z, x: 0, y: 0.05, wasActive: false, t: 0, index: -1 });

  const narrow = typeof window !== "undefined" && window.innerWidth < 720;
  const maps = useTexture(
    SITES.map((p) => texUrl(p.img, narrow ? 640 : 1080)),
    (t) => {
      (Array.isArray(t) ? t : [t]).forEach((tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
      });
    },
  ) as THREE.Texture[];

  const res = getRes();

  // The screenshots onto the screens and their reflections; each screen's
  // light takes its colour from its screenshot. Once.
  useEffect(() => {
    const r = getRes();
    maps.forEach((m, i) => {
      r.screenMats[i].map = m; r.screenMats[i].needsUpdate = true;
      r.reflMats[i].map = m; r.reflMats[i].needsUpdate = true;
      if (!m.image) return;
      const c = screenColor(m.image as HTMLImageElement);
      r.colors[i].copy(c);
      r.haloMats[i].color.copy(c);
    });
    r.doorMat.map = doorTex(); r.doorMat.needsUpdate = true;
  }, [maps]);

  useFrame((s, dt) => {
    const a = world.active;
    const g = group.current;
    const c = st.current;
    const r = getRes();
    if (a !== c.wasActive) {
      c.wasActive = a;
      g.visible = a;
      // Fog only while the hallway is the scene; the views elsewhere have
      // their own cameras and must not be fogged.
      s.scene.fog = a ? r.fog : null;
    }
    if (!a) return;

    c.t += dt;
    const p = world.progress;
    const enter = world.enter;
    const cam = s.camera as THREE.PerspectiveCamera;
    const targetZ = START_Z + p * (END_Z - START_Z);
    const targetX = world.pointer.fine ? world.pointer.nx * 0.16 : 0;
    const targetY = 0.05 + (world.pointer.fine ? world.pointer.ny * 0.06 : 0);
    const before = c.z + c.x + c.y;
    c.z = THREE.MathUtils.damp(c.z, targetZ, 3.2, dt);
    c.x = THREE.MathUtils.damp(c.x, targetX, 4, dt);
    c.y = THREE.MathUtils.damp(c.y, targetY, 4, dt);
    cam.position.set(c.x, c.y, c.z);
    cam.lookAt(c.x * 0.3, 0, c.z - 6);
    if (cam.fov !== 42) { cam.fov = 42; cam.near = 0.1; cam.far = 80; cam.updateProjectionMatrix(); }

    // Screens ahead are dark until the walker is within a few metres; the
    // whole room comes up with the section. Nearest screen → the caption.
    let nearest = 0, nearestD = Infinity;
    for (let i = 0; i < SITES.length; i++) {
      const z = FIRST_Z - i * SPACING;
      const ahead = c.z - z; // metres in front of the camera
      const fade = 1 - THREE.MathUtils.smoothstep(ahead, 6.5, 11.5);
      const b = enter * fade;
      r.screenMats[i].color.setScalar(0.06 + 0.94 * b);
      r.reflMats[i].opacity = 0.26 * b;
      r.haloMats[i].opacity = 0.62 * b;
      const l = lights.current[i];
      if (l) { l.intensity = 11 * b; l.color.copy(r.colors[i]); }
      const d = Math.abs(z - (c.z - 1.6));
      if (d < nearestD) { nearestD = d; nearest = i; }
    }
    if (nearest !== c.index) { c.index = nearest; world.index = nearest; }

    // The doorway: the next chapter, lit, growing as you approach.
    const doorNear = 1 - THREE.MathUtils.smoothstep(c.z - DOOR_Z, 4, 16);
    r.doorMat.color.setScalar(0.25 + 0.75 * enter);
    r.doorGlow.opacity = 0.5 * enter * (0.4 + 0.6 * doorNear);
    if (doorLight.current) doorLight.current.intensity = 16 * enter * (0.3 + 0.7 * doorNear);

    const moving = Math.abs(c.z + c.x + c.y - before) > 1e-4 || performance.now() - world.pointer.t < 120;
    // r3f skips its own render pass once any useFrame subscriber has a
    // priority above zero — the views and the cursor HUD both do — so the
    // root scene draws itself. Full viewport: the last view left it small.
    s.gl.setScissorTest(false);
    s.gl.setViewport(0, 0, s.size.width, s.size.height);
    s.gl.render(s.scene, cam);
    if (moving) s.invalidate();
  });

  return (
    <group ref={group} visible={false}>
      <ambientLight intensity={0.05} />

      {/* The room. */}
      <mesh geometry={res.floorGeo} material={res.floorMat} rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR, ROOM_MID]} renderOrder={2} />
      <mesh geometry={res.floorGeo} material={res.wallMat} rotation={[Math.PI / 2, 0, 0]} position={[0, CEIL, ROOM_MID]} />
      <mesh geometry={res.wallGeo} material={res.wallMat} rotation={[0, Math.PI / 2, 0]} position={[-HALF, (FLOOR + CEIL) / 2, ROOM_MID]} />
      <mesh geometry={res.wallGeo} material={res.wallMat} rotation={[0, -Math.PI / 2, 0]} position={[HALF, (FLOOR + CEIL) / 2, ROOM_MID]} />

      {/* The screens. */}
      {SITES.map((p, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        const z = FIRST_Z - i * SPACING;
        const x = side * (HALF - 0.6);
        const rotY = -side * LEAN;
        return (
          <group key={p.slug}>
            <group position={[x, 0.1, z]} rotation={[0, rotY, 0]}>
              <mesh geometry={res.bezelGeo} material={res.bezelMat} position={[0, 0, -0.035]} />
              <mesh geometry={res.screenGeo} material={res.screenMats[i]} />
            </group>
            {/* Its reflection in the floor, and the light it throws. */}
            <group position={[x, 2 * FLOOR - 0.1, z]} rotation={[0, rotY, 0]} scale={[1, -1, 1]}>
              <mesh geometry={res.screenGeo} material={res.reflMats[i]} renderOrder={1} />
            </group>
            <mesh geometry={res.haloGeo} material={res.haloMats[i]} position={[side * (HALF - 0.02), 0.1, z]} rotation={[0, -side * Math.PI / 2, 0]} />
            <pointLight ref={(el) => { if (el) lights.current[i] = el; }} position={[side * (HALF - 1.1), 0.2, z]} distance={7.5} decay={2} intensity={0} />
          </group>
        );
      })}

      {/* The doorway at the end. */}
      <mesh geometry={res.doorGlowGeo} material={res.doorGlow} position={[0, 0.05, DOOR_Z - 0.02]} />
      <mesh geometry={res.doorGeo} material={res.doorMat} position={[0, 0.05, DOOR_Z]} />
      <pointLight ref={doorLight} position={[0, 0.2, DOOR_Z + 1.2]} color="#F6F2EA" distance={9} decay={2} intensity={0} />
    </group>
  );
}
