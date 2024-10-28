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
    console.log(`Processing event: ${eventType}`);

    // Connect to database at the start
    await prisma.$connect();
    console.log('Database connected successfully');

    try {
      switch (eventType) {
        case 'user.created': {
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
        }

        case 'user.updated': {
          console.log('Processing user update event');
          const data = evt.data;
          const clerkId = data.id as string;
          const username = data.username as string;
          const emailAddresses = data.email_addresses as Array<any>;
          const firstName = data.first_name as string;
          const lastName = data.last_name as string;
          const primaryEmailAddressId = data.primary_email_address_id as string;

          console.log('Update data:', {
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
            throw new Error('No primary email found in update data');
          }

          // Update user in database
          const updatedUser = await prisma.user.update({
            where: { clerkId },
            data: {
              username: username || primaryEmail.email_address.split('@')[0],
              email: primaryEmail.email_address,
              name: [firstName, lastName].filter(Boolean).join(' ') || null,
            },
          });

          console.log('User updated successfully:', updatedUser);

          return new Response(JSON.stringify({ success: true, user: updatedUser }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        case 'user.deleted': {
          console.log('Processing user deletion event');
          const data = evt.data;
          const clerkId = data.id as string;

          const deletedUser = await prisma.user.delete({
            where: { clerkId },
          });

          console.log('User deleted successfully:', deletedUser);

          return new Response(JSON.stringify({ success: true, user: deletedUser }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        default: {
          console.log(`Unhandled event type: ${eventType}`);
          return new Response(
            JSON.stringify({ received: true, message: 'Unhandled event type' }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
      }

    } catch (err) {
      const error = err as Error | PrismaError;
      console.error('Detailed error:', error);

      // Handle Prisma-specific errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002': // Unique constraint violation
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
          case 'P2025': // Record not found
            return new Response(
              JSON.stringify({
                error: 'User not found',
                details: {
                  code: error.code,
                  message: error.message
                }
              }),
              { status: 404 }
            );
          default:
            return new Response(
              JSON.stringify({
                error: 'Database error',
                details: {
                  code: error.code,
                  message: error.message
                }
              }),
              { status: 500 }
            );
        }
      }

      // Handle other types of errors
      return new Response(
        JSON.stringify({
          error: 'Error processing webhook',
          details: error.message,
          stack: error instanceof Error ? error.stack : undefined
        }),
        { status: 400 }
      );

    } finally {
      await prisma.$disconnect();
    }

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