import { Link, useParams } from "react-router-dom";
import { Check } from "lucide-react";
import { getIntegrationBySlug, getCategoryLabel, getIntegrationsByCategory } from "@/data/integrations";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { getIntegrationStatus } from "@/lib/portal/helpers";
import {
  ReferencePageTitle,
  ReferenceCard,
} from "@/components/portal/reference/ReferenceUI";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { IntegrationIconTile } from "@/components/integrations/IntegrationIcon";
import { IntegrationCategoryPreview } from "@/components/portal/IntegrationCategoryPreview";
import { PortalIntegrationAppCard } from "@/components/portal/PortalIntegrationAppCard";

const CATEGORY_PRICE: Record<string, string> = {
  agenda: "BOEKINGEN · VANAF €295",
  analytics: "ANALYTICS · GRATIS KOPPELING",
  betalingen: "BETALINGEN · GRATIS KOPPELING",
  formulieren: "FORMULIEREN · INBEGREPEN",
  communicatie: "COMMUNICATIE · GRATIS KOPPELING",
  marketing: "MARKETING · OP AANVRAAG",
  automatisering: "AUTOMATISERING · VANAF €149",
};

export default function PortalKoppelingDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { client } = usePortalAuth();
  const integration = slug ? getIntegrationBySlug(slug) : undefined;

  if (!integration || !client) {
    return (
      <ReferenceCard>
        <p>Koppeling niet gevonden.</p>
        <Link to="/portal/koppelingen" className="text-[#7547F8] hover:underline">
          ← Terug naar koppelingen
        </Link>
      </ReferenceCard>
    );
  }

  const similar = getIntegrationsByCategory(integration.category)
    .filter((i) => i.slug !== integration.slug)
    .slice(0, 3);

  return (
    <div>
      <ReferencePageTitle
        title={integration.name}
        back={{ label: "Koppelingen", href: "/portal/koppelingen" }}
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <ReferenceCard className="overflow-hidden !p-0">
          <IntegrationCategoryPreview integration={integration} className="rounded-[20px]" />
        </ReferenceCard>

        <ReferenceCard>
          <div className="mb-4 flex items-start gap-3">
            <IntegrationIconTile integration={integration} large />
            <div>
              <h2 className="text-[18px] font-semibold">{integration.name}</h2>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                {CATEGORY_PRICE[integration.category] ?? getCategoryLabel(integration.category).toUpperCase()}
              </p>
            </div>
          </div>
          <p className="text-[14px] leading-relaxed text-[#6B7280]">{integration.overview}</p>
          <ul className="mt-4 space-y-2">
            <li className="flex gap-2 text-[14px] text-[#6B7280]">
              <Check className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
              {integration.tagline}
            </li>
            <li className="flex gap-2 text-[14px] text-[#6B7280]">
              <Check className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
              {integration.cardDescription}
            </li>
          </ul>
          <div className="mt-6 space-y-2">
            <Button className="w-full rounded-full bg-[#7547F8] hover:bg-[#6840E0]">Aanvragen</Button>
            <Button asChild variant="outline" className="w-full rounded-full border-[#E2E0DB]">
              <Link to={`${ROUTES.integraties}/${integration.slug}`} target="_blank">
                Meer informatie
              </Link>
            </Button>
          </div>
        </ReferenceCard>
      </div>

      {similar.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-4 text-[18px] font-semibold">Soortgelijke koppelingen</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {similar.map((item) => (
              <PortalIntegrationAppCard
                key={item.slug}
                integration={item}
                compact
                status={getIntegrationStatus(client, item.name)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
