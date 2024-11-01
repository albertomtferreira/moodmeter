// app/api/reports/weekly/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { MoodType } from '@prisma/client';
import { startOfWeek, endOfWeek, format, parseISO } from 'date-fns';

interface WeeklyMoodData {
  name: string;
  HAPPY: number;
  OKAY: number;
  UNHAPPY: number;
  total: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');
    const weekParam = searchParams.get('week');

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
    }

    // Calculate week start and end dates
    const selectedDate = weekParam ? parseISO(weekParam) : new Date();
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Start from Monday
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 }); // End on Sunday

    const weeklyMoods = await prisma.mood.findMany({
      where: {
        schoolId,
        timestamp: {
          gte: weekStart,
          lte: weekEnd
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    });

    // Initialize data for all days of the week
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const initialData: Record<string, WeeklyMoodData> = {};

    daysOfWeek.forEach(day => {
      initialData[day] = {
        name: day,
        HAPPY: 0,
        OKAY: 0,
        UNHAPPY: 0,
        total: 0
      };
    });

    // Group moods by day
    const groupedByDay = weeklyMoods.reduce((acc, mood) => {
      const day = format(mood.timestamp, 'E'); // Gets short day name (Mon, Tue, etc.)
      const moodType = mood.type.toUpperCase() as keyof typeof acc[typeof day];

      acc[day][moodType]++;
      acc[day].total++;

      return acc;
    }, initialData);

    // Convert to array and ensure correct order
    const formattedData = daysOfWeek.map(day => groupedByDay[day]);

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error in weekly report:', error);
    return NextResponse.json({
      error: 'Failed to fetch weekly data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}