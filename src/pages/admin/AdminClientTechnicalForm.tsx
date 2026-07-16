import { ExternalLink, AlertCircle, CheckCircle2 } from "lucide-react";
import type { ClientAccount, ClientTechnicalSetup } from "@/lib/portal/types";
import { ReferenceCard, ReferenceBadge } from "@/components/portal/reference/ReferenceUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HOSTING_PROVIDERS, resolveProviderLoginUrl } from "@/lib/portal/hosting-providers";
import {
  getClientTechnicalSetup,
  isTechnicalSetupComplete,
  getTechnicalSetupMissing,
  getProviderLabel,
  TECHNICAL_CHECKLIST_ITEMS,
  syncTechnicalChecklist,
  getRequiredChecklistComplete,
} from "@/lib/portal/websites";
import type { TechnicalSetupChecklist, PixelType } from "@/lib/portal/types";

type Props = {
  client: ClientAccount;
  onSave: (setup: ClientTechnicalSetup) => void;
};

export function AdminClientTechnicalForm({ client, onSave }: Props) {
  const setup = getClientTechnicalSetup(client);
  const complete = isTechnicalSetupComplete(setup);
  const missing = getTechnicalSetupMissing(setup);
  const loginUrl = resolveProviderLoginUrl(setup.hostingProvider, setup.providerLoginUrl);

  const persist = (partial: Partial<ClientTechnicalSetup>) => {
    onSave(
      syncTechnicalChecklist({
        ...setup,
        ...partial,
        updatedAt: new Date().toISOString(),
      }),
    );
  };

  const updateChecklist = (key: keyof TechnicalSetupChecklist, value: boolean) => {
    const checklist = { ...setup.checklist, [key]: value };
    if (key === "pixelAdded") {
      persist({ checklist, pixelInstalled: value });
      return;
    }
    if (key === "technicallyComplete") {
      if (value && !getRequiredChecklistComplete({ ...setup, checklist })) return;
      persist({ checklist });
      return;
    }
    persist({ checklist });
  };

  const update = (partial: Partial<ClientTechnicalSetup>) => {
    persist(partial);
  };

  const markComplete = () => {
    if (!getRequiredChecklistComplete(setup)) return;
    persist({
      completed: true,
      checklist: { ...setup.checklist, technicallyComplete: true },
    });
  };

  return (
    <div className="space-y-5">
      <ReferenceCard
        className={complete ? "border-[#10B981]/30" : "border-[#F59E0B]/40 bg-[#FFFBEB]/30"}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex gap-3">
            {complete ? (
              <CheckCircle2 className="h-6 w-6 shrink-0 text-[#10B981]" />
            ) : (
              <AlertCircle className="h-6 w-6 shrink-0 text-[#F59E0B]" />
            )}
            <div>
              <h3 className="font-semibold text-[#111111]">Technische setup</h3>
              <p className="mt-1 text-[13px] text-[#6B7280]">
                Checklist voor technische oplevering. DNS is optioneel — niet verplicht voor afronding.
              </p>
              {!complete && missing.length > 0 && (
                <p className="mt-2 text-[12px] text-[#B45309]">
                  Nog invullen: {missing.join(", ")}
                </p>
              )}
            </div>
          </div>
          <ReferenceBadge variant={complete ? "green" : "default"}>
            {setup.completed ? "Afgerond" : complete ? "Klaar om af te ronden" : "Onvolledig"}
          </ReferenceBadge>
        </div>
      </ReferenceCard>

      <ReferenceCard>
        <h4 className="mb-3 text-[14px] font-semibold">Technische checklist</h4>
        <div className="grid gap-2 sm:grid-cols-2">
          {TECHNICAL_CHECKLIST_ITEMS.map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-2 rounded-[10px] border border-[#E2E0DB] bg-white px-3 py-2.5 text-[13px]"
            >
              <input
                type="checkbox"
                checked={setup.checklist?.[item.key] ?? false}
                onChange={(e) => updateChecklist(item.key, e.target.checked)}
                className="rounded border-[#D1D5DB]"
              />
              <span>
                {item.label}
                {!item.required && <span className="ml-1 text-[11px] text-[#9CA3AF]">(optioneel)</span>}
              </span>
            </label>
          ))}
        </div>
      </ReferenceCard>

      <ReferenceCard className="space-y-5">
        <div>
          <h4 className="mb-3 text-[14px] font-semibold">Hosting & provider</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Hosting provider *</Label>
              <select
                value={setup.hostingProvider ?? ""}
                onChange={(e) => {
                  const id = e.target.value;
                  const preset = HOSTING_PROVIDERS.find((p) => p.id === id);
                  update({
                    hostingProvider: id,
                    providerLoginUrl: preset?.loginUrl || setup.providerLoginUrl,
                  });
                }}
                className="mt-1.5 h px-3 text-[14px]"
              >
                <option value="">Selecteer provider...</option>
                {HOSTING_PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            {setup.hostingProvider === "other" && (
              <div>
                <Label>Provider naam</Label>
                <Input
                  value={setup.hostingProviderLabel ?? ""}
                  onChange={(e) => update({ hostingProviderLabel: e.target.value })}
                  className="mt-1.5 rounded-[12px] bg-white"
                  placeholder="Naam provider"
                />
              </div>
            )}
            <div className="sm:col-span-2">
              <Label>Login-URL provider *</Label>
              <Input
                value={setup.providerLoginUrl ?? ""}
                onChange={(e) => update({ providerLoginUrl: e.target.value })}
                className="mt-1.5 rounded-[12px] bg-white"
                placeholder="https://..."
              />
              {loginUrl && (
                <a
                  href={loginUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium text-[#7547F8] hover:underline"
                >
                  Inloggen bij {getProviderLabel(setup)}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-[#E5E5E5] pt-5">
          <h4 className="mb-3 text-[14px] font-semibold">Domein</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Domeinnaam *</Label>
              <Input
                value={setup.domainName ?? ""}
                onChange={(e) => update({ domainName: e.target.value })}
                className="mt-1.5 rounded-[12px] bg-white"
                placeholder="jouwbedrijf.nl"
              />
            </div>
            <div>
              <Label>Domein eigendom *</Label>
              <select
                value={setup.domainOwnership ?? "client"}
                onChange={(e) => update({ domainOwnership: e.target.value as "client" | "nexavo" })}
                className="mt-1.5 h px-3 text-[14px]"
              >
                <option value="client">Klant heeft eigen domein</option>
                <option value="nexavo">Via Nexavo geregistreerd</option>
              </select>
            </div>
            <div>
              <Label>DNS beheer</Label>
              <select
                value={setup.dnsManagedBy ?? "client"}
                onChange={(e) =>
                  update({ dnsManagedBy: e.target.value as "client" | "nexavo" | "provider" })
                }
                className="mt-1.5 h px-3 text-[14px]"
              >
                <option value="client">Klant</option>
                <option value="nexavo">Nexavo</option>
                <option value="provider">Hosting provider</option>
              </select>
            </div>
            <div>
              <Label>CMS / platform</Label>
              <Input
                value={setup.cmsPlatform ?? ""}
                onChange={(e) => update({ cmsPlatform: e.target.value })}
                className="mt-1.5 rounded-[12px] bg-white"
                placeholder="WordPress, custom, etc."
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[#E5E5E5] pt-5">
          <h4 className="mb-3 text-[14px] font-semibold">DNS-gegevens</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Nameservers</Label>
              <Input
                value={setup.nameservers ?? ""}
                onChange={(e) => update({ nameservers: e.target.value })}
                className="mt-1.5 rounded-[12px] bg-white font-mono text-[13px]"
                placeholder="ns1.provider.nl, ns2.provider.nl"
              />
            </div>
            <div>
              <Label>A-record</Label>
              <Input
                value={setup.aRecord ?? ""}
                onChange={(e) => update({ aRecord: e.target.value })}
                className="mt-1.5 rounded-[12px] bg-white font-mono text-[13px]"
                placeholder="192.0.2.1"
              />
            </div>
            <div>
              <Label>CNAME</Label>
              <Input
                value={setup.cnameRecord ?? ""}
                onChange={(e) => update({ cnameRecord: e.target.value })}
                className="mt-1.5 rounded-[12px] bg-white font-mono text-[13px]"
                placeholder="www → ..."
              />
            </div>
            <div className="sm:col-span-2">
              <Label>TXT / overige records</Label>
              <Textarea
                value={setup.txtRecords ?? ""}
                onChange={(e) => update({ txtRecords: e.target.value })}
                className="mt-1.5 min-h-[80px] rounded-[12px] bg-white font-mono text-[13px]"
                placeholder="SPF, DKIM, verificatie-records..."
              />
            </div>
            <div>
              <Label>SSL</Label>
              <Input
                value={setup.sslProvider ?? ""}
                onChange={(e) => update({ sslProvider: e.target.value })}
                className="mt-1.5 rounded-[12px] bg-white"
                placeholder="Let's Encrypt, Cloudflare..."
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[#E5E5E5] pt-5">
          <h4 className="mb-3 text-[14px] font-semibold">Pixel & tracking</h4>
          <label className="mb-3 flex items-center gap-2 text-[14px]">
            <input
              type="checkbox"
              checked={setup.pixelInstalled ?? setup.checklist?.pixelAdded ?? false}
              onChange={(e) => updateChecklist("pixelAdded", e.target.checked)}
              className="rounded border-[#D1D5DB]"
            />
            Pixel toegevoegd
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Pixel type</Label>
              <select
                value={setup.pixelType ?? ""}
                onChange={(e) => update({ pixelType: (e.target.value || undefined) as PixelType | undefined })}
                className="mt-1.5 h px-3 text-[14px]"
              >
                <option value="">—</option>
                <option value="meta">Meta Pixel</option>
                <option value="tiktok">TikTok Pixel</option>
                <option value="google_ads">Google Ads Tag</option>
                <option value="google_analytics">Google Analytics</option>
                <option value="other">Anders</option>
              </select>
            </div>
            <div>
              <Label>Pixel ID</Label>
              <Input
                value={setup.pixelId ?? ""}
                onChange={(e) => update({ pixelId: e.target.value })}
                className="mt-1.5 rounded-[12px] bg-white"
                placeholder="Pixel / measurement ID"
              />
            </div>
          </div>
          <Textarea
            value={setup.pixelNotes ?? ""}
            onChange={(e) => update({ pixelNotes: e.target.value })}
            className="mt-3 min-h-[60px] rounded-[12px] bg-white text-[13px]"
            placeholder="Opmerking over tracking setup..."
          />
        </div>

        <div>
          <Label>Interne notities</Label>
          <Textarea
            value={setup.internalNotes ?? ""}
            onChange={(e) => update({ internalNotes: e.target.value })}
            className="mt-1.5 min-h-[80px] rounded-[12px] bg-white"
          />
        </div>

        <div className="flex flex-wrap gap-2 border-t border-[#E5E5E5] pt-4">
          <Button variant="default" onClick={markComplete} disabled={!getRequiredChecklistComplete(setup)}>
            Opslaan & als afgerond markeren
          </Button>
          <Button
            variant="outline"
            onClick={() => update({ completed: false })}
            disabled={!setup.completed}
          >
            Markeer als onvolledig
          </Button>
        </div>
      </ReferenceCard>
    </div>
  );
}
