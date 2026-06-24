"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { buttonTap, pageEnter } from "@/lib/motion-presets";
import {
  ReferenceEmailIcon,
  ReferenceGithubIcon,
} from "@/components/reference-social-icons";

interface HomeHeroProps {
  articleCount: number;
  projectCount: number;
}

const MotionLink = motion.create(Link);

export function HomeHero({ articleCount, projectCount }: HomeHeroProps) {
  const reducedMotion = useReducedMotion();
  const reduced = Boolean(reducedMotion);

  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="hero-copy">
        <motion.h1
          className="hero-title"
          data-text="MakerFly"
          id="home-title"
          {...pageEnter(reduced, 0)}
        >
          MakerFly
        </motion.h1>
        <motion.p className="hero-slogan" {...pageEnter(reduced, 0.06)}>
          但凡人能想象之事，
          <br />
          必有人能将其实现。
        </motion.p>
        <motion.div
          className="hero-tags"
          aria-label="创作方向"
          {...pageEnter(reduced, 0.12)}
        >
          <span>代码</span>
          <span>·</span>
          <span>写作</span>
          <span>·</span>
          <span>实验</span>
          <span>·</span>
          <span>创造</span>
        </motion.div>
        <motion.p className="hero-description" {...pageEnter(reduced, 0.18)}>
          一个记录代码、产品想法、量化实验与游戏开发的个人博客。
          这里不是公司官网，而是 <strong>MakerFly</strong>{" "}
          的长期创作档案与实验控制台。
        </motion.p>
      </div>

      <motion.aside
        className="profile-card"
        aria-label="MakerFly profile"
        {...pageEnter(reduced, 0.16)}
      >
        <div className="avatar-frame" aria-hidden="true">
          <Image
            className="avatar-image avatar-open"
            src="/images/avatar/makerfly-open.png"
            alt=""
            width={320}
            height={320}
            priority
          />
          <Image
            className="avatar-image avatar-closed"
            src="/images/avatar/makerfly-closed.png"
            alt=""
            width={320}
            height={320}
          />
        </div>

        <div className="profile-stats" aria-label="内容统计">
          <MotionLink className="profile-stat" href="/blog" {...buttonTap(reduced)}>
            <span>文章</span>
            <strong>{String(articleCount).padStart(2, "0")}</strong>
          </MotionLink>
          <MotionLink className="profile-stat" href="/projects" {...buttonTap(reduced)}>
            <span>项目</span>
            <strong>{String(projectCount).padStart(2, "0")}</strong>
          </MotionLink>
        </div>

        <div className="social-row" aria-label="社交入口">
          <motion.a
            className="social-link social-link-github"
            href="https://github.com/MakerFly"
            rel="noreferrer"
            target="_blank"
            aria-label="GitHub"
            {...buttonTap(reduced)}
          >
            <ReferenceGithubIcon />
          </motion.a>
          <motion.a
            className="social-link social-link-email"
            href="mailto:hello@makerfly.dev"
            aria-label="邮件"
            {...buttonTap(reduced)}
          >
            <ReferenceEmailIcon />
          </motion.a>
        </div>
      </motion.aside>
    </section>
  );
}
