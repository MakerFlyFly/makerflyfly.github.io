import { ArticleGroups } from "@/components/content/article-groups";
import { PageShell } from "@/components/page-shell";
import { visibleArticles } from "@/data/content";
import { groupArticlesByYear } from "@/lib/groups";

export default function BlogPage() {
  const groups = groupArticlesByYear(visibleArticles);

  return (
    <PageShell
      title="文章"
      description="按年份归档写作、构建日志、设计笔记与实验记录。默认保持紧凑节奏，内容增长后按组展开。"
      countLabel={`${visibleArticles.length} 篇文章`}
    >
      <ArticleGroups groups={groups} />
    </PageShell>
  );
}
