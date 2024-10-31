// app/api/admin/data/user/[userId]/schools/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // First, get the authenticated user to check permissions
    const authUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true, id: true }
    });

    if (!authUser) {
      return new NextResponse('User not found', { status: 404 });
    }



    // Get user's schools with their preferences
    const userSchools = await prisma.schoolUser.findMany({
      where: {
        userId: authUser.id
      },
      select: {
        isPreferred: true,
        school: {
          select: {
            id: true,
            name: true,
            code: true,
            color: true,
            isActive: true
          }
        }
      },
      orderBy: {
        school: {
          name: 'asc'
        }
      }
    });

    // Filter out inactive schools unless user is an admin
    const filteredSchools = authUser.role === UserRole.SUPER_ADMIN
      ? userSchools
      : userSchools.filter(school => school.school.isActive);

    return NextResponse.json(filteredSchools);

  } catch (error) {
    console.error('Error fetching user schools:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}