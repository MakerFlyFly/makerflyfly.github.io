import Link from "next/link";
import { ArrowRight, ExternalLink, GitBranch, Package } from "lucide-react";
import { projects, visibleArticles } from "@/data/content";
import type { ProjectRecord } from "@/types/content";

const HOME_PROJECT_PREVIEW_LIMIT = 3;
const HOME_ARTICLE_PREVIEW_LIMIT = 4;

const previewProjects = projects.slice(0, HOME_PROJECT_PREVIEW_LIMIT);
const previewArticles = visibleArticles.slice(0, HOME_ARTICLE_PREVIEW_LIMIT);

export function HomeContentSections() {
  return (
    <section className="home-content-sections" aria-label="Content preview">
      <div className="home-section-head">
        <div>
          <p className="home-section-kicker">Projects</p>
          <h2>项目</h2>
        </div>
        <Link className="home-section-link" href="/projects">
          全部项目
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="home-project-preview">
        {previewProjects.map((project) => (
          <article className="home-preview-card" key={`${project.name}-${project.year}`}>
            <div className="home-preview-card-head">
              <h3>{project.name}</h3>
              <span>{project.year}</span>
            </div>
            <p>{project.description}</p>
            <div className="tag-row">
              {project.tags.map((tag) => (
                <span className="tag" key={tag}>
                  #{tag}
                </span>
              ))}
            </div>
            <ProjectPreviewActions project={project} />
          </article>
        ))}
      </div>

      <div className="home-section-head home-section-head-spaced">
        <div>
          <p className="home-section-kicker">Articles</p>
          <h2>文章</h2>
        </div>
        <Link className="home-section-link" href="/blog">
          全部文章
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="home-article-preview">
        {previewArticles.map((article) => (
          <Link
            className="home-article-row"
            href={`/blog/${article.slug}`}
            key={article.slug}
          >
            <time dateTime={article.date}>{article.date.slice(5)}</time>
            <span>
              <strong>{article.title}</strong>
              <small>{article.summary}</small>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ProjectPreviewActions({ project }: { project: ProjectRecord }) {
  return (
    <div className="project-actions home-preview-action">
      {project.url ? (
        <SmartProjectLink className="project-action" href={project.url}>
          <ExternalLink size={16} />
          Website
        </SmartProjectLink>
      ) : null}
      {project.github ? (
        <a className="project-action" href={project.github} rel="noreferrer" target="_blank">
          <GitBranch size={16} />
          GitHub
        </a>
      ) : null}
      {project.npm ? (
        <a className="project-action" href={project.npm} rel="noreferrer" target="_blank">
          <Package size={16} />
          NPM
        </a>
      ) : null}
    </div>
  );
}

function SmartProjectLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  if (href.startsWith("/")) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <a className={className} href={href} rel="noreferrer" target="_blank">
      {children}
    </a>
  );
}
