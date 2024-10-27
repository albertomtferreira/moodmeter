// app/api/reports/daily/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseISO, startOfDay, endOfDay } from 'date-fns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const schoolId = searchParams.get('schoolId');
  const dateStr = searchParams.get('date');

  if (!schoolId) {
    return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
  }

  try {
    const date = dateStr ? parseISO(dateStr) : new Date();
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const dailyMoods = await prisma.mood.groupBy({
      by: ['type'],
      where: {
        schoolId,
        timestamp: {
          gte: dayStart,
          lte: dayEnd
        }
      },
      _count: true
    });

    const formattedData = dailyMoods.map(mood => ({
      name: mood.type,
      value: mood._count
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Failed to fetch daily data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily data' },
      { status: 500 }
    );
  }
}