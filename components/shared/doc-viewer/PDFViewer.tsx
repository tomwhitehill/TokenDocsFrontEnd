"use client";

import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Set worker source outside of component
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: Blob;
}

export default function PDFViewer({ file }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState<Error | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      // Reset states when file changes
      setError(null);
      setIsLoading(true);
      setPageNumber(1);
      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load PDF"));
    }
  }, [file]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  }

  function onDocumentLoadError(err: Error) {
    console.error("Error loading PDF:", err);
    setError(err);
    setIsLoading(false);
  }

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">
          Loading PDF...
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-muted-foreground">Failed to Load PDF!</div>;
  }

  return (
    <div className="flex flex-col items-center gap-2 p-4 overflow-hidden">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse text-muted-foreground">
              Loading PDF...
            </div>
          </div>
        }
        error={null}
        options={{
          cMapUrl: "https://unpkg.com/pdfjs-dist@3.4.120/cmaps/",
          cMapPacked: true,
          standardFontDataUrl:
            "https://unpkg.com/pdfjs-dist@3.4.120/standard_fonts/",
        }}
      >
        <Page
          pageNumber={pageNumber}
          loading={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-pulse text-muted-foreground">
                Loading page...
              </div>
            </div>
          }
          error={null}
          className="max-w-full"
          renderTextLayer={true}
          renderAnnotationLayer={true}
        />
      </Document>

      {numPages && numPages > 0 && (
        <div className="flex items-center gap-4 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>

          <div className="text-sm">
            Page {pageNumber} of {numPages}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      )}
    </div>
  );
}
