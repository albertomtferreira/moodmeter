// app/api/admin/data/[model]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { z } from 'zod';

// Validation schemas for each model
const UserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'VIEWER']),
  pin: z.string().length(6),
});

const SchoolSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  color: z.string(),
  isActive: z.boolean(),
});

const MoodSchema = z.object({
  type: z.enum(['HAPPY', 'OKAY', 'UNHAPPY']),
  schoolId: z.string(),
  period: z.enum(['MORNING', 'LUNCH', 'AFTERNOON', 'AFTER_SCHOOL']),
});

const modelSchemas = {
  user: UserSchema,
  school: SchoolSchema,
  mood: MoodSchema,
};

export async function GET(
  req: Request,
  { params }: { params: { model: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const model = params.model.toLowerCase();

    // Model specific queries
    switch (model) {
      case 'user':
        const users = await prisma.user.findMany({
          take: 100,
          include: {
            schools: {
              include: {
                school: true
              }
            }
          }
        });
        return NextResponse.json(users);

      case 'school':
        const schools = await prisma.school.findMany({
          take: 100,
        });
        return NextResponse.json(schools);

      case 'mood':
        const moods = await prisma.mood.findMany({
          take: 100,
          include: {
            school: true // Include school details for mood entries
          }
        });
        return NextResponse.json(moods);

      default:
        return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { model: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const model = params.model.toLowerCase();
    const schema = modelSchemas[model as keyof typeof modelSchemas];

    if (!schema) {
      return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = schema.parse(body);

    const prismaModel = prisma[model as keyof typeof prisma];
    const created = await (prismaModel as any).create({
      data: validatedData,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating record:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { model: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const model = params.model.toLowerCase();
    const schema = modelSchemas[model as keyof typeof modelSchemas];

    if (!schema) {
      return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
    }

    const { id, ...data } = await req.json();
    const validatedData = schema.partial().parse(data);

    const prismaModel = prisma[model as keyof typeof prisma];
    const updated = await (prismaModel as any).update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating record:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { model: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await req.json();
    const model = params.model.toLowerCase();
    const prismaModel = prisma[model as keyof typeof prisma];

    if (!prismaModel) {
      return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
    }

    await (prismaModel as any).delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting record:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}