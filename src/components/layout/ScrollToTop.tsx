import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function getScrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

function scrollToHashTarget(id: string) {
  const target = document.getElementById(id);
  if (!target) return false;

  target.scrollIntoView({ behavior: getScrollBehavior(), block: "start" });
  return true;
}

export const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest("a[href*='#']");
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;

      const url = new URL(link.href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== pathname) return;
      if (!url.hash || url.hash === "#") return;

      const targetId = decodeURIComponent(url.hash.slice(1));
      if (!document.getElementById(targetId)) return;

      event.preventDefault();

      if (hash === url.hash) {
        scrollToHashTarget(targetId);
        return;
      }

      navigate(
        { pathname: url.pathname, search: url.search, hash: targetId },
        { preventScrollReset: true },
      );
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, [hash, navigate, pathname]);

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const targetId = decodeURIComponent(hash.slice(1));
    const timeout = window.setTimeout(() => scrollToHashTarget(targetId), 0);

    return () => window.clearTimeout(timeout);
  }, [pathname, search, hash]);

  return null;
};
