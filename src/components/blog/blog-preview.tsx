"use client";

import { useMarkdownRender } from "@/hooks/use-markdown-render";

interface BlogPreviewProps {
  markdown: string;
}

export function BlogPreview({ markdown }: BlogPreviewProps) {
  const { content, toc, loading } = useMarkdownRender(markdown);

  return (
    <div className="article-layout">
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
    </div>
  );
}
