import type { ClientAccount, OnboardingData, OnboardingStepId } from "./types";
import { generateClientNumberFromId } from "./types";
import { BUILD_PROGRESS_STEPS } from "./constants";
import {
  isIntakeStepComplete,
  getIntakeStepStatus,
  type IntakeStepKey,
  type IntakeStepStatus,
  getIntakeProgressPercent,
  getIntakeProgressLabel,
  getIntakeProgress,
  allIntakeStepsComplete,
} from "./step-validation";
import { capProjectProgress, getEffectiveProjectProgress, canReachLive } from "./project-progress";
import { hasOpenIntegrationRequests } from "./applications";

export { allIntakeStepsComplete };
export type { IntakeStepStatus };

export { getIntakeProgressPercent, getIntakeProgressLabel, getIntakeProgress };

export const PAYMENT_TERM_DAYS = 14;

export function getClientPaymentTermDays(client: ClientAccount): number {
  return client.paymentTermDays ?? PAYMENT_TERM_DAYS;
}

export const PORTAL_TASKS = [
  {
    id: "company",
    title: "Bedrijfsgegevens invoeren",
    stepLabel: "Stap 1 van 7",
    href: "/portal/stap/bedrijfsgegevens",
    key: "company" as const,
  },
  {
    id: "media",
    title: "Media en huisstijl toevoegen",
    stepLabel: "Stap 2 van 7",
    href: "/portal/stap/media",
    key: "media" as const,
  },
  {
    id: "wishes",
    title: "Websitewensen vastleggen",
    stepLabel: "Stap 3 van 7",
    href: "/portal/stap/wensen",
    key: "wishes" as const,
  },
  {
    id: "integrations",
    title: "Koppelingen kiezen",
    stepLabel: "Stap 4 van 7",
    href: "/portal/stap/koppelingen",
    key: "integrations" as const,
  },
  {
    id: "package",
    title: "Pakket kiezen",
    stepLabel: "Stap 5 van 7",
    href: "/portal/stap/pakket",
    key: "package" as const,
  },
  {
    id: "billing",
    title: "Facturatie & voorwaarden",
    stepLabel: "Stap 6 van 7",
    href: "/portal/stap/facturatie",
    key: "billing" as const,
  },
  {
    id: "payment",
    title: "Betalen & intake versturen",
    stepLabel: "Stap 7 van 7",
    href: "/portal/stap/betalen",
    key: "payment" as const,
  },
];

export function getClientReferenceNumber(client: ClientAccount): string {
  return client.clientNumber ?? generateClientNumberFromId(client.id);
}

export function hasInitialPaymentPaid(client: ClientAccount): boolean {
  return client.payments.some((p) => p.status === "paid");
}

export function isIntakeSubmitted(client: ClientAccount): boolean {
  return Boolean(client.onboarding.submittedAt);
}

/** Stap 7 is afgerond na betaling (of na intake bij maatwerk). */
export function isPaymentIntakeComplete(client: ClientAccount): boolean {
  if (isMaatwerkPackage(client)) {
    return client.onboarding.completed === true;
  }
  return hasInitialPaymentPaid(client);
}

export function applyClientPaymentReceived(client: ClientAccount): ClientAccount {
  if (isMaatwerkPackage(client) || client.onboarding.completed) return client;

  const onboarding: OnboardingData = {
    ...client.onboarding,
    completed: true,
    submittedAt: client.onboarding.submittedAt ?? new Date().toISOString(),
    completedSteps: [
      ...new Set([...client.onboarding.completedSteps, "payment" as OnboardingStepId]),
    ],
  };
  const percent = Math.max(client.progress.percent, 35);

  return {
    ...client,
    onboarding,
    progress: {
      ...client.progress,
      percent,
      phase: "Intake ontvangen",
      steps: getBuildSteps(onboarding, percent),
      lastUpdate: new Date().toISOString(),
    },
  };
}

export function isPackageChangeLocked(client: ClientAccount): boolean {
  if (client.packageLocked === true) return true;
  return client.onboarding.completed && hasInitialPaymentPaid(client);
}

export function isWebsiteOverviewUnlocked(client: ClientAccount): boolean {
  return isClientLive(client);
}

export function getLastPaymentDate(client: ClientAccount): string | null {
  const paid = client.payments
    .filter((p) => p.status === "paid" && p.paidAt)
    .sort((a, b) => new Date(b.paidAt!).getTime() - new Date(a.paidAt!).getTime());
  return paid[0]?.paidAt ?? null;
}

export function hasPendingPackage(client: ClientAccount): boolean {
  return client.package.pendingSelection === true || !client.package.planId || client.package.planId === "none";
}

export function formatMonthlyPriceDisplay(price: string | undefined | null): string {
  if (!price?.trim() || price === "—") return price ?? "—";
  if (/p\.?\s*m\.?/i.test(price)) return price;
  return `${price.trim()} p.m.`;
}

export function isMaatwerkPackage(client: ClientAccount): boolean {
  return client.package.planId === "maatwerk";
}

export function isPackageIntakeComplete(client: ClientAccount): boolean {
  if (hasPendingPackage(client) || client.package.planId === "none") return false;
  if (isMaatwerkPackage(client)) {
    return client.package.maatwerkPending !== true;
  }
  return Boolean(client.package.maintenanceId);
}

export function getPortalTasks(client: ClientAccount) {
  return PORTAL_TASKS.map((task) => {
    const key = task.key as IntakeStepKey;
    const status = getIntakeStepStatus(client, key);
    return {
      ...task,
      status,
      done: status === "complete",
    };
  });
}

export function getPortalTaskProgress(client: ClientAccount) {
  return getIntakeProgressLabel(client);
}

export const DASHBOARD_JOURNEY_STEPS = [
  { id: 1, label: "Bedrijfsgegevens", href: "/portal/stap/bedrijfsgegevens", key: "company" as const },
  { id: 2, label: "Media & huisstijl", href: "/portal/stap/media", key: "media" as const },
  { id: 3, label: "Websitewensen", href: "/portal/stap/wensen", key: "wishes" as const },
  { id: 4, label: "Koppelingen", href: "/portal/stap/koppelingen", key: "integrations" as const },
  { id: 5, label: "Pakket", href: "/portal/stap/pakket", key: "package" as const },
  { id: 6, label: "Facturatie & voorwaarden", href: "/portal/stap/facturatie", key: "billing" as const },
  { id: 7, label: "Betalen & versturen", href: "/portal/stap/betalen", key: "payment" as const },
];

export { hasOpenIntegrationRequests };
export { getEffectiveProjectProgress, canReachLive };

export function isClientLive(client: ClientAccount): boolean {
  return client.phase === "live" && canReachLive(client);
}

export function computeProgressPercent(onboarding: OnboardingData): number {
  if (onboarding.completed) return 35;
  const weights = [
    onboarding.company.name && onboarding.company.industry,
    onboarding.goals.length > 0 || onboarding.desiredPages.length > 0,
    onboarding.media.length > 0 || onboarding.colors.primary,
    onboarding.integrations.length > 0,
  ];
  const done = weights.filter(Boolean).length;
  return Math.min(30, 10 + done * 5);
}

export function getOpenActions(client: ClientAccount): { label: string; href: string; done: boolean }[] {
  const o = client.onboarding;
  return [
    {
      label: "Intakeformulier afronden",
      href: "/portal/website",
      done: o.completed,
    },
    {
      label: "Logo uploaden",
      href: "/portal/website?step=media",
      done: o.media.some((m) => m.name.toLowerCase().includes("logo")),
    },
    {
      label: "Kleuren kiezen",
      href: "/portal/website?step=media",
      done: Boolean(o.colors.primary),
    },
    {
      label: "Voorbeeldwebsites toevoegen",
      href: "/portal/website?step=media",
      done: o.referenceWebsites.some(Boolean),
    },
    {
      label: "Koppelingen bevestigen",
      href: "/portal/website?step=integrations",
      done: o.integrations.length > 0,
    },
  ];
}

export function getIntakeJourneyChecklist(client: ClientAccount) {
  return DASHBOARD_JOURNEY_STEPS.map((step) => {
    const status = getIntakeStepStatus(client, step.key as IntakeStepKey);
    return {
      label: step.label,
      done: status === "complete",
      status,
    };
  });
}

export function getBuildSteps(onboarding: OnboardingData, percent: number) {
  const labels = [...BUILD_PROGRESS_STEPS];
  const doneCount = onboarding.completed
    ? Math.max(2, Math.floor((percent / 100) * labels.length))
    : onboarding.company.name
      ? 1
      : 0;

  return labels.map((label, i) => ({
    label,
    done: i < doneCount,
  }));
}

export function getProgressPhaseLabel(percent: number, onboarding?: OnboardingData): string {
  if (percent >= 100) return "Live";
  if (percent >= 72) return "Feedbackronde";
  if (percent >= 50) return "Website in bouw";
  if (percent >= 35 && onboarding?.completed) return "Intake ontvangen";
  if (percent >= 25) return "Design voorbereiding";
  return "Onboarding";
}

export function applyProjectProgress(client: ClientAccount, percent: number): ClientAccount {
  const capped = capProjectProgress(client, percent);
  return {
    ...capped,
    progressSettings: {
      ...client.progressSettings,
      manualOverrideEnabled: true,
      manualPercent: percent,
      manualPhase: capped.progress.phase,
    },
    progress: {
      ...capped.progress,
      steps: getBuildSteps(capped.onboarding, capped.progress.percent),
    },
  };
}

export function getClientPreviewUrl(client: ClientAccount): string {
  const preview = client.previewSettings;
  if (preview?.enabled && preview.url) {
    return preview.url.replace(/^https?:\/\//, "");
  }
  const raw =
    client.progress.previewUrl ??
    client.websiteUrl ??
    client.onboarding.company.desiredDomain ??
    "preview.jouwbedrijf.works";
  return raw.replace(/^https?:\/\//, "");
}

export function getClientPreviewSettings(client: ClientAccount) {
  return client.previewSettings;
}

export function getIntegrationStatus(
  client: ClientAccount,
  integrationName: string,
): "not_linked" | "requested" | "in_progress" | "active" {
  const stored = client.integrationStatuses?.[integrationName];
  if (stored) return stored;
  if (client.onboarding.integrations?.includes(integrationName)) {
    return client.onboarding.completed ? "in_progress" : "requested";
  }
  return "not_linked";
}

export function getJourneyStepStatus(client: ClientAccount) {
  const statuses = DASHBOARD_JOURNEY_STEPS.map((step) => ({
    ...step,
    done: isIntakeStepComplete(client, step.key as IntakeStepKey),
    active: false,
  }));
  const firstIncomplete = statuses.find((s) => !s.done);
  if (firstIncomplete) firstIncomplete.active = true;
  return statuses;
}

export function getWebsiteBuildChecklist(onboarding: OnboardingData, percent: number) {
  if (onboarding.completed && percent >= 50) {
    return [
      { label: "Design goedgekeurd", done: percent >= 50 },
      { label: "Pagina's worden gebouwd", done: percent >= 72 },
      { label: "Koppelingen instellen", done: percent >= 85 },
    ];
  }
  return getBuildSteps(onboarding, percent).slice(0, 3);
}

export function addPaymentTermDays(from: Date, days = PAYMENT_TERM_DAYS): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
}

export function getNextMaintenanceInvoice(client: ClientAccount) {
  const paid = client.payments.filter((p) => p.status === "paid" && p.description.toLowerCase().includes("onderhoud"));
  const lastPaid = paid.sort((a, b) => new Date(b.paidAt ?? 0).getTime() - new Date(a.paidAt ?? 0).getTime())[0];
  const base = lastPaid?.paidAt ? new Date(lastPaid.paidAt) : new Date(client.createdAt);
  const next = new Date(base);
  next.setMonth(next.getMonth() + 1);
  return {
    dueDate: next,
    amount: client.package.monthlyPrice,
    description: `${client.package.maintenanceName ?? "Onderhoud"} — maandelijks`,
  };
}

export function allInvoicesPaid(client: ClientAccount): boolean {
  return client.payments.length > 0 && client.payments.every((p) => p.status === "paid");
}
