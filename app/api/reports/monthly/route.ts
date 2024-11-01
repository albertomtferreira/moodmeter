// app/api/reports/monthly/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const schoolId = searchParams.get('schoolId');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (!schoolId) {
    return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
  }

  try {
    const monthStart = new Date();
    monthStart.setMonth(monthStart.getMonth() - 6);

    const monthlyMoods = await prisma.mood.findMany({
      where: {
        schoolId,
        timestamp: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined,
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    });

    const groupedByMonth = monthlyMoods.reduce((acc, mood) => {
      const month = mood.timestamp.toLocaleDateString('en-US', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { total: 0, happy: 0 };
      }
      acc[month].total++;
      if (mood.type === 'HAPPY') acc[month].happy++;
      return acc;
    }, {} as Record<string, { total: number; happy: number }>);

    const formattedData = Object.entries(groupedByMonth).map(([name, data]) => ({
      name,
      Satisfaction: (data.happy / data.total) * 100
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch monthly data' }, { status: 500 });
  }
}