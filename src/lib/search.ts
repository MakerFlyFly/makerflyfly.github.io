export type SearchResultType = "article" | "project";

export interface SearchIndexItem {
  type: SearchResultType;
  title: string;
  description: string;
  href: string;
  tags: string[];
  dateOrYear: string;
  searchableText: string;
}

export type SearchResult = Omit<SearchIndexItem, "searchableText">;

const normalize = (value: string) => value.toLowerCase().trim();

export function searchContent(
  items: SearchIndexItem[],
  rawQuery: string,
): SearchResult[] {
  const query = normalize(rawQuery);
  if (!query) {
    return [];
  }

  return items
    .filter((item) => normalize(item.searchableText).includes(query))
    .map((item) => ({
      type: item.type,
      title: item.title,
      description: item.description,
      href: item.href,
      tags: item.tags,
      dateOrYear: item.dateOrYear,
    }));
}
