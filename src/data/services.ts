export type ServiceSkeletonId =
  | "websites"
  | "boekingskalender"
  | "review-management"
  | "automatiseringen"
  | "integraties"
  | "hosting-onderhoud"
  | "content-seo";

export type ServiceRowLayout = "double" | "triple" | "asymmetric-double";

export interface Service {
  slug: string;
  title: string;
  description: string;
  linkLabel: string;
  skeleton: ServiceSkeletonId;
  tagline: string;
  overview: string;
  howItWorks: string;
  configure: string;
  highlights: string[];
}

const websites: Service = {
  slug: "websites",
  title: "Websites",
  description:
    "Professionele websites op maat. Van design tot oplevering, inclusief hosting en onderhoud.",
  linkLabel: "Meer over websites",
  skeleton: "websites",
  tagline: "Professioneel, snel en schaalbaar, geen standaard templates.",
  overview:
    "Wij bouwen websites die resultaat opleveren. Geen losse onderdelen, maar een compleet platform dat past bij jouw merk, doelgroep en groeiplannen. Responsive, snel en klaar om te converteren.",
  howItWorks:
    "We starten met een demo en intake. Daarna werken we ontwerp, content en development uit in vaste stappen. Jij levert input en feedback, wij regelen techniek, hosting en oplevering.",
  configure:
    "Samen bepalen we pagina's, structuur, huisstijl en gewenste koppelingen. Daarna richten we alles in en testen we op desktop, tablet en mobiel voordat je live gaat.",
  highlights: [
    "Op maat gemaakt design",
    "Responsive op elk apparaat",
    "SEO-basis inbegrepen",
    "Hosting & SSL inbegrepen",
  ],
};

const boekingskalender: Service = {
  slug: "boekingskalender",
  title: "Boekingskalender",
  description:
    "Klanten plannen zelf een afspraak via je website. Automatische bevestigingen en herinneringen.",
  linkLabel: "Meer over boekingskalender",
  skeleton: "boekingskalender",
  tagline: "Online boeken, 24/7, minder handmatig werk en minder no-shows.",
  overview:
    "Met een boekingskalender op je website laten klanten zelf een moment kiezen dat past. Bevestigingen en herinneringen gaan automatisch, zodat jij minder telefoontjes krijgt en meer overzicht houdt.",
  howItWorks:
    "We koppelen Calendly, Microsoft Bookings of een ander systeem aan je site. Klanten kiezen dienst en tijdslot, ontvangen direct bevestiging en kunnen synchroniseren met jouw agenda.",
  configure:
    "We bespreken je diensten, beschikbaarheid en gewenste flows. Nexavo plaatst de widget, test boekingen en stelt herinneringen in.",
  highlights: [
    "24/7 online boeken",
    "Automatische bevestigingen",
    "Agenda-synchronisatie",
    "Minder no-shows",
  ],
};

const reviewManagement: Service = {
  slug: "review-management",
  title: "Review management",
  description:
    "Automatisch reviews verzamelen na elke afspraak via e-mail, SMS of WhatsApp.",
  linkLabel: "Meer over review management",
  skeleton: "review-management",
  tagline: "Meer reviews, betere reputatie, zonder handmatig achteraan te zitten.",
  overview:
    "24 uur na elke afspraak ontvangen klanten automatisch een reviewverzoek. Positieve reviews publiceer je op je website, negatieve feedback handel je eerst intern af.",
  howItWorks:
    "Na een boeking of afspraak start automatisch een reviewflow. Klanten kiezen een kanaal, geven feedback en positieve reviews verschijnen op je site.",
  configure:
    "We stellen timing, teksten en kanalen in. Jij bepaalt welke reviews zichtbaar worden en hoe negatieve feedback intern binnenkomt.",
  highlights: [
    "Reviewverzoek na afspraak",
    "E-mail, SMS of WhatsApp",
    "Reviews op je website",
    "Interne afhandeling van feedback",
  ],
};

const automatiseringen: Service = {
  slug: "automatiseringen",
  title: "Automatiseringen",
  description:
    "Automatiseer terugkerende taken. Van formulieren tot opvolging en workflows.",
  linkLabel: "Meer over automatiseringen",
  skeleton: "automatiseringen",
  tagline: "Bespaar tijd met slimme workflows die voor je doorlopen.",
  overview:
    "Formulieren, boekingen, reviews en opvolging kunnen automatisch op elkaar aansluiten. Minder copy-paste, minder vergeten stappen, meer focus op je klanten.",
  howItWorks:
    "Een trigger op je site, zoals een formulier of boeking, start acties in andere tools. Denk aan e-mail, CRM, agenda of WhatsApp zonder handmatig werk.",
  configure:
    "We brengen je processen in kaart en bouwen workflows via Zapier, Make, n8n of maatwerk. Alles wordt getest voordat het live gaat.",
  highlights: [
    "Formulier- en boekingstriggers",
    "E-mail- en WhatsAppflows",
    "Koppelingen met je tools",
    "Minder handmatig werk",
  ],
};

const integraties: Service = {
  slug: "integraties",
  title: "Koppelingen",
  description:
    "Verbind je website met agenda's, betalingen, analytics en marketingtools.",
  linkLabel: "Meer over koppelingen",
  skeleton: "integraties",
  tagline: "Al je tools naadloos gekoppeld aan je website.",
  overview:
    "Van Google Analytics tot Mollie, Calendly en Mailchimp: wij zorgen dat je website en bedrijfstools samenwerken. Geen losse eilanden, wel één werkende flow.",
  howItWorks:
    "We kiezen de juiste koppelingen voor jouw situatie, installeren ze correct en testen de volledige keten, van klik op je site tot actie in je tool.",
  configure:
    "Samen bepalen we welke koppelingen nodig zijn. Nexavo regelt installatie, instellingen en documentatie.",
  highlights: [
    "Agenda & boekingen",
    "Betalingen & formulieren",
    "Analytics & pixels",
    "E-mail & marketing",
  ],
};

const hostingOnderhoud: Service = {
  slug: "hosting-onderhoud",
  title: "Hosting & onderhoud",
  description:
    "Betrouwbare hosting, updates en support. Jouw site blijft snel, veilig en online.",
  linkLabel: "Meer over hosting & onderhoud",
  skeleton: "hosting-onderhoud",
  tagline: "99,9% uptime met SSL, backups en persoonlijke support.",
  overview:
    "Hosting, SSL, updates en beveiliging zitten inbegrepen. Wij houden je site technisch gezond zodat jij je op ondernemen kunt richten.",
  howItWorks:
    "Na oplevering hosten wij je site op betrouwbare infrastructuur. Updates, monitoring en kleine wijzigingen lopen via vaste onderhoudspakketten.",
  configure:
    "Je kiest een onderhoudspakket dat past bij hoe vaak je wijzigingen nodig hebt. Wij regelen de rest.",
  highlights: [
    "Hosting & SSL inbegrepen",
    "Regelmatige updates",
    "Back-ups & monitoring",
    "Persoonlijke support",
  ],
};

const contentSeo: Service = {
  slug: "content-seo",
  title: "Content & SEO",
  description:
    "Professionele teksten en SEO-basis zodat je gevonden wordt en converteert.",
  linkLabel: "Meer over content & SEO",
  skeleton: "content-seo",
  tagline: "Teksten die aanspreken en goed scoren in Google.",
  overview:
    "Van homepage tot dienstenpagina's: wij schrijven en structureren content die past bij jouw merk én vindbaar is voor je doelgroep.",
  howItWorks:
    "We starten met je doelgroep en zoekwoorden. Daarna schrijven we pagina's, meta-informatie en interne links die je site sterker maken.",
  configure:
    "Jij levert input over je diensten en tone of voice. Wij leveren teksten, SEO-structuur en implementatie op je site.",
  highlights: [
    "Website copywriting",
    "SEO-structuur & meta",
    "Dienst- en landingspagina's",
    "Conversiegerichte teksten",
  ],
};

export const allServices: Service[] = [
  websites,
  boekingskalender,
  reviewManagement,
  automatiseringen,
  integraties,
  hostingOnderhoud,
  contentSeo,
];

export interface ServiceRow {
  layout: ServiceRowLayout;
  services: Service[];
  /** Tailwind grid-cols class for asymmetric rows, e.g. md:grid-cols-[1.2fr_0.8fr] */
  columns?: string;
}

export const serviceRows: ServiceRow[] = [
  {
    layout: "asymmetric-double",
    services: [websites, boekingskalender],
    columns: "md:grid-cols-[1.24fr_0.76fr]",
  },
  {
    layout: "asymmetric-double",
    services: [reviewManagement, automatiseringen],
    columns: "md:grid-cols-[1.08fr_0.92fr]",
  },
  { layout: "triple", services: [integraties, hostingOnderhoud, contentSeo] },
];

export const getServiceBySlug = (slug: string): Service | undefined =>
  allServices.find((service) => service.slug === slug);

export const getRelatedServices = (slug: string, limit = 3): Service[] =>
  allServices.filter((service) => service.slug !== slug).slice(0, limit);
