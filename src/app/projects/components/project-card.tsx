"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, GitBranch, ImagePlus, Package, Trash2 } from "lucide-react";
import { projectKey, type ProjectRecord } from "@/types/content";

interface ProjectCardProps {
  project: ProjectRecord;
  editing?: boolean;
  onChange?: (project: ProjectRecord) => void;
  onDelete?: () => void;
  onImageFile?: (file: File) => void;
}

function splitTags(value: string) {
  return value
    .split(/[,\s，]+/g)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function ProjectCard({
  project,
  editing = false,
  onChange,
  onDelete,
  onImageFile,
}: ProjectCardProps) {
  const key = projectKey(project);

  if (editing) {
    return (
      <article className="editable-project-card" id={key}>
        <div className="project-edit-media">
          {project.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="" src={project.image} />
          ) : (
            <span>{project.name.slice(0, 1) || "P"}</span>
          )}
          <label className="project-image-button">
            <ImagePlus size={16} />
            <input
              accept="image/*"
              type="file"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.currentTarget.value = "";
                if (file) {
                  onImageFile?.(file);
                  onChange?.({ ...project, image: URL.createObjectURL(file) });
                }
              }}
            />
          </label>
        </div>
        <div className="project-edit-fields">
          <label className="editor-field">
            <span>名称</span>
            <input
              value={project.name}
              onChange={(event) => onChange?.({ ...project, name: event.target.value })}
            />
          </label>
          <label className="editor-field">
            <span>年份</span>
            <input
              type="number"
              value={project.year}
              onChange={(event) =>
                onChange?.({ ...project, year: Number(event.target.value) || project.year })
              }
            />
          </label>
          <label className="editor-field full">
            <span>描述</span>
            <textarea
              rows={3}
              value={project.description}
              onChange={(event) =>
                onChange?.({ ...project, description: event.target.value })
              }
            />
          </label>
          <label className="editor-field">
            <span>Website</span>
            <input
              value={project.url}
              onChange={(event) => onChange?.({ ...project, url: event.target.value })}
            />
          </label>
          <label className="editor-field">
            <span>GitHub</span>
            <input
              value={project.github ?? ""}
              onChange={(event) =>
                onChange?.({ ...project, github: event.target.value || undefined })
              }
            />
          </label>
          <label className="editor-field">
            <span>NPM</span>
            <input
              value={project.npm ?? ""}
              onChange={(event) =>
                onChange?.({ ...project, npm: event.target.value || undefined })
              }
            />
          </label>
          <label className="editor-field">
            <span>标签</span>
            <input
              value={project.tags.join(", ")}
              onChange={(event) =>
                onChange?.({ ...project, tags: splitTags(event.target.value) })
              }
            />
          </label>
          <label className="editor-field">
            <span>分类</span>
            <input
              value={project.category ?? ""}
              onChange={(event) =>
                onChange?.({ ...project, category: event.target.value || undefined })
              }
            />
          </label>
        </div>
        <button className="card-delete-button" type="button" onClick={onDelete}>
          <Trash2 size={17} />
        </button>
      </article>
    );
  }

  return (
    <article className="editable-project-card readonly" id={key}>
      <div className="project-read-media">
        {project.image ? (
          <Image
            alt=""
            src={project.image}
            width={220}
            height={160}
            sizes="(max-width: 720px) 100vw, 220px"
          />
        ) : (
          <span>{project.name.slice(0, 1) || "P"}</span>
        )}
      </div>
      <div className="project-read-body">
        <div className="project-card-head">
          <h3 className="project-title">{project.name}</h3>
          <span className="project-year">{project.year}</span>
        </div>
        <p className="project-description">{project.description}</p>
        <div className="tag-row">
          {project.tags.map((tag) => (
            <span className="tag" key={tag}>
              #{tag}
            </span>
          ))}
        </div>
        <ProjectLinks project={project} />
      </div>
    </article>
  );
}

function ProjectLinks({ project }: { project: ProjectRecord }) {
  return (
    <div className="project-actions">
      {project.url ? (
        <SmartProjectLink className="project-action" href={project.url}>
          <ExternalLink size={16} />
          Website
        </SmartProjectLink>
      ) : null}
      {project.github ? (
        <a className="project-action" href={project.github} rel="noreferrer" target="_blank">
          <GitBranch size={16} />
          GitHub
        </a>
      ) : null}
      {project.npm ? (
        <a className="project-action" href={project.npm} rel="noreferrer" target="_blank">
          <Package size={16} />
          NPM
        </a>
      ) : null}
    </div>
  );
}

function SmartProjectLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  if (href.startsWith("/")) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <a className={className} href={href} rel="noreferrer" target="_blank">
      {children}
    </a>
  );
}
