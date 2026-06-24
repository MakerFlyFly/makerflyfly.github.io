import Link from "next/link";
import { GitBranch, Mail, Rss } from "lucide-react";
import { LogoMark } from "@/components/logo-mark";

export default function Home() {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="hero-copy">
        <h1 className="hero-title" id="home-title">
          MakerFly
        </h1>
        <p className="hero-slogan">
          但凡人能想象之事，
          <br />
          必有人能将其实现。
        </p>
        <div className="hero-tags" aria-label="创作方向">
          <span>代码</span>
          <span>·</span>
          <span>写作</span>
          <span>·</span>
          <span>实验</span>
          <span>·</span>
          <span>创造</span>
        </div>
        <p className="hero-description">
          一个记录代码、产品想法、量化实验与游戏开发的个人博客。
          这里不是公司官网，而是 <strong>MakerFly</strong>{" "}
          的长期创作档案与实验控制台。
        </p>
      </div>

      <aside className="console-card" aria-label="MakerFly Console">
        <span className="console-index">01</span>
        <div className="avatar-panel">
          <LogoMark />
        </div>
        <h2 className="console-title">
          MakerFly <span>Console</span>
        </h2>
        <p className="console-desc">
          正在构建自己的工具、文章系统、实验室与小游戏世界。
        </p>
        <div className="console-divider" />
        <div className="social-row">
          <a
            className="social-link"
            href="https://github.com/MakerFly"
            rel="noreferrer"
            target="_blank"
            aria-label="GitHub"
          >
            <GitBranch size={25} />
          </a>
          <a className="social-link" href="mailto:hello@makerfly.dev" aria-label="邮件">
            <Mail size={25} />
          </a>
          <Link className="social-link" href="/blog" aria-label="文章">
            <Rss size={25} />
          </Link>
        </div>
      </aside>
    </section>
  );
}
