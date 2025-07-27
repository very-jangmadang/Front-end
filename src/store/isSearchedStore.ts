import { create } from 'zustand';

interface IsSearchCompleted {
  isSearchCompleted: boolean;
  setIsSearchCompleted: (v: boolean) => void;
}

export const useIsSearchCompleted = create<IsSearchCompleted>((set) => ({
  isSearchCompleted: false,
  setIsSearchCompleted: (v) => set({ isSearchCompleted: v }),
}));
