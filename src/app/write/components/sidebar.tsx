"use client";

import { X } from "lucide-react";
import { useWriteStore } from "../stores/write-store";

function splitTags(value: string) {
  return value
    .split(/[,\s，]+/g)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function WriteSidebar() {
  const {
    slug,
    originalSlug,
    title,
    date,
    summary,
    tags,
    category,
    cover,
    hidden,
    images,
    setField,
    setTags,
    removeImage,
  } = useWriteStore();

  return (
    <aside className="write-sidebar">
      <div className="write-sidebar-section">
        <p className="home-section-kicker">Meta</p>
        <label className="editor-field">
          <span>标题</span>
          <input
            value={title}
            onChange={(event) => setField("title", event.target.value)}
          />
        </label>
        <label className="editor-field">
          <span>Slug</span>
          <input
            disabled={Boolean(originalSlug)}
            value={slug}
            onChange={(event) => setField("slug", event.target.value)}
          />
        </label>
        <label className="editor-field">
          <span>日期</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setField("date", event.target.value)}
          />
        </label>
        <label className="editor-field">
          <span>摘要</span>
          <textarea
            rows={4}
            value={summary}
            onChange={(event) => setField("summary", event.target.value)}
          />
        </label>
        <label className="editor-field">
          <span>标签</span>
          <input
            value={tags.join(", ")}
            onChange={(event) => setTags(splitTags(event.target.value))}
          />
        </label>
        <label className="editor-field">
          <span>分类</span>
          <input
            value={category}
            onChange={(event) => setField("category", event.target.value)}
          />
        </label>
        <label className="editor-field">
          <span>封面 URL</span>
          <input
            value={cover}
            onChange={(event) => setField("cover", event.target.value)}
          />
        </label>
        <label className="editor-check">
          <input
            checked={hidden}
            type="checkbox"
            onChange={(event) => setField("hidden", event.target.checked)}
          />
          <span>隐藏文章</span>
        </label>
      </div>

      {images.length > 0 ? (
        <div className="write-sidebar-section">
          <p className="home-section-kicker">Images</p>
          <div className="write-image-list">
            {images.map((image) => (
              <div className="write-image-item" key={image.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" src={image.previewUrl} />
                <span>{image.file.name}</span>
                <button type="button" onClick={() => removeImage(image.id)}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
