import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { projects, visibleArticles } from "@/data/content";

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
          查看全部
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="home-project-preview">
        {previewProjects.map((project) => (
          <article className="home-preview-card" key={project.slug}>
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
            <ProjectPreviewAction href={project.url} />
          </article>
        ))}
      </div>

      <div className="home-section-head home-section-head-spaced">
        <div>
          <p className="home-section-kicker">Articles</p>
          <h2>文章</h2>
        </div>
        <Link className="home-section-link" href="/blog">
          查看全部
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="home-article-preview">
        {previewArticles.map((article) => (
          <Link
            className="home-article-row"
            href={`/blog#${article.slug}`}
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

function ProjectPreviewAction({ href }: { href: string }) {
  const children = (
    <>
      <ExternalLink size={16} />
      查看
    </>
  );

  if (href.startsWith("/")) {
    return (
      <Link className="project-action home-preview-action" href={href}>
        {children}
      </Link>
    );
  }

  return (
    <a
      className="project-action home-preview-action"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}
