import type { ClientAccount } from "./types";
import { createDefaultOnboarding, createDefaultProgress, generateClientNumberFromId } from "./types";
import { getClientByEmail, upsertClient } from "./storage";
import { isSupabasePortalEnabled } from "./supabase-client";

/** Demo-account voor lokale development (localStorage). Uitgeschakeld wanneer Supabase actief is. */
export const DEMO_CLIENT_EMAIL = "adam@nexavo.works";
export const DEMO_ADMIN_EMAIL = "admin@nexavo.works";

/** SHA-256 van `F@tbinan12!-NEXAVO` + nexavo-portal-v1 */
export const DEMO_PASSWORD_HASH =
  "6fab38489fda6eb6e65a4934628239345ef91b82d3a363f56d351db54d118b75";

function buildDemoClient(): ClientAccount {
  const clientId = "00000000-0000-4000-8000-000000000001";
  return {
    id: clientId,
    clientNumber: generateClientNumberFromId(clientId),
    email: DEMO_CLIENT_EMAIL,
    passwordHash: DEMO_PASSWORD_HASH,
    user: {
      firstName: "Adam",
      lastName: "Nexavo",
      email: DEMO_CLIENT_EMAIL,
      avatarInitials: "AN",
    },
    companyName: "Nexavo",
    createdAt: new Date().toISOString(),
    phase: "build",
    onboarding: createDefaultOnboarding({
      currentStep: "package",
      completedSteps: ["company", "media", "wishes", "integrations"],
      company: {
        name: "Nexavo",
        industry: "Webdesign & automatisering",
        location: "Nederland",
        contactPerson: "Adam",
        targetAudience: "MKB en dienstverleners",
        email: DEMO_CLIENT_EMAIL,
        website: "https://nexavo.works",
        description: "Professionele websites en automatisering voor ondernemers.",
      },
      goals: ["Professionele uitstraling", "Meer aanvragen via de website", "Beter vindbaar worden"],
      desiredPages: ["Home", "Diensten", "Over ons", "Contact", "Reviews"],
      toneOfVoice: "Professioneel",
      stylePreference: "Modern & clean",
      integrations: ["google-analytics"],
      mediaDelivered: true,
      largeFilesStatus: "not_applicable",
      colors: {
        primary: "#7547F8",
        secondary: "#0B0B0D",
        accent: "#F97316",
        palette: ["#7547F8", "#0B0B0D", "#F97316", "#F5F4F2", "#FFFFFF"],
      },
      notes: "Demo-intake voor lokale ontwikkeling.",
    }),
    package: {
      planId: "start",
      planName: "Start",
      planPrice: "€1.495",
      maintenanceId: "plus",
      maintenanceName: "Plus Beheer",
      monthlyPrice: "€99",
      maintenanceIncluded: ["Wekelijkse verwerking", "10 kleine wijzigingen", "120 minuten p/m"],
      pendingSelection: false,
      selectedAddons: [],
    },
    progress: {
      ...createDefaultProgress(),
      percent: 25,
      phase: "Intake bezig",
      lastUpdate: new Date().toISOString(),
    },
    payments: [],
    tickets: [],
    active: true,
  };
}

/**
 * Zorgt dat demo-accounts bestaan in localStorage.
 * Nodig omdat elke browser/live-preview sessie met lege storage start.
 */
export function ensureDemoAccounts(): void {
  if (typeof window === "undefined") return;
  if (isSupabasePortalEnabled()) return;

  const existing = getClientByEmail(DEMO_CLIENT_EMAIL);
  if (existing) {
    if (existing.passwordHash !== DEMO_PASSWORD_HASH || !existing.active) {
      upsertClient({
        ...existing,
        passwordHash: DEMO_PASSWORD_HASH,
        active: true,
      });
    }
    return;
  }

  upsertClient(buildDemoClient());
}
