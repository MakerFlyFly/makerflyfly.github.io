export interface BlogIndexItem {
  slug: string;
  title: string;
  tags: string[];
  date: string;
  summary?: string;
  cover?: string;
  hidden?: boolean;
  category?: string;
}

export type BlogConfig = Omit<BlogIndexItem, "slug">;

export interface ProjectRecord {
  name: string;
  year: number;
  description: string;
  image?: string;
  url: string;
  tags: string[];
  github?: string;
  npm?: string;
  category?: string;
}

export function projectKey(project: ProjectRecord) {
  return `${project.name}-${project.year}`
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
