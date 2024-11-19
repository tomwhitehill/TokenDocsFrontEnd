import axios from "axios";

export interface DownloadParams {
  docId: string;
}

export async function downloadDocument({
  docId,
}: DownloadParams): Promise<Blob> {
  let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const subscriptionKey = process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY;
  const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;

  if (!baseUrl || !subscriptionKey || !apiVersion) {
    throw new Error("Missing environment variables");
  }

  const headers = {
    "Ocp-Apim-Subscription-Key": subscriptionKey,
    "Api-Version": apiVersion,
  };

  try {
    const response = await axios.post(
      `${baseUrl}document/download`,
      { docId },
      {
        headers,
        responseType: "blob",
      }
    );
  
    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 404) {
        console.error("Document not found:", docId);
        throw new Error("Document not found");
      }
      console.error("API responded with an error:", error.response.data);
    } else {
      console.error("Download failed due to network or CORS issues:", error.message);
    }
    throw error;
  }
  
}
