// Behavioral checks with synthetic identity, mock storage/timers and no network.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/app/_components/gtag.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const pendingKey = 'rcd-contact-conversion-pending';
const identityKey = 'rcd-conversion-identity';
const identity = { email: ' Test@Example.invalid ', phone: '(314) 555-0100', name: 'Test Person' };
function harness({ ready = true, blockedStorage = false, stored = [], server = false } = {}) {
  const events = [], timers = new Map(), memory = new Map(stored);
  const window = {}, loadedModule = { exports: {} };
  let timerId = 0;
  const tag = (...args) => events.push(JSON.parse(JSON.stringify(args)));
  if (ready) window.gtag = tag;
  const sessionStorage = {
    getItem(key) { if (blockedStorage) throw Error('Blocked storage'); return memory.get(key) ?? null; },
    setItem(key, value) { if (blockedStorage) throw Error('Blocked storage'); memory.set(key, value); },
    removeItem(key) { if (blockedStorage) throw Error('Blocked storage'); memory.delete(key); },
  };
  vm.runInNewContext(code, {
    module: loadedModule, exports: loadedModule.exports, sessionStorage,
    ...(server ? {} : { window }),
    setInterval(fn) { timers.set(++timerId, fn); return timerId; },
    clearInterval(id) { timers.delete(id); },
  });
  const api = loadedModule.exports;
  return {
    ...api, events, timers, memory,
    ready(handler = tag) { window.gtag = handler; },
    tick(count = 1) { for (let i = 0; i < count; i++) [...timers.values()].forEach(fn => fn()); },
    submit(data = identity) { if (data) api.markConversionIdentity(data); api.markContactConversionPending(); api.trackContactConversion(); },
  };
}
const conversionEvents = h => h.events.filter(e => e[0] === 'event' && e[1] === 'conversion');
const matchingEvents = h => h.events.filter(e => e[0] === 'set' && e[1] === 'user_data');
let checks = 0;
function check(name, fn) { fn(); checks++; console.log('PASS ' + name); }
function assertEnhanced(h, email = 'test@example.invalid') {
  assert.equal(conversionEvents(h).length, 1);
  assert.deepEqual(h.events.map(e => e.slice(0, 2)), [['set', 'user_data'], ['event', 'conversion']]);
  assert.equal(matchingEvents(h)[0][2].email, email);
  assert.equal(conversionEvents(h)[0][2].send_to, 'AW-18272669855/Xo1xCOeAm-UcEJ-hi4lE');
}

check('Ready tag receives normalized matching data before one form conversion', () => {
  const h = harness(); h.submit(); assertEnhanced(h);
  assert.deepEqual(matchingEvents(h)[0][2], { email: 'test@example.invalid', phone_number: '+13145550100' });
});
check('Delayed tag receives the same matching data before the later conversion', () => {
  const h = harness({ ready: false }); h.submit(); h.tick(5); assert.equal(h.events.length, 0);
  h.ready(); h.tick(); assertEnhanced(h); assert.equal(h.timers.size, 0);
  assert.equal(h.memory.has(identityKey), false); assert.equal(h.memory.has(pendingKey), false);
});
check('Duplicate thank-you effects cannot schedule or send another conversion', () => {
  const h = harness({ ready: false }); h.submit(); h.trackContactConversion(); h.trackContactConversion();
  assert.equal(h.timers.size, 1); h.ready(); h.tick(5); h.trackContactConversion(); assertEnhanced(h);
});
check('Direct thank-you visit sends nothing without a successful submission', () => {
  const h = harness(); h.trackContactConversion(); assert.equal(h.events.length, 0);
});
check('Absent Google tag reaches a bounded timeout and cannot send later', () => {
  const h = harness({ ready: false }); h.submit(); h.tick(42);
  assert.equal(h.timers.size, 0); h.ready(); h.tick(); h.trackContactConversion(); assert.equal(h.events.length, 0);
  assert.equal(h.memory.size, 0, 'Timed-out matching data must be removed');
});
check('Blocked storage keeps the existing in-memory submission path', () => {
  const h = harness({ ready: false, blockedStorage: true }); h.submit(); h.ready(); h.tick(); assertEnhanced(h);
});
check('Full-page redirect reads saved identity once and waits for the tag', () => {
  const h = harness({ ready: false, stored: [[pendingKey, '1'], [identityKey, JSON.stringify(identity)]] });
  h.trackContactConversion(); h.ready(); h.tick(); assertEnhanced(h); assert.equal(h.memory.size, 0);
});
check('A valid submission without identity still sends the base conversion', () => {
  const h = harness({ ready: false }); h.submit(null); h.ready(); h.tick();
  assert.equal(matchingEvents(h).length, 0); assert.equal(conversionEvents(h).length, 1);
});
check('Malformed saved identity cannot break the base conversion', () => {
  for (const saved of ['{invalid', JSON.stringify({ email: 123, phone: {} })]) {
    const h = harness({ stored: [[pendingKey, '1'], [identityKey, saved]] });
    assert.doesNotThrow(() => h.trackContactConversion());
    assert.equal(matchingEvents(h).length, 0); assert.equal(conversionEvents(h).length, 1);
  }
});
check('Email-only matching omits incomplete address and invalid phone', () => {
  const h = harness(); h.submit({ email: 'hello@example.invalid', name: 'Test Person', phone: 'invalid' });
  assert.deepEqual(matchingEvents(h)[0][2], { email: 'hello@example.invalid' });
});
check('Phone or name alone does not become an incomplete enhanced payload', () => {
  const h = harness(); h.submit({ phone: '(314) 555-0100', name: 'Test Person' });
  assert.equal(matchingEvents(h).length, 0); assert.equal(conversionEvents(h).length, 1);
});
check('Two delayed submissions each retain their own matching data', () => {
  const h = harness({ ready: false }); h.submit({ email: 'first@example.invalid' }); h.submit({ email: 'second@example.invalid' });
  h.ready(); h.tick(); assert.equal(conversionEvents(h).length, 2);
  assert.deepEqual(h.events.map(e => e[0]), ['set', 'event', 'set', 'event']);
  assert.deepEqual(matchingEvents(h).map(e => e[2].email), ['first@example.invalid', 'second@example.invalid']);
});
check('An earlier event cannot erase the later pending submission', () => {
  const h = harness({ ready: false }); h.submit({ email: 'first@example.invalid' }); h.submit({ email: 'second@example.invalid' });
  h.ready(); h.timers.values().next().value();
  assert.equal(JSON.parse(h.memory.get(identityKey)).email, 'second@example.invalid');
  assert.ok(h.memory.has(pendingKey));
  h.tick(); assert.equal(conversionEvents(h).length, 2); assert.equal(h.memory.size, 0);
});
check('A matching-data exception cannot suppress the base conversion', () => {
  const h = harness(); h.ready((...args) => {
    if (args[0] === 'set') throw Error('Matching unavailable');
    h.events.push(args);
  });
  assert.doesNotThrow(() => h.submit()); assert.equal(conversionEvents(h).length, 1); assert.equal(h.memory.size, 0);
});
check('Phone and booking clicks keep their existing labels without adding identity', () => {
  const h = harness({ ready: false }); h.trackClickToCallConversion(); h.trackBookCallConversion(); h.ready(); h.tick();
  assert.equal(matchingEvents(h).length, 0);
  assert.deepEqual(conversionEvents(h).map(e => e[2].send_to), [h.CLICK_TO_CALL_CONVERSION_SEND_TO, h.BOOK_CALL_CONVERSION_SEND_TO]);
});
check('Server rendering performs no browser tracking work', () => {
  const h = harness({ server: true }); assert.doesNotThrow(() => { h.trackContactConversion(); h.trackClickToCallConversion(); h.trackBookCallConversion(); });
  assert.equal(h.events.length, 0); assert.equal(h.timers.size, 0);
});
console.log(`${checks} enhanced-conversion checks passed. No network or production leads.`);
