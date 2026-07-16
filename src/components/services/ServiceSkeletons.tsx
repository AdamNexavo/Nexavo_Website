import type { ComponentType } from "react";
import {
  skeletonCard,
  skeletonInnerRow,
  skeletonShell,
} from "@/components/skeletons/showcase-tokens";
import {
  BookingCatalogSkeleton,
  ReviewCatalogSkeleton,
  WebsiteCatalogSkeleton,
} from "@/components/skeletons/ServiceCatalogSkeletons";
import type { ServiceSkeletonId } from "@/data/services";
import {
  Calendar,
  Globe,
  Link2,
  PenLine,
  Server,
  Star,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FloatingBadge = ({
  icon: Icon,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}) => (
  <div
    className={cn(
      "absolute z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#6a50ff] text-white shadow-lg ring-4 ring-[#f8f6f1]",
      className,
    )}
  >
    <Icon className="h-5 w-5" />
  </div>
);

const AutomationsSkeleton = () => (
  <div className="relative w-full max-w-[320px]">
    <div className={cn(skeletonShell, "p-4")}>
      <div className="mb-3 flex items-center justify-between">
        <div className="h-3 w-24 rounded bg-foreground/80" />
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
          3 taken
        </span>
      </div>
      <ul className="space-y-2.5">
        {[
          { label: "Bevestiging versturen", done: true },
          { label: "Reviewverzoek plannen", done: false },
          { label: "Agenda synchroniseren", done: false },
        ].map((item) => (
          <li key={item.label} className="flex items-center gap-2.5">
            <div
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                item.done
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-[#ebe8e4] bg-white",
              )}
            >
              {item.done && <span className="text-[9px]">✓</span>}
            </div>
            <span className="text-[11px] text-foreground/80">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className={cn("absolute -right-3 top-8 w-28 p-2.5", skeletonCard)}>
      <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
        Templates
      </p>
      <div className="space-y-1.5">
        <div className="h-2 w-full rounded bg-[#eceae6]" />
        <div className="h-2 w-4/5 rounded bg-[#eceae6]" />
      </div>
    </div>
    <FloatingBadge icon={Workflow} className="-bottom-3 right-4 bg-brand-orange" />
  </div>
);

const IntegrationsSkeleton = () => (
  <div className="relative w-full max-w-[340px]">
    <div className="grid grid-cols-2 gap-2.5">
      {[
        { label: "Calendly", color: "bg-blue-100" },
        { label: "Mollie", color: "bg-emerald-100" },
        { label: "Analytics", color: "bg-orange-100" },
        { label: "WhatsApp", color: "bg-green-100" },
      ].map((item) => (
        <div
          key={item.label}
          className={cn("p-3", skeletonCard, "shadow-card")}
        >
          <div className={cn("mb-2 h-7 w-7 rounded-lg", item.color)} />
          <div className="h-2 w-16 rounded bg-foreground/75" />
          <div className="mt-1.5 h-1.5 w-full rounded bg-[#eceae6]" />
        </div>
      ))}
    </div>
    <FloatingBadge icon={Link2} className="-right-2 top-1/2 -translate-y-1/2" />
  </div>
);

const HostingSkeleton = () => (
  <div className="relative w-full max-w-[260px]">
    <div className={cn(skeletonShell, "p-3")}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
            Uptime
          </p>
          <p className="text-xl font-bold text-foreground">99,9%</p>
        </div>
        <div className="rounded-full bg-[#f0f0f1] px-2 py-0.5 text-[9px] font-semibold text-foreground/80">
          Actief
        </div>
      </div>
      <div className="space-y-1.5">
        {["SSL certificaat", "Dagelijkse backup", "Updates"].map((row) => (
          <div
            key={row}
            className={cn("flex items-center justify-between px-2.5 py-1.5", skeletonInnerRow)}
          >
            <span className="text-[10px] text-foreground/80">{row}</span>
            <span className="text-[9px] font-semibold text-emerald-600">OK</span>
          </div>
        ))}
      </div>
    </div>
    <FloatingBadge icon={Server} className="-bottom-2 -left-1 h-9 w-9 bg-primary [&_svg]:h-4 [&_svg]:w-4" />
  </div>
);

const ContentSeoSkeleton = () => (
  <div className="relative w-full max-w-[320px]">
    <div className={cn(skeletonShell, "p-4")}>
      <p className="mb-3 text-[11px] font-semibold text-foreground">Pagina bewerken</p>
      <div className="mb-3 space-y-2">
        <div className="h-2.5 w-3/4 rounded bg-foreground/80" />
        <div className="h-2 w-full rounded bg-[#eceae6]" />
        <div className="h-2 w-5/6 rounded bg-[#eceae6]" />
      </div>
      <div className={cn("rounded-lg border border-dashed border-primary/30 bg-primary/[0.04] p-3")}>
        <p className="mb-1 text-[10px] font-medium text-primary">SEO-titel</p>
        <div className="h-2 w-full rounded bg-primary/20" />
      </div>
    </div>
    <div className={cn("absolute -right-2 top-6 w-32 p-3", skeletonCard)}>
      <div className="mb-2 h-8 w-full rounded bg-[#eceae6]" />
      <div className="rounded-md bg-primary px-2 py-1 text-center text-[10px] font-semibold text-white">
        Publiceren
      </div>
    </div>
    <FloatingBadge icon={PenLine} className="-bottom-3 right-6 bg-brand-orange" />
  </div>
);

const skeletonMap: Record<ServiceSkeletonId, ComponentType> = {
  websites: WebsiteCatalogSkeleton,
  boekingskalender: BookingCatalogSkeleton,
  "review-management": ReviewCatalogSkeleton,
  automatiseringen: AutomationsSkeleton,
  integraties: IntegrationsSkeleton,
  "hosting-onderhoud": HostingSkeleton,
  "content-seo": ContentSeoSkeleton,
};

const badgeMap: Partial<
  Record<ServiceSkeletonId, ComponentType<{ className?: string }>>
> = {
  websites: Globe,
  boekingskalender: Calendar,
  "review-management": Star,
};

export const ServiceSkeleton = ({
  id,
  size = "default",
}: {
  id: ServiceSkeletonId;
  size?: "default" | "compact" | "wide";
}) => {
  const Skeleton = skeletonMap[id];
  const BadgeIcon = badgeMap[id];

  const scaleClass =
    id === "hosting-onderhoud"
      ? "max-w-[250px] scale-[0.82] sm:scale-[0.86]"
      : size === "compact"
        ? "max-w-[240px] scale-[0.88] sm:scale-[0.92]"
        : size === "wide"
          ? "max-w-[380px] scale-[0.94] sm:scale-100"
          : "max-w-[320px] scale-[0.9] sm:scale-[0.96]";

  return (
    <div className={cn("relative mx-auto w-full", scaleClass)}>
      <Skeleton />
      {BadgeIcon && (
        <FloatingBadge
          icon={BadgeIcon}
          className={cn(
            id === "websites" && "-right-1 bottom-1",
            id === "boekingskalender" && "-right-1 bottom-0 h-9 w-9 [&_svg]:h-4 [&_svg]:w-4",
            id === "review-management" && "-right-1 top-2",
          )}
        />
      )}
    </div>
  );
};
