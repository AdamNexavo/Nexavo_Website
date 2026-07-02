import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Integration } from "@/data/integrations";
import { IntegrationIconTile } from "./IntegrationIcon";
import { integrationCardClass } from "@/components/marketing/integration-card";

type IntegrationAppCardProps = {
  integration: Integration;
  compact?: boolean;
};

export const IntegrationAppCard = ({
  integration,
  compact = false,
}: IntegrationAppCardProps) => {
  return (
    <Link
      to={`/integraties/${integration.slug}`}
      className={cn(integrationCardClass, "items-start text-left", compact ? "p-4" : "p-5")}
    >
      <div className="flex items-start gap-3 mb-3">
        <IntegrationIconTile integration={integration} large={!compact} />
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {integration.name}
            </h3>
            {integration.verified && (
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Door {integration.builtBy}
          </p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
        {integration.cardDescription}
      </p>
    </Link>
  );
};
