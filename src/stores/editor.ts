"use client";

import { create } from "zustand";
import type { PortfolioData } from "@/types/portfolio";

type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

type EditorStore = {
  data: PortfolioData | null;
  saveState: SaveState;
  setData: (data: PortfolioData) => void;
  patch: (partial: Partial<PortfolioData>) => void;
  patchProfile: (partial: Partial<PortfolioData["profile"]>) => void;
  patchContacts: (partial: Partial<PortfolioData["contacts"]>) => void;
  patchCard: (partial: Partial<PortfolioData["card"]>) => void;
  setSaveState: (s: SaveState) => void;
};

export const useEditorStore = create<EditorStore>((set) => ({
  data: null,
  saveState: "idle",
  setData: (data) => set({ data, saveState: "idle" }),
  patch: (partial) =>
    set((s) =>
      s.data ? { data: { ...s.data, ...partial }, saveState: "dirty" } : s
    ),
  patchProfile: (partial) =>
    set((s) =>
      s.data
        ? {
            data: { ...s.data, profile: { ...s.data.profile, ...partial } },
            saveState: "dirty",
          }
        : s
    ),
  patchContacts: (partial) =>
    set((s) =>
      s.data
        ? {
            data: { ...s.data, contacts: { ...s.data.contacts, ...partial } },
            saveState: "dirty",
          }
        : s
    ),
  patchCard: (partial) =>
    set((s) =>
      s.data
        ? {
            data: { ...s.data, card: { ...s.data.card, ...partial } },
            saveState: "dirty",
          }
        : s
    ),
  setSaveState: (saveState) => set({ saveState }),
}));
