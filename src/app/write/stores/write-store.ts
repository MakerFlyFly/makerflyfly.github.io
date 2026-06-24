"use client";

import { create } from "zustand";
import type { BlogConfig } from "@/types/content";
import { normalizeDate, toSlug } from "@/lib/utils";
import type { ImageAsset, WriteState } from "../types";

interface WriteStore extends WriteState {
  setField: <K extends keyof WriteState>(field: K, value: WriteState[K]) => void;
  setTags: (tags: string[]) => void;
  addImages: (images: ImageAsset[]) => void;
  removeImage: (id: string) => void;
  loadDraft: (slug: string, config: BlogConfig, markdown: string) => void;
  resetDraft: () => void;
  toIndexItem: () => {
    slug: string;
    title: string;
    date: string;
    summary: string;
    tags: string[];
    category?: string;
    cover?: string;
    hidden?: boolean;
  };
}

const initialState: WriteState = {
  slug: "",
  originalSlug: null,
  title: "",
  date: normalizeDate(""),
  summary: "",
  tags: [],
  category: "",
  cover: "",
  hidden: false,
  markdown: "",
  images: [],
};

export const useWriteStore = create<WriteStore>((set, get) => ({
  ...initialState,
  setField: (field, value) =>
    set((state) => {
      const next = { [field]: value } as Pick<WriteState, typeof field>;
      if (field === "title" && !state.originalSlug && !state.slug) {
        return { ...next, slug: toSlug(String(value)) };
      }
      return next;
    }),
  setTags: (tags) => set({ tags }),
  addImages: (images) => set((state) => ({ images: [...state.images, ...images] })),
  removeImage: (id) =>
    set((state) => ({
      images: state.images.filter((image) => image.id !== id),
    })),
  loadDraft: (slug, config, markdown) =>
    set({
      slug,
      originalSlug: slug,
      title: config.title ?? "",
      date: normalizeDate(config.date ?? ""),
      summary: config.summary ?? "",
      tags: config.tags ?? [],
      category: config.category ?? "",
      cover: config.cover ?? "",
      hidden: Boolean(config.hidden),
      markdown,
      images: [],
    }),
  resetDraft: () => set({ ...initialState, date: normalizeDate("") }),
  toIndexItem: () => {
    const state = get();
    return {
      slug: toSlug(state.slug || state.title),
      title: state.title.trim(),
      date: normalizeDate(state.date),
      summary: state.summary.trim(),
      tags: state.tags,
      category: state.category.trim() || undefined,
      cover: state.cover.trim() || undefined,
      hidden: state.hidden || undefined,
    };
  },
}));
