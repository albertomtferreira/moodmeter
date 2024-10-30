// app/api/admin/users/[userId]/schools/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: clerkId } = auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!admin || admin.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { schoolIds, preferredSchoolId } = await req.json();
    const { userId } = params;

    // Start a transaction to handle all updates
    await prisma.$transaction(async (tx) => {
      // First, remove all existing school associations
      await tx.schoolUser.deleteMany({
        where: { userId },
      });

      // Then create new associations
      for (const schoolId of schoolIds) {
        await tx.schoolUser.create({
          data: {
            userId,
            schoolId,
            isPreferred: schoolId === preferredSchoolId,
          },
        });
      }
    });

    // Fetch and return updated user data
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        schools: {
          include: {
            school: true,
          },
        },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user schools:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}