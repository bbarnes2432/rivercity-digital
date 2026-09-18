// Real capture + root GoogleTag + contact handler, with browser/email stubs.
// No network requests, Google events or production inquiries are generated.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { randomUUID } from 'node:crypto';

function compile(relative) {
  return ts.transpileModule(fs.readFileSync(new URL(relative, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
}
const attributionCode = compile('../src/app/_components/attribution.ts');
const tagCode = compile('../src/app/_components/GoogleTag.tsx');
const routeCode = compile('../src/app/api/contact/route.ts');
const schemaModule = { exports: {} };
vm.runInNewContext(compile('../src/lib/funnel-schema.ts'), { module: schemaModule, exports: schemaModule.exports });
const suffix = 'utm_source=google&utm_medium=cpc&utm_campaign=st_louis_web_design_23979555250&utm_term=website%20design%20agency&utm_content=ad_821717580434_ag_198561359915_mt_e_dev_m&gclid=test-only-not-a-real-click';
let checks = 0;

async function journey(pathname, { blocked = false, stored, mountEffects = true } = {}) {
  const memory = new Map(stored ? [['rcd-attribution', JSON.stringify(stored)]] : []);
  const browser = { location: { pathname, search: '?' + suffix } };
  const storage = { getItem: k => { if (blocked) throw Error('Blocked'); return memory.get(k) ?? null; }, setItem: (k, v) => { if (blocked) throw Error('Blocked'); memory.set(k, v); } };
  const captureModule = { exports: {} };
  vm.runInNewContext(attributionCode, { module: captureModule, exports: captureModule.exports, window: browser, sessionStorage: storage, URLSearchParams });
  const tagModule = { exports: {} };
  vm.runInNewContext(tagCode, { module: tagModule, exports: tagModule.exports, process: { env: {} }, require: id => {
    if (id === 'react') return { useEffect: fn => { if (mountEffects) fn(); } };
    if (id === 'react/jsx-runtime') return { jsx: () => null, jsxs: () => null, Fragment: 'fragment' };
    if (id === 'next/script') return { default: () => null };
    if (id === './attribution') return captureModule.exports;
    if (id === './website-call-tracking') return { configureWebsiteCallTracking() { throw Error('Should not configure calls while mounting capture'); } };
    throw Error('Unexpected module: ' + id);
  } });
  tagModule.exports.default(); // Root component mounts on direct sitelink arrival.
  browser.location = { pathname: '/contact', search: '' }; // Later navigation drops the URL parameters.
  const saved = JSON.parse(JSON.stringify(captureModule.exports.readAttribution()));
  const calls = [];
  const routeModule = { exports: {} };
  vm.runInNewContext(routeCode, { module: routeModule, exports: routeModule.exports, Response, AbortSignal, console: { error() {}, log() {} },
    process: { env: { NODE_ENV: 'production', RESEND_API_KEY: 'mock-only', CONTACT_TO_EMAIL: 'test@example.invalid' } },
    require: id => {
      if (id === 'node:crypto') return { randomUUID };
      if (id === '@/lib/funnel-schema') return schemaModule.exports;
      assert.equal(id, 'next/server'); return { NextResponse: { json: (x, options) => new Response(JSON.stringify(x), { status: options?.status ?? 200 }) } };
    },
    fetch: async (url, options) => { assert.equal(url, 'https://api.resend.com/emails'); calls.push(JSON.parse(options.body)); return new Response('{}', { status: 200 }); },
  });
  const response = await routeModule.exports.POST({ json: async () => ({ name: 'Local Test', email: 'test@example.invalid', service: 'New website', ...saved }) });
  assert.equal(response.status, 200);
  assert.equal(calls.length, 1);
  return { saved, text: calls[0].text };
}

for (const path of ['/work', '/about', '/contact', '/website-design']) {
  const result = await journey(path);
  for (const [key, value] of new URLSearchParams(suffix)) {
    assert.equal(result.saved[key], value, `${path}: missing ${key}`);
    assert.ok(result.text.includes(`${key}: ${value}`), `${path}: absent from mocked lead email`);
  }
  checks++;
}
const existing = { utm_source: 'earlier', gclid: 'previous-click' };
assert.deepEqual((await journey('/work', { stored: existing })).saved, existing); checks++;
assert.deepEqual((await journey('/contact', { blocked: true })).saved, {}); checks++;
assert.deepEqual((await journey('/about', { mountEffects: false })).saved, {}); checks++;
console.log(`${checks} sitewide attribution checks passed. All email delivery mocked.`);
