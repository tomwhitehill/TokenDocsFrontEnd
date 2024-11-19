import { create } from 'zustand'

type FilterStore = {
  selectedTicker: string | null
  setSelectedTicker: (ticker: string | null) => void
  selectedDocType: string | null
  setSelectedDocType: (docType: string | null) => void
}

export const useFilterStore = create<FilterStore>((set) => ({
  selectedTicker: null,
  setSelectedTicker: (ticker) => set({ selectedTicker: ticker }),
  selectedDocType: null,
  setSelectedDocType: (docType) => set({ selectedDocType: docType }),
}))