export interface ArticleItem {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  category: string;
  hidden?: boolean;
}

export interface ProjectItem {
  slug: string;
  name: string;
  year: number;
  description: string;
  tags: string[];
  url: string;
  github?: string;
  image?: string;
  category: string;
}

export const articles: ArticleItem[] = [
  {
    slug: "console-first-principles",
    title: "把个人博客做成实验控制台",
    date: "2026-06-18",
    summary: "梳理 MakerFly.dev 的信息架构：首页负责表达，文章沉淀想法，项目记录可运行的产物。",
    tags: ["博客", "产品", "架构"],
    category: "构建日志",
  },
  {
    slug: "blue-gold-visual-system",
    title: "蓝金宇宙配色的界面节奏",
    date: "2026-05-26",
    summary: "用深蓝背景、青色高光与金色强调建立第一屏的识别度，同时保持内容页可长期阅读。",
    tags: ["设计系统", "CSS"],
    category: "设计笔记",
  },
  {
    slug: "small-tools-archive",
    title: "小工具不应该散落在角落",
    date: "2026-04-12",
    summary: "从临时脚本到可复用项目，记录工具如何变成长期维护的作品资产。",
    tags: ["工具", "项目"],
    category: "构建日志",
  },
  {
    slug: "writing-with-metrics",
    title: "给写作加入一点量化反馈",
    date: "2026-02-03",
    summary: "用轻量数据记录选题、完成度与复盘结果，让长期写作不只依赖灵感。",
    tags: ["写作", "量化"],
    category: "实验记录",
  },
  {
    slug: "game-loop-notes",
    title: "小游戏循环里的反馈密度",
    date: "2025-12-19",
    summary: "观察小型游戏原型里输入、反馈、奖励之间的节奏，避免把交互做成只有按钮的流程。",
    tags: ["游戏", "交互"],
    category: "实验记录",
  },
  {
    slug: "personal-knowledge-map",
    title: "个人知识地图的三层结构",
    date: "2025-09-08",
    summary: "把资料、思考和产出分层，给后续文章与项目扩展预留稳定入口。",
    tags: ["知识管理", "文章"],
    category: "设计笔记",
  },
];

export const projects: ProjectItem[] = [
  {
    slug: "makerfly-console",
    name: "MakerFly Console",
    year: 2026,
    description: "个人工具、文章系统与实验记录的统一入口，也是当前博客首页的设计母题。",
    tags: ["Next.js", "React", "Tailwind"],
    url: "/",
    category: "个人系统",
  },
  {
    slug: "article-index-lab",
    name: "Article Index Lab",
    year: 2026,
    description: "面向长期文章积累的索引实验，支持分组、搜索和阅读路径整理。",
    tags: ["搜索", "信息架构"],
    url: "/blog",
    category: "个人系统",
  },
  {
    slug: "project-archive",
    name: "Project Archive",
    year: 2026,
    description: "把零散工具、游戏原型和产品想法收进同一个项目档案页。",
    tags: ["作品集", "归档"],
    url: "/projects",
    category: "个人系统",
  },
  {
    slug: "quant-notes",
    name: "Quant Notes",
    year: 2025,
    description: "记录量化实验的假设、指标、回测复盘与可复用片段。",
    tags: ["量化", "研究"],
    url: "/projects#quant-notes",
    category: "实验工具",
  },
  {
    slug: "mini-game-kit",
    name: "Mini Game Kit",
    year: 2025,
    description: "用于快速验证小游戏交互循环的前端原型集合。",
    tags: ["Game", "Prototype"],
    url: "/projects#mini-game-kit",
    category: "实验工具",
  },
];

export const visibleArticles = articles.filter((article) => !article.hidden);
