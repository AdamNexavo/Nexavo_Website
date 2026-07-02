export type PlanId = "funnel" | "start" | "groei" | "pro" | "maatwerk";

export type CellValue =
  | "included"
  | "not_included"
  | "optional"
  | "on_request";

export interface PricingPackage {
  id: PlanId;
  name: string;
  price: string;
  pricePrefix?: string;
  priceDetail?: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
  badge?: string;
}

export interface ComparisonRow {
  label: string;
  values: Record<PlanId, CellValue | string>;
}

export interface ComparisonSection {
  title: string;
  rows: ComparisonRow[];
}

export interface PricingFaq {
  question: string;
  answer: string;
}

export const planIds: PlanId[] = [
  "funnel",
  "start",
  "groei",
  "pro",
  "maatwerk",
];

export const planLabels: Record<PlanId, string> = {
  funnel: "Funnel",
  start: "Start",
  groei: "Groei",
  pro: "Pro",
  maatwerk: "Maatwerk",
};

export const pricingPackages: PricingPackage[] = [
  {
    id: "funnel",
    name: "Funnel / One-page",
    price: "€745",
    pricePrefix: "Vanaf",
    priceDetail: "eenmalig · excl. btw",
    description:
      "Voor ondernemers die snel één sterke pagina nodig hebben voor leads, inschrijvingen, campagnes of één specifieke dienst.",
    features: [
      "Conversiegerichte one-page website",
      "Mobielvriendelijk ontwerp + basis SEO",
      "Contact- of aanvraagformulier",
      "Webchat-widget",
      "Basis opvolgmail na aanvraag",
      "Google Maps indien relevant",
      "Oplevering binnen 7 dagen",
    ],
    cta: "Plan demo",
    ctaHref: "/contact",
  },
  {
    id: "start",
    name: "Start",
    price: "€1.495",
    priceDetail: "eenmalig · excl. btw",
    description:
      "Voor ondernemers die professioneel online willen staan met een complete basiswebsite.",
    features: [
      "Professionele website, tot 5 pagina's",
      "Mobielvriendelijk ontwerp + basis SEO",
      "Contactformulier + webchat-widget",
      "Google Maps-koppeling",
      "Formulierkoppeling naar e-mail",
      "Basis opvolgmail na aanvraag",
      "Oplevering binnen 7 dagen",
    ],
    cta: "Plan demo",
    ctaHref: "/contact",
  },
  {
    id: "groei",
    name: "Groei",
    price: "€2.250",
    priceDetail: "eenmalig · excl. btw",
    description:
      "Voor bedrijven die naast een website ook aanvragen, afspraken of reviews willen automatiseren.",
    features: [
      "Alles uit Start, tot 8 pagina's",
      "Lokale SEO-basis + extra landingspagina",
      "Boekingskalender + Calendly-koppeling",
      "Reviewmanagement basis",
      "Automatische opvolgmail + leadmelding",
      "Formulierkoppelingen",
      "Oplevering binnen 7 dagen",
    ],
    cta: "Plan demo",
    ctaHref: "/contact",
    highlighted: true,
    badge: "Populair",
  },
  {
    id: "pro",
    name: "Pro",
    price: "€3.250",
    priceDetail: "eenmalig · excl. btw",
    description:
      "Voor bedrijven die website, AI en automatisering serieuzer willen combineren.",
    features: [
      "Alles uit Groei, tot 12 pagina's",
      "Uitgebreide SEO-structuur",
      "AI-chatbot op je website",
      "Uitgebreide reviewflow",
      "Klantopvolging automatisering",
      "Geavanceerde formulieren",
      "Prioriteit · oplevering binnen 7 tot 10 dagen",
    ],
    cta: "Plan demo",
    ctaHref: "/contact",
  },
  {
    id: "maatwerk",
    name: "Maatwerk",
    price: "Op aanvraag",
    description:
      "Geen standaardpakket nodig? We stellen samen de juiste combinatie van website, automatiseringen en koppelingen voor jouw situatie.",
    features: [
      "Maatwerk website, funnel of modules",
      "Zelf samen te stellen",
      "Bestaande website uitbreiden",
      "Boekingen, reviews, AI-chatbot",
      "Meerdere locaties mogelijk",
      "Advies, strategie en optimalisatie",
    ],
    cta: "Vraag offerte aan",
    ctaHref: "/contact",
  },
];

export const comparisonSections: ComparisonSection[] = [
  {
    title: "Website",
    rows: [
      {
        label: "Type website",
        values: {
          funnel: "One-page",
          start: "Multi-page",
          groei: "Multi-page",
          pro: "Multi-page",
          maatwerk: "Op aanvraag",
        },
      },
      {
        label: "Aantal pagina's",
        values: {
          funnel: "1 pagina",
          start: "Tot 5",
          groei: "Tot 8",
          pro: "Tot 12",
          maatwerk: "Op aanvraag",
        },
      },
      {
        label: "Mobielvriendelijk ontwerp",
        values: {
          funnel: "included",
          start: "included",
          groei: "included",
          pro: "included",
          maatwerk: "included",
        },
      },
      {
        label: "Basis SEO-inrichting",
        values: {
          funnel: "included",
          start: "included",
          groei: "Lokale basis",
          pro: "Uitgebreid",
          maatwerk: "on_request",
        },
      },
      {
        label: "Contactformulier",
        values: {
          funnel: "included",
          start: "included",
          groei: "included",
          pro: "included",
          maatwerk: "included",
        },
      },
      {
        label: "Webchat-widget",
        values: {
          funnel: "included",
          start: "included",
          groei: "included",
          pro: "included",
          maatwerk: "on_request",
        },
      },
      {
        label: "Google Maps-koppeling",
        values: {
          funnel: "optional",
          start: "included",
          groei: "included",
          pro: "included",
          maatwerk: "on_request",
        },
      },
      {
        label: "Extra landingspagina",
        values: {
          funnel: "not_included",
          start: "not_included",
          groei: "included",
          pro: "included",
          maatwerk: "on_request",
        },
      },
      {
        label: "Blog- of projectstructuur",
        values: {
          funnel: "not_included",
          start: "not_included",
          groei: "not_included",
          pro: "included",
          maatwerk: "on_request",
        },
      },
      {
        label: "Oplevering",
        values: {
          funnel: "7 dagen",
          start: "7 dagen",
          groei: "7 dagen",
          pro: "7 tot 10 dagen",
          maatwerk: "Op aanvraag",
        },
      },
    ],
  },
  {
    title: "Automatiseringen",
    rows: [
      {
        label: "Basis contactformulier",
        values: {
          funnel: "included",
          start: "included",
          groei: "included",
          pro: "included",
          maatwerk: "on_request",
        },
      },
      {
        label: "Opvolgmail na aanvraag",
        values: {
          funnel: "included",
          start: "included",
          groei: "included",
          pro: "included",
          maatwerk: "on_request",
        },
      },
      {
        label: "Formulierkoppelingen",
        values: {
          funnel: "not_included",
          start: "included",
          groei: "included",
          pro: "included",
          maatwerk: "on_request",
        },
      },
      {
        label: "Boekingskalender",
        values: {
          funnel: "not_included",
          start: "not_included",
          groei: "included",
          pro: "included",
          maatwerk: "on_request",
        },
      },
      {
        label: "Calendly of vergelijkbaar",
        values: {
          funnel: "not_included",
          start: "not_included",
          groei: "included",
          pro: "included",
          maatwerk: "on_request",
        },
      },
      {
        label: "Reviewmanagement",
        values: {
          funnel: "not_included",
          start: "not_included",
          groei: "Basis",
          pro: "Uitgebreid",
          maatwerk: "on_request",
        },
      },
      {
        label: "AI-chatbot",
        values: {
          funnel: "not_included",
          start: "not_included",
          groei: "not_included",
          pro: "included",
          maatwerk: "on_request",
        },
      },
      {
        label: "Klantopvolging automatisering",
        values: {
          funnel: "not_included",
          start: "not_included",
          groei: "not_included",
          pro: "included",
          maatwerk: "on_request",
        },
      },
      {
        label: "Geavanceerde formulieren",
        values: {
          funnel: "not_included",
          start: "not_included",
          groei: "not_included",
          pro: "included",
          maatwerk: "on_request",
        },
      },
      {
        label: "Maatwerk koppelingen",
        values: {
          funnel: "not_included",
          start: "not_included",
          groei: "not_included",
          pro: "optional",
          maatwerk: "included",
        },
      },
    ],
  },
  {
    title: "Prijs",
    rows: [
      {
        label: "Eenmalig",
        values: {
          funnel: "Vanaf €745",
          start: "€1.495",
          groei: "€2.250",
          pro: "€3.250",
          maatwerk: "Op aanvraag",
        },
      },
    ],
  },
];

export const pricingFaqs: PricingFaq[] = [
  {
    question: "Welk pakket past het beste bij mij?",
    answer:
      "Funnel / One-page is ideaal voor één conversiegerichte pagina. Start geeft je een complete basiswebsite. Groei voegt boekingen en reviews toe. Pro combineert website, AI-chatbot en uitgebreide automatisering. Maatwerk is voor specifieke combinaties buiten de standaardpakketten.",
  },
  {
    question: "Zijn de prijzen inclusief btw?",
    answer:
      "Nee. Alle websitepakketten zijn eenmalige prijzen exclusief btw. Maandelijks onderhoud staat los van deze pakketten en kies je apart via de onderhoudspakketten op deze pagina.",
  },
  {
    question: "Kan ik later upgraden naar een groter pakket?",
    answer:
      "Ja. Veel klanten starten met Funnel, Start of Groei en breiden later uit. We bouwen je website en automatiseringen modulair op, zodat uitbreiden zonder alles opnieuw te doen meestal goed mogelijk is.",
  },
  {
    question: "Hoe snel is mijn website online?",
    answer:
      "Voor Funnel, Start en Groei geldt oplevering binnen 7 dagen na complete input. Pro heeft prioriteit bij oplevering en wordt binnen 7 tot 10 dagen opgeleverd na complete input.",
  },
  {
    question: "Hoe werkt jullie werkwijze na het kiezen van een pakket?",
    answer:
      "We starten met een demo en persoonlijk advies. Daarin bespreken we je doelen, wensen en situatie. Nexavo vertaalt dat naar een professionele website en de juiste automatiseringen via onze vaste Blueprint-workflow. Jij houdt regie, wij regelen ontwerp, bouw, inrichting en oplevering.",
  },
  {
    question: "Kunnen jullie mijn boekingen automatiseren?",
    answer:
      "Ja. Vanaf Groei koppelen we een boekingskalender of Calendly, zodat klanten zelf online kunnen plannen. In Pro breiden we dit uit met geavanceerde workflows en opvolging.",
  },
  {
    question: "Kunnen jullie reviews automatisch opvolgen?",
    answer:
      "Ja. Reviewmanagement is onderdeel van Groei (basis) en Pro (uitgebreid). Klanten ontvangen na een afspraak automatisch een reviewverzoek, zodat jij minder handmatig hoeft op te volgen.",
  },
  {
    question: "Is onderhoud verplicht?",
    answer:
      "Zolang Nexavo je website technisch beheert, host of onderhoudt, is Basis Beheer minimaal verplicht. Je kunt kiezen uit drie onderhoudspakketten: Basis (€59), Plus (€99) of Growth (€199) per maand exclusief btw.",
  },
  {
    question: "Kan ik ook alleen automatiseringen afnemen?",
    answer:
      "Ja, via Maatwerk. Denk aan een funnel met alleen boekingskalender, een losse AI-chatbot op een bestaande website of alleen automatiseringen zonder volledige website. Neem contact op en we stellen samen de juiste combinatie.",
  },
  {
    question: "Bouwen jullie ook webshops?",
    answer:
      "Nexavo focust op professionele websites met automatiseringen, geen webshops. Zo houden we oplevering snel, strak en schaalbaar. Heb je online verkopen nodig, dan bespreken we graag welke alternatieven passen.",
  },
];

export const cellValueLabels: Record<CellValue, string> = {
  included: "Inbegrepen",
  not_included: "Niet inbegrepen",
  optional: "Optioneel",
  on_request: "Op aanvraag",
};
