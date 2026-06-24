export const GITHUB_CONFIG = {
  OWNER: process.env.NEXT_PUBLIC_GITHUB_OWNER ?? "MakerFlyFly",
  REPO: process.env.NEXT_PUBLIC_GITHUB_REPO ?? "makerflyfly.github.io",
  BRANCH: process.env.NEXT_PUBLIC_GITHUB_BRANCH ?? "master",
  APP_ID: process.env.NEXT_PUBLIC_GITHUB_APP_ID ?? "",
  ENCRYPT_KEY: process.env.NEXT_PUBLIC_GITHUB_ENCRYPT_KEY ?? "makerfly-dev",
};

export function getMissingGitHubConfig() {
  return [
    ["NEXT_PUBLIC_GITHUB_OWNER", GITHUB_CONFIG.OWNER],
    ["NEXT_PUBLIC_GITHUB_REPO", GITHUB_CONFIG.REPO],
    ["NEXT_PUBLIC_GITHUB_APP_ID", GITHUB_CONFIG.APP_ID],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);
}

export function assertGitHubConfig() {
  const missing = getMissingGitHubConfig();

  if (missing.length > 0) {
    throw new Error(`请先配置 GitHub App 环境变量：${missing.join(", ")}`);
  }
}
