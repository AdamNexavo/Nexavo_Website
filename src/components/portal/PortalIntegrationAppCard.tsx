import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Integration } from "@/data/integrations";
import { IntegrationIconTile } from "@/components/integrations/IntegrationIcon";
import { integrationCardClass } from "@/components/marketing/integration-card";
import { ReferenceBadge } from "@/components/portal/reference/ReferenceUI";
import { INTEGRATION_STATUS_LABELS } from "@/lib/portal/constants";
import type { IntegrationStatus } from "@/lib/portal/constants";
import { Button } from "@/components/ui/button";

type PortalIntegrationAppCardProps = {
  integration: Integration;
  compact?: boolean;
  status: IntegrationStatus;
  onConnect?: () => void;
  /** white = witte kaart binnen grijze sectie */
  surface?: "default" | "white";
  requestedAt?: string;
};

export function PortalIntegrationAppCard({
  integration,
  compact = false,
  status,
  onConnect,
  surface = "default",
  requestedAt,
}: PortalIntegrationAppCardProps) {
  const active = status === "active";

  return (
    <div
      className={cn(
        surface === "white"
          ? "group relative flex flex-col items-start rounded-[14px] border border-[#E2E0DB] bg-white p-4 text-left shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-colors hover:border-[#D8D6D1]"
          : integrationCardClass,
        "relative items-start text-left",
        surface === "default" && (compact ? "p-4" : "p-5"),
      )}
    >
      <Link to={`/portal/koppelingen/${integration.slug}`} className="flex flex-1 flex-col">
        <div className="mb-3 flex items-start gap-3">
          <IntegrationIconTile integration={integration} large={!compact} />
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                {integration.name}
              </h3>
              {integration.verified && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
              )}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">Door {integration.builtBy}</p>
          </div>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {integration.cardDescription}
        </p>
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {active ? (
          <ReferenceBadge variant="green">Actief</ReferenceBadge>
        ) : status === "requested" || status === "in_progress" ? (
          <>
            <ReferenceBadge variant="purple">{INTEGRATION_STATUS_LABELS[status]}</ReferenceBadge>
            {requestedAt && (
              <span className="text-[11px] text-[#9CA3AF]">
                Aangevraagd {new Date(requestedAt).toLocaleDateString("nl-NL")}
              </span>
            )}
          </>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="rounded-full border-[#E2E0DB] text-[13px]"
            onClick={onConnect}
          >
            Koppelen
          </Button>
        )}
      </div>
    </div>
  );
}
