"use client"

import { useState } from "react"
import { FolderItem } from "@/components/shared/folder-tree"
import { FilterPanel } from "@/components/custom/filter"
import { FileViewer } from "@/components/custom/file-viewer"
import { FolderTreeComponent } from "@/components/shared/folder-tree/"

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<FolderItem | null>(null)

  const handleFileSelect = (file: FolderItem) => {
    setSelectedFile(file)
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <FilterPanel />
      <div className="flex-1">
        <div className="grid grid-cols-[auto,1fr] h-full">
          <FolderTreeComponent
            selectedItem={selectedFile}
            onFileSelect={handleFileSelect}
            setSelectedItem={setSelectedFile}
          />
          <FileViewer selectedFile={selectedFile} />
        </div>
      </div>
    </div>
  )
}