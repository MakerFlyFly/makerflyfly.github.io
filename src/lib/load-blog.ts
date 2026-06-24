import type { BlogConfig, BlogIndexItem } from "@/types/content";

export interface LoadedBlog {
  slug: string;
  config: BlogConfig;
  markdown: string;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`无法读取 ${url}`);
  }

  return response.json() as Promise<T>;
}

async function fetchText(url: string) {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`无法读取 ${url}`);
  }

  return response.text();
}

export async function loadBlog(slug: string): Promise<LoadedBlog> {
  const [config, markdown] = await Promise.all([
    fetchJson<BlogConfig>(`/blogs/${slug}/config.json`),
    fetchText(`/blogs/${slug}/index.md`),
  ]);

  return { slug, config, markdown };
}

export async function loadBlogIndex() {
  return fetchJson<BlogIndexItem[]>("/blogs/index.json");
}
