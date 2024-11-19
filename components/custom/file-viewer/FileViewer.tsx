"use client"

import React, { useState, useCallback, useEffect } from "react"
import { FolderItem } from "@/components/shared/folder-tree/folder-data"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axios from "axios"
import { Loader2 } from 'lucide-react'
import { getFileExtension } from "@/lib/utils"
import { FilePreview } from "./FilePreview"

interface FileViewerProps {
  selectedFile: FolderItem | null;
}

export function FileViewer({ selectedFile }: FileViewerProps) {
  const [previewData, setPreviewData] = useState<Blob | string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [fileUrl, setFileUrl] = useState("")

  const fetchPreview = useCallback(async (documentId: string) => {
    setIsLoading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      const subscriptionKey = process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY
      const apiVersion = process.env.NEXT_PUBLIC_API_VERSION

      if (!baseUrl || !subscriptionKey || !apiVersion) {
        throw new Error("Missing environment variables")
      }

      const headers = {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "Api-Version": apiVersion,
      }

      const response = await axios.post(
        `${baseUrl}document/download`,
        { documentId },
        {
          responseType: "blob",
          headers: headers,
        },
      )

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      })

      if (blob.type.startsWith("text/") || blob.type === "application/json") {
        const text = await blob.text()
        setPreviewData(text)
      } else {
        setPreviewData(blob)
      }

      const url = URL.createObjectURL(blob)
      setFileUrl(url)

      // toast.success("Preview loaded successfully.")
    } catch (error) {
      console.error("Error fetching the preview:", error)
      toast.error("Failed to load preview.")
      setPreviewData(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const downloadFile = async (documentId: string) => {
    setIsDownloading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      const subscriptionKey = process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY
      const apiVersion = process.env.NEXT_PUBLIC_API_VERSION

      if (!baseUrl || !subscriptionKey || !apiVersion) {
        throw new Error("Missing environment variables")
      }

      const headers = {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "Api-Version": apiVersion,
      }

      const response = await axios.post(
        `${baseUrl}document/download`,
        { documentId },
        {
          responseType: "blob",
          headers: headers,
        },
      )

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `document-${documentId}.${getFileExtension(
        selectedFile?.assetName || "",
      )}`
      document.body.appendChild(link)
      link.click()

      URL.revokeObjectURL(url)
      document.body.removeChild(link)

      toast.success("Download successful.")
    } catch (error) {
      console.error("Error downloading the file:", error)
      toast.error("Download failed.")
    } finally {
      setIsDownloading(false)
    }
  }

  const viewFile = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank')
    } else {
      toast.error("File not available for viewing.")
    }
  }

  useEffect(() => {
    if (selectedFile) {
      fetchPreview(selectedFile.documentId)
    }
  }, [selectedFile, fetchPreview])

  if (!selectedFile) {
    return (
      <section className="h-[calc(100svh-11rem)] border border-y-0 p-4">
        <div className="h-full flex items-center justify-center text-muted-foreground">
          Select a file to view
        </div>
      </section>
    )
  }

  return (
    <section className="border border-t-0 grid grid-cols-2 divide-x">
      {/* JSON Panel */}
      <div className="h-[calc(100svh-11rem)] overflow-auto flex flex-col">
        <div className="p-4 border-b font-semibold">Raw Data</div>
        <ScrollArea className="flex-1">
          <div className="p-4">
            <pre className="text-sm font-mono whitespace-pre-wrap break-words">
              {JSON.stringify(selectedFile, null, 2)}
            </pre>
          </div>
        </ScrollArea>
      </div>

      {/* Document Preview Panel */}
      <div className="h-[calc(100svh-11rem)] overflow-auto flex flex-col">
        <div className="p-4 border-b font-semibold">Document</div>
        <ScrollArea className="flex-1 p-4 max-w-none">
          {/* Preview content */}
          <div>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="mt-2 text-muted-foreground">Loading document preview...</span>
              </div>
            ) : selectedFile.type === "file" ? (
              <div className="rounded-lg border bg-muted">
                <FilePreview file={selectedFile} previewData={previewData} />
              </div>
            ) : (
              <div className="space-y-4">
                <h2>Folder Contents</h2>
                <ul className="list-disc pl-5">
                  {selectedFile.items?.map((item, index) => (
                    <li key={index}>{item.assetName}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex pt-4 gap-8 justify-center">
            <Button
              onClick={viewFile}
              disabled={isLoading}
              className="md:w-40 rounded-full py-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "View"
              )}
            </Button>
            <Button
              onClick={() => downloadFile(selectedFile.documentId)}
              disabled={isDownloading}
              className="md:w-40 rounded-full py-6"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Download"
              )}
            </Button>
          </div>
        </ScrollArea>
      </div>
    </section>
  )
}