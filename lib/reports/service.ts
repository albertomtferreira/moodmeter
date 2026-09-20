import { Prisma, PrismaClient } from '@prisma/client';
import { academicStart, localStart, londonDate, monday, previousWeekInstant, shiftDate, validDate } from './dates';
import { ReportError, reportSchool, reportUser } from './access';
import { makeBuckets, makePeriod, sumBuckets } from './model';
import { AggregateRow, Report, ReportKind, REPORT_TIMEZONE } from './types';

function dateParam(value: string | null, fallback: string) {
  if (value === null) return fallback;
  if (!validDate(value)) throw new ReportError(400, 'Use valid dates in YYYY-MM-DD format.');
  return value;
}

// Prisma DateTime uses a PostgreSQL timestamp without time zone, storing UTC.
// Only static fragments select the grouping; request values remain parameters.
export async function aggregate(db: PrismaClient, schoolId: string, kind: ReportKind, start: string, end: string) {
  if (end <= start) return [];
  const london = Prisma.sql`("timestamp" AT TIME ZONE 'UTC') AT TIME ZONE 'Europe/London'`;
  const key = kind === 'daily'
    ? Prisma.sql`to_char("timestamp", 'YYYY-MM-DD"T"HH24:00:00.000"Z"')`
    : kind === 'weekly' ? Prisma.sql`to_char(${london}, 'YYYY-MM-DD')`
      : Prisma.sql`to_char(${london}, 'YYYY-MM')`;
  return db.$queryRaw<AggregateRow[]>(Prisma.sql`
    SELECT ${key} AS id, "type", COUNT(*) AS count
    FROM "Mood"
    WHERE "schoolId" = ${schoolId}
      AND "timestamp" >= ${new Date(start)}::timestamp
      AND "timestamp" < ${new Date(end)}::timestamp
    GROUP BY 1, 2 ORDER BY 1
  `);
}

export async function getReport(db: PrismaClient, clerkId: string | null, kind: ReportKind, params: URLSearchParams, now = new Date()): Promise<Report> {
  const school = await reportSchool(db, clerkId, params.get('schoolId'));
  const today = londonDate(now);
  let from: string;
  let to: string;
  let earliestResponseDate: string | null | undefined;
  if (kind === 'daily') {
    from = to = dateParam(params.get('date'), today);
  } else if (kind === 'weekly') {
    from = monday(dateParam(params.get('week'), today));
    to = shiftDate(from, 6);
  } else {
    to = dateParam(params.get('to'), today);
    if (params.get('from') === 'all') {
      const earliest = await db.mood.aggregate({ where: { schoolId: school.id }, _min: { timestamp: true } });
      earliestResponseDate = earliest._min.timestamp ? londonDate(earliest._min.timestamp) : null;
      from = earliestResponseDate ?? to;
    } else from = dateParam(params.get('from'), academicStart(today));
    if (from > to) throw new ReportError(400, 'Start date must not be after end date.');
  }
  const period = makePeriod(from, to, now);
  const rows = await aggregate(db, school.id, kind, period.start, period.effectiveEnd);
  const buckets = makeBuckets(kind, period, rows, now);
  const summary = sumBuckets(buckets);
  const report: Report = {
    kind, school, timezone: REPORT_TIMEZONE, generatedAt: now.toISOString(), period,
    ...summary, buckets, ...(kind === 'monthly' ? { earliestResponseDate } : {}),
  };
  if (kind === 'weekly') {
    report.comparison = null;
    if (+localStart(from) <= +now) {
      const cutoff = period.isIncomplete ? previousWeekInstant(now) : localStart(from);
      if (!cutoff) {
        report.comparisonUnavailableReason = 'No matching local time in the previous week because the clocks changed.';
        return report;
      }
      const previous = makePeriod(shiftDate(from, -7), shiftDate(to, -7), now, cutoff);
      const previousRows = await aggregate(db, school.id, kind, previous.start, previous.effectiveEnd);
      const previousSummary = sumBuckets(makeBuckets(kind, previous, previousRows, now));
      report.comparison = {
        period: previous, summary: previousSummary,
        percentagePointChange: summary.happyPercentage === null || previousSummary.happyPercentage === null
          ? null : summary.happyPercentage - previousSummary.happyPercentage,
      };
    }
  }
  return report;
}

export async function getComparison(db: PrismaClient, clerkId: string | null, now = new Date()) {
  const user = await reportUser(db, clerkId);
  const memberships = await db.schoolUser.findMany({
    where: { userId: user.id, school: { isActive: true } },
    select: { school: { select: { id: true, name: true } } },
  });
  const end = now.toISOString();
  const start = localStart(shiftDate(londonDate(now), -29)).toISOString();
  return Promise.all(memberships.map(async ({ school }) => {
    const rows = await aggregate(db, school.id, 'monthly', start, end);
    const period = makePeriod(shiftDate(londonDate(now), -29), londonDate(now), now);
    const summary = sumBuckets(makeBuckets('monthly', period, rows, now));
    return { schoolId: school.id, name: school.name, Satisfaction: summary.happyPercentage, total: summary.total };
  }));
}
