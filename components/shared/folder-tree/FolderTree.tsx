"use client"

import { FC, useState } from "react"
import { ChevronDown, ChevronRight, Folder } from 'lucide-react'
import { FolderItem } from "./folder-data"
import { cn } from "@/lib/utils"
import { FileIcon as CustomFileIcon } from "@/utils/file-icons"

interface FolderTreeProps {
  items: FolderItem[]
  level?: number
  onFileSelect: (file: FolderItem) => void
  selectedItem: FolderItem | null
}

const FolderTree: FC<FolderTreeProps> = ({
  items,
  level = 0,
  onFileSelect,
  selectedItem,
}) => {
  const [openFolders, setOpenFolders] = useState<{ [key: string]: boolean }>({})

  const toggleFolder = (folderName: string) => {
    setOpenFolders((prev) => ({ ...prev, [folderName]: !prev[folderName] }))
  }

  return (
    <div className="space-y-1">
      {items.map((item) => (
        <div key={item.documentId} style={{ paddingLeft: `${level * 32}px` }}>
          <button
            onClick={() => {
              if (item.type === "folder") {
                toggleFolder(item.assetName)
              } else {
                onFileSelect(item)
              }
            }}
            className={cn(
              "flex items-center w-full p-2 hover:bg-accent rounded-lg text-sm",
              selectedItem === item && "bg-accent"
            )}
            aria-expanded={
              item.type === "folder" ? openFolders[item.assetName] : undefined
            }
          >
            {item.type === "folder" ? (
              <span className="rounded-full bg-muted p-2 mr-2">
                <Folder fill="yellow" className="h-4 w-4 text-yellow-400" />
              </span>
            ) : (
              <CustomFileIcon
                filename={item.assetName}
                className="mr-2 h-4 w-4 text-muted-foreground"
              />
            )}
            {item.type === "folder" ? (
              <div className="flex flex-col text-left">
                <span
                  className={cn(
                    "pr-6 font-medium max-w-40 truncate",
                    openFolders[item.assetName] && "text-primary",
                    selectedItem === item && "text-primary"
                  )}
                >
                  {item.assetName}
                </span>
                <span
                  className={cn(
                    "pr-6 text-sm",
                    openFolders[item.assetName] && "text-primary",
                    selectedItem === item && "text-primary"
                  )}
                >
                  Asset ID {item.documentId}
                </span>
              </div>
            ) : (
              <span
                className={cn(
                  "font-normal break-all line-clamp-1 max-w-40",
                  selectedItem === item && "text-primary"
                )}
              >
                {item.assetName}
              </span>
            )}
            {item.type === "folder" && (
              <span className="ml-auto">
                {openFolders[item.assetName] ? (
                  <ChevronDown className="h-4 w-4 text-primary" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            )}
          </button>
          {item.type === "folder" &&
            openFolders[item.assetName] &&
            item.items && (
              <FolderTree
                items={item.items}
                level={level + 1}
                onFileSelect={onFileSelect}
                selectedItem={selectedItem}
              />
            )}
        </div>
      ))}
    </div>
  )
}

export default FolderTree