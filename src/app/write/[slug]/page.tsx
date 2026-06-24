"use client";

import { motion, useReducedMotion } from "motion/react";
import { useParams } from "next/navigation";
import { pageEnter } from "@/lib/motion-presets";
import { WriteActions } from "../components/actions";
import { WriteEditor } from "../components/editor";
import { WritePreview } from "../components/preview";
import { WriteSidebar } from "../components/sidebar";
import { useLoadBlog } from "../hooks/use-load-blog";

export default function EditBlogPage() {
  const reducedMotion = useReducedMotion();
  const params = useParams<{ slug: string }>();
  const slug = decodeURIComponent(params.slug);

  useLoadBlog(slug);

  return (
    <motion.section
      className="write-shell"
      {...pageEnter(Boolean(reducedMotion))}
    >
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
    </motion.section>
  );
}
