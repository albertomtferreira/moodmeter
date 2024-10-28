// app/api/users/me/route.ts
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        pin: true,
        schools: {
          include: {
            school: true
          }
        },
        settings: true
      }
    });

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}