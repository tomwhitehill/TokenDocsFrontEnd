import { useMutation, UseMutationResult, useQuery, UseQueryResult } from '@tanstack/react-query'
import { searchByMetadata, SearchByMetadataParams } from '../lib/documentSearch'
import { verifyDocument } from '../lib/verifyDoc'
import { toast } from 'sonner';
import { downloadDocument, DownloadParams } from '@/lib/downloadDoc';

interface VerifyParams {
  subscriptionKey: string
  apiVersion: string
  inputData: unknown
}

interface GetMetadataParams {
  subscriptionKey: string
  apiVersion: string
  inputData: unknown
}

export const documentKeys = {
  all: ['documents'] as const,
  search: () => [...documentKeys.all, 'search'] as const,
  searchByParams: (params: SearchByMetadataParams) => [...documentKeys.search(), params] as const,
  verify: () => [...documentKeys.all, 'verify'] as const,
  verifyByParams: (params: VerifyParams) => [...documentKeys.verify(), params] as const,
  metadata: () => [...documentKeys.all, 'metadata'] as const,
  metadataByParams: (params: GetMetadataParams) => [...documentKeys.metadata(), params] as const,
}

export const useGetAllDocuments = (): UseQueryResult<unknown, Error> => {
  return useQuery({
    queryKey: documentKeys.all,
    queryFn: async () => {
      const emptySearchParams: SearchByMetadataParams = {
        inputData: {
          searchByMetadata: [],
        },
      }
      return await searchByMetadata(emptySearchParams)
    },
    onError: (error) => {
      console.error("Failed to fetch all documents:", error)
      toast.error("Failed to fetch all documents.")
    },
  })
}

export const useSearchByMetadata = (): UseMutationResult<unknown, Error, SearchByMetadataParams> => {
  return useMutation({
    mutationFn: async (params: SearchByMetadataParams) => {
      const promise = searchByMetadata(params);
      toast.promise(promise, {
        loading: 'Searching by metadata...',
        success: 'Search by Metadata successful.',
        error: 'Search by Metadata failed.',
      });
      return await promise;
    },
    onSuccess: (data) => {
      if ('error' in data && data.error) {
        toast.error('Search By Metadata failed.')
      }
    },
    onError: (error) => {
      console.error(error)
    },
  })
}

export const useVerifyDocument = (): UseMutationResult<unknown, Error, VerifyParams> => {
  return useMutation({
    mutationFn: async (params: VerifyParams) => {
      const promise = verifyDocument(params);
      toast.promise(promise, {
        loading: 'Verifying document...',
        success: 'Verification successful.',
        error: 'Verification failed.',
      });
      return await promise;
    },
    onSuccess: (data) => {
      if ('error' in data && data.error) {
        toast.error('Verification failed.')
      }
    },
    onError: (error) => {
      console.error(error)
    },
  })
}

export const useDownloadDocument = (): UseMutationResult<Blob, Error, DownloadParams> => {
  return useMutation({
    mutationFn: downloadDocument,
    onSuccess: (data, variables) => {
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `document-${variables.docId}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Download successful.');
    },
    onError: (error) => {
      console.error('Error during download:', error);
      toast.error('Download failed.');
    },
  });
};

export const useDownloadHandler = () => {
  const downloadMutation = useDownloadDocument();

  const handleDownload = async (docId: string) => {
    try {
      await downloadMutation.mutateAsync({ docId });
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return {
    handleDownload,
    isDownloading: downloadMutation.isPending,
  };
};