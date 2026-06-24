import { projects, visibleArticles } from "@/data/content";
import type { SearchIndexItem } from "@/lib/search";

export const searchIndex: SearchIndexItem[] = [
  ...visibleArticles.map((article) => ({
    type: "article" as const,
    title: article.title,
    description: article.summary,
    href: `/blog#${article.slug}`,
    tags: article.tags,
    dateOrYear: article.date.slice(0, 4),
    searchableText: [
      article.title,
      article.summary,
      article.category,
      article.date,
      article.tags.join(" "),
    ].join(" "),
  })),
  ...projects.map((project) => ({
    type: "project" as const,
    title: project.name,
    description: project.description,
    href: `/projects#${project.slug}`,
    tags: project.tags,
    dateOrYear: String(project.year),
    searchableText: [
      project.name,
      project.description,
      project.category,
      String(project.year),
      project.tags.join(" "),
    ].join(" "),
  })),
];

export const contentCounts = {
  articles: visibleArticles.length,
  projects: projects.length,
};
