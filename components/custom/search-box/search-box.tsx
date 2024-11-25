"use client";

import { useEffect, useState } from "react";
import {
  useSearchByMetadata,
  useGetAllDocuments,
} from "@/queries/documentQueries";
import { useSearchStore } from "@/store/searchStore";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchBox() {
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [keyOptions, setKeyOptions] = useState<string[]>([]);
  const [valueOptions, setValueOptions] = useState<string[]>([]);

  const { setQuery, setResults } = useSearchStore();
  const searchMutation = useSearchByMetadata();
  const { data: allDocuments } = useGetAllDocuments();

  const performSearch = (searchData: {
    inputData: { searchByMetadata: Array<Record<string, string>> };
  }) => {
    searchMutation.mutate(searchData, {
      onSuccess: (data: any) => {
        setResults(data);
        toast.success("Search completed successfully");
      },
      onError: (error: unknown) => {
        console.error("Search error:", error);
        setResults([]);
        toast.error("Search failed. Please try again.");
      },
    });
  };

  useEffect(() => {
    if (allDocuments?.result?.value) {
      const keySet = new Set<string>();
      allDocuments.result.value.map((doc: any) => {
        if (doc.customMetadata) {
          Object.keys(doc.customMetadata).map((key) => keySet.add(key));
        }
      });
      setKeyOptions(Array.from(keySet));
    }
  }, [allDocuments]);

  useEffect(() => {
    if (selectedKey && allDocuments?.result?.value) {
      const valueSet = new Set<string>();
      allDocuments.result.value.map((doc: any) => {
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
  }, [selectedKey, selectedValue, allDocuments]);

  const handleKeyChange = (key: string) => {
    setSelectedKey(key);
    setSelectedValue("");
  };

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
  };

  const clearSelection = () => {
    setSelectedKey("");
    setSelectedValue("");
    setQuery("");
  };

  return (
    <div className="relative flex items-center space-x-2">
      <Select value={selectedKey} onValueChange={handleKeyChange}>
        <SelectTrigger className="w-[180px] rounded-full bg-card">
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

      <Select
        value={selectedValue}
        onValueChange={handleValueChange}
        disabled={!selectedKey}
      >
        <SelectTrigger className="w-[180px] rounded-full bg-card">
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
      {/* <Button
        disabled={Boolean(selectedKey === "" ? true : false)}
        onClick={clearSelection}
        className="text-white rounded-full h-auto p-2"
      >
        <X />
      </Button> */}
    </div>
  );
}
