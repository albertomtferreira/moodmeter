// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  try {
    if (userId) {
        const user = await prisma.user.findUnique({
          where: { clerkId: userId },
          select: { role: true }
        });

        // Create new headers object
        const requestHeaders = new Headers(req.headers);
        // Convert to string to avoid null
        requestHeaders.set('x-user-role', (user?.role || 'VIEWER').toString());

        // Block access to admin routes for non-admin users
        if (req.nextUrl.pathname.startsWith('/admin') &&
          user?.role !== 'SUPER_ADMIN' &&
          user?.role !== 'ADMIN') {
          return NextResponse.redirect(new URL('/unauthorized', req.url));
        }

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
    }
  } catch (error) {
    console.error('Error in middleware:', error);
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
