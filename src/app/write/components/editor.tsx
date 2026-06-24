"use client";

import { ImagePlus } from "lucide-react";
import { fileToDataUrl } from "@/lib/file-utils";
import { useWriteStore } from "../stores/write-store";
import { markdownImageInsert } from "../services/push-blog";
import type { ImageAsset } from "../types";

async function createImageAsset(file: File): Promise<ImageAsset> {
  return {
    id: crypto.randomUUID(),
    file,
    previewUrl: await fileToDataUrl(file),
  };
}

export function WriteEditor() {
  const markdown = useWriteStore((state) => state.markdown);
  const setField = useWriteStore((state) => state.setField);
  const addImages = useWriteStore((state) => state.addImages);

  const appendImages = async (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      return;
    }

    const assets = await Promise.all(imageFiles.map(createImageAsset));
    addImages(assets);
    setField(
      "markdown",
      `${markdown}${markdown.endsWith("\n") ? "" : "\n\n"}${assets
        .map(markdownImageInsert)
        .join("\n\n")}`,
    );
  };

  return (
    <div
      className="write-editor-card"
      onDrop={(event) => {
        event.preventDefault();
        void appendImages(Array.from(event.dataTransfer.files));
      }}
      onDragOver={(event) => event.preventDefault()}
    >
      <div className="write-card-head">
        <div>
          <p className="home-section-kicker">Markdown</p>
          <h2>正文</h2>
        </div>
        <label className="icon-action">
          <ImagePlus size={18} />
          <span>图片</span>
          <input
            accept="image/*"
            multiple
            type="file"
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              event.currentTarget.value = "";
              void appendImages(files);
            }}
          />
        </label>
      </div>
      <textarea
        className="write-textarea"
        placeholder="# 标题&#10;&#10;在这里写 Markdown。可以拖入或粘贴图片。"
        value={markdown}
        onChange={(event) => setField("markdown", event.target.value)}
        onPaste={(event) => {
          const files = Array.from(event.clipboardData.files);
          if (files.some((file) => file.type.startsWith("image/"))) {
            event.preventDefault();
            void appendImages(files);
          }
        }}
      />
    </div>
  );
}
