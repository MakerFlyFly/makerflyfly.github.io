"use client";

import {
  commitTree,
  createBlob,
  GitHubApiError,
  listRepoFilesRecursive,
  readRepoFile,
  type TreeItem,
} from "@/lib/github-client";
import { fileToBase64, hashFile } from "@/lib/file-utils";
import { mergeBlogIndexItem, sortBlogIndex } from "@/lib/blog-index";
import { getFileExtension, toSlug } from "@/lib/utils";
import type { BlogIndexItem } from "@/types/content";
import type { ImageAsset, WriteState } from "../types";

interface PushBlogOptions {
  token: string;
  draft: WriteState;
}

async function readRemoteIndex(token: string): Promise<BlogIndexItem[]> {
  try {
    const file = await readRepoFile(token, "public/blogs/index.json");
    return JSON.parse(file.content) as BlogIndexItem[];
  } catch (error) {
    if (error instanceof GitHubApiError && error.status === 404) {
      return [];
    }
    throw error;
  }
}

async function uploadImages(images: ImageAsset[], slug: string, token: string) {
  const tree: TreeItem[] = [];
  const imageMap = new Map<string, string>();

  for (const image of images) {
    const hash = (await hashFile(image.file)).slice(0, 16);
    const extension = getFileExtension(image.file);
    const path = `public/blogs/${slug}/${hash}.${extension}`;
    const blob = await createBlob(token, await fileToBase64(image.file), "base64");
    tree.push({
      path,
      mode: "100644",
      type: "blob",
      sha: blob.sha,
    });
    imageMap.set(image.previewUrl, `/${path.replace(/^public\//, "")}`);
  }

  return { tree, imageMap };
}

function replaceLocalImageUrls(markdown: string, images: ImageAsset[], imageMap: Map<string, string>) {
  return images.reduce((content, image) => {
    const nextUrl = imageMap.get(image.previewUrl);
    return nextUrl ? content.split(image.previewUrl).join(nextUrl) : content;
  }, markdown);
}

export async function pushBlog({ token, draft }: PushBlogOptions) {
  const slug = toSlug(draft.slug || draft.title);

  if (!slug) {
    throw new Error("请填写文章 slug 或标题。");
  }

  if (draft.originalSlug && draft.originalSlug !== slug) {
    throw new Error("编辑已有文章时暂不支持修改 slug，请新建文章迁移内容。");
  }

  if (!draft.title.trim()) {
    throw new Error("请填写文章标题。");
  }

  const remoteIndex = await readRemoteIndex(token);
  const { tree: imageTree, imageMap } = await uploadImages(draft.images, slug, token);
  const markdown = replaceLocalImageUrls(draft.markdown, draft.images, imageMap);
  const item: BlogIndexItem = {
    slug,
    title: draft.title.trim(),
    date: draft.date,
    summary: draft.summary.trim(),
    tags: draft.tags,
    category: draft.category.trim() || undefined,
    cover: draft.cover.trim() || undefined,
    hidden: draft.hidden || undefined,
  };
  const nextIndex = mergeBlogIndexItem(remoteIndex, item);
  const categories = Array.from(
    new Set(sortBlogIndex(nextIndex).map((entry) => entry.category).filter(Boolean) as string[]),
  );

  const tree: TreeItem[] = [
    ...imageTree,
    {
      path: "public/blogs/index.json",
      mode: "100644",
      type: "blob",
      content: `${JSON.stringify(nextIndex, null, 2)}\n`,
    },
    {
      path: "public/blogs/categories.json",
      mode: "100644",
      type: "blob",
      content: `${JSON.stringify({ categories }, null, 2)}\n`,
    },
    {
      path: `public/blogs/${slug}/config.json`,
      mode: "100644",
      type: "blob",
      content: `${JSON.stringify(
        {
          title: item.title,
          date: item.date,
          summary: item.summary,
          tags: item.tags,
          category: item.category,
          cover: item.cover,
          hidden: item.hidden,
        },
        null,
        2,
      )}\n`,
    },
    {
      path: `public/blogs/${slug}/index.md`,
      mode: "100644",
      type: "blob",
      content: markdown,
    },
  ];

  return commitTree(token, `publish blog: ${slug}`, tree);
}

export async function deleteBlogs(token: string, slugs: string[]) {
  if (slugs.length === 0) {
    throw new Error("没有选择需要删除的文章。");
  }

  const remoteIndex = await readRemoteIndex(token);
  const nextIndex = remoteIndex.filter((item) => !slugs.includes(item.slug));
  const categories = Array.from(
    new Set(nextIndex.map((item) => item.category).filter(Boolean) as string[]),
  );
  const remoteFiles = await listRepoFilesRecursive(token, "public/blogs");
  const deleteTree: TreeItem[] = remoteFiles
    .filter((item) => slugs.some((slug) => item.path.startsWith(`public/blogs/${slug}/`)))
    .map((item) => ({
      path: item.path,
      mode: item.mode,
      type: item.type,
      sha: null,
    }));

  return commitTree(token, `delete blogs: ${slugs.join(", ")}`, [
    ...deleteTree,
    {
      path: "public/blogs/index.json",
      mode: "100644",
      type: "blob",
      content: `${JSON.stringify(nextIndex, null, 2)}\n`,
    },
    {
      path: "public/blogs/categories.json",
      mode: "100644",
      type: "blob",
      content: `${JSON.stringify({ categories }, null, 2)}\n`,
    },
  ]);
}

export async function saveBlogIndex(token: string, items: BlogIndexItem[]) {
  const sortedItems = sortBlogIndex(items);
  const categories = Array.from(
    new Set(sortedItems.map((item) => item.category).filter(Boolean) as string[]),
  );
  const configTree: TreeItem[] = sortedItems.map((item) => ({
    path: `public/blogs/${item.slug}/config.json`,
    mode: "100644",
    type: "blob",
    content: `${JSON.stringify(
      {
        title: item.title,
        date: item.date,
        summary: item.summary,
        tags: item.tags,
        category: item.category,
        cover: item.cover,
        hidden: item.hidden,
      },
      null,
      2,
    )}\n`,
  }));

  return commitTree(token, "update blog index", [
    ...configTree,
    {
      path: "public/blogs/index.json",
      mode: "100644",
      type: "blob",
      content: `${JSON.stringify(sortedItems, null, 2)}\n`,
    },
    {
      path: "public/blogs/categories.json",
      mode: "100644",
      type: "blob",
      content: `${JSON.stringify({ categories }, null, 2)}\n`,
    },
  ]);
}

export function markdownImageInsert(asset: ImageAsset) {
  return `![${asset.file.name}](${asset.previewUrl})`;
}
