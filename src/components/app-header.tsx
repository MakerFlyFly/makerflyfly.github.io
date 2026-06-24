"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, FolderKanban, Home } from "lucide-react";
import type { SearchIndexItem } from "@/lib/search";
import { GlobalSearch } from "@/components/global-search";
import { LogoMark } from "@/components/logo-mark";

const navItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/projects", label: "项目", icon: FolderKanban },
  { href: "/blog", label: "文章", icon: FileText },
];

interface AppHeaderProps {
  counts: {
    articles: number;
    projects: number;
  };
  searchItems: SearchIndexItem[];
}

export function AppHeader({ counts, searchItems }: AppHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand-link" href="/">
          <LogoMark />
          <span>MakerFly.dev</span>
        </Link>

        <nav className="site-nav" aria-label="主导航">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                className={active ? "nav-link active" : "nav-link"}
                href={item.href}
                key={item.href}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={18} strokeWidth={2.3} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          <div className="quick-stats" aria-label="内容入口">
            <Link className="stat-link" href="/blog">
              文章 <strong>{String(counts.articles).padStart(2, "0")}</strong>
            </Link>
            <Link className="stat-link" href="/projects">
              项目 <strong>{String(counts.projects).padStart(2, "0")}</strong>
            </Link>
          </div>
          <GlobalSearch items={searchItems} />
        </div>
      </div>
    </header>
  );
}
