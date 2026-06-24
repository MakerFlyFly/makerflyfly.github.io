"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, FolderKanban, Search, X } from "lucide-react";
import { motion } from "motion/react";
import { FormEvent, useMemo, useState } from "react";
import { searchContent } from "@/lib/search";
import type { SearchIndexItem, SearchResult } from "@/lib/search";

interface GlobalSearchProps {
  items: SearchIndexItem[];
}

export function GlobalSearch({ items }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const results = useMemo(() => searchContent(items, query), [items, query]);
  const articleResults = results.filter((result) => result.type === "article");
  const projectResults = results.filter((result) => result.type === "project");
  const hasQuery = query.trim().length > 0;
  const panelId = "global-search-results";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const firstResult = results[0];
    if (firstResult) {
      setIsOpen(false);
      router.push(firstResult.href);
    }
  };

  return (
    <div className="search-wrap">
      <form className="search-shell" role="search" onSubmit={handleSubmit}>
        <input
          className="search-input"
          role="combobox"
          aria-label="搜索文章和项目"
          aria-autocomplete="list"
          aria-controls={panelId}
          aria-expanded={isOpen && hasQuery}
          placeholder="搜索文章和项目"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsOpen(false);
              event.currentTarget.blur();
            }
          }}
        />
        {hasQuery ? (
          <button
            className="search-clear"
            type="button"
            aria-label="清空搜索"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
          >
            <X size={16} />
          </button>
        ) : (
          <button className="search-button" type="submit" aria-label="提交搜索">
            <Search size={16} />
          </button>
        )}
      </form>

      {isOpen && hasQuery ? (
        <motion.div
          id={panelId}
          className="search-panel"
          role="region"
          aria-label="搜索结果"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
        >
          {results.length === 0 ? (
            <div className="search-empty" role="status">
              没有匹配的文章或项目
            </div>
          ) : (
            <>
              <SearchGroup
                title="文章"
                results={articleResults}
                onNavigate={() => setIsOpen(false)}
              />
              <SearchGroup
                title="项目"
                results={projectResults}
                onNavigate={() => setIsOpen(false)}
              />
            </>
          )}
        </motion.div>
      ) : null}
    </div>
  );
}

interface SearchGroupProps {
  title: string;
  results: SearchResult[];
  onNavigate: () => void;
}

function SearchGroup({ title, results, onNavigate }: SearchGroupProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="search-group">
      <p className="search-group-title">{title}</p>
      {results.slice(0, 4).map((result) => {
        const Icon = result.type === "article" ? FileText : FolderKanban;

        return (
          <Link
            className="search-result"
            href={result.href}
            key={`${result.type}-${result.href}`}
            onClick={onNavigate}
          >
            <Icon size={18} />
            <span>
              <span className="search-result-title">{result.title}</span>
              <span className="search-result-desc">{result.description}</span>
            </span>
            <span className="search-result-meta">{result.dateOrYear}</span>
          </Link>
        );
      })}
    </div>
  );
}
