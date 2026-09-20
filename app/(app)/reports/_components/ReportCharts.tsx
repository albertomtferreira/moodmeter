"use client";
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Mood, MOODS, Report, ReportBucket } from '@/lib/reports/types';

const colors: Record<Mood, string> = { HAPPY: '#15803d', OKAY: '#b45309', UNHAPPY: '#be123c' };
const names: Record<Mood, string> = { HAPPY: 'Happy', OKAY: 'Okay', UNHAPPY: 'Unhappy' };
export const percentage = (value: number | null) => value === null ? '—' : `${value.toFixed(1)}%`;

function BucketTooltip({ active, payload }: { active?: boolean; payload?: ReadonlyArray<{ payload?: ReportBucket }> }) {
  const bucket = payload?.[0]?.payload;
  if (!active || !bucket) return null;
  return <div className="rounded-lg border bg-white p-3 text-sm shadow-md">
    <p className="font-semibold">{bucket.label}{bucket.isIncomplete ? ' · Partial period' : ''}</p>
    {MOODS.map(mood => <p key={mood}>{names[mood]}: {bucket.counts[mood].toLocaleString()}</p>)}
    <p className="font-semibold">Total: {bucket.total.toLocaleString()}</p>
    <p>Happy responses: {percentage(bucket.happyPercentage)}</p>
  </div>;
}

export function MoodDistribution({ report }: { report: Report }) {
  const data = MOODS.map(mood => ({ name: names[mood], value: report.counts[mood], mood }));
  return <div>
    <h3 className="mb-3 font-semibold">Daily feedback</h3>
    <div role="img" aria-label={`Daily feedback: ${data.map(item => `${item.name} ${item.value}`).join(', ')}. Data table below.`}>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart accessibilityLayer>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} isAnimationActive={false}>
            {data.map(item => <Cell key={item.mood} fill={colors[item.mood]} />)}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} responses`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
      {data.map(item => <li key={item.mood}>{item.name}: <strong>{item.value.toLocaleString()}</strong> ({percentage(report.total ? item.value / report.total * 100 : null)})</li>)}
    </ul>
  </div>;
}

export function MoodBars({ report, mode = 'counts', setMode }: {
  report: Report; mode?: 'counts' | 'percentages'; setMode?: (mode: 'counts' | 'percentages') => void;
}) {
  const [visible, setVisible] = useState<Mood[]>([...MOODS]);
  const percent = mode === 'percentages';
  const data = report.buckets.map(bucket => ({ ...bucket, ...Object.fromEntries(MOODS.flatMap(mood => [
    [mood, percent ? bucket.total ? bucket.counts[mood] / bucket.total * 100 : null : bucket.counts[mood]],
    [`totalLabel${mood}`, [...MOODS].reverse().find(value => bucket.counts[value] > 0) === mood ? bucket.total : null],
  ])) }));
  return <div className="min-w-0">
    <h3 className="mb-3 font-semibold">{report.kind === 'daily' ? 'Feedback across the whole day' : 'Weekly feedback'}</h3>
    {setMode && <div className="mb-3 flex gap-2" role="group" aria-label="Weekly chart units">
      {(['counts', 'percentages'] as const).map(value => <Button key={value} size="sm" variant={mode === value ? 'default' : 'outline'} aria-pressed={mode === value} onClick={() => setMode(value)}>{value === 'counts' ? 'Counts' : 'Percentages'}</Button>)}
    </div>}
    <div className="mb-2 flex flex-wrap gap-2" role="group" aria-label={`${report.kind} chart mood visibility`}>
      {MOODS.map(mood => <Button key={mood} size="sm" variant="outline" aria-pressed={visible.includes(mood)} onClick={() => setVisible(current => current.includes(mood) ? current.filter(item => item !== mood) : [...current, mood])}>
        <span aria-hidden="true" className="mr-2 h-2 w-2 rounded-full" style={{ background: colors[mood], opacity: visible.includes(mood) ? 1 : .25 }} />
        {names[mood]} {visible.includes(mood) ? 'shown' : 'hidden'}
      </Button>)}
    </div>
    <p className="mb-2 text-xs text-slate-600">{percent ? 'Percentage of all responses' : 'Number of responses'} · Full counts are available in View data.</p>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} accessibilityLayer margin={{ top: 20, right: 8, bottom: 15, left: -15 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} minTickGap={20} interval={report.kind === 'weekly' ? 0 : 'preserveStartEnd'} tickFormatter={value => String(value).slice(0, report.kind === 'daily' ? 5 : 3)} />
        <YAxis allowDecimals={percent} domain={percent ? [0, 100] : [0, 'auto']} tickFormatter={value => percent ? `${value}%` : String(value)} />
        <Tooltip content={<BucketTooltip />} />
        {MOODS.filter(mood => visible.includes(mood)).map(mood => <Bar key={mood} dataKey={mood} name={names[mood]} stackId="moods" fill={colors[mood]} isAnimationActive={false}>
          {!percent && report.kind === 'daily' && visible.length === 3 && <LabelList dataKey={`totalLabel${mood}`} position="top" fontSize={10} formatter={value => Number(value) > 0 ? String(value) : ''} />}
        </Bar>)}
      </BarChart>
    </ResponsiveContainer>
    {report.kind === 'daily' && <p className="text-xs text-slate-600">Hourly buckets in Europe/London. Tooltips and the table include UTC offsets to distinguish repeated clock hours.</p>}
  </div>;
}

export function SubmissionBars({ report }: { report: Report }) {
  return <div className="min-w-0">
    <h3 className="mb-3 font-semibold">Daily submissions</h3>
    <p className="mb-2 text-xs text-slate-600">All mood responses combined</p>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={report.buckets} accessibilityLayer margin={{ top: 20, right: 8, bottom: 15, left: -15 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} tickFormatter={value => String(value).slice(0, 3)} />
        <YAxis allowDecimals={false} />
        <Tooltip content={<BucketTooltip />} />
        <Bar dataKey="total" name="Responses" fill="#4338ca" radius={[4, 4, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  </div>;
}

export function MonthlyTrend({ report }: { report: Report }) {
  return <div>
    <h3 className="font-semibold">Happy responses (%)</h3>
    <p className="mb-4 text-sm text-slate-600">Happy responses ÷ all responses × 100. Gaps indicate months with no responses; * marks a partial month.</p>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={report.buckets.map(bucket => ({ ...bucket, axisLabel: bucket.label + (bucket.isIncomplete ? '*' : '') }))} accessibilityLayer margin={{ right: 20, top: 10, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="axisLabel" tick={{ fontSize: 12 }} minTickGap={24} />
        <YAxis domain={[0, 100]} tickFormatter={value => `${value}%`} />
        <Tooltip content={<BucketTooltip />} />
        <Line type="linear" dataKey="happyPercentage" name="Happy responses" stroke="#15803d" strokeWidth={2} connectNulls={false} dot={{ r: 4 }} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>;
}
