export {
  MAINTENANCE_POLICY,
  REVISION_POLICY,
} from "./maintenance-revision-policy";

export {
  UPSELL_CATEGORIES,
  COMBO_PACKAGES,
  QUOTE_START_POINTS,
  QUOTE_MODULES,
  QUOTE_ROUNDING,
  type PricingCategory,
  type PricingRow,
  type ComboPackage,
} from "./upsell-pricing";

export const PORTAL_DOCUMENTS = [
  {
    id: "voorwaarden",
    title: "Algemene voorwaarden",
    description: "De voorwaarden die je hebt geaccepteerd bij intake.",
    href: "/voorwaarden",
    external: true,
  },
  {
    id: "onderhoud",
    title: "Onderhouds- & revisiebeleid",
    description: "Wat valt onder je onderhoudspakket en wanneer is iets meerwerk?",
    type: "maintenance" as const,
    href: "/documents/Nexavo_Onderhouds_en_Revisiebeleid_Prijzen_v2.pdf",
    external: true,
  },
  {
    id: "privacy",
    title: "Privacyverklaring",
    description: "Hoe wij omgaan met je gegevens.",
    href: "/privacy",
    external: true,
  },
];

export const TICKET_CATEGORIES = [
  "Website wijzigingen",
  "Technisch probleem",
  "Facturatie & betaling",
  "Koppelingen & integraties",
  "Content & media",
  "Boekingskalender",
  "Review management",
  "Overig",
] as const;

export type TicketCategory = (typeof TICKET_CATEGORIES)[number];

export function notifyTicketCreated(params: {
  ticketNumber: string;
  companyName: string;
  clientNumber: string;
  subject: string;
}) {
  console.info(
    "[Nexavo demo mail → admin]",
    `Nieuw ticket ${params.ticketNumber} van ${params.companyName} (${params.clientNumber}): ${params.subject}`,
  );
}

export function notifyTicketReply(params: {
  ticketNumber: string;
  toEmail: string;
  clientName: string;
}) {
  console.info(
    "[Nexavo demo mail → klant]",
    `Antwoord op ticket ${params.ticketNumber} naar ${params.toEmail} (${params.clientName})`,
  );
}

export function notifyIntakeActivation(params: {
  companyName: string;
  clientNumber: string;
  email: string;
  isMaatwerk: boolean;
}) {
  console.info(
    "[Nexavo demo mail → klant]",
    params.isMaatwerk
      ? `Intake ontvangen voor ${params.companyName} (${params.clientNumber}). We nemen contact op op ${params.email}.`
      : `Intake ontvangen voor ${params.companyName} (${params.clientNumber}). Wij gaan aan de slag — bevestiging naar ${params.email}.`,
  );
}
