"use client";

import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
// import '@cyntler/react-doc-viewer/dist/index.css';
import { useEffect, useState } from "react";

interface DocViewerProps {
  file: Blob;
}

export default function CustomDocViewer({ file }: DocViewerProps) {
  const [docs, setDocs] = useState<{ uri: string; fileType: string }[]>([]);

  useEffect(() => {
    if (file) {
      const fileType = file.type.split("/")[1];
      const uri = URL.createObjectURL(file);
      setDocs([{ uri, fileType }]);

      return () => {
        URL.revokeObjectURL(uri);
      };
    }
  }, [file]);

  if (!file) {
    return <div>No file selected</div>;
  }

  return (
    <div className="w-full h-[600px] overflow-hidden rounded-md border">
      <DocViewer
        documents={docs}
        pluginRenderers={DocViewerRenderers}
        config={{
          header: {
            disableHeader: true,
          }
        }}
      />
    </div>
  );
}
