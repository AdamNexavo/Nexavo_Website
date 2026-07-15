/** Upsell- en meerwerkprijzen — bron: Nexavo Onderhouds_en_Revisiebeleid_Prijzen_v2.pdf */

export type PricingRow = { label: string; price: string };

export type PricingCategory = {
  id: string;
  title: string;
  rows: PricingRow[];
};

export const UPSELL_CATEGORIES: PricingCategory[] = [
  {
    id: "website",
    title: "Website-uitbreidingen",
    rows: [
      { label: "Extra eenvoudige pagina", price: "€175 – €250" },
      { label: "Extra uitgebreide pagina", price: "€300 – €450" },
      { label: "Extra landingspagina", price: "Vanaf €350" },
      { label: "Nieuwe sectie op bestaande pagina", price: "€100 – €200" },
      { label: "Kleine website van 2 pagina's", price: "Vanaf €995" },
      { label: "Kleine website van 3 pagina's", price: "Vanaf €1.195" },
      { label: "Meerdere locaties pagina-opzet", price: "Vanaf €495" },
      { label: "Locatiepagina per extra vestiging", price: "€175 – €300" },
      { label: "Kleine design-aanpassing binnen bestaande stijl", price: "€100 – €250" },
    ],
  },
  {
    id: "automation",
    title: "Automatiseringen",
    rows: [
      { label: "Boekingskalender basis", price: "Vanaf €295" },
      { label: "Boekingskalender uitgebreid", price: "€450 – €750" },
      { label: "Calendly-integratie basis", price: "Vanaf €195" },
      { label: "Google Calendar-koppeling", price: "Vanaf €295" },
      { label: "Reviewmanagement basis", price: "Vanaf €295" },
      { label: "Reviewmanagement uitgebreid", price: "€450 – €650" },
      { label: "Automatische opvolgmail na formulier", price: "Vanaf €150" },
      { label: "Formulier met extra logica", price: "€250 – €450" },
      { label: "Meerstaps aanvraagformulier", price: "€350 – €650" },
      { label: "Leadmelding naar e-mail", price: "Vanaf €150" },
      { label: "Kleine maatwerk automatisering", price: "Vanaf €495" },
      { label: "Uitgebreide maatwerk automatisering", price: "Vanaf €950" },
    ],
  },
  {
    id: "ai",
    title: "AI & chatbot",
    rows: [
      { label: "Webchat-widget basis", price: "Vanaf €150" },
      { label: "AI-chatbot basis", price: "Vanaf €495" },
      { label: "AI-chatbot getraind op FAQ en diensten", price: "€650 – €950" },
      { label: "AI-chatbot met boekingsflow", price: "€850 – €1.250" },
      { label: "AI-chatbot met reviewflow", price: "€850 – €1.250" },
      { label: "AI-chatbot met meerdere flows", price: "Vanaf €1.250" },
      { label: "Chatbot optimalisatieronde", price: "Vanaf €195" },
      { label: "Chatbot opnieuw trainen op nieuwe content", price: "Vanaf €150" },
    ],
  },
  {
    id: "branding",
    title: "Branding & visuele onderdelen",
    rows: [
      { label: "Logo redesign basis", price: "Vanaf €395" },
      { label: "Visitekaartje ontwerp", price: "Vanaf €150" },
      { label: "Huisstijlpakket basis", price: "Vanaf €750" },
      { label: "Rebranding pakket basis", price: "Vanaf €1.495" },
    ],
  },
];

export type ComboPackage = {
  id: string;
  title: string;
  lines: { label: string; price: string }[];
  subtotal: string;
  advicePrice: string;
};

export const COMBO_PACKAGES: ComboPackage[] = [
  {
    id: "funnel-booking",
    title: "Funnel + boekingskalender",
    lines: [
      { label: "Funnel / One-page", price: "€745" },
      { label: "Boekingskalender basis", price: "€295" },
      { label: "Basis opvolgmail", price: "Inbegrepen" },
    ],
    subtotal: "€1.040",
    advicePrice: "Vanaf €995 – €1.095 eenmalig",
  },
  {
    id: "funnel-reviews",
    title: "Funnel + reviewmanagement",
    lines: [
      { label: "Funnel / One-page", price: "€745" },
      { label: "Reviewmanagement basis", price: "€295" },
      { label: "Automatische opvolgmail", price: "€150" },
    ],
    subtotal: "€1.190",
    advicePrice: "Vanaf €1.195 eenmalig",
  },
  {
    id: "small-2",
    title: "Kleine website van 2 pagina's",
    lines: [
      { label: "One-page basis", price: "€745" },
      { label: "Extra eenvoudige pagina", price: "€250" },
    ],
    subtotal: "€995",
    advicePrice: "Vanaf €995 eenmalig",
  },
  {
    id: "small-3-reviews",
    title: "Kleine website van 3 pagina's + reviewmanagement",
    lines: [
      { label: "Kleine website 3 pagina's", price: "€1.195" },
      { label: "Reviewmanagement basis", price: "€295" },
    ],
    subtotal: "€1.490",
    advicePrice: "Vanaf €1.495 eenmalig",
  },
  {
    id: "start-booking",
    title: "Start website + boekingskalender",
    lines: [
      { label: "Start website", price: "€1.495" },
      { label: "Boekingskalender basis", price: "€295" },
    ],
    subtotal: "€1.790",
    advicePrice: "Vanaf €1.795 eenmalig",
  },
  {
    id: "extend-booking-reviews",
    title: "Bestaande website uitbreiden met booking + reviews",
    lines: [
      { label: "Analyse bestaande website", price: "€150" },
      { label: "Boekingskalender basis", price: "€295" },
      { label: "Reviewmanagement basis", price: "€295" },
      { label: "Automatische opvolgmail", price: "€150" },
    ],
    subtotal: "€890",
    advicePrice: "Vanaf €895 eenmalig",
  },
  {
    id: "start-ai",
    title: "Website + AI-chatbot basis",
    lines: [
      { label: "Start website", price: "€1.495" },
      { label: "AI-chatbot basis", price: "€495" },
    ],
    subtotal: "€1.990",
    advicePrice: "Vanaf €1.995 eenmalig",
  },
  {
    id: "groei-ai",
    title: "Groei + AI-chatbot",
    lines: [
      { label: "Groei pakket", price: "€2.250" },
      { label: "AI-chatbot basis", price: "€495" },
    ],
    subtotal: "€2.745",
    advicePrice: "Vanaf €2.695 – €2.745 eenmalig",
  },
];

export const QUOTE_START_POINTS = [
  { situation: "Eén pagina nodig", from: "Vanaf €745" },
  { situation: "2 pagina's nodig", from: "Vanaf €995" },
  { situation: "3 pagina's nodig", from: "Vanaf €1.195" },
  { situation: "Tot 5 pagina's nodig", from: "Vanaf €1.495" },
  { situation: "Tot 8 pagina's + automatisering", from: "Vanaf €2.250" },
  { situation: "Tot 12 pagina's + AI", from: "Vanaf €3.250" },
];

export const QUOTE_MODULES = [
  { module: "Boekingskalender basis", price: "Vanaf €295" },
  { module: "Reviewmanagement basis", price: "Vanaf €295" },
  { module: "AI-chatbot basis", price: "Vanaf €495" },
  { module: "Extra eenvoudige pagina", price: "€175 – €250" },
  { module: "Extra uitgebreide pagina", price: "€300 – €450" },
  { module: "Formulier met extra logica", price: "€250 – €450" },
  { module: "Kleine maatwerk automatisering", price: "Vanaf €495" },
];

export const QUOTE_ROUNDING = [
  { calculated: "€890", offer: "€895" },
  { calculated: "€995", offer: "€995" },
  { calculated: "€1.040", offer: "€995 – €1.095" },
  { calculated: "€1.190", offer: "€1.195" },
  { calculated: "€1.490", offer: "€1.495" },
  { calculated: "€1.790", offer: "€1.795" },
  { calculated: "€1.990", offer: "€1.995" },
  { calculated: "€2.745", offer: "€2.695 – €2.745" },
];
