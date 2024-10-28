// app/api/webhook/clerk/route.ts
import { prisma } from '@/lib/prisma';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { UserRole, Prisma } from '@prisma/client';

// Define error types
type PrismaError = Prisma.PrismaClientKnownRequestError;

export async function POST(req: Request) {
  console.log('Webhook received');

  try {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      console.error('No webhook secret found');
      throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env');
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('Missing svix headers');
      return new Response('Error occurred -- no svix headers', { status: 400 });
    }

    // Get the body
    const payload = await req.json();
    console.log('Received payload:', JSON.stringify(payload, null, 2));

    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      const error = err as Error;
      console.error('Error verifying webhook:', error.message);
      return new Response('Error occurred during verification', { status: 400 });
    }

    const eventType = evt.type;

    //CREATE USER
    if (eventType === 'user.created') {
      try {
        // Log the entire event data
        console.log('Event data:', JSON.stringify(evt.data, null, 2));

        // Destructure with type checking
        const data = evt.data;
        const clerkId = data.id as string;
        const username = data.username as string;
        const emailAddresses = data.email_addresses as Array<any>;
        const firstName = data.first_name as string;
        const lastName = data.last_name as string;
        const primaryEmailAddressId = data.primary_email_address_id as string;

        console.log('Extracted data:', {
          clerkId,
          username,
          emailAddresses,
          firstName,
          lastName,
          primaryEmailAddressId
        });

        // Find primary email
        const primaryEmail = emailAddresses.find(
          email => email.id === primaryEmailAddressId
        );

        if (!primaryEmail) {
          console.error('No primary email found in:', emailAddresses);
          throw new Error('No primary email found');
        }

        // Test database connection
        await prisma.$connect();
        console.log('Database connected successfully');

        const user = await prisma.user.create({
          data: {
            clerkId,
            username: username || primaryEmail.email_address.split('@')[0],
            email: primaryEmail.email_address,
            name: [firstName, lastName].filter(Boolean).join(' ') || null,
            pin: "000000",
            role: UserRole.VIEWER,
          },
        });

        console.log('User created successfully:', user);

        return new Response(JSON.stringify({ success: true, user }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });

      } catch (err) {
        const error = err as Error | PrismaError;
        console.error('Detailed error:', error);

        // Check if it's a Prisma error
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            return new Response(
              JSON.stringify({
                error: 'User with this email or username already exists',
                field: error.meta?.target,
                details: {
                  code: error.code,
                  message: error.message
                }
              }),
              { status: 409 }
            );
          }
        }

        return new Response(
          JSON.stringify({
            error: 'Error creating user',
            details: error.message,
            stack: error instanceof Error ? error.stack : undefined
          }),
          { status: 400 }
        );
      } finally {
        await prisma.$disconnect();
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    const error = err as Error;
    console.error('Top level error:', error);
    return new Response(
      JSON.stringify({
        error: 'Webhook processing failed',
        details: error.message,
        stack: error.stack
      }),
      { status: 500 }
    );
  }
}