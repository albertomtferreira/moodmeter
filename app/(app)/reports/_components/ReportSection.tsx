"use client";
import { ReactNode } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { formatInTimeZone } from 'date-fns-tz';
import { Button } from '@/components/ui/button';
import { ReportFetchError } from '@/hooks/useReport';
import { reportCsv } from '@/lib/reports/csv';
import { displayDate } from '@/lib/reports/dates';
import { Report, REPORT_TIMEZONE } from '@/lib/reports/types';
import { percentage } from './ReportCharts';

export function usableReport(query: UseQueryResult<Report, Error>) {
  return query.error instanceof ReportFetchError && [401, 403].includes(query.error.status) ? undefined : query.data;
}
function download(report: Report) {
  const url = URL.createObjectURL(new Blob([reportCsv(report)], { type: 'text/csv;charset=utf-8;' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${report.kind}-${report.school.id}-${report.period.from}-${report.period.to}.csv`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function ReportTable({ report }: { report: Report }) {
  return <details className="mt-6 rounded-lg border border-slate-200">
    <summary className="cursor-pointer rounded-lg p-3 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600">View data · {report.buckets.length} {report.kind === 'daily' ? 'hours' : report.kind === 'weekly' ? 'days' : 'months'}</summary>
    <div className="overflow-x-auto p-3" tabIndex={0} role="region" aria-label={`${report.kind} report data`}>
      <table className="w-full text-left text-sm tabular-nums">
        <caption className="pb-3 text-left text-slate-600">{report.school.name} · {displayDate(report.period.from)} – {displayDate(report.period.to)} · Europe/London. Partial periods are marked below.</caption>
        <thead><tr>{['Period', 'Happy', 'Okay', 'Unhappy', 'Total', 'Happy (%)', 'Status'].map(label => <th key={label} scope="col" className="whitespace-nowrap border-b p-2">{label}</th>)}</tr></thead>
        <tbody>{report.buckets.map(bucket => <tr key={bucket.id} className="border-b border-slate-100">
          <th scope="row" className="whitespace-nowrap p-2 font-normal">{bucket.label}</th>
          <td className="p-2">{bucket.counts.HAPPY.toLocaleString()}</td><td className="p-2">{bucket.counts.OKAY.toLocaleString()}</td><td className="p-2">{bucket.counts.UNHAPPY.toLocaleString()}</td>
          <td className="p-2">{bucket.total.toLocaleString()}</td><td className="p-2">{percentage(bucket.happyPercentage)}</td>
          <td className="whitespace-nowrap p-2">{bucket.isIncomplete ? 'Partial / not complete' : bucket.total ? 'Complete' : 'No responses'}</td>
        </tr>)}</tbody>
        <tfoot><tr className="font-semibold"><th scope="row" className="p-2">Total</th><td className="p-2">{report.counts.HAPPY.toLocaleString()}</td><td className="p-2">{report.counts.OKAY.toLocaleString()}</td><td className="p-2">{report.counts.UNHAPPY.toLocaleString()}</td><td className="p-2">{report.total.toLocaleString()}</td><td className="p-2">{percentage(report.happyPercentage)}</td><td /></tr></tfoot>
      </table>
    </div>
  </details>;
}
export function ReportSection({ title, query, controls, children }: {
  title: string; query: UseQueryResult<Report, Error>; controls: ReactNode; children: (report: Report) => ReactNode;
}) {
  const report = usableReport(query);
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6" aria-label={title} aria-busy={query.isFetching}>
    <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {controls}
    </div>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-slate-600" role="status">
        {report ? <>{report.total.toLocaleString()} responses · {report.period.isIncomplete ? 'Partial period · ' : ''}
          {query.isFetching ? 'Updating…' : `Updated ${formatInTimeZone(report.generatedAt, REPORT_TIMEZONE, 'd MMM yyyy, HH:mm:ss')}`}</> : query.isPending ? 'Loading report…' : 'Report unavailable'}
      </p>
      <Button size="sm" variant="outline" disabled={!report || query.isFetching || query.isError} onClick={() => report && download(report)} aria-label={`Download ${title.toLowerCase()} CSV`}>Download CSV</Button>
    </div>
    {query.isError && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
      <p>{query.error.message}{report ? ' Showing the last successful result.' : ''}</p>
      <Button size="sm" variant="outline" className="mt-2" disabled={query.isFetching} onClick={() => query.refetch()}>Retry {title.toLowerCase()}</Button>
    </div>}
    {!report && query.isPending && <div aria-label={`Loading ${title.toLowerCase()}`} className="h-80 animate-pulse rounded-lg bg-slate-100" />}
    {report && <>
      {!report.total ? <div className="rounded-lg bg-slate-50 px-4 py-12 text-center"><p className="font-medium">No responses for this period</p><p className="mt-1 text-sm text-slate-600">Choose another date or check back after submissions arrive.</p></div> : children(report)}
      <ReportTable report={report} />
    </>}
  </section>;
}
export function WeeklySummary({ query }: { query: UseQueryResult<Report, Error> }) {
  const report = usableReport(query);
  if (!report) return <section aria-label="Selected week summary" className="rounded-xl border bg-white p-4 text-sm text-slate-600" role="status">{query.isError ? 'Weekly summary unavailable. Retry the weekly report below.' : 'Loading selected week summary…'}</section>;
  const change = report.comparison?.percentagePointChange;
  const future = report.period.start > report.generatedAt;
  return <section aria-label="Selected week summary">
    <h2 className="text-lg font-semibold">Your selected week</h2>
    <p className="mb-3 text-sm text-slate-600">{displayDate(report.period.from)} – {displayDate(report.period.to)} · {report.school.name}
      {future ? ' · Future week' : report.period.isIncomplete ? ` · Through ${formatInTimeZone(report.period.effectiveEnd, REPORT_TIMEZONE, 'd MMM, HH:mm')}` : ''}
      {query.isFetching ? ' · Updating…' : query.isError ? ' · Refresh failed; showing last successful result' : ''}</p>
    <div className="grid gap-3 sm:grid-cols-3">
      {[
        ['Responses', report.total.toLocaleString(), 'Submissions, not unique pupils'],
        ['Happy responses', percentage(report.happyPercentage), `${report.counts.HAPPY.toLocaleString()} of ${report.total.toLocaleString()} responses`],
        ['Change vs previous week', change === null || change === undefined ? '—' : `${change > 0 ? '+' : ''}${change.toFixed(1)} pp`, report.comparison ? `${report.comparison.summary.total.toLocaleString()} previous responses · ${percentage(report.comparison.summary.happyPercentage)} happy` : report.comparisonUnavailableReason ?? 'No comparison for a future week'],
      ].map(([label, value, detail]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-4"><h3 className="text-sm font-medium text-slate-600">{label}</h3><p className="my-2 text-3xl font-semibold tabular-nums">{value}</p><p className="text-xs text-slate-600">{detail}</p></div>)}
    </div>
    <p className="mt-2 text-xs text-slate-600">Happy responses ÷ all responses × 100. {report.comparison ? `Compared with ${displayDate(report.comparison.period.from)} – ${displayDate(report.comparison.period.to)}${report.period.isIncomplete ? ` through ${formatInTimeZone(report.comparison.period.effectiveEnd, REPORT_TIMEZONE, 'EEE HH:mm')} (matching weekday and local time)` : ''}.` : ''} A change requires responses in both periods.</p>
  </section>;
}
