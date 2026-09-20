export const REPORT_TIMEZONE = 'Europe/London';
export const MOODS = ['HAPPY', 'OKAY', 'UNHAPPY'] as const;
export type Mood = typeof MOODS[number];
export type ReportKind = 'daily' | 'weekly' | 'monthly';
export type MoodCounts = Record<Mood, number>;
export interface ReportSummary {
  counts: MoodCounts;
  total: number;
  happyPercentage: number | null;
}
export interface ReportBucket extends ReportSummary {
  id: string;
  label: string;
  start: string;
  endExclusive: string;
  isIncomplete: boolean;
}
export interface ReportPeriod {
  from: string;
  to: string;
  start: string;
  endExclusive: string;
  effectiveEnd: string;
  isIncomplete: boolean;
}
export interface Report extends ReportSummary {
  kind: ReportKind;
  school: { id: string; name: string };
  timezone: typeof REPORT_TIMEZONE;
  generatedAt: string;
  period: ReportPeriod;
  earliestResponseDate?: string | null;
  buckets: ReportBucket[];
  comparisonUnavailableReason?: string;
  comparison?: {
    period: ReportPeriod;
    summary: ReportSummary;
    percentagePointChange: number | null;
  } | null;
}
export interface AggregateRow { id: string; type: Mood; count: bigint | number }
