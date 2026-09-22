import type * as ThreeModule from "three";
import type { LiveEffect } from "./types";
import { fragment } from "./mend-shaders";

// Mend Health's original living-marble shader, adapted from its OGL renderer to Three.
export function createMendMarble(THREE: typeof ThreeModule, renderer: ThreeModule.WebGLRenderer): LiveEffect {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new THREE.PlaneGeometry(2, 2);
  const pointer = new THREE.Vector2(.5, .5);
  const size = new THREE.Vector2();
  const material = new THREE.ShaderMaterial({
    vertexShader: "varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}",
    fragmentShader: fragment(3),
    uniforms: { uTime: { value: 0 }, uAspect: { value: 1 }, uSeed: { value: 7.31 }, uPointer: { value: pointer.clone() }, uPointerStrength: { value: 1 } },
    depthTest: false, depthWrite: false,
  });
  scene.add(new THREE.Mesh(geometry, material));
  return {
    pointer(x, y) { pointer.set(x, 1 - y); },
    leave() { pointer.set(.5, .5); },
    render(_delta, elapsed) {
      renderer.getSize(size);
      material.uniforms.uAspect.value = size.x / Math.max(1, size.y);
      material.uniforms.uTime.value = elapsed;
      material.uniforms.uPointer.value.lerp(pointer, .05);
      renderer.render(scene, camera);
    },
    dispose() { geometry.dispose(); material.dispose(); },
  };
}
