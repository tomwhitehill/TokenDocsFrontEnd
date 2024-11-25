"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useFilterStore } from "@/store/filterStore";
import { useSearchStore } from "@/store/searchStore";
import {
  useSearchByMetadata,
  useGetAllDocuments,
} from "@/queries/documentQueries";

export default function FilterPanel() {
  const { selectedTicker, setSelectedTicker } = useFilterStore();
  const { results, setQuery, setResults } = useSearchStore();
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [keyOptions, setKeyOptions] = useState<string[]>([]);
  const [valueOptions, setValueOptions] = useState<string[]>([]);

  const searchMutation = useSearchByMetadata();
  const { data: allDocuments } = useGetAllDocuments();

  const tickerOptions = useMemo(() => {
    const tickerMap = new Map();
    tickerMap.set("all", "All Tickers");

    if (allDocuments?.result?.value) {
      allDocuments.result.value.map((item: any) => {
        if (item.customMetadata && item.customMetadata.ticker) {
          tickerMap.set(item.customMetadata.ticker, item.customMetadata.ticker);
        }
      });
    }

    if (selectedTicker && !tickerMap.has(selectedTicker)) {
      setSelectedTicker(null);
    }

    return Array.from(tickerMap, ([value, label]) => ({ value, label }));
  }, [results, selectedTicker, setSelectedTicker]);

  useEffect(() => {
    if (allDocuments?.result?.value) {
      const keySet = new Set<string>();
      allDocuments.result.value.map((doc: any) => {
        if (doc.customMetadata) {
          Object.keys(doc.customMetadata).forEach((key) => keySet.add(key));
        }
      });
      setKeyOptions(Array.from(keySet));
    }
  }, [allDocuments]);

  useEffect(() => {
    if (selectedKey && allDocuments?.result?.value) {
      const valueSet = new Set<string>();
      allDocuments.result.value.forEach((doc: any) => {
        if (doc.customMetadata && doc.customMetadata[selectedKey]) {
          valueSet.add(doc.customMetadata[selectedKey]);
        }
      });
      setValueOptions(Array.from(valueSet));
    }
  }, [selectedKey, allDocuments]);

  useEffect(() => {
    if (selectedKey && selectedValue) {
      const searchData = {
        inputData: {
          searchByMetadata: [{ [selectedKey]: selectedValue }],
        },
      };
      performSearch(searchData);
      setQuery(`${selectedKey}: ${selectedValue}`);
    } else if (allDocuments) {
      setResults(allDocuments);
    }
  }, [selectedKey, selectedValue, allDocuments, setQuery, setResults]);

  const performSearch = (searchData: {
    inputData: { searchByMetadata: Array<Record<string, string>> };
  }) => {
    searchMutation.mutate(searchData, {
      onSuccess: (data: any) => {
        setResults(data);
      },
      onError: (error: unknown) => {
        console.error("Search error:", error);
        setResults([]);
      },
    });
  };

  const handleKeyChange = (key: string) => {
    setSelectedKey(key);
    setSelectedValue("");
  };

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
  };

  const handleClearSelection = () => {
    setSelectedTicker(null);
    setSelectedKey("");
    setSelectedValue("");
    setQuery("");
    if (allDocuments) {
      setResults(allDocuments);
    }
  };

  return (
    <section className="bg-card flex items-center gap-4 py-4 px-8 border border-b">
      <h3 className="text-lg">Tickers:</h3>
      <div className="flex items-center gap-4">
        <Select
          defaultValue="all"
          value={selectedTicker || "all"}
          onValueChange={(value) =>
            setSelectedTicker(value === "all" ? null : value)
          }
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

        <h3 className="text-lg">CustomMetadata:</h3>
        <h3 className="text-lg">Keys</h3>
        <Select value={selectedKey} onValueChange={handleKeyChange}>
          <SelectTrigger className="w-fit rounded-full bg-muted">
            <SelectValue placeholder="Select key" />
          </SelectTrigger>
          <SelectContent>
            {keyOptions.map((key) => (
              <SelectItem key={key} value={key}>
                {key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <h3 className="text-lg">Values</h3>
        <Select
          value={selectedValue}
          onValueChange={handleValueChange}
          disabled={!selectedKey}
        >
          <SelectTrigger className="w-fit rounded-full bg-muted">
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {valueOptions.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleClearSelection}
          variant="outline"
          className="rounded-full text-white bg-primary transition-colors hover:text-white hover:bg-primaryTwo"
        >
          Clear Selection
        </Button>
      </div>
    </section>
  );
}

