interface GetMetadataParams {
  subscriptionKey: string;
  apiVersion: string;
  inputData: unknown;
}

export async function getDocumentMetadata({ subscriptionKey, apiVersion, inputData }: GetMetadataParams) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const headers = {
    'Ocp-Apim-Subscription-Key': subscriptionKey,
    'Api-Version': apiVersion,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(`${baseUrl}/document/metadata`, {
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
    console.error('Get Metadata failed:', error);
    throw new Error('Get Metadata failed.');
  }
}