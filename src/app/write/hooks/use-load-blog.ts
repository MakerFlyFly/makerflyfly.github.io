"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { loadBlog } from "@/lib/load-blog";
import { getErrorMessage } from "@/lib/utils";
import { useWriteStore } from "../stores/write-store";

export function useLoadBlog(slug?: string) {
  const loadDraft = useWriteStore((state) => state.loadDraft);
  const resetDraft = useWriteStore((state) => state.resetDraft);

  useEffect(() => {
    if (!slug) {
      resetDraft();
      return;
    }

    let canceled = false;

    loadBlog(slug)
      .then((blog) => {
        if (!canceled) {
          loadDraft(blog.slug, blog.config, blog.markdown);
        }
      })
      .catch((error) => {
        if (!canceled) {
          toast.error(getErrorMessage(error));
        }
      });

    return () => {
      canceled = true;
    };
  }, [loadDraft, resetDraft, slug]);
}
