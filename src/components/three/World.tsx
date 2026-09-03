"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei/core/Texture";
import * as THREE from "three";
import { PROJECTS } from "@/app/work/_data";
import { TEAL } from "./develop-material";
import { world } from "./world-state";
import { texUrl } from "./tex";

/* The hallway.
 *
 * One scene in the root of the shared canvas: a corridor along −z whose floor
 * and ceiling are the hero's teal lattice, continued. The eight sites hang on
 * the walls, alternating left and right, angled toward the visitor. Scroll
 * progress in the hallway section drives the camera forward, so each site
 * comes toward you, passes, and the next one arrives. Fog turns the far end
 * into the navy void.
 *
 * The DOM owns the story (captions, links, the fallback grid). This owns the
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

const SPACING = 3.4; // metres between sites along the corridor
const FIRST_Z = -2.6;
const LENGTH = FIRST_Z - SPACING * (SITES.length - 1) - 2.2; // where the camera ends
const W = 1.8; // slab width; 1.8:1 is the screenshots' crop ratio
const H = 1.0;

function makeCorridorLines() {
  const pts: number[] = [];
  const zNear = 2, zFar = LENGTH - 6;
  const floor = -1.15, ceil = 1.35;
  for (const y of [floor, ceil]) {
    for (const x of [-2.6, -1.3, 0, 1.3, 2.6]) pts.push(x, y, zNear, x, y, zFar);
    for (let z = zNear; z > zFar; z -= 1.5) pts.push(-2.6, y, z, 2.6, y, z);
  }
  // Wall verticals every 1.5m tie floor to ceiling.
  for (let z = zNear; z > zFar; z -= 1.5) pts.push(-2.6, floor, z, -2.6, ceil, z, 2.6, floor, z, 2.6, ceil, z);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return g;
}

let SLAB_GEO: THREE.PlaneGeometry | null = null;
let SLAB_EDGES: THREE.EdgesGeometry | null = null;
let BACK_GEO: THREE.PlaneGeometry | null = null;
const slabGeo = () => (SLAB_GEO ??= new THREE.PlaneGeometry(W, H));
const slabEdges = () => (SLAB_EDGES ??= new THREE.EdgesGeometry(slabGeo()));
const backGeo = () => (BACK_GEO ??= new THREE.PlaneGeometry(W + 0.1, H + 0.1));

/* Module singletons, like the geometries: the render loop mutates these, and
   a hook return value or a ref read during render are both things the React
   compiler lint refuses. There is one World per page; they live with it. */
type Res = { corridor: THREE.BufferGeometry; lineMat: THREE.LineBasicMaterial; edgeMat: THREE.LineBasicMaterial; backMat: THREE.MeshBasicMaterial; fog: THREE.FogExp2 };
let RES: Res | null = null;
const getRes = (): Res =>
  (RES ??= {
    corridor: makeCorridorLines(),
    lineMat: new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0.26, toneMapped: false }),
    edgeMat: new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0.9, toneMapped: false }),
    backMat: new THREE.MeshBasicMaterial({ color: new THREE.Color("#152A46"), toneMapped: false }),
    fog: new THREE.FogExp2(new THREE.Color("#101D31"), 0.11),
  });

export default function World() {
  const group = useRef<THREE.Group>(null!);
  const slabs = useRef<THREE.Group[]>([]);
  const st = useRef({ z: 1.2, x: 0, y: 0.1, lx: 0, wasActive: false, t: 0 });

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

  const { corridor, lineMat, edgeMat, backMat } = getRes();

  useFrame((s, dt) => {
    const a = world.active;
    const g = group.current;
    const c = st.current;
    if (a !== c.wasActive) {
      c.wasActive = a;
      g.visible = a;
      // Fog only while the hallway is the scene; the views elsewhere have
      // their own cameras and must not be fogged.
      s.scene.fog = a ? getRes().fog : null;
    }
    if (!a) return;

    c.t += dt;
    const p = world.progress;
    const cam = s.camera as THREE.PerspectiveCamera;
    const targetZ = 1.2 + p * (LENGTH - 1.2);
    const targetX = world.pointer.fine ? world.pointer.nx * 0.18 : 0;
    const targetY = 0.1 + (world.pointer.fine ? world.pointer.ny * 0.08 : 0);
    const before = c.z + c.x + c.y;
    c.z = THREE.MathUtils.damp(c.z, targetZ, 3.2, dt);
    c.x = THREE.MathUtils.damp(c.x, targetX, 4, dt);
    c.y = THREE.MathUtils.damp(c.y, targetY, 4, dt);
    cam.position.set(c.x, c.y, c.z);
    cam.lookAt(c.x * 0.4, 0.05, c.z - 5);
    if (cam.fov !== 42) { cam.fov = 42; cam.near = 0.1; cam.far = 60; cam.updateProjectionMatrix(); }

    // The nearest site leans a little further toward the visitor; all bob.
    for (let i = 0; i < slabs.current.length; i++) {
      const sl = slabs.current[i];
      if (!sl) continue;
      const side = i % 2 === 0 ? -1 : 1;
      const dz = Math.abs(sl.position.z - c.z);
      const near = THREE.MathUtils.clamp(1 - dz / 4.5, 0, 1);
      sl.rotation.y = -side * (0.62 - near * 0.18);
      sl.position.y = 0.05 + Math.sin(c.t * 0.6 + i * 1.3) * 0.025;
    }

    // r3f skips its own render pass once any useFrame subscriber has a
    // priority above zero — the views and the cursor HUD both do — so the
    // root scene draws itself. Full viewport: the last view left it set to
    // that view's rect.
    s.gl.setScissorTest(false);
    s.gl.setViewport(0, 0, s.size.width, s.size.height);
    s.gl.render(s.scene, cam);

    const moving = Math.abs(c.z + c.x + c.y - before) > 1e-4 || performance.now() - world.pointer.t < 120;
    if (moving) s.invalidate();
  });

  return (
    <group ref={group} visible={false}>
      <lineSegments geometry={corridor} material={lineMat} />
      {SITES.map((p, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        return (
          <group
            key={p.slug}
            ref={(el) => { if (el) slabs.current[i] = el; }}
            position={[side * 1.95, 0.05, FIRST_Z - i * SPACING]}
            rotation={[0, -side * 0.62, 0]}
          >
            <mesh geometry={backGeo()} material={backMat} position={[0, 0, -0.012]} />
            <mesh geometry={slabGeo()}>
              <meshBasicMaterial map={maps[i]} toneMapped={false} />
            </mesh>
            <lineSegments geometry={slabEdges()} material={edgeMat} position={[0, 0, 0.004]} />
          </group>
        );
      })}
    </group>
  );
}
