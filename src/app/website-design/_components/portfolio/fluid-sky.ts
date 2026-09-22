import type * as ThreeModule from "three";
import type { LiveEffect } from "./types";

// The Wellness Collective's hero effect, ported from wellnesscollectivehub.com. A soft pastel
// sky gradient drifts slowly; moving the pointer stirs a stable-fluids field whose density peels
// the daylight back to an indigo night with small twinkling stars. The site's flowers and copy
// sit above this canvas as a separate layer, so the night shows through their gaps.
type Three = typeof ThreeModule;
type Target = ThreeModule.WebGLRenderTarget;
type DoubleTarget = { read: Target; write: Target };

const simVertex = `
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform vec2 texelSize;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;
const clearShader = `
precision mediump float;
varying highp vec2 vUv;
uniform sampler2D uTexture;
uniform float value;
void main() { gl_FragColor = value * texture2D(uTexture, vUv); }
`;
const splatVertex = `
varying vec2 vLocalUv;
uniform vec2 uCenter;
uniform vec2 uScale;
void main() {
  vLocalUv = position.xy;
  gl_Position = vec4(position.xy * uScale + uCenter, 0.0, 1.0);
}
`;
const splatShader = `
precision highp float;
varying vec2 vLocalUv;
uniform vec3 color;
void main() {
  float r = length(vLocalUv);
  if (r > 1.0) discard;
  float a = 1.0 - r;
  a *= a;
  gl_FragColor = vec4(color * a, a);
}
`;
const divergenceShader = `
precision mediump float;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;
void main() {
  float L = texture2D(uVelocity, vL).x;
  float R = texture2D(uVelocity, vR).x;
  float T = texture2D(uVelocity, vT).y;
  float B = texture2D(uVelocity, vB).y;
  vec2 C = texture2D(uVelocity, vUv).xy;
  // No flow through the walls: mirror the velocity at the boundaries.
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }
  gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}
`;
const pressureShader = `
precision mediump float;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  float divergence = texture2D(uDivergence, vUv).x;
  gl_FragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
}
`;
const gradientShader = `
precision mediump float;
varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`;
const advectShader = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
void main() {
  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
  gl_FragColor = dissipation * texture2D(uSource, coord);
  gl_FragColor.a = 1.0;
}
`;

const skyVertex = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;
const skyShader = `
  precision highp float;
  varying vec2 vUv;
  uniform vec3  uStops[4];
  uniform float uTime;
  uniform vec2  uPointer;
  uniform float uPointerOn;
  uniform float uAspect;
  uniform float uGrain;
  // The stable-fluids field: .rg = flow vector, .b = density.
  uniform sampler2D uFluid;
  uniform float uFluidAmount;
  uniform float uTwinkleTime;

  // Ashima simplex noise 2D
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
                             + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  float fbm(vec2 p){
    float f = 0.0;
    f += 0.60 * snoise(p);
    f += 0.30 * snoise(p * 2.03);
    return f;
  }
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  // One small, sharp-cored star per lit cell, with faint four-point sparkle spikes.
  float stars(vec2 p, float time){
    p *= 16.0;
    vec2 cell = floor(p);
    float h = hash(cell);
    if (h < 0.74) return 0.0;
    vec2 f = fract(p) - vec2(hash(cell + 11.3), hash(cell + 27.7));
    float d = length(f);
    float core  = pow(smoothstep(0.055, 0.0, d), 4.0);
    vec2  a     = abs(f);
    float spike = pow(smoothstep(0.17, 0.0, d), 3.0)
                * max(smoothstep(0.011, 0.0, a.x), smoothstep(0.011, 0.0, a.y));
    float bright = 0.6 + 0.4 * hash(cell + 5.1);
    float tw     = 0.35 + 0.65 * (0.5 + 0.5 * sin(time * 3.0 + h * 40.0));
    return (core + spike * 0.6) * bright * tw;
  }
  vec3 gradient4(float t){
    vec3 col = mix(uStops[0], uStops[1], smoothstep(0.0, 0.40, t));
    col = mix(col, uStops[2], smoothstep(0.40, 0.72, t));
    col = mix(col, uStops[3], smoothstep(0.72, 1.0, t));
    return col;
  }
  void main(){
    vec2 uv = vUv;
    // The fluid field bends the sky slightly and, where stirred, peels daylight back to night.
    vec3 fluid = texture2D(uFluid, vUv).rgb;
    vec2 flow = clamp(fluid.rg, -1.0, 1.0);
    float dens = fluid.b;
    uv += flow * 0.018 * uFluidAmount;

    float t = 1.0 - uv.y;
    vec2 wp = vec2(uv.x * uAspect, uv.y) * 1.4;
    float warp = fbm(wp + vec2(uTime * 0.02, uTime * 0.014));
    t += warp * 0.15;
    t = clamp(t, 0.0, 1.0);
    vec3 col = gradient4(t);

    float reveal = smoothstep(0.02, 0.22, dens) * uFluidAmount;
    reveal = min(reveal, 0.8);
    vec3 nightCol = mix(vec3(0.165, 0.141, 0.314), vec3(0.102, 0.086, 0.200), t);
    col = mix(col, nightCol, reveal);
    col += vec3(0.92, 0.94, 1.0) * stars(vec2(uv.x * uAspect, uv.y), uTwinkleTime) * reveal * 2.0;

    // pointer lantern: a 2% luminance lift within about a quarter of the width
    if (uPointerOn > 0.5){
      vec2 pp = vec2(uv.x * uAspect, uv.y);
      vec2 lp = vec2(uPointer.x * uAspect, uPointer.y);
      col += smoothstep(0.25 * uAspect, 0.0, distance(pp, lp)) * 0.02;
    }
    // film grain, stepped about 8 times a second
    float g = hash(gl_FragCoord.xy + floor(uTime * 8.0)) - 0.5;
    col += g * uGrain;
    gl_FragColor = vec4(col, 1.0);
  }
`;

// The site's "performance" profile and hero tuning.
const settings = {
  simResolution: 128,
  dyeResolution: 256,
  pressureIterations: 6,
  densityDissipation: 0.972,
  velocityDissipation: 0.965,
  pressureDissipation: 0.8,
  splatRadius: 0.0035,
};
const dayStops = ["#E9EBFA", "#F4F1E9", "#F4F1E9", "#E4E6F6"];

export function createFluidSky(THREE: Three, renderer: ThreeModule.WebGLRenderer): LiveEffect {
  const target = (width: number, height: number, linear: boolean) => {
    const filter = linear ? THREE.LinearFilter : THREE.NearestFilter;
    return new THREE.WebGLRenderTarget(width, height, {
      depthBuffer: false,
      stencilBuffer: false,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
      minFilter: filter,
      magFilter: filter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      generateMipmaps: false,
    });
  };
  const double = (width: number, height: number, linear: boolean): DoubleTarget => ({
    read: target(width, height, linear),
    write: target(width, height, linear),
  });
  const swap = (pair: DoubleTarget) => {
    [pair.read, pair.write] = [pair.write, pair.read];
  };

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const triangle = new THREE.BufferGeometry();
  triangle.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3),
  );
  const simScene = new THREE.Scene();
  const simMesh = new THREE.Mesh(triangle);
  simMesh.frustumCulled = false;
  simScene.add(simMesh);

  const splatGeometry = new THREE.BufferGeometry();
  splatGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]), 3),
  );
  splatGeometry.setIndex(new THREE.Uint16BufferAttribute(new Uint16Array([0, 1, 2, 1, 3, 2]), 1));
  const splatMaterial = new THREE.ShaderMaterial({
    vertexShader: splatVertex,
    fragmentShader: splatShader,
    uniforms: {
      uCenter: { value: new THREE.Vector2() },
      uScale: { value: new THREE.Vector2() },
      color: { value: new THREE.Vector3() },
    },
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
    transparent: true,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneFactor,
    blendSrcAlpha: THREE.OneFactor,
    blendDstAlpha: THREE.OneFactor,
  });
  const splatScene = new THREE.Scene();
  const splatMesh = new THREE.Mesh(splatGeometry, splatMaterial);
  splatMesh.frustumCulled = false;
  splatScene.add(splatMesh);

  let simW = settings.simResolution;
  let simH = settings.simResolution;
  let dyeW = settings.dyeResolution;
  let dyeH = settings.dyeResolution;
  const velocity = double(simW, simH, true);
  const density = double(dyeW, dyeH, true);
  const pressure = double(simW, simH, false);
  const divergence = target(simW, simH, false);

  const simTexel = () => ({ value: new THREE.Vector2(1 / simW, 1 / simH) });
  const material = (fragmentShader: string, uniforms: Record<string, ThreeModule.IUniform>) =>
    new THREE.ShaderMaterial({
      vertexShader: simVertex,
      fragmentShader,
      uniforms,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
  const clear = material(clearShader, {
    texelSize: simTexel(),
    uTexture: { value: null },
    value: { value: settings.pressureDissipation },
  });
  const divergenceMaterial = material(divergenceShader, {
    texelSize: simTexel(),
    uVelocity: { value: null },
  });
  const pressureMaterial = material(pressureShader, {
    texelSize: simTexel(),
    uPressure: { value: null },
    uDivergence: { value: null },
  });
  const gradientMaterial = material(gradientShader, {
    texelSize: simTexel(),
    uPressure: { value: null },
    uVelocity: { value: null },
  });
  const advectVelocity = material(advectShader, {
    texelSize: simTexel(),
    uVelocity: { value: null },
    uSource: { value: null },
    dt: { value: 0.016 },
    dissipation: { value: 1 },
  });
  const advectDensity = material(advectShader, {
    texelSize: { value: new THREE.Vector2(1 / dyeW, 1 / dyeH) },
    uVelocity: { value: null },
    uSource: { value: null },
    dt: { value: 0.016 },
    dissipation: { value: 1 },
  });
  const simMaterials = [
    clear,
    divergenceMaterial,
    pressureMaterial,
    gradientMaterial,
    advectVelocity,
  ];

  const blit = (output: Target, shader: ThreeModule.ShaderMaterial) => {
    simMesh.material = shader;
    renderer.setRenderTarget(output);
    renderer.render(simScene, camera);
  };

  const sky = new THREE.ShaderMaterial({
    vertexShader: skyVertex,
    fragmentShader: skyShader,
    uniforms: {
      uStops: { value: dayStops.map((hex) => new THREE.Color(hex)) },
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.6) },
      uPointerOn: { value: 1 },
      uAspect: { value: 1 },
      uGrain: { value: 0.035 },
      uFluid: { value: density.read.texture },
      uFluidAmount: { value: 0 },
      uTwinkleTime: { value: 0 },
    },
  });
  const quad = new THREE.PlaneGeometry(2, 2);
  const skyScene = new THREE.Scene();
  const skyMesh = new THREE.Mesh(quad, sky);
  skyMesh.frustumCulled = false;
  skyScene.add(skyMesh);

  const size = new THREE.Vector2();
  const splats: { x: number; y: number; dx: number; dy: number }[] = [];
  const pointerTarget = new THREE.Vector2(0.5, 0.6);
  let previous: { x: number; y: number } | null = null;
  let fluidAmount = 0;

  // Match the simulation grid to the preview's aspect ratio, as the site does for its viewport.
  const resize = (width: number, height: number) => {
    const aspect = width / Math.max(1, height);
    const sim = settings.simResolution;
    const dye = settings.dyeResolution;
    const nextSim =
      aspect >= 1
        ? [sim, Math.max(1, Math.round(sim / aspect))]
        : [Math.max(1, Math.round(sim * aspect)), sim];
    const nextDye =
      aspect >= 1
        ? [dye, Math.max(1, Math.round(dye / aspect))]
        : [Math.max(1, Math.round(dye * aspect)), dye];
    if (nextSim[0] !== simW || nextSim[1] !== simH) {
      [simW, simH] = nextSim;
      for (const t of [velocity.read, velocity.write, pressure.read, pressure.write, divergence])
        t.setSize(simW, simH);
      for (const m of simMaterials)
        (m.uniforms.texelSize.value as ThreeModule.Vector2).set(1 / simW, 1 / simH);
    }
    if (nextDye[0] !== dyeW || nextDye[1] !== dyeH) {
      [dyeW, dyeH] = nextDye;
      density.read.setSize(dyeW, dyeH);
      density.write.setSize(dyeW, dyeH);
      (advectDensity.uniforms.texelSize.value as ThreeModule.Vector2).set(1 / dyeW, 1 / dyeH);
    }
  };

  const applySplat = (splat: (typeof splats)[number], aspect: number) => {
    const r = 3 * Math.sqrt(settings.splatRadius);
    (splatMaterial.uniforms.uCenter.value as ThreeModule.Vector2).set(
      2 * splat.x - 1,
      2 * splat.y - 1,
    );
    (splatMaterial.uniforms.uScale.value as ThreeModule.Vector2).set(r / aspect, r);
    (splatMaterial.uniforms.color.value as ThreeModule.Vector3).set(splat.dx, splat.dy, 1);
    renderer.setRenderTarget(velocity.read);
    renderer.render(splatScene, camera);
    renderer.setRenderTarget(density.read);
    renderer.render(splatScene, camera);
  };

  const step = (delta: number, aspect: number) => {
    const dt = Math.min(Math.max(delta, 1e-6), 1 / 60);
    const scale = dt / (1 / 60);
    const autoClear = renderer.autoClear;
    renderer.autoClear = false;
    for (const splat of splats) applySplat(splat, aspect);
    splats.length = 0;

    divergenceMaterial.uniforms.uVelocity.value = velocity.read.texture;
    blit(divergence, divergenceMaterial);
    clear.uniforms.uTexture.value = pressure.read.texture;
    clear.uniforms.value.value = Math.pow(settings.pressureDissipation, scale);
    blit(pressure.write, clear);
    swap(pressure);
    pressureMaterial.uniforms.uDivergence.value = divergence.texture;
    for (let i = 0; i < settings.pressureIterations; i++) {
      pressureMaterial.uniforms.uPressure.value = pressure.read.texture;
      blit(pressure.write, pressureMaterial);
      swap(pressure);
    }
    gradientMaterial.uniforms.uPressure.value = pressure.read.texture;
    gradientMaterial.uniforms.uVelocity.value = velocity.read.texture;
    blit(velocity.write, gradientMaterial);
    swap(velocity);
    advectVelocity.uniforms.uVelocity.value = velocity.read.texture;
    advectVelocity.uniforms.uSource.value = velocity.read.texture;
    advectVelocity.uniforms.dissipation.value = Math.pow(settings.velocityDissipation, scale);
    advectVelocity.uniforms.dt.value = dt;
    blit(velocity.write, advectVelocity);
    swap(velocity);
    advectDensity.uniforms.uVelocity.value = velocity.read.texture;
    advectDensity.uniforms.uSource.value = density.read.texture;
    advectDensity.uniforms.dissipation.value = Math.pow(settings.densityDissipation, scale);
    advectDensity.uniforms.dt.value = dt;
    blit(density.write, advectDensity);
    swap(density);
    renderer.setRenderTarget(null);
    renderer.autoClear = autoClear;
  };

  return {
    pointer(x, y) {
      const nx = x;
      const ny = 1 - y;
      pointerTarget.set(nx, ny);
      if (previous)
        splats.push({ x: nx, y: ny, dx: (nx - previous.x) * 6, dy: (ny - previous.y) * 6 });
      previous = { x: nx, y: ny };
    },
    leave() {
      previous = null;
    },
    render(delta, elapsed) {
      renderer.getSize(size);
      const aspect = size.x / Math.max(1, size.y);
      resize(size.x, size.y);
      sky.uniforms.uAspect.value = aspect;
      sky.uniforms.uTime.value = elapsed;
      sky.uniforms.uTwinkleTime.value += Math.min(delta, 1 / 30);
      (sky.uniforms.uPointer.value as ThreeModule.Vector2).lerp(pointerTarget, 0.08);
      fluidAmount += (1 - fluidAmount) * 0.06;
      sky.uniforms.uFluidAmount.value = fluidAmount;
      step(delta, aspect);
      sky.uniforms.uFluid.value = density.read.texture;
      renderer.setRenderTarget(null);
      renderer.render(skyScene, camera);
    },
    dispose() {
      for (const pair of [velocity, density, pressure]) {
        pair.read.dispose();
        pair.write.dispose();
      }
      divergence.dispose();
      triangle.dispose();
      splatGeometry.dispose();
      quad.dispose();
      splatMaterial.dispose();
      sky.dispose();
      advectDensity.dispose();
      for (const m of simMaterials) m.dispose();
    },
  };
}
