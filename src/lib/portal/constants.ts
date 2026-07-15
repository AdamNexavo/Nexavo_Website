import { planLabels, pricingPackages, type PlanId } from "@/data/pricing";
import { maintenancePackages } from "@/data/maintenance";

export { pricingPackages, maintenancePackages, planLabels };
export type { PlanId };

export const PORTAL_INTEGRATIONS = [
  { id: "contactform", name: "Contactformulier", description: "Aanvragen en berichten via je website", logo: null },
  { id: "google-maps", name: "Google Maps", description: "Locatie en routebeschrijving", logo: "/integrations/google-maps.png" },
  { id: "google-reviews", name: "Google Reviews", description: "Reviews verzamelen en tonen", logo: "/integrations/google-reviews.png" },
  { id: "calendly", name: "Calendly", description: "Online afspraken plannen", logo: "/integrations/calendly.png" },
  { id: "google-calendar", name: "Google Calendar", description: "Agenda synchronisatie", logo: "/integrations/google-calendar.png" },
  { id: "whatsapp", name: "WhatsApp", description: "Direct contact via chat", logo: "/integrations/whatsapp.png" },
  { id: "booking", name: "Boekingskalender", description: "24/7 online boeken", logo: "/integrations/calendly.png" },
  { id: "reviews", name: "Review management", description: "Automatisch reviews uitvragen", logo: "/integrations/google-reviews.png" },
  { id: "chatbot", name: "AI-chatbot", description: "Veelgestelde vragen automatisch beantwoorden", logo: null },
  { id: "mollie", name: "Mollie", description: "Online betalingen ontvangen", logo: "/integrations/mollie.png" },
  { id: "mailchimp", name: "Mailchimp", description: "Nieuwsbrief en e-mailmarketing", logo: "/integrations/mailchimp.png" },
  { id: "zapier", name: "Zapier", description: "Koppelingen met andere tools", logo: "/integrations/zapier.png" },
  { id: "google-analytics", name: "Google Analytics", description: "Inzicht in websitebezoek", logo: "/integrations/google-analytics.png" },
] as const;

export const PORTAL_ADDONS = [
  {
    id: "booking",
    name: "Boekingskalender",
    description: "Online afspraken laten inplannen via je website",
    price: "vanaf €295",
    priceNote: "eenmalig · excl. btw",
  },
  {
    id: "reviews",
    name: "Reviewmanagement",
    description: "Automatisch reviews uitvragen na klantcontact",
    price: "vanaf €295",
    priceNote: "eenmalig · excl. btw",
  },
  {
    id: "chatbot",
    name: "AI-chatbot",
    description: "Veelgestelde vragen automatisch beantwoorden op je site",
    price: "vanaf €495",
    priceNote: "eenmalig · excl. btw",
  },
  {
    id: "extra-page",
    name: "Extra eenvoudige pagina",
    description: "Uitbreiding met een extra pagina boven je pakket",
    price: "€175–€250",
    priceNote: "eenmalig · excl. btw",
  },
  {
    id: "landing-page",
    name: "Extra landingspagina",
    description: "Conversiegerichte landingspagina naast je website",
    price: "vanaf €350",
    priceNote: "eenmalig · excl. btw",
  },
  {
    id: "form-logic",
    name: "Formulier met extra logica",
    description: "Geavanceerd formulier met voorwaarden en routing",
    price: "€250–€450",
    priceNote: "eenmalig · excl. btw",
  },
  {
    id: "logo-redesign",
    name: "Logo redesign",
    description: "Professioneel logo ontwerp of vernieuwing",
    price: "vanaf €395",
    priceNote: "eenmalig · excl. btw",
  },
  {
    id: "brand-package",
    name: "Huisstijlpakket",
    description: "Logo, kleuren, typografie en basis brand assets",
    price: "vanaf €750",
    priceNote: "eenmalig · excl. btw",
  },
] as const;

export type IntegrationStatus = "not_linked" | "requested" | "in_progress" | "active";

export const INTEGRATION_STATUS_LABELS: Record<IntegrationStatus, string> = {
  not_linked: "Niet gekoppeld",
  requested: "Aangevraagd",
  in_progress: "In behandeling",
  active: "Actief",
};

export const WEBSITE_GOALS = [
  "Meer aanvragen via de website",
  "Online afspraken laten inplannen",
  "Professionele uitstraling",
  "Reviews verzamelen",
  "Minder handmatig werk",
  "Beter informeren",
  "Bestaande website vernieuwen",
] as const;

export const DESIRED_SECTIONS = [
  "Hero / introductie",
  "Over ons",
  "Diensten",
  "Producten",
  "Prijzen / tarieven",
  "Reviews & testimonials",
  "Team",
  "Contact",
  "Locaties / vestigingen",
  "Portfolio / projecten",
  "Blog / nieuws",
  "Vacatures",
  "Partners & logo's",
  "FAQ",
  "Offerte / aanvraagformulier",
  "Openingstijden",
  "Route & parkeren",
  "Video sectie",
  "Call-to-action blok",
  "Cases / resultaten",
] as const;

/** @deprecated use DESIRED_SECTIONS */
export const DESIRED_PAGES = DESIRED_SECTIONS;

export const TONE_OPTIONS = [
  "Zakelijk",
  "Persoonlijk",
  "Premium",
  "Jong / fris",
  "Rustig / minimalistisch",
] as const;

export const STYLE_OPTIONS = [
  "Clean",
  "Premium",
  "Modern",
  "Speels",
  "Luxe",
  "Zakelijk",
] as const;

export const BUILD_PROGRESS_STEPS = [
  "Intake invullen",
  "Media uploaden",
  "Design voorbereiding",
  "Website in bouw",
  "Feedbackronde",
  "Klaar voor livegang",
] as const;

export const TICKET_STATUSES = {
  submitted: "Ingediend",
  review: "In beoordeling",
  waiting_client: "Wacht op klant",
  in_progress: "In behandeling",
  extra_work: "Meerwerk voorgesteld",
  done: "Afgerond",
  out_of_scope: "Buiten scope",
} as const;

export type TicketStatusKey = keyof typeof TICKET_STATUSES;

export type TicketStatusVariant = "default" | "green" | "purple" | "orange";

export const TICKET_STATUS_VARIANT: Record<TicketStatusKey, TicketStatusVariant> = {
  submitted: "purple",
  review: "orange",
  waiting_client: "default",
  in_progress: "purple",
  extra_work: "orange",
  done: "green",
  out_of_scope: "default",
};

export function getPlanById(id: string) {
  return pricingPackages.find((p) => p.id === id);
}

export function getMaintenanceById(id: string) {
  return maintenancePackages.find((p) => p.id === id);
}
