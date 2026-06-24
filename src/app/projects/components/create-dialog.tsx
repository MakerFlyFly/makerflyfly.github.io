"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { buttonTap, panelPopup } from "@/lib/motion-presets";
import type { ProjectRecord } from "@/types/content";

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (project: ProjectRecord) => void;
}

export function CreateProjectDialog({
  open,
  onClose,
  onCreate,
}: CreateProjectDialogProps) {
  const reducedMotion = useReducedMotion();
  const [name, setName] = useState("");

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
    <AnimatePresence>
      {open ? (
        <motion.div
          className="dialog-backdrop"
          role="presentation"
          onMouseDown={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            className="dialog-card"
            role="dialog"
            aria-modal="true"
            onMouseDown={(event) => event.stopPropagation()}
            {...panelPopup(Boolean(reducedMotion))}
          >
            <div className="dialog-head">
              <h2>新增项目</h2>
              <motion.button
                type="button"
                onClick={onClose}
                {...buttonTap(Boolean(reducedMotion))}
              >
                <X size={18} />
              </motion.button>
            </div>
            <label className="editor-field">
              <span>项目名称</span>
              <input
                autoFocus
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <div className="dialog-actions">
              <motion.button
                className="editor-button secondary"
                type="button"
                onClick={onClose}
                {...buttonTap(Boolean(reducedMotion))}
              >
                取消
              </motion.button>
              <motion.button
                className="editor-button"
                type="button"
                onClick={handleCreate}
                {...buttonTap(Boolean(reducedMotion))}
              >
                创建
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
