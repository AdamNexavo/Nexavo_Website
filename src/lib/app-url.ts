/**
 * Absolute site URL for SEO, canonical tags, Open Graph, and share/copy links only.
 * Do NOT use for in-app navigation — use relative routes from `@/lib/routes` instead.
 */
export function getAppUrl(): string {
  const fromEnv = import.meta.env.VITE_APP_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "https://nexavo.works";
}

export function getAbsoluteAppUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getAppUrl()}${normalized}`;
}
