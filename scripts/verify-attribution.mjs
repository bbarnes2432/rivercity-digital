// Capture tests use an isolated URL and storage. No browser tags or network.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source = fs.readFileSync(new URL('../src/app/_components/attribution.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
function harness(search = '', { blocked = false, stored, server = false } = {}) {
  const memory = new Map(stored === undefined ? [] : [['rcd-attribution', stored]]);
  const window = { location: { search } };
  const sessionStorage = {
    getItem(key) { if (blocked) throw Error('Storage blocked'); return memory.get(key) ?? null; },
    setItem(key, value) { if (blocked) throw Error('Storage blocked'); memory.set(key, value); },
  };
  const loadedModule = { exports: {} };
  vm.runInNewContext(code, { module: loadedModule, exports: loadedModule.exports, URLSearchParams, sessionStorage, ...(server ? {} : { window }) });
  return { ...loadedModule.exports, window, memory };
}
const plain = value => JSON.parse(JSON.stringify(value));
let checks = 0;
function check(name, fn) { fn(); checks++; console.log('PASS ' + name); }
for (const key of ['gclid', 'gbraid', 'wbraid']) {
  check(key + ' survives navigation into a later form', () => {
    const h = harness('?' + key + '=test-only&utM_source=ignored-case'); h.captureAttribution();
    h.window.location.search = ''; h.captureAttribution();
    assert.deepEqual(plain(h.readAttribution()), { [key]: 'test-only' });
  });
}
check('Existing UTM and Meta attribution still accompanies Google identifiers', () => {
  const h = harness('?utm_source=google&utm_campaign=websites&gclid=old&gbraid=braid-g&wbraid=braid-w&fbclid=meta');
  h.captureAttribution();
  assert.deepEqual(plain(h.readAttribution()), { utm_source: 'google', utm_campaign: 'websites', gclid: 'old', gbraid: 'braid-g', wbraid: 'braid-w', fbclid: 'meta' });
});
check('First-touch attribution is not overwritten by a later click', () => {
  const h = harness('?gclid=first&utm_source=google'); h.captureAttribution();
  h.window.location.search = '?wbraid=later&utm_source=another'; h.captureAttribution();
  assert.deepEqual(plain(h.readAttribution()), { utm_source: 'google', gclid: 'first' });
});
check('Values are decoded, trimmed and capped at the API limit', () => {
  const h = harness('?gbraid=%20braid%2Bvalue%20&wbraid=' + 'x'.repeat(350)); h.captureAttribution();
  assert.deepEqual(plain(h.readAttribution()), { gbraid: 'braid+value', wbraid: 'x'.repeat(300) });
});
check('Empty and unapproved query parameters never enter attribution', () => {
  const h = harness('?gbraid=%20%20&wbraid=&email=private%40example.invalid'); h.captureAttribution();
  assert.equal(h.memory.size, 0); assert.deepEqual(plain(h.readAttribution()), {});
});
check('Old sessions remain readable after adding the new identifiers', () => {
  const h = harness('', { stored: JSON.stringify({ gclid: 'existing', utm_source: 'google' }) });
  assert.deepEqual(plain(h.readAttribution()), { gclid: 'existing', utm_source: 'google' });
});
check('Blocked storage cannot break a lead form', () => {
  const h = harness('?wbraid=test', { blocked: true }); assert.doesNotThrow(h.captureAttribution);
  assert.deepEqual(plain(h.readAttribution()), {});
});
check('Malformed stored data does not throw into the form', () => {
  const h = harness('', { stored: '{invalid' }); assert.deepEqual(plain(h.readAttribution()), {});
});
check('Server rendering never requires browser storage', () => {
  const h = harness('', { server: true }); assert.doesNotThrow(h.captureAttribution);
  assert.deepEqual(plain(h.readAttribution()), {});
});
console.log('\n' + checks + ' attribution checks passed. No network or live conversions.');
