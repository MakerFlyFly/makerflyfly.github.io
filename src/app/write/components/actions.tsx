"use client";

import { Eye, EyeOff, Loader2, Save, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { MotionButton, MotionLabel } from "@/components/motion-primitives";
import { getMissingGitHubConfig } from "@/consts";
import { useAuthStore } from "@/hooks/use-auth";
import { readFileAsText } from "@/lib/file-utils";
import { getErrorMessage } from "@/lib/utils";
import { pushBlog } from "../services/push-blog";
import { usePreviewStore } from "../stores/preview-store";
import { useWriteStore } from "../stores/write-store";

export function WriteActions() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const previewOpen = usePreviewStore((state) => state.previewOpen);
  const setPreviewOpen = usePreviewStore((state) => state.setPreviewOpen);
  const privateKey = useAuthStore((state) => state.privateKey);
  const setPrivateKey = useAuthStore((state) => state.setPrivateKey);
  const getToken = useAuthStore((state) => state.getToken);
  const draft = useWriteStore();

  const handleSave = async () => {
    const missing = getMissingGitHubConfig();
    if (missing.length > 0) {
      toast.error(`请先配置 GitHub App 环境变量：${missing.join(", ")}`);
      return;
    }

    if (!privateKey) {
      fileInputRef.current?.click();
      return;
    }

    setSaving(true);
    try {
      const token = await getToken();
      await pushBlog({ token, draft });
      toast.success("文章已提交，等待部署刷新。");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="write-actions">
      <MotionButton
        className="editor-button secondary"
        type="button"
        onClick={() => setPreviewOpen(!previewOpen)}
      >
        {previewOpen ? <EyeOff size={17} /> : <Eye size={17} />}
        {previewOpen ? "隐藏预览" : "显示预览"}
      </MotionButton>
      <MotionButton
        className="editor-button"
        disabled={saving}
        type="button"
        onClick={handleSave}
      >
        {saving ? <Loader2 className="spin" size={17} /> : <Save size={17} />}
        保存
      </MotionButton>
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
            const text = await readFileAsText(file);
            setPrivateKey(text);
            toast.success("私钥已导入浏览器内存，请再次点击保存。");
          }}
        />
      </MotionLabel>
    </div>
  );
}
