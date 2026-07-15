/** Onderhouds- & revisiebeleid — bron: Nexavo Onderhouds_en_Revisiebeleid_Prijzen_v2.pdf */

export const MAINTENANCE_POLICY = {
  title: "Onderhouds- & revisiebeleid Nexavo",
  version: "1.1",
  pdfHref: "/documents/Nexavo_Onderhouds_en_Revisiebeleid_Prijzen_v2.pdf",
  coreRule:
    "Een revisie is een kleine wijziging aan iets wat al bestaat. Alles wat nieuw gebouwd, ontworpen, geschreven, gekoppeld, geautomatiseerd of met spoed uitgevoerd moet worden, valt onder meerwerk.",
  packages: [
    {
      id: "basis",
      name: "Basis Beheer",
      price: "€50 p/m",
      summary: "Voor eenvoudige websites met beperkte maandelijkse wijzigingen.",
      highlights: [
        "1 maandelijkse onderhoudsronde",
        "Max. 5 kleine websitewijzigingen per maand",
        "Max. 5 afbeeldingen vervangen of toevoegen",
        "Max. 1 aangeleverd blogartikel plaatsen",
        "Max. 1 eenvoudige video-embed",
        "Max. 60 minuten verwerkingstijd per maand",
      ],
      includes: [
        "Hosting- en serverbeheer",
        "SSL-certificaat en basisbeveiliging",
        "Basiscontrole op bereikbaarheid",
        "Domein- en DNS-ondersteuning indien via Nexavo beheerd",
        "Periodieke back-ups waar technisch mogelijk",
        "Support via klantportaal of support@nexavo.nl",
      ],
    },
    {
      id: "plus",
      name: "Plus Beheer",
      price: "€100 p/m",
      recommended: true,
      summary: "Voor klanten die vaker kleine wijzigingen willen en sneller geholpen willen worden.",
      highlights: [
        "Wekelijkse verwerking van revisieverzoeken",
        "Max. 10 kleine websitewijzigingen per maand",
        "Max. 10 afbeeldingen",
        "Max. 2 aangeleverde blogartikelen",
        "Max. 2 video-embeds",
        "Max. 120 minuten verwerkingstijd per maand",
      ],
      includes: [
        "Alles uit Basis Beheer",
        "Kleine SEO-aanpassingen (titels, metabeschrijvingen, kopteksten)",
        "Controle van formulieren en belangrijke knoppen",
      ],
    },
    {
      id: "growth",
      name: "Growth Beheer",
      price: "€199 p/m",
      summary: "Voor actievere websites, meer content, meer wijzigingen en aanvullende modules.",
      highlights: [
        "Prioriteit bij support",
        "Max. 20 kleine websitewijzigingen per maand",
        "Max. 20 afbeeldingen",
        "Max. 4 aangeleverde blogartikelen",
        "Max. 4 video-embeds",
        "Max. 240 minuten verwerkingstijd per maand",
      ],
      includes: [
        "Alles uit Plus Beheer",
        "Maandelijkse optimalisatieronde",
        "Controle van formulieren, CTA's en conversiepunten",
        "Kleine updates aan bestaande automatiseringen indien vooraf inbegrepen",
      ],
    },
  ],
  smallChanges: [
    "Kopregel aanpassen",
    "Openingstijden wijzigen",
    "Telefoonnummer of e-mailadres aanpassen",
    "Korte tekst aanpassen",
    "Foto vervangen of beperkt beeldmateriaal toevoegen",
    "Kleine bedrijfsupdate plaatsen",
    "Knop of link aanpassen",
    "Aangeleverd blogartikel plaatsen",
    "Video embedden via aangeleverde link",
    "Kleine fout of typefout herstellen",
    "Een bestaand websiteblok licht aanpassen zonder nieuw ontwerp of nieuwe functionaliteit",
  ],
  notIncluded: [
    "Nieuwe pagina bouwen",
    "Nieuwe sectie ontwerpen of bouwen",
    "Nieuwe landingspagina maken",
    "Nieuwe websitefunctionaliteit toevoegen",
    "Nieuwe kalender of boekingssysteem toevoegen",
    "Calendly, Google Calendar of andere boekingssystemen volledig instellen",
    "API-koppelingen bouwen of aanpassen",
    "AI-chatbot bouwen, trainen of volledig aanpassen",
    "Reviewmanagement volledig instellen",
    "Nieuwe formulieren met extra logica bouwen",
    "Webshopfunctionaliteit toevoegen",
    "Volledige pagina's herschrijven",
    "Blogs schrijven",
    "SEO-teksten schrijven",
    "Foto's professioneel bewerken",
    "Video's monteren",
    "Grafisch ontwerp maken",
    "Huisstijl of rebranding uitvoeren",
    "Spoedwerk buiten de normale planning",
  ],
  meerwerkRates: [
    { type: "Standaard meerwerk", rate: "Vanaf €65 per uur excl. btw" },
    { type: "Technisch werk / development", rate: "Vanaf €85 per uur excl. btw" },
    { type: "API-koppelingen, automatiseringen of AI-chatbots", rate: "Vanaf €85 tot €110 per uur excl. btw" },
    { type: "Spoedwerk", rate: "Vanaf €95 per uur excl. btw" },
  ],
  contractRules: [
    "Voor elk onderhoudspakket geldt een minimale looptijd van 12 maanden.",
    "Basis Beheer (€50 p/m excl. btw) is de minimale beheerbasis zolang Nexavo de website technisch beheert, host of onderhoudt.",
    "Upgraden kan op elk moment; het hogere pakket gaat in vanaf de eerstvolgende factuurperiode.",
    "Downgrade binnen de eerste 3 maanden mogelijk bij Plus of Growth; daarna geldt het gekozen pakket voor de resterende contracttermijn.",
    "Niet-gebruikte revisies of tijd worden niet meegenomen naar een volgende maand.",
  ],
  ticketNote:
    "Revisieverzoeken via het klantportaal of support@nexavo.nl. Onderwerp: [KLANTNUMMER] Revisieverzoek - Bedrijfsnaam",
};

export const REVISION_POLICY = {
  title: "Revisiebeleid Nexavo",
  summary: MAINTENANCE_POLICY.coreRule,
  sections: [
    {
      heading: "Kernregel",
      body: MAINTENANCE_POLICY.coreRule,
    },
    {
      heading: "Inbegrepen revisies",
      body: "Tijdens de bouwfase kun je feedback geven op ontwerp en content binnen de scope van je gekozen pakket. Na livegang vallen kleine wijzigingen onder je onderhoudspakket (Basis, Plus of Growth) conform de maandelijkse limieten.",
    },
    {
      heading: "Kleine wijzigingen (voorbeelden)",
      body: MAINTENANCE_POLICY.smallChanges.slice(0, 6).join(" · ") + " — en vergelijkbare kleine aanpassingen.",
    },
    {
      heading: "Meerwerk",
      body: "Wijzigingen buiten scope worden als meerwerk beschouwd en apart geoffreerd. Nexavo start pas met meerwerk nadat je akkoord hebt gegeven op de kosteninschatting of offerte.",
    },
    {
      heading: "Doorlooptijd",
      body: "Revisieverzoeken worden binnen 2 werkdagen beoordeeld. Implementatie hangt af van complexiteit, je pakket (wekelijks vs. maandelijks) en lopende projectplanning.",
    },
    {
      heading: "Tickets",
      body: MAINTENANCE_POLICY.ticketNote,
    },
  ],
};
