"use client";

import Link from "next/link";
import { CheckCircle2, FileKey2, LogOut, PenLine, Shield, Upload } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { MotionButton, MotionLabel } from "@/components/motion-primitives";
import { GITHUB_CONFIG, getMissingGitHubConfig } from "@/consts";
import { useAuthStore } from "@/hooks/use-auth";
import { readFileAsText } from "@/lib/file-utils";
import { buttonTap, cardReveal, pageEnter } from "@/lib/motion-presets";

const MotionLink = motion.create(Link);

export default function AdminPage() {
  const reducedMotion = useReducedMotion();
  const reduced = Boolean(reducedMotion);
  const canEdit = useAuthStore((state) => state.canEdit);
  const setPrivateKey = useAuthStore((state) => state.setPrivateKey);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const missing = getMissingGitHubConfig();

  return (
    <motion.section className="page-shell" {...pageEnter(reduced)}>
      <div className="page-heading">
        <div>
          <p className="home-section-kicker">Admin</p>
          <h1 className="page-title">编辑后台</h1>
          <p className="page-description">
            这里只在当前浏览器内导入 GitHub App 私钥。访客没有私钥时只能浏览，不能提交文章或项目。
          </p>
        </div>
        <span className="page-count">{canEdit ? "已授权" : "只读"}</span>
      </div>

      <motion.div className="content-card admin-card" {...cardReveal(reduced, 0.05)}>
        <div className="admin-status">
          {canEdit ? <CheckCircle2 size={28} /> : <Shield size={28} />}
          <div>
            <h2>{canEdit ? "当前浏览器已启用编辑" : "当前浏览器处于只读模式"}</h2>
            <p>
              {canEdit
                ? "你可以进入写作页或项目页保存内容，保存会提交到 GitHub 仓库。"
                : "导入 GitHub App Private Key 后，本浏览器会显示编辑入口。"}
            </p>
          </div>
        </div>

        <div className="admin-config-grid">
          <span>Owner</span>
          <strong>{GITHUB_CONFIG.OWNER || "未配置"}</strong>
          <span>Repo</span>
          <strong>{GITHUB_CONFIG.REPO || "未配置"}</strong>
          <span>Branch</span>
          <strong>{GITHUB_CONFIG.BRANCH}</strong>
          <span>App ID</span>
          <strong>{GITHUB_CONFIG.APP_ID || "未配置"}</strong>
        </div>

        {missing.length > 0 ? (
          <p className="admin-warning">
            保存前还需要配置：{missing.join(", ")}
          </p>
        ) : null}

        <div className="toolbar-row admin-actions">
          <MotionLabel className="editor-button">
            <Upload size={17} />
            导入 .pem
            <input
              accept=".pem,.key,.txt"
              type="file"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.currentTarget.value = "";
                if (!file) {
                  return;
                }
                setPrivateKey(await readFileAsText(file));
                toast.success("私钥已导入当前浏览器。");
              }}
            />
          </MotionLabel>
          <MotionLink className="editor-button secondary" href="/write" {...buttonTap(reduced)}>
            <PenLine size={17} />
            写文章
          </MotionLink>
          <MotionLink className="editor-button secondary" href="/projects" {...buttonTap(reduced)}>
            <FileKey2 size={17} />
            编辑项目
          </MotionLink>
          {canEdit ? (
            <MotionButton className="editor-button danger" type="button" onClick={clearAuth}>
              <LogOut size={17} />
              退出编辑
            </MotionButton>
          ) : null}
        </div>
      </motion.div>
    </motion.section>
  );
}
