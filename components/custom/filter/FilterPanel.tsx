"use client"

import { useMemo } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFilterStore } from "@/store/filterStore"
import { useSearchStore } from "@/store/searchStore"

export default function FilterPanel() {
  const { selectedTicker, setSelectedTicker, selectedDocType, setSelectedDocType } = useFilterStore()
  const { results } = useSearchStore()

  const tickerOptions = useMemo(() => {
    const tickerMap = new Map()
    tickerMap.set("all", "All Tickers")

    if (results?.result?.value) {
      results.result.value.forEach((item: any) => {
        if (item.customMetadata && item.customMetadata.ticker) {
          tickerMap.set(item.customMetadata.ticker, item.customMetadata.ticker)
        }
      })
    }

    if (selectedTicker && !tickerMap.has(selectedTicker)) {
      setSelectedTicker(null)
    }

    return Array.from(tickerMap, ([value, label]) => ({ value, label }))
  }, [results, selectedTicker, setSelectedTicker])

  const docTypeOptions = useMemo(() => {
    const docTypeMap = new Map()
    // docTypeMap.set("all", "All Documents")

    if (results?.result?.value) {
      results.result.value.forEach((item: any) => {
        if (item.customMetadata && item.customMetadata.docType) {
          docTypeMap.set(item.customMetadata.docType, item.customMetadata.docType)
        }
      })
    }

    if (selectedDocType && !docTypeMap.has(selectedDocType)) {
      setSelectedDocType(null)
    }

    return Array.from(docTypeMap, ([value, label]) => ({ value, label }))
  }, [results, selectedDocType, setSelectedDocType])

  return (
    <section className="h-24 bg-card flex items-center gap-4 py-4 px-8 border border-b">
      <h3 className="text-lg">Filter</h3>
      <div className="flex items-center gap-4">
        <Select 
          defaultValue="all"
          value={selectedTicker || "all"} 
          onValueChange={(value) => setSelectedTicker(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[160px] rounded-full bg-muted">
            <SelectValue placeholder="Ticker" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {tickerOptions.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* <Select 
          defaultValue="TITLE_REPORT"
          value={selectedDocType || "TITLE_REPORT"} 
          onValueChange={(value) => setSelectedDocType(value === "TITLE_REPORT" ? null : value)}
        >
          <SelectTrigger className="w-[160px] rounded-full bg-muted">
            <SelectValue placeholder="Doc Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {docTypeOptions.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select> */}
      </div>
    </section>
  )
}