import type { WebsiteReference } from "./types";

export function createDefaultWebsiteReferences(): WebsiteReference[] {
  return [{ url: "", note: "" }];
}

export function normalizeWebsiteReferences(
  data: Partial<{ websiteReferences?: WebsiteReference[]; referenceWebsites?: string[] }>,
): WebsiteReference[] {
  if (data.websiteReferences?.length) {
    return data.websiteReferences;
  }
  const legacy = data.referenceWebsites ?? [];
  if (legacy.length === 0) return createDefaultWebsiteReferences();
  return legacy.map((url) => ({ url, note: "" }));
}
