import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import type { Prisma, PrismaClient } from '@prisma/client';
import { getComparison, getReport } from '../lib/reports/service';
import { academicStart, londonDate, monday, previousWeekInstant, validDate } from '../lib/reports/dates';
import { csvCell, reportCsv } from '../lib/reports/csv';
import { filterParams, parseFilters, selectSchool } from '../lib/reports/filters';
import { ReportError } from '../lib/reports/access';

// Execute production aggregation SQL against an isolated PostgreSQL engine.
// Authentication and Prisma lookups are fixtures; no live school data is touched.
const pg = new PGlite();
before(async () => {
  await pg.exec(`CREATE TABLE "Mood" ("schoolId" text, "timestamp" timestamp, "type" text);`);
  const rows = [
    ['school', '2024-01-15T12:00:00Z', 'HAPPY'],
    ['school', '2025-01-31T23:59:59Z', 'UNHAPPY'],
    ['school', '2025-03-30T00:30:00Z', 'HAPPY'],
    ['school', '2025-03-30T01:30:00Z', 'OKAY'],
    ['school', '2025-03-30T22:59:59Z', 'UNHAPPY'],
    ['school', '2025-03-30T23:00:00Z', 'HAPPY'],
    ['school', '2025-10-26T00:30:00Z', 'HAPPY'],
    ['school', '2025-10-26T01:30:00Z', 'UNHAPPY'],
    ['school', '2026-06-01T09:00:00Z', 'HAPPY'],
    ['school', '2026-06-01T10:00:00Z', 'HAPPY'],
    ['school', '2026-06-01T10:30:00Z', 'HAPPY'],
    ['school', '2026-06-02T09:00:00Z', 'UNHAPPY'],
    ['school', '2026-06-02T10:00:00Z', 'UNHAPPY'],
    ['school', '2026-06-03T11:30:00Z', 'HAPPY'],
    ['school', '2026-06-04T09:00:00Z', 'UNHAPPY'],
    ['school', '2026-06-08T09:00:00Z', 'HAPPY'],
    ['school', '2026-06-09T09:00:00Z', 'OKAY'],
    ['other', '2026-06-09T09:00:00Z', 'UNHAPPY'],
  ];
  for (const row of rows) await pg.query('INSERT INTO "Mood" VALUES ($1, $2, $3)', row);
});
after(async () => { await pg.close(); });

function fixture({ role = 'VIEWER', member = true, user = true }: { role?: string; member?: boolean; user?: boolean } = {}) {
  const calls: Prisma.Sql[] = [];
  const db = {
    user: { findUnique: async () => user ? { id: 'user', role } : null },
    schoolUser: {
      findUnique: async ({ where }: { where: { userId_schoolId: { schoolId: string } } }) => member && ['school', 'empty'].includes(where.userId_schoolId.schoolId) ? { school: { id: where.userId_schoolId.schoolId, name: 'School' } } : null,
      findMany: async ({ where }: { where: { userId: string; school: { isActive: boolean } } }) => {
        assert.equal(where.userId, 'user'); assert.equal(where.school.isActive, true);
        return member ? [{ school: { id: 'school', name: 'School' } }] : [];
      },
    },
    mood: { aggregate: async ({ where }: { where: { schoolId: string } }) => ({ _min: { timestamp: where.schoolId === 'empty' ? null : new Date('2024-01-15T12:00:00Z') } }) },
    $queryRaw: async (query: Prisma.Sql) => {
      calls.push(query);
      return (await pg.query(query.text, query.values.map(value => value instanceof Date ? value.toISOString() : value))).rows;
    },
  } as unknown as PrismaClient;
  return { db, calls };
}
const pastNow = new Date('2026-07-01T12:00:00Z');
const params = (values: Record<string, string>) => new URLSearchParams({ schoolId: 'school', ...values });
const rejectsStatus = (promise: Promise<unknown>, status: number) => assert.rejects(promise, error => error instanceof ReportError && error.status === status);

test('all report kinds reject anonymous, missing users and unassigned schools before aggregation', async () => {
  for (const kind of ['daily', 'weekly', 'monthly'] as const) {
    const f = fixture();
    await rejectsStatus(getReport(f.db, null, kind, params({}), pastNow), 401);
    assert.equal(f.calls.length, 0);
    await rejectsStatus(getReport(fixture({ user: false }).db, 'clerk', kind, params({}), pastNow), 403);
    for (const role of ['VIEWER', 'ADMIN', 'SUPER_ADMIN']) {
      const denied = fixture({ role, member: false });
      await rejectsStatus(getReport(denied.db, 'clerk', kind, params({}), pastNow), 403);
      assert.equal(denied.calls.length, 0);
      assert.equal((await getReport(fixture({ role }).db, 'clerk', kind, params({}), pastNow)).school.id, 'school');
    }
  }
});

test('comparison returns only active assigned schools with no super-admin exception', async () => {
  await rejectsStatus(getComparison(fixture().db, null, pastNow), 401);
  const f = fixture({ role: 'SUPER_ADMIN' });
  const result = await getComparison(f.db, 'clerk', new Date('2026-06-10T11:00:00Z'));
  assert.deepEqual(result.map(item => item.schoolId), ['school']);
  assert.equal(result[0].total, 9);
  assert.deepEqual(await getComparison(fixture({ member: false }).db, 'clerk', pastNow), []);
});

test('validates dates, required school and reversed ranges', async () => {
  const db = fixture().db;
  for (const date of ['', '2025-02-29', '2026-13-01', '2026-06-01T12:00:00Z', 'not-a-date']) {
    await rejectsStatus(getReport(db, 'clerk', 'daily', params({ date }), pastNow), 400);
    await rejectsStatus(getReport(db, 'clerk', 'weekly', params({ week: date }), pastNow), 400);
    await rejectsStatus(getReport(db, 'clerk', 'monthly', params({ from: date }), pastNow), 400);
  }
  await rejectsStatus(getReport(db, 'clerk', 'monthly', params({ from: '2026-06-02', to: '2026-06-01' }), pastNow), 400);
  await rejectsStatus(getReport(db, 'clerk', 'daily', new URLSearchParams(), pastNow), 400);
  assert.equal(validDate('2024-02-29'), true);
});

test('spring day has 23 hourly buckets, includes final second and excludes next midnight', async () => {
  const report = await getReport(fixture().db, 'clerk', 'daily', params({ date: '2025-03-30' }), pastNow);
  assert.equal(report.buckets.length, 23);
  assert.equal(report.period.start, '2025-03-30T00:00:00.000Z');
  assert.equal(report.period.endExclusive, '2025-03-30T23:00:00.000Z');
  assert.equal(report.total, 3);
  assert.equal(report.buckets.some(bucket => bucket.label.startsWith('01:00')), false);
  assert.equal(report.total, report.buckets.reduce((sum, bucket) => sum + bucket.total, 0));
});

test('autumn day preserves both 01:00 hours with unique identifiers and offsets', async () => {
  const report = await getReport(fixture().db, 'clerk', 'daily', params({ date: '2025-10-26' }), pastNow);
  assert.equal(report.buckets.length, 25);
  const repeated = report.buckets.filter(bucket => bucket.label.startsWith('01:00'));
  assert.deepEqual(repeated.map(bucket => bucket.label), ['01:00 +01:00', '01:00 +00:00']);
  assert.notEqual(repeated[0].id, repeated[1].id);
  assert.equal(repeated[0].counts.HAPPY, 1);
  assert.equal(repeated[1].counts.UNHAPPY, 1);
});

test('monthly totals retain years, missing months, and the complete final day', async () => {
  const report = await getReport(fixture().db, 'clerk', 'monthly', params({ from: '2024-01-01', to: '2025-01-31' }), pastNow);
  assert.equal(report.buckets.length, 13);
  assert.equal(report.buckets[0].id, '2024-01');
  assert.equal(report.buckets[12].id, '2025-01');
  assert.equal(report.buckets[12].counts.UNHAPPY, 1);
  assert.equal(report.buckets[1].happyPercentage, null);
  assert.equal(report.happyPercentage, 50);
  const summer = await getReport(fixture().db, 'clerk', 'monthly', params({ from: '2026-06-01', to: '2026-06-30' }), pastNow);
  assert.equal(summer.period.start, '2026-05-31T23:00:00.000Z');
  assert.equal(summer.period.endExclusive, '2026-06-30T23:00:00.000Z');
  assert.equal(summer.happyPercentage, 5 / 9 * 100);
});

test('weekly percentages use aggregate counts, not averaged daily percentages', async () => {
  const report = await getReport(fixture().db, 'clerk', 'weekly', params({ week: '2026-06-02' }), pastNow);
  assert.equal(report.period.from, '2026-06-01');
  assert.equal(report.total, 7);
  assert.equal(report.happyPercentage, 4 / 7 * 100);
  assert.equal(report.buckets[0].happyPercentage, 100);
  assert.equal(report.buckets[1].happyPercentage, 0);
  assert.equal(report.buckets[4].happyPercentage, null);
});

test('current week comparison stops at the matching local weekday and time', async () => {
  const report = await getReport(fixture().db, 'clerk', 'weekly', params({ week: '2026-06-10' }), new Date('2026-06-10T11:00:00Z'));
  assert.equal(report.period.effectiveEnd, '2026-06-10T11:00:00.000Z');
  assert.equal(report.comparison?.period.effectiveEnd, '2026-06-03T11:00:00.000Z');
  assert.equal(report.comparison?.summary.total, 5);
  assert.equal(report.comparison?.percentagePointChange, -10);
  assert.equal(report.period.isIncomplete, true);
  assert.equal(previousWeekInstant(new Date('2025-04-02T11:00:00Z')).toISOString(), '2025-03-26T12:00:00.000Z');
});

test('future and zero-response periods never invent percentages or comparisons', async () => {
  const future = await getReport(fixture().db, 'clerk', 'weekly', params({ week: '2027-01-04' }), pastNow);
  assert.equal(future.total, 0); assert.equal(future.happyPercentage, null); assert.equal(future.comparison, null);
  const empty = await getReport(fixture().db, 'clerk', 'weekly', params({ schoolId: 'empty', week: '2026-06-01' }), pastNow);
  assert.equal(empty.comparison?.percentagePointChange, null);
});

test('comparison handles nonexistent and repeated local clock times explicitly', async () => {
  assert.equal(previousWeekInstant(new Date('2025-04-06T00:30:00Z')), null);
  assert.equal(previousWeekInstant(new Date('2025-11-02T01:30:00Z'))?.toISOString(), '2025-10-26T01:30:00.000Z');
  const report = await getReport(fixture().db, 'clerk', 'weekly', params({ week: '2025-04-06' }), new Date('2025-04-06T00:30:00Z'));
  assert.equal(report.comparison, null);
  assert.match(report.comparisonUnavailableReason!, /clocks changed/);
});

test('all-data begins at earliest school response and handles empty schools', async () => {
  const report = await getReport(fixture().db, 'clerk', 'monthly', params({ from: 'all' }), pastNow);
  assert.equal(report.period.from, '2024-01-15');
  assert.equal(report.earliestResponseDate, '2024-01-15');
  assert.equal(report.buckets[0].isIncomplete, true);
  const empty = await getReport(fixture().db, 'clerk', 'monthly', params({ schoolId: 'empty', from: 'all' }), pastNow);
  assert.equal(empty.earliestResponseDate, null);
  assert.equal(empty.total, 0);
});

test('filters normalise malformed ranges and weeks and round-trip through URLs', () => {
  const filters = parseFilters(new URLSearchParams('date=bad&week=2026-06-10&from=2027-01-01&to=2026-01-01&mode=bad'), '2026-09-20');
  assert.equal(filters.date, '2026-09-20'); assert.equal(filters.week, '2026-06-08');
  assert.equal(filters.from, '2026-09-01'); assert.equal(filters.mode, 'counts');
  assert.deepEqual(parseFilters(filterParams(filters)), filters);
  assert.equal(academicStart('2026-02-01'), '2025-09-01');
  assert.equal(monday('2026-09-20'), '2026-09-14');
  assert.equal(londonDate(new Date('2026-06-01T23:30:00Z')), '2026-06-02');
  assert.equal(parseFilters(new URLSearchParams('from=all&to=2026-09-20')).from, 'all');
  const schools = [{ school: { id: 'a', name: 'A' }, isPreferred: false }, { school: { id: 'b', name: 'B' }, isPreferred: true }];
  assert.deepEqual(selectSchool('a', schools), { id: 'a', unavailable: false });
  assert.deepEqual(selectSchool('forbidden', schools), { id: 'b', unavailable: true });
  assert.equal(selectSchool('', schools.slice(0, 1)).id, 'a');
  assert.equal(selectSchool('', []).id, '');
});

test('CSV escapes punctuation, neutralises formulas, and exports all mood counts', async () => {
  assert.equal(csvCell('A,"B"\nC'), '"A,""B""\nC"');
  for (const value of ['=1+1', '+1', '-1', '@SUM(A1)', '\t =1']) assert.ok(csvCell(value).startsWith('"\''));
  assert.equal(csvCell(-5), '"-5"'); assert.equal(csvCell(null), '');
  const report = await getReport(fixture().db, 'clerk', 'daily', params({ date: '2025-03-30' }), pastNow);
  report.school.name = '=HYPERLINK("test")';
  const csv = reportCsv(report);
  assert.ok(csv.includes('"Happy","Okay","Unhappy","Total"'));
  assert.ok(csv.includes('"\'=HYPERLINK(""test"")"'));
  assert.ok(csv.includes('"Europe/London"'));
  assert.equal(csv.split('\r\n').length, 24);
});
