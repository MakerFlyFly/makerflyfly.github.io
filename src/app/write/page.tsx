"use client";

import { useLoadBlog } from "./hooks/use-load-blog";
import { WriteActions } from "./components/actions";
import { WriteEditor } from "./components/editor";
import { WritePreview } from "./components/preview";
import { WriteSidebar } from "./components/sidebar";

export default function WritePage() {
  useLoadBlog();

  return (
    <section className="write-shell">
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
    </section>
  );
}
