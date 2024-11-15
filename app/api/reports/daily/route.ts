// app/api/reports/daily/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseISO, startOfDay, endOfDay, format } from 'date-fns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const schoolId = searchParams.get('schoolId');
  const dateStr = searchParams.get('date');

  if (!schoolId) {
    return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
  }

  const timeSlots = [
    { start: '11:30', end: '12:00' },
    { start: '12:00', end: '12:30' },
    { start: '12:30', end: '13:00' },
    { start: '13:00', end: '13:30' }
  ];

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

    const timeData = await Promise.all(
      timeSlots.map(async ({ start, end }) => {
        const count = await prisma.mood.count({
          where: {
            schoolId,
            timestamp: {
              gte: new Date(`${format(dayStart, 'yyyy-MM-dd')}T${start}:00`),
              lt: new Date(`${format(dayStart, 'yyyy-MM-dd')}T${end}:00`)
            }
          }
        });
        return {
          name: `${start}-${end}`,
          submissions: count
        };
      })
    );

    return NextResponse.json({
      moods: formattedData,
      timeAnalysis: timeData
    });

  } catch (error) {
    console.error('Failed to fetch daily data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily data' },
      { status: 500 }
    );
  }
}