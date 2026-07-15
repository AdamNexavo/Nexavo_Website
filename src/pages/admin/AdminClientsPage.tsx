import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Copy, Search, Mail, ExternalLink } from "lucide-react";
import { getAllClients } from "@/lib/portal/store";
import {
  ReferenceCard,
  ReferencePageTitle,
  ReferenceStatCard,
  ReferenceBadge,
} from "@/components/portal/reference/ReferenceUI";
import { PortalProgressBar } from "@/components/portal/PortalUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildWebsitePrompt } from "@/lib/portal/prompt-builder";
import { useToast } from "@/hooks/use-toast";
import {
  getClientCrmStatus,
  CRM_STATUS_LABELS,
  type ClientCrmStatus,
  computeAdminDashboardStats,
  formatEuro,
} from "@/lib/portal/admin-stats";
import { getClientReferenceNumber } from "@/lib/portal/helpers";
import { isTechnicalSetupComplete, getClientTechnicalSetup } from "@/lib/portal/websites";
import { cn } from "@/lib/utils";

const FILTERS: { id: "all" | ClientCrmStatus; label: string }[] = [
  { id: "all", label: "Alle" },
  { id: "onboarding", label: "Onboarding" },
  { id: "intake", label: "Intake" },
  { id: "build", label: "In bouw" },
  { id: "live", label: "Live" },
  { id: "overdue", label: "Achterstallig" },
];

const STATUS_VARIANT: Record<ClientCrmStatus, "default" | "green" | "purple"> = {
  onboarding: "default",
  intake: "purple",
  build: "purple",
  live: "green",
  overdue: "default",
};

export default function AdminClientsPage() {
  const clients = getAllClients();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const stats = computeAdminDashboardStats(clients);

  const filtered = useMemo(() => {
    let list = clients;
    if (filter !== "all") {
      list = list.filter((c) => getClientCrmStatus(c) === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.companyName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          getClientReferenceNumber(c).toLowerCase().includes(q) ||
          c.user.firstName.toLowerCase().includes(q) ||
          c.user.lastName.toLowerCase().includes(q),
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [clients, filter, search]);

  return (
    <div>
      <ReferencePageTitle
        title="Klanten"
        subtitle="CRM-overzicht — beheer contacten, voortgang en pakketten."
        action={
          <Button variant="brand" asChild>
            <Link to="/admin/uitnodigingen">+ Uitnodigen</Link>
          </Button>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ReferenceStatCard label="Totaal klanten" value={String(stats.clientCount)} />
        <ReferenceStatCard label="Live" value={String(stats.liveClients)} sub="Actieve websites" trend="up" />
        <ReferenceStatCard label="In bouw" value={String(stats.inBuild)} sub="Intake ontvangen" />
        <ReferenceStatCard label="Omzet" value={formatEuro(stats.totalRevenue)} sub="Betaald totaal" />
      </div>

      <ReferenceCard className="mb-5 !p-0 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-[#E2E0DB] p-4">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Zoek op bedrijf, e-mail, klantnummer..."
              className="h-10 rounded-[12px] border-[#E2E0DB] pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors",
                  filter === f.id ? "bg-[#7547F8] text-white" : "bg-[#F5F4F2] text-[#6B7280] hover:bg-[#EDE9FE]",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="p-6 text-[14px] text-[#6B7280]">Geen klanten gevonden.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#E2E0DB] bg-[#FAFAF8] text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                  <th className="px-4 py-3">Klant</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Pakket</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Voortgang</th>
                  <th className="px-4 py-3">Acties</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const status = getClientCrmStatus(c);
                  const hasOpenPayment = c.payments.some((p) => p.status !== "paid");
                  return (
                    <tr
                      key={c.id}
                      onClick={() => navigate(`/admin/klanten/${c.id}`)}
                      className="cursor-pointer border-b border-[#E2E0DB]/60 transition-colors hover:bg-[#FAFAF8]"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-sm font-semibold text-[#7547F8]">
                            {c.companyName[0]?.toUpperCase()}
                          </span>
                          <div>
                            <p className="font-semibold text-[#111111]">{c.companyName}</p>
                            <p className="font-mono text-[11px] text-[#9CA3AF]">{getClientReferenceNumber(c)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{c.user.firstName} {c.user.lastName}</p>
                        <a href={`mailto:${c.email}`} className="text-[12px] text-[#7547F8] hover:underline">
                          {c.email}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{c.package.planName}</p>
                        <p className="text-[11px] text-[#9CA3AF]">{c.package.planPrice ?? "—"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <ReferenceBadge variant={STATUS_VARIANT[status]}>{CRM_STATUS_LABELS[status]}</ReferenceBadge>
                        {!isTechnicalSetupComplete(getClientTechnicalSetup(c)) && (
                          <p className="mt-1 text-[11px] text-[#B45309]">Technisch onvolledig</p>
                        )}
                        {hasOpenPayment && status !== "overdue" && (
                          <p className="mt-1 text-[11px] text-[#9CA3AF]">Betaling open</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-20">
                          <PortalProgressBar percent={c.progress.percent} />
                          <p className="mt-0.5 text-[11px] text-[#9CA3AF]">{c.progress.percent}%</p>
                        </div>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" asChild className="h-8 px-2">
                            <Link to={`/admin/klanten/${c.id}`}>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                            <a href={`mailto:${c.email}`}>
                              <Mail className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                          {c.onboarding.completed && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(buildWebsitePrompt(c));
                                toast({ title: "Prompt gekopieerd" });
                              }}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </ReferenceCard>
    </div>
  );
}
