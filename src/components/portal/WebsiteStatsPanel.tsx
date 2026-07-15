import { Lock } from "lucide-react";
import { useId } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ClientAccount } from "@/lib/portal/types";
import {
  PortalLockedBlock,
  PortalStatCard,
  PortalCard,
  PortalPreviewSiteCard,
} from "@/components/portal/PortalUI";
import {
  DEMO_VISITOR_WEEK,
  DEMO_PAGE_VIEWS,
  DEMO_CONVERSION_ROWS,
  getWebsiteStatCards,
  isWebsiteStatsUnlocked,
  getWeeklyVisitorTotal,
} from "@/lib/portal/website-stats";
import { getClientPreviewUrl } from "@/lib/portal/helpers";
import { getClientPreviewHref } from "@/lib/portal/invoices";
import { cn } from "@/lib/utils";

type WebsiteStatsPanelProps = {
  client: ClientAccount;
  /** Admin ziet statistieken altijd (inclusief demo-data) */
  adminView?: boolean;
  showPreview?: boolean;
  compact?: boolean;
};

export function WebsiteStatsPanel({
  client,
  adminView = false,
  showPreview = true,
  compact = false,
}: WebsiteStatsPanelProps) {
  const gradientId = useId().replace(/:/g, "");
  const unlocked = adminView || isWebsiteStatsUnlocked(client);
  const stats = getWebsiteStatCards(client);
  const previewUrl = getClientPreviewUrl(client);
  const previewHref = getClientPreviewHref(client);

  return (
    <div className="space-y-5">
      {!unlocked && !adminView && (
        <div className="flex items-center gap-3 rounded-[16px] border border-[#E2E0DB] bg-[#F5F5F5] px-4 py-3">
          <Lock className="h-4 w-4 shrink-0 text-[#7547F8]" />
          <p className="text-[13px] text-[#6B7280]">
            Statistieken worden zichtbaar zodra de website live staat. Hieronder zie je alvast een preview.
          </p>
        </div>
      )}

      {adminView && !isWebsiteStatsUnlocked(client) && (
        <p className="rounded-[12px] border border-[#E2E0DB] bg-[#FAFAFA] px-4 py-3 text-[13px] text-[#6B7280]">
          Demo-statistieken — na livegang en pixel-installatie worden dit echte meetgegevens.
        </p>
      )}

      <div className={cn("grid gap-3", compact ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 xl:grid-cols-5")}>
        {stats.map((stat) => (
          <PortalLockedBlock key={stat.label} locked={!unlocked} lockMessage="Live na lancering">
            <PortalStatCard label={stat.label} value={stat.value} sub={stat.sub} />
          </PortalLockedBlock>
        ))}
      </div>

      {!compact && (
        <>
          <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
            <PortalLockedBlock locked={!unlocked} lockMessage="Bezoekersgrafiek na livegang">
              <PortalCard>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#0B0B0D]">Bezoekers deze week</h3>
                    <p className="text-[13px] text-[#6B7280]">Unieke bezoekers per dag</p>
                  </div>
                  <span className="text-[20px] font-semibold text-[#7547F8]">{getWeeklyVisitorTotal()}</span>
                </div>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={DEMO_VISITOR_WEEK} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`visitorFill-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#7547F8" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#7547F8" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DB" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E0DB", fontSize: 12 }} />
                      <Area type="monotone" dataKey="bezoekers" stroke="#7547F8" strokeWidth={2} fill={`url(#visitorFill-${gradientId})`} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </PortalCard>
            </PortalLockedBlock>

            <PortalLockedBlock locked={!unlocked} lockMessage="Populaire pagina's na livegang">
              <PortalCard>
                <h3 className="mb-1 text-[16px] font-semibold text-[#0B0B0D]">Populaire pagina&apos;s</h3>
                <p className="mb-4 text-[13px] text-[#6B7280]">Meest bezochte pagina&apos;s deze maand</p>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DEMO_PAGE_VIEWS} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DB" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="page" width={72} tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E0DB", fontSize: 12 }} />
                      <Bar dataKey="views" fill="#7547F8" radius={[0, 6, 6, 0]} barSize={18} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </PortalCard>
            </PortalLockedBlock>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {showPreview && (
              <PortalPreviewSiteCard
                url={previewUrl}
                previewHref={previewHref}
                buildPercent={client.progress.percent}
                phase={client.progress.phase}
                steps={client.progress.steps}
                status={client.phase === "live" ? "Live" : "In bouw"}
              />
            )}

            <PortalLockedBlock locked={!unlocked} lockMessage="Conversie-overzicht na livegang">
              <PortalCard>
                <h3 className="mb-1 text-[16px] font-semibold text-[#0B0B0D]">Conversie-overzicht</h3>
                <p className="mb-5 text-[13px] text-[#6B7280]">Van bezoeker naar lead</p>
                <div className="space-y-4">
                  {DEMO_CONVERSION_ROWS.map((row) => (
                    <div key={row.label}>
                      <div className="mb-1 flex justify-between text-[12px]">
                        <span className="text-[#6B7280]">{row.label}</span>
                        <span className="font-medium text-[#111111]">{row.pct}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white">
                        <div className={cn("h-full rounded-full", row.color)} style={{ width: `${row.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </PortalCard>
            </PortalLockedBlock>
          </div>
        </>
      )}
    </div>
  );
}
