import type { ClientAccount } from "./types";
import { getIntakeProgressPercent } from "./step-validation";
import { getClientTechnicalSetup, isTechnicalSetupComplete } from "./websites";
import { hasOpenIntegrationRequests } from "./applications";

export type ProgressBlocker = {
  key: string;
  label: string;
  maxPercent: number;
};

export function getOpenPayments(client: ClientAccount) {
  return client.payments.filter((p) => p.status === "open" || p.status === "overdue" || p.status === "processing");
}

export function getProgressBlockers(client: ClientAccount): ProgressBlocker[] {
  const blockers: ProgressBlocker[] = [];
  const intakePct = getIntakeProgressPercent(client);

  if (!client.onboarding.completed) {
    if (intakePct <= 0) blockers.push({ key: "intake_not_started", label: "Intake niet gestart", maxPercent: 10 });
    else if (intakePct < 100)
      blockers.push({ key: "intake_partial", label: "Intake deels ingevuld", maxPercent: 40 });
    else blockers.push({ key: "intake_not_submitted", label: "Intake nog niet verstuurd", maxPercent: 45 });
  }

  if (hasOpenIntegrationRequests(client)) {
    blockers.push({ key: "open_integrations", label: "Koppeling-aanvragen open", maxPercent: 89 });
  }

  const preview = client.previewSettings;
  if (preview?.enabled && preview.status === "feedback_requested") {
    blockers.push({ key: "preview_feedback", label: "Preview wacht op feedback", maxPercent: 79 });
  }

  const setup = getClientTechnicalSetup(client);
  const checklist = setup.checklist ?? {};
  if (!checklist.technicallyComplete && !setup.completed) {
    blockers.push({ key: "tech_incomplete", label: "Technische setup niet compleet", maxPercent: 99 });
  }

  if (setup.pixelInstalled === false && checklist.pixelAdded === false) {
    const wantsPixel = Boolean(setup.pixelType || setup.pixelId || setup.pixelNotes);
    if (wantsPixel) {
      blockers.push({ key: "pixel_missing", label: "Pixel nog niet toegevoegd", maxPercent: 94 });
    }
  }

  if (getOpenPayments(client).length > 0) {
    blockers.push({ key: "open_payment", label: "Openstaande betaling", maxPercent: 96 });
  }

  return blockers;
}

export function getMaxAllowedProgress(client: ClientAccount): number {
  const blockers = getProgressBlockers(client);
  if (blockers.length === 0) return 100;
  return Math.min(...blockers.map((b) => b.maxPercent));
}

export function canReachLive(client: ClientAccount): boolean {
  const setup = getClientTechnicalSetup(client);
  const checklist = setup.checklist ?? {};
  if (!client.onboarding.completed) return false;
  if (hasOpenIntegrationRequests(client)) return false;
  if (getOpenPayments(client).length > 0) return false;
  if (!checklist.technicallyComplete && !setup.completed) return false;
  if (client.previewSettings?.enabled && client.previewSettings.status === "feedback_requested") return false;
  return true;
}

export function getSuggestedProgressPercent(client: ClientAccount): number {
  if (client.phase === "live") return 100;
  if (!client.onboarding.company.name) return 5;

  const intakePct = getIntakeProgressPercent(client);
  if (!client.onboarding.completed) {
    if (intakePct <= 0) return 5;
    if (intakePct < 50) return Math.round(10 + intakePct * 0.3);
    return Math.round(25 + intakePct * 0.15);
  }

  let pct = 50;
  if (client.progress.previewUrl || client.previewSettings?.enabled) pct = 72;
  if (client.previewSettings?.status === "ready" || client.previewSettings?.status === "approved") pct = 78;
  if (client.previewSettings?.status === "feedback_requested") pct = 75;

  const setup = getClientTechnicalSetup(client);
  if (setup.checklist?.technicallyComplete || setup.completed) pct = Math.max(pct, 92);

  return Math.min(pct, getMaxAllowedProgress(client));
}

export function getManualProjectPercent(client: ClientAccount): number {
  if (client.progressSettings?.manualOverrideEnabled && client.progressSettings.manualPercent != null) {
    return client.progressSettings.manualPercent;
  }
  return client.progress.percent;
}

export function getEffectiveProjectProgress(client: ClientAccount): {
  percent: number;
  phase: string;
  capped: boolean;
  blockers: ProgressBlocker[];
  manualPercent: number;
  effectivePercent: number;
} {
  const blockers = getProgressBlockers(client);
  const maxAllowed = getMaxAllowedProgress(client);
  const manualPercent = getManualProjectPercent(client);
  const effectivePercent = Math.min(manualPercent, maxAllowed);

  let phase =
    client.progressSettings?.manualOverrideEnabled && client.progressSettings.manualPhase
      ? client.progressSettings.manualPhase
      : client.progress.phase;

  if (effectivePercent >= 100 && canReachLive(client)) phase = "Live";
  else if (effectivePercent >= 90) phase = "Technische afronding";
  else if (effectivePercent >= 72) phase = "Feedbackronde";
  else if (effectivePercent >= 50) phase = "Website in opbouw";
  else if (client.onboarding.completed) phase = "Intake ontvangen";
  else if (effectivePercent >= 25) phase = "Design voorbereiding";
  else phase = "Onboarding";

  return {
    percent: effectivePercent,
    phase,
    capped: manualPercent > maxAllowed,
    blockers,
    manualPercent,
    effectivePercent,
  };
}

export function capProjectProgress(client: ClientAccount, requestedPercent: number): ClientAccount {
  const maxAllowed = requestedPercent >= 100 ? (canReachLive(client) ? 100 : getMaxAllowedProgress(client)) : getMaxAllowedProgress(client);
  const percent = Math.min(requestedPercent, maxAllowed);
  const live = percent >= 100 && canReachLive(client);
  const effective = getEffectiveProjectProgress({ ...client, progress: { ...client.progress, percent } });

  return {
    ...client,
    phase: live ? "live" : "build",
    progress: {
      ...client.progress,
      percent,
      phase: effective.phase,
      lastUpdate: new Date().toISOString(),
      ...(live && client.websiteUrl ? { liveUrl: client.websiteUrl } : {}),
    },
  };
}
