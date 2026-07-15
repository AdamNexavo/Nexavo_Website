import { Calendar } from "lucide-react";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { clientHasBookingFeature } from "@/lib/portal/package-features";
import {
  getFeatureModuleBlockReason,
  getModuleIntegrationStatus,
} from "@/lib/portal/integration-helpers";
import { PortalCard, PortalPageHeader, PortalBadge, PortalLockedSection } from "@/components/portal/PortalUI";
import { PortalFeatureStatusBanner } from "@/components/portal/PortalFeatureStatusBanner";

const MOCK_BOOKINGS = [
  { id: "1", name: "Jan de Vries", service: "Intake gesprek", date: "15 jul 2026", status: "Bevestigd" },
  { id: "2", name: "Lisa Bakker", service: "Consult", date: "18 jul 2026", status: "In afwachting" },
];

export default function PortalBoekingskalenderPage() {
  const { client } = usePortalAuth();
  if (!client) return null;

  const inPackage = clientHasBookingFeature(client);
  const blockReason = getFeatureModuleBlockReason(client, "booking", inPackage);
  const integrationStatus = getModuleIntegrationStatus(client, "booking");
  const active = !blockReason && integrationStatus === "active";

  return (
    <div>
      <PortalPageHeader
        title="Boekingskalender"
        subtitle="Online boeken, afspraken en boekingen — gekoppeld aan je website."
      />

      {blockReason && (
        <PortalFeatureStatusBanner reason={blockReason} moduleLabel="Boekingskalender" className="mb-6" />
      )}

      <PortalLockedSection
        title="Boekingen & statistieken"
        subtitle="Overzicht van alle afspraken en boekingen"
        locked={!active}
        lockMessage={
          blockReason === "not_in_package"
            ? "Upgrade je pakket voor boekingskalender"
            : blockReason === "intake_incomplete"
              ? "Beschikbaar na voltooide intake"
              : "Wacht op activatie via Koppelingen"
        }
      >
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Deze maand", value: active ? "17" : "—" },
            { label: "Bevestigd", value: active ? "12" : "—" },
            { label: "Conversie", value: active ? "8,2%" : "—" },
          ].map((s) => (
            <div key={s.label} className="rounded-[16px] bg-[#FAFAFA] p-4 text-center">
              <p className="text-[24px] font-semibold">{s.value}</p>
              <p className="text-[12px] text-[#6B7280]">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-[16px] border border-black/[0.08]">
          <div className="grid grid-cols-4 gap-4 border-b border-black/[0.06] bg-[#FAFAFA] px-4 py-3 text-[12px] font-medium uppercase text-[#9CA3AF]">
            <span>Klant</span>
            <span>Dienst</span>
            <span>Datum</span>
            <span>Status</span>
          </div>
          {(active ? MOCK_BOOKINGS : []).map((b) => (
            <div key={b.id} className="grid grid-cols-4 gap-4 border-b border-black/[0.04] px-4 py-3 text-[14px] last:border-0">
              <span className="font-medium">{b.name}</span>
              <span className="text-[#6B7280]">{b.service}</span>
              <span className="text-[#6B7280]">{b.date}</span>
              <PortalBadge variant="green">{b.status}</PortalBadge>
            </div>
          ))}
          {!active && (
            <div className="flex flex-col items-center py-10 text-center">
              <Calendar className="mb-2 h-8 w-8 text-[#7547F8]" />
              <p className="font-medium">Nog geen boekingen</p>
              <p className="text-[13px] text-[#6B7280]">Gegevens verschijnen zodra je module actief is.</p>
            </div>
          )}
        </div>
      </PortalLockedSection>

      {active && (
        <PortalCard className="mt-6">
          <h3 className="mb-3 font-semibold">Instellingen</h3>
          <ul className="space-y-2 text-[14px] text-[#6B7280]">
            <li>Tool: Calendly / Google Calendar</li>
            <li>Herinneringen: Aan</li>
            <li>Bevestigingsmail: Aan</li>
          </ul>
        </PortalCard>
      )}
    </div>
  );
}
