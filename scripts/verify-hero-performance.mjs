import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
let checks = 0;
const check = (name, fn) => {
  fn();
  checks++;
  console.log("PASS " + name);
};
function load(path, scope) {
  const loadedModule = { exports: {} };
  const code = ts.transpileModule(
    fs.readFileSync(new URL("../" + path, import.meta.url), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
      },
    },
  ).outputText;
  vm.runInNewContext(code, { module: loadedModule, exports: loadedModule.exports, ...scope });
  return loadedModule.exports;
}
class Target {
  listeners = new Map();
  addEventListener(n, f) {
    if (!this.listeners.has(n)) this.listeners.set(n, new Set());
    this.listeners.get(n).add(f);
  }
  removeEventListener(n, f) {
    this.listeners.get(n)?.delete(f);
  }
  emit(n, event = {}) {
    for (const f of this.listeners.get(n) || []) f({ type: n, ...event });
  }
}
class Element extends Target {
  style = {};
  attrs = new Set();
  rect = { left: 0, top: 0, right: 400, bottom: 900, width: 400, height: 900 };
  reads = 0;
  children = [];
  hover = false;
  kind = "";
  getBoundingClientRect() {
    this.reads++;
    return this.rect;
  }
  closest() {
    return this.page || null;
  }
  contains(el) {
    return el === this || this.children.some((c) => c.contains(el));
  }
  matches(s) {
    if (s === ":hover") return this.hover;
    if (s === ".btn, .wd-button") return this.kind === "button";
    if (s === ".rcd-tilt-fill i") return this.kind === "fill";
    return false;
  }
  querySelectorAll() {
    return this.children;
  }
  toggleAttribute(n, b) {
    if (b) this.attrs.add(n);
    else this.attrs.delete(n);
  }
  removeAttribute(n) {
    this.attrs.delete(n);
  }
  hasAttribute(n) {
    return this.attrs.has(n);
  }
}
function environment() {
  let id = 0,
    now = 100;
  const frames = new Map(),
    timers = new Map(),
    ios = [],
    ros = [],
    mos = [];
  const window = new Target(),
    document = new Target();
  Object.assign(window, {
    innerWidth: 400,
    innerHeight: 900,
    devicePixelRatio: 1,
    matchMedia: () => ({ matches: false }),
    setTimeout: (f) => {
      timers.set(++id, f);
      return id;
    },
    clearTimeout: (n) => timers.delete(n),
  });
  Object.assign(document, {
    hidden: false,
    visibilityState: "visible",
    documentElement: Object.assign(new Target(), { clientWidth: 400 }),
  });
  function observer(list) {
    return class {
      constructor(cb) {
        this.cb = cb;
        this.targets = new Set();
        list.push(this);
      }
      observe(e) {
        this.targets.add(e);
      }
      unobserve(e) {
        this.targets.delete(e);
      }
      disconnect() {
        this.targets.clear();
      }
    };
  }
  return {
    window,
    document,
    HTMLElement: Element,
    AnimationEvent: class {},
    IntersectionObserver: observer(ios),
    ResizeObserver: observer(ros),
    MutationObserver: observer(mos),
    performance: { now: () => now },
    requestAnimationFrame: (f) => {
      frames.set(++id, f);
      return id;
    },
    cancelAnimationFrame: (n) => frames.delete(n),
    frames,
    timers,
    ios,
    ros,
    mos,
    tick() {
      const work = [...frames.values()];
      frames.clear();
      now += 16.67;
      work.forEach((f) => f(now));
    },
  };
}
const h = environment(),
  page = new Element(),
  layer = new Element(),
  screen = new Element(),
  button = new Element();
screen.kind = "screen";
button.kind = "button";
button.rect = {
  left: 10,
  right: 100,
  top: 50,
  bottom: 90,
  width: 90,
  height: 40,
};
page.children = [screen, button];
layer.page = page;
const { observeTubeOcclusion } = load(
  "src/components/ui/tubes-occlusion.ts",
  h,
);
const stop = observeTubeOcclusion(layer, true);
h.ios[0].cb(page.children.map((target) => ({ target, isIntersecting: true })));
h.tick();
check("Mobile controls and previews are masked immediately", () => {
  assert.match(layer.style.clipPath, /100.0px 50.0px/);
  assert.ok(layer.hasAttribute("data-covered"));
});
check("Still pages schedule no mask frames or repeated layout reads", () => {
  const reads = screen.reads;
  for (let i = 0; i < 120; i++) h.tick();
  assert.equal(screen.reads, reads);
  assert.equal(h.frames.size, 0);
});
check("Scroll events coalesce and refresh coverage", () => {
  screen.rect.top = 100;
  screen.rect.bottom = 1000;
  for (let i = 0; i < 40; i++) h.window.emit("scroll");
  assert.equal(h.frames.size, 1);
  h.tick();
  assert.equal(layer.hasAttribute("data-covered"), false);
});
check("Mask entrances keep tracking their transforms until completion", () => {
  page.emit("transitionrun", { target: screen, propertyName: "transform" });
  h.tick();
  assert.equal(h.frames.size, 1);
  screen.rect.top = 200;
  h.tick();
  assert.match(layer.style.clipPath, /200.0px/);
  page.emit("transitionend", { target: screen, propertyName: "transform" });
  h.tick();
  assert.equal(h.frames.size, 0);
});
check("Offscreen masks are not measured", () => {
  h.ios[0].cb([{ target: screen, isIntersecting: false }]);
  h.tick();
  const reads = screen.reads;
  h.window.emit("scroll");
  h.tick();
  assert.equal(screen.reads, reads);
});
check("Hidden tabs cancel pending mask work and resume when visible", () => {
  h.window.emit("scroll");
  h.document.hidden = true;
  h.document.emit("visibilitychange");
  assert.equal(h.frames.size, 0);
  h.document.hidden = false;
  h.document.emit("visibilitychange");
  assert.equal(h.frames.size, 1);
  h.tick();
});
check("New masks are observed and removed masks released", () => {
  const extra = new Element();
  page.children.push(extra);
  h.mos[0].cb([{ type: "childList" }]);
  assert.ok(h.ios[0].targets.has(extra));
  page.children = [button];
  h.mos[0].cb([{ type: "childList" }]);
  assert.equal(h.ios[0].targets.has(screen), false);
  assert.equal(h.ros[0].targets.has(screen), false);
});
check("Mask cleanup releases observers, frames and clipping", () => {
  stop();
  assert.equal(h.frames.size, 0);
  assert.equal(h.ios[0].targets.size, 0);
  assert.equal(layer.style.clipPath, "");
  h.window.emit("scroll");
  assert.equal(h.frames.size, 0);
});
function shaderHarness({ parallel = true, success = true } = {}) {
  const env = environment(),
    canvas = new Element(),
    effects = [],
    calls = [];
  let ready = !parallel;
  const api = {
    VERTEX_SHADER: 1,
    FRAGMENT_SHADER: 2,
    LINK_STATUS: 3,
    COMPLETION_STATUS_KHR: 4,
    getExtension: (n) =>
      n === "KHR_parallel_shader_compile"
        ? parallel
          ? { COMPLETION_STATUS_KHR: 4 }
          : null
        : {
            loseContext() {
              calls.push("lose");
            },
          },
    getProgramParameter: (p, k) => {
      calls.push(k === 4 ? "poll" : "link-status");
      if (k === 3) assert.ok(ready, "LINK_STATUS must wait for compilation");
      return k === 4 ? ready : success;
    },
    createShader: () => ({}),
    createProgram: () => ({}),
    createBuffer: () => ({}),
    getUniformLocation: () => ({}),
    getAttribLocation: () => 0,
    drawArrays: () => calls.push("draw"),
    deleteProgram: () => calls.push("delete-program"),
  };
  const gl = new Proxy(api, {
    get: (o, k) =>
      k in o
        ? o[k]
        : () => {
            calls.push(k);
            if (k === "getShaderParameter")
              throw Error("Blocking compile-status check");
          },
  });
  canvas.getContext = () => gl;
  const { ShaderBackground } = load("src/components/ui/shader-background.tsx", {
    ...env,
    process: { env: { NODE_ENV: "production" } },
    require: (n) =>
      n === "react"
        ? {
            useEffect: (f) => effects.push(f),
            useRef: () => ({ current: canvas }),
          }
        : { jsx: () => null },
    console,
  });
  ShaderBackground({});
  const cleanup = effects[0]();
  return {
    ...env,
    canvas,
    calls,
    cleanup,
    ready: () => {
      ready = true;
    },
  };
}
const shader = shaderHarness();
check("Shader compilation is polled without blocking status reads", () => {
  assert.ok(shader.calls.includes("poll"));
  assert.ok(!shader.calls.includes("link-status"));
  assert.ok(!shader.calls.includes("draw"));
  shader.tick();
  assert.ok(!shader.calls.includes("link-status"));
});
check("The full shader starts as soon as its program is ready", () => {
  shader.ready();
  shader.tick();
  shader.tick();
  assert.ok(shader.calls.includes("link-status"));
  assert.ok(shader.calls.includes("draw"));
});
check("Pointer events batch geometry reads into one layout frame", () => {
  const before = shader.canvas.reads;
  for (let i = 0; i < 100; i++)
    shader.window.emit("pointermove", { clientX: 80 + i, clientY: 120 });
  assert.equal(shader.canvas.reads, before);
  shader.tick();
  assert.equal(shader.canvas.reads, before + 1);
});
check(
  "Offscreen shaders stop drawing and ignore scroll measurement work",
  () => {
    shader.ios[0].cb([{ isIntersecting: false }]);
    const draws = shader.calls.filter((x) => x === "draw").length;
    const reads = shader.canvas.reads;
    shader.window.emit("scroll");
    shader.tick();
    assert.equal(shader.calls.filter((x) => x === "draw").length, draws);
    assert.equal(shader.canvas.reads, reads);
    shader.ios[0].cb([{ isIntersecting: true }]);
    shader.tick();
    assert.ok(shader.calls.filter((x) => x === "draw").length > draws);
  },
);
check(
  "Unmount while compiling cancels initialization and releases its program",
  () => {
    const pending = shaderHarness();
    pending.cleanup();
    pending.ready();
    pending.tick();
    assert.ok(!pending.calls.includes("draw"));
    assert.equal(pending.frames.size, 0);
    assert.ok(pending.calls.includes("delete-program"));
  },
);
check(
  "Browsers without parallel compilation still render the full effect",
  () => {
    const fallback = shaderHarness({ parallel: false });
    fallback.tick();
    assert.ok(fallback.calls.includes("draw"));
    fallback.cleanup();
  },
);
check(
  "Rejected shaders leave the CSS fallback without a rendering loop",
  () => {
    const failed = shaderHarness({ parallel: false, success: false });
    assert.equal(failed.frames.size, 0);
    assert.ok(!failed.calls.includes("draw"));
    failed.cleanup();
  },
);
shader.cleanup();
const matrix = environment(),
  container = new Element(),
  canvas = new Element(),
  effects = [];
let ref = 0;
const context = new Proxy({}, { get: () => () => {} });
canvas.getContext = () => context;
const react = {
  useEffect: (f) => effects.push(f),
  useCallback: (f) => f,
  useState: () => [true, () => {}],
  useRef: (value) => ({
    current: ref++ === 0 ? container : ref === 2 ? canvas : value,
  }),
};
const { KineticMatrix } = load("src/components/ui/kinetic-matrix.tsx", {
  ...matrix,
  require: (n) =>
    n === "react"
      ? react
      : n.includes("use-reduced-motion")
        ? { useReducedMotion: () => false }
        : { jsx: () => null, jsxs: () => null },
  console,
});
KineticMatrix({});
const cleanups = effects.map((f) => f());
matrix.ros[0].cb([{ contentRect: { width: 400, height: 900 } }]);
check(
  "Matrix cancels its loop outside the viewport and resumes on return",
  () => {
    assert.equal(matrix.frames.size, 1);
    matrix.tick();
    matrix.ios[0].cb([{ isIntersecting: false }]);
    assert.equal(matrix.frames.size, 0);
    matrix.ios[0].cb([{ isIntersecting: true }]);
    assert.equal(matrix.frames.size, 1);
    matrix.tick();
  },
);
check("Hidden tabs suspend the matrix and unmount leaves no animation", () => {
  matrix.document.hidden = true;
  matrix.document.emit("visibilitychange");
  assert.equal(matrix.frames.size, 0);
  matrix.document.hidden = false;
  matrix.document.emit("visibilitychange");
  assert.equal(matrix.frames.size, 1);
  cleanups.forEach((f) => f?.());
  assert.equal(matrix.frames.size, 0);
});
console.log(
  "\n" + checks + " hero performance checks passed. No network or live leads.",
);
