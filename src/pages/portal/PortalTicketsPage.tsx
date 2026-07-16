import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Send, Paperclip, FileText, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { upsertClient, generateId, generateTicketNumber } from "@/lib/portal/storage";
import type { SupportTicket } from "@/lib/portal/types";
import { TICKET_STATUSES, TICKET_STATUS_VARIANT } from "@/lib/portal/constants";
import { MailboxRow, ReferencePanelCard, MailboxLayout } from "@/components/portal/MailboxUI";
import {
  ReferenceCard,
  ReferencePageTitle,
  ReferenceBadge,
} from "@/components/portal/reference/ReferenceUI";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getClientReferenceNumber } from "@/lib/portal/helpers";
import {
  REVISION_POLICY,
  TICKET_CATEGORIES,
  notifyTicketCreated,
} from "@/data/revision-policy";

const statusVariant = TICKET_STATUS_VARIANT;

export default function PortalTicketsPage() {
  const { client, refreshClient } = usePortalAuth();
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showRevision, setShowRevision] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    category: TICKET_CATEGORIES[0],
    message: "",
    customCategory: "",
  });
  const [reply, setReply] = useState("");

  if (!client) return null;

  const clientRef = getClientReferenceNumber(client);
  const selected = client.tickets.find((t) => t.id === selectedId);
  const openCount = client.tickets.filter((t) => t.status !== "done" && t.status !== "out_of_scope").length;

  const createTicket = () => {
    const category =
      form.category === "Overig" && form.customCategory.trim()
        ? form.customCategory.trim()
        : form.category;
    const ticket: SupportTicket = {
      id: generateId(),
      number: generateTicketNumber(),
      subject: form.subject,
      category,
      status: "submitted",
      priority: "normal",
      messages: [
        {
          id: generateId(),
          author: "client",
          authorName: `${client.user.firstName} ${client.user.lastName}`,
          body: form.message,
          attachments: [],
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    upsertClient({ ...client, tickets: [ticket, ...client.tickets] });
    refreshClient();
    notifyTicketCreated({
      ticketNumber: ticket.number,
      companyName: client.companyName,
      clientNumber: clientRef,
      subject: ticket.subject,
    });
    toast({
      title: `Ticket ${ticket.number} aangemaakt`,
      description: "We sturen je een bevestiging per e-mail zodra we reageren.",
    });
    setShowForm(false);
    setForm({ subject: "", category: TICKET_CATEGORIES[0], message: "", customCategory: "" });
    setSelectedId(ticket.id);
  };

  const sendReply = () => {
    if (!selected || !reply.trim()) return;
    const updated: SupportTicket = {
      ...selected,
      status: "review",
      messages: [
        ...selected.messages,
        {
          id: generateId(),
          author: "client",
          authorName: `${client.user.firstName} ${client.user.lastName}`,
          body: reply,
          attachments: [],
          createdAt: new Date().toISOString(),
        },
      ],
      updatedAt: new Date().toISOString(),
    };
    upsertClient({ ...client, tickets: client.tickets.map((t) => (t.id === selected.id ? updated : t)) });
    refreshClient();
    setReply("");
    toast({ title: "Bericht verstuurd" });
  };

  return (
    <div>
      <ReferencePageTitle
        title="Supporttickets"
        subtitle="Meldingen, wijzigingen en vragen — wij reageren via dit overzicht."
        action={
          <Button variant="default" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nieuw ticket
          </Button>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <ReferenceCard className="!py-3">
          <p className="text-[12px] text-[#9CA3AF]">Open tickets</p>
          <p className="text-[24px] font-semibold">{openCount}</p>
        </ReferenceCard>
        <ReferenceCard className="!py-3">
          <p className="text-[12px] text-[#9CA3AF]">Klantnummer</p>
          <p className="font-mono text-[16px] font-semibold text-[#7547F8]">{clientRef}</p>
        </ReferenceCard>
        <ReferenceCard className="!py-3">
          <p className="text-[12px] text-[#9CA3AF]">Bedrijf</p>
          <p className="text-[16px] font-semibold">{client.companyName}</p>
        </ReferenceCard>
      </div>

      {showForm && (
        <ReferenceCard className="mb-5 space-y-4">
          <h3 className="text-[16px] font-semibold">Nieuw ticket indienen</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Bedrijfsnaam</Label>
              <Input value={client.companyName} disabled className="mt-1.5 rounded-[12px] bg-[#FAFAF8]" />
            </div>
            <div>
              <Label>Klantnummer</Label>
              <Input value={clientRef} disabled className="mt-1.5 rounded-[12px] bg-[#FAFAF8] font-mono" />
            </div>
          </div>
          <div>
            <Label>Onderwerp</Label>
            <Input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Korte omschrijving van je vraag"
              className="mt-1.5 rounded-[12px]"
            />
          </div>
          <div>
            <Label>Categorie</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {TICKET_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat })}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[12px] font-medium",
                    form.category === cat ? "bg-[#7547F8] text-white" : "bg-[#F5F4F2] text-[#6B7280]",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            {form.category === "Overig" && (
              <Input
                value={form.customCategory}
                onChange={(e) => setForm({ ...form, customCategory: e.target.value })}
                placeholder="Beschrijf je categorie (optioneel)"
                className="mt-3 rounded-[12px]"
              />
            )}
          </div>
          <div>
            <Label>Beschrijving</Label>
            <Textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Beschrijf je vraag of wijzigingsverzoek zo concreet mogelijk..."
              className="mt-1.5 min-h-[120px] rounded-[12px]"
            />
          </div>

          <div className="rounded-[12px] border border-[#E2E0DB] bg-[#FAFAF8] shadow-block">
            <button
              type="button"
              onClick={() => setShowRevision((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-[13px] font-medium"
            >
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#7547F8]" />
                Revisiebeleid
              </span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", showRevision && "rotate-180")} />
            </button>
            {showRevision && (
              <div className="border-t border-[#E2E0DB] px-4 py-3 text-[12px] leading-relaxed text-[#6B7280]">
                <p className="mb-2 font-medium text-[#111111]">{REVISION_POLICY.summary}</p>
                {REVISION_POLICY.sections.map((s) => (
                  <p key={s.heading} className="mb-2">
                    <strong className="text-[#111111]">{s.heading}:</strong> {s.body}
                  </p>
                ))}
                <Link to="/portal/profiel" className="mt-2 inline-block text-[12px] font-medium text-[#7547F8] hover:underline">
                  Volledig onderhouds- en prijsbeleid → Profiel → Documenten
                </Link>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="default" onClick={createTicket} disabled={!form.subject.trim() || !form.message.trim()}>
              Ticket versturen
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Annuleren
            </Button>
          </div>
        </ReferenceCard>
      )}

      <ReferencePanelCard
        title="Ingediende tickets"
        subtitle={`${client.tickets.length} ticket(s) — klik een regel om het gesprek te openen`}
      >
        {client.tickets.length === 0 ? (
          <p className="bg-white px-5 py-10 text-center text-[14px] text-[#6B7280]">
            Nog geen tickets. Klik op &apos;Nieuw ticket&apos; om te starten.
          </p>
        ) : (
          <MailboxLayout
            list={
              <>
                {client.tickets.map((ticket) => {
                  const lastMsg = ticket.messages[ticket.messages.length - 1];
                  return (
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
                      meta={ticket.category}
                      preview={lastMsg?.body}
                      date={new Date(ticket.updatedAt).toLocaleDateString("nl-NL", {
                        day: "numeric",
                        month: "short",
                      })}
                      status={TICKET_STATUSES[ticket.status]}
                      statusVariant={statusVariant[ticket.status] ?? "default"}
                    />
                  );
                })}
              </>
            }
            detail={
              selected ? (
                <div className="p-5">
                  <div className="mb-4 flex items-start justify-between gap-3 border-b border-[#E2E0DB] pb-4">
                    <div>
                      <p className="font-mono text-[12px] text-[#9CA3AF]">{selected.number}</p>
                      <h3 className="text-lg font-semibold">{selected.subject}</h3>
                      <p className="text-[13px] text-[#6B7280]">
                        {selected.category} · ingediend op{" "}
                        {new Date(selected.createdAt).toLocaleDateString("nl-NL", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <ReferenceBadge variant={statusVariant[selected.status] ?? "default"}>
                      {TICKET_STATUSES[selected.status]}
                    </ReferenceBadge>
                  </div>
                  <div className="mb-6 max-h-[360px] space-y-3 overflow-y-auto">
                    {selected.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "rounded-[14px] p-4 text-[14px]",
                          msg.author === "client" ? "bg-[#EDE9FE]/40" : "bg-[#FAFAF8]",
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
                    <div className="border-t border-[#E2E0DB] pt-4">
                      <Textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Typ een bericht..."
                        className="mb-3 min-h-[80px] rounded-[12px]"
                      />
                      <Button variant="default" onClick={sendReply} disabled={!reply.trim()}>
                        <Send className="mr-2 h-4 w-4" />
                        Versturen
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="p-8 text-center text-[14px] text-[#6B7280]">Selecteer een ticket om het gesprek te bekijken.</p>
              )
            }
          />
        )}
      </ReferencePanelCard>

      <p className="mt-4 text-[12px] text-[#9CA3AF]">
        Algemene vragen? Bekijk ook{" "}
        <Link to="/portal/klantenservice" className="text-[#7547F8] hover:underline">
          klantenservice
        </Link>
        .
      </p>
    </div>
  );
}
