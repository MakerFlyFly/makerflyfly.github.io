"use client";

import { create } from "zustand";
import { getInstallationToken } from "@/lib/github-client";

const TOKEN_CACHE_KEY = "makerfly-github-token";

interface TokenCache {
  token: string;
  expiresAt: string;
}

interface AuthState {
  privateKey: string | null;
  token: string | null;
  expiresAt: string | null;
  setPrivateKey: (privateKey: string) => void;
  clearAuth: () => void;
  getToken: () => Promise<string>;
}

function readTokenCache(): TokenCache | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(TOKEN_CACHE_KEY);
    if (!raw) {
      return null;
    }

    const cache = JSON.parse(raw) as TokenCache;

    if (new Date(cache.expiresAt).getTime() - Date.now() < 60_000) {
      sessionStorage.removeItem(TOKEN_CACHE_KEY);
      return null;
    }

    return cache;
  } catch {
    return null;
  }
}

function writeTokenCache(cache: TokenCache) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(TOKEN_CACHE_KEY, JSON.stringify(cache));
}

export const useAuthStore = create<AuthState>((set, get) => ({
  privateKey: null,
  token: null,
  expiresAt: null,
  setPrivateKey: (privateKey) => set({ privateKey }),
  clearAuth: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(TOKEN_CACHE_KEY);
    }

    set({ privateKey: null, token: null, expiresAt: null });
  },
  getToken: async () => {
    const state = get();
    const cached =
      state.token && state.expiresAt
        ? { token: state.token, expiresAt: state.expiresAt }
        : readTokenCache();

    if (cached && new Date(cached.expiresAt).getTime() - Date.now() > 60_000) {
      set({ token: cached.token, expiresAt: cached.expiresAt });
      return cached.token;
    }

    if (!state.privateKey) {
      throw new Error("请先导入 GitHub App Private Key (.pem) 后再保存。");
    }

    const nextToken = await getInstallationToken(state.privateKey);
    const nextCache = {
      token: nextToken.token,
      expiresAt: nextToken.expires_at,
    };

    writeTokenCache(nextCache);
    set({ token: nextCache.token, expiresAt: nextCache.expiresAt });

    return nextCache.token;
  },
}));
