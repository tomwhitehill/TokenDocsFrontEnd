export interface SearchByMetadataParams {
  inputData: {
    searchByMetadata: Array<Record<string, string>>;
  };
}

export async function searchByMetadata({
  inputData,
}: SearchByMetadataParams): Promise<unknown[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const subscriptionKey = process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY;
  const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;

  if (!baseUrl || !subscriptionKey || !apiVersion) {
    throw new Error("Missing environment variables");
  }

  const headers: HeadersInit = {
    "Ocp-Apim-Subscription-Key": subscriptionKey,
    "Api-Version": apiVersion,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(`${baseUrl}/document/search`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(inputData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: unknown[] = await response.json();
    return data;
  } catch (error) {
    console.error("Search by Metadata failed:", error);
    throw new Error("Search by Metadata failed.");
  }
}
