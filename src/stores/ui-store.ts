import type { HabitFilterTab } from "@/constants/habits";
import { create } from "zustand";

type UiState = {
  homeTab: HabitFilterTab;
  selectedDate: string;
  createStep: 1 | 2;
  createHabitType: "build" | "quit";
  setHomeTab: (tab: HabitFilterTab) => void;
  setSelectedDate: (date: string) => void;
  setCreateStep: (step: 1 | 2) => void;
  setCreateHabitType: (type: "build" | "quit") => void;
  resetCreateFlow: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  homeTab: "all",
  selectedDate: new Date().toISOString().split("T")[0]!,
  createStep: 1,
  createHabitType: "build",
  setHomeTab: (homeTab) => set({ homeTab }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setCreateStep: (createStep) => set({ createStep }),
  setCreateHabitType: (createHabitType) => set({ createHabitType }),
  resetCreateFlow: () =>
    set({ createStep: 1, createHabitType: "build" }),
}));
