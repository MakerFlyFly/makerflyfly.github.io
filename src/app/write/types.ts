import type { BlogIndexItem } from "@/types/content";

export interface ImageAsset {
  id: string;
  file: File;
  previewUrl: string;
  targetPath?: string;
}

export interface WriteState {
  slug: string;
  originalSlug: string | null;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  category: string;
  cover: string;
  hidden: boolean;
  markdown: string;
  images: ImageAsset[];
}

export type DraftBlogMeta = BlogIndexItem;
