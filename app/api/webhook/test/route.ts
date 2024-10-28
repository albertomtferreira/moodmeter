// app/api/webhook/test/route.ts
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    // Log headers
    const headersList = headers();
    const headerData = {
      'content-type': headersList.get('content-type'),
      'user-agent': headersList.get('user-agent'),
    };
    console.log('Headers received:', headerData);

    // Log body
    const body = await req.json();
    console.log('Body received:', JSON.stringify(body, null, 2));

    // Send success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test webhook received',
        receivedData: body
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in test webhook:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to process webhook'
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Optional: Add a GET method for easy testing in browser
export async function GET() {
  return new Response(
    JSON.stringify({
      message: 'Test webhook endpoint is working'
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}