"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Loader2 } from 'lucide-react'
import { getFileExtension } from "@/lib/utils"
import dynamic from 'next/dynamic'
import PDFViewer from "@/components/shared/doc-viewer/PDFViewer"

const DocViewer = dynamic(() => import('@/components/shared/doc-viewer/DocViewer'), { ssr: false })

interface FilePreviewProps {
  file: {
    assetName: string;
    documentId: string;
  };
  previewData: Blob | string | null;
}

export function FilePreview({ file, previewData }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const extension = getFileExtension(file.assetName)

  useEffect(() => {
    if (previewData instanceof Blob) {
      const url = URL.createObjectURL(previewData)
      setPreviewUrl(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    } else if (typeof previewData === 'string') {
      setPreviewUrl(previewData)
    } else {
      setPreviewUrl(null)
    }
  }, [previewData])

  if (!previewData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading preview...</span>
      </div>
    )
  }

  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'ico']
  const textExtensions = ['txt', 'md', 'js', 'ts', 'jsx', 'tsx', 'json', 'html', 'css', 'csv']
  const pdfExtension = 'pdf'

  if (imageExtensions.includes(extension)) {
    return (
      <div className="h-auto w-full flex items-center justify-center shadow-sm overflow-hidden">
        {previewUrl && (
          <Image
            src={previewUrl}
            alt={file.assetName}
            width={600}
            height={400}
            className="w-full h-auto max-w-none rounded-sm object-contain"
            unoptimized
          />
        )}
      </div>
    )
  }

  if (textExtensions.includes(extension)) {
    return (
      <pre className="whitespace-pre-wrap break-words text-sm bg-muted p-4 rounded-md max-h-[600px] overflow-auto">
        {typeof previewData === 'string' ? previewData : 'Unable to display content'}
      </pre>
    )
  }

  // if (extension === pdfExtension && previewUrl) {
  //   return <PDFViewer file={previewData} />
  // }

  if (previewData instanceof Blob) {
    return <DocViewer file={previewData} />
  }

  return (
    <div className="flex flex-col items-center justify-center h-64">
      <p className="p-4 text-center text-muted-foreground">
        Preview not available for this file type ({extension}).
      </p>
    </div>
  )
}