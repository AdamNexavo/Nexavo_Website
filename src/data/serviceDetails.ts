import { getServiceBySlug, type Service } from "./services";

export interface ServiceStep {
  step: string;
  title: string;
  description: string;
}

export interface ServiceContentSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface ServiceExtraBlock {
  title: string;
  description: string;
  items: string[];
}

export interface WebsiteType {
  title: string;
  description: string;
  bestFor: string;
}

export interface ServiceDetailContent {
  sections: ServiceContentSection[];
  steps: ServiceStep[];
  extraBlocks?: ServiceExtraBlock[];
  websiteTypes?: WebsiteType[];
  recommendedPlans: string[];
  pricingTeaser: string;
  faqs: { question: string; answer: string }[];
}

export const serviceDetails: Record<string, ServiceDetailContent> = {
  websites: {
    recommendedPlans: ["Start", "Groei", "Pro"],
    pricingTeaser:
      "Van een conversiegerichte funnel tot een complete website met automatiseringen. Bekijk welk pakket past.",
    sections: [
      {
        title: "Waarom een professionele website het verschil maakt",
        paragraphs: [
          "Je website is vaak het eerste contactmoment met nieuwe klanten. Een verouderde of generieke site kost vertrouwen, terwijl een doordachte website juist aanvragen, boekingen en reviews binnenhaalt.",
          "Bij Nexavo bouwen we geen standaard templates. We ontwerpen en ontwikkelen een site die past bij jouw merk, doelgroep en groeiplannen, inclusief hosting, SSL en een solide technische basis.",
        ],
      },
      {
        title: "Welke type websites wij bouwen",
        paragraphs: [
          "Niet elk bedrijf heeft dezelfde behoefte. Daarom werken we met verschillende websitevormen, elk gericht op een duidelijk doel.",
        ],
        bullets: [
          "Conversiegerichte funnel / one-page voor één duidelijke actie",
          "Complete bedrijfswebsite met meerdere pagina's en diensten",
          "Landingspagina's voor campagnes, acties of nieuwe diensten",
          "Uitbreidbare basis die later groeit met boekingen, reviews of koppelingen",
        ],
      },
      {
        title: "Automatiseringen op je website",
        paragraphs: [
          "Een website staat zelden op zichzelf. Formulieren, boekingen, reviewverzoeken en opvolging kunnen direct op je site worden aangesloten, zodat je minder handmatig werk hebt en sneller reageert op leads.",
          "We bouwen je platform zo op dat je later eenvoudig kunt uitbreiden, zonder opnieuw te beginnen.",
        ],
        bullets: [
          "Contactformulieren met automatische bevestiging",
          "Boekingsflows gekoppeld aan je agenda",
          "Reviewverzoeken na afspraken",
          "Koppelingen met e-mail, WhatsApp, CRM of analytics",
        ],
      },
      {
        title: "Wat standaard inbegrepen is",
        paragraphs: [
          "Transparante pakketten zonder verborgen kosten. Hosting, SSL, responsive design en een SEO-basis horen standaard bij onze websiteprojecten.",
        ],
        bullets: [
          "Responsive design voor mobiel, tablet en desktop",
          "Snelle laadtijden en technische optimalisatie",
          "Hosting & SSL-certificaat",
          "Persoonlijke begeleiding tijdens het traject",
        ],
      },
    ],
    steps: [
      {
        step: "01",
        title: "Demo & intake",
        description:
          "We bespreken je doelen, doelgroep, huisstijl en gewenste functionaliteiten in een vrijblijvend gesprek.",
      },
      {
        step: "02",
        title: "Ontwerp & structuur",
        description:
          "We werken wireframes en design uit. Jij geeft feedback tot alles klopt met je merk en boodschap.",
      },
      {
        step: "03",
        title: "Bouw & content",
        description:
          "We ontwikkelen de site, vullen pagina's en koppelen formulieren, boekingen of reviews waar nodig.",
      },
      {
        step: "04",
        title: "Test & oplevering",
        description:
          "We testen op alle apparaten, zetten alles live en lopen samen door hoe je site werkt.",
      },
    ],
    websiteTypes: [
      {
        title: "Funnel / one-page",
        description:
          "Eén sterke pagina gericht op één conversie: offerte aanvragen, demo plannen of inschrijven.",
        bestFor: "Campagnes, starters, één duidelijk aanbod",
      },
      {
        title: "Bedrijfswebsite",
        description:
          "Meerdere pagina's: home, diensten, over ons, contact en ruimte om te groeien.",
        bestFor: "Dienstverleners, MKB, salons, coaches",
      },
      {
        title: "Website + automatisering",
        description:
          "Complete site met boekingskalender, reviewflows en koppelingen in één platform.",
        bestFor: "Bedrijven die online willen schalen zonder extra tools",
      },
      {
        title: "Maatwerk",
        description:
          "Specifieke combinaties buiten standaardpakketten. Wij stellen samen wat nodig is.",
        bestFor: "Complexere wensen of unieke flows",
      },
    ],
    faqs: [
      {
        question: "Hoe snel kan mijn website live?",
        answer:
          "Afhankelijk van het pakket en de scope is je website doorgaans binnen enkele weken live. We houden je tijdens het traject op de hoogte.",
      },
      {
        question: "Moet ik zelf technische kennis hebben?",
        answer:
          "Nee. Wij regelen design, bouw, hosting en oplevering. Jij levert content en feedback.",
      },
      {
        question: "Kan ik later uitbreiden?",
        answer:
          "Ja. Veel klanten starten met een basiswebsite en voegen later boekingen, reviews of koppelingen toe.",
      },
    ],
  },

  boekingskalender: {
    recommendedPlans: ["Groei", "Pro"],
    pricingTeaser:
      "Boekingskalender en automatiseringen zitten vanaf Groei in het pakket. Bekijk wat het beste bij je past.",
    sections: [
      {
        title: "Online boeken, 24 uur per dag",
        paragraphs: [
          "Klanten willen zelf een afspraak plannen wanneer het hen uitkomt: 's avonds, in het weekend of tussen andere taken door. Met een boekingskalender op je website hoef jij niet meer heen en weer te bellen of e-mailen.",
          "Nexavo koppelt een professioneel boekingssysteem aan je site. Klanten kiezen dienst, datum en tijd. Jij houdt overzicht in je agenda.",
        ],
      },
      {
        title: "Hoe de boekingskalender werkt",
        paragraphs: [
          "Bezoekers zien direct welke momenten beschikbaar zijn. Na het boeken ontvangen zij automatisch een bevestiging. Jij krijgt een melding en de afspraak staat in je agenda.",
        ],
        bullets: [
          "Klant kiest dienst en tijdslot op je website",
          "Automatische bevestiging per e-mail",
          "Herinnering vóór de afspraak (minder no-shows)",
          "Synchronisatie met Google Calendar, Outlook of Calendly",
        ],
      },
      {
        title: "Voor welke bedrijven dit ideaal is",
        paragraphs: [
          "Elke ondernemer die afspraken plant profiteert van online boeken, van salons en coaches tot consultants en therapeuten.",
        ],
        bullets: [
          "Kappers, salons, beauty & wellness",
          "Coaches, consultants & trainers",
          "Therapeuten & zorgverleners",
          "Dienstverlenend MKB met intakegesprekken",
        ],
      },
      {
        title: "Koppelingen & automatisering",
        paragraphs: [
          "Een boeking is vaak het startpunt van meer automatisering: reviewverzoek na afloop, opvolgmail of CRM-update. Alles loopt door zonder handmatig werk.",
        ],
      },
    ],
    steps: [
      {
        step: "01",
        title: "Inventarisatie",
        description:
          "We brengen je diensten, duur, beschikbaarheid en bestaande agenda in kaart.",
      },
      {
        step: "02",
        title: "Inrichten & koppelen",
        description:
          "We koppelen Calendly, Microsoft Bookings of een vergelijkbaar systeem en plaatsen het netjes op je site.",
      },
      {
        step: "03",
        title: "Flows instellen",
        description:
          "Bevestigingen, herinneringen en eventuele opvolgacties worden ingericht en getest.",
      },
      {
        step: "04",
        title: "Live & begeleiding",
        description:
          "Je ontvangt een korte uitleg en we blijven beschikbaar via onderhoud en support.",
      },
    ],
    extraBlocks: [
      {
        title: "Ondersteunde boekingssystemen",
        description: "We werken met tools die je team waarschijnlijk al kent:",
        items: [
          "Calendly",
          "Microsoft Bookings",
          "Google Calendar",
          "SimplyBook, Fresha, Booksy & meer op aanvraag",
        ],
      },
    ],
    faqs: [
      {
        question: "Kunnen klanten ook buiten kantooruren boeken?",
        answer: "Ja. Je website en boekingskalender zijn 24/7 beschikbaar.",
      },
      {
        question: "Gaat dit samen met mijn bestaande agenda?",
        answer:
          "In de meeste gevallen wel. We synchroniseren met Google Calendar, Outlook of je boekingstool.",
      },
      {
        question: "Helpt dit tegen no-shows?",
        answer:
          "Automatische herinneringen verlagen no-shows aanzienlijk. Klanten krijgen tijdig een reminder.",
      },
    ],
  },

  "review-management": {
    recommendedPlans: ["Groei", "Pro"],
    pricingTeaser:
      "Review management is onderdeel van Groei en Pro. Bekijk de pakketten en prijzen.",
    sections: [
      {
        title: "Meer reviews, betere reputatie",
        paragraphs: [
          "Positieve reviews zijn goud waard voor vertrouwen en vindbaarheid. Toch is het lastig om klanten handmatig te blijven vragen. Nexavo automatiseert dat proces volledig.",
          "24 uur na elke afspraak ontvangt je klant automatisch een reviewverzoek via e-mail, SMS of WhatsApp. Jij hoeft er niets voor te doen.",
        ],
      },
      {
        title: "Hoe review management werkt",
        paragraphs: [
          "Het systeem wacht tot de afspraak voorbij is en stuurt dan een persoonlijk verzoek. Positieve reviews kun je direct op je website tonen. Negatieve feedback vang je eerst intern op, zodat je rustig kunt reageren.",
        ],
        bullets: [
          "Automatisch reviewverzoek na afspraak of bezoek",
          "Keuze uit e-mail, SMS of WhatsApp",
          "Positieve reviews op je website",
          "Negatieve feedback eerst intern afhandelen",
          "Meer social proof zonder extra werk",
        ],
      },
      {
        title: "Waarom timing en opvolging belangrijk zijn",
        paragraphs: [
          "Klanten geven vaker een review als je op het juiste moment vraagt, kort na een goede ervaring. Te laat of handmatig vragen levert minder op. Automatisering zorgt voor consistentie.",
        ],
      },
      {
        title: "Combinatie met boekingen",
        paragraphs: [
          "Review management werkt het best in combinatie met een boekingskalender: na elke afspraak start de flow automatisch. Geen losse lijsten, geen vergeten opvolging.",
        ],
      },
    ],
    steps: [
      {
        step: "01",
        title: "Trigger instellen",
        description:
          "We koppelen reviewverzoeken aan afspraken, boekingen of andere momenten in je flow.",
      },
      {
        step: "02",
        title: "Kanaal & tekst",
        description:
          "Jij kiest e-mail, SMS of WhatsApp. We schrijven een passende, vriendelijke tekst.",
      },
      {
        step: "03",
        title: "Publicatie & filtering",
        description:
          "Positieve reviews verschijnen op je site. Negatieve feedback komt eerst bij jou binnen.",
      },
      {
        step: "04",
        title: "Optimaliseren",
        description:
          "We monitoren resultaten en stellen timing of teksten bij waar nodig.",
      },
    ],
    faqs: [
      {
        question: "Kunnen negatieve reviews op mijn site komen?",
        answer:
          "Jij bepaalt wat gepubliceerd wordt. Negatieve feedback kun je eerst intern afhandelen.",
      },
      {
        question: "Werkt dit ook zonder boekingssysteem?",
        answer:
          "Ja, via andere triggers zoals formulieren of handmatige imports. Ideaal is koppeling met boekingen.",
      },
      {
        question: "Welke kanalen ondersteunen jullie?",
        answer: "E-mail, SMS en WhatsApp, afhankelijk van je pakket en wensen.",
      },
    ],
  },

  automatiseringen: {
    recommendedPlans: ["Groei", "Pro", "Maatwerk"],
    pricingTeaser:
      "Automatiseringen zitten in Groei en Pro, of los via Maatwerk. Vergelijk de pakketten.",
    sections: [
      {
        title: "Minder handwerk, meer focus op klanten",
        paragraphs: [
          "Veel ondernemers verliezen uren aan hetzelfde werk: formulieren overtypen, bevestigingen sturen, leads opvolgen. Automatiseringen koppelen al die stappen aan elkaar.",
          "Een actie op je website, zoals een formulier, boeking of betaling, kan automatisch vervolgstappen starten in je e-mail, agenda, CRM of WhatsApp.",
        ],
      },
      {
        title: "Voorbeelden van automatiseringen",
        paragraphs: [
          "Elk bedrijf heeft andere processen. Dit zijn veelvoorkomende flows die wij inrichten:",
        ],
        bullets: [
          "Formulier ingevuld → bevestigingsmail + notificatie naar jou",
          "Boeking geplaatst → agenda-update + herinnering + reviewverzoek na afloop",
          "Lead binnen → opvolgmail of CRM-entry",
          "Betaling ontvangen → factuur of bedankmail",
          "Review ontvangen → publicatie op website of interne alert",
        ],
      },
      {
        title: "Tools waarmee we werken",
        paragraphs: [
          "We koppelen met de tools die je al gebruikt, of stellen een stack voor die bij je past.",
        ],
        bullets: [
          "Zapier, Make (Integromat) & n8n",
          "E-mail: Mailchimp, Brevo, MailerLite",
          "Agenda & boekingen: Calendly, Microsoft Bookings",
          "WhatsApp Business & formulieren",
        ],
      },
    ],
    steps: [
      {
        step: "01",
        title: "Proces in kaart",
        description: "We brengen samen je huidige stappen en knelpunten in kaart.",
      },
      {
        step: "02",
        title: "Flow ontwerpen",
        description: "We tekenen de gewenste automatisering uit, helder en testbaar.",
      },
      {
        step: "03",
        title: "Bouwen & koppelen",
        description: "Nexavo bouwt de workflows en koppelt ze aan je website en tools.",
      },
      {
        step: "04",
        title: "Testen & live",
        description: "Alles wordt getest voordat het live gaat. Geen verrassingen achteraf.",
      },
    ],
    faqs: [
      {
        question: "Heb ik technische kennis nodig?",
        answer: "Nee. Wij ontwerpen, bouwen en onderhouden de flows. Jij focust op je bedrijf.",
      },
      {
        question: "Kan ik later flows toevoegen?",
        answer: "Ja. We bouwen modulair, zodat uitbreiden eenvoudig blijft.",
      },
    ],
  },

  integraties: {
    recommendedPlans: ["Start", "Groei", "Pro"],
    pricingTeaser:
      "Basis-koppelingen zitten in Start; uitgebreidere koppelingen vanaf Groei. Bekijk alle pakketten.",
    sections: [
      {
        title: "Al je tools, één werkende flow",
        paragraphs: [
          "Je website staat niet op zichzelf. Analytics, betalingen, agenda's, e-mail en marketingtools moeten samenwerken. Nexavo zorgt dat koppelingen correct zijn geïnstalleerd en getest.",
        ],
      },
      {
        title: "Soorten koppelingen",
        paragraphs: ["We ondersteunen meer dan 50 koppelingen, waaronder:"],
        bullets: [
          "Agenda & boekingen (Calendly, Microsoft Bookings, …)",
          "Betalingen (Mollie, Stripe, PayPal, …)",
          "Analytics & pixels (Google Analytics, Meta Pixel, …)",
          "E-mail & marketing (Mailchimp, Brevo, …)",
          "Formulieren (Typeform, Jotform, Tally, …)",
          "Automatisering (Zapier, Make, n8n)",
        ],
      },
    ],
    steps: [
      {
        step: "01",
        title: "Inventarisatie",
        description: "Welke tools gebruik je al en wat moet met je site praten?",
      },
      {
        step: "02",
        title: "Installatie",
        description: "We plaatsen tags, pixels, widgets en API-koppelingen correct.",
      },
      {
        step: "03",
        title: "Test",
        description: "We doorlopen de volledige keten: klik → actie → resultaat.",
      },
    ],
    faqs: [
      {
        question: "Staat mijn tool er niet tussen?",
        answer:
          "Via Maatwerk kijken we naar maatwerk-koppelingen. Neem contact op voor de mogelijkheden.",
      },
    ],
  },

  "hosting-onderhoud": {
    recommendedPlans: ["Basis Beheer", "Plus Beheer", "Growth Beheer"],
    pricingTeaser:
      "Onderhoud & support staan los van websitepakketten. Bekijk de onderhoudspakketten op de prijzenpagina.",
    sections: [
      {
        title: "Betrouwbaar online blijven",
        paragraphs: [
          "Een website is nooit 'af'. Hosting, beveiliging, back-ups, bereikbaarheid en kleine wijzigingen horen bij het dagelijkse beheer van een professionele website.",
          "Met Nexavo hosting & onderhoud blijft je site technisch verzorgd, veilig bereikbaar en up-to-date. Je hebt één plek voor support, revisies en vragen over je website.",
        ],
        bullets: [
          "Hosting- en serverbeheer",
          "SSL-certificaat en basisbeveiliging",
          "Basiscontrole op bereikbaarheid",
          "Periodieke back-ups waar technisch mogelijk",
          "Support via klantportaal of support@nexavo.nl",
        ],
      },
      {
        title: "Revisies: kleine wijzigingen aan bestaande onderdelen",
        paragraphs: [
          "Een revisie is een kleine wijziging aan iets wat al op je website bestaat. Denk aan een tekstregel aanpassen, openingstijden wijzigen, een foto vervangen, een knop of link aanpassen of een kleine fout herstellen.",
          "Zo blijft je website actueel zonder dat elke kleine aanpassing een nieuw project wordt. Per onderhoudspakket spreken we af hoeveel revisies en verwerkingstijd per maand inbegrepen zijn.",
        ],
        bullets: [
          "Kopregel, korte tekst of contactgegevens aanpassen",
          "Foto's vervangen of beperkt beeldmateriaal toevoegen",
          "Aangeleverd blogartikel of eenvoudige video-embed plaatsen",
          "Kleine bedrijfsupdate of typefout verwerken",
          "Bestaand websiteblok licht aanpassen zonder nieuw ontwerp",
        ],
      },
      {
        title: "Wat onder meerwerk valt",
        paragraphs: [
          "Sommige verzoeken zijn groter dan onderhoud. Nieuwe pagina's, nieuwe secties, nieuwe functionaliteit, API-koppelingen, automatiseringen, AI-chatbots, volledige herschrijvingen of spoedwerk behandelen we als meerwerk.",
          "We starten pas met meerwerk nadat je akkoord hebt gegeven op een kosteninschatting of offerte. Voor grotere werkzaamheden kunnen we ook een vaste prijs afspreken.",
        ],
        bullets: [
          "Nieuwe pagina, landingspagina of sectie bouwen",
          "Nieuwe kalender, boekingssysteem of reviewflow volledig instellen",
          "API-koppelingen, automatiseringen of AI-chatbots bouwen",
          "Blogs schrijven, SEO-teksten schrijven of volledige pagina's herschrijven",
          "Spoedwerk of werk veroorzaakt door externe partijen",
        ],
      },
      {
        title: "Klantportaal, support en verwerking",
        paragraphs: [
          "Revisieverzoeken lopen bij voorkeur via het Nexavo klantportaal. Als dat nog niet beschikbaar is, kun je mailen naar support@nexavo.nl met je klantnummer en bedrijfsnaam.",
          "Bij elk verzoek ontvang je een bevestiging. Daarna beoordelen we of het verzoek binnen je pakket valt, aanvullende input nodig heeft of als meerwerk voorgesteld moet worden.",
        ],
        bullets: [
          "Overzicht van je website, pakket, revisies en facturen",
          "Nieuwe verzoeken indienen en openstaande verzoeken volgen",
          "Statussen zoals ingediend, ingepland, in behandeling en afgerond",
          "Heldere beoordeling: inbegrepen, wacht op klant of buiten scope",
        ],
      },
    ],
    extraBlocks: [
      {
        title: "Onderhoudspakketten in het kort",
        description:
          "Na oplevering kies je een beheerbasis die past bij hoe actief je website is:",
        items: [
          "Basis Beheer: voor eenvoudige websites met beperkte maandelijkse wijzigingen",
          "Plus Beheer: voor klanten die vaker kleine wijzigingen willen en sneller geholpen willen worden",
          "Growth Beheer: voor actievere websites met meer content, wijzigingen en aanvullende modules",
          "Niet-gebruikte revisies of tijd worden niet meegenomen naar een volgende maand",
        ],
      },
      {
        title: "Looptijd en wijzigingen in je pakket",
        description:
          "Onderhoud is bedoeld voor continuïteit. Daarom werken we met duidelijke afspraken over looptijd en pakketwijzigingen.",
        items: [
          "Basis Beheer is de minimale beheerbasis zolang Nexavo technisch beheert, host of onderhoudt",
          "Voor onderhoudspakketten geldt een minimale looptijd van 12 maanden",
          "Upgraden kan op elk moment vanaf de eerstvolgende factuurperiode",
          "Start je met Plus of Growth, dan kun je binnen de eerste 3 maanden downgraden",
        ],
      },
    ],
    steps: [
      {
        step: "01",
        title: "Beheerbasis kiezen",
        description:
          "We bepalen welk onderhoudspakket past bij je website, verwachte wijzigingen en gewenste supportniveau.",
      },
      {
        step: "02",
        title: "Techniek inrichten",
        description:
          "Hosting, SSL, basisbeveiliging, bereikbaarheid en back-ups worden ingericht en gecontroleerd.",
      },
      {
        step: "03",
        title: "Revisies verwerken",
        description:
          "Kleine wijzigingen worden beoordeeld, ingepland en verwerkt binnen de afspraken van je pakket.",
      },
      {
        step: "04",
        title: "Support & doorontwikkeling",
        description:
          "We blijven bereikbaar voor support en adviseren wanneer een verzoek beter als meerwerk of uitbreiding past.",
      },
    ],
    faqs: [
      {
        question: "Zit hosting in elk websitepakket?",
        answer:
          "Hosting en SSL zitten in onze websitepakketten. Onderhoud kies je apart.",
      },
      {
        question: "Wat is precies een revisie?",
        answer:
          "Een revisie is een kleine wijziging aan iets wat al bestaat, zoals tekst, openingstijden, een foto, link, knop of kleine fout. Nieuwe onderdelen of functionaliteit vallen onder meerwerk.",
      },
      {
        question: "Kan ik ongebruikte revisies meenemen?",
        answer:
          "Nee. Niet-gebruikte revisies of niet-gebruikte verwerkingstijd worden niet meegenomen naar een volgende maand.",
      },
      {
        question: "Wanneer wordt iets meerwerk?",
        answer:
          "Nieuwe pagina's, nieuwe secties, nieuwe functionaliteit, API-koppelingen, automatiseringen, volledige herschrijvingen en spoedwerk vallen buiten standaard revisies.",
      },
    ],
  },

  "content-seo": {
    recommendedPlans: ["Start", "Groei", "Pro"],
    pricingTeaser:
      "Content en SEO-basis maken deel uit van onze websitepakketten. Bekijk wat inbegrepen is.",
    sections: [
      {
        title: "Gevonden worden én overtuigen",
        paragraphs: [
          "Goede teksten doen dubbel werk: ze helpen je scoren in Google én zetten bezoekers aan tot actie. Wij schrijven en structureren content die past bij jouw merk.",
        ],
      },
      {
        title: "Wat we leveren",
        paragraphs: [],
        bullets: [
          "Website copywriting (home, diensten, over ons)",
          "SEO-titels, meta-descriptions & structuur",
          "Landingspagina's voor campagnes",
          "Interne links en heldere paginahierarchie",
        ],
      },
    ],
    steps: [
      {
        step: "01",
        title: "Doelgroep & zoekwoorden",
        description: "We bepalen waar je op gevonden wilt worden.",
      },
      {
        step: "02",
        title: "Schrijven & structureren",
        description: "Teksten en pagina-opbouw worden uitgewerkt.",
      },
      {
        step: "03",
        title: "Implementatie",
        description: "Alles komt live op je site, technisch correct ingericht.",
      },
    ],
    faqs: [
      {
        question: "Schrijven jullie alles of lever ik teksten aan?",
        answer:
          "Beide kan. We schrijven volledig, of werken jouw input uit tot professionele copy.",
      },
    ],
  },
};

export type ServiceDetail = Service & ServiceDetailContent;

export const getServiceDetail = (slug: string): ServiceDetail | undefined => {
  const base = getServiceBySlug(slug);
  const detail = serviceDetails[slug];
  if (!base || !detail) return undefined;
  return { ...base, ...detail };
};
