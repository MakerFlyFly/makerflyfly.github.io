import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { contentCounts, searchIndex } from "@/data/search-index";
import "./globals.css";

export const metadata: Metadata = {
  title: "MakerFly.dev",
  description: "记录代码、写作、实验与创造的个人博客。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body>
        <div className="site-root">
          <div className="app-frame">
            <AppHeader counts={contentCounts} searchItems={searchIndex} />
            <main className="page-main">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
