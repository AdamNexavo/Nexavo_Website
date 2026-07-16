import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PricingPriceDisplay } from "@/components/ui/nex-ui";
import { formatMonthlyPriceDisplay } from "@/lib/portal/helpers";
import type { PricingPackage } from "@/data/pricing";
import type { MaintenancePackage } from "@/data/maintenance";

const portalOrange = {
  badge: "bg-[#FED7AA] text-[#C2410C]",
  border: "border-[#FED7AA]",
  surface: "bg-[#FFFBEB]",
  shadow: "shadow-[0_1px_2px_rgba(253,186,116,0.08)]",
  bar: "bg-[#FDBA74]",
} as const;

type PortalPricingSelectCardProps = {
  pkg: PricingPackage;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  compact?: boolean;
};

export function PortalPricingSelectRow({
  pkg,
  selected,
  onSelect,
  disabled,
}: Omit<PortalPricingSelectCardProps, "compact">) {
  const [expanded, setExpanded] = useState(false);
  const highlighted = pkg.highlighted ?? false;

  return (
    <div
      className={cn(
        "relative rounded-[10px] border bg-white transition-colors shadow-row",
        selected && "border-[#7547F8] ring-1 ring-[#7547F8]/20",
        !selected && highlighted && cn(portalOrange.border, portalOrange.surface, portalOrange.shadow),
        !selected && !highlighted && "border-[#E2E0DB]",
        disabled && "opacity-70",
      )}
    >
      {highlighted && !selected && (
        <span className={cn("absolute inset-y-1.5 left-0 w-0.5 rounded-r-full", portalOrange.bar)} aria-hidden />
      )}
      {pkg.badge && (
        <span className={cn("absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-px text-[9px] font-semibold shadow-sm", portalOrange.badge)}>
          {pkg.badge}
        </span>
      )}
      <div className="flex items-center gap-1.5 px-3 py-2">
        <button
          type="button"
          disabled={disabled}
          onClick={onSelect}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span
            className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
              selected ? "border-[#7547F8] bg-[#7547F8]" : "border-[#D1D5DB] bg-white",
            )}
          >
            {selected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
          </span>
          <span className="min-w-0 flex-1 text-[13px] font-semibold text-[#111111]">{pkg.name}</span>
          <span className="shrink-0 text-right leading-tight">
            {pkg.pricePrefix && (
              <span className="block text-[10px] font-medium uppercase tracking-wide text-[#9CA3AF]">
                {pkg.pricePrefix}
              </span>
            )}
            <span className="text-[14px] font-semibold text-[#111111]">{pkg.price}</span>
          </span>
        </button>
        <button
          type="button"
          aria-expanded={expanded}
          aria-label={expanded ? "Details verbergen" : "Details tonen"}
          onClick={() => setExpanded((open) => !open)}
          className="shrink-0 rounded-full p-1 text-[#9CA3AF] transition-colors hover:bg-[#F5F5F5] hover:text-[#6B7280]"
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
        </button>
      </div>
      {expanded && (
        <div className="border-t border-[#E2E0DB] px-3 py-2.5">
          <p className="text-[12px] leading-relaxed text-[#6B7280]">{pkg.description}</p>
          {pkg.priceDetail && (
            <p className="mt-1 text-[11px] text-[#9CA3AF]">{pkg.priceDetail}</p>
          )}
          <ul className="mt-2 space-y-1">
            {pkg.features.map((feature) => (
              <li key={feature} className="flex items-start gap-1.5 text-[11px] text-[#6B7280]">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-[#7547F8]" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function PortalMaintenanceSelectRow({
  pkg,
  selected,
  onSelect,
  disabled,
}: {
  pkg: MaintenancePackage;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const highlighted = pkg.highlighted ?? false;

  return (
    <div
      className={cn(
        "relative rounded-[10px] border bg-white transition-colors shadow-row",
        selected && "border-[#7547F8] ring-1 ring-[#7547F8]/20",
        !selected && highlighted && cn(portalOrange.border, portalOrange.surface, portalOrange.shadow),
        !selected && !highlighted && "border-[#E2E0DB]",
        disabled && "opacity-70",
      )}
    >
      {highlighted && !selected && (
        <span className={cn("absolute inset-y-1.5 left-0 w-0.5 rounded-r-full", portalOrange.bar)} aria-hidden />
      )}
      {pkg.badge && (
        <span className={cn("absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-px text-[9px] font-semibold shadow-sm", portalOrange.badge)}>
          {pkg.badge}
        </span>
      )}
      <div className="flex items-center gap-1.5 px-3 py-2">
        <button
          type="button"
          disabled={disabled}
          onClick={onSelect}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span
            className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
              selected ? "border-[#7547F8] bg-[#7547F8]" : "border-[#D1D5DB] bg-white",
            )}
          >
            {selected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
          </span>
          <span className="min-w-0 flex-1 text-[13px] font-semibold text-[#111111]">{pkg.name}</span>
          <span className="shrink-0 text-right leading-tight">
            <span className="text-[14px] font-semibold text-[#111111]">{formatMonthlyPriceDisplay(pkg.price)}</span>
          </span>
        </button>
        <button
          type="button"
          aria-expanded={expanded}
          aria-label={expanded ? "Details verbergen" : "Details tonen"}
          onClick={() => setExpanded((open) => !open)}
          className="shrink-0 rounded-full p-1 text-[#9CA3AF] transition-colors hover:bg-[#F5F5F5] hover:text-[#6B7280]"
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
        </button>
      </div>
      {expanded && (
        <div className="border-t border-[#E2E0DB] px-3 py-2.5">
          <p className="text-[12px] leading-relaxed text-[#6B7280]">{pkg.description}</p>
          <p className="mt-1 text-[11px] text-[#9CA3AF]">{pkg.priceNote}</p>
          <ul className="mt-2 space-y-1">
            {pkg.features.map((feature) => (
              <li key={feature} className="flex items-start gap-1.5 text-[11px] text-[#6B7280]">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-[#7547F8]" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function PortalPricingSelectCard({
  pkg,
  selected,
  onSelect,
  disabled,
  compact = false,
}: PortalPricingSelectCardProps) {
  const highlighted = pkg.highlighted ?? false;
  const featureLimit = compact ? 2 : 5;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "relative flex h-full w-full flex-col rounded-xl border bg-white text-left transition-all",
        compact ? "p-3.5" : "rounded-2xl p-6 md:p-7",
        highlighted ? "border-[#7547F8] shadow-md ring-1 ring-[#7547F8]/20" : "border-[#E2E0DB] shadow-sm",
        selected && !highlighted && "ring-2 ring-[#7547F8] ring-offset-2",
        !disabled && "hover:border-[#7547F8]/40 hover:shadow-lg",
        disabled && "cursor-not-allowed opacity-70",
      )}
    >
      {pkg.badge && (
        <span
          className={cn(
            "absolute -top-2.5 left-1/2 z-[2] -translate-x-1/2 rounded-full bg-[#7547F8] font-semibold text-white shadow-md",
            compact ? "px-2 py-0.5 text-[9px]" : "px-3 py-0.5 text-[11px]",
          )}
        >
          {pkg.badge}
        </span>
      )}
      <h3 className={cn("mb-0.5 font-bold text-foreground", compact ? "text-sm" : "mb-1 text-lg")}>
        {pkg.name}
      </h3>
      <div className={cn(compact && "scale-[0.92] origin-left")}>
        <PricingPriceDisplay price={pkg.price} pricePrefix={pkg.pricePrefix} priceDetail={pkg.priceDetail} />
      </div>
      <p
        className={cn(
          "flex-1 leading-relaxed text-muted-foreground",
          compact ? "mb-2 mt-1 line-clamp-2 text-[11px]" : "mb-4 text-sm",
        )}
      >
        {pkg.description}
      </p>
      <ul className={cn(compact ? "mb-3 space-y-1" : "mb-5 space-y-2")}>
        {pkg.features.slice(0, featureLimit).map((f) => (
          <li
            key={f}
            className={cn(
              "flex items-start gap-1.5 text-muted-foreground",
              compact ? "text-[11px]" : "gap-2 text-sm",
            )}
          >
            <Check
              className={cn(
                "shrink-0",
                compact ? "mt-0.5 h-3 w-3" : "mt-0.5 h-4 w-4",
                highlighted ? "text-primary" : "text-muted-foreground",
              )}
            />
            <span className="line-clamp-1">{f}</span>
          </li>
        ))}
      </ul>
      <span
        className={cn(
          "mt-auto block rounded-[10px] text-center font-medium",
          compact ? "py-1.5 text-[11px]" : "rounded-[12px] py-2.5 text-sm",
          selected ? "bg-primary text-primary-foreground" : "border border-[#E2E0DB] bg-white text-foreground",
        )}
      >
        {selected ? "Geselecteerd" : pkg.id === "maatwerk" ? "Offerte aanvragen" : "Kies dit pakket"}
      </span>
    </button>
  );
}

export function PortalCompareLink({ className }: { className?: string }) {
  return (
    <p className={cn("text-[11px] text-[#9CA3AF]", className)}>
      Niet zeker welk pakket?{" "}
      <a
        href="/pricing#vergelijking"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-[#7547F8] hover:underline"
      >
        Bekijk de vergelijkingstabel op de prijzenpagina
      </a>
      .
    </p>
  );
}
