"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp, ExternalLink, GitBranch, Package } from "lucide-react";
import { useEffect, useState } from "react";
import type { ProjectGroup } from "@/lib/groups";
import { projectKey, type ProjectRecord } from "@/types/content";

interface ProjectGroupsProps {
  groups: ProjectGroup[];
  initialVisible?: number;
}

export function ProjectGroups({ groups, initialVisible = 2 }: ProjectGroupsProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const expandHashTarget = () => {
      const targetId = decodeURIComponent(window.location.hash.slice(1));
      if (!targetId) {
        return;
      }

      const targetGroup = groups.find((group) =>
        group.items.some((project) => projectKey(project) === targetId),
      );

      if (!targetGroup) {
        return;
      }

      setExpandedGroups((current) => new Set(current).add(targetGroup.id));
      window.requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ block: "center" });
      });
    };

    expandHashTarget();
    window.addEventListener("hashchange", expandHashTarget);

    return () => window.removeEventListener("hashchange", expandHashTarget);
  }, [groups]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((current) => {
      const next = new Set(current);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  return (
    <div className="archive-stack">
      {groups.map((group) => {
        const expanded = expandedGroups.has(group.id);
        const visibleItems = expanded
          ? group.items
          : group.items.slice(0, initialVisible);
        const hasMore = group.items.length > initialVisible;
        const listId = `project-group-${group.id}`;

        return (
          <section className="archive-group" key={group.id}>
            <div className="archive-group-head">
              <h2 className="archive-group-title">
                {group.label}
                <span>{group.items.length} 个项目</span>
              </h2>
              {hasMore ? (
                <button
                  className="expand-button"
                  type="button"
                  aria-controls={listId}
                  aria-expanded={expanded}
                  onClick={() => toggleGroup(group.id)}
                >
                  {expanded ? "收起" : "展开"}
                  {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              ) : null}
            </div>

            <div className="project-grid" id={listId}>
              {visibleItems.map((project) => (
                <article
                  className="project-card"
                  id={projectKey(project)}
                  key={projectKey(project)}
                >
                  <div className="project-card-head">
                    <h3 className="project-title">{project.name}</h3>
                    <span className="project-year">{project.year}</span>
                  </div>
                  <div>
                    <p className="project-description">{project.description}</p>
                    <div className="tag-row">
                      {project.tags.map((tag) => (
                        <span className="tag" key={tag}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ProjectActionLinks project={project} />
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ProjectActionLinks({ project }: { project: ProjectRecord }) {
  return (
    <div className="project-actions">
      {project.url ? (
        <SmartLink className="project-action" href={project.url}>
          <ExternalLink size={16} />
          Website
        </SmartLink>
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

function SmartLink({
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
