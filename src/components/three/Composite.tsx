"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { getTubes } from "./CursorTubes";
import { world } from "./world-state";

/* The bloomed render.
 *
 * r3f skips its own render pass once any useFrame subscriber has a priority
 * above zero (the views do), so the root scene is drawn here, through an
 * EffectComposer: render, UnrealBloom (strength 1.0, radius 0.4, threshold
 * 0.35 — the tubes cursor's look, without smearing the room), output.
 *
 * In the hallway the whole room goes through it, to the screen. Over the
 * page only the tubes do, into a buffer, which is then added onto the
 * screen — on top of the views the sections have already drawn — so black
 * adds nothing and the tubes add their light. */

const BLIT_VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
const BLIT_FRAG = /* glsl */ `
uniform sampler2D tDiffuse; varying vec2 vUv;
void main(){
  vec4 c = texture2D(tDiffuse, vUv);
  // Alpha is the brightness, so black leaves the canvas transparent and the
  // page shows through; colour is added as is.
  gl_FragColor = vec4(c.rgb, max(c.r, max(c.g, c.b)));
  #include <colorspace_fragment>
}`;

type Res = {
  composer: EffectComposer;
  renderPass: RenderPass;
  bloom: UnrealBloomPass;
  blitScene: THREE.Scene;
  blitCam: THREE.OrthographicCamera;
  blitMat: THREE.ShaderMaterial;
};

export default function Composite() {
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);
  const R = useRef<Res | null>(null);

  useEffect(() => {
    const composer = new EffectComposer(gl);
    const renderPass = new RenderPass(new THREE.Scene(), new THREE.PerspectiveCamera());
    // Threshold above the room's dim surfaces: the tubes and their highlights
    // bloom, the walls and the screens stay crisp.
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 1.0, 0.4, 0.35);
    composer.addPass(renderPass);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    const blitMat = new THREE.ShaderMaterial({
      uniforms: { tDiffuse: { value: null } },
      vertexShader: BLIT_VERT, fragmentShader: BLIT_FRAG,
      transparent: true, depthTest: false, depthWrite: false,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor,
    });
    const blitScene = new THREE.Scene();
    blitScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blitMat));
    R.current = { composer, renderPass, bloom, blitScene, blitCam: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), blitMat };
    return () => {
      composer.dispose();
      blitMat.dispose();
      R.current = null;
    };
  }, [gl]);

  useEffect(() => {
    const r = R.current;
    if (!r) return;
    r.composer.setPixelRatio(gl.getPixelRatio());
    r.composer.setSize(size.width, size.height);
  }, [size, gl]);

  useFrame((s) => {
    const r = R.current;
    if (!r) return;
    const t = getTubes();
    const hall = world.active;
    if (!hall && !t.visible) return;
    s.gl.setScissorTest(false);
    s.gl.setViewport(0, 0, s.size.width, s.size.height);
    if (hall) {
      r.renderPass.scene = s.scene;
      r.renderPass.camera = s.camera;
      r.composer.renderToScreen = true;
      r.composer.render();
    } else {
      r.renderPass.scene = t.cursorScene;
      r.renderPass.camera = s.camera;
      r.composer.renderToScreen = false;
      r.composer.render();
      r.blitMat.uniforms.tDiffuse.value = r.composer.readBuffer.texture;
      const prev = s.gl.autoClear;
      s.gl.autoClear = false;
      s.gl.render(r.blitScene, r.blitCam);
      s.gl.autoClear = prev;
    }
  }, 50);

  return null;
}
