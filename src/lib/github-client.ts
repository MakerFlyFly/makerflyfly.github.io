"use client";

import { KJUR, KEYUTIL } from "jsrsasign";
import { GITHUB_CONFIG, assertGitHubConfig } from "@/consts";

const API_BASE = "https://api.github.com";

export class GitHubApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

export interface TreeItem {
  path: string;
  mode: "100644" | "100755" | "040000" | "160000" | "120000";
  type: "blob" | "tree" | "commit";
  sha?: string | null;
  content?: string;
}

export interface GitHubContentFile {
  path: string;
  sha: string;
  content: string;
  type: string;
}

interface GitHubTreeResponse {
  tree: Array<{
    path: string;
    mode: TreeItem["mode"];
    type: TreeItem["type"];
    sha: string;
  }>;
}

function encodeGitHubPath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

async function githubFetch<T>(
  endpoint: string,
  token?: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new GitHubApiError(
      response.status,
      `GitHub API ${response.status}: ${body || response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}

export function createGitHubAppJWT(privateKey: string) {
  assertGitHubConfig();

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iat: now - 60,
    exp: now + 9 * 60,
    iss: GITHUB_CONFIG.APP_ID,
  };
  const key = KEYUTIL.getKey(privateKey) as unknown as string;

  return KJUR.jws.JWS.sign(
    "RS256",
    JSON.stringify(header),
    JSON.stringify(payload),
    key,
  );
}

export async function getInstallationToken(privateKey: string) {
  const jwt = createGitHubAppJWT(privateKey);
  const installation = await githubFetch<{ id: number }>(
    `/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/installation`,
    jwt,
  );

  if (!installation) {
    throw new Error("当前 GitHub App 没有可用 installation，请先把 App 安装到目标仓库。");
  }

  const tokenResponse = await githubFetch<{ token: string; expires_at: string }>(
    `/app/installations/${installation.id}/access_tokens`,
    jwt,
    { method: "POST" },
  );

  return tokenResponse;
}

export async function getRepoRef(token: string) {
  return githubFetch<{ object: { sha: string } }>(
    `/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/git/ref/heads/${GITHUB_CONFIG.BRANCH}`,
    token,
  );
}

export async function getCommit(token: string, sha: string) {
  return githubFetch<{ tree: { sha: string } }>(
    `/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/git/commits/${sha}`,
    token,
  );
}

export async function createBlob(
  token: string,
  content: string,
  encoding: "utf-8" | "base64" = "utf-8",
) {
  return githubFetch<{ sha: string }>(
    `/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/git/blobs`,
    token,
    {
      method: "POST",
      body: JSON.stringify({ content, encoding }),
    },
  );
}

export async function createTree(
  token: string,
  baseTreeSha: string,
  tree: TreeItem[],
) {
  return githubFetch<{ sha: string }>(
    `/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/git/trees`,
    token,
    {
      method: "POST",
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree,
      }),
    },
  );
}

export async function createCommit(
  token: string,
  message: string,
  treeSha: string,
  parentSha: string,
) {
  return githubFetch<{ sha: string; html_url: string }>(
    `/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/git/commits`,
    token,
    {
      method: "POST",
      body: JSON.stringify({
        message,
        tree: treeSha,
        parents: [parentSha],
      }),
    },
  );
}

export async function updateRef(token: string, commitSha: string) {
  return githubFetch(
    `/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/git/refs/heads/${GITHUB_CONFIG.BRANCH}`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify({ sha: commitSha }),
    },
  );
}

export async function readRepoFile(token: string, path: string) {
  const result = await githubFetch<GitHubContentFile>(
    `/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/contents/${encodeGitHubPath(path)}?ref=${GITHUB_CONFIG.BRANCH}`,
    token,
  );

  if (result.type !== "file") {
    throw new Error(`${path} 不是文件。`);
  }

  return {
    ...result,
    content: new TextDecoder().decode(
      Uint8Array.from(atob(result.content.replace(/\n/g, "")), (char) =>
        char.charCodeAt(0),
      ),
    ),
  };
}

export async function listRepoFilesRecursive(token: string, path: string) {
  const ref = await getRepoRef(token);
  const commit = await getCommit(token, ref.object.sha);
  const tree = await githubFetch<GitHubTreeResponse>(
    `/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/git/trees/${commit.tree.sha}?recursive=1`,
    token,
  );
  const prefix = path.endsWith("/") ? path : `${path}/`;

  return tree.tree.filter((item) => item.path.startsWith(prefix));
}

export async function commitTree(
  token: string,
  message: string,
  tree: TreeItem[],
) {
  const ref = await getRepoRef(token);
  const baseCommitSha = ref.object.sha;
  const baseCommit = await getCommit(token, baseCommitSha);
  const nextTree = await createTree(token, baseCommit.tree.sha, tree);
  const commit = await createCommit(token, message, nextTree.sha, baseCommitSha);

  await updateRef(token, commit.sha);

  return commit;
}
