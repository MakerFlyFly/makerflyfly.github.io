import katex from "katex";
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderFormula(source: string, displayMode: boolean) {
  const expression = source.trim();

  try {
    const rendered = katex.renderToString(expression, {
      displayMode,
      output: "mathml",
      throwOnError: false,
      strict: "ignore",
    });

    return displayMode ? `<div class="katex-display">${rendered}</div>` : rendered;
  } catch {
    const escaped = escapeHtml(expression);
    return displayMode
      ? `<pre class="math-fallback"><code>${escaped}</code></pre>`
      : `<code class="math-fallback">${escaped}</code>`;
  }
}

function renderMathInTextSegment(segment: string) {
  const codeSpans: string[] = [];
  const protectedSegment = segment.replace(/`[^`\n]*`/g, (match) => {
    const token = `@@MAKERFLY_CODE_SPAN_${codeSpans.length}@@`;
    codeSpans.push(match);
    return token;
  });

  const withDisplayMath = protectedSegment
    .replace(/\\\[([\s\S]+?)\\\]/g, (_match, expression: string) =>
      renderFormula(expression, true),
    )
    .replace(/\$\$([\s\S]+?)\$\$/g, (_match, expression: string) =>
      renderFormula(expression, true),
    );

  const withInlineMath = withDisplayMath.replace(
    /\\\(([\s\S]+?)\\\)/g,
    (_match, expression: string) => renderFormula(expression, false),
  );

  return codeSpans.reduce(
    (content, code, index) =>
      content
        .split(`@@MAKERFLY_CODE_SPAN_${index}@@`)
        .join(code),
    withInlineMath,
  );
}

function renderMath(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const rendered: string[] = [];
  let textBuffer: string[] = [];
  let inFence = false;

  const flushTextBuffer = () => {
    if (textBuffer.length === 0) {
      return;
    }

    rendered.push(renderMathInTextSegment(textBuffer.join("\n")));
    textBuffer = [];
  };

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      if (!inFence) {
        flushTextBuffer();
        inFence = true;
      } else {
        inFence = false;
      }

      rendered.push(line);
      continue;
    }

    if (inFence) {
      rendered.push(line);
    } else {
      textBuffer.push(line);
    }
  }

  flushTextBuffer();
  return rendered.join("\n");
}

function wrapMarkdownTables(html: string) {
  return html.replace(/<table>([\s\S]*?)<\/table>/g, (match) => {
    if (match.includes('class="article-table"')) {
      return match;
    }

    const table = match.replace("<table>", '<table class="article-table">');
    return `<div class="article-table-wrap">${table}</div>`;
  });
}

export async function renderMarkdown(markdown: string) {
  const toc: TocItem[] = [];
  const withAnchors = markdown
    .split(/\r?\n/)
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
  const withMath = renderMath(withAnchors);

  const html = await marked.parse(withMath, {
    async: false,
    gfm: true,
    breaks: true,
  });
  const htmlString = typeof html === "string" ? html : String(html);

  return {
    html: wrapMarkdownTables(htmlString),
    toc,
  };
}
