import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ReportError } from './access';
import { getComparison, getReport } from './service';
import { ReportKind } from './types';

export function reportHandler(kind: ReportKind | 'comparison') {
  return async (request: Request) => {
    try {
      const { userId } = await auth();
      const result = kind === 'comparison' ? await getComparison(prisma, userId)
        : await getReport(prisma, userId, kind, new URL(request.url).searchParams);
      return NextResponse.json(result, { headers: { 'Cache-Control': 'private, no-store' } });
    } catch (error) {
      if (error instanceof ReportError) return NextResponse.json({ error: error.message }, { status: error.status });
      console.error(`Failed to load ${kind} report`, error);
      return NextResponse.json({ error: 'Unable to load this report. Please try again.' }, { status: 500 });
    }
  };
}
