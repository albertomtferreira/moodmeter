// app/api/reports/comparison/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        moods: {
          where: {
            timestamp: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30)) // Last 30 days
            }
          }
        }
      }
    });

    const comparisonData = schools.map(school => {
      const totalMoods = school.moods.length;
      const happyMoods = school.moods.filter(mood => mood.type === 'HAPPY').length;
      const satisfactionRate = totalMoods > 0
        ? (happyMoods / totalMoods) * 100
        : 0;

      return {
        name: school.name,
        Satisfaction: parseFloat(satisfactionRate.toFixed(1))
      };
    });

    return NextResponse.json(comparisonData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch comparison data' },
      { status: 500 }
    );
  }
}