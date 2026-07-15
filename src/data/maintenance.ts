export interface MaintenancePackage {
  id: string;
  name: string;
  price: string;
  priceNote: string;
  description: string;
  highlights: string[];
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

export const maintenancePackages: MaintenancePackage[] = [
  {
    id: "basis",
    name: "Basis Beheer",
    price: "€59",
    priceNote: "per maand, excl. btw",
    description:
      "Voor eenvoudige websites met beperkte maandelijkse wijzigingen.",
    highlights: [
      "1 maandelijkse ronde",
      "5 kleine wijzigingen",
      "60 minuten p/m",
    ],
    features: [
      "Hosting- en serverbeheer",
      "SSL-certificaat en basisbeveiliging",
      "Basiscontrole op bereikbaarheid",
      "Domein- en DNS-ondersteuning indien via Nexavo",
      "Periodieke back-ups waar technisch mogelijk",
      "Support via klantportaal of support@nexavo.works",
      "Maximaal 5 afbeeldingen vervangen of toevoegen",
      "Maximaal 1 aangeleverd blogartikel plaatsen",
      "Maximaal 1 eenvoudige video-embed plaatsen",
    ],
  },
  {
    id: "plus",
    name: "Plus Beheer",
    price: "€99",
    priceNote: "per maand, excl. btw",
    description:
      "Voor klanten die vaker kleine wijzigingen willen en sneller geholpen willen worden.",
    highlights: [
      "Wekelijkse verwerking",
      "10 kleine wijzigingen",
      "120 minuten p/m",
    ],
    features: [
      "Alles uit Basis Beheer",
      "Maximaal 10 afbeeldingen vervangen of toevoegen",
      "Maximaal 2 aangeleverde blogartikelen plaatsen",
      "Maximaal 2 eenvoudige video-embeds plaatsen",
      "Kleine SEO-aanpassingen (titels, metabeschrijvingen, kopteksten)",
      "Controle van formulieren en belangrijke knoppen",
    ],
    highlighted: true,
    badge: "Aanbevolen",
  },
  {
    id: "growth",
    name: "Growth Beheer",
    price: "€199",
    priceNote: "per maand, excl. btw",
    description:
      "Voor actievere websites, meer content, meer wijzigingen en aanvullende modules.",
    highlights: [
      "Prioriteit bij support",
      "20 kleine wijzigingen",
      "240 minuten p/m",
    ],
    features: [
      "Alles uit Plus Beheer",
      "Maximaal 20 afbeeldingen vervangen of toevoegen",
      "Maximaal 4 aangeleverde blogartikelen plaatsen",
      "Maximaal 4 eenvoudige video-embeds plaatsen",
      "Maandelijkse optimalisatieronde",
      "Controle van formulieren, CTA's en conversiepunten",
      "Kleine updates aan bestaande automatiseringen indien vooraf inbegrepen",
    ],
  },
];

export const revisionExamples = {
  included: [
    "Kopregel of openingstijden wijzigen",
    "Telefoonnummer of e-mailadres aanpassen",
    "Korte tekst aanpassen of typefout herstellen",
    "Foto vervangen of beperkt beeldmateriaal toevoegen",
    "Aangeleverd blogartikel plaatsen",
    "Video embedden via aangeleverde link",
  ],
  notIncluded: [
    "Nieuwe pagina's of landingspagina's bouwen",
    "Nieuwe functionaliteit of automatiseringen toevoegen",
    "API-koppelingen bouwen of aanpassen",
    "Blogs of SEO-teksten schrijven",
    "Webshopfunctionaliteit toevoegen",
  ],
};
