"use client";

import { commitTree, createBlob, type TreeItem } from "@/lib/github-client";
import { fileToBase64, hashFile } from "@/lib/file-utils";
import { getFileExtension } from "@/lib/utils";
import type { ProjectRecord } from "@/types/content";

export interface ProjectImageUpload {
  projectIndex: number;
  file: File;
}

export async function pushProjects({
  token,
  projects,
  images,
}: {
  token: string;
  projects: ProjectRecord[];
  images: ProjectImageUpload[];
}) {
  const imageTree: TreeItem[] = [];
  const imagePathByProject = new Map<string, string>();

  for (const upload of images) {
    const hash = (await hashFile(upload.file)).slice(0, 16);
    const extension = getFileExtension(upload.file);
    const path = `public/images/project/${hash}.${extension}`;
    const blob = await createBlob(token, await fileToBase64(upload.file), "base64");
    imageTree.push({
      path,
      mode: "100644",
      type: "blob",
      sha: blob.sha,
    });
    imagePathByProject.set(String(upload.projectIndex), `/${path.replace(/^public\//, "")}`);
  }

  const nextProjects = projects.map((project, index) => (
    imagePathByProject.has(String(index))
      ? { ...project, image: imagePathByProject.get(String(index)) }
      : project
  ));

  return commitTree(token, "update projects", [
    ...imageTree,
    {
      path: "src/app/projects/list.json",
      mode: "100644",
      type: "blob",
      content: `${JSON.stringify(nextProjects, null, 2)}\n`,
    },
  ]);
}
