import { create } from "zustand";

interface IIsSearchCompleted {
  isSearchCompleted: boolean;
  setIsSearchCompleted: (v:boolean) => void;
}

export const useIsSearchCompleted = create<IIsSearchCompleted>((set) => ({
  isSearchCompleted: false,
  setIsSearchCompleted: (v) => set({ isSearchCompleted: v }),
}));