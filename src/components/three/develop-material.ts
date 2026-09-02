import * as THREE from "three";

/* The "develop" material — one ShaderMaterial, one continuous uniform.
 *
 * uStage runs 0 → 4 and the slab's look is a blend between the five states
 * the page's own timeline names. Nothing is switched or re-mounted; a section
 * just moves the number and the material draws the in-between:
 *
 *   0  Coffee      an empty table — only the blueprint grid, faint
 *   1  Wireframes  teal layout boxes, drawn in left to right
 *   2  Design      flat colour blocks: the screenshot posterised and desaturated,
 *                  wiped in diagonally like a print developing in the tray
 *   3  Build       the full screenshot, wireframe gone
 *   4  Launch      the same, lit a touch brighter (the lift and the ring pulse
 *                  are group transforms, done in BuildSlab)
 *
 * The wireframe is drawn here rather than with drei's <Edges>: on a flat plane
 * Edges yields only the rectangle's outline, and what reads as "wireframe" is a
 * layout — header, hero, columns — which the fragment shader can draw for
 * free, in the same teal the hero lattice uses. Three colours only, per the
 * brief: teal for edges, the surface, the navy void behind it.
 *
 * Shared by §02 (the build reveal) and §04 (the timeline). */

export const TEAL = new THREE.Color("#4CA5AD");

const VERT = /* glsl */ `
uniform float uStage;
uniform float uTime;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 p = position;
  // A gentle ripple while the surface is developing (stage 1 → 3), zero at
  // both ends so the wireframe is flat and the finished site is flat.
  float dev = clamp((uStage - 1.0) * 0.5, 0.0, 1.0);
  float amp = 0.028 * sin(dev * 3.14159265);
  float ripple = sin(uv.x * 13.0 - uTime * 2.1) * sin(uv.y * 8.0 + uTime * 1.6);
  p.z += ripple * amp;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const FRAG = /* glsl */ `
uniform sampler2D uMap;
uniform float uStage;
uniform vec3 uTeal;
uniform float uOpacity;
varying vec2 vUv;

// Anti-aliased grid line mask, n cells across.
float gridLine(vec2 uv, float n) {
  vec2 g = abs(fract(uv * n - 0.5) - 0.5) / fwidth(uv * n);
  return 1.0 - clamp(min(g.x, g.y), 0.0, 1.0);
}
// 1.0 on the border of the rectangle [a, b], 0 elsewhere.
float rectEdge(vec2 uv, vec2 a, vec2 b) {
  vec2 d = min(uv - a, b - uv);
  float e = min(d.x, d.y);
  float inside = step(0.0, e);
  float w = fwidth(e) * 1.4;
  return inside * (1.0 - smoothstep(0.0, w, e));
}

void main() {
  vec2 uv = vUv;
  float s = uStage;

  // ── the blueprint grid (Coffee, and under the wireframe) ──
  float grid = gridLine(uv, 12.0);

  // ── the wireframe: a site's layout in teal ──
  float wf = rectEdge(uv, vec2(0.015, 0.015), vec2(0.985, 0.985)); // frame
  wf = max(wf, rectEdge(uv, vec2(0.04, 0.86), vec2(0.96, 0.96)));  // nav
  wf = max(wf, rectEdge(uv, vec2(0.06, 0.40), vec2(0.50, 0.80)));  // hero copy
  wf = max(wf, rectEdge(uv, vec2(0.54, 0.34), vec2(0.94, 0.82)));  // hero image
  wf = max(wf, rectEdge(uv, vec2(0.06, 0.06), vec2(0.34, 0.30)));  // three cards
  wf = max(wf, rectEdge(uv, vec2(0.36, 0.06), vec2(0.64, 0.30)));
  wf = max(wf, rectEdge(uv, vec2(0.66, 0.06), vec2(0.94, 0.30)));
  // drawn in left to right across stage 0 → 1
  float drawn = smoothstep(uv.x - 0.10, uv.x + 0.02, clamp(s, 0.0, 1.0) * 1.12);
  wf *= drawn;

  // ── the surface ──
  vec4 tex = texture2D(uMap, uv);
  // Design: posterised, desaturated flat blocks
  vec3 post = floor(tex.rgb * 4.0 + 0.5) / 4.0;
  float luma = dot(post, vec3(0.299, 0.587, 0.114));
  post = mix(vec3(luma), post, 0.55);
  // stage 1 → 2: the print develops along a diagonal wipe
  float dev1 = clamp(s - 1.0, 0.0, 1.0);
  float front = uv.x * 0.7 + (1.0 - uv.y) * 0.3;
  float developed = 1.0 - smoothstep(dev1 - 0.16, dev1 + 0.04, front);
  developed *= step(0.999, s + 0.999 - 0.0); // nothing develops before stage 1
  developed = s < 1.0 ? 0.0 : developed;
  // stage 2 → 3: blocks resolve into the real screenshot
  float dev2 = clamp(s - 2.0, 0.0, 1.0);
  vec3 surface = mix(post, tex.rgb, dev2);
  // stage 3 → 4: lights on
  surface *= 1.0 + 0.10 * clamp(s - 3.0, 0.0, 1.0);

  // ── compose ──
  float coffee = 1.0 - clamp(s, 0.0, 1.0);          // 1 at stage 0
  float wfA = wf * (1.0 - dev2 * 0.92);             // wireframe fades as the build completes
  float gridA = grid * (0.30 + 0.30 * coffee) * (1.0 - dev2) * (1.0 - developed * 0.7);

  vec3 col = surface;
  col = mix(col, uTeal, clamp(gridA * (1.0 - developed), 0.0, 1.0));
  col = mix(col, uTeal, wfA);
  float alpha = max(developed, max(wfA, gridA));

  gl_FragColor = vec4(col, alpha * uOpacity);
  #include <colorspace_fragment>
}
`;

export type DevelopUniforms = {
  uMap: { value: THREE.Texture };
  uStage: { value: number };
  uTime: { value: number };
  uTeal: { value: THREE.Color };
  uOpacity: { value: number };
};

export function makeDevelopMaterial(map: THREE.Texture): THREE.ShaderMaterial & { uniforms: DevelopUniforms } {
  const m = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uStage: { value: 1 },
      uTime: { value: 0 },
      uTeal: { value: TEAL },
      uOpacity: { value: 1 },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
  });
  return m as THREE.ShaderMaterial & { uniforms: DevelopUniforms };
}
