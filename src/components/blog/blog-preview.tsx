"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMarkdownRender } from "@/hooks/use-markdown-render";
import { cardReveal, motionViewport } from "@/lib/motion-presets";

interface BlogPreviewProps {
  markdown: string;
}

export function BlogPreview({ markdown }: BlogPreviewProps) {
  const reducedMotion = useReducedMotion();
  const { content, toc, loading } = useMarkdownRender(markdown);

  return (
    <motion.div
      className="article-layout"
      {...cardReveal(Boolean(reducedMotion))}
      viewport={motionViewport}
    >
      <article className="article-view">
        {loading ? <p className="article-muted">正在渲染 Markdown...</p> : content}
      </article>
      {toc.length > 0 ? (
        <aside className="article-toc" aria-label="文章目录">
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
        </aside>
      ) : null}
    </motion.div>
  );
}
