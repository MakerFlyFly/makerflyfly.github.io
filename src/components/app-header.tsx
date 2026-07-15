"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, FolderKanban, Home } from "lucide-react";
import type { SearchIndexItem } from "@/lib/search";
import { GlobalSearch } from "@/components/global-search";

const navItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/projects", label: "项目", icon: FolderKanban },
  { href: "/blog", label: "文章", icon: FileText },
];

interface AppHeaderProps {
  searchItems: SearchIndexItem[];
}

export function AppHeader({ searchItems }: AppHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand-link" href="/" prefetch={false}>
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
                prefetch={false}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={18} strokeWidth={2.3} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          <GlobalSearch items={searchItems} />
        </div>
      </div>
    </header>
  );
}
