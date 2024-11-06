// app/api/analytics/pwa/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs';
import { AnalyticsMetrics } from '@/types/analytics';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const event = await prisma.pWAInstallationEvent.create({
      data: {
        source: body.source,
        stage: body.stage,
        platform: body.platform,
        errorMessage: body.errorMessage,
        userId: userId,
        deviceInfo: {
          userAgent: req.headers.get('user-agent'),
          language: req.headers.get('accept-language'),
        },
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error recording PWA event:', error);
    return NextResponse.json(
      { error: 'Failed to record PWA event' },
      { status: 500 }
    );
  }
}

// Define valid distinct fields
const distinctFields = ['platform', 'timestamp', 'source', 'stage'] as const;
type ValidDistinctField = typeof distinctFields[number];

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    const searchParams = new URL(req.url).searchParams;
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Count unique attempts
    const totalAttempts = await prisma.pWAInstallationEvent.count({
      where: {
        stage: 'PROMPTED',
        timestamp: { gte: startDate },
      },
      // distinct: prisma.PWAInstallationEventScalarFieldEnum.platform
    });

    const successfulInstalls = await prisma.pWAInstallationEvent.count({
      where: {
        stage: 'COMPLETED',
        timestamp: { gte: startDate },
      },
      // distinct: 'platform'
    });

    // Get unique platforms with completions
    const uniquePlatforms = await prisma.pWAInstallationEvent.findMany({
      where: {
        stage: 'COMPLETED',
        timestamp: { gte: startDate },
      },
      select: {
        platform: true,
      },
      distinct: ['platform'] satisfies ValidDistinctField[]
    });

    // Get unique sources with completions
    const uniqueSources = await prisma.pWAInstallationEvent.findMany({
      where: {
        stage: 'COMPLETED',
        timestamp: { gte: startDate },
      },
      select: {
        source: true,
      },
      distinct: ['source'] satisfies ValidDistinctField[]
    });

    // Get unique dates
    const dates = await prisma.pWAInstallationEvent.findMany({
      where: {
        timestamp: { gte: startDate },
      },
      select: {
        timestamp: true,
      },
      distinct: ['timestamp'] satisfies ValidDistinctField[]
    });

    const uniqueDates = Array.from(
      new Set(
        dates.map(d => d.timestamp.toISOString().split('T')[0])
      )
    ).sort();

    // Daily installations
    const dailyInstalls = await Promise.all(
      uniqueDates.map(async (date) => {
        const dayStart = new Date(date);
        const dayEnd = new Date(date);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const [attempts, completions] = await Promise.all([
          prisma.pWAInstallationEvent.count({
            where: {
              stage: 'PROMPTED',
              timestamp: {
                gte: dayStart,
                lt: dayEnd,
              },
            },
            // distinct: 'platform'
          }),
          prisma.pWAInstallationEvent.count({
            where: {
              stage: 'COMPLETED',
              timestamp: {
                gte: dayStart,
                lt: dayEnd,
              },
            },
            // distinct: 'platform'
          }),
        ]);

        return {
          date,
          attempts,
          completions,
        };
      })
    );

    // Get platform and source breakdowns
    const formattedPlatformBreakdown = await prisma.pWAInstallationEvent.groupBy({
      by: ['platform'],
      where: {
        stage: 'COMPLETED',
        timestamp: { gte: startDate },
      },
      _count: true,
    });

    const formattedSourceBreakdown = await prisma.pWAInstallationEvent.groupBy({
      by: ['source'],
      where: {
        stage: 'COMPLETED',
        timestamp: { gte: startDate },
      },
      _count: true,
    });

    // Error events
    const errorEvents = await prisma.pWAInstallationEvent.count({
      where: {
        stage: 'FAILED',
        timestamp: { gte: startDate },
      },
      // distinct: 'platform'
    });

    const metrics: AnalyticsMetrics = {
      totalAttempts,
      successRate: totalAttempts > 0 ? successfulInstalls / totalAttempts : 0,
      errorRate: totalAttempts > 0 ? errorEvents / totalAttempts : 0,
      platformBreakdown: formattedPlatformBreakdown.map(p => ({
        platform: p.platform,
        count: p._count,
      })),
      sourceBreakdown: formattedSourceBreakdown.map(s => ({
        source: s.source,
        count: s._count,
      })),
      dailyInstalls,
      recentErrors: await prisma.pWAInstallationEvent.findMany({
        where: {
          stage: 'FAILED',
          timestamp: { gte: startDate },
        },
        select: {
          timestamp: true,
          errorMessage: true,
          platform: true,
          source: true,
        },
        orderBy: {
          timestamp: 'desc',
        },
        take: 10,
        distinct: ['platform'] satisfies ValidDistinctField[]
      }),
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Detailed error in PWA analytics:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch PWA analytics',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}