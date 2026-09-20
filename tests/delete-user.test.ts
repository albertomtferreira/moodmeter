import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { PrismaClient } from '@prisma/client';
import { ClerkAPIResponseError } from '@clerk/nextjs/errors';
import { deleteLocalUser, deleteUserAccount } from '../lib/delete-user';

function fixture() {
  let state = { users: [{ id: 'target', clerkId: 'clerk_target' }, { id: 'other', clerkId: 'clerk_other' }],
    memberships: ['target', 'target', 'other'], settings: ['target', 'other'], schools: ['school'], moods: ['mood'] };
  let fail = false;
  const calls: string[] = [];
  const find = (where: any) => state.users.find((u) => where.id ? u.id === where.id : u.clerkId === where.clerkId);
  const db = {
    user: { findUnique: async ({ where }: any) => find(where) },
    $transaction: async (run: any) => {
      calls.push('transaction');
      const before = structuredClone(state);
      try {
        await run({
          user: {
            findUnique: async ({ where }: any) => find(where),
            deleteMany: async ({ where }: any) => {
              if (fail) throw new Error('Database unavailable');
              state.users = state.users.filter((u) => u.id !== where.id);
            },
          },
          schoolUser: { deleteMany: async ({ where }: any) => {
            state.memberships = state.memberships.filter((id) => id !== where.userId);
          } },
          userSettings: { deleteMany: async ({ where }: any) => {
            state.settings = state.settings.filter((id) => id !== where.userId);
          } },
        });
      } catch (error) { state = before; throw error; }
    },
  } as unknown as PrismaClient;
  return { db, calls, state: () => state, fail: (value: boolean) => { fail = value; } };
}

const missing = () => new ClerkAPIResponseError('Not found', {
  status: 404, data: [{ code: 'resource_not_found', message: 'User not found' }],
});

test('deletes Clerk first and cleans only target records; retries succeed', async () => {
  const f = fixture();
  const remove = async (id: string) => { assert.equal(id, 'clerk_target'); f.calls.push('clerk'); };
  assert.equal((await deleteUserAccount(f.db, 'target', 'admin', remove)).status, 200);
  assert.deepEqual(f.calls, ['clerk', 'transaction']);
  assert.deepEqual(f.state(), { users: [{ id: 'other', clerkId: 'clerk_other' }],
    memberships: ['other'], settings: ['other'], schools: ['school'], moods: ['mood'] });
  assert.equal((await deleteUserAccount(f.db, 'target', 'admin', remove)).status, 200);
  await deleteLocalUser(f.db, 'clerk_target');
  assert.equal(f.calls.filter((c) => c === 'clerk').length, 1);
});

test('blocks self deletion before side effects', async () => {
  const f = fixture();
  assert.equal((await deleteUserAccount(f.db, 'target', 'target', async () => assert.fail())).status, 409);
  assert.deepEqual(f.calls, []);
});

test('only a verified Clerk missing resource allows cleanup', async () => {
  for (const error of [new Error('Timeout'), { status: 404 },
    new ClerkAPIResponseError('Forbidden', { status: 403, data: [] })]) {
    const f = fixture();
    assert.equal((await deleteUserAccount(f.db, 'target', 'admin', async () => { throw error; })).status, 502);
    assert.deepEqual(f.calls, []);
    assert.equal(f.state().users.length, 2);
  }
  const f = fixture();
  assert.equal((await deleteUserAccount(f.db, 'target', 'admin', async () => { throw missing(); })).status, 200);
});

test('cleanup failure reports partial completion and can be retried', async () => {
  const f = fixture();
  const before = structuredClone(f.state());
  f.fail(true);
  assert.equal((await deleteUserAccount(f.db, 'target', 'admin', async () => {})).status, 503);
  assert.deepEqual(f.state(), before);
  f.fail(false);
  assert.equal((await deleteUserAccount(f.db, 'target', 'admin', async () => { throw missing(); })).status, 200);
});

test('webhook cleanup can finish during Clerk deletion', async () => {
  const f = fixture();
  assert.equal((await deleteUserAccount(f.db, 'target', 'admin', async () => {
    await deleteLocalUser(f.db, 'clerk_target');
  })).status, 200);
  await Promise.all([deleteLocalUser(f.db, 'clerk_target'), deleteLocalUser(f.db, 'clerk_target')]);
  assert.equal(f.state().users.length, 1);
});

test('cleanup rejects missing webhook ID before querying', async () => {
  const f = fixture();
  await assert.rejects(deleteLocalUser(f.db, ' '));
  assert.deepEqual(f.calls, []);
});
