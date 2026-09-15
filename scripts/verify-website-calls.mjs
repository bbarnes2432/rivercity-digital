// Isolated forwarding-number checks. No Google requests, paid clicks or calls.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/app/_components/website-call-tracking.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const fallback = { display: '(636) 338-1408', href: 'tel:+16363381408' };
function harness({ server = false, ready = true, throws = false } = {}) {
  const events = [];
  const subscriptions = [];
  const window = {};
  const tag = (...args) => { if (throws) throw Error('Blocked tag'); events.push(args); };
  if (ready) window.gtag = tag;
  const loadedModule = { exports: {} };
  const require = name => {
    if (name === './contact-info') return { PHONE: fallback };
    if (name === 'react') return { useSyncExternalStore: (subscribe, get, getServer) => {
      subscriptions.push(subscribe);
      return server ? getServer() : get();
    } };
    throw Error('Unexpected dependency ' + name);
  };
  vm.runInNewContext(code, { module: loadedModule, exports: loadedModule.exports, require, ...(server ? {} : { window }) });
  return { ...loadedModule.exports, events, window, tag, subscriptions };
}
const plain = value => JSON.parse(JSON.stringify(value));
let checks = 0;
function check(name, fn) { fn(); checks++; console.log('PASS ' + name); }

check('SSR renders the real business number without configuring Google', () => {
  const h = harness({ server: true }); h.configureWebsiteCallTracking();
  assert.deepEqual(plain(h.useWebsitePhoneNumber()), fallback); assert.equal(h.events.length, 0);
});
check('No forwarding response leaves the original visible and dialable', () => {
  const h = harness(); h.configureWebsiteCallTracking();
  assert.deepEqual(plain(h.useWebsitePhoneNumber()), fallback);
});
check('Delayed tag readiness works and remount callbacks configure only once', () => {
  const h = harness({ ready: false }); h.configureWebsiteCallTracking();
  h.window.gtag = h.tag; h.configureWebsiteCallTracking(); h.configureWebsiteCallTracking();
  assert.equal(h.events.length, 1);
  assert.equal(h.events[0][0], 'config');
  assert.equal(h.events[0][1], 'AW-18272669855/KCsiCOy_jvgcEJ-hi4lE');
  assert.equal(h.events[0][2].phone_conversion_number, fallback.display);
  assert.equal(h.events[0][2].phone_conversion_callback, h.receiveForwardingNumber);
});
check('Callback updates displayed number and tel destination together', () => {
  const h = harness(); h.configureWebsiteCallTracking();
  h.events[0][2].phone_conversion_callback('(314) 555-0100', '+13145550100');
  assert.deepEqual(plain(h.useWebsitePhoneNumber()), { display: '(314) 555-0100', href: 'tel:+13145550100' });
  assert.equal(h.events.length, 1); // Config only; no fake conversion event.
});
check('Late consumers use the forwarding number across client navigation', () => {
  const h = harness(); h.useWebsitePhoneNumber();
  h.receiveForwardingNumber('(314) 555-0100', '13145550100');
  assert.equal(h.useWebsitePhoneNumber().href, 'tel:+13145550100');
});
check('Subscribers update once and cleanup removes them', () => {
  const h = harness(); h.useWebsitePhoneNumber(); let changes = 0;
  const stop = h.subscriptions[0](() => { changes++; });
  h.receiveForwardingNumber('(314) 555-0100', '3145550100');
  h.receiveForwardingNumber('(314) 555-0100', '3145550100');
  assert.equal(changes, 1); stop();
  h.receiveForwardingNumber('(314) 555-0101', '+13145550101'); assert.equal(changes, 1);
});
check('Malformed and inconsistent callbacks never corrupt a valid number', () => {
  const h = harness();
  for (const values of [[null, null], ['bad', '3145550100'], ['(314) 555-0100', 'javascript:alert(1)'], ['(314) 555-0100', '3145550101'], ['123', '123']]) {
    h.receiveForwardingNumber(...values); assert.deepEqual(plain(h.useWebsitePhoneNumber()), fallback);
  }
});
check('A blocked tag cannot throw into the website', () => {
  const h = harness({ throws: true }); assert.doesNotThrow(() => h.configureWebsiteCallTracking());
  assert.deepEqual(plain(h.useWebsitePhoneNumber()), fallback);
});
console.log(`${checks} forwarding-number checks passed.`);
