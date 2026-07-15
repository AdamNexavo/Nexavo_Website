import type { ClientAccount } from "./types";
import { hasPendingPackage } from "./helpers";

function hasPackageSelected(client: ClientAccount): boolean {
  return !hasPendingPackage(client);
}

function hasIntegrationMatch(client: ClientAccount, keywords: string[]): boolean {
  return client.onboarding.integrations.some((name) =>
    keywords.some((k) => name.toLowerCase().includes(k)),
  );
}

export function clientHasBookingFeature(client: ClientAccount): boolean {
  if (!hasPackageSelected(client)) return false;
  if (client.package.selectedAddons?.includes("booking")) return true;
  if (hasIntegrationMatch(client, ["boek", "calend", "agenda"])) return true;
  return ["groei", "pro", "maatwerk"].includes(client.package.planId);
}

export function clientHasReviewFeature(client: ClientAccount): boolean {
  if (!hasPackageSelected(client)) return false;
  if (client.package.selectedAddons?.includes("reviews")) return true;
  if (hasIntegrationMatch(client, ["review", "google reviews"])) return true;
  return ["groei", "pro", "maatwerk"].includes(client.package.planId);
}

export function getFeatureUnavailableMessage(feature: "booking" | "reviews"): string {
  if (feature === "booking") {
    return "Boekingskalender zit niet in je huidige pakket. Upgrade via pakket kiezen of voeg de boekingskalender add-on toe.";
  }
  return "Review management zit niet in je huidige pakket. Upgrade via pakket kiezen of voeg reviewmanagement toe.";
}

export function getFeatureNoPackageMessage(): string {
  return "Kies eerst een pakket in stap 5 om te zien welke modules bij jou horen.";
}

/** Add-ons die al in het gekozen pakket zitten — niet opnieuw afrekenen. */
export function planIncludesAddon(planId: string, addonId: string): boolean {
  if (!planId || planId === "none" || planId === "maatwerk") return false;
  if (addonId === "booking") return planId === "groei" || planId === "pro";
  if (addonId === "reviews") return planId === "groei" || planId === "pro";
  if (addonId === "chatbot") return planId === "pro";
  return false;
}
