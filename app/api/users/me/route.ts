// app/api/users/me/route.ts
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

// Define error types
interface ErrorResponse {
  error: string;
  message: string;
  details?: string;
}

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json<ErrorResponse>(
        {
          error: 'Unauthorized',
          message: 'No user ID provided'
        },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        clerkId: true,
        username: true,
        email: true,
        role: true,
        pin: true,
        createdAt: true,
        updatedAt: true,
        schools: {
          include: {
            school: true
          }
        },
        settings: true
      }
    });

    if (!user) {
      return NextResponse.json<ErrorResponse>(
        {
          error: 'Not Found',
          message: 'User not found in database'
        },
        { status: 404 }
      );
    }

    // Add any data transformations here if needed
    const responseData = {
      ...user,
      hasSchools: user.schools.length > 0,
      pin: undefined
    };

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (err) {
    // Type guard for Prisma errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error:', {
        code: err.code,
        message: err.message,
        meta: err.meta
      });

      return NextResponse.json<ErrorResponse>(
        {
          error: 'Database Error',
          message: 'An error occurred while accessing the database',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined
        },
        { status: 500 }
      );
    }

    // Type guard for standard errors
    if (err instanceof Error) {
      console.error('Standard error:', {
        name: err.name,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });

      return NextResponse.json<ErrorResponse>(
        {
          error: 'Internal Server Error',
          message: 'An error occurred while fetching user data',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined
        },
        { status: 500 }
      );
    }

    // Fallback for unknown errors
    console.error('Unknown error:', err);

    return NextResponse.json<ErrorResponse>(
      {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? String(err) : undefined
      },
      { status: 500 }
    );

  } finally {
    await prisma.$disconnect();
  }
}

// Response type for successful request
export interface UserResponse {
  id: string;
  clerkId: string;
  username: string;
  email: string;
  role: string;
  schools: Array<{
    school: {
      id: string;
      name: string;
      code: string;
      color: string;
    };
  }>;
  settings: any; // Replace with proper settings type if available
  hasSchools: boolean;
  createdAt: string;
  updatedAt: string;
}

// You can also create a type guard for the response
export function isUserResponse(data: any): data is UserResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    typeof data.username === 'string' &&
    typeof data.email === 'string' &&
    Array.isArray(data.schools)
  );
}