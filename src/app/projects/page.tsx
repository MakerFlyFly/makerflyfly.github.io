"use client";

import { Edit3, Loader2, Plus, Save, Upload, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import initialProjects from "./list.json";
import { MotionButton, MotionLabel } from "@/components/motion-primitives";
import { cardReveal, motionViewport, pageEnter } from "@/lib/motion-presets";
import { readFileAsText } from "@/lib/file-utils";
import { getErrorMessage } from "@/lib/utils";
import { useAuthStore } from "@/hooks/use-auth";
import { projectKey, type ProjectRecord } from "@/types/content";
import { CreateProjectDialog } from "./components/create-dialog";
import { ProjectCard } from "./components/project-card";
import { pushProjects, type ProjectImageUpload } from "./services/push-projects";

export default function ProjectsPage() {
  const reducedMotion = useReducedMotion();
  const reduced = Boolean(reducedMotion);
  const pemInputRef = useRef<HTMLInputElement>(null);
  const [projects, setProjects] = useState<ProjectRecord[]>(
    () => initialProjects as ProjectRecord[],
  );
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [imageUploads, setImageUploads] = useState<ProjectImageUpload[]>([]);
  const privateKey = useAuthStore((state) => state.privateKey);
  const setPrivateKey = useAuthStore((state) => state.setPrivateKey);
  const getToken = useAuthStore((state) => state.getToken);

  const cancelEdit = () => {
    setProjects(initialProjects as ProjectRecord[]);
    setEditing(false);
    setImageUploads([]);
  };

  const updateProject = (index: number, nextProject: ProjectRecord) => {
    setProjects((current) =>
      current.map((project, currentIndex) =>
        currentIndex === index ? nextProject : project,
      ),
    );
  };

  const handleSave = async () => {
    if (!privateKey) {
      pemInputRef.current?.click();
      return;
    }

    setSaving(true);
    try {
      const token = await getToken();
      await pushProjects({ token, projects, images: imageUploads });
      toast.success("项目列表已提交，等待部署刷新。");
      setEditing(false);
      setImageUploads([]);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.section className="page-shell projects-shell" {...pageEnter(reduced)}>
      <div className="page-heading">
        <div>
          <h1 className="page-title">项目</h1>
          <p className="page-description">
            记录工具、系统和实验原型。编辑态下可以新增、修改、删除项目，并通过 GitHub App 保存到仓库。
          </p>
        </div>
        <span className="page-count">{projects.length} 个项目</span>
      </div>

      <motion.div
        className="toolbar-row"
        {...cardReveal(reduced, 0.05)}
        viewport={motionViewport}
      >
        {editing ? (
          <>
            <MotionButton className="editor-button secondary" type="button" onClick={() => setCreateOpen(true)}>
              <Plus size={17} />
              新项目
            </MotionButton>
            <MotionButton className="editor-button" disabled={saving} type="button" onClick={handleSave}>
              {saving ? <Loader2 className="spin" size={17} /> : <Save size={17} />}
              保存
            </MotionButton>
            <MotionButton className="editor-button secondary" type="button" onClick={cancelEdit}>
              <X size={17} />
              取消
            </MotionButton>
          </>
        ) : (
          <MotionButton className="editor-button" type="button" onClick={() => setEditing(true)}>
            <Edit3 size={17} />
            编辑项目
          </MotionButton>
        )}
        <MotionLabel className="editor-button secondary">
          <Upload size={17} />
          导入 .pem
          <input
            ref={pemInputRef}
            accept=".pem,.key,.txt"
            type="file"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.currentTarget.value = "";
              if (!file) {
                return;
              }
              setPrivateKey(await readFileAsText(file));
              toast.success("私钥已导入浏览器内存，请再次点击保存。");
            }}
          />
        </MotionLabel>
      </motion.div>

      <div className="editable-project-grid">
        {projects.map((project, index) => (
          <ProjectCard
            editing={editing}
            key={`${project.name}-${index}`}
            project={project}
            onChange={(nextProject) => updateProject(index, nextProject)}
            onDelete={() =>
              setProjects((current) =>
                current.filter((_, currentIndex) => currentIndex !== index),
              )
            }
            onImageFile={(file) => {
              setImageUploads((current) => [
                ...current.filter((upload) => upload.projectIndex !== index),
                { projectIndex: index, file },
              ]);
            }}
          />
        ))}
      </div>

      <CreateProjectDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(project) => {
          setProjects((current) => [project, ...current]);
          window.requestAnimationFrame(() => {
            document.getElementById(projectKey(project))?.scrollIntoView({ block: "center" });
          });
        }}
      />
    </motion.section>
  );
}
