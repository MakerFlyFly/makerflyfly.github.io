"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export function RouteScrollReset() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const scrollRoot = document.querySelector<HTMLElement>(".site-root");

    if (!scrollRoot) {
      return;
    }

    if (window.location.hash) {
      // Restore the fragment inside the site's scroll container after navigation.
      const frame = requestAnimationFrame(() => {
        scrollRoot.querySelector(":target")?.scrollIntoView({ behavior: "instant" });
      });
      return () => cancelAnimationFrame(frame);
    }

    const previousScrollBehavior = scrollRoot.style.scrollBehavior;

    scrollRoot.style.scrollBehavior = "auto";
    scrollRoot.scrollTo({ top: 0, left: 0 });
    scrollRoot.style.scrollBehavior = previousScrollBehavior;
  }, [pathname]);

  return null;
}
