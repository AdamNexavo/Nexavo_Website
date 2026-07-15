import type { OnboardingStepId } from "./types";

export type IntakeStepSlug =
  | "bedrijfsgegevens"
  | "media"
  | "wensen"
  | "koppelingen"
  | "pakket"
  | "facturatie"
  | "betalen";

export type IntakeStepConfig =
  | { slug: IntakeStepSlug; type: "wizard"; step: OnboardingStepId; title: string; subtitle: string }
  | { slug: IntakeStepSlug; type: "package"; title: string; subtitle: string };

export const INTAKE_STEP_SLUGS: IntakeStepSlug[] = [
  "bedrijfsgegevens",
  "media",
  "wensen",
  "koppelingen",
  "pakket",
  "facturatie",
  "betalen",
];

export function getNextIntakeStepSlug(slug: IntakeStepSlug): IntakeStepSlug | null {
  const idx = INTAKE_STEP_SLUGS.indexOf(slug);
  if (idx < 0 || idx >= INTAKE_STEP_SLUGS.length - 1) return null;
  return INTAKE_STEP_SLUGS[idx + 1];
}

export function getIntakeStepNumber(slug: IntakeStepSlug): number {
  return INTAKE_STEP_SLUGS.indexOf(slug) + 1;
}

export const INTAKE_STEP_CONFIG: Record<IntakeStepSlug, IntakeStepConfig> = {
  bedrijfsgegevens: {
    slug: "bedrijfsgegevens",
    type: "wizard",
    step: "company",
    title: "Bedrijfsgegevens",
    subtitle: "Vul je bedrijfsprofiel in zodat we direct kunnen starten.",
  },
  media: {
    slug: "media",
    type: "wizard",
    step: "media",
    title: "Media & huisstijl",
    subtitle: "Upload logo's, foto's en video's en stel je huisstijl in.",
  },
  wensen: {
    slug: "wensen",
    type: "wizard",
    step: "wishes",
    title: "Websitewensen",
    subtitle: "Geef aan welke secties en doelen je website moet hebben.",
  },
  koppelingen: {
    slug: "koppelingen",
    type: "wizard",
    step: "integrations",
    title: "Koppelingen kiezen",
    subtitle: "Zoek en selecteer de tools die je wilt koppelen.",
  },
  pakket: {
    slug: "pakket",
    type: "package",
    title: "Pakket kiezen",
    subtitle: "Kies je websitepakket, onderhoud en add-ons.",
  },
  facturatie: {
    slug: "facturatie",
    type: "wizard",
    step: "billing",
    title: "Facturatie & voorwaarden",
    subtitle: "Vul je factuurgegevens in en accepteer de algemene voorwaarden.",
  },
  betalen: {
    slug: "betalen",
    type: "wizard",
    step: "payment",
    title: "Betalen & intake versturen",
    subtitle: "Betaal je pakket via Mollie en rond je intake af.",
  },
};

export function isIntakeStepSlug(value: string | undefined): value is IntakeStepSlug {
  return Boolean(value && value in INTAKE_STEP_CONFIG);
}
