import { Link } from "react-router-dom";
import {
  ArrowRight,
  AlertCircle,
  Calendar,
  TrendingUp,
  Activity,
  Users,
  Ticket,
  CreditCard,
  Zap,
} from "lucide-react";
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
import { getProgressBlockers } from "@/lib/portal/project-progress";
import { getEffectiveProjectProgress } from "@/lib/portal/project-progress";
import { isTechnicalSetupComplete, getClientTechnicalSetup } from "@/lib/portal/websites";
import { getProcessingPayments } from "@/lib/portal/billing";

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

  const inOnboarding = clients.filter((c) => !c.onboarding.completed && c.onboarding.company.name).length;
  const withBlockers = clients.filter((c) => getProgressBlockers(c).length > 0).length;
  const techIncomplete = clients.filter((c) => !isTechnicalSetupComplete(getClientTechnicalSetup(c))).length;
  const pixelMissing = clients.filter((c) => {
    const setup = getClientTechnicalSetup(c);
    return setup.pixelInstalled === false && setup.checklist?.pixelAdded === false && Boolean(setup.pixelType);
  }).length;
  const openProcessingPayments = clients.filter((c) => getProcessingPayments(c).length > 0).length;

  const recentActivity = [...clients]
    .sort((a, b) => new Date(b.progress.lastUpdate).getTime() - new Date(a.progress.lastUpdate).getTime())
    .slice(0, 6);

  const expectedRevenue = stats.totalOpen + stats.monthlyMaintenance;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <ReferenceGreeting name="Admin" date={formatDate()} />
        <Button variant="brand" asChild>
          <Link to="/admin/uitnodigingen">Klant uitnodigen</Link>
        </Button>
      </div>

      <ReferenceCard className="mb-6 border-[#7547F8]/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-[#7547F8]" />
            <div>
              <h3 className="text-[15px] font-semibold text-[#111111]">Platform health</h3>
              <p className="text-[12px] text-[#6B7280]">
                {stats.openTickets} open tickets · {openProcessingPayments} openstaande betalingen · {withBlockers}{" "}
                klanten met blockers
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.overduePayments > 0 && (
              <ReferenceBadge variant="red">{stats.overduePayments} achterstallig</ReferenceBadge>
            )}
            {techIncomplete > 0 && (
              <ReferenceBadge variant="orange">{techIncomplete} technisch onvolledig</ReferenceBadge>
            )}
            {pixelMissing > 0 && (
              <ReferenceBadge variant="orange">{pixelMissing} pixel vereist</ReferenceBadge>
            )}
            <ReferenceBadge variant="green">{stats.liveClients} live</ReferenceBadge>
          </div>
        </div>
      </ReferenceCard>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ReferenceStatCard label="Omzet (betaald)" value={formatEuro(stats.totalRevenue)} sub="Totaal ontvangen" trend="up" />
        <ReferenceStatCard label="Openstaand" value={formatEuro(stats.totalOpen)} sub={`${stats.pendingPayments} posten`} />
        <ReferenceStatCard label="Verwachte omzet" value={formatEuro(expectedRevenue)} sub="Open + MRR" />
        <ReferenceStatCard label="MRR onderhoud" value={formatEuro(stats.monthlyMaintenance)} sub="Maandelijks recurring" trend="up" />
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <ReferenceStatCard label="Klanten" value={String(stats.clientCount)} sub={`${stats.liveClients} live`} />
        <ReferenceStatCard label="In onboarding" value={String(inOnboarding)} sub="Intake niet ingediend" />
        <ReferenceStatCard label="In bouw" value={String(stats.inBuild)} sub="Intake ontvangen" />
        <ReferenceStatCard label="Open tickets" value={String(stats.openTickets)} sub="Wacht op actie" />
        <ReferenceStatCard label="Nieuwe aanvragen" value={String(stats.completedIntakes)} sub="Intakes ingediend" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ReferenceCard>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#7547F8]" />
              <h3 className="text-[15px] font-semibold">Aankomende betaaltermijnen</h3>
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
                <div key={p.id} className="flex items-center justify-between rounded-[12px] border border-[#E2E0DB] bg-white shadow-block px-3 py-2.5">
                  <div>
                    <p className="text-[13px] font-medium">{p.clientName}</p>
                    <p className="text-[11px] text-[#9CA3AF]">
                      Vervaldatum {new Date(p.dueDate).toLocaleDateString("nl-NL")}
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
              <h3 className="text-[15px] font-semibold">Open acties & blockers</h3>
            </div>
          </div>
          <div className="space-y-2">
            {clients
              .filter((c) => getProgressBlockers(c).length > 0)
              .slice(0, 5)
              .map((c) => {
                const blockers = getProgressBlockers(c);
                return (
                  <Link
                    key={c.id}
                    to={`/admin/klanten/${c.id}`}
                    className="flex items-center justify-between rounded-[12px] border border-[#E2E0DB] bg-white shadow-block px-3 py-2.5 transition-colors hover:border-[#7547F8]/30"
                  >
                    <div>
                      <p className="text-[13px] font-medium">{c.companyName}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{blockers[0]?.label}</p>
                    </div>
                    <span className="text-[11px] text-[#F97316]">{blockers.length} blocker(s)</span>
                  </Link>
                );
              })}
            {withBlockers === 0 && (
              <p className="text-[13px] text-[#6B7280]">Geen actieve blockers.</p>
            )}
          </div>
        </ReferenceCard>
      </div>

      <ReferenceCard className="mt-5">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#7547F8]" />
          <h3 className="text-[15px] font-semibold">Klanten in bouw</h3>
        </div>
        {clients.filter((c) => c.onboarding.completed && c.progress.percent < 100).length === 0 ? (
          <p className="text-[13px] text-[#6B7280]">Geen actieve bouwprojecten.</p>
        ) : (
          <div className="space-y-3">
            {clients
              .filter((c) => c.onboarding.completed && getEffectiveProjectProgress(c).percent < 100)
              .slice(0, 5)
              .map((c) => {
                const effective = getEffectiveProjectProgress(c);
                return (
                  <Link
                    key={c.id}
                    to={`/admin/klanten/${c.id}`}
                    className="flex items-center gap-4 rounded-[12px] border border-[#E2E0DB] bg-white shadow-block p-3 transition-colors hover:border-[#7547F8]/30"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-sm font-semibold text-[#7547F8]">
                      {c.companyName[0]?.toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium">{c.companyName}</p>
                      <p className="text-[12px] text-[#9CA3AF]">
                        {c.package.planName} · {effective.phase}
                      </p>
                    </div>
                    <div className="w-24">
                      <PortalProgressBar percent={effective.percent} />
                      <p className="mt-1 text-right text-[11px] text-[#9CA3AF]">{effective.percent}%</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#9CA3AF]" />
                  </Link>
                );
              })}
          </div>
        )}
      </ReferenceCard>

      <ReferenceCard className="mt-5">
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#7547F8]" />
          <h3 className="text-[15px] font-semibold">Recente activiteit</h3>
        </div>
        <div className="space-y-2">
          {recentActivity.map((c) => (
            <Link
              key={c.id}
              to={`/admin/klanten/${c.id}`}
              className="flex items-center justify-between rounded-[12px] border border-[#E2E0DB] bg-white shadow-block px-3 py-2.5"
            >
              <div>
                <p className="text-[13px] font-medium">{c.companyName}</p>
                <p className="text-[11px] text-[#9CA3AF]">{c.progress.phase}</p>
              </div>
              <span className="text-[11px] text-[#9CA3AF]">
                {new Date(c.progress.lastUpdate).toLocaleDateString("nl-NL")}
              </span>
            </Link>
          ))}
        </div>
      </ReferenceCard>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/admin/aanvragen">
          <ReferenceCard className="transition-colors hover:border-[#7547F8]/30">
            <Users className="mb-2 h-4 w-4 text-[#7547F8]" />
            <ReferenceBadge variant="green">{stats.completedIntakes} aanvragen</ReferenceBadge>
            <p className="mt-2 text-[14px] font-medium">Intakes inbox</p>
          </ReferenceCard>
        </Link>
        <Link to="/admin/tickets">
          <ReferenceCard className="transition-colors hover:border-[#7547F8]/30">
            <Ticket className="mb-2 h-4 w-4 text-[#7547F8]" />
            <ReferenceBadge variant="purple">{stats.openTickets} open</ReferenceBadge>
            <p className="mt-2 text-[14px] font-medium">Tickets inbox</p>
          </ReferenceCard>
        </Link>
        <Link to="/admin/betalingen">
          <ReferenceCard className="transition-colors hover:border-[#7547F8]/30">
            <CreditCard className="mb-2 h-4 w-4 text-[#7547F8]" />
            <ReferenceBadge variant="orange">{stats.pendingPayments} open</ReferenceBadge>
            <p className="mt-2 text-[14px] font-medium">Betalingen</p>
          </ReferenceCard>
        </Link>
        <Link to="/admin/klanten">
          <ReferenceCard className="transition-colors hover:border-[#7547F8]/30">
            <Users className="mb-2 h-4 w-4 text-[#7547F8]" />
            <ReferenceBadge>{stats.clientCount} klanten</ReferenceBadge>
            <p className="mt-2 text-[14px] font-medium">CRM openen</p>
          </ReferenceCard>
        </Link>
      </div>
    </div>
  );
}
