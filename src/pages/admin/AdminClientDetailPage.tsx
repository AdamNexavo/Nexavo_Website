import { useParams, Link, useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Copy, Trash2, Plus, Mail, Pencil, Upload, FileText as FileIcon, Globe, ExternalLink, ChevronDown, AlertCircle } from "lucide-react";
import { getClientById, upsertClient } from "@/lib/portal/storage";
import { migrateClient, type ClientAccount, type DocumentAttachment } from "@/lib/portal/types";
import { buildWebsitePrompt } from "@/lib/portal/prompt-builder";
import {
  ReferenceCard,
  ReferencePageTitle,
  ReferenceTabs,
  ReferenceBadge,
} from "@/components/portal/reference/ReferenceUI";
import { PortalProgressBar, PortalChecklist } from "@/components/portal/PortalUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getClientReferenceNumber, applyProjectProgress } from "@/lib/portal/helpers";
import {
  getClientCrmStatus,
  CRM_STATUS_LABELS,
} from "@/lib/portal/admin-stats";
import { getMaintenanceById, getPlanById } from "@/lib/portal/constants";
import { createAssignedDocument } from "@/lib/portal/client-documents";
import {
  MaintenancePolicyContent,
  UpsellPricingContent,
} from "@/components/portal/PortalPolicyContent";
import { MAINTENANCE_POLICY } from "@/data/revision-policy";
import { TICKET_STATUSES, TICKET_STATUS_VARIANT, INTEGRATION_STATUS_LABELS, type IntegrationStatus } from "@/lib/portal/constants";
import { integrations } from "@/data/integrations";
import { getIntegrationStatus } from "@/lib/portal/helpers";
import { WebsiteStatsPanel } from "@/components/portal/WebsiteStatsPanel";
import { AdminClientTechnicalForm } from "./AdminClientTechnicalForm";
import {
  getClientWebsites,
  getClientTechnicalSetup,
  isTechnicalSetupComplete,
} from "@/lib/portal/websites";
import type { ClientTechnicalSetup } from "@/lib/portal/types";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "overzicht", label: "Overzicht" },
  { id: "website", label: "Website & stats" },
  { id: "technisch", label: "Technische setup" },
  { id: "bedrijf", label: "Bedrijf & intake" },
  { id: "facturatie", label: "Facturatie" },
  { id: "documenten", label: "Documenten" },
  { id: "tickets", label: "Tickets" },
  { id: "build", label: "Build-prompt" },
];

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">{label}</p>
      <p className="mt-0.5 text-[14px] font-medium text-[#111111]">{value?.trim() ? value : "—"}</p>
    </div>
  );
}

export default function AdminClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [tab, setTab] = useState(() => searchParams.get("tab") ?? "overzicht");
  const [expandedSiteId, setExpandedSiteId] = useState<string | null>(
    () => searchParams.get("site"),
  );
  const [client, setClient] = useState<ClientAccount | null>(() => {
    const raw = id ? getClientById(id) : undefined;
    return raw ? migrateClient(raw) : null;
  });
  const [prompt, setPrompt] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [docDescription, setDocDescription] = useState("");
  const [docFile, setDocFile] = useState<DocumentAttachment | null>(null);
  const [editingUrls, setEditingUrls] = useState(false);
  const [websiteUrlDraft, setWebsiteUrlDraft] = useState("");
  const [previewUrlDraft, setPreviewUrlDraft] = useState("");

  const reloadClient = useCallback(() => {
    if (!id) return;
    const raw = getClientById(id);
    if (raw) {
      const next = migrateClient(raw);
      setClient(next);
      setPrompt(buildWebsitePrompt(next));
    }
  }, [id]);

  useEffect(() => {
    reloadClient();
  }, [reloadClient]);

  useEffect(() => {
    const urlTab = searchParams.get("tab");
    if (urlTab && TABS.some((t) => t.id === urlTab)) setTab(urlTab);
    const site = searchParams.get("site");
    if (site) setExpandedSiteId(site);
  }, [searchParams]);

  const changeTab = (id: string) => {
    setTab(id);
    setSearchParams({ tab: id });
  };

  useEffect(() => {
    if (!client) return;
    setWebsiteUrlDraft(client.websiteUrl ?? "");
    setPreviewUrlDraft(client.progress.previewUrl ?? "");
    setEditingUrls(false);
  }, [client?.id, client?.websiteUrl, client?.progress.previewUrl]);

  if (!client) {
    return (
      <ReferenceCard>
        <p>Klant niet gevonden.</p>
        <Link to="/admin/klanten" className="text-[#7547F8]">
          ← Terug
        </Link>
      </ReferenceCard>
    );
  }

  const status = getClientCrmStatus(client);
  const plan = getPlanById(client.package.planId);
  const maintenance = getMaintenanceById(client.package.maintenanceId ?? "plus");
  const o = client.onboarding;
  const b = client.billingInfo ?? {};

  const saveClient = (partial: ClientAccount) => {
    const saved = migrateClient(upsertClient(partial));
    setClient(saved);
    toast({ title: "Opgeslagen" });
  };

  const updateProgress = (percent: number) => {
    saveClient(applyProjectProgress(client, percent));
  };

  const saveUrls = () => {
    saveClient({
      ...client,
      websiteUrl: websiteUrlDraft.trim() || undefined,
      progress: {
        ...client.progress,
        previewUrl: previewUrlDraft.trim() || undefined,
        lastUpdate: new Date().toISOString(),
      },
    });
    setEditingUrls(false);
  };

  const handleDocFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Bestand te groot",
        description: "Upload maximaal 2 MB.",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setDocFile({
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        dataUrl: reader.result as string,
        size: file.size,
      });
    };
    reader.readAsDataURL(file);
  };

  const addDocument = () => {
    if (!docTitle.trim()) {
      toast({ title: "Titel verplicht", variant: "destructive" });
      return;
    }
    if (!docFile) {
      toast({ title: "Bestand verplicht", description: "Upload een PDF of document.", variant: "destructive" });
      return;
    }
    const doc = createAssignedDocument({
      title: docTitle.trim(),
      description: docDescription.trim() || undefined,
      attachment: docFile,
    });
    saveClient({
      ...client,
      assignedDocuments: [...(client.assignedDocuments ?? []), doc],
    });
    setDocTitle("");
    setDocDescription("");
    setDocFile(null);
  };

  const removeDocument = (docId: string) => {
    saveClient({
      ...client,
      assignedDocuments: (client.assignedDocuments ?? []).filter((d) => d.id !== docId),
    });
  };

  const hasSavedUrls = !!(client.websiteUrl?.trim() || client.progress.previewUrl?.trim());
  const websites = getClientWebsites(client);
  const technicalSetup = getClientTechnicalSetup(client);
  const techComplete = isTechnicalSetupComplete(technicalSetup);

  const saveTechnicalSetup = (setup: ClientTechnicalSetup) => {
    saveClient({ ...client, technicalSetup: setup });
  };

  return (
    <div>
      <Link
        to="/admin/klanten"
        className="mb-4 inline-flex items-center text-[13px] text-[#7547F8] hover:underline"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Terug naar CRM
      </Link>

      <ReferencePageTitle
        title={client.companyName}
        subtitle={`${getClientReferenceNumber(client)} · ${client.email}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <ReferenceBadge variant={status === "live" ? "green" : "purple"}>
              {CRM_STATUS_LABELS[status]}
            </ReferenceBadge>
            {!techComplete && (
              <ReferenceBadge variant="default">
                <AlertCircle className="mr-1 inline h-3 w-3" />
                Technisch onvolledig
              </ReferenceBadge>
            )}
            <Button variant="outline" size="sm" asChild>
              <a href={`mailto:${client.email}`}>
                <Mail className="mr-1 h-3.5 w-3.5" /> E-mail
              </a>
            </Button>
          </div>
        }
      />

      <ReferenceTabs items={TABS} active={tab} onChange={changeTab} />

      {!techComplete && tab === "overzicht" && (
        <ReferenceCard className="mb-5 border-[#F59E0B]/40 bg-[#FFFBEB]/40">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-[#F59E0B]" />
              <div>
                <p className="font-semibold text-[#111111]">Technische setup vereist</p>
                <p className="text-[13px] text-[#6B7280]">
                  Vul hosting, domein en DNS-gegevens in voordat deze klant compleet is in het CRM.
                </p>
              </div>
            </div>
            <Button variant="default" size="sm" onClick={() => changeTab("technisch")}>
              Naar technische setup
            </Button>
          </div>
        </ReferenceCard>
      )}

      {tab === "overzicht" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <ReferenceCard>
            <h3 className="mb-4 font-semibold">Projectvoortgang</h3>
            <PortalProgressBar percent={client.progress.percent} />
            <p className="my-3 text-[32px] font-semibold">{client.progress.percent}%</p>
            <p className="mb-3 text-[13px] text-[#6B7280]">{client.progress.phase}</p>
            <PortalChecklist items={client.progress.steps} />
            <div className="mt-4 flex flex-wrap gap-2">
              {[25, 50, 72, 100].map((p) => (
                <Button
                  key={p}
                  variant={client.progress.percent === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateProgress(p)}
                >
                  {p}%
                </Button>
              ))}
            </div>
          </ReferenceCard>

          <ReferenceCard className="space-y-4">
            <h3 className="font-semibold">Pakket & contact</h3>
            <Field label="Pakket" value={`${plan?.name ?? client.package.planName} · ${client.package.planPrice ?? "—"}`} />
            {maintenance && (
              <Field label="Onderhoud" value={`${maintenance.name} · ${maintenance.price}`} />
            )}
            <div className="rounded-[12px] border border-[#E2E0DB] bg-[#FAFAF8] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[12px] font-medium text-[#111111]">Pakket vergrendeld</p>
                  <p className="text-[11px] text-[#6B7280]">
                    {client.packageLocked
                      ? "Klant kan pakket niet zelf wijzigen."
                      : "Klant kan nog wijzigen via intake (tot betaling)."}
                  </p>
                </div>
                <Button
                  variant={client.packageLocked ? "outline" : "default"}
                  size="sm"
                  onClick={() => saveClient({ ...client, packageLocked: !client.packageLocked })}
                >
                  {client.packageLocked ? "Ontgrendelen" : "Definitief vergrendelen"}
                </Button>
              </div>
            </div>
            <Field label="Contactpersoon" value={`${client.user.firstName} ${client.user.lastName}`} />
            <Field label="Telefoon" value={client.user.phone} />
            <div className="space-y-4 border-t border-[#E5E5E5] pt-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[13px] font-semibold text-[#111111]">Website & preview URL</p>
                {hasSavedUrls && !editingUrls && (
                  <Button variant="ghost" size="sm" className="rounded-full text-[#7547F8]" onClick={() => setEditingUrls(true)}>
                    <Pencil className="mr-1 h-3.5 w-3.5" />
                    Wijzigen
                  </Button>
                )}
              </div>
              {!hasSavedUrls || editingUrls ? (
                <>
                  <div>
                    <Label>Website URL</Label>
                    <Input
                      value={websiteUrlDraft}
                      onChange={(e) => setWebsiteUrlDraft(e.target.value)}
                      placeholder="https://jouwbedrijf.nl"
                      className="mt-1.5 rounded-[12px] bg-white"
                    />
                  </div>
                  <div>
                    <Label>Preview URL</Label>
                    <Input
                      value={previewUrlDraft}
                      onChange={(e) => setPreviewUrlDraft(e.target.value)}
                      placeholder="https://preview.jouwbedrijf.works"
                      className="mt-1.5 rounded-[12px] bg-white"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="default" size="sm" onClick={saveUrls}>
                      Opslaan
                    </Button>
                    {hasSavedUrls && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setWebsiteUrlDraft(client.websiteUrl ?? "");
                          setPreviewUrlDraft(client.progress.previewUrl ?? "");
                          setEditingUrls(false);
                        }}
                      >
                        Annuleren
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <Field label="Website URL" value={client.websiteUrl} />
                  <Field label="Preview URL" value={client.progress.previewUrl} />
                </div>
              )}
            </div>
          </ReferenceCard>

          <ReferenceCard className="lg:col-span-2">
            <h3 className="mb-3 font-semibold">Betalingen</h3>
            {client.payments.length === 0 ? (
              <p className="text-[13px] text-[#6B7280]">Geen betalingen geregistreerd.</p>
            ) : (
              <div className="divide-y divide-[#E2E0DB]">
                {client.payments.map((p) => (
                  <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-[13px]">
                    <div>
                      <p className="font-medium">{p.description}</p>
                      <p className="text-[#6B7280]">Vervaldatum: {new Date(p.dueDate).toLocaleDateString("nl-NL")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{p.amount}</p>
                      <ReferenceBadge variant={p.status === "paid" ? "green" : "default"}>
                        {p.status === "paid" ? "Betaald" : p.status === "overdue" ? "Achterstallig" : "Open"}
                      </ReferenceBadge>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-2 text-[12px] text-[#9CA3AF]">
              {client.payments.filter((p) => p.status === "paid").length} van {client.payments.length} betaling(en) voldaan
            </p>
          </ReferenceCard>
        </div>
      )}

      {tab === "website" && (
        <div className="space-y-5">
          <ReferenceCard>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">Gekoppelde websites</h3>
                <p className="text-[13px] text-[#6B7280]">
                  {websites.length} website(s) · klik om statistieken te bekijken
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/websites">Alle websites</Link>
              </Button>
            </div>

            {websites.length === 0 ? (
              <p className="text-[13px] text-[#6B7280]">
                Nog geen website gekoppeld. Vul website- of preview-URL in bij Overzicht.
              </p>
            ) : (
              <div className="space-y-2">
                {websites.map((site) => {
                  const siteHref = site.url ?? site.previewUrl;
                  const expanded = expandedSiteId === site.id;
                  return (
                    <div key={site.id} className="rounded-[14px] border border-[#E5E5E5] bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setExpandedSiteId(expanded ? null : site.id)}
                        className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-[#FAFAFA]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <Globe className="h-5 w-5 shrink-0 text-[#7547F8]" />
                          <div className="min-w-0">
                            <p className="font-medium">{site.name}</p>
                            <p className="truncate text-[12px] text-[#6B7280]">
                              {siteHref?.replace(/^https?:\/\//, "") ?? "Geen URL"}
                            </p>
                          </div>
                          <ReferenceBadge variant={site.status === "live" ? "green" : site.status === "preview" ? "purple" : "default"}>
                            {site.status === "live" ? "Live" : site.status === "preview" ? "Preview" : "Concept"}
                          </ReferenceBadge>
                        </div>
                        <ChevronDown className={cn("h-4 w-4 shrink-0 text-[#9CA3AF] transition-transform", expanded && "rotate-180")} />
                      </button>
                      {expanded && (
                        <div className="border-t border-[#E5E5E5] bg-[#FAFAFA] p-4">
                          <div className="mb-4 flex flex-wrap gap-2">
                            {siteHref && (
                              <a
                                href={siteHref.startsWith("http") ? siteHref : `https://${siteHref}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-full border border-[#E5E5E5] bg-white px-3 py-1.5 text-[12px] font-medium hover:border-[#7547F8]/30"
                              >
                                Website openen
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                          <WebsiteStatsPanel client={client} adminView showPreview={false} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ReferenceCard>

          {websites.length > 0 && expandedSiteId === null && (
            <ReferenceCard>
              <p className="text-[13px] text-[#6B7280]">
                Selecteer een website hierboven om statistieken en grafieken te bekijken — dezelfde data als de klant ziet in het portaal.
              </p>
            </ReferenceCard>
          )}
        </div>
      )}

      {tab === "technisch" && (
        <AdminClientTechnicalForm client={client} onSave={saveTechnicalSetup} />
      )}

      {tab === "bedrijf" && (
        <div className="space-y-5">
          <ReferenceCard>
            <h3 className="mb-4 font-semibold">Bedrijfsgegevens</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Bedrijfsnaam" value={o.company.name || client.companyName} />
              <Field label="Branche" value={o.company.industry} />
              <Field label="Locatie" value={o.company.location} />
              <Field label="Contactpersoon" value={o.company.contactPerson} />
              <Field label="Doelgroep" value={o.company.targetAudience} />
              <Field label="Gewenst domein" value={o.company.desiredDomain} />
              <Field label="Huidige website" value={o.company.existingWebsite} />
              <Field label="Tone of voice" value={o.toneOfVoice} />
              <Field label="Uitstraling" value={o.stylePreference} />
            </div>
            {o.company.aboutCompany && (
              <div className="mt-4 rounded-[12px] bg-[#FAFAF8] p-4">
                <p className="text-[12px] text-[#9CA3AF]">Over het bedrijf</p>
                <p className="mt-1 text-[14px]">{o.company.aboutCompany}</p>
              </div>
            )}
          </ReferenceCard>

          <ReferenceCard>
            <h3 className="mb-4 font-semibold">Websitewensen</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Doelen" value={o.goals.join(", ")} />
              <Field label="Gewenste secties" value={o.desiredPages.join(", ")} />
              <Field label="Koppelingen" value={o.integrations.join(", ") || "Geen"} />
              <Field label="Hoofdkleur" value={o.colors.primary} />
              <Field label="Media" value={`${o.media.length} bestand(en)`} />
              <Field label="Grote bestanden" value={o.largeFilesStatus === "sent" ? "Per e-mail verstuurd" : o.largeFilesStatus === "not_applicable" ? "N.v.t." : "—"} />
            </div>
            {(o.websiteReferences ?? []).filter((r) => r.url).length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-[12px] font-medium text-[#9CA3AF]">Referenties</p>
                {o.websiteReferences!.filter((r) => r.url).map((r, i) => (
                  <div key={i} className="rounded-[12px] bg-[#FAFAF8] p-3 text-[13px]">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-medium text-[#7547F8] hover:underline">{r.url}</a>
                    {r.note && <p className="mt-1 text-[#6B7280]">{r.note}</p>}
                  </div>
                ))}
              </div>
            )}
          </ReferenceCard>

          {client.termsAcceptance || o.termsAccepted ? (
            <ReferenceCard>
              <h3 className="mb-3 font-semibold">Algemene voorwaarden</h3>
              <div className="grid gap-3 sm:grid-cols-2 text-[13px]">
                <Field
                  label="Geaccepteerd op"
                  value={new Date(client.termsAcceptance?.acceptedAt ?? o.termsAcceptedAt ?? "").toLocaleString("nl-NL")}
                />
                <Field label="IP-adres" value={client.termsAcceptance?.ipAddress} />
              </div>
            </ReferenceCard>
          ) : null}

          <ReferenceCard>
            <h3 className="mb-1 font-semibold">Koppelingen beheer</h3>
            <p className="mb-4 text-[13px] text-[#6B7280]">
              Keur koppelingen goed of zet ze op actief. Alleen status &quot;Actief&quot; verschijnt bij de klant onder Mijn koppelingen.
            </p>
            {(client.integrationRequests ?? []).length === 0 &&
            integrations.every((i) => getIntegrationStatus(client, i.name) === "not_linked") ? (
              <p className="text-[13px] text-[#6B7280]">Geen koppelingaanvragen of actieve koppelingen.</p>
            ) : (
              <div className="divide-y divide-[#E2E0DB]">
                {integrations
                  .filter((i) => getIntegrationStatus(client, i.name) !== "not_linked")
                  .map((integration) => {
                    const status = getIntegrationStatus(client, integration.name);
                    return (
                      <div key={integration.slug} className="flex flex-wrap items-center justify-between gap-3 py-3">
                        <div>
                          <p className="font-medium">{integration.name}</p>
                          <p className="text-[12px] text-[#9CA3AF]">
                            {INTEGRATION_STATUS_LABELS[status]}
                          </p>
                        </div>
                        <select
                          value={status}
                          onChange={(e) => {
                            const next = e.target.value as IntegrationStatus;
                            saveClient({
                              ...client,
                              integrationStatuses: {
                                ...client.integrationStatuses,
                                [integration.name]: next,
                              },
                            });
                          }}
                          className="h-9 rounded-[10px] border border-[#E2E0DB] bg-white px-3 text-[13px]"
                        >
                          <option value="requested">Aangevraagd</option>
                          <option value="in_progress">In behandeling</option>
                          <option value="active">Actief</option>
                          <option value="not_linked">Niet gekoppeld</option>
                        </select>
                      </div>
                    );
                  })}
              </div>
            )}
          </ReferenceCard>
        </div>
      )}

      {tab === "facturatie" && (
        <ReferenceCard className="space-y-4">
          <h3 className="font-semibold">Factuurgegevens</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Bedrijfsnaam" value={b.companyName || client.companyName} />
            <Field label="KVK" value={b.kvk} />
            <Field label="BTW" value={b.btw} />
            <Field label="E-mail facturatie" value={b.email || client.email} />
            <Field label="Straat" value={b.address} />
            <Field label="Huisnummer" value={`${b.houseNumber ?? ""}${b.addition ? ` ${b.addition}` : ""}`} />
            <Field label="Postcode" value={b.postcode} />
            <Field label="Plaats" value={b.city} />
            <Field label="Ten namegestelde" value={`${b.accountHolderFirstName ?? client.user.firstName} ${b.accountHolderLastName ?? client.user.lastName}`} />
          </div>
        </ReferenceCard>
      )}

      {tab === "documenten" && (
        <div className="space-y-5">
          <ReferenceCard>
            <h3 className="mb-1 font-semibold">Klantspecifieke documenten</h3>
            <p className="mb-4 text-[13px] text-[#6B7280]">
              Upload een bestand (PDF, Word, etc.) dat de klant kan downloaden onder Profiel → Documenten.
            </p>

            {(client.assignedDocuments ?? []).length === 0 ? (
              <p className="mb-4 text-[13px] text-[#6B7280]">Nog geen klantspecifieke documenten.</p>
            ) : (
              <div className="mb-5 divide-y divide-[#E5E5E5]">
                {(client.assignedDocuments ?? []).map((doc) => (
                  <div key={doc.id} className="flex items-start justify-between gap-3 py-3">
                    <div className="flex items-start gap-3">
                      <FileIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#7547F8]" />
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        {doc.description && <p className="text-[12px] text-[#6B7280]">{doc.description}</p>}
                        {doc.attachment && (
                          <p className="mt-1 text-[12px] text-[#9CA3AF]">{doc.attachment.fileName}</p>
                        )}
                        <p className="mt-1 text-[11px] text-[#9CA3AF]">
                          Toegevoegd op {new Date(doc.assignedAt).toLocaleDateString("nl-NL")}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeDocument(doc.id)}>
                      <Trash2 className="h-4 w-4 text-[#9CA3AF]" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3 rounded-[14px] border border-[#E5E5E5] bg-[#FAFAFA] p-4">
              <p className="text-[13px] font-semibold">Document uploaden</p>
              <div>
                <Label>Titel *</Label>
                <Input value={docTitle} onChange={(e) => setDocTitle(e.target.value)} className="mt-1 rounded-[12px] bg-white" placeholder="Bijv. Offerte maatwerk" />
              </div>
              <div>
                <Label>Omschrijving</Label>
                <Input value={docDescription} onChange={(e) => setDocDescription(e.target.value)} className="mt-1 rounded-[12px] bg-white" placeholder="Optioneel" />
              </div>
              <div>
                <Label>Bestand *</Label>
                <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed border-[#D1D5DB] bg-white px-4 py-6 text-center transition-colors hover:border-[#7547F8]/40">
                  <Upload className="mb-2 h-6 w-6 text-[#7547F8]" />
                  <span className="text-[13px] font-medium text-[#111111]">
                    {docFile ? docFile.fileName : "Klik om een bestand te kiezen"}
                  </span>
                  <span className="mt-1 text-[11px] text-[#9CA3AF]">PDF, Word, Excel — max. 2 MB</span>
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" onChange={handleDocFile} />
                </label>
              </div>
              <Button variant="default" onClick={addDocument} disabled={!docTitle.trim() || !docFile}>
                <Plus className="mr-2 h-4 w-4" /> Toevoegen aan klant
              </Button>
            </div>
          </ReferenceCard>

          <ReferenceCard>
            <h3 className="mb-3 font-semibold">Standaard beleid (referentie)</h3>
            <a
              href={MAINTENANCE_POLICY.pdfHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 inline-flex text-[13px] font-medium text-[#7547F8] hover:underline"
            >
              Download PDF-beleid v{MAINTENANCE_POLICY.version}
            </a>
            <MaintenancePolicyContent compact />
          </ReferenceCard>

          <ReferenceCard>
            <h3 className="mb-3 font-semibold">Upsell-prijzen (referentie)</h3>
            <UpsellPricingContent compact />
          </ReferenceCard>
        </div>
      )}

      {tab === "tickets" && (
        <ReferenceCard>
          <h3 className="mb-4 font-semibold">Tickets ({client.tickets.length})</h3>
          {client.tickets.length === 0 ? (
            <p className="text-[13px] text-[#6B7280]">Geen tickets van deze klant.</p>
          ) : (
            <div className="space-y-4">
              {client.tickets.map((t) => (
                <div key={t.id} className="rounded-[14px] border border-[#E2E0DB] p-4">
                  <div className="mb-2 flex flex-wrap justify-between gap-2">
                    <div>
                      <span className="font-mono text-[11px] text-[#9CA3AF]">{t.number}</span>
                      <p className="font-semibold">{t.subject}</p>
                    </div>
                    <ReferenceBadge variant={TICKET_STATUS_VARIANT[t.status] ?? "default"}>
                      {TICKET_STATUSES[t.status]}
                    </ReferenceBadge>
                  </div>
                  <p className="text-[12px] text-[#6B7280]">{t.messages.length} bericht(en)</p>
                  <Link
                    to={`/admin/tickets?ticket=${t.id}&client=${client.id}`}
                    className="mt-2 inline-block text-[13px] text-[#7547F8] hover:underline"
                  >
                    Open in inbox →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </ReferenceCard>
      )}

      {tab === "build" && (
        <ReferenceCard>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Build-prompt</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(prompt);
                toast({ title: "Prompt gekopieerd" });
              }}
            >
              <Copy className="mr-2 h-4 w-4" />Kopiëren
            </Button>
          </div>
          <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="min-h-[400px] rounded-[12px] font-mono text-[12px]" />
        </ReferenceCard>
      )}
    </div>
  );
}
