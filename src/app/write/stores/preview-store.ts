"use client";

import { create } from "zustand";

interface PreviewStore {
  previewOpen: boolean;
  setPreviewOpen: (open: boolean) => void;
}

export const usePreviewStore = create<PreviewStore>((set) => ({
  previewOpen: true,
  setPreviewOpen: (previewOpen) => set({ previewOpen }),
}));
