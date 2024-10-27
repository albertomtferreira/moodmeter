// app/api/mood/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { schoolId, type, period = 'LUNCH' } = await request.json();

    // Validate required fields
    if (!schoolId || !type) {
      return NextResponse.json(
        { error: 'School ID and mood type are required' },
        { status: 400 }
      );
    }

    // Create mood entry
    const mood = await prisma.mood.create({
      data: {
        type: type.toUpperCase(),
        schoolId,
        period,
        timestamp: new Date(),
      },
      include: {
        school: true,
      },
    });

    return NextResponse.json(mood);
  } catch (error) {
    console.error('Failed to record mood:', error);
    return NextResponse.json(
      { error: 'Failed to record mood' },
      { status: 500 }
    );
  }
}