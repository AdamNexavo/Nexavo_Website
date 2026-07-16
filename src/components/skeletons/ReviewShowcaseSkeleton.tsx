import { CheckCircle2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  showcaseBorder,
  showcaseCardShadow,
  showcaseShellShadow,
} from "@/components/skeletons/showcase-tokens";

const GoogleMark = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

type ReviewShowcaseSkeletonProps = {
  size?: "section" | "catalog";
  className?: string;
};

export const ReviewShowcaseSkeleton = ({
  size = "section",
  className,
}: ReviewShowcaseSkeletonProps) => {
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
        <div className="flex items-center justify-between border-b border-[#ebe8e4] bg-[#f8f7f5] px-3 py-2.5 md:px-4">
          <div className="flex items-center gap-2">
            <GoogleMark />
            <p className="text-sm font-bold text-foreground">Review management</p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
            Actief
          </span>
        </div>

        <div className={cn("space-y-3 bg-white", compact ? "p-3" : "p-4 md:p-5")}>
          <div className="rounded-xl border border-[#ebe8e4] bg-[#fafaf9] shadow-block p-3">
            <div className="mb-2 flex items-start gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eceae6] text-[10px] font-semibold text-foreground">
                LB
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex flex-wrap items-center gap-2">
                  <p className="text-[11px] font-semibold text-foreground">Lisa van der Berg</p>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-amber-400 text-amber-400"
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                </div>
                <p className="mb-1.5 text-[10px] text-muted-foreground">2 weken geleden</p>
                <p className="text-[11px] leading-relaxed text-foreground">
                  Geweldige service! Zeer tevreden met het resultaat. Aanrader!
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#ebe8e4] bg-white shadow-block p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <p className="text-[10px] font-semibold text-foreground">Automatisch verzoek</p>
            </div>
            <p className="text-[10px] leading-relaxed text-muted-foreground">
              Hoi Lisa! Bedankt voor je bezoek gisteren. Zou je een review willen
              achterlaten?
            </p>
          </div>
        </div>
      </div>

      {!compact && (
        <div
          className={cn(
            "absolute -right-2 top-6 hidden rounded-2xl bg-white p-4 md:block",
            showcaseBorder,
            "border-primary/25",
            "shadow-[0_8px_24px_-16px_hsl(255_80%_60%_/_0.3)]",
          )}
        >
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">Nieuwe review</h4>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={2} />
          </div>
          <p className="mb-1 text-[11px] text-muted-foreground">Zojuist ontvangen</p>
          <p className="mb-1 text-2xl font-bold tabular-nums text-foreground">5,0</p>
          <p className="text-[11px] text-muted-foreground">5 sterren · Google</p>
        </div>
      )}

      {!compact && (
        <div
          className={cn(
            "absolute -left-2 bottom-4 hidden rounded-2xl bg-white p-4 lg:block",
            showcaseBorder,
            showcaseCardShadow,
          )}
        >
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">Reviews</h4>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={2} />
          </div>
          <p className="mb-1 text-[11px] text-muted-foreground">Gemiddelde score</p>
          <p className="mb-1 text-2xl font-bold tabular-nums text-foreground">4,9</p>
          <p className="text-[11px] text-muted-foreground">23 reviews ontvangen</p>
        </div>
      )}

      {compact && (
        <div
          className={cn(
            "absolute -bottom-2 -right-1 w-[7rem] rounded-2xl bg-white p-2",
            showcaseBorder,
            showcaseCardShadow,
          )}
        >
          <p className="text-[9px] font-semibold text-foreground">Nieuwe review</p>
          <p className="text-lg font-bold tabular-nums text-foreground">5,0</p>
        </div>
      )}
    </div>
  );
};
