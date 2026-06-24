"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { pageEnter } from "@/lib/motion-presets";
import { useAuthStore } from "@/hooks/use-auth";
import { WriteActions } from "./components/actions";
import { WriteEditor } from "./components/editor";
import { WritePreview } from "./components/preview";
import { WriteSidebar } from "./components/sidebar";
import { useLoadBlog } from "./hooks/use-load-blog";

export function WritePageClient() {
  const reducedMotion = useReducedMotion();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug")?.trim() || undefined;
  const canEdit = useAuthStore((state) => state.canEdit);

  useLoadBlog(slug);

  if (!canEdit) {
    return (
      <motion.section
        className="write-shell"
        {...pageEnter(Boolean(reducedMotion))}
      >
        <div className="content-card empty-state">
          <LockKeyhole size={26} />
          <h1>需要编辑授权</h1>
          <p>请先进入隐藏后台导入 GitHub App Private Key，再编辑文章。</p>
          <Link className="editor-button" href="/admin">
            前往后台
          </Link>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="write-shell"
      {...pageEnter(Boolean(reducedMotion))}
    >
      <div className="write-page-head">
        <div>
          <p className="home-section-kicker">{slug ? "Edit" : "Write"}</p>
          <h1 className="page-title">{slug ? "编辑文章" : "写文章"}</h1>
          <p className="page-description">
            {slug
              ? `正在编辑：${slug}`
              : "使用 Markdown 编辑文章，保存时提交到 GitHub 仓库并等待部署刷新。"}
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
