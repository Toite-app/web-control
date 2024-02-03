import { create } from "zustand";

import { persist } from "zustand/middleware";

export type NavigationStore = {
  isOpen: boolean;
  toggle: () => void;
};

export const navigationStore = create(
  persist<NavigationStore>(
    (set) => ({
      isOpen: false,
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "toite-navigation",
    }
  )
);

export const useNavigationStore = navigationStore;
