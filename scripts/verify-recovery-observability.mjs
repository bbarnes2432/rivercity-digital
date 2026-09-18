// Network-free checks of diagnostic boundaries and real provider receipts.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { randomUUID } from 'node:crypto';
import ts from 'typescript';

function load(path, scope = {}) {
  const loadedModule = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(new URL('../src/' + path, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { module: loadedModule, exports: loadedModule.exports, ...scope });
  return loadedModule.exports;
}
const schema = load('lib/funnel-schema.ts');
const base = { session: randomUUID(), version: schema.PAGE_VERSION, paid: true, device: 'mobile' };
let checks = 0;
async function check(name, fn) { await fn(); checks++; console.log('PASS ' + name); }
const logs = [];
const requireBase = id => {
  if (id === '@/lib/funnel-schema') return schema;
  if (id === 'node:crypto') return { randomUUID };
  if (id === 'next/server') return { NextResponse: { json: (body, init) => Response.json(body, init) } };
  throw new Error('Unexpected import ' + id);
};
const route = load('app/api/funnel/route.ts', { require: requireBase, URL, Response, console: { info: value => logs.push(JSON.parse(value)) } });
const event = { ...base, eventId: randomUUID(), event: 'mockup_start', email: 'must-not-log@example.invalid', gclid: 'must-not-log-click' };
const post = (body, headers = {}) => route.POST(new Request('https://example.invalid/api/funnel', { method: 'POST', headers: { origin: 'https://example.invalid', ...headers }, body: JSON.stringify(body) }));
await check('Only allowlisted diagnostic fields reach runtime logs', async () => {
  assert.equal((await post(event)).status, 200);
  assert.equal(logs.length, 1);
  assert.equal(logs[0].source, 'browser');
  assert.ok(!JSON.stringify(logs).includes('must-not-log'));
});
await check('Cross-site submission is rejected', async () => assert.equal((await post(event, { origin: 'https://foreign.invalid' })).status, 403));
await check('Invalid event is rejected', async () => assert.equal((await post({ ...event, event: 'lead_from_phone_tap' })).status, 400));
await check('Arbitrary identifiers are rejected', async () => assert.equal((await post({ ...event, session: 'email@example.invalid' })).status, 400));
await check('Oversized event is rejected', async () => assert.equal((await post({ ...event, excess: 'a'.repeat(2200) })).status, 413));
await check('Null event is rejected', async () => assert.equal((await post(null)).status, 400));
await check('Old page versions are not silently combined', async () => assert.equal((await post({ ...event, version: 'old' })).status, 400));

function client({ dnt = false, gpc = false, storageFailure = false, fetchFailure = false } = {}) {
  const store = new Map(), requests = [];
  const api = load('app/website-design/_components/funnel.ts', {
    require: id => id.endsWith('/attribution') ? { readAttribution: () => ({ gclid: 'PRIVATE_CLICK', utm_medium: 'cpc' }) } : requireBase(id),
    window: {}, navigator: { doNotTrack: dnt ? '1' : '0', globalPrivacyControl: gpc }, crypto: { randomUUID },
    sessionStorage: { getItem: key => { if (storageFailure) throw Error('blocked'); return store.get(key); }, setItem: (k,v) => store.set(k,v) },
    matchMedia: () => ({ matches: true }),
    fetch: (_url, init) => { if (fetchFailure) throw Error('offline'); requests.push(JSON.parse(init.body)); return Promise.resolve(); },
  });
  return { api, requests };
}
await check('First-party form views and starts deduplicate', async () => {
  const h = client(); h.api.trackFunnel('mockup_view', true); h.api.trackFunnel('mockup_view', true); h.api.trackFunnel('mockup_start', true);
  assert.equal(h.requests.length, 2); assert.equal(h.requests[0].session, h.requests[1].session);
  assert.ok(!JSON.stringify(h.requests).includes('PRIVATE_CLICK'));
});
for (const flag of ['dnt', 'gpc', 'storageFailure']) await check(flag + ' preserves a usable form without diagnostics', async () => {
  const h = client({ [flag]: true }); assert.doesNotThrow(() => h.api.trackFunnel('mockup_start')); assert.equal(h.requests.length, 0);
});
await check('Diagnostic network failure never escapes into form code', async () => assert.doesNotThrow(() => client({ fetchFailure: true }).api.trackFunnel('mockup_submit')));
await check('Repeated event volume is bounded per loaded page', async () => {
  const h = client(); for (let n=0;n<100;n++) h.api.trackFunnel('cta_mockup'); assert.equal(h.requests.length,48);
});

async function delivery(options = {}) {
  const out = [], requests = [];
  const api = load('app/api/contact/route.ts', {
    require: requireBase, Response, AbortSignal, process: { env: { NODE_ENV: 'production', RESEND_API_KEY: 'MOCK_ONLY' } },
    console: { info: value => { if (options.loggingThrows) throw Error('logger unavailable'); out.push(JSON.parse(value)); }, error() {}, log() {} },
    fetch: async (_url, init) => { requests.push(JSON.parse(init.body)); if (options.timeout) { const error = Error('timeout'); error.name='AbortError'; throw error; } return Response.json({ id: 'provider-message-123' }, { status: options.reject ? 429 : 200 }); },
  });
  const response = await api.POST({ json: async () => ({ name:'QA PRIVATE', email:'private@example.invalid', phone:'PRIVATE_PHONE', service:'New website', message:'PRIVATE_MESSAGE', funnel:base, ...(options.bot ? { 'bot-field':'filled' } : {}) }) });
  return { status:response.status, body:await response.json(), logs:out, requests };
}
await check('Accepted send retains private provider ID and public random receipt', async () => {
  const h=await delivery(); assert.equal(h.status,200); assert.ok(schema.safeUuid(h.body.receiptId));
  assert.equal(h.logs[1].event,'provider_accepted'); assert.equal(h.logs[1].providerId,'provider-message-123');
  assert.equal(h.logs[1].receiptId,h.body.receiptId); assert.equal(h.logs[1].session,base.session);
  assert.ok(!JSON.stringify(h.logs).includes('PRIVATE')); assert.ok(!JSON.stringify(h.logs).includes('private@example'));
  assert.ok(!JSON.stringify(h.body).includes('provider-message'));
});
await check('Rejected sends remain failures and never log accepted', async () => { const h=await delivery({reject:true}); assert.equal(h.status,502); assert.equal(h.logs.at(-1).event,'provider_rejected'); });
await check('Unconfirmed sends preserve timeout state', async () => { const h=await delivery({timeout:true}); assert.equal(h.status,502); assert.equal(h.logs.at(-1).event,'provider_unconfirmed'); });
await check('Honeypot creates neither email nor accepted receipt', async () => { const h=await delivery({bot:true}); assert.equal(h.body.ignored,true); assert.equal(h.requests.length,0); assert.equal(h.logs.length,0); });
await check('Logging failure cannot turn accepted delivery into an error', async () => { const h=await delivery({loggingThrows:true}); assert.equal(h.status,200); assert.equal(h.body.ok,true); });
console.log(`${checks} recovery-observability checks passed. No external requests.`);
