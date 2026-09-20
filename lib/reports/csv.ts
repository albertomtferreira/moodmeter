import { Report } from './types';

export function csvCell(value: string | number | null) {
  if (value === null) return '';
  let text = String(value);
  if (typeof value === 'string' && /^[\s\u0000-\u001f]*[=+@-]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}
export function reportCsv(report: Report) {
  const header = ['School', 'School ID', 'Timezone', 'Report', 'From', 'To', 'Data through (exclusive)', 'Generated at', 'Bucket ID', 'Label', 'Happy', 'Okay', 'Unhappy', 'Total', 'Happy responses (%)', 'Incomplete'];
  const rows = report.buckets.map(bucket => [
    report.school.name, report.school.id, report.timezone, report.kind,
    report.period.from, report.period.to, report.period.effectiveEnd, report.generatedAt,
    bucket.id, bucket.label, bucket.counts.HAPPY, bucket.counts.OKAY, bucket.counts.UNHAPPY,
    bucket.total, bucket.happyPercentage === null ? null : Number(bucket.happyPercentage.toFixed(1)),
    bucket.isIncomplete ? 'Yes' : 'No',
  ]);
  return '\uFEFF' + [header, ...rows].map(row => row.map(csvCell).join(',')).join('\r\n');
}
