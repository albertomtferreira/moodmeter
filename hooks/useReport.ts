"use client";
import { useQuery } from '@tanstack/react-query';
import { AssignedSchool } from '@/lib/reports/filters';
import { Report, ReportKind } from '@/lib/reports/types';

export class ReportFetchError extends Error {
  constructor(message: string, public status: number) { super(message); }
}
export async function fetchReportJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal, cache: 'no-store' });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ReportFetchError(body?.error || 'Unable to load data. Please try again.', response.status);
  }
  return response.json();
}
const options = {
  staleTime: 60_000,
  refetchInterval: false as const,
  refetchOnWindowFocus: false,
  retry: (failures: number, error: Error) => failures < 1 && (!(error instanceof ReportFetchError) || error.status >= 500),
};
export function useReportSchools(userId: string | undefined | null, enabled: boolean) {
  return useQuery({
    ...options, queryKey: ['report-schools', userId], enabled,
    queryFn: ({ signal }) => fetchReportJson<AssignedSchool[]>('/api/users/schools', signal),
  });
}
export function reportQueryKey(userId: string | null | undefined, school: string, kind: ReportKind, params: string) {
  return ['reports', userId, school, kind, params] as const;
}
export function useReport(userId: string | undefined | null, school: string, kind: ReportKind, params: string, enabled: boolean) {
  return useQuery(reportQueryOptions(userId, school, kind, params, enabled));
}
export function reportQueryOptions(userId: string | undefined | null, school: string, kind: ReportKind, params: string, enabled: boolean) {
  return {
    ...options, queryKey: reportQueryKey(userId, school, kind, params), enabled: enabled && Boolean(school),
    queryFn: ({ signal }: { signal: AbortSignal }) => fetchReportJson<Report>(`/api/reports/${kind}?schoolId=${encodeURIComponent(school)}&${params}`, signal),
  };
}
