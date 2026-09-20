import { test } from 'node:test';
import assert from 'node:assert/strict';
import { QueryClient, QueryObserver } from '@tanstack/react-query';
import { fetchReportJson, ReportFetchError, reportQueryKey, reportQueryOptions } from '../hooks/useReport';
import type { Report } from '../lib/reports/types';

test('HTTP failures are errors, not chart data; cancellation reaches fetch', async () => {
  const original = globalThis.fetch;
  try {
    const controller = new AbortController();
    globalThis.fetch = async (_url, options) => {
      assert.equal(options?.signal, controller.signal);
      return new Response('{"error":"School access is unavailable."}', { status: 403 });
    };
    await assert.rejects(fetchReportJson('/report', controller.signal), error => error instanceof ReportFetchError && error.status === 403);
    globalThis.fetch = async () => new Response('<html>Gateway error</html>', { status: 502 });
    await assert.rejects(fetchReportJson('/report'), /Unable to load data/);
  } finally { globalThis.fetch = original; }
});

test('query keys isolate users, schools, sections and periods; polling stays disabled', () => {
  const key = reportQueryKey('a', 'school', 'daily', 'date=2026-01-01');
  for (const other of [reportQueryKey('b', 'school', 'daily', 'date=2026-01-01'), reportQueryKey('a', 'other', 'daily', 'date=2026-01-01'), reportQueryKey('a', 'school', 'weekly', 'week=2026-01-01')]) assert.notDeepEqual(key, other);
  const options = reportQueryOptions('a', 'school', 'daily', 'date=2026-01-01', true);
  assert.equal(options.refetchInterval, false); assert.equal(options.staleTime, 60000);
  assert.equal(options.retry(0, new ReportFetchError('Forbidden', 403)), false);
  assert.equal(reportQueryOptions('a', '', 'daily', '', true).enabled, false);
});

test('rapid selection cancels old request and never shows the old school in new state', async () => {
  const original = globalThis.fetch;
  const client = new QueryClient({ defaultOptions: { queries: { gcTime: 0 } } });
  const requests: { signal: AbortSignal; finish: () => void }[] = [];
  globalThis.fetch = (_url, options) => new Promise<Response>(resolve => {
    const id = requests.length;
    requests.push({ signal: options!.signal as AbortSignal, finish: () => resolve(Response.json({ school: { id: String(id) } })) });
  });
  const observer = new QueryObserver(client, reportQueryOptions('user', 'old', 'daily', 'date=2026-06-01', true));
  const unsubscribe = observer.subscribe(() => {});
  try {
    assert.equal(requests.length, 1);
    observer.setOptions(reportQueryOptions('user', 'new', 'daily', 'date=2026-06-01', true));
    assert.equal(requests[0].signal.aborted, true);
    assert.equal(observer.getCurrentResult().data, undefined);
    requests[1].finish();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(observer.getCurrentResult().data?.school.id, '1');
    requests[0].finish();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(observer.getCurrentResult().data?.school.id, '1');
  } finally { unsubscribe(); client.clear(); globalThis.fetch = original; }
});

test('same-selection refresh keeps existing results and failed reports can retry', async () => {
  const original = globalThis.fetch;
  const client = new QueryClient({ defaultOptions: { queries: { gcTime: 0 } } });
  const options = reportQueryOptions('user', 'school', 'daily', 'date=2026-06-01', true);
  client.setQueryData(options.queryKey, { total: 12 } as Report);
  const observer = new QueryObserver(client, { ...options, retry: false });
  const unsubscribe = observer.subscribe(() => {});
  try {
    let fail: (() => void) | undefined;
    globalThis.fetch = () => new Promise<Response>(resolve => { fail = () => resolve(Response.json({ error: 'Unavailable' }, { status: 503 })); });
    const refresh = observer.refetch();
    assert.equal(observer.getCurrentResult().data?.total, 12);
    assert.equal(observer.getCurrentResult().isFetching, true);
    fail!(); await refresh;
    assert.equal(observer.getCurrentResult().isError, true);
    assert.equal(observer.getCurrentResult().data?.total, 12);
    globalThis.fetch = async () => Response.json({ total: 14 });
    await observer.refetch();
    assert.equal(observer.getCurrentResult().data?.total, 14);
    assert.equal(observer.getCurrentResult().isError, false);
  } finally { unsubscribe(); client.clear(); globalThis.fetch = original; }
});
