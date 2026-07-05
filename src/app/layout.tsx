import type { Metadata } from "next";
import { Toaster } from "sonner";
import { AppHeader } from "@/components/app-header";
import { BlurredBubblesBackground } from "@/components/blurred-bubbles-background";
import { RouteScrollReset } from "@/components/route-scroll-reset";
import { searchIndex } from "@/data/search-index";
import "./globals.css";

const siteDescription = "学习 · 成长 · 想象 · 创造";

export const metadata: Metadata = {
  title: "MakerFly.dev",
  description: siteDescription,
  openGraph: {
    title: "MakerFly.dev",
    description: siteDescription,
    url: "https://makerflyfly.github.io",
    siteName: "MakerFly.dev",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "MakerFly.dev",
    description: siteDescription,
  },
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
          <RouteScrollReset />
          <BlurredBubblesBackground />
          <div className="app-frame">
            <AppHeader searchItems={searchIndex} />
            <main className="page-main">{children}</main>
          </div>
          <Toaster richColors position="top-center" />
        </div>
      </body>
    </html>
  );
}
