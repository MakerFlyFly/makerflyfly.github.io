import blogIndex from "../../../../public/blogs/index.json";
import type { BlogIndexItem } from "@/types/content";
import { BlogDetailClient } from "./blog-detail-client";

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const params = (blogIndex as BlogIndexItem[]).map((item) => ({
    slug: item.slug,
  }));

  return params.length > 0 ? params : [{ slug: "__empty__" }];
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <BlogDetailClient slug={decodeURIComponent(slug)} />;
}
