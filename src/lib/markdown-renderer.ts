import { marked } from "marked";

export interface TocItem {
  id: string;
  level: number;
  text: string;
}

function stripInlineMarkdown(value: string) {
  return value
    .replace(/[`*_~[\]()#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyHeading(value: string, index: number) {
  const slug = stripInlineMarkdown(value)
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `heading-${index + 1}`;
}

export async function renderMarkdown(markdown: string) {
  const toc: TocItem[] = [];
  const withAnchors = markdown
    .split("\n")
    .map((line) => {
      const match = /^(#{2,3})\s+(.+)$/.exec(line);

      if (!match) {
        return line;
      }

      const level = match[1].length;
      const text = stripInlineMarkdown(match[2]);
      const id = slugifyHeading(text, toc.length);
      toc.push({ id, level, text });

      return `${"#".repeat(level)} <span id="${id}"></span>${match[2]}`;
    })
    .join("\n");

  const html = await marked.parse(withAnchors, {
    async: false,
    gfm: true,
    breaks: true,
  });

  return {
    html: typeof html === "string" ? html : String(html),
    toc,
  };
}
