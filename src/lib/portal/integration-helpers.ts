import {
  integrations,
  type Integration,
  type IntegrationCategoryId,
} from "@/data/integrations";
import type { IntegrationStatus } from "./constants";
import type { ClientAccount } from "./types";
import { getIntegrationStatus, hasPendingPackage } from "./helpers";
import { allIntakeStepsComplete } from "./step-validation";

const STATUS_RANK: Record<IntegrationStatus, number> = {
  active: 0,
  in_progress: 1,
  requested: 2,
  not_linked: 3,
};

export function getClientActiveIntegrations(client: ClientAccount): Integration[] {
  return integrations.filter((i) => getIntegrationStatus(client, i.name) === "active");
}

export function getClientPendingIntegrations(client: ClientAccount): Integration[] {
  return integrations.filter((i) => {
    const status = getIntegrationStatus(client, i.name);
    return status === "requested" || status === "in_progress";
  });
}

function moduleIntegrationNames(module: "booking" | "reviews"): string[] {
  if (module === "booking") {
    return integrations.filter((i) => i.category === "agenda").map((i) => i.name);
  }
  return integrations
    .filter(
      (i) =>
        i.slug.includes("review") ||
        i.name.toLowerCase().includes("review"),
    )
    .map((i) => i.name);
}

export function getModuleIntegrationStatus(
  client: ClientAccount,
  module: "booking" | "reviews",
): IntegrationStatus {
  const aliases =
    module === "booking" ? ["Boekingskalender"] : ["Review management", "Reviewmanagement"];
  const names = [...new Set([...aliases, ...moduleIntegrationNames(module)])];
  let best: IntegrationStatus = "not_linked";
  for (const name of names) {
    const status = getIntegrationStatus(client, name);
    if (STATUS_RANK[status] < STATUS_RANK[best]) best = status;
  }
  return best;
}

export type FeatureModuleBlockReason =
  | "no_package"
  | "not_in_package"
  | "intake_incomplete"
  | "pending_admin"
  | "awaiting_link";

export function getFeatureModuleBlockReason(
  client: ClientAccount,
  module: "booking" | "reviews",
  inPackage: boolean,
): FeatureModuleBlockReason | null {
  if (hasPendingPackage(client)) return "no_package";
  if (!inPackage) return "not_in_package";
  if (!client.onboarding.completed || !allIntakeStepsComplete(client)) return "intake_incomplete";
  const status = getModuleIntegrationStatus(client, module);
  if (status === "active") return null;
  if (status === "requested" || status === "in_progress") return "pending_admin";
  return "awaiting_link";
}

export function getPreviewCategory(integration: Integration): IntegrationCategoryId {
  return integration.category;
}
