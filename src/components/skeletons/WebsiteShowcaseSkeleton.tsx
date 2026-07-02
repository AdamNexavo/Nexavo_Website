import { CheckCircle2, Globe, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  showcaseBorder,
  showcaseCardShadow,
  showcaseShellShadow,
} from "@/components/skeletons/showcase-tokens";

type WebsiteShowcaseSkeletonProps = {
  size?: "section" | "catalog";
  className?: string;
};

export const WebsiteShowcaseSkeleton = ({
  size = "section",
  className,
}: WebsiteShowcaseSkeletonProps) => {
  const compact = size === "catalog";

  return (
    <div
      className={cn(
        "relative w-full",
        compact ? "max-w-[252px]" : "max-w-lg",
        className,
      )}
    >
      <div
        className={cn(
          "overflow-hidden rounded-[1.25rem] bg-white md:rounded-[1.5rem]",
          showcaseBorder,
          showcaseShellShadow,
        )}
      >
        <div className="flex items-center gap-2.5 border-b border-[#ebe8e4] bg-[#f8f7f5] px-3 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#e0ddd8]" />
            <span className="h-2 w-2 rounded-full bg-[#e0ddd8]" />
            <span className="h-2 w-2 rounded-full bg-[#e0ddd8]" />
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg border border-[#ebe8e4] bg-white px-2.5 py-1">
            <Globe className="h-3 w-3 shrink-0 text-muted-foreground" strokeWidth={1.75} />
            <span className="truncate text-[10px] font-medium text-foreground">
              jouwbedrijf.nl
            </span>
          </div>
          <span className="hidden rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 sm:inline">
            Live
          </span>
        </div>

        <div className={cn("bg-white", compact ? "p-3" : "p-4 md:p-5")}>
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
                J
              </span>
              <span className="text-[11px] font-semibold text-foreground">Jouw bedrijf</span>
            </div>
            <div className="flex gap-2">
              {["Home", "Diensten", "Contact"].map((item) => (
                <span
                  key={item}
                  className={cn(
                    "text-[9px] font-medium",
                    item === "Home" ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div
            className={cn(
              "grid gap-3",
              compact ? "grid-cols-1" : "md:grid-cols-[1.1fr_0.9fr] md:gap-4",
            )}
          >
            <div className="space-y-2">
              <p
                className={cn(
                  "font-bold leading-tight tracking-tight text-foreground",
                  compact ? "text-sm" : "text-base md:text-lg",
                )}
              >
                Groei online met vertrouwen
              </p>
              <p className="text-[10px] leading-relaxed text-muted-foreground md:text-[11px]">
                Professionele website, klaar om bezoekers om te zetten in klanten.
              </p>
              <button
                type="button"
                className="mt-1 rounded-xl bg-primary px-3 py-1.5 text-[10px] font-semibold text-white"
              >
                Plan een gesprek
              </button>
            </div>
            <div
              className={cn(
                "overflow-hidden rounded-xl border border-[#ebe8e4] bg-gradient-to-br from-primary/15 via-primary/5 to-brand-orange/10",
                compact ? "h-20" : "h-24 md:h-28",
              )}
            />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { title: "Snel live", sub: "Binnen 7 dagen" },
              { title: "Op maat", sub: "Jouw merk" },
              { title: "Conversie", sub: "Meer aanvragen" },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-[#ebe8e4] bg-[#fafaf9] px-2 py-2 md:px-3 md:py-2.5"
              >
                <p className="text-[9px] font-semibold text-foreground">{item.title}</p>
                <p className="text-[8px] text-muted-foreground md:text-[9px]">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!compact && (
        <div
          className={cn(
            "absolute -left-2 top-1/2 hidden -translate-y-1/2 rounded-2xl bg-white p-4 lg:block",
            showcaseBorder,
            showcaseCardShadow,
          )}
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold text-foreground">Website</h4>
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          </div>
          <p className="mb-1 text-[11px] text-muted-foreground">Voortgang</p>
          <p className="mb-2 text-2xl font-bold tabular-nums text-foreground">84%</p>
          <div className="h-2 w-28 overflow-hidden rounded-full bg-[#f0eeea]">
            <div className="h-full w-[84%] rounded-full bg-primary" />
          </div>
        </div>
      )}

      {!compact && (
        <div
          className={cn(
            "absolute -bottom-3 -right-2 hidden rounded-2xl bg-white p-4 md:block",
            showcaseBorder,
            showcaseCardShadow,
          )}
        >
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">Reviews</h4>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={2} />
          </div>
          <p className="mb-1 text-[11px] text-muted-foreground">Gemiddelde score</p>
          <p className="mb-1 text-2xl font-bold tabular-nums text-foreground">5,0</p>
          <p className="text-[11px] text-muted-foreground">Lisa B. · zojuist</p>
        </div>
      )}
    </div>
  );
};
