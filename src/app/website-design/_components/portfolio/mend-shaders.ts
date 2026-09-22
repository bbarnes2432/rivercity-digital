/**
 * "Living marble / silk field" — a materials shader, not particles.
 * Domain-warped fBm mixes verde marble (#33503F→#2A4234) with thin bone veins
 * and a drifting champagne-silk specular band. Full field evolution ~40s.
 * Kept dark enough that the Bone headline passes contrast with or without it.
 */

export const vertex = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// octaves is compile-time (GLSL loop bounds): 3 on tier-1 GPUs, 4 on tier-2+.
export const fragment = (octaves: number) => /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uAspect;
uniform float uSeed;
uniform vec2 uPointer;          // 0..1, lerped in JS at 0.05/frame
uniform float uPointerStrength; // 0 on coarse pointers → autonomous drift only

varying vec2 vUv;

// Ashima 2D simplex noise
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < ${octaves}; i++) {
    v += a * snoise(p);
    p = rot * p * 2.03 + 17.3;
    a *= 0.55;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 p = vec2(uv.x * uAspect, uv.y);

  // Cursor pressure — the surface "gives" like tissue under a hand (max ~0.04 UV)
  vec2 pp = vec2(uPointer.x * uAspect, uPointer.y);
  vec2 toP = p - pp;
  float d2 = dot(toP, toP);
  float press = exp(-d2 * 16.0) * uPointerStrength;
  p -= normalize(toP + 1e-5) * press * 0.04;

  // Luxury is slow: full evolution over ~40s
  float t = uTime * 0.157 / 6.2831 + uSeed; // ≈ uTime/40 cycles

  // Domain warp
  vec2 q = vec2(fbm(p * 1.35 + t), fbm(p * 1.35 - t * 0.7 + 3.1));
  vec2 w = p * 1.55 + 0.4 * q + press * 0.5;
  float f = fbm(w + t * 0.45);

  // Verde marble base
  vec3 deep = vec3(0.145, 0.235, 0.180);
  vec3 base = mix(deep, vec3(0.200, 0.314, 0.247), smoothstep(-0.65, 0.75, f));
  base *= 0.88 + 0.12 * smoothstep(-1.0, 1.0, fbm(w * 0.5 - t * 0.3));

  // Thin bone/silk veins — ridged noise, broken up so they read as stone
  float ridge = 1.0 - abs(f * 1.15);
  float vein = smoothstep(0.88, 0.985, ridge) * (0.45 + 0.55 * snoise(w * 2.6 + 5.0));
  vec3 col = mix(base, vec3(0.945, 0.933, 0.910), clamp(vein, 0.0, 1.0) * 0.13);

  // Champagne silk sheen — a soft specular band drifting like light across fabric
  float band = dot(uv, normalize(vec2(0.82, 0.57))) * 1.6 - uTime * 0.012 + q.x * 0.22;
  float sheen = pow(0.5 + 0.5 * sin(band * 6.2831), 3.0);
  col += vec3(0.851, 0.812, 0.749) * sheen * 0.05;

  // Gentle vignette keeps headline contrast honest
  col *= 1.0 - 0.28 * smoothstep(0.25, 0.85, distance(uv, vec2(0.45, 0.5)));

  // Film grain ~2.5% — kills banding, matches the paper texture
  float g = fract(sin(dot(gl_FragCoord.xy + mod(uTime, 10.0) * 61.7, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.05;

  gl_FragColor = vec4(col, 1.0);
}
`;
