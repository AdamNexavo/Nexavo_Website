import { Star } from "lucide-react";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { clientHasReviewFeature } from "@/lib/portal/package-features";
import {
  getFeatureModuleBlockReason,
  getModuleIntegrationStatus,
} from "@/lib/portal/integration-helpers";
import { PortalCard, PortalPageHeader, PortalBadge, PortalLockedSection } from "@/components/portal/PortalUI";
import { PortalFeatureStatusBanner } from "@/components/portal/PortalFeatureStatusBanner";

const MOCK_REVIEWS = [
  { id: "1", name: "Jan de Vries", rating: 5, date: "12 jul 2026", status: "Gepubliceerd" },
  { id: "2", name: "Lisa Bakker", rating: 4, date: "10 jul 2026", status: "In afwachting" },
];

export default function PortalReviewsPage() {
  const { client } = usePortalAuth();
  if (!client) return null;

  const inPackage = clientHasReviewFeature(client);
  const blockReason = getFeatureModuleBlockReason(client, "reviews", inPackage);
  const integrationStatus = getModuleIntegrationStatus(client, "reviews");
  const active = !blockReason && integrationStatus === "active";

  return (
    <div>
      <PortalPageHeader
        title="Review management"
        subtitle="Automatisch reviews verzamelen na klantcontact — gekoppeld aan je website."
      />

      {blockReason && (
        <PortalFeatureStatusBanner reason={blockReason} moduleLabel="Review management" className="mb-6" />
      )}

      <PortalLockedSection
        title="Reviews & statistieken"
        subtitle="Overzicht van verzamelde en gepubliceerde reviews"
        locked={!active}
        lockMessage={
          blockReason === "not_in_package"
            ? "Upgrade je pakket voor review management"
            : blockReason === "intake_incomplete"
              ? "Beschikbaar na voltooide intake"
              : "Wacht op activatie via Koppelingen"
        }
      >
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Gemiddelde score", value: active ? "4,8" : "—" },
            { label: "Deze maand", value: active ? "23" : "—" },
            { label: "Gepubliceerd", value: active ? "19" : "—" },
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
            <span>Score</span>
            <span>Datum</span>
            <span>Status</span>
          </div>
          {(active ? MOCK_REVIEWS : []).map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-4 gap-4 border-b border-black/[0.04] px-4 py-3 text-[14px] last:border-0"
            >
              <span className="font-medium">{r.name}</span>
              <span className="text-[#6B7280]">{r.rating}/5</span>
              <span className="text-[#6B7280]">{r.date}</span>
              <PortalBadge variant="green">{r.status}</PortalBadge>
            </div>
          ))}
          {!active && (
            <div className="flex flex-col items-center py-10 text-center">
              <Star className="mb-2 h-8 w-8 text-[#7547F8]" />
              <p className="font-medium">Nog geen reviews</p>
              <p className="text-[13px] text-[#6B7280]">Gegevens verschijnen zodra je module actief is.</p>
            </div>
          )}
        </div>
      </PortalLockedSection>

      {active && (
        <PortalCard className="mt-6">
          <h3 className="mb-3 font-semibold">Instellingen</h3>
          <ul className="space-y-2 text-[14px] text-[#6B7280]">
            <li>Moment: Na afspraak / na dienst</li>
            <li>Kanaal: E-mail</li>
            <li>Negatieve feedback intern: Aan</li>
            <li>Reviews op website: Aan</li>
          </ul>
        </PortalCard>
      )}
    </div>
  );
}
