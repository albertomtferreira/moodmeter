import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { ReportError } from '../lib/reports/access';

test('route handler returns private data, expected status codes and generic unexpected errors', async () => {
  const requireModule = createRequire(resolve('package.json'));
  let outcome: unknown = { total: 10 };
  const dependencies: Record<string, unknown> = {
    '@clerk/nextjs/server': { auth: async () => ({ userId: 'clerk' }) },
    '@/lib/prisma': { prisma: {} }, './access': { ReportError },
    './service': { getReport: async () => { if (outcome instanceof Error) throw outcome; return outcome; }, getComparison: async () => [] },
  };
  const exports: { reportHandler?: (kind: string) => (request: Request) => Promise<Response> } = {};
  const code = ts.transpileModule(readFileSync('lib/reports/handler.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  runInNewContext(code, { exports, console: { error() {} }, URL, require: (name: string) => dependencies[name] ?? requireModule(name) });
  const handler = exports.reportHandler!('daily');
  const request = new Request('http://localhost/api/reports/daily?schoolId=a');
  const success = await handler(request);
  assert.equal(success.status, 200); assert.equal(success.headers.get('cache-control'), 'private, no-store');
  for (const status of [400, 401, 403]) { outcome = new ReportError(status, 'Expected'); assert.equal((await handler(request)).status, status); }
  outcome = new Error('Private database details');
  const failure = await handler(request);
  assert.equal(failure.status, 500); assert.ok(!(await failure.text()).includes('Private database details'));
});

test('all four endpoint entrypoints use the shared report handler', () => {
  for (const kind of ['daily', 'weekly', 'monthly', 'comparison']) {
    let bound = '';
    const exports: { GET?: string } = {};
    const code = ts.transpileModule(readFileSync(`app/api/reports/${kind}/route.ts`, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
    runInNewContext(code, { exports, require: () => ({ reportHandler: (value: string) => { bound = value; return value; } }) });
    assert.equal(bound, kind); assert.equal(exports.GET, kind);
  }
});

test('PWA handles authenticated report and school requests with NetworkOnly before generic API caching', () => {
  let pwaOptions: { runtimeCaching: { urlPattern: (input: { url: URL }) => boolean; handler: string }[] } | undefined;
  const dependencies: Record<string, unknown> = {
    '@sentry/nextjs': { withSentryConfig: (config: unknown) => config },
    'next-pwa': (options: typeof pwaOptions) => { pwaOptions = options; return (config: unknown) => config; },
    'next-pwa/cache.js': [{ handler: 'NetworkFirst' }],
  };
  const code = ts.transpileModule(readFileSync('next.config.mjs', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  runInNewContext(code, { exports: {}, process: { env: {} }, self: { location: { origin: 'https://school.test' } }, require: (name: string) => dependencies[name] });
  const rule = pwaOptions!.runtimeCaching[0];
  assert.equal(rule.handler, 'NetworkOnly');
  for (const path of ['/api/reports/daily', '/api/reports/weekly', '/api/reports/monthly', '/api/reports/comparison', '/api/users/schools']) {
    assert.equal(rule.urlPattern({ url: new URL(path, 'https://school.test') }), true);
  }
  assert.equal(rule.urlPattern({ url: new URL('https://other.test/api/reports/daily') }), false);
  assert.equal(pwaOptions!.runtimeCaching[1].handler, 'NetworkFirst');
});
