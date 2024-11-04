// app/api/admin/data/user/update-pin/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs';
import { z } from 'zod';

const updatePinSchema = z.object({
  currentPin: z.string().regex(/^\d{6}$/, 'PIN must be 6 digits'),
  newPin: z.string().regex(/^\d{6}$/, 'PIN must be 6 digits'),
});

export async function PUT(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = updatePinSchema.parse(body);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
        pin: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current PIN
    if (user.pin !== validatedData.currentPin) {
      return NextResponse.json(
        { message: 'Current PIN is incorrect' },
        { status: 400 }
      );
    }

    // Update PIN
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        pin: validatedData.newPin,
      },
    });

    return NextResponse.json(
      { message: 'PIN updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating PIN:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}