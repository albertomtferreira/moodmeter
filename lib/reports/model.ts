import { formatInTimeZone } from 'date-fns-tz';
import { localStart, nextMonth, shiftDate } from './dates';
import { AggregateRow, MoodCounts, ReportBucket, ReportKind, ReportPeriod, ReportSummary, REPORT_TIMEZONE } from './types';

export const emptyCounts = (): MoodCounts => ({ HAPPY: 0, OKAY: 0, UNHAPPY: 0 });
export function summarise(counts: MoodCounts): ReportSummary {
  const total = counts.HAPPY + counts.OKAY + counts.UNHAPPY;
  return { counts, total, happyPercentage: total ? counts.HAPPY / total * 100 : null };
}
export function sumBuckets(buckets: ReportSummary[]) {
  return summarise(buckets.reduce((counts, bucket) => ({
    HAPPY: counts.HAPPY + bucket.counts.HAPPY,
    OKAY: counts.OKAY + bucket.counts.OKAY,
    UNHAPPY: counts.UNHAPPY + bucket.counts.UNHAPPY,
  }), emptyCounts()));
}
export function makePeriod(from: string, to: string, now: Date, cutoff = now): ReportPeriod {
  const start = localStart(from);
  const end = localStart(shiftDate(to, 1));
  return {
    from, to, start: start.toISOString(), endExclusive: end.toISOString(),
    effectiveEnd: new Date(Math.max(+start, Math.min(+end, +cutoff))).toISOString(),
    isIncomplete: +end > +now || +cutoff < +end,
  };
}
export function makeBuckets(kind: ReportKind, period: ReportPeriod, rows: AggregateRow[], now: Date): ReportBucket[] {
  const counts = new Map<string, MoodCounts>();
  rows.forEach(row => {
    const value = counts.get(row.id) ?? emptyCounts();
    value[row.type] += Number(row.count);
    counts.set(row.id, value);
  });
  const buckets: ReportBucket[] = [];
  const periodStart = new Date(period.start);
  const periodEnd = new Date(period.endExclusive);
  let start = kind === 'monthly' ? localStart(`${period.from.slice(0, 7)}-01`) : periodStart;
  while (+start < +periodEnd) {
    const date = formatInTimeZone(start, REPORT_TIMEZONE, 'yyyy-MM-dd');
    const end = kind === 'daily' ? new Date(+start + 3600000)
      : localStart(kind === 'weekly' ? shiftDate(date, 1) : nextMonth(date));
    const id = kind === 'daily' ? start.toISOString() : kind === 'weekly' ? date : date.slice(0, 7);
    const label = formatInTimeZone(start, REPORT_TIMEZONE,
      kind === 'daily' ? 'HH:mm xxx' : kind === 'weekly' ? 'EEE d MMM' : 'MMM yyyy');
    buckets.push({
      id, label, start: start.toISOString(), endExclusive: end.toISOString(),
      isIncomplete: +end > +now || +start < +periodStart || +end > +periodEnd || +end > +new Date(period.effectiveEnd),
      ...summarise(counts.get(id) ?? emptyCounts()),
    });
    start = end;
  }
  return buckets;
}
