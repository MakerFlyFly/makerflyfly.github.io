import type { BlogIndexItem } from "@/types/content";

export function sortBlogIndex(items: BlogIndexItem[]) {
  return [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function mergeBlogIndexItem(
  items: BlogIndexItem[],
  item: BlogIndexItem,
) {
  const withoutCurrent = items.filter((entry) => entry.slug !== item.slug);
  return sortBlogIndex([...withoutCurrent, item]);
}

export function visibleBlogIndex(items: BlogIndexItem[], showHidden: boolean) {
  return showHidden ? sortBlogIndex(items) : sortBlogIndex(items.filter((item) => !item.hidden));
}

export function groupBlogsByYear(items: BlogIndexItem[]) {
  const groups = new Map<string, BlogIndexItem[]>();

  for (const item of sortBlogIndex(items)) {
    const year = item.date.slice(0, 4);
    const group = groups.get(year) ?? [];
    group.push(item);
    groups.set(year, group);
  }

  return [...groups.entries()].map(([year, groupItems]) => ({
    year,
    items: groupItems,
  }));
}

export function collectCategories(items: BlogIndexItem[]) {
  return Array.from(
    new Set(items.map((item) => item.category).filter(Boolean) as string[]),
  );
}
