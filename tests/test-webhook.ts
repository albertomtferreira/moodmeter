// scripts/test-webhook.ts
async function testWebhook() {
  const testData = {
    data: {
      id: "test_user_id",
      username: "testuser",
      email_addresses: [{
        id: "test_email_id",
        email_address: "test@example.com"
      }],
      primary_email_address_id: "test_email_id",
      first_name: "Test",
      last_name: "User"
    },
    type: "user.created"
  };

  try {
    const response = await fetch('http://localhost:3000/api/webhook/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('Test result:', result);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testWebhook();