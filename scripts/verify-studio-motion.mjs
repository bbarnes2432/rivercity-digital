// Exercise the actual components with browser events/rendering mocked. No network.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(file, scope) {
  const loadedModule = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(code, { module: loadedModule, exports: loadedModule.exports, ...scope });
  return loadedModule.exports;
}
let checks = 0;
function check(name, fn) { fn(); checks++; console.log('PASS ' + name); }

class Element {
  constructor(top = 1200) { this.top = top; this.dataset = {}; this.listeners = {}; }
  getBoundingClientRect() { return { top: this.top, bottom: this.top + 100 }; }
  closest() { return this.parent || this; }
  addEventListener(name, fn) { this.listeners[name] = fn; }
  removeEventListener(name) { delete this.listeners[name]; }
  removeAttribute() {}
}
function motionHarness({ reduced = false, supported = true } = {}) {
  const elements = [new Element(100), new Element(), new Element(2400), new Element(4000)];
  const page = new Element(); page.querySelectorAll = () => elements;
  const timers = new Map(); const effects = []; const observers = [];
  class Observer {
    constructor(callback, options) { this.callback = callback; this.options = options; this.observed = new Set(); observers.push(this); }
    observe(element) { this.observed.add(element); }
    unobserve(element) { this.observed.delete(element); }
    disconnect() { this.observed.clear(); }
    enter(element, intersecting = true) { this.callback([{ target: element, boundingClientRect: element.getBoundingClientRect(), isIntersecting: intersecting }]); }
  }
  let id = 0;
  const window = {
    innerHeight: 900, matchMedia: () => ({ matches: reduced }),
    setTimeout: (fn) => { timers.set(++id, fn); return id; }, clearTimeout: (n) => timers.delete(n),
    ...(supported ? { IntersectionObserver: Observer } : {}),
  };
  const { default: Component } = load('src/app/website-design/_components/StudioMotion.tsx', {
    window, document: { querySelector: () => page }, HTMLElement: Element, IntersectionObserver: Observer,
    require: (name) => name === 'react' ? { useEffect: (fn) => effects.push(fn) } : { useReducedMotion: () => reduced },
  });
  Component(); const cleanup = effects[0]();
  return { elements, page, timers, observer: observers[0], cleanup };
}
const motion = motionHarness();
check('Existing viewport content stays visible', () => assert.equal(motion.elements[0].dataset.enterState, 'done'));
check('Later sections wait until inside the viewport', () => {
  assert.equal(motion.elements[1].dataset.enterState, 'pending');
  assert.equal(motion.observer.options.rootMargin, '0px 0px -96px 0px');
});
check('Entering starts once and releases the observer', () => {
  motion.observer.enter(motion.elements[1]);
  assert.equal(motion.elements[1].dataset.enterState, 'running');
  assert.equal(motion.observer.observed.has(motion.elements[1]), false);
});
check('Animation completion releases transforms and timers', () => {
  motion.page.listeners.animationend({ target: motion.elements[1] });
  assert.equal(motion.elements[1].dataset.enterState, 'done'); assert.equal(motion.timers.size, 0);
});
check('Fast scrolling cannot strand skipped content', () => {
  motion.elements[2].top = -300; motion.observer.enter(motion.elements[2], false);
  assert.equal(motion.elements[2].dataset.enterState, 'done');
});
check('Keyboard focus immediately exposes a pending link', () => {
  const link = new Element(); link.parent = motion.elements[3];
  motion.page.listeners.focusin({ target: link });
  assert.equal(motion.elements[3].dataset.enterState, 'done');
});
const interrupted = motionHarness(); interrupted.observer.enter(interrupted.elements[1]);
check('Interrupted animations have a visibility fallback', () => {
  Array.from(interrupted.timers.values()).forEach(fn => fn());
  assert.equal(interrupted.elements[1].dataset.enterState, 'done');
});
check('Unmount/reduced-motion changes clear all hidden states', () => {
  interrupted.cleanup();
  assert.ok(interrupted.elements.every(e => !e.dataset.enterState));
  assert.equal(interrupted.observer.observed.size, 0); assert.equal(interrupted.timers.size, 0);
});
check('Reduced motion exposes everything without observing', () => {
  const h = motionHarness({ reduced: true }); assert.equal(h.observer, undefined);
  assert.ok(h.elements.every(e => !e.dataset.enterState));
});
check('Browsers without IntersectionObserver keep all content', () => {
  const h = motionHarness({ supported: false }); assert.equal(h.observer, undefined);
  assert.ok(h.elements.every(e => !e.dataset.enterState));
});

const { ambientTubeTarget } = load('src/components/ui/tubes-ambient.ts', {});
async function tubesHarness({ fine = false, reduced = false, enabled = true } = {}) {
  const effects = []; const listeners = new Map(); const idle = new Map(); const frames = new Map();
  const refs = [{ current: {} }, { current: new Element() }, { current: null }];
  const created = []; let refIndex = 0; let id = 0;
  const nativeRender = () => {};
  const window = {
    matchMedia: (query) => ({ matches: query.includes('reduced-motion') ? reduced : fine }),
    addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: (name) => listeners.delete(name),
    requestIdleCallback: (fn) => { idle.set(++id, fn); return id; }, cancelIdleCallback: (n) => idle.delete(n),
    clearTimeout() {},
  };
  const { default: Component } = load('src/components/ui/tubes-cursor.tsx', {
    window, document: { readyState: 'complete' }, process: { env: { NODE_ENV: 'production' } }, console,
    requestAnimationFrame: (fn) => { frames.set(++id, fn); return id; }, cancelAnimationFrame: (n) => frames.delete(n),
    require(name) {
      if (name === 'react') return { useEffect: (fn) => effects.push(fn), useRef: () => refs[refIndex++] };
      if (name === 'react/jsx-runtime') return { jsx: () => null, jsxs: () => null };
      if (name.includes('world-state')) return { world: {} };
      if (name.includes('use-reduced-motion')) return { useReducedMotion: () => reduced };
      if (name === './tubes-ambient') return { ambientTubeTarget };
      if (name.includes('tubes1.min')) return { default: (canvas, options) => {
        const app = { options, disposed: false, updates: 0,
          three: { onBeforeRender: nativeRender, size: { width: 390, height: 844, wWidth: 2 }, resize() {} },
          tubes: { target: {}, update() { app.updates++; }, setColors() {}, setLightsColors() {} },
          dispose() { this.disposed = true; },
        }; created.push(app); return app;
      } };
      throw new Error('Unexpected import ' + name);
    },
  });
  Component({ mobileAmbient: enabled }); const cleanups = effects.map(fn => fn());
  for (const callback of idle.values()) callback();
  await new Promise(setImmediate);
  return { app: created[0], listeners, frames, nativeRender, cleanup: () => cleanups.forEach(fn => fn?.()) };
}
const mobile = await tubesHarness();
check('Touch devices initialize the actual tube component', () => assert.ok(mobile.app));
check('Mobile rendering uses less geometry and a 1x pixel cap', () => {
  assert.equal(mobile.app.options.tubes.count, 10); assert.equal(mobile.app.options.tubes.maxTubularSegments, 64);
  assert.equal(mobile.app.three.maxPixelRatio, 1);
});
check('A touch cannot lock the autonomous path', () => {
  const render = mobile.app.three.onBeforeRender;
  render({ elapsed: 1, delta: 1 / 60 }); const x = mobile.app.tubes.target.x;
  render({ elapsed: 2, delta: 1 / 60 }); assert.notEqual(mobile.app.tubes.target.x, x);
  assert.equal(mobile.app.updates, 2); assert.equal(mobile.listeners.has('pointermove'), false);
});
check('Mobile swipes do not recolor the effect or intercept scrolling', () => {
  assert.equal(mobile.listeners.has('click'), false); assert.equal(mobile.listeners.has('scroll'), false);
});
check('Autonomous motion stays inside narrow and landscape viewports', () => {
  for (const [width, height] of [[320, 568], [390, 844], [844, 390]]) {
    for (let t = 0; t < 30; t += 0.25) {
      const p = ambientTubeTarget(t, { width, height, wWidth: 2 });
      assert.ok(Math.abs(p.x) <= 0.64 + 1e-9);
      assert.ok(Math.abs(p.y) <= height * 0.18 * 2 / width + 1e-9);
    }
  }
});
const desktop = await tubesHarness({ fine: true });
check('Desktop retains its native pointer/idle behavior and color clicks', () => {
  assert.equal(desktop.app.three.onBeforeRender, desktop.nativeRender);
  assert.equal(desktop.app.three.maxPixelRatio, 1.5); assert.ok(desktop.listeners.has('pointermove'));
  assert.ok(desktop.listeners.has('click'));
});
const disabled = await tubesHarness({ enabled: false });
check('Other pages keep their existing mobile behavior', () => assert.equal(disabled.app, undefined));
const reduced = await tubesHarness({ reduced: true });
check('Reduced motion creates no WebGL scene or mask animation loop', () => {
  assert.equal(reduced.app, undefined); assert.equal(reduced.frames.size, 0);
});
check('Unmount disposes the renderer and animation loop', () => {
  mobile.cleanup(); assert.ok(mobile.app.disposed); assert.equal(mobile.frames.size, 0);
});
desktop.cleanup(); motion.cleanup();
console.log('\n' + checks + ' motion checks passed.');
