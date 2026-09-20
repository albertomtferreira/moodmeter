import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import { REPORT_TIMEZONE } from './types';

export function validDate(value: string | null | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value < '1000-01-01' || value > '9998-12-31') return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export const londonDate = (date = new Date()) => formatInTimeZone(date, REPORT_TIMEZONE, 'yyyy-MM-dd');
export const localStart = (date: string) => fromZonedTime(`${date}T00:00:00`, REPORT_TIMEZONE);
export const displayDate = (date: string) => formatInTimeZone(localStart(date), REPORT_TIMEZONE, 'd MMM yyyy');
export function shiftDate(date: string, days: number) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
export function monday(date: string) {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay();
  return shiftDate(date, -((day + 6) % 7));
}
export function nextMonth(date: string) {
  const value = new Date(`${date.slice(0, 7)}-01T00:00:00Z`);
  value.setUTCMonth(value.getUTCMonth() + 1);
  return value.toISOString().slice(0, 10);
}
export function academicStart(today: string) {
  const year = Number(today.slice(0, 4)) - (today.slice(5, 7) < '09' ? 1 : 0);
  return `${year}-09-01`;
}
export function previousWeekInstant(now: Date) {
  const pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS";
  const time = formatInTimeZone(now, REPORT_TIMEZONE, 'HH:mm:ss.SSS');
  const wallTime = `${shiftDate(londonDate(now), -7)}T${time}`;
  const candidate = fromZonedTime(wallTime, REPORT_TIMEZONE);
  const matches = [-3600000, 0, 3600000].map(offset => new Date(+candidate + offset))
    .filter(date => formatInTimeZone(date, REPORT_TIMEZONE, pattern) === wallTime);
  // A spring-forward clock time may not exist. Do not invent a comparison cutoff.
  // For a repeated autumn hour prefer the offset used by the selected week's cutoff.
  return matches.find(date => formatInTimeZone(date, REPORT_TIMEZONE, 'xxx') === formatInTimeZone(now, REPORT_TIMEZONE, 'xxx')) ?? matches[0] ?? null;
}
