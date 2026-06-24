import { ProjectGroups } from "@/components/content/project-groups";
import { PageShell } from "@/components/page-shell";
import { projects } from "@/data/content";
import { groupProjectsByCategory } from "@/lib/groups";

export default function ProjectsPage() {
  const groups = groupProjectsByCategory(projects);

  return (
    <PageShell
      title="项目"
      description="把工具、系统和实验原型归档在同一条线上。项目可以继续累积，分组展开不会打乱页面间距。"
      countLabel={`${projects.length} 个项目`}
    >
      <ProjectGroups groups={groups} />
    </PageShell>
  );
}
