// app/api/webhook/clerk/route.ts
import { prisma } from '@/lib/prisma';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { UserRole } from '@prisma/client';

export async function POST(req: Request) {
  // Get the webhook signing secret from environment variables
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
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
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    try {
      const { id, username, email_addresses, first_name, last_name } = evt.data;

      // Get the primary email
      const primaryEmail = email_addresses.find(email => email.id === evt.data.primary_email_address_id);

      if (!primaryEmail) {
        throw new Error('No primary email found');
      }

      // Create user in your database
      const user = await prisma.user.create({
        data: {
          clerkId: id,
          username: username || `user${id.slice(-6)}`, // Fallback username if none provided
          email: primaryEmail.email_address,
          name: [first_name, last_name].filter(Boolean).join(' ') || null,
          pin: "000000", // Default PIN
          role: UserRole.VIEWER, // Default role
        },
      });

      return new Response(JSON.stringify(user), { status: 201 });
    } catch (error) {
      console.error('Error creating user:', error);
      return new Response('Error creating user', { status: 400 });
    }
  }

  return new Response('', { status: 200 });
}