import { TrendingUp, MousePointerClick, Globe, Smartphone } from "lucide-react";
import { useId } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ClientAccount } from "@/lib/portal/types";
import {
  PortalStatCard,
  PortalCard,
  PortalPreviewSiteCard,
  PortalLockedSection,
} from "@/components/portal/PortalUI";
import {
  DEMO_VISITOR_WEEK,
  DEMO_PAGE_VIEWS,
  DEMO_CONVERSION_ROWS,
  DEMO_TRAFFIC_SOURCES,
  DEMO_DEVICES,
  DEMO_MONTHLY_VISITORS,
  DEMO_TOP_KEYWORDS,
  getWebsiteStatCards,
  isWebsiteStatsUnlocked,
  getWeeklyVisitorTotal,
} from "@/lib/portal/website-stats";
import { getClientPreviewUrl } from "@/lib/portal/helpers";
import { getClientPreviewHref } from "@/lib/portal/invoices";
import { cn } from "@/lib/utils";

type WebsiteStatsPanelProps = {
  client: ClientAccount;
  adminView?: boolean;
  showPreview?: boolean;
  /** Eén groot slot over het volledige dashboard (klantportaal) */
  singleLock?: boolean;
};

function DashboardBody({
  client,
  gradientId,
  showPreview,
  previewUrl,
  previewHref,
}: {
  client: ClientAccount;
  gradientId: string;
  showPreview: boolean;
  previewUrl: string;
  previewHref: string | null;
}) {
  const stats = getWebsiteStatCards(client);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <PortalCard key={stat.label} className="!p-4 md:!p-5">
            <PortalStatCard label={stat.label} value={stat.value} sub={stat.sub} />
          </PortalCard>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
        <PortalCard>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-semibold text-[#0B0B0D]">Bezoekers deze week</h3>
              <p className="text-[13px] text-[#6B7280]">Unieke bezoekers per dag</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[20px] font-semibold text-[#7547F8]">
              {getWeeklyVisitorTotal()}
              <TrendingUp className="h-4 w-4 text-[#10B981]" />
            </span>
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
                <Area
                  type="monotone"
                  dataKey="bezoekers"
                  stroke="#7547F8"
                  strokeWidth={2}
                  fill={`url(#visitorFill-${gradientId})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PortalCard>

        <PortalCard>
          <h3 className="mb-1 text-[16px] font-semibold text-[#0B0B0D]">Populaire pagina&apos;s</h3>
          <p className="mb-4 text-[13px] text-[#6B7280]">Meest bezochte pagina&apos;s deze maand</p>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEMO_PAGE_VIEWS} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DB" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="page"
                  width={72}
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E0DB", fontSize: 12 }} />
                <Bar dataKey="views" fill="#7547F8" radius={[0, 6, 6, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PortalCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <PortalCard>
          <h3 className="mb-1 text-[16px] font-semibold text-[#0B0B0D]">Groei deze maand</h3>
          <p className="mb-4 text-[13px] text-[#6B7280]">Bezoekers per week</p>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DEMO_MONTHLY_VISITORS} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DB" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E0DB", fontSize: 12 }} />
                <Line type="monotone" dataKey="bezoekers" stroke="#7547F8" strokeWidth={2.5} dot={{ r: 4, fill: "#7547F8" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </PortalCard>

        <PortalCard>
          <div className="mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#7547F8]" />
            <div>
              <h3 className="text-[16px] font-semibold text-[#0B0B0D]">Verkeersbronnen</h3>
              <p className="text-[13px] text-[#6B7280]">Waar bezoekers vandaan komen</p>
            </div>
          </div>
          <div className="space-y-3">
            {DEMO_TRAFFIC_SOURCES.map((row) => (
              <div key={row.source}>
                <div className="mb-1 flex justify-between text-[12px]">
                  <span className="text-[#6B7280]">{row.source}</span>
                  <span className="font-medium text-[#111111]">{row.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white">
                  <div className={cn("h-full rounded-full", row.color)} style={{ width: `${row.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </PortalCard>

        <PortalCard>
          <div className="mb-4 flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-[#7547F8]" />
            <div>
              <h3 className="text-[16px] font-semibold text-[#0B0B0D]">Apparaten</h3>
              <p className="text-[13px] text-[#6B7280]">Mobiel vs. desktop</p>
            </div>
          </div>
          <div className="space-y-4">
            {DEMO_DEVICES.map((row, i) => (
              <div key={row.device} className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                  style={{ background: i === 0 ? "#7547F8" : i === 1 ? "#A78BFA" : "#C4B5FD" }}
                >
                  {row.pct}%
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-[#111111]">{row.device}</p>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-[#7547F8]"
                      style={{ width: `${row.pct}%`, opacity: 1 - i * 0.25 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PortalCard>
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

        <PortalCard>
          <div className="mb-4 flex items-center gap-2">
            <MousePointerClick className="h-4 w-4 text-[#7547F8]" />
            <div>
              <h3 className="text-[16px] font-semibold text-[#0B0B0D]">Conversie-overzicht</h3>
              <p className="text-[13px] text-[#6B7280]">Van bezoeker naar lead</p>
            </div>
          </div>
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

        {!showPreview && (
          <PortalCard>
            <h3 className="mb-1 text-[16px] font-semibold text-[#0B0B0D]">Top zoektermen</h3>
            <p className="mb-4 text-[13px] text-[#6B7280]">Organisch verkeer deze maand</p>
            <div className="divide-y divide-[#E2E0DB]">
              {DEMO_TOP_KEYWORDS.map((row, i) => (
                <div key={row.term} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-[#7547F8]">
                      {i + 1}
                    </span>
                    <span className="text-[13px] font-medium text-[#111111]">{row.term}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-[#6B7280]">{row.clicks}</span>
                </div>
              ))}
            </div>
          </PortalCard>
        )}
      </div>
    </>
  );
}

export function WebsiteStatsPanel({
  client,
  adminView = false,
  showPreview = true,
  singleLock = true,
}: WebsiteStatsPanelProps) {
  const gradientId = useId().replace(/:/g, "");
  const unlocked = adminView || isWebsiteStatsUnlocked(client);
  const locked = !unlocked;
  const previewUrl = getClientPreviewUrl(client);
  const previewHref = getClientPreviewHref(client);

  const body = (
    <DashboardBody
      client={client}
      gradientId={gradientId}
      showPreview={showPreview}
      previewUrl={previewUrl}
      previewHref={previewHref}
    />
  );

  return (
    <div className="space-y-5">
      {adminView && !isWebsiteStatsUnlocked(client) && (
        <p className="rounded-[12px] border border-[#E2E0DB] bg-[#FAFAFA] px-4 py-3 text-[13px] text-[#6B7280]">
          Demo-statistieken — na livegang en pixel-installatie worden dit echte meetgegevens.
        </p>
      )}

      {singleLock && locked ? (
        <PortalLockedSection
          title="Statistieken"
          subtitle="Bezoekers, conversies en prestaties van je website"
          locked
          lockMessage="Beschikbaar zodra je website live staat"
        >
          <div className="space-y-5">{body}</div>
        </PortalLockedSection>
      ) : (
        body
      )}
    </div>
  );
}
