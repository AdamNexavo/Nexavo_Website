import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  CreditCard,
  Headphones,
  Layers,
  Plug,
  Rocket,
  Server,
  Star,
  Workflow,
} from "lucide-react";

export type KnowledgeArticle = {
  id: string;
  question: string;
  answer: string;
  popular?: boolean;
};

export type KnowledgeCategory = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  articles: KnowledgeArticle[];
};

export const knowledgeCategories: KnowledgeCategory[] = [
  {
    id: "aan-de-slag",
    title: "Aan de slag",
    description: "Alles over starten met Nexavo, verwachtingen en eerste stappen.",
    icon: Rocket,
    articles: [
      {
        id: "start-1",
        question: "Wat hebben jullie van mij nodig om te starten?",
        answer:
          "Vooral je wensen, merkinformatie en content zoals teksten en foto's. Wij regelen design, techniek, hosting en oplevering. Tijdens het traject begeleiden we je stap voor stap.",
        popular: true,
      },
      {
        id: "start-2",
        question: "Heb ik technische kennis nodig?",
        answer:
          "Nee, absoluut niet. Wij regelen alles: van design tot hosting en automatiseringen. Jij hoeft alleen content aan te leveren en feedback te geven. Ook bij flows en koppelingen ontwerpen, bouwen en onderhouden wij alles.",
        popular: true,
      },
      {
        id: "start-3",
        question: "Hoe werkt jullie werkwijze na het kiezen van een pakket?",
        answer:
          "We starten met een demo en persoonlijk advies. Daarin bespreken we je doelen, wensen en situatie. Nexavo vertaalt dat naar een professionele website en de juiste automatiseringen via onze vaste Blueprint-workflow. Jij houdt regie, wij regelen ontwerp, bouw, inrichting en oplevering.",
      },
      {
        id: "start-4",
        question: "Hoe snel kan mijn website live?",
        answer:
          "Afhankelijk van het pakket en de complexiteit is je website binnen 7 tot 10 dagen live na complete input. Voor Funnel, Start en Groei geldt oplevering binnen 7 dagen. Pro heeft prioriteit en wordt binnen 7 tot 10 dagen opgeleverd. We houden je gedurende het hele proces op de hoogte.",
        popular: true,
      },
      {
        id: "start-5",
        question: "Zijn er verborgen kosten?",
        answer:
          "Nee, al onze pakketten zijn all-inclusive. Hosting, SSL-certificaat en de basisoplevering zitten in de prijs. Maandelijks onderhoud kies je apart via de onderhoudspakketten. Geen verrassingen achteraf.",
      },
      {
        id: "start-6",
        question: "Wat als ik niet tevreden ben?",
        answer:
          "We werken net zo lang door tot je 100% tevreden bent. In het onwaarschijnlijke geval dat we er niet uitkomen, krijg je je geld terug.",
      },
      {
        id: "start-7",
        question: "Kan ik later uitbreiden met automatiseringen?",
        answer:
          "Ja. Veel klanten starten met een website en breiden later uit met review management, boekingen of koppelingen. We bouwen je platform modulair op, zodat uitbreiden zonder alles opnieuw te doen meestal goed mogelijk is.",
      },
      {
        id: "start-8",
        question: "Is mijn website ook goed op mobiel?",
        answer:
          "Ja. Elke website die wij bouwen is volledig responsive en geoptimaliseerd voor mobiel, tablet en desktop. Zo ziet je site er overal professioneel uit en werkt alles soepel.",
      },
    ],
  },
  {
    id: "pakketten-prijzen",
    title: "Pakketten & prijzen",
    description: "Vergelijk pakketten, prijzen en wat er wel of niet bij zit.",
    icon: CreditCard,
    articles: [
      {
        id: "pricing-1",
        question: "Welk pakket past het beste bij mij?",
        answer:
          "Funnel / One-page is ideaal voor één conversiegerichte pagina. Start geeft je een complete basiswebsite. Groei voegt boekingen en reviews toe. Pro combineert website, AI-chatbot en uitgebreide automatisering. Maatwerk is voor specifieke combinaties buiten de standaardpakketten.",
        popular: true,
      },
      {
        id: "pricing-2",
        question: "Zijn de prijzen inclusief btw?",
        answer:
          "Nee. Alle websitepakketten zijn eenmalige prijzen exclusief btw. Maandelijks onderhoud staat los van deze pakketten en kies je apart via de onderhoudspakketten op de prijzenpagina.",
      },
      {
        id: "pricing-3",
        question: "Kan ik later upgraden naar een groter pakket?",
        answer:
          "Ja. Veel klanten starten met Funnel, Start of Groei en breiden later uit. We bouwen je website en automatiseringen modulair op, zodat uitbreiden zonder alles opnieuw te doen meestal goed mogelijk is.",
      },
      {
        id: "pricing-4",
        question: "Is onderhoud verplicht?",
        answer:
          "Zolang Nexavo je website technisch beheert, host of onderhoudt, is Basis Beheer minimaal verplicht. Je kunt kiezen uit drie onderhoudspakketten: Basis (€59), Plus (€99) of Growth (€199) per maand exclusief btw.",
      },
      {
        id: "pricing-5",
        question: "Kan ik ook alleen automatiseringen afnemen?",
        answer:
          "Ja, via Maatwerk. Denk aan een funnel met alleen boekingskalender, een losse AI-chatbot op een bestaande website of alleen automatiseringen zonder volledige website. Neem contact op en we stellen samen de juiste combinatie.",
      },
      {
        id: "pricing-6",
        question: "Bouwen jullie ook webshops?",
        answer:
          "Nexavo focust op professionele websites met automatiseringen, geen webshops. Zo houden we oplevering snel, strak en schaalbaar. Heb je online verkopen nodig, dan bespreken we graag welke alternatieven passen.",
      },
    ],
  },
  {
    id: "websites",
    title: "Websites",
    description: "Vragen over design, bouw, content en uitbreiding van je website.",
    icon: Layers,
    articles: [
      {
        id: "web-1",
        question: "Welke type websites bouwen jullie?",
        answer:
          "We bouwen conversiegerichte funnels en one-pagers, complete bedrijfswebsites met meerdere pagina's, landingspagina's voor campagnes en uitbreidbare bases die later groeien met boekingen, reviews of koppelingen.",
      },
      {
        id: "web-2",
        question: "Moet ik zelf technische kennis hebben?",
        answer:
          "Nee. Wij regelen design, bouw, hosting en oplevering. Jij levert content en feedback.",
      },
      {
        id: "web-3",
        question: "Kan ik later uitbreiden?",
        answer:
          "Ja. Veel klanten starten met een basiswebsite en voegen later boekingen, reviews of koppelingen toe.",
      },
      {
        id: "web-4",
        question: "Schrijven jullie alles of lever ik teksten aan?",
        answer:
          "Beide kan. We schrijven volledig, of werken jouw input uit tot professionele copy die past bij je merk en doelgroep.",
      },
    ],
  },
  {
    id: "boekingen",
    title: "Boekingen & agenda",
    description: "Online afspraken plannen, agenda-koppelingen en no-shows voorkomen.",
    icon: Calendar,
    articles: [
      {
        id: "book-1",
        question: "Hoe werkt het online boekingssysteem?",
        answer:
          "Klanten boeken zelf een afspraak via jouw website, op elk moment van de dag. Bevestigingen en herinneringen gaan automatisch uit, zodat jij minder handmatig werk hebt en minder no-shows krijgt.",
        popular: true,
      },
      {
        id: "book-2",
        question: "Kunnen jullie mijn boekingen automatiseren?",
        answer:
          "Ja. Vanaf Groei koppelen we een boekingskalender of Calendly, zodat klanten zelf online kunnen plannen. In Pro breiden we dit uit met geavanceerde workflows en opvolging.",
      },
      {
        id: "book-3",
        question: "Kunnen klanten ook buiten kantooruren boeken?",
        answer: "Ja. Je website en boekingskalender zijn 24/7 beschikbaar.",
      },
      {
        id: "book-4",
        question: "Gaat dit samen met mijn bestaande agenda?",
        answer:
          "In de meeste gevallen wel. We synchroniseren met Google Calendar, Outlook of je boekingstool.",
      },
      {
        id: "book-5",
        question: "Helpt dit tegen no-shows?",
        answer:
          "Automatische herinneringen verlagen no-shows aanzienlijk. Klanten krijgen tijdig een reminder per e-mail of SMS.",
      },
    ],
  },
  {
    id: "reviews",
    title: "Reviews & reputatie",
    description: "Automatisch reviews verzamelen en je online reputatie beheren.",
    icon: Star,
    articles: [
      {
        id: "rev-1",
        question: "Hoe werkt het review management systeem?",
        answer:
          "24 uur na elke afspraak ontvangen je klanten automatisch een reviewverzoek via e-mail, SMS of WhatsApp. Positieve reviews worden direct gepubliceerd, negatieve feedback kun je eerst intern afhandelen.",
        popular: true,
      },
      {
        id: "rev-2",
        question: "Kunnen jullie reviews automatisch opvolgen?",
        answer:
          "Ja. Reviewmanagement is onderdeel van Groei (basis) en Pro (uitgebreid). Klanten ontvangen na een afspraak automatisch een reviewverzoek, zodat jij minder handmatig hoeft op te volgen.",
      },
      {
        id: "rev-3",
        question: "Kunnen negatieve reviews op mijn site komen?",
        answer:
          "Jij bepaalt wat gepubliceerd wordt. Negatieve feedback kun je eerst intern afhandelen voordat iets zichtbaar wordt.",
      },
      {
        id: "rev-4",
        question: "Werkt dit ook zonder boekingssysteem?",
        answer:
          "Ja, via andere triggers zoals formulieren of handmatige imports. Ideaal is koppeling met boekingen voor een volledig geautomatiseerd proces.",
      },
      {
        id: "rev-5",
        question: "Welke kanalen ondersteunen jullie voor reviewverzoeken?",
        answer: "E-mail, SMS en WhatsApp, afhankelijk van je pakket en wensen.",
      },
    ],
  },
  {
    id: "automatiseringen",
    title: "Automatiseringen",
    description: "Workflows, triggers en minder handmatig werk in je bedrijfsprocessen.",
    icon: Workflow,
    articles: [
      {
        id: "auto-1",
        question: "Wat zijn automatiseringen precies?",
        answer:
          "Een actie op je website, zoals een formulier, boeking of betaling, kan automatisch vervolgstappen starten in je e-mail, agenda, CRM of WhatsApp. Zo hoef je minder handmatig over te typen, bevestigen en opvolgen.",
      },
      {
        id: "auto-2",
        question: "Kan ik later flows toevoegen?",
        answer: "Ja. We bouwen modulair, zodat uitbreiden eenvoudig blijft wanneer je bedrijf groeit.",
      },
      {
        id: "auto-3",
        question: "Welke processen kunnen jullie automatiseren?",
        answer:
          "Denk aan formulieropvolging, boekingsbevestigingen, reviewverzoeken, e-mailflows, lead-opvolging en koppelingen tussen tools die je al gebruikt.",
      },
    ],
  },
  {
    id: "koppelingen",
    title: "Koppelingen & integraties",
    description: "Tools koppelen aan je website en alles in één flow laten samenwerken.",
    icon: Plug,
    articles: [
      {
        id: "int-1",
        question: "Kunnen jullie koppelen met tools die ik al gebruik?",
        answer:
          "In veel gevallen wel. We koppelen onder andere met agenda's, e-mail, WhatsApp, analytics, betalingen en marketingtools. Staat jouw tool er niet tussen? Dan kijken we samen naar maatwerk.",
        popular: true,
      },
      {
        id: "int-2",
        question: "Staat mijn tool er niet tussen?",
        answer:
          "Via Maatwerk kijken we naar maatwerk-koppelingen en API-integraties. Neem contact op voor de mogelijkheden.",
      },
      {
        id: "int-3",
        question: "Welke soorten koppelingen ondersteunen jullie?",
        answer:
          "Agenda en boekingen (Calendly, Microsoft Bookings), betalingen (Mollie, Stripe, PayPal), analytics en pixels (Google Analytics, Meta Pixel), e-mail en marketing (Mailchimp, Brevo) en communicatie (WhatsApp Business).",
      },
    ],
  },
  {
    id: "hosting-onderhoud",
    title: "Hosting & onderhoud",
    description: "Beheer, revisies, back-ups en support voor je live website.",
    icon: Server,
    articles: [
      {
        id: "host-1",
        question: "Zit hosting in elk websitepakket?",
        answer:
          "Hosting en SSL zitten in onze websitepakketten. Onderhoud kies je apart via de onderhoudspakketten.",
      },
      {
        id: "host-2",
        question: "Wat is precies een revisie?",
        answer:
          "Een revisie is een kleine wijziging aan iets wat al bestaat, zoals tekst, openingstijden, een foto, link, knop of kleine fout. Nieuwe onderdelen of functionaliteit vallen onder meerwerk.",
      },
      {
        id: "host-3",
        question: "Kan ik ongebruikte revisies meenemen?",
        answer:
          "Nee. Niet-gebruikte revisies of niet-gebruikte verwerkingstijd worden niet meegenomen naar een volgende maand.",
      },
      {
        id: "host-4",
        question: "Wanneer wordt iets meerwerk?",
        answer:
          "Nieuwe pagina's, nieuwe secties, nieuwe functionaliteit, API-koppelingen, automatiseringen, AI-chatbots, volledige herschrijvingen en spoedwerk vallen buiten standaard revisies.",
      },
    ],
  },
  {
    id: "contact-support",
    title: "Contact & support",
    description: "Bereikbaarheid, demo's, support en samenwerking met Nexavo.",
    icon: Headphones,
    articles: [
      {
        id: "sup-1",
        question: "Hoe kan ik Nexavo bereiken bij vragen?",
        answer:
          "Je kunt ons bellen op +31 6 12 34 56 78 (maandag t/m vrijdag, 09:00 tot 17:00), mailen naar info@nexavo.works of support@nexavo.works, of het contactformulier gebruiken. Bestaande klanten kunnen ook inloggen op het klantportaal.",
        popular: true,
      },
      {
        id: "sup-2",
        question: "Is een demo echt gratis?",
        answer:
          "Ja. Een kennismaking of demo is volledig vrijblijvend. We laten je zien wat past bij jouw situatie, zonder verplichtingen.",
      },
      {
        id: "sup-3",
        question: "Wat moet ik meenemen naar een eerste gesprek?",
        answer:
          "Een korte omschrijving van je bedrijf, je doelen en eventueel voorbeelden van websites of tools die je aanspreken. Verder regelen wij de rest.",
      },
      {
        id: "sup-4",
        question: "Kan ik ook bellen in plaats van mailen?",
        answer:
          "Ja. Laat via het formulier weten dat je liever belt. We plannen dan een kort belmoment in zodat je niet naar een voicemail hoeft te luisteren.",
      },
      {
        id: "sup-5",
        question: "Ik ben al klant. Waar meld ik support?",
        answer:
          "Gebruik het klantportaal (/portal/login) of mail naar support@nexavo.works met je klantnummer en bedrijfsnaam. Zo kunnen we je sneller helpen.",
      },
      {
        id: "sup-6",
        question: "Werken jullie alleen in Nederland?",
        answer:
          "We werken voornamelijk met Nederlandse ondernemers, maar ondersteunen ook internationale klanten die een Nederlandstalige of meertalige website zoeken.",
      },
    ],
  },
];

export const allKnowledgeArticles = knowledgeCategories.flatMap((category) =>
  category.articles.map((article) => ({
    ...article,
    categoryId: category.id,
    categoryTitle: category.title,
  })),
);

export const popularArticles = allKnowledgeArticles.filter((article) => article.popular);

export const knowledgeBaseStats = {
  categories: knowledgeCategories.length,
  articles: allKnowledgeArticles.length,
};

export const getCategoryById = (id: string) =>
  knowledgeCategories.find((category) => category.id === id);

export const searchKnowledgeBase = (query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return allKnowledgeArticles;

  return allKnowledgeArticles.filter(
    (article) =>
      article.question.toLowerCase().includes(normalized) ||
      article.answer.toLowerCase().includes(normalized) ||
      article.categoryTitle.toLowerCase().includes(normalized),
  );
};
