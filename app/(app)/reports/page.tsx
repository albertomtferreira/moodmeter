"use client";
import { Suspense, useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReport, useReportSchools } from '@/hooks/useReport';
import { londonDate } from '@/lib/reports/dates';
import { filterParams, parseFilters, ReportFilters, selectSchool } from '@/lib/reports/filters';
import { MoodBars, MoodDistribution, MonthlyTrend, SubmissionBars } from './_components/ReportCharts';
import { ReportSection, usableReport, WeeklySummary } from './_components/ReportSection';
import { DayFilter, RangeFilter, WeekFilter } from './_components/ReportFilters';

function ReportsContent() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const params = useSearchParams();
  const today = londonDate();
  const filters = parseFilters(new URLSearchParams(params.toString()), today);
  const schools = useReportSchools(userId, Boolean(isLoaded && isSignedIn));
  const selection = selectSchool(filters.school, schools.data ?? []);
  const school = selection.id;
  const enabled = Boolean(isSignedIn && schools.isSuccess && school);
  const daily = useReport(userId, school, 'daily', `date=${filters.date}`, enabled);
  const weekly = useReport(userId, school, 'weekly', `week=${filters.week}`, enabled);
  const monthly = useReport(userId, school, 'monthly', `from=${filters.from}&to=${filters.to}`, enabled);
  const [notice, setNotice] = useState('');
  const canonical = filterParams({ ...filters, school }, new URLSearchParams(params.toString())).toString();
  const current = params.toString();
  useEffect(() => {
    if (!schools.isSuccess) return;
    if (selection.unavailable) setNotice(`The school in this link is not available to your account.${school ? ' Showing an assigned school instead.' : ' No schools are currently assigned.'}`);
    if (canonical !== current) window.history.replaceState(null, '', `${window.location.pathname}?${canonical}${window.location.hash}`);
  }, [canonical, current, schools.isSuccess, selection.unavailable, school]);

  function change(updates: Partial<ReportFilters>) {
    if (updates.school) setNotice('');
    const next = filterParams({ ...filters, school, ...updates }, new URLSearchParams(params.toString()));
    window.history.pushState(null, '', `${window.location.pathname}?${next}${window.location.hash}`);
  }
  const refreshing = daily.isFetching || weekly.isFetching || monthly.isFetching;
  if (!isLoaded) return <p className="p-6" role="status">Loading reports…</p>;
  if (!isSignedIn) return <div className="p-6"><h1 className="mb-4 text-3xl font-bold">Reports</h1><Link className="underline" href="/sign-in">Sign in to view your school reports</Link></div>;

  return <div className="mx-auto max-w-7xl space-y-6 p-4 pb-12 sm:p-6">
    <header>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Reports</h1>
      <p className="mt-2 text-sm text-slate-600">Understand feedback across your school. All dates and times use Europe/London.</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex min-w-0 flex-col gap-1 text-sm font-medium sm:w-96">School
          <select aria-label="Report school" value={school} disabled={!schools.data?.length} onChange={event => change({ school: event.target.value })} className="w-full min-w-0 truncate rounded-md border border-slate-300 bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600">
            {!schools.data?.length && <option value="">{schools.isPending ? 'Loading schools…' : 'No school available'}</option>}
            {schools.data?.map(item => <option key={item.school.id} value={item.school.id}>{item.school.name}</option>)}
          </select>
        </label>
        <Button variant="outline" className="bg-white" aria-label="Refresh all reports" disabled={!enabled || refreshing} onClick={() => { void daily.refetch(); void weekly.refetch(); void monthly.refetch(); }}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" />{refreshing ? 'Updating reports…' : 'Refresh reports'}
        </Button>
      </div>
    </header>
    {notice && <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">{notice}</p>}
    {schools.isError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4"><p>{schools.error.message}</p><Button className="mt-2" variant="outline" onClick={() => schools.refetch()}>Retry schools</Button></div>}
    {schools.isPending && <p role="status">Loading your assigned schools…</p>}
    {schools.isSuccess && !school && <div className="rounded-xl border bg-white p-8"><h2 className="font-semibold">No schools assigned</h2><p className="mt-2 text-sm text-slate-600">Ask your administrator to assign a school to your account to view reports.</p></div>}
    {enabled && <>
      <WeeklySummary query={weekly} />
      <ReportSection title="Daily analysis" query={daily} controls={<DayFilter date={filters.date} today={today} onChange={date => change({ date })} />}>
        {report => <div className="grid gap-6 lg:grid-cols-5"><div className="min-w-0 lg:col-span-2"><MoodDistribution report={report} /></div><div className="min-w-0 lg:col-span-3"><MoodBars key={school} report={report} /></div></div>}
      </ReportSection>
      <ReportSection title="Weekly analysis" query={weekly} controls={<WeekFilter week={filters.week} today={today} onChange={week => change({ week })} />}>
        {report => <div className="grid gap-6 lg:grid-cols-2"><MoodBars key={school} report={report} mode={filters.mode} setMode={mode => change({ mode })} /><SubmissionBars report={report} /></div>}
      </ReportSection>
      <ReportSection title="Monthly analysis" query={monthly} controls={<RangeFilter key={`${school}:${filters.from}:${filters.to}`} filters={filters} today={today} effectiveFrom={usableReport(monthly)?.period.from} onChange={change} />}>
        {report => <MonthlyTrend report={report} />}
      </ReportSection>
    </>}
  </div>;
}
export default function ReportsPage() {
  return <div data-reports-page><Suspense fallback={<p className="p-6" role="status">Loading reports…</p>}><ReportsContent /></Suspense></div>;
}
