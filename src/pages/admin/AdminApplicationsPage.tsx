import { getAllClients } from "@/lib/portal/store";
import { buildWebsitePrompt } from "@/lib/portal/prompt-builder";
import {
  ReferenceCard,
  ReferencePageTitle,
  ReferenceBadge,
  ReferenceStatCard,
} from "@/components/portal/reference/ReferenceUI";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getApplicationStats } from "@/lib/portal/admin-stats";
import { getClientReferenceNumber } from "@/lib/portal/helpers";

export default function AdminApplicationsPage() {
  const clients = getAllClients().filter((c) => c.onboarding.completed);
  const allClients = getAllClients();
  const appStats = getApplicationStats(allClients);
  const { toast } = useToast();

  return (
    <div>
      <ReferencePageTitle
        title="Aanvragen"
        subtitle="Ingediende intakes van klanten — kopieer build-prompts voor je website-agent."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ReferenceStatCard label="Totaal aanvragen" value={String(appStats.total)} />
        <ReferenceStatCard label="Deze maand" value={String(appStats.thisMonth)} sub="Nieuw ingediend" trend="up" />
        <ReferenceStatCard label="Wacht op betaling" value={String(appStats.awaitingPayment)} />
        <ReferenceStatCard label="Betaald & klaar" value={String(appStats.paid)} sub="Bouw kan starten" trend="up" />
      </div>

      {clients.length === 0 ? (
        <ReferenceCard>
          <p className="text-[14px] text-[#6B7280]">
            Nog geen aanvragen. Aanvragen verschijnen hier zodra klanten hun intake voltooien en versturen (stap 7).
          </p>
        </ReferenceCard>
      ) : (
        <div className="space-y-3">
          {clients
            .sort((a, b) => new Date(b.onboarding.submittedAt ?? 0).getTime() - new Date(a.onboarding.submittedAt ?? 0).getTime())
            .map((c) => {
              const paid = c.payments.some((p) => p.status === "paid");
              return (
                <ReferenceCard key={c.id}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDE9FE] text-xs font-semibold text-[#7547F8]">
                          {c.companyName[0]?.toUpperCase()}
                        </span>
                        <div>
                          <h3 className="font-semibold">{c.companyName}</h3>
                          <p className="font-mono text-[11px] text-[#9CA3AF]">{getClientReferenceNumber(c)}</p>
                        </div>
                      </div>
                      <p className="text-[13px] text-[#6B7280]">
                        {c.onboarding.company.industry || "—"} · {c.package.planName}
                      </p>
                      <p className="mt-1 text-[12px] text-[#9CA3AF]">
                        Ingediend{" "}
                        {c.onboarding.submittedAt
                          ? new Date(c.onboarding.submittedAt).toLocaleDateString("nl-NL", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "—"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <ReferenceBadge variant="green">Intake ontvangen</ReferenceBadge>
                      <ReferenceBadge variant={paid ? "green" : "purple"}>
                        {paid ? "Betaald" : "Wacht op betaling"}
                      </ReferenceBadge>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/klanten/${c.id}`}>Detail bekijken</Link>
                    </Button>
                    <Button
                      variant="brand"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(buildWebsitePrompt(c));
                        toast({ title: "Build-prompt gekopieerd" });
                      }}
                    >
                      <Copy className="mr-1.5 h-3.5 w-3.5" />
                      Build-prompt kopiëren
                    </Button>
                  </div>
                </ReferenceCard>
              );
            })}
        </div>
      )}
    </div>
  );
}
