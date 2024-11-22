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
  const { selectedTicker, setSelectedTicker } = useFilterStore()
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

  return (
    <section className="bg-card flex items-center gap-4 py-4 px-8 border border-b">
      <h3 className="text-lg">Tickers</h3>
      <div className="flex items-center gap-4">
        <Select 
          defaultValue="all"
          value={selectedTicker || "all"} 
          onValueChange={(value) => setSelectedTicker(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-fit rounded-full bg-muted">
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
      </div>
    </section>
  )
}