// app/api/admin/data/user/[userId]/preferred-school/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { schoolId } = body;

    if (!schoolId) {
      return new NextResponse('School ID is required', { status: 400 });
    }

    // First, get the authenticated user to check permissions
    const authUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true, id: true }
    });

    if (!authUser) {
      return new NextResponse('User not found', { status: 404 });
    }


    // Verify the school exists and user has access to it
    const schoolUser = await prisma.schoolUser.findUnique({
      where: {
        userId_schoolId: {
          userId: authUser.id,
          schoolId: schoolId
        }
      }
    });

    if (!schoolUser) {
      return new NextResponse('School not found or user does not have access', { status: 404 });
    }

    // Use a transaction to update preferred schools
    await prisma.$transaction(async (tx) => {
      // First, remove preferred status from all user's schools
      await tx.schoolUser.updateMany({
        where: {
          userId: authUser.id,
          isPreferred: true
        },
        data: {
          isPreferred: false
        }
      });

      // Then set the new preferred school
      await tx.schoolUser.update({
        where: {
          userId_schoolId: {
            userId: authUser.id,
            schoolId: schoolId
          }
        },
        data: {
          isPreferred: true
        }
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Preferred school updated successfully'
    });

  } catch (error) {
    console.error('Error updating preferred school:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}