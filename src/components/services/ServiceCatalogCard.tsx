import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { Service } from "@/data/services";
import { ServiceCatalogVisual } from "@/components/services/ServiceCatalogVisual";
import {
  getServiceCatalogVariant,
  type ServiceCatalogVariant,
} from "@/lib/serviceCatalogVisual";
import { cn } from "@/lib/utils";

type ServiceCatalogCardProps = {
  service: Service;
  className?: string;
  variant?: ServiceCatalogVariant;
};

const bodyStyles: Record<
  ServiceCatalogVariant,
  { body: string; title: string }
> = {
  default: {
    body: "px-5 pb-5 pt-1 sm:px-6 sm:pb-6",
    title: "text-lg sm:text-xl",
  },
  compact: {
    body: "px-4 pb-5 pt-1 sm:px-5 sm:pb-5",
    title: "text-lg sm:text-xl",
  },
  wide: {
    body: "px-5 pb-5 pt-1 sm:px-7 sm:pb-6",
    title: "text-xl sm:text-2xl",
  },
};

export const ServiceCatalogCard = ({
  service,
  className,
  variant,
}: ServiceCatalogCardProps) => {
  const cardVariant = variant ?? getServiceCatalogVariant(service.slug);
  const styles = bodyStyles[cardVariant];

  return (
    <Link
      to={`/diensten/${service.slug}`}
      className={cn("group block h-full", className)}
    >
      <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border/40 bg-[#f8f6f1] shadow-card transition-all duration-200 hover:border-border/70 hover:shadow-hover sm:rounded-[1.65rem]">
        <ServiceCatalogVisual
          skeletonId={service.skeleton}
          variant={cardVariant}
          className="flex-1 overflow-hidden"
        />

        <div className={cn("flex flex-col", styles.body)}>
          <h3
            className={cn(
              "mb-1.5 font-bold tracking-tight text-foreground",
              styles.title,
            )}
          >
            {service.title}
          </h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
            {service.description}
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
            {service.linkLabel}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </article>
    </Link>
  );
};
