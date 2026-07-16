import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Copy } from "lucide-react";
import { getAllClients } from "@/lib/portal/store";
import { buildWebsitePrompt } from "@/lib/portal/prompt-builder";
import {
  ReferencePageTitle,
  ReferenceBadge,
  ReferenceStatCard,
} from "@/components/portal/reference/ReferenceUI";
import { MailboxLayout, MailboxRow, ReferencePanelCard } from "@/components/portal/MailboxUI";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getApplicationStats } from "@/lib/portal/admin-stats";
import {
  getApplicationInboxItems,
  APPLICATION_TYPE_LABELS,
  APPLICATION_STATUS_LABELS,
  type ApplicationInboxItem,
  type ApplicationStatus,
} from "@/lib/portal/applications-inbox";
import {
  updateIntegrationRequestStatus,
  INTEGRATION_REQUEST_STATUS_LABELS,
} from "@/lib/portal/applications";
import { upsertClient } from "@/lib/portal/storage";
import type { IntegrationRequestStatus } from "@/lib/portal/types";
import { cn } from "@/lib/utils";

const FILTERS = [
  { id: "all", label: "Alle" },
  { id: "new", label: "Nieuw" },
  { id: "in_progress", label: "In behandeling" },
  { id: "completed", label: "Afgehandeld" },
  { id: "intakes", label: "Intakes" },
  { id: "koppelingen", label: "Koppelingen" },
] as const;

function statusVariant(status: ApplicationStatus) {
  if (status === "completed") return "green" as const;
  if (status === "rejected") return "red" as const;
  if (status === "in_progress") return "blue" as const;
  if (status === "awaiting_payment") return "orange" as const;
  return "purple" as const;
}

export default function AdminApplicationsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const clients = getAllClients();
  const appStats = getApplicationStats(clients);
  const items = useMemo(() => getApplicationInboxItems(clients), [clients]);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    let list = items;
    if (filter === "new") list = list.filter((i) => i.unread || i.status === "new");
    else if (filter === "in_progress") list = list.filter((i) => i.status === "in_progress");
    else if (filter === "completed") list = list.filter((i) => i.status === "completed");
    else if (filter === "intakes") list = list.filter((i) => i.type === "intake");
    else if (filter === "koppelingen") list = list.filter((i) => i.type === "koppeling");
    return list;
  }, [items, filter]);

  const selected = filtered.find((i) => i.id === selectedId) ?? items.find((i) => i.id === selectedId) ?? null;

  const updateKoppelingStatus = (item: ApplicationInboxItem, status: IntegrationRequestStatus) => {
    if (!item.requestId) return;
    const client = clients.find((c) => c.id === item.clientId);
    if (!client) return;
    const note = noteDrafts[item.id];
    upsertClient(updateIntegrationRequestStatus(client, item.requestId, status, note));
    toast({ title: "Status bijgewerkt", description: INTEGRATION_REQUEST_STATUS_LABELS[status] });
  };

  const setIntakeStatus = (item: ApplicationInboxItem, status: ApplicationStatus) => {
    toast({
      title: "Status bijgewerkt (demo)",
      description: `Intake ${item.clientName}: ${APPLICATION_STATUS_LABELS[status]}`,
    });
  };

  return (
    <div>
      <ReferencePageTitle
        title="Aanvragen"
        subtitle="Mailbox-overzicht van intakes en koppeling-aanvragen."
        action={
          items.filter((i) => i.unread).length > 0 ? (
            <ReferenceBadge variant="purple">{items.filter((i) => i.unread).length} ongelezen</ReferenceBadge>
          ) : undefined
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ReferenceStatCard label="Totaal aanvragen" value={String(items.length)} />
        <ReferenceStatCard label="Intakes" value={String(items.filter((i) => i.type === "intake").length)} />
        <ReferenceStatCard label="Koppelingen" value={String(items.filter((i) => i.type === "koppeling").length)} />
        <ReferenceStatCard label="Betaald & klaar" value={String(appStats.paid)} sub="Bouw kan starten" trend="up" />
      </div>

      <ReferencePanelCard
        title="Inbox"
        subtitle={`${filtered.length} aanvraag/aanvragen`}
        action={
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-full px-3 py-1 text-[12px] font-medium transition-colors",
                  filter === f.id ? "bg-[#7547F8] text-white" : "border border-[#E2E0DB] bg-white text-[#6B7280] hover:bg-[#FAFAF8]",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        }
      >
        {filtered.length === 0 ? (
          <p className="bg-white px-5 py-12 text-center text-[14px] text-[#6B7280]">Geen aanvragen in dit filter.</p>
        ) : (
          <MailboxLayout
            list={
              <>
                {filtered.map((item) => (
                  <MailboxRow
                    key={item.id}
                    selected={selectedId === item.id}
                    unread={item.unread}
                    onClick={() => setSelectedId(item.id)}
                    badge={
                      <ReferenceBadge variant="default" className="text-[10px]">
                        {APPLICATION_TYPE_LABELS[item.type]}
                      </ReferenceBadge>
                    }
                    title={item.title}
                    meta={`${item.clientName} · ${item.clientRef}`}
                    preview={item.preview}
                    date={new Date(item.date).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    status={APPLICATION_STATUS_LABELS[item.status]}
                    statusVariant={statusVariant(item.status)}
                  />
                ))}
              </>
            }
            detail={
              selected ? (
                <div className="space-y-4 p-5">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <ReferenceBadge variant="default">{APPLICATION_TYPE_LABELS[selected.type]}</ReferenceBadge>
                      <ReferenceBadge variant={statusVariant(selected.status)}>
                        {APPLICATION_STATUS_LABELS[selected.status]}
                      </ReferenceBadge>
                    </div>
                    <h3 className="text-[17px] font-semibold text-[#111111]">{selected.title}</h3>
                    <p className="mt-1 text-[13px] text-[#6B7280]">
                      {selected.clientName} · {selected.clientRef} · {selected.clientEmail}
                    </p>
                    <p className="mt-1 text-[12px] text-[#9CA3AF]">
                      {new Date(selected.date).toLocaleString("nl-NL")}
                    </p>
                  </div>

                  {selected.note && (
                    <div className="rounded-[12px] border border-[#E2E0DB] bg-[#FAFAF8] shadow-block p-3">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">Klantopmerking</p>
                      <p className="mt-1 whitespace-pre-wrap text-[13px] text-[#374151]">{selected.note}</p>
                    </div>
                  )}

                  {selected.type === "koppeling" && (
                    <>
                      <Textarea
                        placeholder="Interne notitie..."
                        value={noteDrafts[selected.id] ?? selected.internalNote ?? ""}
                        onChange={(e) => setNoteDrafts((d) => ({ ...d, [selected.id]: e.target.value }))}
                        className="min-h-[80px] rounded-[12px] border-[#E2E0DB] bg-white text-[13px]"
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => updateKoppelingStatus(selected, "new")}>
                          Markeer nieuw
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateKoppelingStatus(selected, "in_progress")}>
                          In behandeling
                        </Button>
                        <Button size="sm" variant="default" onClick={() => updateKoppelingStatus(selected, "completed")}>
                          Afgehandeld
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateKoppelingStatus(selected, "rejected")}>
                          Niet mogelijk
                        </Button>
                      </div>
                    </>
                  )}

                  {selected.type === "intake" && (
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => setIntakeStatus(selected, "in_progress")}>
                        In behandeling
                      </Button>
                      <Button size="sm" variant="default" onClick={() => setIntakeStatus(selected, "completed")}>
                        Afgehandeld
                      </Button>
                      <Button
                        size="sm"
                        variant="brand"
                        onClick={() => {
                          const c = clients.find((x) => x.id === selected.clientId);
                          if (c) {
                            navigator.clipboard.writeText(buildWebsitePrompt(c));
                            toast({ title: "Build-prompt gekopieerd" });
                          }
                        }}
                      >
                        <Copy className="mr-1.5 h-3.5 w-3.5" />
                        Build-prompt
                      </Button>
                    </div>
                  )}

                  <Button size="sm" variant="ghost" asChild>
                    <Link to={`/admin/klanten/${selected.clientId}`}>Klantdetail openen</Link>
                  </Button>
                </div>
              ) : (
                <p className="p-8 text-center text-[14px] text-[#6B7280]">Selecteer een aanvraag om details te bekijken.</p>
              )
            }
          />
        )}
      </ReferencePanelCard>
    </div>
  );
}
