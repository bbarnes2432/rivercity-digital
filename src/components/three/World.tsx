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
 * A dark room in the root of the shared canvas: matte walls, floor and
 * ceiling, and eight screens mounted along the walls, alternating left and
 * right. The screens are lit from within. The room itself has only a faint
 * sky-and-ground light so its edges read, and the cursor's lights
 * (CursorLights): four short-range lights in the cursor's colours that ride
 * the path the cursor just took, so the wall or floor near it comes up a
 * little. On touch there is no cursor, so a small lantern rides with the
 * camera. Fog takes the far end to black.
 *
 * Scroll progress in the hallway section walks the camera. The room comes
 * up from nothing as the section enters the viewport. At the far end is a
 * wall in the page's own navy; by the end of the section it fills the
 * view, and the next chapter scrolls up over it as if it were the wall.
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
const DOOR_W = 5.2;
const DOOR_H = 3.25;
// Camera at progress 1: far enough back that a 16:10 view is exactly filled
// by the middle of the wall; the wall is larger so the pointer parallax and
// wider screens never show its edge.
const END_Z = DOOR_Z + 2.25 / (2 * Math.tan((42 * Math.PI) / 360));
const HALF = 2.7; // wall x
const FLOOR = -1.45;
const CEIL = 1.55;
const SW = 2.0; // screen width; 1.8:1 is the screenshots' crop ratio
const SH = SW / 1.8;
const LEAN = Math.PI / 2 - 0.55; // a wall screen, angled a little toward the walker
const ROOM_NEAR = 4;
const ROOM_FAR = DOOR_Z - 1.5;
const ROOM_MID = (ROOM_NEAR + ROOM_FAR) / 2;

/* Module singletons: the render loop mutates these, and the React compiler
 * lint refuses a hook return value or a ref read during render. One World
 * per page; they live with it. */
type Res = {
  wallMat: THREE.MeshStandardMaterial;
  floorMat: THREE.MeshStandardMaterial;
  bezelMat: THREE.MeshStandardMaterial;
  screenMats: THREE.MeshStandardMaterial[];
  doorMat: THREE.MeshBasicMaterial;
  fog: THREE.FogExp2;
  screenGeo: THREE.PlaneGeometry;
  bezelGeo: THREE.BoxGeometry;
  floorGeo: THREE.PlaneGeometry;
  wallGeo: THREE.PlaneGeometry;
  doorGeo: THREE.PlaneGeometry;
};
let RES: Res | null = null;
function getRes(): Res {
  if (RES) return RES;
  const n = SITES.length;
  RES = {
    // Neutral, mid-light surfaces: they show whatever colour lands on them.
    wallMat: new THREE.MeshStandardMaterial({ color: "#6e7684", roughness: 0.94, metalness: 0.0 }),
    floorMat: new THREE.MeshStandardMaterial({ color: "#4a525f", roughness: 0.7, metalness: 0.05 }),
    bezelMat: new THREE.MeshStandardMaterial({ color: "#1a1f29", roughness: 0.5, metalness: 0.3 }),
    // The screens are screens: their picture is emissive, full brightness,
    // lit from within, whatever the room is doing.
    screenMats: Array.from({ length: n }, () => new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0, emissive: new THREE.Color("#ffffff"), emissiveIntensity: 0 })),
    doorMat: new THREE.MeshBasicMaterial({ toneMapped: false, fog: false, color: "#101D31" }),
    fog: new THREE.FogExp2(new THREE.Color("#04070d"), 0.08),
    screenGeo: new THREE.PlaneGeometry(SW, SH),
    bezelGeo: new THREE.BoxGeometry(SW + 0.12, SH + 0.12, 0.06),
    floorGeo: new THREE.PlaneGeometry(HALF * 2, ROOM_NEAR - ROOM_FAR),
    wallGeo: new THREE.PlaneGeometry(ROOM_NEAR - ROOM_FAR, CEIL - FLOOR),
    doorGeo: new THREE.PlaneGeometry(DOOR_W, DOOR_H),
  };
  return RES;
}

export default function World() {
  const group = useRef<THREE.Group>(null!);
  const lantern = useRef<THREE.PointLight>(null!);
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

  // The screenshots onto the screens, once.
  useEffect(() => {
    const r = getRes();
    maps.forEach((m, i) => {
      r.screenMats[i].map = m;
      r.screenMats[i].emissiveMap = m;
      r.screenMats[i].needsUpdate = true;
    });
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
    const fine = world.pointer.fine;
    const targetX = fine ? world.pointer.nx * 0.16 : 0;
    const targetY = 0.05 + (fine ? world.pointer.ny * 0.06 : 0);
    const before = c.z + c.x + c.y;
    c.z = THREE.MathUtils.damp(c.z, targetZ, 3.2, dt);
    c.x = THREE.MathUtils.damp(c.x, targetX, 4, dt);
    c.y = THREE.MathUtils.damp(c.y, targetY, 4, dt);
    cam.position.set(c.x, c.y, c.z);
    cam.lookAt(c.x * 0.3, 0, c.z - 6);
    if (cam.fov !== 42) { cam.fov = 42; cam.near = 0.1; cam.far = 80; cam.updateProjectionMatrix(); }
    cam.updateMatrixWorld();

    // No cursor (touch): a small lantern a little ahead of the camera.
    const l = lantern.current;
    if (l) {
      l.position.set(c.x, c.y + 0.2, c.z - 1.2);
      l.intensity = fine ? 0 : 3 * enter;
    }

    // Screens ahead are just findable in the dark until the light reaches
    // them; the nearest screen is the caption's.
    let nearest = 0, nearestD = Infinity;
    for (let i = 0; i < SITES.length; i++) {
      const z = FIRST_Z - i * SPACING;
      const ahead = c.z - z;
      const near = 1 - THREE.MathUtils.smoothstep(ahead, 5, 11);
      r.screenMats[i].emissiveIntensity = 1.0 * enter * near;
      const d = Math.abs(z - (c.z - 1.6));
      if (d < nearestD) { nearestD = d; nearest = i; }
    }
    if (nearest !== c.index) { c.index = nearest; world.index = nearest; }

    // The end wall is the next chapter's ground — the page navy — dark until
    // you are close, exactly navy when it fills the view.
    const doorNear = 1 - THREE.MathUtils.smoothstep(c.z - DOOR_Z, 3, 14);
    r.doorMat.color.set("#101D31").multiplyScalar((0.08 + 0.92 * doorNear) * enter);

    const moving = Math.abs(c.z + c.x + c.y - before) > 1e-4 || performance.now() - world.pointer.t < 120;
    // r3f skips its own render pass once any useFrame subscriber has a
    // priority above zero — the views do — so the root scene draws itself.
    // Full viewport: the last view left it small.
    s.gl.setScissorTest(false);
    s.gl.setViewport(0, 0, s.size.width, s.size.height);
    s.gl.render(s.scene, cam);
    if (moving) s.invalidate();
  });

  return (
    <group ref={group} visible={false}>
      {/* Just enough on the walls, floor and ceiling that the room's edges read
          in the dark; the screens and the cursor do the rest. */}
      <hemisphereLight args={["#2b4a74", "#0b1220", 0.8]} />
      <pointLight ref={lantern} color="#fff4e2" distance={5} decay={2} intensity={0} />

      {/* The room. */}
      <mesh geometry={res.floorGeo} material={res.floorMat} rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR, ROOM_MID]} />
      <mesh geometry={res.floorGeo} material={res.wallMat} rotation={[Math.PI / 2, 0, 0]} position={[0, CEIL, ROOM_MID]} />
      <mesh geometry={res.wallGeo} material={res.wallMat} rotation={[0, Math.PI / 2, 0]} position={[-HALF, (FLOOR + CEIL) / 2, ROOM_MID]} />
      <mesh geometry={res.wallGeo} material={res.wallMat} rotation={[0, -Math.PI / 2, 0]} position={[HALF, (FLOOR + CEIL) / 2, ROOM_MID]} />

      {/* The screens. */}
      {SITES.map((p, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        const z = FIRST_Z - i * SPACING;
        const x = side * (HALF - 0.6);
        return (
          <group key={p.slug} position={[x, 0.1, z]} rotation={[0, -side * LEAN, 0]}>
            <mesh geometry={res.bezelGeo} material={res.bezelMat} position={[0, 0, -0.035]} />
            <mesh geometry={res.screenGeo} material={res.screenMats[i]} />
          </group>
        );
      })}

      {/* The doorway at the end. */}
      <mesh geometry={res.doorGeo} material={res.doorMat} position={[0, 0.05, DOOR_Z]} />
    </group>
  );
}
