import { Pencil, FileText, ExternalLink, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { upsertClient } from "@/lib/portal/storage";
import {
  getClientReferenceNumber,
  isPackageChangeLocked,
  hasPendingPackage,
  formatMonthlyPriceDisplay,
} from "@/lib/portal/helpers";
import { getPlanById, getMaintenanceById } from "@/lib/portal/constants";
import {
  ReferenceCard,
  ReferencePageTitle,
  ReferenceTabs,
  ReferenceWhiteCard,
  refInputClass,
  refLabelClass,
} from "@/components/portal/reference/ReferenceUI";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getClientVisibleDocuments } from "@/lib/portal/client-documents";

const TABS = [
  { id: "gegevens", label: "Gegevens" },
  { id: "documenten", label: "Documenten" },
  { id: "pakket", label: "Pakket & facturatie" },
];

export default function PortalProfielPage() {
  const { client, refreshClient } = usePortalAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState("gegevens");
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  if (!client) return null;

  const startEditingProfile = () => {
    setProfileDraft({
      firstName: client.user.firstName,
      lastName: client.user.lastName,
      phone: client.user.phone ?? "",
    });
    setEditingProfile(true);
  };

  const saveProfile = () => {
    upsertClient({
      ...client,
      user: {
        ...client.user,
        firstName: profileDraft.firstName,
        lastName: profileDraft.lastName,
        phone: profileDraft.phone,
      },
    });
    refreshClient();
    setEditingProfile(false);
    toast({ title: "Profiel opgeslagen" });
  };

  const initials = client.user.firstName?.[0]?.toUpperCase() ?? "J";
  const clientRef = getClientReferenceNumber(client);
  const packageLocked = isPackageChangeLocked(client);
  const canChangeInIntake = !packageLocked && !client.onboarding.completed;

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

          <div className="flex flex-col gap-5">
            <ReferenceCard className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">Gegevens wijzigen</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-[#7547F8]"
                  onClick={() => (editingProfile ? setEditingProfile(false) : startEditingProfile())}
                >
                  <Pencil className="mr-1 h-3.5 w-3.5" />
                  {editingProfile ? "Sluiten" : "Wijzig"}
                </Button>
              </div>
              {editingProfile ? (
                <>
                  <div>
                    <label className={refLabelClass}>Voornaam</label>
                    <Input
                      value={profileDraft.firstName}
                      onChange={(e) => setProfileDraft((draft) => ({ ...draft, firstName: e.target.value }))}
                      className={refInputClass}
                    />
                  </div>
                  <div>
                    <label className={refLabelClass}>Achternaam</label>
                    <Input
                      value={profileDraft.lastName}
                      onChange={(e) => setProfileDraft((draft) => ({ ...draft, lastName: e.target.value }))}
                      className={refInputClass}
                    />
                  </div>
                  <div>
                    <label className={refLabelClass}>Telefoon</label>
                    <Input
                      value={profileDraft.phone}
                      onChange={(e) => setProfileDraft((draft) => ({ ...draft, phone: e.target.value }))}
                      className={refInputClass}
                    />
                  </div>
                  <Button variant="brand" onClick={saveProfile} className="w-full">
                    Opslaan
                  </Button>
                </>
              ) : (
                <div className="space-y-4 text-[14px]">
                  <div>
                    <p className="text-[12px] text-[#9CA3AF]">Voornaam</p>
                    <p className="font-medium">{client.user.firstName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#9CA3AF]">Achternaam</p>
                    <p className="font-medium">{client.user.lastName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#9CA3AF]">Telefoon</p>
                    <p className="font-medium">{client.user.phone || "—"}</p>
                  </div>
                </div>
              )}
            </ReferenceCard>

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
            <p className="mt-4 border-t border-[#E2E0DB] pt-3 text-[13px] text-[#6B7280]">
              Facturen en betalingen vind je op{" "}
              <Link to="/portal/facturatie" className="font-medium text-[#7547F8] hover:underline">
                facturatie & betaling
              </Link>
              .
            </p>
            <p className="mt-2 text-[12px] text-[#9CA3AF]">Alle bedragen exclusief btw</p>
          </div>
        </ReferenceWhiteCard>
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
