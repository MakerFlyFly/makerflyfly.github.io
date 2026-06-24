"use client";

import { Edit3, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BlogPreview } from "@/components/blog/blog-preview";
import { buttonTap, pageEnter } from "@/lib/motion-presets";
import { loadBlog, type LoadedBlog } from "@/lib/load-blog";
import { getErrorMessage } from "@/lib/utils";
import { useAuthStore } from "@/hooks/use-auth";

const MotionLink = motion.create(Link);

export function BlogDetailClient({ slug }: { slug: string }) {
  const reducedMotion = useReducedMotion();
  const canEdit = useAuthStore((state) => state.canEdit);
  const [state, setState] = useState<{
    slug: string | null;
    blog: LoadedBlog | null;
    error: string | null;
  }>({ slug: null, blog: null, error: null });

  const isPlaceholder = slug === "__empty__";

  useEffect(() => {
    if (isPlaceholder) {
      return;
    }

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
  }, [isPlaceholder, slug]);

  const blog = state.slug === slug ? state.blog : null;
  const error = state.slug === slug ? state.error : null;

  if (isPlaceholder || error) {
    return (
      <motion.section
        className="page-shell"
        {...pageEnter(Boolean(reducedMotion))}
      >
        <div className="content-card empty-state">
          <h1>文章不存在</h1>
          <p>{error ?? "这里还没有可公开访问的文章。"}</p>
          <MotionLink
            className="editor-button"
            href="/blog"
            {...buttonTap(Boolean(reducedMotion))}
          >
            返回文章列表
          </MotionLink>
        </div>
      </motion.section>
    );
  }

  if (!blog) {
    return (
      <motion.section
        className="page-shell"
        {...pageEnter(Boolean(reducedMotion))}
      >
        <div className="content-card empty-state">
          <Loader2 className="spin" size={24} />
          <p>正在加载文章...</p>
        </div>
      </motion.section>
    );
  }

  const { config, markdown } = blog;

  return (
    <motion.section
      className="page-shell blog-detail-shell"
      {...pageEnter(Boolean(reducedMotion))}
    >
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
        {canEdit ? (
          <MotionLink
            className="floating-edit-button"
            href={`/write?slug=${encodeURIComponent(slug)}`}
            {...buttonTap(Boolean(reducedMotion))}
          >
            <Edit3 size={17} />
            编辑
          </MotionLink>
        ) : null}
      </div>
      <BlogPreview markdown={markdown} />
    </motion.section>
  );
}
