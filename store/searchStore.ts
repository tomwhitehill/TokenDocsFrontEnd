import { create } from 'zustand'

interface SearchState {
  query: string
  setQuery: (query: string) => void
  results: unknown[]
  setResults: (results: unknown[]) => void
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
  results: [],
  setResults: (results) => set({ results }),
}))