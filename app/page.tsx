"use client"

import { useState } from "react"
import { FolderItem } from "@/components/shared/folder-tree"
import { FilterPanel } from "@/components/custom/filter"
import { FileViewer } from "@/components/custom/file-viewer"
import { FolderTreeComponent } from "@/components/shared/folder-tree/"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<FolderItem | null>(null)

  const handleFileSelect = (file: FolderItem) => {
    setSelectedFile(file)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)]">
      <FilterPanel />
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
            <FolderTreeComponent
              selectedItem={selectedFile}
              onFileSelect={handleFileSelect}
              setSelectedItem={setSelectedFile}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60}>
            <FileViewer selectedFile={selectedFile} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}