// Isolated route checks: every email-provider request is mocked. No network.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { randomUUID } from 'node:crypto';

const schemaModule = { exports: {} };
const schemaCode = ts.transpileModule(fs.readFileSync(new URL('../src/lib/funnel-schema.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
vm.runInNewContext(schemaCode, { module: schemaModule, exports: schemaModule.exports });

async function request(route, body, options = {}) {
  const calls = [];
  const routeModule = { exports: {} };
  const sandbox = {
    exports: routeModule.exports, module: routeModule, Error, AbortSignal,
    require(id) {
      if (id === 'node:crypto') return { randomUUID };
      if (id === '@/lib/funnel-schema') return schemaModule.exports;
      assert.equal(id, 'next/server');
      return { NextResponse: { json: (data, init) => Response.json(data, init) } };
    },
    process: { env: { NODE_ENV: options.dev ? 'development' : 'production', ...(options.noKey ? {} : { RESEND_API_KEY: 'TEST_ONLY' }) } },
    console: { log() {}, error() {} },
    fetch: async (url, init) => {
      calls.push({ url, ...init, body: JSON.parse(init.body) });
      assert.ok(init.signal instanceof AbortSignal, 'Provider request needs a timeout');
      if (options.timeout) { const error = new Error('Simulated timeout'); error.name = 'TimeoutError'; throw error; }
      if (options.networkFailure) throw new Error('Simulated network failure');
      return new Response('{}', { status: options.providerStatus || 200 });
    },
  };
  const source = fs.readFileSync(new URL(`../src/app/api/${route}/route.ts`, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(compiled, sandbox);
  const response = await routeModule.exports.POST({ json: async () => {
    if (options.invalidJson) throw new Error('Invalid JSON');
    return body;
  } });
  return { status: response.status, data: await response.json(), calls };
}

(async () => {
  const valid = { name: 'Local Test', email: 'test@example.invalid', service: 'New website', source: 'Website design — free mockup', gclid: 'test-click', gbraid: 'test-gbraid', wbraid: 'test-wbraid', utm_source: 'test-source' };
  let checks = 0;
  async function check(route, body, expected, options = {}, expectedCalls = 0) {
    const result = await request(route, body, options);
    assert.equal(result.status, expected, `${route}: expected ${expected}, got ${result.status}`);
    assert.equal(result.calls.length, expectedCalls, `${route}: unexpected provider calls`);
    checks++;
    return result;
  }
  for (const route of ['contact', 'newsletter']) {
    for (const body of [null, [], 'text', 4, true, {}]) await check(route, body, 400);
    await check(route, {}, 400, { invalidJson: true });
    await check(route, { ...valid, email: 'invalid' }, 400);
    await check(route, { ...valid, email: 'x'.repeat(250) + '@example.com' }, 400);
    await check(route, { ...valid, 'bot-field': 'bot' }, 200);
    const success = await check(route, valid, 200, {}, 1);
    assert.equal(success.data.ok, true);
    assert.equal(success.calls[0].body.reply_to, valid.email);
    if (route === 'contact') {
      assert.ok(success.calls[0].body.text.includes('gclid: test-click'));
      assert.ok(success.calls[0].body.text.includes('gbraid: test-gbraid'));
      assert.ok(success.calls[0].body.text.includes('wbraid: test-wbraid'));
      assert.ok(success.calls[0].body.text.includes('utm_source: test-source'));
    }
    await check(route, valid, 500, { noKey: true });
    const dev = await check(route, valid, 200, { noKey: true, dev: true });
    assert.equal(dev.data.dev, true);
    await check(route, valid, 502, { providerStatus: 429 }, 1);
    await check(route, valid, 502, { networkFailure: true }, 1);
    await check(route, valid, 502, { timeout: true }, 1);
  }
  for (const [field, limit] of Object.entries({ name: 120, phone: 40, website: 500, business: 200, service: 120, message: 5000 })) {
    await check('contact', { ...valid, [field]: 'x'.repeat(limit + 1) }, 400);
  }
  await check('contact', { ...valid, name: 'A\nB' }, 400);
  const bounded = await check('contact', { ...valid, gbraid: 'x'.repeat(301), wbraid: '  test-braid  ', unapproved_click_id: 'do-not-forward' }, 200, {}, 1);
  assert.ok(bounded.calls[0].body.text.includes(`gbraid: ${'x'.repeat(300)}\n`));
  assert.ok(bounded.calls[0].body.text.includes('wbraid: test-braid'));
  assert.ok(!bounded.calls[0].body.text.includes('do-not-forward'));
  const malformedIds = await check('contact', { ...valid, gbraid: { invalid: true }, wbraid: ['invalid'] }, 200, {}, 1);
  assert.ok(!malformedIds.calls[0].body.text.includes('gbraid:'));
  assert.ok(!malformedIds.calls[0].body.text.includes('wbraid:'));
  await check('newsletter', { ...valid, source: 'x'.repeat(201) }, 400);
  console.log(`${checks} lead-route checks passed. All delivery mocked; no emails sent.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
