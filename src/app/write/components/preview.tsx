"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BlogPreview } from "@/components/blog/blog-preview";
import { panelPopup } from "@/lib/motion-presets";
import { usePreviewStore } from "../stores/preview-store";
import { useWriteStore } from "../stores/write-store";

export function WritePreview() {
  const reducedMotion = useReducedMotion();
  const previewOpen = usePreviewStore((state) => state.previewOpen);
  const markdown = useWriteStore((state) => state.markdown);

  return (
    <AnimatePresence initial={false}>
      {previewOpen ? (
        <motion.section
          className="write-preview-card"
          {...panelPopup(Boolean(reducedMotion))}
        >
          <div className="write-card-head">
            <div>
              <p className="home-section-kicker">Preview</p>
              <h2>预览</h2>
            </div>
          </div>
          <BlogPreview markdown={markdown || "预览会显示在这里。"} />
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
