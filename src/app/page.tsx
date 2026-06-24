import { HomeContentSections } from "@/components/home-content-sections";
import { HomeHero } from "@/components/home-hero";
import { contentCounts } from "@/data/search-index";

export default function Home() {
  return (
    <>
      <HomeHero
        articleCount={contentCounts.articles}
        projectCount={contentCounts.projects}
      />
      <HomeContentSections />
    </>
  );
}
