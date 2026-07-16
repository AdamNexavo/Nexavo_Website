import { Link } from "react-router-dom";
import { Calendar, CheckCircle2, ExternalLink } from "lucide-react";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { clientHasBookingFeature } from "@/lib/portal/package-features";
import {
  getFeatureModuleBlockReason,
  getModuleIntegrationStatus,
} from "@/lib/portal/integration-helpers";
import { ReferencePageTitle, ReferenceBadge } from "@/components/portal/reference/ReferenceUI";
import { ReferencePanelCard } from "@/components/portal/MailboxUI";
import { PortalLockedSection } from "@/components/portal/PortalUI";
import { Button } from "@/components/ui/button";

const MOCK_BOOKINGS = [
  { id: "1", name: "Jan de Vries", service: "Intake gesprek", date: "15 jul 2026", status: "Bevestigd" },
  { id: "2", name: "Lisa Bakker", service: "Consult", date: "18 jul 2026", status: "In afwachting" },
];

const BENEFITS = [
  "Online afspraken laten plannen — 24/7",
  "Beschikbaarheid en tijdslots beheren",
  "Google Calendar / Calendly koppeling",
  "Automatische bevestiging en herinneringen",
  "Minder handmatig contact en telefoontjes",
];

const ATTENTION = [
  "Vereist actieve koppeling en configuratie door Nexavo",
  "Geschikt wanneer je regelmatig afspraken plant",
];

function moduleStatusLabel(status: string, blocked: boolean) {
  if (blocked) return "Niet actief";
  if (status === "requested") return "Aangevraagd";
  if (status === "in_progress") return "In inrichting";
  if (status === "active") return "Actief";
  return "Niet actief";
}

export default function PortalBoekingskalenderPage() {
  const { client } = usePortalAuth();
  if (!client) return null;

  const inPackage = clientHasBookingFeature(client);
  const blockReason = getFeatureModuleBlockReason(client, "booking", inPackage);
  const integrationStatus = getModuleIntegrationStatus(client, "booking");
  const active = !blockReason && integrationStatus === "active";
  const statusLabel = moduleStatusLabel(integrationStatus, !!blockReason);

  return (
    <div className="space-y-6">
      <ReferencePageTitle
        title="Boekingskalender"
        subtitle="Online boeken, afspraken en beschikbaarheid — gekoppeld aan je website."
        action={<ReferenceBadge variant={active ? "green" : "purple"}>{statusLabel}</ReferenceBadge>}
      />

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <PortalLockedSection
          title="Boekingskalender"
          subtitle="Laat klanten zelf online een afspraak plannen."
          locked={!active}
          lockMessage="Module nog niet actief — vraag de koppeling aan of rond je intake af"
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Deze maand", value: "17" },
              { label: "Bevestigd", value: "12" },
              { label: "Conversie", value: "8,2%" },
            ].map((s) => (
              <div key={s.label} className="rounded-[12px] border border-[#E2E0DB] bg-white shadow-block p-4 text-center">
                <p className="text-[22px] font-semibold">{s.value}</p>
                <p className="text-[12px] text-[#6B7280]">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 divide-y divide-[#E2E0DB] rounded-[12px] border border-[#E2E0DB] bg-white shadow-block">
            {MOCK_BOOKINGS.map((b) => (
              <div key={b.id} className="grid grid-cols-4 gap-3 px-4 py-3 text-[13px]">
                <span className="font-medium text-[#111111]">{b.name}</span>
                <span className="text-[#6B7280]">{b.service}</span>
                <span className="text-[#6B7280]">{b.date}</span>
                <ReferenceBadge variant="green">{b.status}</ReferenceBadge>
              </div>
            ))}
          </div>
        </PortalLockedSection>

        <ReferencePanelCard title="Over deze module" subtitle="Wat Nexavo voor je kan instellen">
          <div className="space-y-4 bg-white p-5">
            <p className="text-[14px] leading-relaxed text-[#6B7280]">
              Met een boekingskalender op je website kunnen klanten direct een moment kiezen. Bevestigingen en
              herinneringen gaan automatisch.
            </p>
            <div>
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Voordelen</p>
              <ul className="space-y-1.5">
                {BENEFITS.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px] text-[#374151]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#7547F8]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Aandachtspunten</p>
              <ul className="space-y-1.5">
                {ATTENTION.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px] text-[#6B7280]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F97316]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Button asChild variant="outline" className="rounded-full border-[#E2E0DB] bg-[#F5F5F5] hover:bg-[#EBEBEA]">
              <Link to="/diensten/boekingskalender">
                Meer over boekingskalender
                <ExternalLink className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
            {!active && (
              <Button asChild variant="default" className="w-full rounded-full">
                <Link to="/portal/koppelingen">Koppeling aanvragen</Link>
              </Button>
            )}
          </div>
        </ReferencePanelCard>
      </div>
    </div>
  );
}
