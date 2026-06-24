import projectsList from "@/app/projects/list.json";
import type { BlogIndexItem, ProjectRecord } from "@/types/content";
import blogIndex from "../../public/blogs/index.json";

export type ArticleItem = BlogIndexItem;
export type ProjectItem = ProjectRecord;

export const articles: ArticleItem[] = [...(blogIndex as BlogIndexItem[])].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export const projects: ProjectItem[] = projectsList as ProjectRecord[];

export const visibleArticles = articles.filter((article) => !article.hidden);
