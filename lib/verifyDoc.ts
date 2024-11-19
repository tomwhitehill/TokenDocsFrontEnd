interface VerifyParams {
  subscriptionKey: string;
  apiVersion: string;
  inputData: unknown;
}

export async function verifyDocument({ subscriptionKey, apiVersion, inputData }: VerifyParams) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const headers = {
    'Ocp-Apim-Subscription-Key': subscriptionKey,
    'Api-Version': apiVersion,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(`${baseUrl}/verify`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(inputData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Verification failed:', error);
    throw new Error('Verification failed.');
  }
}