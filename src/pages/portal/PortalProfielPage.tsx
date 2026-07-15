import { Pencil, FileText, ExternalLink } from "lucide-react";
import { useState } from "react";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { upsertClient } from "@/lib/portal/storage";
import { getClientReferenceNumber } from "@/lib/portal/helpers";
import { getPlanById, getMaintenanceById } from "@/lib/portal/constants";
import { isPackageChangeLocked } from "@/lib/portal/helpers";
import {
  ReferenceCard,
  ReferencePageTitle,
  ReferenceTabs,
  refInputClass,
  refLabelClass,
} from "@/components/portal/reference/ReferenceUI";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getClientVisibleDocuments } from "@/lib/portal/client-documents";

const TABS = [
  { id: "gegevens", label: "Gegevens" },
  { id: "inloggen", label: "Inloggen" },
  { id: "pakket", label: "Pakket & facturatie" },
  { id: "documenten", label: "Documenten" },
];

export default function PortalProfielPage() {
  const { client, refreshClient } = usePortalAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState("gegevens");

  if (!client) return null;

  const updateUser = (field: "firstName" | "lastName" | "phone", value: string) => {
    upsertClient({ ...client, user: { ...client.user, [field]: value } });
    refreshClient();
  };

  const initials = client.user.firstName?.[0]?.toUpperCase() ?? "J";
  const clientRef = getClientReferenceNumber(client);
  const plan = getPlanById(client.package.planId);
  const maintenance = getMaintenanceById(client.package.maintenanceId ?? "plus");

  return (
    <div>
      <ReferencePageTitle title="Account" />
      <ReferenceTabs items={TABS} active={tab} onChange={setTab} />

      {tab === "gegevens" && (
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <ReferenceCard className="overflow-hidden !p-0">
            <div className="relative border-b border-[#E2E0DB] bg-[#F5F5F5] px-6 pb-8 pt-10 text-center">
              <div className="pointer-events-none absolute -left-8 -top-12 h-32 w-[120%] rounded-[50%] bg-[#EAEAEA]" />
              <Button variant="ghost" size="sm" className="absolute right-4 top-4 rounded-full text-[#7547F8]">
                <Pencil className="mr-1 h-3.5 w-3.5" />Wijzig
              </Button>
              <div className="relative mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border border-[#E2E0DB] bg-white text-2xl font-semibold text-[#6B7280]">
                {initials}
              </div>
              <p className="relative text-[18px] font-semibold">{client.user.firstName}</p>
            </div>
            <div className="space-y-4 p-6 text-[14px]">
              <div>
                <p className="text-[12px] text-[#9CA3AF]">E-mailadres</p>
                <p className="font-medium text-[#7547F8]">{client.email}</p>
              </div>
              <div>
                <p className="text-[12px] text-[#9CA3AF]">Klantnummer</p>
                <p className="font-mono font-semibold text-[#7547F8]">{clientRef}</p>
              </div>
              <div>
                <p className="text-[12px] text-[#9CA3AF]">Telefoon</p>
                <p className="font-medium">{client.user.phone ?? "—"}</p>
              </div>
              <div>
                <p className="text-[12px] text-[#9CA3AF]">Taal van platform</p>
                <p className="font-medium">Nederlands</p>
              </div>
            </div>
          </ReferenceCard>

          <ReferenceCard className="space-y-4">
            <h3 className="font-semibold">Gegevens wijzigen</h3>
            <div>
              <label className={refLabelClass}>Voornaam</label>
              <Input value={client.user.firstName} onChange={(e) => updateUser("firstName", e.target.value)} className={refInputClass} />
            </div>
            <div>
              <label className={refLabelClass}>Achternaam</label>
              <Input value={client.user.lastName} onChange={(e) => updateUser("lastName", e.target.value)} className={refInputClass} />
            </div>
            <div>
              <label className={refLabelClass}>Telefoon</label>
              <Input value={client.user.phone ?? ""} onChange={(e) => updateUser("phone", e.target.value)} className={refInputClass} />
            </div>
            <Button variant="brand" onClick={() => toast({ title: "Profiel opgeslagen" })} className="w-full">
              Opslaan
            </Button>
          </ReferenceCard>
        </div>
      )}

      {tab === "inloggen" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <ReferenceCard>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Inloggen</h3>
              <Button variant="ghost" size="sm" className="rounded-full text-[#7547F8]">
                <Pencil className="mr-1 h-3.5 w-3.5" />Wijzig
              </Button>
            </div>
            <div className="space-y-4 text-[14px]">
              <div>
                <p className="text-[12px] text-[#9CA3AF]">Wachtwoord</p>
                <p className="font-medium tracking-widest">••••••••••••</p>
              </div>
              <div>
                <p className="mb-2 text-[12px] text-[#9CA3AF]">Tweestapsverificatie</p>
                <Button variant="outline" className="rounded-full border-[#E2E0DB]">
                  Tweestapsverificatie inschakelen
                </Button>
              </div>
            </div>
          </ReferenceCard>
        </div>
      )}

      {tab === "pakket" && (
        <ReferenceCard className="space-y-4">
          <div>
            <p className="text-[12px] text-[#9CA3AF]">Huidig pakket</p>
            <p className="text-[18px] font-semibold text-[#111111]">{plan?.name ?? client.package.planName}</p>
            <p className="text-[14px] text-[#7547F8]">{plan?.price ?? client.package.planPrice}</p>
          </div>
          {maintenance && (
            <div>
              <p className="text-[12px] text-[#9CA3AF]">Onderhoud</p>
              <p className="font-medium">{maintenance.name} · {maintenance.price} {maintenance.priceNote}</p>
            </div>
          )}
          <p className="text-[13px] text-[#6B7280]">
            {isPackageChangeLocked(client) ? (
              <>
                Je pakket is definitief. Wijzigingen?{" "}
                <a href="/portal/tickets" className="font-medium text-[#7547F8] hover:underline">
                  Neem contact op via een ticket
                </a>
                .
              </>
            ) : !client.onboarding.completed ? (
              <>
                Wijzig je pakket via{" "}
                <a href="/portal/stap/pakket" className="font-medium text-[#7547F8] hover:underline">
                  stap 5 — Pakket kiezen
                </a>
                . Facturen op{" "}
                <a href="/portal/facturatie" className="font-medium text-[#7547F8] hover:underline">
                  facturatie & betaling
                </a>
                .
              </>
            ) : (
              <>
                Bekijk je pakket op{" "}
                <a href="/portal/facturatie?tab=pakket" className="font-medium text-[#7547F8] hover:underline">
                  facturatie → Websitepakket
                </a>
                .
              </>
            )}
          </p>
        </ReferenceCard>
      )}

      {tab === "documenten" && (
        <ReferenceCard>
          <h3 className="mb-1 text-[15px] font-semibold">Documenten</h3>
          <p className="mb-4 text-[13px] text-[#6B7280]">
            Algemene voorwaarden, onderhouds- & revisiebeleid, privacyverklaring en documenten van Nexavo.
          </p>
          <div className="divide-y divide-[#E2E0DB]">
            {getClientVisibleDocuments(client).map((doc) => (
              <div key={doc.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 shrink-0 text-[#7547F8]" />
                  <div className="flex-1">
                    <p className="text-[14px] font-medium text-[#111111]">
                      {doc.title}
                      {doc.source === "assigned" && (
                        <span className="ml-2 text-[10px] font-medium uppercase text-[#7547F8]">
                          Toegevoegd door Nexavo
                        </span>
                      )}
                    </p>
                    {doc.description && (
                      <p className="text-[12px] text-[#6B7280]">{doc.description}</p>
                    )}
                    {doc.assignedAt && (
                      <p className="mt-1 text-[11px] text-[#9CA3AF]">
                        Toegevoegd op {new Date(doc.assignedAt).toLocaleDateString("nl-NL")}
                      </p>
                    )}
                  </div>
                  {doc.href && (
                    <a
                      href={doc.href}
                      download={doc.fileName || undefined}
                      target={doc.external && !doc.fileName ? "_blank" : undefined}
                      rel={doc.external && !doc.fileName ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1 text-[13px] font-medium text-[#7547F8] hover:underline"
                    >
                      {doc.fileName ? "Download" : doc.external ? "Open PDF" : "Openen"}
                      {doc.external && !doc.fileName && <ExternalLink className="h-3.5 w-3.5" />}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ReferenceCard>
      )}
    </div>
  );
}
