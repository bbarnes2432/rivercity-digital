// Run the actual preview lifecycle against mocked browser/GPU/media APIs. No network or browser.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/app/website-design/_components/LiveProjectPreview.tsx', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const flush = () => new Promise(resolve => setImmediate(resolve));

class Element {
  clientWidth = 400; clientHeight = 375; listeners = new Map(); children = [];
  addEventListener(name, fn) { this.listeners.set(name, fn); }
  removeEventListener(name) { this.listeners.delete(name); }
  appendChild(child) { this.children.push(child); }
  remove() { this.removed = true; }
  getBoundingClientRect() { return { left: 0, top: 0, width: 400, height: 375 }; }
}
function mount({ kind = 'fluid', paused = false, near = true, failGL = false } = {}) {
  const element = new Element(), host = new Element(), player = new Element();
  const counts = { play: 0, pause: 0, render: 0, effectDispose: 0, rendererDispose: 0, imports: 0 };
  player.play = () => { counts.play++; return Promise.resolve(); };
  player.pause = () => counts.pause++;
  const observers = [], effects = [], states = [], frames = new Map(), renderers = [];
  const document = new Element(); document.hidden = false;
  class Observer {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe(target) { this.target = target; }
    disconnect() { this.disconnected = true; }
    enter(value) { this.callback([{ target: this.target, isIntersecting: value }]); }
  }
  class Renderer {
    constructor() { if (failGL) throw Error('No WebGL'); this.domElement = new Element(); renderers.push(this); }
    setPixelRatio() {} setSize() {} dispose() { counts.rendererDispose++; }
  }
  const effect = { render() { counts.render++; }, pointer() {}, leave() {}, dispose() { counts.effectDispose++; } };
  let refIndex = 0, stateIndex = 0, frameId = 0;
  const refs = [element, host, player];
  const loaded = { exports: {} };
  const sandbox = {
    exports: loaded.exports, module: loaded, console,
    performance: { now: () => 10 }, document,
    window: { devicePixelRatio: 2, IntersectionObserver: Observer },
    IntersectionObserver: Observer, ResizeObserver: Observer,
    requestAnimationFrame: callback => { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame: id => frames.delete(id),
    require(id) {
      if (id === 'react') return {
        useRef: () => ({ current: refs[refIndex++] }),
        useState: () => [stateIndex++ === 0 ? near : false, value => states.push(value)],
        useEffect: fn => effects.push(fn),
      };
      if (id === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
      if (id === 'next/image') return () => {};
      if (id === 'three') { counts.imports++; return { WebGLRenderer: Renderer }; }
      if (id.endsWith('fluid-sky')) return { createFluidSky: () => effect };
      if (id.endsWith('mend-marble')) return { createMendMarble: () => effect };
      throw Error(`Unexpected import ${id}`);
    },
  };
  vm.runInNewContext(code, sandbox);
  const tree = loaded.exports.default({ project: { effect: kind, preview: 'test', name: 'Test', image: '/test.webp', width: 1440, height: 798 }, paused, sizes: '400px' });
  const cleanups = effects.map(fn => fn());
  return { counts, observers, document, frames, renderers, states, tree, cleanup: () => cleanups.forEach(fn => fn?.()) };
}

let checks = 0;
async function test(name, fn) { await fn(); checks++; console.log(`PASS ${name}`); }
await test('Offscreen loading gate and paused/reduced-motion prop keep media inert', async () => {
  for (const options of [{ near: false }, { paused: true }, { kind: 'video', paused: true }]) {
    const h = mount(options); await flush();
    assert.equal(h.counts.imports, 0); assert.equal(h.counts.play, 0); assert.equal(h.frames.size, 0); h.cleanup();
  }
});
await test('Video plays only in view and pauses when hidden or offscreen', async () => {
  const h = mount({ kind: 'video' }); const io = h.observers[1];
  assert.equal(h.counts.play, 0); io.enter(true); assert.equal(h.counts.play, 1);
  h.document.hidden = true; h.document.listeners.get('visibilitychange')(); assert.equal(h.counts.pause, 1);
  h.document.hidden = false; h.document.listeners.get('visibilitychange')(); assert.equal(h.counts.play, 2);
  io.enter(false); assert.equal(h.counts.pause, 2); h.cleanup(); assert.equal(h.counts.pause, 3);
});
await test('WebGL loops suspend offscreen and on hidden tabs; context loss keeps the fallback', async () => {
  const h = mount(); await flush(); const io = h.observers[1];
  assert.equal(h.frames.size, 0); io.enter(true); assert.equal(h.frames.size, 1);
  io.enter(false); assert.equal(h.frames.size, 0); io.enter(true);
  h.document.hidden = true; h.document.listeners.get('visibilitychange')(); assert.equal(h.frames.size, 0);
  h.document.hidden = false; h.document.listeners.get('visibilitychange')(); assert.equal(h.frames.size, 1);
  h.renderers[0].domElement.listeners.get('webglcontextlost')({ preventDefault() {} });
  io.enter(true); assert.equal(h.frames.size, 0); assert.equal(h.states.at(-1), false);
  h.cleanup(); assert.equal(h.counts.effectDispose, 1); assert.equal(h.counts.rendererDispose, 1);
  assert.equal(h.renderers[0].domElement.removed, true);
});
await test('WebGL creation failure leaves the static preview available', async () => {
  const h = mount({ failGL: true }); await flush(); assert.equal(h.frames.size, 0); assert.equal(h.states.at(-1), false); h.cleanup();
});
await test('Leaving during the dynamic import cannot create a late renderer', async () => {
  const h = mount(); h.cleanup(); await flush(); assert.equal(h.renderers.length, 0); assert.equal(h.frames.size, 0);
});
await test('Mend uses the same visibility and disposal contract', async () => {
  const h = mount({ kind: 'marble' }); await flush(); h.observers[1].enter(true); assert.equal(h.frames.size, 1); h.cleanup(); assert.equal(h.frames.size, 0); assert.equal(h.counts.effectDispose, 1);
});
console.log(`${checks} portfolio lifecycle checks passed. No external requests.`);
