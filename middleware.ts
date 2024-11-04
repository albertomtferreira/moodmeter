// middleware.ts
import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export default authMiddleware({
  publicRoutes: [
    "/",
    "/about",
    "/pricing",
    "/contact",
    "/api/webhook/clerk",
    "/sign-in(.*)",
    "/sign-up(.*)",
  ],

  async afterAuth(auth, req) {
    // Convert header values to string or undefined instead of possibly null
    const svix_id = req.headers.get("svix-id") || undefined;
    const svix_timestamp = req.headers.get("svix-timestamp") || undefined;
    const svix_signature = req.headers.get("svix-signature") || undefined;

    // if (!auth.userId && !req.nextUrl.pathname.startsWith('/sign-in')) {
    //   return NextResponse.redirect(new URL('/sign-in', req.url));
    // }

    try {
      if (auth.userId) {
        const user = await prisma.user.findUnique({
          where: { clerkId: auth.userId },
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
  },
});

export const config = {
  matcher: [
    "/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)",
    "/api/(.*)",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};