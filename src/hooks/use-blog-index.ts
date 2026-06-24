"use client";

import useSWR from "swr";
import type { BlogIndexItem } from "@/types/content";
import { sortBlogIndex, visibleBlogIndex } from "@/lib/blog-index";
import { useAuthStore } from "@/hooks/use-auth";

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`无法读取 ${url}`);
  }
  return response.json() as Promise<BlogIndexItem[]>;
};

export function useBlogIndex() {
  const privateKey = useAuthStore((state) => state.privateKey);
  const { data, error, isLoading, mutate } = useSWR("/blogs/index.json", fetcher);
  const allItems = sortBlogIndex(data ?? []);
  const visibleItems = visibleBlogIndex(allItems, Boolean(privateKey));

  return {
    allItems,
    visibleItems,
    error,
    isLoading,
    mutate,
  };
}
