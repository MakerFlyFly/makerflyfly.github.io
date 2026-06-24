import Image from "next/image";
import Link from "next/link";
import { ReferenceEmailIcon, ReferenceGithubIcon } from "@/components/reference-social-icons";
import { contentCounts } from "@/data/search-index";

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
          这里不是公司官网，而是 <strong>MakerFly</strong> 的长期创作档案与实验控制台。
        </p>
      </div>

      <aside className="profile-card" aria-label="MakerFly profile">
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
          <Link className="profile-stat" href="/blog">
            <span>文章</span>
            <strong>{String(contentCounts.articles).padStart(2, "0")}</strong>
          </Link>
          <Link className="profile-stat" href="/projects">
            <span>项目</span>
            <strong>{String(contentCounts.projects).padStart(2, "0")}</strong>
          </Link>
        </div>

        <div className="social-row" aria-label="社交入口">
          <a
            className="social-link social-link-github"
            href="https://github.com/MakerFly"
            rel="noreferrer"
            target="_blank"
            aria-label="GitHub"
          >
            <ReferenceGithubIcon />
          </a>
          <a className="social-link social-link-email" href="mailto:hello@makerfly.dev" aria-label="邮件">
            <ReferenceEmailIcon />
          </a>
        </div>
      </aside>
    </section>
  );
}
