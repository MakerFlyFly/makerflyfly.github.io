"use client";

import { BlogPreview } from "@/components/blog/blog-preview";
import { usePreviewStore } from "../stores/preview-store";
import { useWriteStore } from "../stores/write-store";

export function WritePreview() {
  const previewOpen = usePreviewStore((state) => state.previewOpen);
  const markdown = useWriteStore((state) => state.markdown);

  if (!previewOpen) {
    return null;
  }

  return (
    <section className="write-preview-card">
      <div className="write-card-head">
        <div>
          <p className="home-section-kicker">Preview</p>
          <h2>预览</h2>
        </div>
      </div>
      <BlogPreview markdown={markdown || "预览会显示在这里。"} />
    </section>
  );
}
