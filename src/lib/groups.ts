import type { ArticleItem, ProjectItem } from "@/data/content";

export interface ArticleGroup {
  id: string;
  label: string;
  items: ArticleItem[];
}

export interface ProjectGroup {
  id: string;
  label: string;
  items: ProjectItem[];
}

export function groupArticlesByYear(items: ArticleItem[]): ArticleGroup[] {
  const groups = new Map<string, ArticleItem[]>();

  for (const item of items) {
    const year = item.date.slice(0, 4);
    const group = groups.get(year) ?? [];
    group.push(item);
    groups.set(year, group);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, groupItems]) => ({
      id: year,
      label: `${year} 年`,
      items: groupItems.toSorted((a, b) => b.date.localeCompare(a.date)),
    }));
}

export function groupProjectsByCategory(items: ProjectItem[]): ProjectGroup[] {
  const groups = new Map<string, ProjectItem[]>();

  for (const item of items) {
    const group = groups.get(item.category) ?? [];
    group.push(item);
    groups.set(item.category, group);
  }

  return [...groups.entries()].map(([category, groupItems]) => ({
    id: category,
    label: category,
    items: groupItems.toSorted((a, b) => b.year - a.year),
  }));
}
