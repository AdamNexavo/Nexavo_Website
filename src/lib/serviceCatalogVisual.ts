import type { ServiceSkeletonId } from "@/data/services";

export type ServiceCatalogVariant = "default" | "compact" | "wide";

export const getServiceCatalogVariant = (slug: string): ServiceCatalogVariant => {
  if (slug === "websites") return "wide";
  if (slug === "boekingskalender") return "compact";
  return "default";
};

export const getServiceCatalogVariantBySkeleton = (
  skeleton: ServiceSkeletonId,
): ServiceCatalogVariant => {
  if (skeleton === "websites") return "wide";
  if (skeleton === "boekingskalender") return "compact";
  return "default";
};
