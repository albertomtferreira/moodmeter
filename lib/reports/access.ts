import type { PrismaClient } from '@prisma/client';

export class ReportError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export async function reportUser(db: PrismaClient, clerkId: string | null) {
  if (!clerkId) throw new ReportError(401, 'Sign in to view reports.');
  const user = await db.user.findUnique({ where: { clerkId }, select: { id: true } });
  if (!user) throw new ReportError(403, 'School access is unavailable.');
  return user;
}
export async function reportSchool(db: PrismaClient, clerkId: string | null, schoolId: string | null) {
  const user = await reportUser(db, clerkId);
  if (!schoolId) throw new ReportError(400, 'School ID is required.');
  const membership = await db.schoolUser.findUnique({
    where: { userId_schoolId: { userId: user.id, schoolId } },
    select: { school: { select: { id: true, name: true } } },
  });
  if (!membership) throw new ReportError(403, 'School access is unavailable.');
  return membership.school;
}
