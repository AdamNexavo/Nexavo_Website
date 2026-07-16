import { Link, useSearchParams } from "react-router-dom";
import { Search, FileText, Pencil, Lock, Mail } from "lucide-react";
import { useMemo, useState } from "react";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { InvoicePdfButton } from "@/components/portal/InvoicePdfButton";
import {
  ReferenceCard,
  ReferencePageTitle,
  ReferenceBadge,
  ReferenceTabs,
  ReferenceSection,
  ReferenceWhiteCard,
} from "@/components/portal/reference/ReferenceUI";
import { portalPillInputClass } from "@/components/portal/PortalUI";
import { getPlanById, getMaintenanceById } from "@/lib/portal/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PAYMENT_TERM_DAYS,
  getClientPaymentTermDays,
  getNextMaintenanceInvoice,
  hasPendingPackage,
  getLastPaymentDate,
  getClientReferenceNumber,
  isPackageChangeLocked,
  formatMonthlyPriceDisplay,
  applyClientPaymentReceived,
} from "@/lib/portal/helpers";
import PortalBetalingContent from "./PortalBetalingContent";
import { upsertClient } from "@/lib/portal/storage";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  INVOICE_STATUS_LABELS,
  getInvoiceStatusVariant,
  markInvoicePaid,
} from "@/lib/portal/invoices";
import { getInvoiceRecords } from "@/lib/portal/billing";

const TABS = [
  { id: "facturatie", label: "Facturatie & betaling" },
  { id: "pakket", label: "Websitepakket" },
];

const INVOICE_FILTERS = [
  { id: "all", label: "Alle" },
  { id: "pending", label: "Gepland" },
  { id: "open", label: "Gefactureerd" },
  { id: "paid", label: "Betaald" },
] as const;

export default function PortalFacturatiePage() {
  const { client, refreshClient } = usePortalAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") ?? "facturatie";
  const [invoiceFilter, setInvoiceFilter] = useState<(typeof INVOICE_FILTERS)[number]["id"]>("all");
  const [search, setSearch] = useState("");
  const [editingBilling, setEditingBilling] = useState(false);

  const allPayments = client?.payments ?? [];
  const invoiceRecords = useMemo(() => (client ? getInvoiceRecords(client) : []), [client]);
  const openInvoices = useMemo(
    () => invoiceRecords.filter((p) => p.status === "open" || p.status === "overdue"),
    [invoiceRecords],
  );
  const plannedInvoices = useMemo(
    () => invoiceRecords.filter((p) => p.status === "pending"),
    [invoiceRecords],
  );
  const paidInvoices = useMemo(
    () => invoiceRecords.filter((p) => p.status === "paid"),
    [invoiceRecords],
  );

  const filteredInvoices = useMemo(() => {
    let list = invoiceRecords;
    if (invoiceFilter === "open") list = openInvoices;
    else if (invoiceFilter === "paid") list = paidInvoices;
    else if (invoiceFilter === "pending") list = plannedInvoices;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.description.toLowerCase().includes(q) ||
          p.amount.toLowerCase().includes(q) ||
          (p.invoiceNumber?.toLowerCase().includes(q) ?? false),
      );
    }
    return list;
  }, [invoiceRecords, invoiceFilter, search, openInvoices, paidInvoices, plannedInvoices]);

  if (!client) return null;

  const nextMaintenance = getNextMaintenanceInvoice(client);
  const billing = client.billingInfo ?? {};
  const lastPayment = getLastPaymentDate(client);
  const clientRef = getClientReferenceNumber(client);
  const paymentTermDays = getClientPaymentTermDays(client);
  const intakeComplete = client.onboarding.completed;
  const packageLocked = isPackageChangeLocked(client);
  const canChangeInIntake = !packageLocked && !intakeComplete;

  const updateBilling = (field: string, value: string) => {
    upsertClient({ ...client, billingInfo: { ...billing, [field]: value } });
    refreshClient();
  };

  const markPaid = (id: string) => {
    const withPayments = {
      ...client,
      payments: client.payments.map((p) =>
        p.id === id ? markInvoicePaid(p, client) : p,
      ),
    };
    upsertClient(applyClientPaymentReceived(withPayments));
    refreshClient();
    toast({ title: "Betaling geregistreerd", description: "Factuur PDF is beschikbaar in je overzicht." });
  };

  const filterCount = (id: (typeof INVOICE_FILTERS)[number]["id"]) => {
    if (id === "all") return invoiceRecords.length;
    if (id === "open") return openInvoices.length;
    if (id === "paid") return paidInvoices.length;
    if (id === "pending") return plannedInvoices.length;
    return 0;
  };

  return (
    <div className="space-y-6">
      <ReferencePageTitle
        title="Facturatie & betaling"
        subtitle={`Klantnummer ${clientRef} · Betaaltermijn ${paymentTermDays} dagen`}
      />

      <ReferenceTabs items={TABS} active={tab} onChange={(id) => setSearchParams({ tab: id })} />

      {tab === "facturatie" && (
        <div className="space-y-6">
          <ReferenceSection>
            <h2 className="text-[18px] font-semibold text-[#111111]">Facturatie & betaling</h2>
            <p className="mt-1 text-[14px] text-[#6B7280]">
              Overzicht van facturen, betaaltermijnen en pakketstatus. Klantnummer {clientRef} · betaaltermijn{" "}
              {PAYMENT_TERM_DAYS} dagen.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <ReferenceWhiteCard>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">Pakket</p>
                <p className="mt-1 text-[14px] font-semibold">{client.package.planName}</p>
              </ReferenceWhiteCard>
              <ReferenceWhiteCard>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">Openstaand</p>
                <p className="mt-1 text-[14px] font-semibold">{openInvoices.length} factuur/facturen</p>
              </ReferenceWhiteCard>
              <ReferenceWhiteCard>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">Laatste betaling</p>
                <p className="mt-1 text-[14px] font-semibold">
                  {lastPayment ? new Date(lastPayment).toLocaleDateString("nl-NL") : "Nog geen betaling"}
                </p>
              </ReferenceWhiteCard>
            </div>
          </ReferenceSection>

          <ReferenceWhiteCard className="!p-0 overflow-hidden">
            <div className="border-b border-[#E2E0DB] bg-[#F5F5F5] px-5 py-4">
              <h2 className="text-[15px] font-semibold text-[#111111]">Facturen</h2>
              <p className="text-[13px] text-[#6B7280]">Geplande, gefactureerde en betaalde facturen met btw-specificatie.</p>
            </div>
            <div className="flex flex-col gap-4 border-b border-[#E2E0DB] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {INVOICE_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setInvoiceFilter(f.id)}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                      invoiceFilter === f.id ? "bg-[#7547F8] text-white" : "border border-[#E2E0DB] bg-white text-[#6B7280] hover:bg-[#FAFAF8]",
                    )}
                  >
                    {f.label} ({filterCount(f.id)})
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:max-w-[220px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Zoeken..." className="rounded-full pl-10 border-[#E2E0DB] bg-white" />
              </div>
            </div>

            <div className="hidden bg-white lg:grid lg:grid-cols-[minmax(130px,1.1fr)_minmax(180px,2fr)_minmax(90px,0.8fr)_minmax(95px,0.7fr)_minmax(95px,0.7fr)_minmax(90px,0.7fr)_minmax(80px,0.6fr)_minmax(90px,0.7fr)_minmax(80px,0.6fr)_72px] gap-3 border-b border-[#E2E0DB] px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
              <span>Factuurnr.</span>
              <span>Omschrijving</span>
              <span>Pakket</span>
              <span>Factuurdatum</span>
              <span>Vervaldatum</span>
              <span>Excl. btw</span>
              <span>Btw</span>
              <span>Incl. btw</span>
              <span>Status</span>
              <span className="text-right">PDF</span>
            </div>

            {filteredInvoices.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <FileText className="mb-3 h-10 w-10 text-[#7547F8]" strokeWidth={1.5} />
                <p className="font-semibold">Nog geen facturen</p>
                <p className="mt-1 text-[14px] text-[#6B7280]">Er zijn nog geen facturen beschikbaar gesteld.</p>
              </div>
            ) : (
              filteredInvoices.map((p) => (
                <div
                  key={p.id}
                  className="grid gap-3 border-b border-[#E2E0DB]/60 bg-white px-5 py-4 text-[13px] last:border-0 lg:grid-cols-[minmax(130px,1.1fr)_minmax(180px,2fr)_minmax(90px,0.8fr)_minmax(95px,0.7fr)_minmax(95px,0.7fr)_minmax(90px,0.7fr)_minmax(80px,0.6fr)_minmax(90px,0.7fr)_minmax(80px,0.6fr)_72px] lg:items-center"
                >
                  <span className="font-mono text-[12px] font-semibold text-[#374151]">{p.invoiceNumber ?? "—"}</span>
                  <div>
                    <p className="font-medium leading-snug text-[#111111]">{p.description}</p>
                    <p className="mt-0.5 text-[11px] text-[#9CA3AF]">
                      {p.billingType === "recurring" ? "Periodiek" : "Eenmalig"} · {p.paymentTermDays ?? PAYMENT_TERM_DAYS} dagen
                    </p>
                  </div>
                  <span className="font-medium text-[#374151]">{p.packageName ?? client.package.planName}</span>
                  <span className="font-medium text-[#374151]">{new Date(p.issuedAt ?? p.createdAt ?? p.dueDate).toLocaleDateString("nl-NL")}</span>
                  <span className="font-medium text-[#374151]">{new Date(p.dueDate).toLocaleDateString("nl-NL")}</span>
                  <span className="font-semibold text-[#374151]">{p.amountExVat ?? p.amount}</span>
                  <span className="text-[#6B7280]">{p.vatAmount ?? "—"}</span>
                  <span className="font-semibold text-[#111111]">{p.amountIncVat ?? "—"}</span>
                  <ReferenceBadge variant={getInvoiceStatusVariant(p.status)}>{INVOICE_STATUS_LABELS[p.status]}</ReferenceBadge>
                  <div className="flex justify-start lg:justify-end">
                    <InvoicePdfButton pdfUrl={p.pdfDataUrl ?? p.pdfUrl} />
                  </div>
                </div>
              ))
            )}
          </ReferenceWhiteCard>

          <ReferenceSection title="Openstaande betalingen">
            <p className="mb-4 text-[13px] text-[#6B7280]">
              Betaal via Mollie (iDEAL) zodra je factuur klaarstaat.{" "}
              <Link to="/portal/betaling" className="font-medium text-[#7547F8] hover:underline">
                Naar betalingspagina →
              </Link>
            </p>
            <PortalBetalingContent markPaid={markPaid} compact />
          </ReferenceSection>

          <ReferenceWhiteCard className="!p-0 overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-[#E2E0DB] bg-[#F5F5F5] px-5 py-4">
              <div>
                <h2 className="text-[15px] font-semibold text-[#111111]">Facturatiegegevens</h2>
                <p className="text-[13px] text-[#6B7280]">Gegevens voor je facturen.</p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full text-[#7547F8]" onClick={() => setEditingBilling(!editingBilling)}>
                <Pencil className="mr-1 h-3.5 w-3.5" />
                {editingBilling ? "Sluiten" : "Wijzig"}
              </Button>
            </div>
            <div className="bg-white p-5">
            {editingBilling ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["companyName", "Bedrijfsnaam", client.companyName],
                    ["accountHolderFirstName", "Voornaam ten namegestelde", client.user.firstName],
                    ["accountHolderLastName", "Achternaam ten namegestelde", client.user.lastName],
                    ["kvk", "KVK-nummer", ""],
                    ["btw", "BTW-nummer", ""],
                    ["email", "E-mailadres facturen", client.email],
                    ["address", "Straatnaam", ""],
                    ["houseNumber", "Huisnummer", ""],
                    ["postcode", "Postcode", ""],
                    ["city", "Plaats", ""],
                  ] as const
                ).map(([field, label, fallback]) => (
                  <div key={field}>
                    <Label className="text-[12px] text-[#6B7280]">{label}</Label>
                    <Input
                      value={(billing[field] as string) ?? fallback}
                      onChange={(e) => updateBilling(field, e.target.value)}
                      className={`mt-1 bg-white ${portalPillInputClass}`}
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <Button variant="brand" onClick={() => { setEditingBilling(false); toast({ title: "Opgeslagen" }); }}>
                    Opslaan
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 text-[13px] sm:grid-cols-2 lg:grid-cols-3">
                <div><p className="text-[11px] text-[#9CA3AF]">Bedrijfsnaam</p><p className="font-medium">{billing.companyName ?? client.companyName ?? "—"}</p></div>
                <div><p className="text-[11px] text-[#9CA3AF]">KVK</p><p className="font-medium">{billing.kvk ?? "—"}</p></div>
                <div><p className="text-[11px] text-[#9CA3AF]">BTW-nummer</p><p className="font-medium">{billing.btw ?? "—"}</p></div>
                <div><p className="text-[11px] text-[#9CA3AF]">E-mail facturen</p><p className="font-medium">{billing.email ?? client.email ?? "—"}</p></div>
                <div><p className="text-[11px] text-[#9CA3AF]">Laatste betaling</p><p className="font-medium">{lastPayment ? new Date(lastPayment).toLocaleDateString("nl-NL") : "Nog geen betaling"}</p></div>
                <div><p className="text-[11px] text-[#9CA3AF]">Betaaltermijn</p><p className="font-medium">{paymentTermDays} dagen</p></div>
                <div className="sm:col-span-2 lg:col-span-3"><p className="text-[11px] text-[#9CA3AF]">Factuuradres</p><p className="font-medium">{billing.address ? `${billing.address} ${billing.houseNumber ?? ""}, ${billing.postcode ?? ""} ${billing.city ?? ""}`.trim() : "—"}</p></div>
              </div>
            )}
            <p className="mt-4 border-t border-[#E2E0DB] pt-3 text-[12px] text-[#6B7280]">
              Pakketfacturen zijn eenmalig · onderhoud wordt periodiek
              gefactureerd · volgende onderhoud verwacht op{" "}
              {nextMaintenance.dueDate.toLocaleDateString("nl-NL")} ({nextMaintenance.amount})
            </p>
            </div>
          </ReferenceWhiteCard>
        </div>
      )}

      {tab === "pakket" && (
        <ReferenceWhiteCard className="!p-0 overflow-hidden">
          <div className="flex items-start justify-between gap-3 border-b border-[#E2E0DB] bg-[#F5F5F5] px-5 py-4">
            <div>
              <h2 className="text-[15px] font-semibold text-[#111111]">Je websitepakket</h2>
              <p className="text-[13px] text-[#6B7280]">Overzicht van je gekozen pakket en onderhoud.</p>
            </div>
            {canChangeInIntake && (
              <Button asChild variant="ghost" size="sm" className="shrink-0 rounded-full text-[#7547F8]">
                <Link to="/portal/stap/pakket">
                  <Pencil className="mr-1 h-3.5 w-3.5" />
                  Wijzig in intake
                </Link>
              </Button>
            )}
          </div>

          <div className="bg-white p-5">
            {packageLocked && (
              <div className="mb-4 flex gap-3 rounded-[10px] border border-[#E2E0DB] bg-[#FAFAF8] shadow-block px-3 py-3">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[#6B7280]" />
                <div>
                  <p className="text-[13px] font-medium text-[#111111]">Pakket is definitief</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#6B7280]">
                    Wijzigingen? Neem contact op via een ticket — wij regelen dit persoonlijk met je.
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-2 rounded-full">
                    <Link to="/portal/tickets">
                      <Mail className="mr-2 h-3.5 w-3.5" />
                      Contact opnemen
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {hasPendingPackage(client) ? (
              <div className="py-6 text-center">
                <p className="font-medium text-[#111111]">Nog geen pakket gekozen</p>
                <p className="mt-1 text-[13px] text-[#6B7280]">Kies je pakket in stap 5 van je intake.</p>
                <Button asChild variant="brand" className="mt-4 rounded-full">
                  <Link to="/portal/stap/pakket">Naar pakket kiezen</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="grid gap-3 text-[13px] sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-[11px] text-[#9CA3AF]">Websitepakket</p>
                    <p className="font-medium">{client.package.planName}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#9CA3AF]">Eenmalig bedrag</p>
                    <p className="font-medium">{client.package.planPrice ?? getPlanById(client.package.planId)?.price ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#9CA3AF]">Onderhoud</p>
                    <p className="font-medium">{client.package.maintenanceName ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#9CA3AF]">Maandelijks onderhoud</p>
                    <p className="font-medium">
                      {formatMonthlyPriceDisplay(
                        client.package.monthlyPrice ??
                          getMaintenanceById(client.package.maintenanceId ?? "plus")?.price,
                      )}
                    </p>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-2">
                    <p className="text-[11px] text-[#9CA3AF]">Omschrijving</p>
                    <p className="font-medium text-[#374151]">
                      {getPlanById(client.package.planId)?.description ?? "—"}
                    </p>
                  </div>
                </div>
                {client.package.maintenanceIncluded && client.package.maintenanceIncluded.length > 0 && (
                  <div className="mt-4 border-t border-[#E2E0DB] pt-3">
                    <p className="text-[11px] text-[#9CA3AF]">Inbegrepen in onderhoud</p>
                    <ul className="mt-2 space-y-1 text-[13px] text-[#374151]">
                      {client.package.maintenanceIncluded.map((item) => (
                        <li key={item}>· {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
            <p className="mt-4 border-t border-[#E2E0DB] pt-3 text-[12px] text-[#9CA3AF]">
              Alle bedragen exclusief btw
            </p>
          </div>
        </ReferenceWhiteCard>
      )}
    </div>
  );
}
