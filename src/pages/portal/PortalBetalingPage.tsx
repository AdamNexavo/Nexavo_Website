import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, FileText, Wallet, CalendarClock } from "lucide-react";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { ReferenceBadge } from "@/components/portal/reference/ReferenceUI";
import { ReferencePanelCard } from "@/components/portal/MailboxUI";
import { PaymentLinesTable } from "@/components/portal/PaymentLinesTable";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { upsertClient } from "@/lib/portal/storage";
import { PAYMENT_TERM_DAYS, getClientReferenceNumber, getLastPaymentDate, applyClientPaymentReceived } from "@/lib/portal/helpers";
import { getProcessingPayments, parseEuroAmount } from "@/lib/portal/billing";
import { INVOICE_STATUS_LABELS, getInvoiceStatusVariant, markInvoicePaid } from "@/lib/portal/invoices";
import { InvoicePdfButton } from "@/components/portal/InvoicePdfButton";
import { cn } from "@/lib/utils";

type PaymentTab = "open" | "processing" | "paid" | "all";

const TABS: { id: PaymentTab; label: string }[] = [
  { id: "open", label: "Openstaand" },
  { id: "processing", label: "In verwerking" },
  { id: "paid", label: "Betaald" },
  { id: "all", label: "Alles" },
];

export default function PortalBetalingPage() {
  const { client, refreshClient } = usePortalAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<PaymentTab>("open");

  const openPayments = useMemo(() => (client ? getProcessingPayments(client) : []), [client]);
  const paidHistory = useMemo(
    () =>
      (client?.payments ?? [])
        .filter((p) => p.status === "paid")
        .sort((a, b) => new Date(b.paidAt ?? 0).getTime() - new Date(a.paidAt ?? 0).getTime()),
    [client],
  );
  const processingHistory = useMemo(
    () => (client?.payments ?? []).filter((p) => p.status === "pending" || p.status === "open"),
    [client],
  );

  if (!client) return null;

  const openTotal = openPayments.reduce((sum, p) => {
    const raw = p.amountIncVat ?? p.amount;
    return sum + parseEuroAmount(raw);
  }, 0);

  const nextDue = openPayments
    .map((p) => new Date(p.dueDate))
    .sort((a, b) => a.getTime() - b.getTime())[0];

  const lastPaid = getLastPaymentDate(client);
  const lastPaymentMethod = paidHistory[0]?.paymentMethod ?? "—";

  const markPaid = (id: string) => {
    const withPayments = {
      ...client,
      payments: client.payments.map((p) => (p.id === id ? markInvoicePaid(p, client) : p)),
    };
    upsertClient(applyClientPaymentReceived(withPayments));
    refreshClient();
    toast({ title: "Betaling geregistreerd", description: "Betaling is gemarkeerd als betaald (demo)." });
  };

  const showOpen = tab === "open" || tab === "all";
  const showProcessing = tab === "processing" || tab === "all";
  const showPaid = tab === "paid" || tab === "all";

  return (
    <div className="space-y-6">
      <ReferencePanelCard
        title="Betaling"
        subtitle="Administratie-overzicht voor openstaande betalingen, betaaltermijnen en boekhoudkundige specificaties."
        action={
          openPayments.length > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FED7AA] bg-white px-2.5 py-1 text-[11px] font-medium text-[#B45309]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
              Actie nodig
            </span>
          ) : undefined
        }
      >
        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div className="rounded-[12px] border border-[#E2E0DB] bg-white shadow-block px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">Openstaand bedrag</p>
            <p className="mt-1 text-[22px] font-semibold text-[#111111]">
              {openPayments.length > 0
                ? `€${openTotal.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}`
                : "€0,00"}
            </p>
            <p className="mt-0.5 text-[12px] text-[#6B7280]">Totaal incl. 21% btw</p>
          </div>
          <div className="rounded-[12px] border border-[#E2E0DB] bg-white shadow-block px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">Eerstvolgende vervaldatum</p>
            <p className="mt-1 text-[18px] font-semibold text-[#111111]">
              {nextDue ? nextDue.toLocaleDateString("nl-NL") : "—"}
            </p>
          </div>
          <div className="rounded-[12px] border border-[#E2E0DB] bg-white shadow-block px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">Aantal open posten</p>
            <p className="mt-1 text-[18px] font-semibold text-[#111111]">{openPayments.length}</p>
          </div>
          <div className="rounded-[12px] border border-[#E2E0DB] bg-white shadow-block px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">Betaalstatus</p>
            <p className="mt-1 text-[18px] font-semibold text-[#111111]">
              {openPayments.length > 0 ? "Openstaand" : "Geen open posten"}
            </p>
          </div>
          <div className="rounded-[12px] border border-[#E2E0DB] bg-white shadow-block px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">Laatste betaling</p>
            <p className="mt-1 text-[18px] font-semibold text-[#111111]">
              {lastPaid ? new Date(lastPaid).toLocaleDateString("nl-NL") : "Nog geen"}
            </p>
          </div>
          <div className="rounded-[12px] border border-[#E2E0DB] bg-white shadow-block px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">Betaalmethode</p>
            <p className="mt-1 text-[16px] font-semibold text-[#111111]">{lastPaymentMethod}</p>
          </div>
        </div>
        <p className="border-t border-[#E2E0DB] px-5 py-3 text-[12px] text-[#9CA3AF]">
          Klantnummer {getClientReferenceNumber(client)} · betaaltermijn {PAYMENT_TERM_DAYS} dagen · openstaande
          betalingen zijn nog geen officiële factuur
        </p>
      </ReferencePanelCard>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors",
              tab === t.id
                ? "border-[#7547F8] bg-white text-[#7547F8] shadow-sm"
                : "border-[#E2E0DB] bg-white text-[#6B7280] hover:border-[#7547F8]/30",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {showOpen && (
        <ReferencePanelCard
          title="Openstaande betalingen"
          subtitle={
            openPayments.length > 0
              ? `${openPayments.length} betaling(en) wachten op betaling — betaalspecificatie met btw-regels.`
              : "Geen openstaande betalingen op dit moment."
          }
        >
          {openPayments.length === 0 ? (
            <div className="flex flex-col items-center bg-white px-6 py-12 text-center">
              <Wallet className="mb-3 h-10 w-10 text-[#7547F8]" strokeWidth={1.5} />
              <p className="text-[16px] font-semibold text-[#111111]">Geen openstaande betalingen</p>
              <p className="mt-1 max-w-sm text-[14px] text-[#6B7280]">
                Zodra je de betalingsstap bereikt en een pakket hebt gekozen, verschijnt hier je openstaande betaling
                met boekhoudkundige regelspecificatie.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E2E0DB]">
              {openPayments.map((p) => (
                <div key={p.id} className="space-y-4 bg-white p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <ReferenceBadge variant={getInvoiceStatusVariant(p.status)}>Openstaande betaling</ReferenceBadge>
                        <span className="text-[12px] text-[#9CA3AF]">Betaalspecificatie — nog geen factuurnummer</span>
                      </div>
                      <p className="font-semibold text-[#111111]">{p.description}</p>
                      <div className="flex flex-wrap gap-4 text-[12px] text-[#6B7280]">
                        <span className="inline-flex items-center gap-1">
                          <CalendarClock className="h-3.5 w-3.5" />
                          Vervaldatum {new Date(p.dueDate).toLocaleDateString("nl-NL")}
                        </span>
                        <span>Betaaltermijn {p.paymentTermDays ?? PAYMENT_TERM_DAYS} dagen</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                      <div className="text-right">
                        <p className="text-[11px] text-[#9CA3AF]">Totaal incl. btw</p>
                        <p className="text-[20px] font-semibold text-[#111111]">{p.amountIncVat ?? p.amount}</p>
                      </div>
                      <InvoicePdfButton pdfUrl={null} />
                      <Button
                        className="rounded-full bg-[#7547F8] hover:bg-[#6840E0]"
                        onClick={() =>
                          toast({
                            title: "Betaling (demo)",
                            description: "Mollie-koppeling volgt — daarna betaal je direct via iDEAL.",
                          })
                        }
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Betalen
                      </Button>
                      <Button variant="outline" className="rounded-full" onClick={() => markPaid(p.id)}>
                        Demo: betaald
                      </Button>
                    </div>
                  </div>
                  {p.lines && p.lines.length > 0 && <PaymentLinesTable lines={p.lines} />}
                </div>
              ))}
            </div>
          )}
        </ReferencePanelCard>
      )}

      {showProcessing && processingHistory.length > 0 && (
        <ReferencePanelCard title="In verwerking" subtitle="Geplande of gefactureerde posten die nog niet betaald zijn.">
          <div className="divide-y divide-[#E2E0DB] bg-white">
            {processingHistory.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div>
                  <p className="font-medium text-[#111111]">{p.description}</p>
                  <p className="text-[12px] text-[#6B7280]">
                    {INVOICE_STATUS_LABELS[p.status]} · vervalt {new Date(p.dueDate).toLocaleDateString("nl-NL")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{p.amountIncVat ?? p.amount}</span>
                  <Button asChild variant="outline" size="sm" className="rounded-full">
                    <Link to="/portal/facturatie">Factuur bekijken</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ReferencePanelCard>
      )}

      {showPaid && (
        <ReferencePanelCard title="Betaalhistorie" subtitle="Overzicht van afgeronde betalingen en betaalde facturen.">
          {paidHistory.length === 0 ? (
            <p className="bg-white px-5 py-10 text-center text-[14px] text-[#6B7280]">Nog geen betaalde facturen.</p>
          ) : (
            <div className="overflow-x-auto bg-white">
              <table className="w-full min-w-[720px] text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#E2E0DB] text-[11px] font-semibold uppercase tracking-wide text-[#374151]">
                    <th className="px-5 pb-3">Factuurnummer</th>
                    <th className="pb-3 pr-4">Datum</th>
                    <th className="pb-3 pr-4">Omschrijving</th>
                    <th className="pb-3 pr-4">Bedrag</th>
                    <th className="pb-3 pr-4">Methode</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="px-5 pb-3 text-right">Document</th>
                  </tr>
                </thead>
                <tbody>
                  {paidHistory.map((p) => (
                    <tr key={p.id} className="border-b border-[#E2E0DB]/60 last:border-0">
                      <td className="px-5 py-3 font-mono text-[12px] font-medium text-[#374151]">
                        {p.invoiceNumber ?? "—"}
                      </td>
                      <td className="py-3 pr-4 text-[#374151]">
                        {p.paidAt ? new Date(p.paidAt).toLocaleDateString("nl-NL") : "—"}
                      </td>
                      <td className="py-3 pr-4 text-[#6B7280]">{p.description}</td>
                      <td className="py-3 pr-4 font-semibold text-[#111111]">{p.amountIncVat ?? p.amount}</td>
                      <td className="py-3 pr-4 text-[#6B7280]">{p.paymentMethod ?? "iDEAL (demo)"}</td>
                      <td className="py-3 pr-4">
                        <ReferenceBadge variant="green">Betaald</ReferenceBadge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <InvoicePdfButton pdfUrl={p.pdfDataUrl ?? p.pdfUrl} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ReferencePanelCard>
      )}

      <ReferencePanelCard title="Documenten & betaalspecificaties" subtitle="Beschikbare betalingsdocumenten gekoppeld aan je account.">
        <div className="divide-y divide-[#E2E0DB] bg-white">
          {openPayments.map((p) => (
            <div key={`doc-${p.id}`} className="flex items-center justify-between gap-3 px-5 py-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#6B7280]" />
                <div>
                  <p className="text-[13px] font-medium text-[#111111]">Betaalspecificatie — {p.packageName ?? "Pakket"}</p>
                  <p className="text-[11px] text-[#9CA3AF]">Openstaand · {p.amountIncVat ?? p.amount}</p>
                </div>
              </div>
              <InvoicePdfButton pdfUrl={null} />
            </div>
          ))}
          {paidHistory.map((p) => (
            <div key={`paid-doc-${p.id}`} className="flex items-center justify-between gap-3 px-5 py-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#6B7280]" />
                <div>
                  <p className="text-[13px] font-medium text-[#111111]">Factuurdocument {p.invoiceNumber ?? ""}</p>
                  <p className="text-[11px] text-[#9CA3AF]">Betaald · {p.amountIncVat ?? p.amount}</p>
                </div>
              </div>
              <InvoicePdfButton pdfUrl={p.pdfDataUrl ?? p.pdfUrl} />
            </div>
          ))}
          {openPayments.length === 0 && paidHistory.length === 0 && (
            <p className="px-5 py-8 text-center text-[13px] text-[#6B7280]">Nog geen betalingsdocumenten beschikbaar.</p>
          )}
        </div>
      </ReferencePanelCard>

      <p className="text-[12px] text-[#9CA3AF]">
        <FileText className="mr-1 inline h-3.5 w-3.5" />
        Officiële facturen vind je op{" "}
        <Link to="/portal/facturatie" className="font-medium text-[#7547F8] hover:underline">
          Facturatie
        </Link>
        .
      </p>
    </div>
  );
}
