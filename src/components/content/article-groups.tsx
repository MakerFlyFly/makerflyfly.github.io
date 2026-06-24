"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import type { ArticleGroup } from "@/lib/groups";

interface ArticleGroupsProps {
  groups: ArticleGroup[];
  initialVisible?: number;
}

export function ArticleGroups({ groups, initialVisible = 3 }: ArticleGroupsProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const expandHashTarget = () => {
      const targetId = decodeURIComponent(window.location.hash.slice(1));
      if (!targetId) {
        return;
      }

      const targetGroup = groups.find((group) =>
        group.items.some((article) => article.slug === targetId),
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
        const listId = `article-group-${group.id}`;

        return (
          <section className="archive-group" key={group.id}>
            <div className="archive-group-head">
              <h2 className="archive-group-title">
                {group.label}
                <span>{group.items.length} 篇文章</span>
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

            <div className="article-list" id={listId}>
              {visibleItems.map((article) => (
                <Link
                  className="article-row"
                  id={article.slug}
                  href={`/blog/${article.slug}`}
                  key={article.slug}
                >
                  <time className="article-date" dateTime={article.date}>
                    {article.date.slice(5)}
                  </time>
                  <div>
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-summary">{article.summary}</p>
                    <div className="tag-row">
                      {article.tags.map((tag) => (
                        <span className="tag" key={tag}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
