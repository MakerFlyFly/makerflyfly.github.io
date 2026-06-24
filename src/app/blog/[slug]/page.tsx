"use client";

import { Edit3, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BlogPreview } from "@/components/blog/blog-preview";
import { buttonTap, pageEnter } from "@/lib/motion-presets";
import { loadBlog, type LoadedBlog } from "@/lib/load-blog";
import { getErrorMessage } from "@/lib/utils";

const MotionLink = motion.create(Link);

export default function BlogDetailPage() {
  const reducedMotion = useReducedMotion();
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
      <motion.section
        className="page-shell"
        {...pageEnter(Boolean(reducedMotion))}
      >
        <div className="content-card empty-state">
          <h1>文章读取失败</h1>
          <p>{error}</p>
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
        <MotionLink
          className="floating-edit-button"
          href={`/write/${slug}`}
          {...buttonTap(Boolean(reducedMotion))}
        >
          <Edit3 size={17} />
          编辑
        </MotionLink>
      </div>
      <BlogPreview markdown={markdown} />
    </motion.section>
  );
}
