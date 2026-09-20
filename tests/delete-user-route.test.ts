import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

// Load the actual route with isolated server dependencies; no Clerk or DB requests.
function route(session: string | null = 'clerk_admin', role = 'SUPER_ADMIN') {
  const calls: unknown[][] = [];
  const exports: any = {};
  const requireModule = createRequire(resolve('package.json'));
  const dependencies: Record<string, unknown> = {
    '@/lib/prisma': { prisma: { user: { findUnique: async () => {
      calls.push(['authorize']);
      return { id: 'admin', role };
    } } } },
    '@clerk/nextjs/server': {
      auth: async () => ({ userId: session }),
      clerkClient: async () => ({ users: { deleteUser: async (id: string) => { calls.push(['clerk', id]); } } }),
    },
    '@/lib/delete-user': { deleteUserAccount: async (_db: unknown, id: string, caller: string, remove: any) => {
      calls.push(['delete', id, caller]);
      await remove('stored_clerk_id');
      return { status: 200 };
    } },
  };
  const source = readFileSync(resolve('app/api/admin/data/[model]/route.ts'), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  runInNewContext(compiled, {
    exports, console,
    require: (name: string) => dependencies[name] ?? requireModule(name),
  });
  return {
    calls,
    send: (body: string, model = 'user') => exports.DELETE(new Request('http://localhost/api/admin/data/user', {
      method: 'DELETE', body,
    }), { params: Promise.resolve({ model }) }) as Promise<Response>,
  };
}

test('unauthenticated and non-admin requests cannot delete', async () => {
  const anonymous = route(null);
  assert.equal((await anonymous.send('{"id":"target"}')).status, 401);
  assert.deepEqual(anonymous.calls, []);
  const viewer = route('clerk_viewer', 'VIEWER');
  assert.equal((await viewer.send('{"id":"target"}')).status, 403);
  assert.deepEqual(viewer.calls, [['authorize']]);
});

test('invalid request bodies and unsupported models cannot delete', async () => {
  for (const body of ['{', '{}', '{"id":null}', '{"id":123}', '{"id":"   "}']) {
    const endpoint = route();
    assert.equal((await endpoint.send(body)).status, 400);
    assert.deepEqual(endpoint.calls, [['authorize']]);
  }
  for (const model of ['schoolUser', '$transaction', 'constructor']) {
    const endpoint = route();
    assert.equal((await endpoint.send('{"id":"target"}', model)).status, 400);
    assert.deepEqual(endpoint.calls, [['authorize']]);
  }
});

test('user endpoint passes authenticated caller and uses the service Clerk ID', async () => {
  const endpoint = route();
  const response = await endpoint.send('{"id":"target","clerkId":"untrusted"}');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.deepEqual(endpoint.calls, [['authorize'], ['delete', 'target', 'admin'], ['clerk', 'stored_clerk_id']]);
});
