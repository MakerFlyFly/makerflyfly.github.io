"use client";

import { useParams } from "next/navigation";
import { useLoadBlog } from "../hooks/use-load-blog";
import { WriteActions } from "../components/actions";
import { WriteEditor } from "../components/editor";
import { WritePreview } from "../components/preview";
import { WriteSidebar } from "../components/sidebar";

export default function EditBlogPage() {
  const params = useParams<{ slug: string }>();
  const slug = decodeURIComponent(params.slug);

  useLoadBlog(slug);

  return (
    <section className="write-shell">
      <div className="write-page-head">
        <div>
          <p className="home-section-kicker">Edit</p>
          <h1 className="page-title">编辑文章</h1>
          <p className="page-description">正在编辑：{slug}</p>
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
