import type { ClientAccount } from "@/lib/portal/types";
import { PortalProgressBar } from "@/components/portal/PortalUI";
import { getEffectiveProjectProgress } from "@/lib/portal/project-progress";
import { cn } from "@/lib/utils";

function SkeletonBar({
  className,
  tint,
  style,
}: {
  className?: string;
  tint?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("rounded-full animate-pulse", className)}
      style={{
        background: tint
          ? `linear-gradient(90deg, ${tint}18 0%, #ECECEC 50%, ${tint}12 100%)`
          : "#ECECEC",
        ...style,
      }}
    />
  );
}

function SkeletonBlock({
  className,
  tint,
}: {
  className?: string;
  tint?: string;
}) {
  return (
    <div
      className={cn("rounded-[6px] animate-pulse", className)}
      style={{
        background: tint
          ? `linear-gradient(135deg, ${tint}20 0%, ${tint}08 50%, #EFEFEF 100%)`
          : "#EFEFEF",
      }}
    />
  );
}

export function WebsitePreviewSkeleton({
  client,
  variant = "default",
}: {
  client: ClientAccount;
  variant?: "default" | "compact";
}) {
  const compact = variant === "compact";
  const o = client.onboarding;
  const effective = getEffectiveProjectProgress(client);
  const primary = o.colors.primary || "#7547F8";
  const secondary = o.colors.secondary || "#0B0B0D";
  const accent = o.colors.accent || "#F97316";
  const palette = [primary, accent, secondary, ...(o.colors.palette ?? [])].filter(
    (c, i, arr) => arr.indexOf(c) === i,
  );
  const logo = o.media.find((m) => m.name.toLowerCase().includes("logo"));

  const cardTints = [primary, accent, secondary];

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#E2E0DB] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="border-b border-[#E2E0DB] bg-[#F5F5F5] px-4 py-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">
              Website voortgang
            </p>
            <p className="text-[12px] font-semibold text-[#111111]">{effective.phase}</p>
          </div>
          <span className="text-[12px] font-semibold" style={{ color: primary }}>
            {effective.percent}%
          </span>
        </div>
        <PortalProgressBar percent={effective.percent} trackClassName="bg-white border border-[#E2E0DB]" />
      </div>

      <div className="bg-white">
        <div className="flex items-center justify-between gap-2 border-b border-[#E2E0DB]/70 px-3 py-2">
          <div className="flex items-center gap-1.5">
            {logo?.dataUrl ? (
              <img src={logo.dataUrl} alt="" className="h-5 w-5 rounded object-contain" />
            ) : (
              <span
                className="flex h-5 w-5 items-center justify-center rounded text-[8px] font-bold text-white"
                style={{ background: primary }}
              >
                {o.company.name?.[0]?.toUpperCase() ?? "N"}
              </span>
            )}
            <SkeletonBar className="h-2 w-14" tint={primary} />
          </div>
          <div className="hidden items-center gap-1.5 sm:flex">
            <span className="h-1 w-1 rounded-full" style={{ background: primary }} />
            {[18, 16, 14].map((w, i) => (
              <SkeletonBar
                key={w}
                className="h-1.5"
                style={{ width: w }}
                tint={i === 0 ? primary : undefined}
              />
            ))}
          </div>
        </div>

        <div
          className={cn("relative overflow-hidden px-3", compact ? "py-3" : "py-4")}
          style={{
            background: `linear-gradient(135deg, ${primary}12 0%, #FAFAFA 50%, ${accent}10 100%)`,
          }}
        >
          <div
            className="pointer-events-none absolute -right-4 -top-4 h-14 w-14 rounded-full opacity-50 blur-xl"
            style={{ background: primary }}
          />
          <div
            className="pointer-events-none absolute bottom-0 left-1/4 h-10 w-10 rounded-full opacity-35 blur-lg"
            style={{ background: accent }}
          />

          <div className="relative z-[1] space-y-1.5">
            <SkeletonBar className="h-1.5 w-16" tint={accent} />
            <SkeletonBar className={cn("h-2.5", compact ? "w-32" : "w-40")} tint={primary} />
            <SkeletonBar className={cn("h-1.5", compact ? "w-24" : "w-28")} />
            <div
              className="mt-1 h-4 w-16 animate-pulse rounded-full"
              style={{ background: `linear-gradient(90deg, ${primary}35, ${primary}18)` }}
            />
          </div>
        </div>

        {!compact && (
          <div className="grid grid-cols-3 gap-2 border-t border-[#E2E0DB]/70 px-3 py-2.5">
            {cardTints.map((tint, i) => (
              <div
                key={i}
                className="space-y-1 rounded-[8px] border p-2"
                style={{ borderColor: `${tint}22`, background: `${tint}06` }}
              >
                <SkeletonBlock className="h-5 w-full" tint={tint} />
                <SkeletonBar className="h-1 w-full" tint={tint} />
                <SkeletonBar className="h-1 w-2/3" />
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-1.5 border-t border-[#E2E0DB]/70 bg-[#FAFAFA] px-3 py-2">
          {palette.slice(0, 5).map((color, i) => (
            <span
              key={`${color}-${i}`}
              className="h-3 w-3 rounded-full border border-white shadow-sm ring-1 ring-[#E2E0DB]/40"
              style={{ background: color }}
            />
          ))}
          <span className="text-[10px] text-[#9CA3AF]">Huisstijlkleuren uit intake</span>
        </div>
      </div>
    </div>
  );
}
