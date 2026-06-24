"use client";

import parse from "html-react-parser";
import { useEffect, useMemo, useState } from "react";
import { renderMarkdown, type TocItem } from "@/lib/markdown-renderer";

export function useMarkdownRender(markdown: string) {
  const [state, setState] = useState<{
    source: string;
    html: string;
    toc: TocItem[];
  }>({ source: "", html: "", toc: [] });

  useEffect(() => {
    let canceled = false;

    renderMarkdown(markdown)
      .then((result) => {
        if (canceled) {
          return;
        }
        setState({ source: markdown, html: result.html, toc: result.toc });
      });

    return () => {
      canceled = true;
    };
  }, [markdown]);

  const content = useMemo(() => parse(state.html), [state.html]);

  return { content, toc: state.toc, loading: state.source !== markdown };
}
