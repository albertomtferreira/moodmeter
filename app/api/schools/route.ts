// app/api/schools/route.ts
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
        color: true,
        code: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(schools);
  } catch (error) {
    console.error('Failed to fetch schools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    );
  }
}