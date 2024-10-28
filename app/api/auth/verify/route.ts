// app/api/auth/verify/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username, pin } = await req.json();

    // Log the received data for debugging
    console.log('Received auth request:', { username, pin });

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        pin: true,
        role: true,
      },
    });

    console.log('Found user:', user);

    if (!user) {
      return NextResponse.json(
        { error: 'Username not found' },
        { status: 401 }
      );
    }

    if (user.pin !== pin) {
      return NextResponse.json(
        { error: 'Invalid PIN' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      role: user.role,
    });

  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}