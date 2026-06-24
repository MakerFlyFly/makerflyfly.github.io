"use client";

import { X } from "lucide-react";
import { useState } from "react";
import type { ProjectRecord } from "@/types/content";

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (project: ProjectRecord) => void;
}

export function CreateProjectDialog({ open, onClose, onCreate }: CreateProjectDialogProps) {
  const [name, setName] = useState("");

  if (!open) {
    return null;
  }

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }

    onCreate({
      name: trimmed,
      year: new Date().getFullYear(),
      description: "新的项目描述。",
      url: "",
      tags: [],
      category: "未分类",
    });
    setName("");
    onClose();
  };

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="dialog-card" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <div className="dialog-head">
          <h2>新增项目</h2>
          <button type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <label className="editor-field">
          <span>项目名称</span>
          <input autoFocus value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <div className="dialog-actions">
          <button className="editor-button secondary" type="button" onClick={onClose}>
            取消
          </button>
          <button className="editor-button" type="button" onClick={handleCreate}>
            创建
          </button>
        </div>
      </div>
    </div>
  );
}
