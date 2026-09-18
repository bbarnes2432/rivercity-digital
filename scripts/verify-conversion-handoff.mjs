// Exercise the real form submit handlers and tracking helper without a browser,
// network, delivery provider, or Google/Meta/OpenAI requests.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const forms = [
  'website-design/_components/MockupRequestForm.tsx',
  '_components/contact-form.tsx',
  'website-design/_components/HeroMockupForm.tsx',
  'quad-cities/_components/QcForm.tsx',
  '_components/PopupForm.tsx',
];
const fields = { name: 'Test Person', email: ' Test@Example.invalid ', phone: '(314) 555-0100', service: 'New website', 'bot-field': '' };

function harness(file, options = {}) {
  const events = [], requests = [], routes = [], states = [], timers = new Map(), storage = new Map(options.stored ?? []);
  let timerId = 0;
  const setInterval = fn => { timers.set(++timerId, fn); return timerId; };
  const tag = (...args) => {
    if (options.googleThrows) throw Error('Google unavailable');
    events.push(JSON.parse(JSON.stringify(args)));
  };
  const window = {
    location: { pathname: '/website-design' },
    setTimeout: () => 1, clearTimeout() {},
    ...(options.delayed ? {} : { gtag: tag }),
    fbq: () => { if (options.metaThrows) throw Error('Optional Meta pixel failure'); },
    oaiq: () => { if (options.openAIThrows) throw Error('Optional OpenAI pixel failure'); },
  };
  const base = {
    window, console, AbortController, setInterval, clearInterval: id => timers.delete(id),
    sessionStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) },
  };
  function load(path, extra = {}) {
    const source = fs.readFileSync(new URL('../src/app/' + path, import.meta.url), 'utf8');
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    const loadedModule = { exports: {} };
    vm.runInNewContext(compiled, { ...base, ...extra, module: loadedModule, exports: loadedModule.exports });
    return loadedModule.exports;
  }
  const tracking = load('_components/gtag.ts');
  const jsx = (type, props) => ({ type, props });
  const api = load(file, {
    require(id) {
      if (id.endsWith('/gtag')) return tracking;
      if (id === 'react/jsx-runtime') return { jsx, jsxs: jsx };
      if (id === 'react') return { useEffect() {}, useRef: value => ({ current: value }), useId: () => 'test', useState: value => [value === 'qualify' ? 'lead' : value, next => states.push(next)] };
      if (id === 'next/navigation') return { useRouter: () => ({ push: url => routes.push({ url, conversionsBeforeNavigation: conversions().length }) }) };
      if (id.endsWith('/attribution')) return { readAttribution: () => ({}), captureAttribution() {}, useAttribution: () => ({}), ATTRIBUTION_KEYS: [] };
      if (id.endsWith('/_data')) return { LOOKING_FOR: ['New website'], EMAIL: 'test@example.invalid' };
      if (id.endsWith('/usePopupTrigger')) return { usePopupTrigger: () => ({ shouldOpen: true, dismiss() {}, recordSubmit() {} }) };
      return new Proxy({}, { get: () => () => null });
    },
    FormData: class { constructor() { this.values = { ...fields }; } entries() { return Object.entries(this.values); } get(key) { return this.values[key] ?? null; } },
    fetch: async (url, init) => {
      requests.push({ url, body: JSON.parse(init.body) });
      if (options.networkFailure) throw Error('Network failure');
      return { ok: !options.failed, json: async () => options.failed ? { ok: false } : { ok: true, ...(options.dev ? { dev: true } : {}), ...(options.ignored ? { ignored: true } : {}) } };
    },
  });
  function conversions() { return events.filter(e => e[0] === 'event' && e[1] === 'conversion'); }
  function findForm(node) {
    if (!node || typeof node !== 'object') return null;
    if (node.type === 'form') return node;
    for (const child of [node.props?.children].flat(Infinity)) { const found = findForm(child); if (found) return found; }
    return null;
  }
  const rendered = findForm(api.default({}));
  assert.ok(rendered, 'Must find the real form submit handler');
  return {
    events, requests, routes, states, tracking, conversions, storage,
    submit: () => rendered.props.onSubmit({ preventDefault() {}, currentTarget: { checkValidity: () => !options.invalid, reportValidity: () => !options.invalid, elements: { namedItem: () => null }, reset() {} } }),
    ready() { window.gtag = tag; },
    tick(count = 1) { for (let i = 0; i < count; i++) [...timers.values()].forEach(fn => fn()); },
  };
}

let checks = 0, failures = 0;
async function check(name, fn) {
  try { await fn(); checks++; console.log('PASS ' + name); }
  catch (error) { failures++; console.error('FAIL ' + name + ': ' + error.message); }
}
for (const file of forms) {
  await check(file + ': successful delivery queues one conversion before navigation', async () => {
    const h = harness(file); await h.submit();
    assert.equal(h.requests.length, 1);
    assert.equal(h.conversions().length, 1, 'Conversion must not depend on loading the thank-you route');
    assert.equal(h.routes[0]?.conversionsBeforeNavigation, 1);
    assert.equal(h.conversions()[0][2].send_to, 'AW-18272669855/Xo1xCOeAm-UcEJ-hi4lE');
    assert.equal(h.events.find(e => e[0] === 'set' && e[1] === 'user_data')?.[2].email, 'test@example.invalid');
    h.tracking.trackContactConversion(); h.tracking.trackContactConversion();
    assert.equal(h.conversions().length, 1, 'Thank-you effects must not duplicate it');
  });
  for (const pixel of ['metaThrows', 'openAIThrows']) {
    await check(file + ': ' + pixel + ' cannot hide delivered lead or skip conversion', async () => {
      const h = harness(file, { [pixel]: true }); await h.submit();
      assert.equal(h.conversions().length, 1);
      assert.equal(h.routes.length, 1);
      assert.ok(!h.states.includes('error'));
    });
  }
  await check(file + ': delayed tag retains matching data and sends once', async () => {
    const h = harness(file, { delayed: true }); await h.submit();
    assert.equal(h.conversions().length, 0); h.tracking.trackContactConversion();
    h.ready(); h.tick(2);
    assert.equal(h.conversions().length, 1);
    assert.equal(h.events.find(e => e[0] === 'set' && e[1] === 'user_data')?.[2].email, 'test@example.invalid');
  });
  await check(file + ': a full reload before tag readiness retains the pending lead', async () => {
    const firstPage = harness(file, { delayed: true }); await firstPage.submit();
    const thankYouPage = harness(file, { stored: [...firstPage.storage] });
    thankYouPage.tracking.trackContactConversion(); thankYouPage.tracking.trackContactConversion();
    assert.equal(thankYouPage.conversions().length, 1);
    assert.equal(thankYouPage.events.find(e => e[0] === 'set' && e[1] === 'user_data')?.[2].email, 'test@example.invalid');
    assert.equal(thankYouPage.storage.size, 0);
  });
  for (const scenario of ['failed', 'networkFailure', 'invalid', 'dev', 'ignored']) {
    await check(file + ': ' + scenario + ' cannot create a conversion', async () => {
      const h = harness(file, { [scenario]: true }); await h.submit(); h.tracking.trackContactConversion();
      assert.equal(h.conversions().length, 0);
      assert.equal(h.events.filter(e => e[0] === 'set').length, 0);
    });
  }
  await check(file + ': Google error cannot turn successful delivery into form failure', async () => {
    const h = harness(file, { googleThrows: true }); await h.submit(); h.tick(45);
    assert.equal(h.routes.length, 1);
    assert.ok(!h.states.includes('error'));
  });
}
console.log(`${checks} passed; ${failures} failed. All submissions, delivery and analytics mocked.`);
if (failures) process.exitCode = 1;
