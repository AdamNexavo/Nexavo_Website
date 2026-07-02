import type { ServiceSkeletonId } from "@/data/services";
import { ServiceSkeleton } from "@/components/services/ServiceSkeletons";
import {
  getServiceCatalogVariant,
  getServiceCatalogVariantBySkeleton,
  type ServiceCatalogVariant,
} from "@/lib/serviceCatalogVisual";
import { cn } from "@/lib/utils";

const shellStyles: Record<ServiceCatalogVariant, string> = {
  default:
    "min-h-[210px] px-5 pb-1 pt-6 sm:min-h-[230px] sm:px-6 sm:pt-7",
  compact:
    "min-h-[190px] px-4 pb-1 pt-5 sm:min-h-[205px] sm:px-5 sm:pt-6",
  wide:
    "min-h-[210px] px-5 pb-1 pt-6 sm:min-h-[235px] sm:px-7 sm:pt-7",
};

type ServiceCatalogVisualProps = {
  skeletonId: ServiceSkeletonId;
  slug?: string;
  variant?: ServiceCatalogVariant;
  className?: string;
};

/** Zelfde zwevende skeleton als op de diensten-cataloguskaart */
export const ServiceCatalogVisual = ({
  skeletonId,
  slug,
  variant,
  className,
}: ServiceCatalogVisualProps) => {
  const size =
    variant ??
    (slug ? getServiceCatalogVariant(slug) : getServiceCatalogVariantBySkeleton(skeletonId));

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-visible",
        shellStyles[size],
        className,
      )}
    >
      <ServiceSkeleton id={skeletonId} size={size} />
    </div>
  );
};
