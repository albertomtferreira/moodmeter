// app/api/reports/comparison/route.ts
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId: clerkId } = auth();

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user's ID from your database
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const schools = await prisma.school.findMany({
      where: {
        isActive: true,
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