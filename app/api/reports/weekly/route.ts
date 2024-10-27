// app/api/reports/weekly/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const schoolId = searchParams.get('schoolId');

  if (!schoolId) {
    return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
  }

  try {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const weeklyMoods = await prisma.mood.findMany({
      where: {
        schoolId,
        timestamp: {
          gte: weekStart
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    });

    const groupedByDay = weeklyMoods.reduce((acc, mood) => {
      const day = mood.timestamp.toLocaleDateString('en-US', { weekday: 'short' });
      if (!acc[day]) {
        acc[day] = { Happy: 0, Okay: 0, Unhappy: 0 };
      }
      acc[day][mood.type]++;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    const formattedData = Object.entries(groupedByDay).map(([name, data]) => ({
      name,
      ...data
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch weekly data' }, { status: 500 });
  }
}