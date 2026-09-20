import { academicStart, londonDate, monday, validDate } from './dates';

export interface ReportFilters {
  school: string;
  date: string;
  week: string;
  from: string;
  to: string;
  mode: 'counts' | 'percentages';
}
export interface AssignedSchool { school: { id: string; name: string }; isPreferred: boolean }
export function parseFilters(params: URLSearchParams, today = londonDate()): ReportFilters {
  const from = params.get('from');
  const to = params.get('to');
  const validRange = (from === 'all' || validDate(from)) && validDate(to) && (from === 'all' || from <= to);
  return {
    school: params.get('school') ?? '',
    date: validDate(params.get('date')) ? params.get('date')! : today,
    week: monday(validDate(params.get('week')) ? params.get('week')! : today),
    from: validRange ? from! : academicStart(today),
    to: validRange ? to! : today,
    mode: params.get('mode') === 'percentages' ? 'percentages' : 'counts',
  };
}
export function selectSchool(requested: string, schools: AssignedSchool[]) {
  const match = schools.find(item => item.school.id === requested);
  return {
    id: (match ?? schools.find(item => item.isPreferred) ?? schools[0])?.school.id ?? '',
    unavailable: Boolean(requested && !match),
  };
}
export function filterParams(filters: ReportFilters, existing = new URLSearchParams()) {
  const params = new URLSearchParams(existing);
  Object.entries(filters).forEach(([key, value]) => value ? params.set(key, value) : params.delete(key));
  return params;
}
