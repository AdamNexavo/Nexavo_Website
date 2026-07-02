import { Link } from "react-router-dom";
import type { LegalSection } from "@/components/legal/LegalPageLayout";
import { contactInfo } from "@/data/contact";

const contactEmail = (
  <a href={`mailto:${contactInfo.primaryEmail}`} className="font-medium text-primary hover:underline">
    {contactInfo.primaryEmail}
  </a>
);

const privacyLink = (
  <Link to="/privacy" className="font-medium text-primary hover:underline">
    privacyverklaring
  </Link>
);

export const privacySections: LegalSection[] = [
  {
    id: "wie-zijn-wij",
    title: "1. Wie zijn wij?",
    paragraphs: [
      <>
        Nexavo is een Nederlands bedrijf dat websites, webshops, koppelingen en online
        automatiseringen levert aan ondernemers en organisaties. In deze privacyverklaring
        leggen we uit welke persoonsgegevens we verzamelen, waarom we dat doen en welke
        rechten je hebt op grond van de Algemene Verordening Gegevensbescherming (AVG).
      </>,
      <>
        <strong className="font-semibold text-foreground">Contactgegevens</strong>
        <br />
        Nexavo
        <br />
        {contactInfo.address.city}, {contactInfo.address.country}
        <br />
        E-mail: {contactEmail}
        <br />
        Telefoon: {contactInfo.primaryPhone}
      </>,
    ],
  },
  {
    id: "welke-gegevens",
    title: "2. Welke gegevens verwerken we?",
    paragraphs: [
      "We kunnen de volgende categorieën persoonsgegevens verwerken, afhankelijk van hoe je Nexavo gebruikt:",
      <>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-medium text-foreground">Contact- en accountgegevens</strong>{" "}
            zoals naam, bedrijfsnaam, e-mailadres, telefoonnummer en factuurgegevens.
          </li>
          <li>
            <strong className="font-medium text-foreground">Project- en inhoudsgegevens</strong>{" "}
            die je met ons deelt voor het bouwen of beheren van je website, zoals teksten,
            afbeeldingen, logo&apos;s en voorkeuren.
          </li>
          <li>
            <strong className="font-medium text-foreground">Technische gegevens</strong> zoals
            IP-adres, browsertype, apparaatinformatie en loggegevens bij het gebruik van onze
            website of klantportaal.
          </li>
          <li>
            <strong className="font-medium text-foreground">Communicatie</strong> via e-mail,
            contactformulieren, supporttickets of telefonisch contact.
          </li>
          <li>
            <strong className="font-medium text-foreground">Betaalgegevens</strong> die via onze
            betaalprovider worden verwerkt. Nexavo slaat geen volledige creditcardgegevens op.
          </li>
        </ul>
      </>,
    ],
  },
  {
    id: "doeleinden",
    title: "3. Waarvoor gebruiken we je gegevens?",
    paragraphs: [
      <>
        <ul className="list-disc space-y-2 pl-5">
          <li>Het uitvoeren van onze diensten en het beheren van je account of project.</li>
          <li>Contact opnemen naar aanleiding van een aanvraag, demo of supportvraag.</li>
          <li>Facturatie, administratie en naleving van wettelijke verplichtingen.</li>
          <li>Het verbeteren van onze website, dienstverlening en gebruikerservaring.</li>
          <li>
            Het versturen van serviceberichten of, met jouw toestemming, marketing over Nexavo.
          </li>
          <li>Het beveiligen van onze systemen en het voorkomen van misbruik of fraude.</li>
        </ul>
      </>,
    ],
  },
  {
    id: "rechtsgrond",
    title: "4. Rechtsgrond voor verwerking",
    paragraphs: [
      "We verwerken persoonsgegevens op basis van een of meer van de volgende grondslagen:",
      <>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-medium text-foreground">Uitvoering van een overeenkomst</strong>{" "}
            wanneer je klant bent of een offerte aanvraagt.
          </li>
          <li>
            <strong className="font-medium text-foreground">Gerechtvaardigd belang</strong> voor
            bijvoorbeeld website-analyse, beveiliging en het verbeteren van onze diensten.
          </li>
          <li>
            <strong className="font-medium text-foreground">Wettelijke verplichting</strong> voor
            fiscale en administratieve bewaarplichten.
          </li>
          <li>
            <strong className="font-medium text-foreground">Toestemming</strong> wanneer je
            bijvoorbeeld instemt met nieuwsbrieven of bepaalde cookies.
          </li>
        </ul>
      </>,
    ],
  },
  {
    id: "bewaartermijn",
    title: "5. Bewaartermijnen",
    paragraphs: [
      "We bewaren persoonsgegevens niet langer dan nodig voor het doel waarvoor ze zijn verzameld, tenzij een langere bewaartermijn wettelijk verplicht is.",
      <>
        <ul className="list-disc space-y-2 pl-5">
          <li>Klant- en factuurgegevens: in principe tot 7 jaar na beëindiging van de relatie.</li>
          <li>Contactaanvragen zonder overeenkomst: doorgaans maximaal 12 maanden.</li>
          <li>Support- en projectcommunicatie: zolang relevant voor de dienstverlening.</li>
          <li>Website- en analytische logs: beperkte periode, afhankelijk van het systeem.</li>
        </ul>
      </>,
    ],
  },
  {
    id: "delen",
    title: "6. Delen met derden",
    paragraphs: [
      "Nexavo deelt persoonsgegevens alleen met derden wanneer dat nodig is voor onze dienstverlening of wettelijk verplicht is. Denk aan hostingpartners, e-mailproviders, betaalproviders, agenda- en boekingstools, analytics en andere software die je via Nexavo gebruikt.",
      "Met verwerkers sluiten we verwerkersovereenkomsten wanneer dat vereist is. We verkopen je gegevens niet aan derden voor commerciële doeleinden.",
    ],
  },
  {
    id: "cookies",
    title: "7. Cookies en vergelijkbare technieken",
    paragraphs: [
      "Onze website kan cookies en vergelijkbare technieken gebruiken voor functionaliteit, statistieken en marketing. Functionele cookies zijn nodig om de site goed te laten werken. Voor analytische of marketingcookies vragen we waar nodig je toestemming via de cookiebanner.",
      "Je kunt cookies beheren via je browserinstellingen en via onze cookievoorkeuren op de website.",
    ],
  },
  {
    id: "beveiliging",
    title: "8. Beveiliging",
    paragraphs: [
      "We nemen passende technische en organisatorische maatregelen om persoonsgegevens te beschermen tegen verlies, misbruik en onbevoegde toegang. Denk aan toegangsbeperkingen, versleutelde verbindingen (HTTPS) en zorgvuldige selectie van leveranciers.",
      "Geen enkele methode van opslag of verzending via internet is 100% veilig. We blijven onze maatregelen daarom continu verbeteren.",
    ],
  },
  {
    id: "rechten",
    title: "9. Jouw rechten",
    paragraphs: [
      "Je hebt onder de AVG onder andere de volgende rechten:",
      <>
        <ul className="list-disc space-y-2 pl-5">
          <li>Recht op inzage in je persoonsgegevens.</li>
          <li>Recht op rectificatie van onjuiste gegevens.</li>
          <li>Recht op verwijdering, beperking of bezwaar tegen verwerking.</li>
          <li>Recht op dataportabiliteit, voor zover van toepassing.</li>
          <li>Recht om toestemming in te trekken wanneer verwerking daarop is gebaseerd.</li>
        </ul>
      </>,
      <>
        Stuur een verzoek naar {contactEmail}. We reageren binnen de wettelijke termijn. Je
        hebt ook het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens (
        <a
          href="https://autoriteitpersoonsgegevens.nl"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          autoriteitpersoonsgegevens.nl
        </a>
        ).
      </>,
    ],
  },
  {
    id: "wijzigingen",
    title: "10. Wijzigingen",
    paragraphs: [
      "We kunnen deze privacyverklaring aanpassen wanneer onze diensten, wetgeving of werkwijze verandert. De meest recente versie staat altijd op deze pagina. Bij belangrijke wijzigingen informeren we je waar nodig via de website of per e-mail.",
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    id: "definities",
    title: "1. Definities",
    paragraphs: [
      <>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-medium text-foreground">Nexavo</strong>: de dienstverlener die
            websites, onderhoud, koppelingen en aanverwante online diensten levert.
          </li>
          <li>
            <strong className="font-medium text-foreground">Klant</strong>: de natuurlijke persoon
            of rechtspersoon die een overeenkomst met Nexavo aangaat.
          </li>
          <li>
            <strong className="font-medium text-foreground">Diensten</strong>: alle door Nexavo
            geleverde werkzaamheden, software, hosting, onderhoud en support.
          </li>
          <li>
            <strong className="font-medium text-foreground">Overeenkomst</strong>: de afspraken
            tussen Nexavo en Klant, inclusief offerte, pakketkeuze en deze voorwaarden.
          </li>
        </ul>
      </>,
    ],
  },
  {
    id: "toepasselijkheid",
    title: "2. Toepasselijkheid",
    paragraphs: [
      "Deze algemene voorwaarden zijn van toepassing op alle offertes, aanbiedingen en overeenkomsten tussen Nexavo en Klant, tenzij schriftelijk anders overeengekomen.",
      "Afwijkende of aanvullende voorwaarden van Klant worden alleen bindend als Nexavo deze uitdrukkelijk schriftelijk heeft aanvaard.",
      <>
        Op de verwerking van persoonsgegevens is onze {privacyLink} van toepassing.
      </>,
    ],
  },
  {
    id: "diensten",
    title: "3. Diensten en levering",
    paragraphs: [
      "Nexavo levert diensten zoals beschreven in de offerte, het gekozen pakket of de projectafspraken. Dit kan onder meer omvatten: ontwerp en bouw van websites of webshops, hosting, domein- en e-mailconfiguratie, koppelingen met externe tools, onderhoud en support.",
      "Nexavo voert werkzaamheden uit naar beste inzicht en vermogen, conform de afgesproken specificaties en planning. Termijnen zijn indicatief, tenzij uitdrukkelijk als fataal overeengekomen.",
      "Klant levert tijdig alle benodigde informatie, content, toegangen en feedback. Vertraging door Klant kan de planning en kosten beïnvloeden.",
    ],
  },
  {
    id: "prijzen",
    title: "4. Prijzen en betaling",
    paragraphs: [
      "Alle prijzen zijn exclusief btw, tenzij anders vermeld. Nexavo kan eenmalige projectkosten, maandelijkse onderhoudskosten en eventuele licentie- of derdenkosten in rekening brengen.",
      "Facturen dienen binnen de op de factuur vermelde termijn te worden voldaan. Bij niet-tijdige betaling mag Nexavo wettelijke rente en incassokosten in rekening brengen en werkzaamheden opschorten.",
      "Nexavo behoudt zich het recht voor om prijzen voor doorlopende diensten aan te passen met inachtneming van een redelijke termijn.",
    ],
  },
  {
    id: "klant",
    title: "5. Verplichtingen van de Klant",
    paragraphs: [
      <>
        <ul className="list-disc space-y-2 pl-5">
          <li>Correcte en volledige gegevens aanleveren voor uitvoering van de diensten.</li>
          <li>Zorgen dat aangeleverde content geen inbreuk maakt op rechten van derden.</li>
          <li>Inloggegevens en toegang tot systemen vertrouwelijk behandelen.</li>
          <li>Gebruik maken van de diensten in overeenstemming met wet- en regelgeving.</li>
          <li>Tijdige medewerking verlenen bij vragen, testmomenten en oplevering.</li>
        </ul>
      </>,
    ],
  },
  {
    id: "nexavo",
    title: "6. Verplichtingen van Nexavo",
    paragraphs: [
      "Nexavo levert de overeengekomen diensten professioneel en zorgvuldig. We informeren Klant over voortgang en relevante keuzes tijdens het traject.",
      "Nexavo spant zich in om diensten beschikbaar te houden, maar kan geen ononderbroken beschikbaarheid garanderen wanneer externe partijen, onderhoud of overmacht daarin een rol spelen.",
    ],
  },
  {
    id: "ie",
    title: "7. Intellectueel eigendom",
    paragraphs: [
      "Tot volledige betaling van de overeengekomen bedragen blijven door Nexavo ontwikkelde ontwerpen, code en deliverables eigendom van Nexavo, tenzij anders overeengekomen.",
      "Na volledige betaling verkrijgt Klant het gebruiksrecht dat nodig is voor het afgesproken doel. Broncode, templates of herbruikbare componenten van Nexavo kunnen onder voorwaarden beschikbaar blijven voor Nexavo.",
      "Door Klant aangeleverde materialen blijven eigendom van Klant. Klant verleent Nexavo een licentie om deze materialen te gebruiken voor uitvoering van de opdracht.",
    ],
  },
  {
    id: "aansprakelijkheid",
    title: "8. Aansprakelijkheid",
    paragraphs: [
      "Nexavo is uitsluitend aansprakelijk voor directe schade die het gevolg is van een toerekenbare tekortkoming, tot maximaal het bedrag dat Klant in de 12 maanden voorafgaand aan de schadeveroorzakende gebeurtenis aan Nexavo heeft betaald voor de betreffende dienst, met een maximum van € 5.000 per gebeurtenis, tenzij dwingend recht anders bepaalt.",
      "Nexavo is niet aansprakelijk voor indirecte schade, gevolgschade, gederfde winst, dataverlies of schade door storingen bij derden.",
      "Klant blijft verantwoordelijk voor de juistheid van eigen content, wettelijke verplichtingen richting eindgebruikers en het gebruik van gekoppelde tools van derden.",
    ],
  },
  {
    id: "opzegging",
    title: "9. Duur, opschorting en beëindiging",
    paragraphs: [
      "Doorlopende diensten zoals onderhoud lopen voor de afgesproken periode en worden verlengd volgens de offerte of het pakket, tenzij tijdig schriftelijk opgezegd.",
      "Nexavo mag de overeenkomst opschorten of beëindigen bij niet-betaling, misbruik of ernstige schending van deze voorwaarden.",
      "Bij beëindiging blijven betalingsverplichtingen voor reeds geleverde diensten en openstaande facturen in stand. Overdracht of export van data kan op verzoek worden afgesproken.",
    ],
  },
  {
    id: "overmacht",
    title: "10. Overmacht",
    paragraphs: [
      "Nexavo is niet gehouden tot nakoming van verplichtingen wanneer sprake is van overmacht, zoals storingen bij hostingproviders, internet- of stroomuitval, cyberincidenten, overheidsmaatregelen of andere omstandigheden buiten redelijke controle.",
    ],
  },
  {
    id: "geschillen",
    title: "11. Toepasselijk recht en geschillen",
    paragraphs: [
      "Op alle overeenkomsten tussen Nexavo en Klant is Nederlands recht van toepassing.",
      "Geschillen worden bij voorkeur in onderling overleg opgelost. Indien dat niet lukt, worden geschillen voorgelegd aan de bevoegde rechter in Nederland.",
    ],
  },
  {
    id: "contact",
    title: "12. Contact",
    paragraphs: [
      <>
        Vragen over deze voorwaarden? Neem contact op via {contactEmail} of bekijk onze{" "}
        <Link to="/contact" className="font-medium text-primary hover:underline">
          contactpagina
        </Link>
        .
      </>,
    ],
  },
];
