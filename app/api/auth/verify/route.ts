// app/api/auth/verify/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { createRateLimiter } from '@/lib/rateLimit';

const rateLimiter = createRateLimiter({
  maxAttempts: 5,    // 5 attempts
  windowMs: 300000   // per 5 minutes
});

export async function POST(req: Request) {
  try {

    const allowed = await rateLimiter(req);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }
    // Get the current user's Clerk ID
    const { userId: clerkId } = auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      );
    }

    const { username, pin } = await req.json();

    // Log the received data for debugging (remove in production)
    console.log('Received auth request:', { username, pin, clerkId });

    // Find user by both username and clerkId to ensure they match
    const user = await prisma.user.findFirst({
      where: {
        AND: [
          { username },
          { clerkId }
        ]
      },
      select: {
        id: true,
        pin: true,
        role: true,
        username: true,
        clerkId: true,
      },
    });

    console.log('Found user:', { ...user, pin: '***' }); // Hide PIN in logs

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials - Username does not match current user' },
        { status: 401 }
      );
    }

    // Verify PIN
    if (user.pin !== pin) {
      // Log failed attempt (consider implementing rate limiting)
      console.warn('Failed PIN attempt for user:', username);

      return NextResponse.json(
        { error: 'Invalid PIN' },
        { status: 401 }
      );
    }

    // Successful authentication
    return NextResponse.json({
      success: true,
      role: user.role,
      // You might want to return additional user data here
      username: user.username,
    });

  } catch (error) {
    // Type guard the error
    const err = error as Error;
    console.error('Authentication error:', {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

    return NextResponse.json(
      {
        error: 'Authentication failed',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred during authentication'
      },
      { status: 500 }
    );
  }
}