import { Link, useSearchParams } from "react-router-dom";
import { Search, FileText, Pencil, Lock, Mail, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { usePortalAuth } from "@/context/PortalAuthContext";
import {
  ReferenceCard,
  ReferencePageTitle,
  ReferenceBadge,
  ReferenceTabs,
} from "@/components/portal/reference/ReferenceUI";
import { portalPillInputClass } from "@/components/portal/PortalUI";
import { PortalWebsitePackageCard, PortalMaintenancePackageCard } from "@/components/portal/PortalPackageCards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PAYMENT_TERM_DAYS,
  getNextMaintenanceInvoice,
  hasPendingPackage,
  getLastPaymentDate,
  getClientReferenceNumber,
  isPackageChangeLocked,
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
  const openInvoices = useMemo(
    () => allPayments.filter((p) => p.status === "open" || p.status === "overdue"),
    [allPayments],
  );
  const plannedInvoices = useMemo(
    () => allPayments.filter((p) => p.status === "pending"),
    [allPayments],
  );
  const paidInvoices = useMemo(
    () => allPayments.filter((p) => p.status === "paid"),
    [allPayments],
  );

  const filteredInvoices = useMemo(() => {
    const list = allPayments;
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
  }, [allPayments, invoiceFilter, search, openInvoices, paidInvoices, plannedInvoices]);

  if (!client) return null;

  const nextMaintenance = getNextMaintenanceInvoice(client);
  const billing = client.billingInfo ?? {};
  const lastPayment = getLastPaymentDate(client);
  const clientRef = getClientReferenceNumber(client);
  const intakeComplete = client.onboarding.completed;
  const packageLocked = isPackageChangeLocked(client);
  const canChangeInIntake = !packageLocked && !intakeComplete;

  const updateBilling = (field: string, value: string) => {
    upsertClient({ ...client, billingInfo: { ...billing, [field]: value } });
    refreshClient();
  };

  const markPaid = (id: string) => {
    upsertClient({
      ...client,
      payments: client.payments.map((p) =>
        p.id === id ? markInvoicePaid(p, client) : p,
      ),
    });
    refreshClient();
    toast({ title: "Betaling geregistreerd", description: "Factuur PDF is beschikbaar in je overzicht." });
  };

  const filterCount = (id: (typeof INVOICE_FILTERS)[number]["id"]) => {
    if (id === "all") return allPayments.length;
    if (id === "open") return openInvoices.length;
    if (id === "paid") return paidInvoices.length;
    if (id === "pending") return plannedInvoices.length;
    return 0;
  };

  return (
    <div className="space-y-6">
      <ReferencePageTitle
        title="Facturatie & betaling"
        subtitle={`Klantnummer ${clientRef} · Betaaltermijn ${PAYMENT_TERM_DAYS} dagen`}
      />

      <ReferenceTabs items={TABS} active={tab} onChange={(id) => setSearchParams({ tab: id })} />

      {tab === "facturatie" && (
        <div className="space-y-6">
          <ReferenceCard className="!p-0 overflow-hidden">
            <div className="border-b border-[#E2E0DB] px-5 py-4">
              <h2 className="text-[15px] font-semibold text-[#111111]">Facturen</h2>
              <p className="text-[13px] text-[#6B7280]">Overzicht van alle facturen en betalingen.</p>
            </div>
            <div className="flex flex-col gap-4 border-b border-black/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {INVOICE_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setInvoiceFilter(f.id)}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                      invoiceFilter === f.id ? "bg-[#7547F8] text-white" : "border border-black/[0.08] text-[#6B7280] hover:bg-[#FAFAFA]",
                    )}
                  >
                    {f.label} ({filterCount(f.id)})
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:max-w-[220px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Zoeken..." className="rounded-full pl-10 border-black/[0.08] bg-white" />
              </div>
            </div>

            <div className="hidden grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 border-b border-black/[0.06] px-5 py-3 text-[12px] font-medium uppercase tracking-wide text-[#9CA3AF] sm:grid">
              <span>Factuurnr.</span>
              <span>Omschrijving</span>
              <span>Type</span>
              <span>Datum</span>
              <span>Bedrag</span>
              <span>Status</span>
            </div>

            {filteredInvoices.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <FileText className="mb-3 h-10 w-10 text-[#7547F8]" strokeWidth={1.5} />
                <p className="font-semibold">Nog niks beschikbaar</p>
                <p className="mt-1 text-[14px] text-[#6B7280]">Er zijn nog geen facturen beschikbaar gesteld.</p>
              </div>
            ) : (
              filteredInvoices.map((p) => (
                <div key={p.id} className="grid gap-2 border-b border-black/[0.04] px-5 py-4 text-[14px] last:border-0 sm:grid-cols-[auto_1fr_auto_auto_auto_auto] sm:items-center sm:gap-4">
                  <span className="font-mono text-[12px] text-[#7547F8]">{p.invoiceNumber ?? "—"}</span>
                  <div>
                    <span className="font-medium">{p.description}</span>
                    {p.pdfDataUrl && (
                      <a
                        href={p.pdfDataUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex items-center gap-1 text-[12px] font-medium text-[#7547F8] hover:underline"
                      >
                        <FileText className="h-3 w-3" />
                        PDF
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <span className="text-[12px] text-[#6B7280]">
                    {p.billingType === "recurring" ? "Periodiek" : "Eenmalig"}
                  </span>
                  <span className="text-[#6B7280]">
                    {new Date(p.issuedAt ?? p.dueDate).toLocaleDateString("nl-NL")}
                  </span>
                  <span className="font-semibold">{p.amount}</span>
                  <ReferenceBadge variant={getInvoiceStatusVariant(p.status)}>
                    {INVOICE_STATUS_LABELS[p.status]}
                  </ReferenceBadge>
                </div>
              ))
            )}
          </ReferenceCard>

          <ReferenceCard id="openstaand">
            <h2 className="mb-1 text-[15px] font-semibold text-[#111111]">Openstaande betalingen</h2>
            <p className="mb-4 text-[13px] text-[#6B7280]">
              Betaal via Mollie (iDEAL) zodra je factuur klaarstaat. Elke factuur heeft een officieel nummer en PDF.
            </p>
            <PortalBetalingContent markPaid={markPaid} />
          </ReferenceCard>

          <ReferenceCard>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold text-[#111111]">Facturatiegegevens</h2>
                <p className="text-[13px] text-[#6B7280]">Gegevens voor je facturen.</p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full text-[#7547F8]" onClick={() => setEditingBilling(!editingBilling)}>
                <Pencil className="mr-1 h-3.5 w-3.5" />
                {editingBilling ? "Sluiten" : "Wijzig"}
              </Button>
            </div>
            {!intakeComplete && (
              <p className="mb-4 rounded-[10px] bg-white/60 px-3 py-2 text-[12px] text-[#6B7280]">
                Vul je factuurgegevens aan in{" "}
                <Link to="/portal/stap/facturatie" className="font-medium text-[#7547F8] hover:underline">
                  stap 6
                </Link>{" "}
                van je intake.
              </p>
            )}
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
                <div><p className="text-[11px] text-[#9CA3AF]">E-mail facturen</p><p className="font-medium">{billing.email ?? client.email ?? "—"}</p></div>
                <div><p className="text-[11px] text-[#9CA3AF]">Laatste betaling</p><p className="font-medium">{lastPayment ? new Date(lastPayment).toLocaleDateString("nl-NL") : "Nog geen betaling"}</p></div>
                <div className="sm:col-span-2"><p className="text-[11px] text-[#9CA3AF]">Factuuradres</p><p className="font-medium">{billing.address ? `${billing.address} ${billing.houseNumber ?? ""}, ${billing.postcode ?? ""} ${billing.city ?? ""}`.trim() : "—"}</p></div>
              </div>
            )}
            <p className="mt-4 border-t border-[#E2E0DB] pt-3 text-[12px] text-[#6B7280]">
              Betaaltermijn {PAYMENT_TERM_DAYS} dagen · pakketfacturen zijn eenmalig · onderhoud wordt periodiek
              gefactureerd · volgende onderhoud verwacht op{" "}
              {nextMaintenance.dueDate.toLocaleDateString("nl-NL")} ({nextMaintenance.amount})
            </p>
          </ReferenceCard>
        </div>
      )}

      {tab === "pakket" && (
        <ReferenceCard>
          <div className="mb-4 flex items-start justify-between gap-3">
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

          {packageLocked && (
            <div className="mb-5 flex gap-3 rounded-[14px] border border-[#E2E0DB] bg-white/50 p-4">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-[#6B7280]" />
              <div>
                <p className="text-[14px] font-medium text-[#111111]">Pakket is definitief</p>
                <p className="mt-1 text-[13px] leading-relaxed text-[#6B7280]">
                  Je pakket is bevestigd en betaald. Wil je upgraden of wijzigen? Neem contact op — wij regelen dit
                  persoonlijk met je.
                </p>
                <Button asChild variant="default" size="sm" className="mt-3">
                  <Link to="/portal/tickets">
                    <Mail className="mr-2 h-3.5 w-3.5" />
                    Contact opnemen
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {hasPendingPackage(client) ? (
            <div className="rounded-[16px] border border-dashed border-[#E2E0DB] bg-white/50 p-6 text-center">
              <p className="font-medium text-[#111111]">Nog geen pakket gekozen</p>
              <p className="mt-1 text-[13px] text-[#6B7280]">Kies je pakket in stap 5 van je intake.</p>
              <Button asChild variant="brand" className="mt-4">
                <Link to="/portal/stap/pakket">Naar pakket kiezen</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <PortalWebsitePackageCard planId={client.package.planId} compact />
              {client.package.maintenanceId && (
                <PortalMaintenancePackageCard maintenanceId={client.package.maintenanceId} compact />
              )}
            </div>
          )}
          <p className="mt-4 text-center text-[11px] text-[#9CA3AF]">Alle bedragen exclusief btw</p>
        </ReferenceCard>
      )}
    </div>
  );
}
