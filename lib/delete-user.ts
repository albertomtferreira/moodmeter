import type { PrismaClient } from '@prisma/client';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';

// Shared by the admin endpoint and signed Clerk deletion webhooks.
export async function deleteLocalUser(db: PrismaClient, clerkId: string) {
  if (!clerkId?.trim()) throw new Error('User ID is required');
  await db.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { clerkId }, select: { id: true } });
    if (!user) return;
    await tx.schoolUser.deleteMany({ where: { userId: user.id } });
    await tx.userSettings.deleteMany({ where: { userId: user.id } });
    await tx.user.deleteMany({ where: { id: user.id } });
  });
}

export async function deleteUserAccount(
  db: PrismaClient,
  id: string,
  callerId: string,
  deleteClerkUser: (clerkId: string) => Promise<unknown>,
) {
  if (id === callerId) {
    return { status: 409, error: 'You cannot delete your own account.' };
  }
  const target = await db.user.findUnique({ where: { id } });
  if (!target) return { status: 200 };

  try {
    await deleteClerkUser(target.clerkId);
  } catch (error) {
    const alreadyDeleted = isClerkAPIResponseError(error) && error.status === 404 &&
      error.errors.some((entry) => entry.code === 'resource_not_found');
    if (!alreadyDeleted) {
      console.error('Clerk user deletion failed:', error);
      return { status: 502, error: 'Could not confirm login account deletion. Please retry.' };
    }
  }

  try {
    await deleteLocalUser(db, target.clerkId);
    return { status: 200 };
  } catch (error) {
    console.error('Local user cleanup failed:', error);
    return { status: 503, error: 'The login account was deleted, but local cleanup failed. Please retry deletion.' };
  }
}
