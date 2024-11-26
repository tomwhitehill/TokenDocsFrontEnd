import axios from 'axios'
import { UserStore } from "@/store/userStore"

export interface UploadFileParams {
  file: File | null;
  metadata?: string;
  apiVersion: string;
}

export async function uploadFile({ file, metadata, apiVersion }: UploadFileParams): Promise<unknown> {
  const { subscriptionKey } = UserStore.getState();
  if (!subscriptionKey) {
    throw new Error("Subscription key is not set");
  }

  const headers = {
    'Ocp-Apim-Subscription-Key': subscriptionKey,
    'Api-Version': apiVersion,
  };

  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  if (metadata) {
    try {
      const parsedMetadata = JSON.parse(metadata);
      const blob = new Blob([JSON.stringify(parsedMetadata)], { type: 'application/json' });
      formData.append('metadata', blob, '');
    } catch (error) {
      throw new Error('Metadata should be valid JSON.');
    }
  }

  const response = await axios.post(
    'https://sdss01.azure-api.net/document/upload',
    formData,
    { headers }
  );

  return response.data;
}