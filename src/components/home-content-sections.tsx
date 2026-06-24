"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, GitBranch, Package } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { MotionCard } from "@/components/motion-primitives";
import { buttonTap, cardReveal, motionViewport } from "@/lib/motion-presets";
import { projects, visibleArticles } from "@/data/content";
import type { ProjectRecord } from "@/types/content";

const HOME_PROJECT_PREVIEW_LIMIT = 3;
const HOME_ARTICLE_PREVIEW_LIMIT = 4;

const previewProjects = projects.slice(0, HOME_PROJECT_PREVIEW_LIMIT);
const previewArticles = visibleArticles.slice(0, HOME_ARTICLE_PREVIEW_LIMIT);
const MotionLink = motion.create(Link);

export function HomeContentSections() {
  const reducedMotion = useReducedMotion();
  const reduced = Boolean(reducedMotion);

  return (
    <section className="home-content-sections" aria-label="Content preview">
      <motion.div
        className="home-section-head"
        {...cardReveal(reduced, 0)}
        viewport={motionViewport}
      >
        <div>
          <p className="home-section-kicker">Projects</p>
          <h2>项目</h2>
        </div>
        <MotionLink className="home-section-link" href="/projects" {...buttonTap(reduced)}>
          全部项目
          <ArrowRight size={16} />
        </MotionLink>
      </motion.div>

      <div className="home-project-preview">
        {previewProjects.length > 0 ? (
          previewProjects.map((project, index) => (
            <MotionCard
              className="home-preview-card"
              delay={index * 0.05}
              key={`${project.name}-${project.year}`}
            >
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
              <ProjectPreviewActions project={project} reduced={reduced} />
            </MotionCard>
          ))
        ) : (
          <MotionCard className="home-preview-card empty-state">
            <h3>还没有项目</h3>
            <p>发布第一个项目后会显示在这里。</p>
          </MotionCard>
        )}
      </div>

      <motion.div
        className="home-section-head home-section-head-spaced"
        {...cardReveal(reduced, 0)}
        viewport={motionViewport}
      >
        <div>
          <p className="home-section-kicker">Articles</p>
          <h2>文章</h2>
        </div>
        <MotionLink className="home-section-link" href="/blog" {...buttonTap(reduced)}>
          全部文章
          <ArrowRight size={16} />
        </MotionLink>
      </motion.div>

      <motion.div
        className="home-article-preview"
        {...cardReveal(reduced, 0)}
        viewport={motionViewport}
      >
        {previewArticles.length > 0 ? (
          previewArticles.map((article, index) => (
            <MotionLink
              className="home-article-row"
              href={`/blog/${article.slug}`}
              key={article.slug}
              style={{ transitionDelay: `${index * 35}ms` }}
              {...buttonTap(reduced)}
            >
              <time dateTime={article.date}>{article.date.slice(5)}</time>
              <span>
                <strong>{article.title}</strong>
                <small>{article.summary}</small>
              </span>
            </MotionLink>
          ))
        ) : (
          <div className="home-article-row empty-state">
            <span>
              <strong>还没有文章</strong>
              <small>发布第一篇文章后会显示在这里。</small>
            </span>
          </div>
        )}
      </motion.div>
    </section>
  );
}

function ProjectPreviewActions({
  project,
  reduced,
}: {
  project: ProjectRecord;
  reduced: boolean;
}) {
  return (
    <div className="project-actions home-preview-action">
      {project.url ? (
        <SmartProjectLink className="project-action" href={project.url} reduced={reduced}>
          <ExternalLink size={16} />
          Website
        </SmartProjectLink>
      ) : null}
      {project.github ? (
        <motion.a
          className="project-action"
          href={project.github}
          rel="noreferrer"
          target="_blank"
          {...buttonTap(reduced)}
        >
          <GitBranch size={16} />
          GitHub
        </motion.a>
      ) : null}
      {project.npm ? (
        <motion.a
          className="project-action"
          href={project.npm}
          rel="noreferrer"
          target="_blank"
          {...buttonTap(reduced)}
        >
          <Package size={16} />
          NPM
        </motion.a>
      ) : null}
    </div>
  );
}

function SmartProjectLink({
  href,
  className,
  reduced,
  children,
}: {
  href: string;
  className: string;
  reduced: boolean;
  children: React.ReactNode;
}) {
  if (href.startsWith("/")) {
    return (
      <MotionLink className={className} href={href} {...buttonTap(reduced)}>
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.a className={className} href={href} rel="noreferrer" target="_blank" {...buttonTap(reduced)}>
      {children}
    </motion.a>
  );
}
