"use client";

import { motion, useReducedMotion } from "motion/react";
import { pageEnter } from "@/lib/motion-presets";
import { WriteActions } from "./components/actions";
import { WriteEditor } from "./components/editor";
import { WritePreview } from "./components/preview";
import { WriteSidebar } from "./components/sidebar";
import { useLoadBlog } from "./hooks/use-load-blog";

export default function WritePage() {
  const reducedMotion = useReducedMotion();
  useLoadBlog();

  return (
    <motion.section
      className="write-shell"
      {...pageEnter(Boolean(reducedMotion))}
    >
      <div className="write-page-head">
        <div>
          <p className="home-section-kicker">Write</p>
          <h1 className="page-title">写文章</h1>
          <p className="page-description">
            使用 Markdown 编辑文章，保存时提交到 GitHub 仓库并等待部署刷新。
          </p>
        </div>
        <WriteActions />
      </div>
      <div className="write-layout">
        <WriteEditor />
        <WriteSidebar />
      </div>
      <WritePreview />
    </motion.section>
  );
}
