import { Link } from "react-router-dom";
import { ArrowRight, AlertCircle, Calendar, TrendingUp } from "lucide-react";
import { getAllClients } from "@/lib/portal/store";
import {
  ReferenceCard,
  ReferenceGreeting,
  ReferenceStatCard,
  ReferenceBadge,
} from "@/components/portal/reference/ReferenceUI";
import { Button } from "@/components/ui/button";
import { computeAdminDashboardStats, formatEuro } from "@/lib/portal/admin-stats";
import { PortalProgressBar } from "@/components/portal/PortalUI";

function formatDate() {
  return new Date().toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AdminDashboardPage() {
  const clients = getAllClients();
  const stats = computeAdminDashboardStats(clients);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <ReferenceGreeting name="Admin" date={formatDate()} />
        <Button variant="brand" asChild>
          <Link to="/admin/uitnodigingen">Klant uitnodigen</Link>
        </Button>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ReferenceStatCard label="Omzet (betaald)" value={formatEuro(stats.totalRevenue)} sub="Totaal ontvangen" trend="up" />
        <ReferenceStatCard label="Openstaand" value={formatEuro(stats.totalOpen)} sub={`${stats.pendingPayments} facturen`} />
        <ReferenceStatCard label="Achterstallig" value={formatEuro(stats.totalOverdue)} sub={`${stats.overduePayments} facturen`} trend={stats.overduePayments > 0 ? "down" : "neutral"} />
        <ReferenceStatCard label="MRR onderhoud" value={formatEuro(stats.monthlyMaintenance)} sub="Maandelijks recurring" trend="up" />
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ReferenceStatCard label="Klanten" value={String(stats.clientCount)} sub={`${stats.liveClients} live · ${stats.inBuild} in bouw`} />
        <ReferenceStatCard label="Intake-aanvragen" value={String(stats.completedIntakes)} sub="Ingediend & klaar" />
        <ReferenceStatCard label="Open tickets" value={String(stats.openTickets)} sub="Wacht op actie" />
        <ReferenceStatCard label="Conversie" value={stats.clientCount ? `${Math.round((stats.completedIntakes / stats.clientCount) * 100)}%` : "—"} sub="Intake voltooid" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ReferenceCard>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#7547F8]" />
              <h3 className="text-[15px] font-semibold">Eerstvolgende betalingen</h3>
            </div>
            <Link to="/admin/betalingen" className="text-[12px] font-medium text-[#7547F8] hover:underline">
              Alles bekijken
            </Link>
          </div>
          {stats.upcomingPayments.length === 0 ? (
            <p className="text-[13px] text-[#6B7280]">Geen openstaande betalingen gepland.</p>
          ) : (
            <div className="space-y-2">
              {stats.upcomingPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-[12px] bg-[#FAFAF8] px-3 py-2.5">
                  <div>
                    <p className="text-[13px] font-medium">{p.clientName}</p>
                    <p className="text-[11px] text-[#9CA3AF]">
                      Vervalt {new Date(p.dueDate).toLocaleDateString("nl-NL")}
                    </p>
                  </div>
                  <span className="text-[14px] font-semibold">{p.amount}</span>
                </div>
              ))}
            </div>
          )}
        </ReferenceCard>

        <ReferenceCard>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-[#EF4444]" />
              <h3 className="text-[15px] font-semibold">Achterstallige betalingen</h3>
            </div>
            <Link to="/admin/betalingen" className="text-[12px] font-medium text-[#7547F8] hover:underline">
              Beheren
            </Link>
          </div>
          {stats.overdueList.length === 0 ? (
            <p className="text-[13px] text-[#6B7280]">Geen achterstallige betalingen.</p>
          ) : (
            <div className="space-y-2">
              {stats.overdueList.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-[12px] border border-[#FEE2E2] bg-[#FEF2F2] px-3 py-2.5">
                  <div>
                    <p className="text-[13px] font-medium">{p.clientName}</p>
                    <p className="text-[11px] text-[#EF4444]">
                      Vervallen {new Date(p.dueDate).toLocaleDateString("nl-NL")}
                    </p>
                  </div>
                  <span className="text-[14px] font-semibold text-[#EF4444]">{p.amount}</span>
                </div>
              ))}
            </div>
          )}
        </ReferenceCard>
      </div>

      <ReferenceCard className="mt-5">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#7547F8]" />
          <h3 className="text-[15px] font-semibold">Klanten in bouw</h3>
        </div>
        {clients.filter((c) => !c.onboarding.completed || c.progress.percent < 100).length === 0 ? (
          <p className="text-[13px] text-[#6B7280]">Geen actieve bouwprojecten.</p>
        ) : (
          <div className="space-y-3">
            {clients
              .filter((c) => c.onboarding.completed && c.progress.percent < 100)
              .slice(0, 5)
              .map((c) => (
                <Link
                  key={c.id}
                  to={`/admin/klanten/${c.id}`}
                  className="flex items-center gap-4 rounded-[12px] border border-[#E2E0DB] p-3 transition-colors hover:bg-[#FAFAF8]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-sm font-semibold text-[#7547F8]">
                    {c.companyName[0]?.toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium">{c.companyName}</p>
                    <p className="text-[12px] text-[#9CA3AF]">{c.package.planName} · {c.progress.phase}</p>
                  </div>
                  <div className="w-24">
                    <PortalProgressBar percent={c.progress.percent} />
                    <p className="mt-1 text-right text-[11px] text-[#9CA3AF]">{c.progress.percent}%</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#9CA3AF]" />
                </Link>
              ))}
          </div>
        )}
      </ReferenceCard>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Link to="/admin/aanvragen">
          <ReferenceCard className="transition-colors hover:border-[#7547F8]/30">
            <ReferenceBadge variant="green">{stats.completedIntakes} aanvragen</ReferenceBadge>
            <p className="mt-2 text-[14px] font-medium">Intakes bekijken</p>
            <p className="text-[12px] text-[#6B7280]">Build-prompts kopiëren</p>
          </ReferenceCard>
        </Link>
        <Link to="/admin/tickets">
          <ReferenceCard className="transition-colors hover:border-[#7547F8]/30">
            <ReferenceBadge variant="purple">{stats.openTickets} open</ReferenceBadge>
            <p className="mt-2 text-[14px] font-medium">Tickets beantwoorden</p>
            <p className="text-[12px] text-[#6B7280]">Support inbox</p>
          </ReferenceCard>
        </Link>
        <Link to="/admin/klanten">
          <ReferenceCard className="transition-colors hover:border-[#7547F8]/30">
            <ReferenceBadge>{stats.clientCount} klanten</ReferenceBadge>
            <p className="mt-2 text-[14px] font-medium">CRM openen</p>
            <p className="text-[12px] text-[#6B7280]">Alle klantprofielen</p>
          </ReferenceCard>
        </Link>
      </div>
    </div>
  );
}
