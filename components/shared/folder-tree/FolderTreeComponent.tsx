"use client"

import { FC, useMemo, useEffect } from "react"
import { FileIcon } from 'lucide-react'
import { FileType, FolderItem } from "./folder-data"
import { useSearchStore } from "@/store/searchStore"
import { useFilterStore } from "@/store/filterStore"
import FolderTree from "./FolderTree"

interface FolderTreeComponentProps {
  onFileSelect: (file: FolderItem) => void
  selectedItem: FolderItem | null
  setSelectedItem: (item: FolderItem | null) => void
}

export const FolderTreeComponent: FC<FolderTreeComponentProps> = ({
  onFileSelect,
  selectedItem,
  setSelectedItem,
}) => {
  const { results } = useSearchStore()
  const { selectedTicker, selectedDocType } = useFilterStore()

  const searchResults = useMemo(() => {
    const data = results?.result?.value || []
    return data
      .map((item: FileType) => ({
        type: item.processMetadata.systemMetadata.IsFolder ? "folder" : "file",
        assetName: item.documentMetadata.name,
        documentId: item.DocumentId,
        id: item.id,
        customMetadata: item.customMetadata,
        documentMetadata: item.documentMetadata,
        processMetadata: item.processMetadata,
      }))
      .sort((a, b) => {
        const timestampA = a.processMetadata?.instrumentation?.blob?.endTimeStamp
        const timestampB = b.processMetadata?.instrumentation?.blob?.endTimeStamp
        
        if (!timestampA) return 1
        if (!timestampB) return -1
        
        return new Date(timestampB).getTime() - new Date(timestampA).getTime()
      })
  }, [results])

  const filteredItems = useMemo(() => {
    return searchResults.filter((item) => {
      const tickerMatch = !selectedTicker || selectedTicker === "all" || item.customMetadata?.ticker === selectedTicker
      const docTypeMatch = !selectedDocType || selectedDocType === "all" || item.customMetadata?.docType === selectedDocType
      return tickerMatch && docTypeMatch
    })
  }, [searchResults, selectedTicker, selectedDocType])

  useEffect(() => {
    const isSelectedItemInFilteredItems = filteredItems.some(
      (item) => item.documentId === selectedItem?.documentId
    )

    if (!isSelectedItemInFilteredItems && filteredItems.length > 0) {
      setSelectedItem(filteredItems[0])
      onFileSelect(filteredItems[0])
    } else if (filteredItems.length === 0) {
      setSelectedItem(null)
    }
  }, [filteredItems, selectedItem, setSelectedItem, onFileSelect])

  return (
    <div className="h-[calc(100svh-9rem)] flex-1 overflow-y-auto">
      {filteredItems.length > 0 ? (
        <FolderTree
          items={filteredItems}
          onFileSelect={onFileSelect}
          selectedItem={selectedItem}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center max-w-60 p-2">
          <FileIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No files or folders found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filter criteria to see more results.
          </p>
        </div>
      )}
    </div>
  )
}