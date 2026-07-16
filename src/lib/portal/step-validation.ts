import type { ClientAccount, OnboardingData } from "./types";
import { hasPendingPackage, isPackageIntakeComplete, isPaymentIntakeComplete, isIntakeSubmitted } from "./helpers";

export type IntakeStepKey =
  | "company"
  | "media"
  | "wishes"
  | "integrations"
  | "package"
  | "billing"
  | "payment";

export function getLargeFilesStatus(o: OnboardingData): "sent" | "not_applicable" | undefined {
  if (o.largeFilesStatus) return o.largeFilesStatus;
  if (o.largeFilesSubmitted === true) return "sent";
  return undefined;
}

export function validateIntakeStep(
  client: ClientAccount,
  step: IntakeStepKey,
): { valid: boolean; errors: string[] } {
  const o = client.onboarding;
  const b = client.billingInfo ?? {};
  const errors: string[] = [];

  if (step === "company") {
    if (!o.company.name?.trim()) errors.push("Vul je bedrijfsnaam in.");
    if (!o.company.industry?.trim()) errors.push("Vul je branche in.");
    if (!o.company.location?.trim()) errors.push("Vul je locatie in.");
    if (!o.company.contactPerson?.trim()) errors.push("Vul een contactpersoon in.");
    if (!o.company.targetAudience?.trim()) errors.push("Beschrijf je doelgroep.");
    if (!o.company.aboutCompany?.trim()) errors.push("Vertel meer over je bedrijf.");
    if (!o.company.desiredDomain?.trim()) errors.push("Vul je gewenste domeinnaam in.");
    if (o.company.existingWebsite?.trim() && !o.company.existingWebsite.trim().startsWith("http")) {
      errors.push("Voer een volledige URL in voor je huidige website (begin met https://).");
    }
  }

  if (step === "media") {
    const lf = getLargeFilesStatus(o);
    if (!lf) errors.push("Geef aan of je grote bestanden per e-mail hebt verstuurd, of kies 'Niet van toepassing'.");
    if (!o.stylePreference?.trim()) errors.push("Kies een gewenste uitstraling.");
    if (!o.colors.primary || !o.colors.secondary || !o.colors.accent) {
      errors.push("Stel je huisstijlkleuren in.");
    }
    const refs = o.websiteReferences ?? [];
    refs.forEach((ref, i) => {
      if (ref.url?.trim() && !ref.url.trim().startsWith("http")) {
        errors.push(`Referentie ${i + 1}: voer een volledige URL in (begin met https://).`);
      }
    });
  }

  if (step === "wishes") {
    if (o.goals.length === 0) errors.push("Selecteer minimaal één doel voor je website.");
    if (o.desiredPages.length === 0) errors.push("Selecteer minimaal één gewenste sectie.");
    if (!o.toneOfVoice?.trim()) errors.push("Kies een tone of voice.");
  }

  if (step === "integrations") {
    /* Optioneel — altijd geldig */
  }

  if (step === "package") {
    if (hasPendingPackage(client) || client.package.planId === "none") {
      errors.push(
        client.package.planId && client.package.planId !== "none"
          ? "Bevestig je pakketkeuze met 'Keuze bevestigen'."
          : "Kies een websitepakket.",
      );
    } else if (client.package.planId !== "maatwerk" && !client.package.maintenanceId) {
      errors.push("Kies een onderhoudspakket.");
    }
  }

  if (step === "billing") {
    if (!o.termsAccepted) errors.push("Accepteer de algemene voorwaarden.");
    if (!b.companyName?.trim() && !client.companyName) errors.push("Vul je bedrijfsnaam in voor facturatie.");
    if (!b.kvk?.trim()) errors.push("Vul je KVK-nummer in.");
    if (!b.email?.trim() && !client.email) errors.push("Vul een factuur e-mailadres in.");
    if (!b.postcode?.trim()) errors.push("Vul je postcode in.");
    if (!b.houseNumber?.trim()) errors.push("Vul je huisnummer in.");
    if (!b.address?.trim()) errors.push("Vul je straatnaam in.");
    if (!b.city?.trim()) errors.push("Vul je plaats in.");
    if (!b.accountHolderFirstName?.trim() && !client.user.firstName) errors.push("Vul de voornaam van de ten namegestelde in.");
    if (!b.accountHolderLastName?.trim() && !client.user.lastName) errors.push("Vul de achternaam van de ten namegestelde in.");
  }

  if (step === "payment") {
    const billingCheck = validateIntakeStep(client, "billing");
    if (!billingCheck.valid) errors.push(...billingCheck.errors);
    if (client.package.planId === "maatwerk") {
      /* Geen online betaling — contact opnemen */
    }
  }

  return { valid: errors.length === 0, errors };
}

export type IntakeStepStatus = "empty" | "partial" | "complete";

export const INTAKE_PROGRESS_STEPS: IntakeStepKey[] = [
  "company",
  "media",
  "wishes",
  "integrations",
  "package",
  "billing",
  "payment",
];

function hasAnyText(...values: (string | undefined)[]): boolean {
  return values.some((v) => Boolean(v?.trim()));
}

export function getIntakeStepStatus(client: ClientAccount, step: IntakeStepKey): IntakeStepStatus {
  if (isIntakeStepComplete(client, step)) return "complete";

  const o = client.onboarding;
  const b = client.billingInfo ?? {};

  if (step === "company") {
    const fields = [
      o.company.name,
      o.company.industry,
      o.company.location,
      o.company.contactPerson,
      o.company.targetAudience,
      o.company.aboutCompany,
      o.company.desiredDomain,
    ];
    if (fields.every((f) => !f?.trim())) return "empty";
    return "partial";
  }

  if (step === "media") {
    const lf = getLargeFilesStatus(o);
    const hasAny =
      Boolean(lf) ||
      hasAnyText(o.stylePreference) ||
      Boolean(o.colors.primary || o.colors.secondary || o.colors.accent) ||
      o.media.length > 0 ||
      (o.websiteReferences ?? []).some((r) => r.url?.trim() || r.note?.trim());
    return hasAny ? "partial" : "empty";
  }

  if (step === "wishes") {
    const hasAny = o.goals.length > 0 || o.desiredPages.length > 0 || hasAnyText(o.toneOfVoice);
    return hasAny ? "partial" : "empty";
  }

  if (step === "integrations") {
    if (o.integrations.length > 0) return "partial";
    return "empty";
  }

  if (step === "package") {
    const hasDraft =
      Boolean(client.package.planId && client.package.planId !== "none") ||
      Boolean(client.package.maintenanceId);
    if (!hasDraft) return "empty";
    if (!isPackageIntakeComplete(client)) return "partial";
    return "empty";
  }

  if (step === "billing") {
    const hasAny =
      o.termsAccepted ||
      hasAnyText(
        b.companyName,
        client.companyName,
        b.kvk,
        b.email,
        client.email,
        b.postcode,
        b.houseNumber,
        b.address,
        b.city,
        b.accountHolderFirstName,
        client.user.firstName,
        b.accountHolderLastName,
        client.user.lastName,
      );
    return hasAny ? "partial" : "empty";
  }

  if (step === "payment") {
    if (isIntakeSubmitted(client) && !isPaymentIntakeComplete(client)) return "partial";
    if (validateIntakeStep(client, "billing").valid) return "partial";
    return "empty";
  }

  return "empty";
}

export function isIntakeStepComplete(client: ClientAccount, step: IntakeStepKey): boolean {
  if (step === "integrations") {
    return (client.onboarding.completedSteps ?? []).includes("integrations");
  }
  if (step === "payment") {
    return isPaymentIntakeComplete(client);
  }
  if (step === "package") {
    return isPackageIntakeComplete(client);
  }
  return validateIntakeStep(client, step).valid;
}

export function getIntakeProgress(client: ClientAccount) {
  const statuses = INTAKE_PROGRESS_STEPS.map((step) => getIntakeStepStatus(client, step));
  const completed = statuses.filter((status) => status === "complete").length;
  const partial = statuses.filter((status) => status === "partial").length;
  const total = INTAKE_PROGRESS_STEPS.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    completed,
    partial,
    total,
    percent,
    label: `${completed}/${total}`,
  };
}

export function getIntakeProgressPercent(client: ClientAccount): number {
  return getIntakeProgress(client).percent;
}

export function getIntakeProgressLabel(client: ClientAccount): string {
  return getIntakeProgress(client).label;
}

export function allIntakeStepsComplete(client: ClientAccount): boolean {
  return INTAKE_PROGRESS_STEPS.every((step) => isIntakeStepComplete(client, step));
}

export function intakeStepKeyFromSlug(slug: string): IntakeStepKey | null {
  const map: Record<string, IntakeStepKey> = {
    bedrijfsgegevens: "company",
    media: "media",
    wensen: "wishes",
    koppelingen: "integrations",
    pakket: "package",
    facturatie: "billing",
    betalen: "payment",
  };
  return map[slug] ?? null;
}
