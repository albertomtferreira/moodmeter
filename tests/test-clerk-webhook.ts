// scripts/test-webhook.ts
import crypto from 'crypto';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from the root .env file
dotenv.config({ path: resolve(__dirname, '../.env') });

// Add some debugging
console.log('Environment check:');
console.log('WEBHOOK_SECRET exists:', !!process.env.WEBHOOK_SECRET);
console.log('Current directory:', __dirname);

// Function to generate Svix headers
function generateSvixHeaders(payload: any, secret: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  const payloadString = JSON.stringify(payload);

  // Generate signature
  const toSign = `${timestamp}.${payloadString}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(toSign)
    .digest('hex');

  return {
    'svix-id': crypto.randomUUID(),
    'svix-timestamp': timestamp.toString(),
    'svix-signature': `v1,${signature}`,
    'Content-Type': 'application/json',
  };
}

// Test data for different Clerk webhook events
const testEvents = {
  userCreated: {
    data: {
      id: "test_user_123",
      username: "testuser",
      email_addresses: [{
        id: "email_123",
        email_address: "test@example.com",
        verification: {
          status: "verified",
          strategy: "from_oauth_google"
        }
      }],
      primary_email_address_id: "email_123",
      first_name: "Test",
      last_name: "User",
      created_at: Date.now(),
      updated_at: Date.now(),
      external_accounts: []
    },
    type: "user.created",
    object: "event"
  }
};

async function testWebhook() {
  // Get webhook secret from environment variable
  const webhookSecret = process.env.WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('WEBHOOK_SECRET not found in environment variables');
    console.error('Available environment variables:', Object.keys(process.env));
    return;
  }

  const ngrokUrl = process.env.NGROK_URL || 'http://localhost:3000';
  const testEndpoint = `${ngrokUrl}/api/webhook/clerk`;

  console.log('Using test endpoint:', testEndpoint);

  try {
    console.log('Starting webhook tests...\n');

    // Test 1: User Created Event
    console.log('Test 1: Testing user.created event');
    const userCreatedHeaders = generateSvixHeaders(testEvents.userCreated, webhookSecret);

    console.log('Sending request with headers:', userCreatedHeaders);

    const response = await fetch(testEndpoint, {
      method: 'POST',
      headers: userCreatedHeaders,
      body: JSON.stringify(testEvents.userCreated)
    });

    const result = await response.json();

    console.log('Status:', response.status);
    console.log('Response:', result);
    console.log('\n-------------------\n');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Execute tests with error handling
testWebhook().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});