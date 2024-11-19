'use client'

import { ChangeEvent, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Settings2, X } from 'lucide-react'
import { useSearchByMetadata, useGetAllDocuments } from "@/queries/documentQueries"
import { useSearchStore } from "@/store/searchStore"
import { useDebounce } from "@/hooks/useDebounce"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function SearchBox() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDocType, setSelectedDocType] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [docTypeOptions, setDocTypeOptions] = useState<Array<{ value: string; label: string }>>([])
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const { setQuery, setResults } = useSearchStore()
  const searchMutation = useSearchByMetadata()
  const { data: allDocuments, isLoading: isLoadingAllDocs } = useGetAllDocuments()

  const performSearch = (searchData: {
    inputData: { searchByMetadata: Array<Record<string, string>> }
  }) => {
    searchMutation.mutate(searchData, {
      onSuccess: (data: any) => {
        console.log("Search result:", data)
        setResults(data)
        toast.success("Search completed successfully")

        updateDocTypeOptions(data)
      },
      onError: (error: unknown) => {
        console.error("Search error:", error)
        setResults([])
        toast.error("Search failed. Please try again.")
      },
    })
  }

  const updateDocTypeOptions = (data: any) => {
    const newDocTypeMap = new Map()
    if (data?.result?.value) {
      data.result.value.forEach((item: any) => {
        if (item.customMetadata && item.customMetadata.docType) {
          newDocTypeMap.set(item.customMetadata.docType, item.customMetadata.docType)
        }
      })
    }
    setDocTypeOptions(Array.from(newDocTypeMap, ([value, label]) => ({ value, label })))
  }

  useEffect(() => {
    if (debouncedSearchQuery || selectedDocType) {
      const searchData = {
        inputData: {
          searchByMetadata: debouncedSearchQuery
            ? [{ assetId: debouncedSearchQuery }, ...(selectedDocType ? [{ docType: selectedDocType }] : [])]
            : selectedDocType ? [{ docType: selectedDocType }] : [],
        },
      }
      performSearch(searchData)
    } else if (allDocuments) {
      setResults(allDocuments)
      updateDocTypeOptions(allDocuments)
    }
  }, [debouncedSearchQuery, selectedDocType, allDocuments])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setSearchQuery(newQuery)
    setQuery(newQuery)
  }

  const handleDocTypeChange = (docType: string) => {
    setSelectedDocType(docType)
  }

  const clearDocTypeSelection = () => {
    setSelectedDocType("")
  }

  return (
    <div className="relative max-w-xs">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by customMetadata"
          value={searchQuery}
          onChange={handleInputChange}
          className="pl-8 pr-10 rounded-full bg-card"
        />
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0.5 top-1/2 -translate-y-1/2 h-auto p-2 hover:bg-primary hover:text-primary-foreground rounded-full"
            >
              <Settings2 className="h-4 w-4" />
              <span className="sr-only">Search settings</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Document Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <RadioGroup value={selectedDocType} onValueChange={handleDocTypeChange}>
                {docTypeOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
              {selectedDocType && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearDocTypeSelection}
                  className="w-full mt-2 flex items-center justify-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear selection
                </Button>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}