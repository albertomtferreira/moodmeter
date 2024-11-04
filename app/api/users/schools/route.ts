// app/api/user/schools/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

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

    // Fetch user's schools with their preferences
    const userSchools = await prisma.schoolUser.findMany({
      where: { userId: user.id },
      include: {
        school: true,
      },
    });

    // Transform the data to match the frontend requirements
    const formattedSchools = userSchools.sort((a, b) =>
      a.school.name.toLowerCase().localeCompare(b.school.name.toLowerCase())
    )
      .map(({ school, isPreferred }) => ({
        school,
        isPreferred,
      }));

    return NextResponse.json(formattedSchools);
  } catch (error) {
    console.error('Error fetching user schools:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}