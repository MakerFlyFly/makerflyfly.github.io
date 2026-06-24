"use client";

import Link from "next/link";
import { Edit3, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BlogPreview } from "@/components/blog/blog-preview";
import { loadBlog, type LoadedBlog } from "@/lib/load-blog";
import { getErrorMessage } from "@/lib/utils";

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = decodeURIComponent(params.slug);
  const [state, setState] = useState<{
    slug: string | null;
    blog: LoadedBlog | null;
    error: string | null;
  }>({ slug: null, blog: null, error: null });

  useEffect(() => {
    let canceled = false;

    loadBlog(slug)
      .then((data) => {
        if (!canceled) {
          setState({ slug, blog: data, error: null });
        }
      })
      .catch((reason) => {
        if (!canceled) {
          setState({ slug, blog: null, error: getErrorMessage(reason) });
        }
      });

    return () => {
      canceled = true;
    };
  }, [slug]);

  const blog = state.slug === slug ? state.blog : null;
  const error = state.slug === slug ? state.error : null;

  if (error) {
    return (
      <section className="page-shell">
        <div className="content-card empty-state">
          <h1>文章读取失败</h1>
          <p>{error}</p>
          <Link className="editor-button" href="/blog">
            返回文章列表
          </Link>
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="page-shell">
        <div className="content-card empty-state">
          <Loader2 className="spin" size={24} />
          <p>正在加载文章...</p>
        </div>
      </section>
    );
  }

  const { config, markdown } = blog;

  return (
    <section className="page-shell blog-detail-shell">
      <div className="blog-detail-head">
        <div>
          <p className="home-section-kicker">{config.category ?? "Article"}</p>
          <h1 className="page-title">{config.title}</h1>
          <p className="page-description">{config.summary}</p>
          <div className="tag-row">
            {(config.tags ?? []).map((tag) => (
              <span className="tag" key={tag}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <Link className="floating-edit-button" href={`/write/${slug}`}>
          <Edit3 size={17} />
          编辑
        </Link>
      </div>
      <BlogPreview markdown={markdown} />
    </section>
  );
}
