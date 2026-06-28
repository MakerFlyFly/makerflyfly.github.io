"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMarkdownRender } from "@/hooks/use-markdown-render";
import { cardReveal, motionViewport } from "@/lib/motion-presets";

interface BlogPreviewProps {
  markdown: string;
  title?: string;
  tags?: string[];
  date?: string;
  summary?: string;
  cover?: string;
  slug?: string;
}

export function BlogPreview({
  markdown,
  title,
  tags = [],
  date,
  summary,
  cover,
}: BlogPreviewProps) {
  const reducedMotion = useReducedMotion();
  const { content, toc, loading } = useMarkdownRender(markdown);

  return (
    <motion.div
      className="article-layout"
      {...cardReveal(Boolean(reducedMotion))}
      viewport={motionViewport}
    >
      <article className="article-view">
        {title ? (
          <header className="article-readable-head">
            <h1>{title}</h1>
            {tags.length > 0 ? (
              <div className="article-readable-tags" aria-label="文章标签">
                {tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            ) : null}
            {date ? (
              <time className="article-readable-date" dateTime={date}>
                {date}
              </time>
            ) : null}
          </header>
        ) : null}
        {loading ? <p className="article-muted">正在渲染 Markdown...</p> : content}
      </article>
      {cover || summary || toc.length > 0 ? (
        <aside className="article-sidebar" aria-label="文章侧栏">
          {cover ? (
            <div className="article-side-card article-cover-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={title ? `${title} 封面` : "文章封面"} src={cover} />
            </div>
          ) : null}
          {summary ? (
            <div className="article-side-card article-summary-card">
              <strong>摘要</strong>
              <p>{summary}</p>
            </div>
          ) : null}
          {toc.length > 0 ? (
            <nav className="article-side-card article-toc" aria-label="文章目录">
              <strong>目录</strong>
              {toc.map((item) => (
                <a
                  className={item.level === 3 ? "article-toc-nested" : undefined}
                  href={`#${item.id}`}
                  key={item.id}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          ) : null}
        </aside>
      ) : null}
    </motion.div>
  );
}
