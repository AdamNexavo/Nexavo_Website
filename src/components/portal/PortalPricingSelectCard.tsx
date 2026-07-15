import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PricingPriceDisplay } from "@/components/ui/nex-ui";
import type { PricingPackage } from "@/data/pricing";

type PortalPricingSelectCardProps = {
  pkg: PricingPackage;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  compact?: boolean;
};

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
        "relative flex h-full w-full flex-col rounded-xl border text-left transition-all",
        compact ? "p-3.5" : "rounded-2xl p-6 md:p-7",
        highlighted ? "nex-pricing-highlight bg-[#f5f5f7]" : "border-border bg-[#f5f5f7] shadow-card",
        selected && "ring-2 ring-primary ring-offset-2",
        !disabled && "hover:border-primary/40 hover:shadow-lg",
        disabled && "cursor-not-allowed opacity-70",
      )}
    >
      {pkg.badge && (
        <span
          className={cn(
            "absolute -top-2.5 left-1/2 z-[2] -translate-x-1/2 rounded-full bg-[#F97316] font-semibold text-white shadow-md",
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
          selected ? "bg-primary text-primary-foreground" : "border border-border bg-white text-foreground",
        )}
      >
        {selected ? "Geselecteerd" : pkg.id === "maatwerk" ? "Offerte aanvragen" : "Kies dit pakket"}
      </span>
    </button>
  );
}

export function PortalCompareLink({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[14px] border border-[#E2E0DB] bg-[#FAFAF8] p-3.5", className)}>
      <p className="text-[12px] text-[#6B7280]">
        Niet zeker welk pakket? Bekijk onze{" "}
        <a
          href="/pricing#vergelijking"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[#7547F8] hover:underline"
        >
          vergelijkingstabel op de prijzenpagina
        </a>{" "}
        voor een volledig overzicht.
      </p>
    </div>
  );
}
