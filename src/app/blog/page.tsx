"use client";

import Link from "next/link";
import { Edit3, Loader2, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { MotionButton, MotionLabel } from "@/components/motion-primitives";
import { cardReveal, motionViewport, pageEnter } from "@/lib/motion-presets";
import { groupBlogsByYear } from "@/lib/blog-index";
import { readFileAsText } from "@/lib/file-utils";
import { getErrorMessage } from "@/lib/utils";
import { useAuthStore } from "@/hooks/use-auth";
import { useBlogIndex } from "@/hooks/use-blog-index";
import type { BlogIndexItem } from "@/types/content";
import { deleteBlogs, saveBlogIndex } from "../write/services/push-blog";

const MotionLink = motion.create(Link);

export default function BlogPage() {
  const reducedMotion = useReducedMotion();
  const reduced = Boolean(reducedMotion);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { allItems, visibleItems, error, isLoading, mutate } = useBlogIndex();
  const [editing, setEditing] = useState(false);
  const [draftItems, setDraftItems] = useState<BlogIndexItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [saving, setSaving] = useState(false);
  const privateKey = useAuthStore((state) => state.privateKey);
  const setPrivateKey = useAuthStore((state) => state.setPrivateKey);
  const getToken = useAuthStore((state) => state.getToken);

  const items = editing ? draftItems : visibleItems;
  const groups = useMemo(() => groupBlogsByYear(items), [items]);

  const enterEdit = () => {
    setDraftItems(allItems);
    setSelected(new Set());
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraftItems([]);
    setSelected(new Set());
  };

  const updateDraftItem = (slug: string, patch: Partial<BlogIndexItem>) => {
    setDraftItems((current) =>
      current.map((item) => (item.slug === slug ? { ...item, ...patch } : item)),
    );
  };

  const requestToken = async () => {
    if (!privateKey) {
      fileInputRef.current?.click();
      throw new Error("请先导入 GitHub App Private Key (.pem) 后再保存。");
    }
    return getToken();
  };

  const handleDelete = async () => {
    if (selected.size === 0) {
      toast.info("请选择需要删除的文章。");
      return;
    }

    setSaving(true);
    try {
      const token = await requestToken();
      await deleteBlogs(token, Array.from(selected));
      await mutate();
      toast.success("文章删除提交成功。");
      cancelEdit();
    } catch (reason) {
      toast.error(getErrorMessage(reason));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveIndex = async () => {
    setSaving(true);
    try {
      const token = await requestToken();
      await saveBlogIndex(token, draftItems);
      await mutate();
      toast.success("文章索引已提交。");
      cancelEdit();
    } catch (reason) {
      toast.error(getErrorMessage(reason));
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.section className="page-shell blog-list-shell" {...pageEnter(reduced)}>
      <div className="page-heading">
        <div>
          <h1 className="page-title">文章</h1>
          <p className="page-description">
            按年份归档写作、构建日志、设计笔记与实验记录。进入编辑态后可以修改分类、隐藏状态或删除文章。
          </p>
        </div>
        <span className="page-count">{items.length} 篇文章</span>
      </div>

      <motion.div
        className="toolbar-row"
        {...cardReveal(reduced, 0.05)}
        viewport={motionViewport}
      >
        {editing ? (
          <>
            <MotionLink className="editor-button secondary" href="/write" {...(!reduced ? { whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 } } : {})}>
              <Plus size={17} />
              新文章
            </MotionLink>
            <MotionButton className="editor-button danger" disabled={saving} type="button" onClick={handleDelete}>
              <Trash2 size={17} />
              删除 {selected.size > 0 ? selected.size : ""}
            </MotionButton>
            <MotionButton className="editor-button" disabled={saving} type="button" onClick={handleSaveIndex}>
              {saving ? <Loader2 className="spin" size={17} /> : <Save size={17} />}
              保存索引
            </MotionButton>
            <MotionButton className="editor-button secondary" type="button" onClick={cancelEdit}>
              <X size={17} />
              取消
            </MotionButton>
          </>
        ) : (
          <MotionButton className="editor-button" type="button" onClick={enterEdit}>
            <Edit3 size={17} />
            编辑文章
          </MotionButton>
        )}
        <MotionLabel className="editor-button secondary">
          <Upload size={17} />
          导入 .pem
          <input
            ref={fileInputRef}
            accept=".pem,.key,.txt"
            type="file"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.currentTarget.value = "";
              if (!file) {
                return;
              }
              setPrivateKey(await readFileAsText(file));
              toast.success("私钥已导入浏览器内存。");
            }}
          />
        </MotionLabel>
      </motion.div>

      {isLoading ? (
        <div className="content-card empty-state">
          <Loader2 className="spin" size={24} />
          <p>正在读取文章索引...</p>
        </div>
      ) : error ? (
        <div className="content-card empty-state">
          <p>{getErrorMessage(error)}</p>
        </div>
      ) : (
        <div className="blog-year-stack">
          {groups.map((group, groupIndex) => (
            <motion.section
              className="blog-group-card"
              key={group.year}
              {...cardReveal(reduced, groupIndex * 0.04)}
              viewport={motionViewport}
            >
              <div className="archive-group-head">
                <h2 className="archive-group-title">
                  {group.year} 年
                  <span>{group.items.length} 篇文章</span>
                </h2>
              </div>
              <div className="blog-list">
                {group.items.map((item, index) => {
                  const checked = selected.has(item.slug);

                  return (
                    <motion.article
                      className={checked ? "blog-list-item selected" : "blog-list-item"}
                      key={item.slug}
                      layout={!reduced}
                      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
                      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      viewport={motionViewport}
                      transition={{ duration: 0.26, delay: index * 0.025 }}
                    >
                      {editing ? (
                        <input
                          checked={checked}
                          className="select-check"
                          type="checkbox"
                          onChange={(event) => {
                            setSelected((current) => {
                              const next = new Set(current);
                              if (event.target.checked) {
                                next.add(item.slug);
                              } else {
                                next.delete(item.slug);
                              }
                              return next;
                            });
                          }}
                        />
                      ) : (
                        <time dateTime={item.date}>{item.date.slice(5)}</time>
                      )}

                      <div>
                        <MotionLink
                          className="blog-title-link"
                          href={`/blog/${item.slug}`}
                          {...(!reduced ? { whileHover: { x: 2 } } : {})}
                        >
                          {item.title}
                        </MotionLink>
                        <p>{item.summary}</p>
                        <div className="tag-row">
                          {item.tags.map((tag) => (
                            <span className="tag" key={tag}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {editing ? (
                        <div className="blog-row-editor">
                          <label>
                            分类
                            <input
                              value={item.category ?? ""}
                              onChange={(event) =>
                                updateDraftItem(item.slug, { category: event.target.value })
                              }
                            />
                          </label>
                          <label className="editor-check compact">
                            <input
                              checked={Boolean(item.hidden)}
                              type="checkbox"
                              onChange={(event) =>
                                updateDraftItem(item.slug, { hidden: event.target.checked || undefined })
                              }
                            />
                            隐藏
                          </label>
                        </div>
                      ) : null}
                    </motion.article>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </div>
      )}
    </motion.section>
  );
}
