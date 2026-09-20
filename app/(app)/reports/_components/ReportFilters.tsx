"use client";
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { academicStart, monday, shiftDate, validDate } from '@/lib/reports/dates';
import { ReportFilters as Filters } from '@/lib/reports/filters';

const inputClass = 'min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600';
export function DayFilter({ date, today, onChange }: { date: string; today: string; onChange: (date: string) => void }) {
  return <div className="flex flex-wrap items-end gap-2">
    <label className="flex min-w-0 flex-col gap-1 text-xs font-medium">Date<input aria-label="Daily report date" className={inputClass} type="date" value={date} onChange={event => { if (validDate(event.target.value)) onChange(event.target.value); }} /></label>
    <Button variant="outline" size="sm" onClick={() => onChange(today)}>Today</Button><Button variant="outline" size="sm" onClick={() => onChange(shiftDate(today, -1))}>Yesterday</Button>
  </div>;
}
export function WeekFilter({ week, today, onChange }: { week: string; today: string; onChange: (week: string) => void }) {
  return <div className="flex flex-wrap items-end gap-2">
    <label className="flex min-w-0 flex-col gap-1 text-xs font-medium">Week beginning Monday<input aria-label="Weekly report week" className={inputClass} type="date" value={week} onChange={event => { if (validDate(event.target.value)) onChange(monday(event.target.value)); }} /></label>
    <Button variant="outline" size="sm" onClick={() => onChange(monday(today))}>This week</Button><Button variant="outline" size="sm" onClick={() => onChange(shiftDate(monday(today), -7))}>Last week</Button>
  </div>;
}
export function RangeFilter({ filters, today, effectiveFrom, onChange }: {
  filters: Filters; today: string; effectiveFrom?: string; onChange: (range: Pick<Filters, 'from' | 'to'>) => void;
}) {
  const [custom, setCustom] = useState(false);
  const [from, setFrom] = useState(filters.from === 'all' ? effectiveFrom ?? today : filters.from);
  const [to, setTo] = useState(filters.to);
  const [error, setError] = useState('');
  function preset(value: string) {
    if (value === 'custom') { setCustom(true); setError(''); return; }
    setCustom(false);
    const academicYear = Number(academicStart(today).slice(0, 4));
    const ranges: Record<string, { from: string; to: string }> = {
      all: { from: 'all', to: today }, academic: { from: academicStart(today), to: today },
      autumn: { from: `${academicYear}-09-01`, to: `${academicYear}-12-31` },
      spring: { from: `${academicYear + 1}-01-01`, to: `${academicYear + 1}-03-31` },
      summer: { from: `${academicYear + 1}-04-01`, to: `${academicYear + 1}-07-31` },
    };
    onChange(ranges[value]);
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!validDate(from) || !validDate(to) || from > to) { setError('Enter valid dates with the start on or before the end.'); return; }
    setError(''); onChange({ from, to });
  }
  return <div className="min-w-0 space-y-2">
    <label className="flex flex-col gap-1 text-xs font-medium">Monthly range
      <select className={inputClass} aria-label="Monthly report range preset" value={custom ? 'custom' : ''} onChange={event => preset(event.target.value)}>
        <option value="" disabled>{filters.from === 'all' ? 'All data' : `${filters.from} to ${filters.to}`}</option>
        <option value="academic">Academic year to date</option><option value="all">All data</option>
        <option value="autumn">Autumn term</option><option value="spring">Spring term</option><option value="summer">Summer term</option><option value="custom">Custom dates</option>
      </select>
    </label>
    {custom && <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
      <label className="flex flex-col gap-1 text-xs">From<input aria-label="Monthly start date" className={inputClass} type="date" required value={from} onChange={event => setFrom(event.target.value)} /></label>
      <label className="flex flex-col gap-1 text-xs">To<input aria-label="Monthly end date" className={inputClass} type="date" required value={to} onChange={event => setTo(event.target.value)} /></label>
      <Button type="submit" size="sm">Apply dates</Button>
      {error && <p role="alert" className="w-full text-sm text-red-700">{error}</p>}
    </form>}
  </div>;
}
