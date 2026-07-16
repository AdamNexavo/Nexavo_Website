import { getAllClients } from "@/lib/portal/store";
import { upsertClient, generateId } from "@/lib/portal/storage";
import { migrateClient } from "@/lib/portal/types";
import {
  ReferenceCard,
  ReferencePageTitle,
  ReferenceBadge,
  ReferenceStatCard,
} from "@/components/portal/reference/ReferenceUI";
import { MailboxRow, ReferencePanelCard, MailboxLayout } from "@/components/portal/MailboxUI";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  TICKET_STATUSES,
  TICKET_STATUS_VARIANT,
  type TicketStatusKey,
} from "@/lib/portal/constants";
import { getTicketStats } from "@/lib/portal/admin-stats";
import { notifyTicketReply } from "@/data/revision-policy";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminTicket = {
  id: string;
  number: string;
  subject: string;
  category: string;
  status: TicketStatusKey;
  messages: {
    id: string;
    author: "client" | "support";
    authorName: string;
    body: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
  clientId: string;
  clientName: string;
};

export default function AdminTicketsPage() {
  const [searchParams] = useSearchParams();
  const ticketParam = searchParams.get("ticket");
  const clientParam = searchParams.get("client");

  const [clients, setClients] = useState(() => getAllClients());
  const [selectedId, setSelectedId] = useState<string | null>(ticketParam);
  const [reply, setReply] = useState("");
  const { toast } = useToast();

  const refresh = () => setClients(getAllClients());

  useEffect(() => {
    if (ticketParam) setSelectedId(ticketParam);
  }, [ticketParam]);

  const ticketStats = getTicketStats(clients);

  const allTickets: AdminTicket[] = useMemo(
    () =>
      clients
        .flatMap((c) =>
          c.tickets.map((t) => ({
            ...t,
            clientId: c.id,
            clientName: c.companyName,
          })),
        )
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [clients],
  );

  const filteredTickets = useMemo(() => {
    if (clientParam) return allTickets.filter((t) => t.clientId === clientParam);
    return allTickets;
  }, [allTickets, clientParam]);

  const selected = filteredTickets.find((t) => t.id === selectedId) ?? allTickets.find((t) => t.id === selectedId);

  const sendReply = () => {
    if (!selected || !reply.trim()) return;
    const client = migrateClient(clients.find((c) => c.id === selected.clientId)!);
    const ticket = client.tickets.find((t) => t.id === selected.id);
    if (!ticket) return;

    const tickets = client.tickets.map((t) =>
      t.id !== selected.id
        ? t
        : {
            ...t,
            status: "in_progress" as TicketStatusKey,
            messages: [
              ...t.messages,
              {
                id: generateId(),
                author: "support" as const,
                authorName: "Nexavo Support",
                body: reply.trim(),
                attachments: [],
                createdAt: new Date().toISOString(),
              },
            ],
            updatedAt: new Date().toISOString(),
          },
    );
    upsertClient({ ...client, tickets });
    notifyTicketReply({
      ticketNumber: ticket.number,
      toEmail: client.email,
      clientName: client.user.firstName,
    });
    toast({ title: "Antwoord verstuurd" });
    setReply("");
    refresh();
  };

  const setStatus = (status: TicketStatusKey) => {
    if (!selected) return;
    const client = migrateClient(clients.find((c) => c.id === selected.clientId)!);
    upsertClient({
      ...client,
      tickets: client.tickets.map((t) =>
        t.id === selected.id ? { ...t, status, updatedAt: new Date().toISOString() } : t,
      ),
    });
    toast({ title: "Status bijgewerkt" });
    refresh();
  };

  return (
    <div>
      <ReferencePageTitle
        title="Tickets"
        subtitle="Support inbox — klik een ticket om te lezen en te antwoorden."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ReferenceStatCard label="Totaal tickets" value={String(ticketStats.total)} />
        <ReferenceStatCard label="Open" value={String(ticketStats.open)} sub="Actie vereist" />
        <ReferenceStatCard label="In behandeling" value={String(ticketStats.inProgress)} />
        <ReferenceStatCard label="Afgerond" value={String(ticketStats.done)} trend="up" />
      </div>

      {clientParam && (
        <p className="mb-4 text-[13px] text-[#6B7280]">
          Gefilterd op klant ·{" "}
          <Link to="/admin/tickets" className="font-medium text-[#7547F8] hover:underline">
            Toon alle tickets
          </Link>
        </p>
      )}

      {filteredTickets.length === 0 ? (
        <ReferenceCard>
          <p className="text-[14px] text-[#6B7280]">
            Geen tickets. Klanten kunnen tickets aanmaken via klantenservice.
          </p>
        </ReferenceCard>
      ) : (
        <ReferencePanelCard title="Support inbox" subtitle={`${filteredTickets.length} ticket(s) — klik een regel om te antwoorden`}>
          <MailboxLayout
            list={
              <>
                {filteredTickets.map((ticket) => (
                  <MailboxRow
                    key={ticket.id}
                    selected={selectedId === ticket.id}
                    unread={ticket.status === "submitted"}
                    onClick={() => setSelectedId(ticket.id)}
                    title={
                      <span>
                        <span className="font-mono text-[11px] text-[#9CA3AF]">{ticket.number}</span>
                        {" — "}
                        {ticket.subject}
                      </span>
                    }
                    meta={`${ticket.clientName} · ${ticket.category}`}
                    preview={ticket.messages[ticket.messages.length - 1]?.body}
                    date={new Date(ticket.updatedAt).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    status={TICKET_STATUSES[ticket.status]}
                    statusVariant={TICKET_STATUS_VARIANT[ticket.status] ?? "default"}
                  />
                ))}
              </>
            }
            detail={
              selected ? (
                <div className="p-5">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-[#E5E5E5] pb-4">
                    <div>
                      <p className="font-mono text-[12px] text-[#9CA3AF]">{selected.number}</p>
                      <h3 className="text-lg font-semibold">{selected.subject}</h3>
                      <p className="text-[13px] text-[#6B7280]">
                        {selected.category} ·{" "}
                        <Link
                          to={`/admin/klanten/${selected.clientId}`}
                          className="font-medium text-[#7547F8] hover:underline"
                        >
                          {selected.clientName}
                        </Link>
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <ReferenceBadge variant={TICKET_STATUS_VARIANT[selected.status] ?? "default"}>
                        {TICKET_STATUSES[selected.status]}
                      </ReferenceBadge>
                      {selected.status !== "done" && (
                        <select
                          value={selected.status}
                          onChange={(e) => setStatus(e.target.value as TicketStatusKey)}
                          className="h-8 rounded-[10px] border border-[#E5E5E5] bg-white px-2 text-[12px]"
                        >
                          {(Object.keys(TICKET_STATUSES) as TicketStatusKey[]).map((key) => (
                            <option key={key} value={key}>
                              {TICKET_STATUSES[key]}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="mb-6 max-h-[400px] space-y-3 overflow-y-auto [scrollbar-width:thin]">
                    {selected.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "rounded-[14px] p-4 text-[14px]",
                          msg.author === "client" ? "bg-[#EDE9FE]/30" : "bg-[#FAFAFA]",
                        )}
                      >
                        <p className="mb-1 text-[12px] font-medium text-[#6B7280]">{msg.authorName}</p>
                        <p className="whitespace-pre-wrap">{msg.body}</p>
                        <p className="mt-2 text-[11px] text-[#9CA3AF]">
                          {new Date(msg.createdAt).toLocaleString("nl-NL")}
                        </p>
                      </div>
                    ))}
                  </div>

                  {selected.status !== "done" && (
                    <div className="border-t border-[#E5E5E5] pt-4">
                      <Textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Typ je antwoord..."
                        className="mb-3 min-h-[100px] rounded-[12px] bg-white"
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button variant="brand" onClick={sendReply} disabled={!reply.trim()}>
                          <Send className="mr-2 h-4 w-4" />
                          Antwoorden
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setStatus("done")}>
                          Markeer als afgerond
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="p-8 text-center text-[14px] text-[#6B7280]">
                  Selecteer een ticket uit de inbox om het gesprek te bekijken.
                </p>
              )
            }
          />
        </ReferencePanelCard>
      )}
    </div>
  );
}
