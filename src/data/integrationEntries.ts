import type { Integration, IntegrationCategoryId } from "./integrations";

type IntegrationSeed = Pick<
  Integration,
  "slug" | "name" | "iconSlug" | "category" | "tagline" | "cardDescription"
> &
  Partial<
    Pick<
      Integration,
      "builtBy" | "verified" | "overview" | "howItWorks" | "configure" | "iconColor"
    >
  >;

const content = (
  name: string,
  category: IntegrationCategoryId,
  specifics: {
    overview: string;
    howItWorks: string;
    configure: string;
  },
): Pick<Integration, "overview" | "howItWorks" | "configure"> => specifics;

const seeds: IntegrationSeed[] = [
  // Agenda & boekingen
  {
    slug: "google-calendar",
    name: "Google Calendar",
    iconSlug: "googlecalendar",
    category: "agenda",
    tagline: "Synchroniseer afspraken met Google Agenda",
    cardDescription: "Houd je planning up-to-date tussen website, team en klanten.",
    ...content("Google Calendar", "agenda", {
      overview:
        "Google Calendar koppelen aan je Nexavo-oplossing zorgt dat afspraken op de juiste plek landen. Ideaal voor teams die al in Google Workspace werken.",
      howItWorks:
        "Boekingen via je website of automatiseringen worden als event toegevoegd of bijgewerkt in Google Calendar. Dubbele boekingen en gemiste afspraken worden zo voorkomen.",
      configure:
        "We stemmen af welke agenda's gekoppeld worden, welke gebeurtenissen gesynchroniseerd moeten worden en wie toegang nodig heeft.",
    }),
  },
  {
    slug: "calendly",
    name: "Calendly",
    iconSlug: "calendly",
    category: "agenda",
    tagline: "Laat klanten zelf online een afspraak plannen",
    cardDescription: "Koppel Calendly aan je website voor directe online boekingen.",
    ...content("Calendly", "agenda", {
      overview:
        "Met Calendly op je Nexavo-website plannen klanten zelf een moment dat past. Beschikbaarheid, type afspraak en bevestigingen lopen automatisch.",
      howItWorks:
        "We plaatsen je Calendly-link of ingesloten widget op de juiste pagina's. Nieuwe boekingen kunnen doorgezet worden naar je agenda, CRM of automatiseringen.",
      configure:
        "Tijdens onboarding delen we je Calendly-account, gewenste pagina's en event types. Nexavo test de volledige flow voor livegang.",
    }),
  },
  {
    slug: "outlook-calendar",
    name: "Outlook Calendar",
    iconSlug: "microsoftoutlook",
    category: "agenda",
    tagline: "Plan afspraken vanuit Microsoft Outlook",
    cardDescription: "Verbind Outlook Calendar met je website en workflows.",
    ...content("Outlook Calendar", "agenda", {
      overview:
        "Voor bedrijven die Microsoft 365 gebruiken, koppelt Nexavo Outlook Calendar aan boekingsflows en klantcontact op je website.",
      howItWorks:
        "Nieuwe aanvragen of bevestigde afspraken kunnen automatisch in Outlook geplaatst worden. Je team ziet direct wat er binnenkomt.",
      configure:
        "We bespreken je Microsoft-omgeving, agenda's en gewenste triggers. Nexavo controleert of afspraken betrouwbaar synchroniseren.",
    }),
  },
  {
    slug: "microsoft-bookings",
    name: "Microsoft Bookings",
    iconSlug: "microsoft",
    category: "agenda",
    tagline: "Online boeken binnen Microsoft 365",
    cardDescription: "Plan afspraken met Microsoft Bookings op je website.",
    ...content("Microsoft Bookings", "agenda", {
      overview:
        "Microsoft Bookings is ideaal als je team al in Microsoft 365 werkt. Nexavo koppelt je boekingspagina aan je website voor een naadloze ervaring.",
      howItWorks:
        "Klanten kiezen een dienst en tijdslot via Bookings. Bevestigingen en agenda-updates lopen automatisch binnen je Microsoft-omgeving.",
      configure:
        "We stemmen je Bookings-services, beschikbaarheid en pagina's af. Nexavo integreert de boekingsflow en test alle stappen.",
    }),
  },
  {
    slug: "acuity-scheduling",
    name: "Acuity Scheduling",
    iconSlug: "acuityscheduling",
    category: "agenda",
    tagline: "Flexibel online afspraken plannen",
    cardDescription: "Embed Acuity Scheduling voor boekingen op maat.",
    ...content("Acuity Scheduling", "agenda", {
      overview:
        "Acuity Scheduling biedt uitgebreide opties voor online afspraken. Nexavo koppelt het platform aan je website en klantprocessen.",
      howItWorks:
        "Bezoekers boeken direct via Acuity op je site. Betalingen, intakeformulieren en herinneringen kunnen gekoppeld worden aan je workflow.",
      configure:
        "We bespreken je Acuity-account, diensten en gewenste pagina's. Nexavo richt de embed of redirect in en test boekingen.",
    }),
  },
  {
    slug: "simplybook",
    name: "SimplyBook.me",
    iconSlug: "simplybook",
    category: "agenda",
    tagline: "Boekingssoftware voor dienstverleners",
    cardDescription: "SimplyBook.me naadloos op je Nexavo-website.",
    ...content("SimplyBook.me", "agenda", {
      overview:
        "SimplyBook.me is populair bij salons, coaches en zorgverleners. Nexavo integreert je boekingsmodule in je website-design.",
      howItWorks:
        "Klanten zien beschikbare tijden en boeken direct. Afspraken, klantgegevens en bevestigingen worden automatisch verwerkt.",
      configure:
        "Je deelt je SimplyBook-account en gewenste diensten. Nexavo plaatst de widget of link en test de volledige boekingsflow.",
    }),
  },
  {
    slug: "fresha",
    name: "Fresha",
    iconSlug: "fresha",
    category: "agenda",
    tagline: "Salon- en spa-boekingen met Fresha",
    cardDescription: "Koppel Fresha aan je website voor online afspraken.",
    ...content("Fresha", "agenda", {
      overview:
        "Fresha is een toonaangevend boekingssysteem voor salons en spa's. Nexavo zorgt dat klanten eenvoudig online kunnen reserveren.",
      howItWorks:
        "Bezoekers boeken behandelingen via Fresha op je site. Je team behoudt overzicht in Fresha terwijl je website professioneel oogt.",
      configure:
        "We bespreken je Fresha-setup, behandelingen en boekingspagina. Nexavo integreert de koppeling en controleert op mobiel.",
    }),
  },
  {
    slug: "treatwell",
    name: "Treatwell",
    iconSlug: "treatwell",
    category: "agenda",
    tagline: "Online boeken via Treatwell",
    cardDescription: "Verbind Treatwell met je website voor meer reserveringen.",
    ...content("Treatwell", "agenda", {
      overview:
        "Treatwell helpt beauty- en wellnessbedrijven online gevonden te worden. Nexavo koppelt Treatwell aan je eigen website.",
      howItWorks:
        "Klanten kunnen via je site doorverwezen worden naar Treatwell of direct boeken. Zo combineer je vindbaarheid met je eigen merk.",
      configure:
        "We stemmen je Treatwell-profiel, link of widget af. Nexavo verwerkt dit netjes in je pagina's en test de flow.",
    }),
  },
  {
    slug: "salonized",
    name: "Salonized",
    iconSlug: "salonized",
    category: "agenda",
    tagline: "Salonsoftware voor afspraken en klanten",
    cardDescription: "Salonized koppelen aan je Nexavo-website.",
    ...content("Salonized", "agenda", {
      overview:
        "Salonized is salonsoftware voor afspraken, klantenbeheer en marketing. Nexavo integreert het met je professionele website.",
      howItWorks:
        "Online boekingen via Salonized komen direct in je salonagenda. Klanten zien je merk op de website, terwijl alles achter de schermen synchroniseert.",
      configure:
        "Je deelt je Salonized-account en gewenste boekingspagina. Nexavo bouwt de koppeling en test op desktop en mobiel.",
    }),
  },
  {
    slug: "booksy",
    name: "Booksy",
    iconSlug: "booksy",
    category: "agenda",
    tagline: "Boekingsplatform voor kappers en salons",
    cardDescription: "Booksy integreren voor online afspraken.",
    ...content("Booksy", "agenda", {
      overview:
        "Booksy is een populair platform voor kappers, barbers en beauty-professionals. Nexavo koppelt Booksy aan je website.",
      howItWorks:
        "Klanten boeken via Booksy vanuit je site. Je profiel, reviews en beschikbaarheid blijven centraal terwijl je website converteert.",
      configure:
        "We bespreken je Booksy-profiel en gewenste call-to-actions. Nexavo plaatst de koppeling en test de boekingsstappen.",
    }),
  },

  // Communicatie
  {
    slug: "whatsapp",
    name: "WhatsApp",
    iconSlug: "whatsapp",
    category: "communicatie",
    tagline: "Bereik klanten via WhatsApp",
    cardDescription: "Automatische berichten voor herinneringen, reviews en opvolging.",
    ...content("WhatsApp", "communicatie", {
      overview:
        "WhatsApp maakt klantcontact persoonlijk en snel. Nexavo koppelt WhatsApp aan automatiseringen voor herinneringen en opvolging.",
      howItWorks:
        "Na een boeking of bezoek kan een klant automatisch een bericht ontvangen. Jij bepaalt timing, tekst en triggers.",
      configure:
        "We bespreken je WhatsApp-setup, berichten en automatiseringen. Nexavo bouwt en test de flows voor oplevering.",
    }),
  },
  {
    slug: "whatsapp-business",
    name: "WhatsApp Business",
    iconSlug: "whatsapp",
    category: "communicatie",
    tagline: "Zakelijke WhatsApp voor teams",
    cardDescription: "WhatsApp Business API koppelen aan je website.",
    ...content("WhatsApp Business", "communicatie", {
      overview:
        "WhatsApp Business biedt professionele tools voor bedrijfscommunicatie. Nexavo koppelt het aan je website en klantprocessen.",
      howItWorks:
        "Automatische berichten, snelle antwoorden en notificaties lopen via WhatsApp Business. Ideaal voor herinneringen en service.",
      configure:
        "We bespreken je Business-account, templates en gewenste flows. Nexavo richt de koppeling in en test berichten.",
    }),
  },
  {
    slug: "messenger",
    name: "Messenger",
    iconSlug: "messenger",
    category: "communicatie",
    tagline: "Chat via Facebook Messenger",
    cardDescription: "Messenger koppelen voor direct klantcontact.",
    ...content("Messenger", "communicatie", {
      overview:
        "Messenger maakt het makkelijk voor klanten om contact op te nemen. Nexavo integreert Messenger op je website.",
      howItWorks:
        "Bezoekers starten een chat via een knop of widget op je site. Berichten komen binnen in je Meta Business Inbox.",
      configure:
        "We koppelen je Meta-pagina, chatwidget en gewenste pagina's. Nexavo test de chatflow op mobiel en desktop.",
    }),
  },
  {
    slug: "instagram-dm",
    name: "Instagram DM",
    iconSlug: "instagram",
    category: "communicatie",
    tagline: "Instagram-berichten vanuit je website",
    cardDescription: "Leid bezoekers naar Instagram DM voor snelle contact.",
    ...content("Instagram DM", "communicatie", {
      overview:
        "Instagram DM is een natuurlijk contactkanaal voor veel doelgroepen. Nexavo koppelt je Instagram aan je website.",
      howItWorks:
        "Call-to-actions op je site leiden bezoekers naar Instagram DM of je inbox. Combineer dit met Meta Business Tools voor overzicht.",
      configure:
        "We stemmen je Instagram-profiel, links en knoppen af. Nexavo verwerkt dit in je design en test op mobiel.",
    }),
  },

  // Marketing & ads
  {
    slug: "meta",
    name: "Meta",
    iconSlug: "meta",
    category: "marketing",
    tagline: "Verbind je website met Facebook en Instagram",
    cardDescription: "Meer bereik en betere opvolging van social traffic.",
    ...content("Meta", "marketing", {
      overview:
        "Meta-koppelingen helpen je social kanalen en website op elkaar af te stemmen. Denk aan pixels, leadflows en conversiemeting.",
      howItWorks:
        "We koppelen je site aan Meta-tools zodat campagnes, formulieren en bezoekersgedrag beter meetbaar worden.",
      configure:
        "Tijdens het traject verzamelen we je Meta Business-account, doelen en trackingwensen. Nexavo implementeert en controleert alles.",
    }),
  },
  {
    slug: "tiktok",
    name: "TikTok",
    iconSlug: "tiktok",
    category: "marketing",
    tagline: "Meet en benut TikTok-verkeer",
    cardDescription: "Koppel campagnes aan echte aanvragen en conversies.",
    ...content("TikTok", "marketing", {
      overview:
        "TikTok levert steeds vaker relevant verkeer. Nexavo helpt je meten wat werkt en bezoekers door te sturen naar acties op je site.",
      howItWorks:
        "Tracking en landingspagina's geven zicht op TikTok-bezoekers. Combineer dit met formulieren of boekingsflows.",
      configure:
        "We stemmen je TikTok Pixel, landingspagina's en doelen af. Daarna testen we of events correct binnenkomen.",
    }),
  },
  {
    slug: "google-ads",
    name: "Google Ads",
    iconSlug: "googleads",
    category: "marketing",
    tagline: "Meet conversies uit Google Ads",
    cardDescription: "Koppel advertenties aan formulieren en boekingen.",
    ...content("Google Ads", "marketing", {
      overview:
        "Google Ads drijft veel verkeer naar websites. Nexavo zorgt dat conversies correct gemeten worden zodat je campagnes optimaliseert.",
      howItWorks:
        "We koppelen Google Ads conversietracking aan formulierinzendingen, kliks en boekingen op je site.",
      configure:
        "We bespreken je Ads-account, conversieacties en doelen. Nexavo implementeert tracking en test of data klopt.",
    }),
  },
  {
    slug: "youtube",
    name: "YouTube",
    iconSlug: "youtube",
    category: "marketing",
    tagline: "YouTube-content op je website",
    cardDescription: "Embed video's en meet engagement vanaf je site.",
    ...content("YouTube", "marketing", {
      overview:
        "YouTube versterkt vertrouwen en uitleg op je website. Nexavo integreert video's netjes en koppelt tracking waar nodig.",
      howItWorks:
        "Video's worden ingesloten op relevante pagina's. Bezoekers blijven op je site terwijl je merk en boodschap centraal staan.",
      configure:
        "Je deelt je YouTube-kanaal en gewenste pagina's. Nexavo verwerkt embeds, styling en laadtijden.",
    }),
  },
  {
    slug: "linkedin-ads",
    name: "LinkedIn Ads",
    iconSlug: "linkedin",
    category: "marketing",
    tagline: "LinkedIn-campagnes met meetbare resultaten",
    cardDescription: "Track leads en conversies uit LinkedIn Ads.",
    ...content("LinkedIn Ads", "marketing", {
      overview:
        "LinkedIn Ads bereikt zakelijke doelgroepen. Nexavo koppelt je website aan LinkedIn tracking voor inzicht in leads.",
      howItWorks:
        "Insight Tag en conversie-events meten welke campagnes aanvragen opleveren. Data stroomt naar je analytics-dashboard.",
      configure:
        "We stemmen je LinkedIn Campaign Manager, tag en conversies af. Nexavo implementeert en test events.",
    }),
  },
  {
    slug: "meta-pixel",
    name: "Meta Pixel",
    iconSlug: "meta",
    category: "marketing",
    tagline: "Track bezoekers en conversies van Meta",
    cardDescription: "Meta Pixel correct installeren op je website.",
    ...content("Meta Pixel", "marketing", {
      overview:
        "De Meta Pixel meet wat bezoekers doen na een klik op Facebook of Instagram. Nexavo installeert en configureert de pixel correct.",
      howItWorks:
        "Paginaweergaves, formulierinzendingen en aankopen worden als events verstuurd naar Meta voor betere targeting en rapportage.",
      configure:
        "We koppelen je pixel-ID, events en Event Manager. Nexavo test of alle belangrijke acties gemeten worden.",
    }),
  },
  {
    slug: "tiktok-pixel",
    name: "TikTok Pixel",
    iconSlug: "tiktok",
    category: "marketing",
    tagline: "Conversies meten uit TikTok-campagnes",
    cardDescription: "TikTok Pixel koppelen aan je website.",
    ...content("TikTok Pixel", "marketing", {
      overview:
        "De TikTok Pixel geeft inzicht in welke campagnes converteren. Nexavo zorgt voor een betrouwbare installatie.",
      howItWorks:
        "Bezoekersacties op je site worden doorgestuurd naar TikTok Ads Manager. Zo optimaliseer je campagnes op echte resultaten.",
      configure:
        "We bespreken je pixel-ID, events en landingspagina's. Nexavo implementeert en verifieert de tracking.",
    }),
  },
  {
    slug: "linkedin-insight-tag",
    name: "LinkedIn Insight Tag",
    iconSlug: "linkedin",
    category: "marketing",
    tagline: "Website-analytics voor LinkedIn Ads",
    cardDescription: "Insight Tag installeren voor campagne-inzicht.",
    ...content("LinkedIn Insight Tag", "marketing", {
      overview:
        "De LinkedIn Insight Tag meet websitebezoek en conversies van LinkedIn-verkeer. Nexavo installeert de tag op je site.",
      howItWorks:
        "Bezoekersdata helpt LinkedIn je campagnes te optimaliseren en retargeting te verbeteren.",
      configure:
        "We koppelen je partner-ID en conversie-events. Nexavo test of de tag actief is en data ontvangt.",
    }),
  },
  {
    slug: "mailchimp",
    name: "Mailchimp",
    iconSlug: "mailchimp",
    category: "marketing",
    tagline: "Automatiseer e-mailmarketing",
    cardDescription: "Nieuwe leads direct in de juiste Mailchimp-lijst.",
    ...content("Mailchimp", "marketing", {
      overview:
        "Mailchimp gekoppeld aan je website betekent dat inschrijvingen en leads automatisch worden bijgewerkt.",
      howItWorks:
        "Formulieren voegen contacten toe aan lijsten of starten automations. Geen handmatig exporteren meer.",
      configure:
        "We koppelen formulieren, lijsten en automations. Nexavo test inschrijvingen voor livegang.",
    }),
  },
  {
    slug: "mailerlite",
    name: "MailerLite",
    iconSlug: "mailerlite",
    category: "marketing",
    tagline: "E-mailmarketing met MailerLite",
    cardDescription: "Formulieren koppelen aan MailerLite-lijsten.",
    ...content("MailerLite", "marketing", {
      overview:
        "MailerLite is een gebruiksvriendelijk e-mailplatform. Nexavo koppelt je website-formulieren aan MailerLite.",
      howItWorks:
        "Nieuwe subscribers komen automatisch in de juiste groep. Automations kunnen direct starten na inschrijving.",
      configure:
        "We bespreken je MailerLite-account, formulieren en groepen. Nexavo richt de koppeling in en test.",
    }),
  },
  {
    slug: "brevo",
    name: "Brevo",
    iconSlug: "brevo",
    category: "marketing",
    tagline: "E-mail en SMS via Brevo",
    cardDescription: "Leads en klanten synchroniseren met Brevo.",
    ...content("Brevo", "marketing", {
      overview:
        "Brevo (voorheen Sendinblue) combineert e-mail, SMS en automations. Nexavo koppelt het aan je website.",
      howItWorks:
        "Formulierinzendingen voegen contacten toe aan Brevo. Campagnes en workflows starten op basis van website-acties.",
      configure:
        "We stemmen je Brevo-account, lijsten en triggers af. Nexavo implementeert en test de synchronisatie.",
    }),
  },
  {
    slug: "activecampaign",
    name: "ActiveCampaign",
    iconSlug: "activecampaign",
    category: "marketing",
    tagline: "Marketing automation met ActiveCampaign",
    cardDescription: "Website-leads automatisch opvolgen.",
    ...content("ActiveCampaign", "marketing", {
      overview:
        "ActiveCampaign biedt krachtige marketing automation. Nexavo koppelt je website aan contacten, tags en automations.",
      howItWorks:
        "Leads van formulieren of boekingen triggeren automations in ActiveCampaign. Opvolging loopt automatisch.",
      configure:
        "We bespreken je account, pipelines en automations. Nexavo bouwt de koppeling en test triggers.",
    }),
  },
  {
    slug: "klaviyo",
    name: "Klaviyo",
    iconSlug: "klaviyo",
    category: "marketing",
    tagline: "E-mailmarketing op basis van gedrag",
    cardDescription: "Klaviyo koppelen voor gerichte campagnes.",
    ...content("Klaviyo", "marketing", {
      overview:
        "Klaviyo is sterk in gedragsgestuurde e-mailmarketing. Nexavo verbindt website-events met Klaviyo-segmenten.",
      howItWorks:
        "Acties op je site, zoals formulieren of boekingen, updaten profielen en starten flows in Klaviyo.",
      configure:
        "We stemmen je Klaviyo-account, events en flows af. Nexavo implementeert tracking en test synchronisatie.",
    }),
  },

  // Betalingen
  {
    slug: "mollie",
    name: "Mollie",
    iconSlug: "mollie",
    category: "betalingen",
    tagline: "Online betalingen via Mollie",
    cardDescription: "Veilige betalingen voor diensten, aanbetalingen of facturen.",
    ...content("Mollie", "betalingen", {
      overview:
        "Mollie is een betrouwbare betaaloplossing voor Nederlandse bedrijven. Nexavo koppelt Mollie aan je website.",
      howItWorks:
        "Klanten betalen via Wero, creditcard of andere methoden. Betalingen koppelen aan formulieren, boekingen of flows.",
      configure:
        "We bespreken betaalmomenten en Mollie-methoden. Nexavo richt de koppeling in en test een volledige betaling.",
    }),
  },
  {
    slug: "sumup",
    name: "SumUp",
    iconSlug: "sumup",
    category: "betalingen",
    tagline: "Online en fysieke betalingen",
    cardDescription: "SumUp koppelen aan je website en processen.",
    ...content("SumUp", "betalingen", {
      overview:
        "SumUp is handig wanneer je zowel online als op locatie wilt ontvangen. Nexavo kijkt mee welke koppeling past.",
      howItWorks:
        "SumUp kan verbonden worden met aanvraagflows, offertes of betalingspagina's voor eenvoudig afrekenen.",
      configure:
        "We inventariseren je SumUp-account en betaalpunten. Nexavo bouwt en test de koppeling.",
    }),
  },
  {
    slug: "stripe",
    name: "Stripe",
    iconSlug: "stripe",
    category: "betalingen",
    tagline: "Internationale online betalingen",
    cardDescription: "Stripe integreren voor kaartbetalingen en abonnementen.",
    ...content("Stripe", "betalingen", {
      overview:
        "Stripe is een wereldwijd betaalplatform. Nexavo koppelt Stripe wanneer je schaalbare online betalingen nodig hebt.",
      howItWorks:
        "Klanten betalen veilig via Stripe op je site. Betalingen kunnen gekoppeld worden aan boekingen, facturen of abonnementen.",
      configure:
        "We bespreken je Stripe-account, betaalmethoden en flows. Nexavo implementeert en test transacties.",
    }),
  },
  {
    slug: "paypal",
    name: "PayPal",
    iconSlug: "paypal",
    category: "betalingen",
    tagline: "Betalen met PayPal",
    cardDescription: "PayPal als betaaloptie op je website.",
    ...content("PayPal", "betalingen", {
      overview:
        "PayPal is een vertrouwde betaalmethode wereldwijd. Nexavo voegt PayPal toe als optie op je website.",
      howItWorks:
        "Klanten betalen via hun PayPal-account of kaart. Betalingen worden gekoppeld aan je order- of boekingsflow.",
      configure:
        "We koppelen je PayPal Business-account en gewenste pagina's. Nexavo test de volledige checkout.",
    }),
  },
  {
    slug: "wero",
    name: "Wero",
    iconSlug: "wero",
    category: "betalingen",
    tagline: "De populairste betaalmethode in Nederland",
    cardDescription: "Wero activeren via je payment provider.",
    ...content("Wero", "betalingen", {
      overview:
        "Wero is de opvolger van iDEAL en de meest gebruikte online betaalmethode in Nederland. Nexavo activeert Wero via Mollie, Stripe of andere providers.",
      howItWorks:
        "Klanten betalen direct via hun bank. Betalingen worden realtime bevestigd en gekoppeld aan je processen.",
      configure:
        "We bespreken je payment provider en gewenste betaalmomenten. Nexavo activeert Wero en test betalingen.",
    }),
  },
  {
    slug: "klarna",
    name: "Klarna",
    iconSlug: "klarna",
    category: "betalingen",
    tagline: "Achteraf betalen en gespreid betalen",
    cardDescription: "Klarna toevoegen als betaaloptie.",
    ...content("Klarna", "betalingen", {
      overview:
        "Klarna biedt flexibele betaalopties zoals achteraf betalen. Nexavo koppelt Klarna via je payment provider.",
      howItWorks:
        "Klanten kiezen Klarna bij checkout. Betalingen worden verwerkt via je provider terwijl Klarna de klant faciliteert.",
      configure:
        "We stemmen je provider, Klarna-activatie en pagina's af. Nexavo test de checkout-flow.",
    }),
  },
  {
    slug: "tikkie",
    name: "Tikkie",
    iconSlug: "tikkie",
    category: "betalingen",
    tagline: "Snel betalen via Tikkie",
    cardDescription: "Tikkie-links integreren in je klantprocessen.",
    iconColor: "009FE3",
    ...content("Tikkie", "betalingen", {
      overview:
        "Tikkie is populair voor snelle betalingen in Nederland. Nexavo integreert Tikkie in je offerte- of betalingsflows.",
      howItWorks:
        "Klanten ontvangen een Tikkie-link na een boeking of offerte. Betalingen worden handmatig of automatisch gekoppeld.",
      configure:
        "We bespreken wanneer Tikkie-links verstuurd worden en hoe bevestigingen lopen. Nexavo bouwt de flow.",
    }),
  },
  {
    slug: "apple-pay",
    name: "Apple Pay",
    iconSlug: "applepay",
    category: "betalingen",
    tagline: "Betalingen met Apple Pay",
    cardDescription: "Apple Pay activeren voor snelle checkout.",
    ...content("Apple Pay", "betalingen", {
      overview:
        "Apple Pay maakt betalen op mobiel extreem snel. Nexavo activeert Apple Pay via je payment provider.",
      howItWorks:
        "Klanten met een Apple-apparaat betalen met één klik. Apple Pay werkt via Stripe, Mollie of andere providers.",
      configure:
        "We bespreken je provider en Apple Pay-activatie. Nexavo test op iPhone en Safari.",
    }),
  },
  {
    slug: "google-pay",
    name: "Google Pay",
    iconSlug: "googlepay",
    category: "betalingen",
    tagline: "Betalingen met Google Pay",
    cardDescription: "Google Pay toevoegen aan je checkout.",
    ...content("Google Pay", "betalingen", {
      overview:
        "Google Pay biedt snelle betalingen op Android en Chrome. Nexavo activeert Google Pay via je provider.",
      howItWorks:
        "Klanten betalen met opgeslagen kaarten in hun Google-account. Checkout duurt seconden.",
      configure:
        "We stemmen je provider en Google Pay-setup af. Nexavo test op Android en Chrome.",
    }),
  },

  // Analytics & reviews
  {
    slug: "google-maps",
    name: "Google Maps",
    iconSlug: "googlemaps",
    category: "analytics",
    tagline: "Maak je locatie direct vindbaar",
    cardDescription: "Route, openingstijden en vertrouwen op één plek.",
    ...content("Google Maps", "analytics", {
      overview:
        "Google Maps op je website helpt bezoekers sneller bij je bedrijf terecht. Nexavo integreert kaarten netjes in je design.",
      howItWorks:
        "We plaatsen een interactieve kaart op contact- of locatiepagina's en koppelen aan je Google Business-profiel.",
      configure:
        "Je deelt locatiegegevens en gewenste pagina's. Nexavo verwerkt kaart, styling en mobiele weergave.",
    }),
  },
  {
    slug: "google-business-profile",
    name: "Google Business Profile",
    iconSlug: "google",
    category: "analytics",
    tagline: "Vindbaarheid in Google Search en Maps",
    cardDescription: "Koppel je Google Business-profiel aan je website.",
    ...content("Google Business Profile", "analytics", {
      overview:
        "Google Business Profile is essentieel voor lokale vindbaarheid. Nexavo koppelt het aan je website en reviewflows.",
      howItWorks:
        "Je profiel, reviews en openingstijden zijn consistent tussen Google en je site. Bezoekers vinden je sneller.",
      configure:
        "We bespreken je profiel, verificatie en gewenste koppelingen. Nexavo integreert links, kaarten en reviewflows.",
    }),
  },
  {
    slug: "google-reviews",
    name: "Google Reviews",
    iconSlug: "google",
    category: "analytics",
    tagline: "Verzamel en toon Google-reviews",
    cardDescription: "Meer vertrouwen met zichtbare klantbeoordelingen.",
    ...content("Google Reviews", "analytics", {
      overview:
        "Google Reviews zijn cruciaal voor lokale bedrijven. Nexavo koppelt reviewflows aan je website.",
      howItWorks:
        "Na een afspraak ontvangt een klant een reviewverzoek. Positieve reviews kunnen op je website getoond worden.",
      configure:
        "We bespreken timing, kanalen en welke reviews je wilt tonen. Nexavo richt de flow in.",
    }),
  },
  {
    slug: "google-analytics",
    name: "Google Analytics",
    iconSlug: "googleanalytics",
    category: "analytics",
    tagline: "Meet wat bezoekers op je website doen",
    cardDescription: "Inzicht in pagina's, conversies en groei.",
    ...content("Google Analytics", "analytics", {
      overview:
        "Google Analytics geeft inzicht in bezoekers, bronnen en conversies. Nexavo zorgt voor correcte installatie en events.",
      howItWorks:
        "We meten paginaweergaves, formulierinzendingen en belangrijke acties. Zo zie je wat werkt en wat beter kan.",
      configure:
        "We koppelen je GA4-property, stellen conversies in en testen of data betrouwbaar binnenkomt.",
    }),
  },
  {
    slug: "google-search-console",
    name: "Google Search Console",
    iconSlug: "googlesearchconsole",
    category: "analytics",
    tagline: "Inzicht in je vindbaarheid in Google",
    cardDescription: "Search Console koppelen voor SEO-monitoring.",
    ...content("Google Search Console", "analytics", {
      overview:
        "Google Search Console toont hoe je site presteert in zoekresultaten. Nexavo koppelt en configureert het voor je.",
      howItWorks:
        "Je ziet welke zoekwoorden verkeer opleveren, indexatieproblemen en technische SEO-kansen.",
      configure:
        "We verifiëren je domein, dienen sitemaps in en stellen basisrapportages in.",
    }),
  },
  {
    slug: "google-tag-manager",
    name: "Google Tag Manager",
    iconSlug: "googletagmanager",
    category: "analytics",
    tagline: "Beheer tags centraal via GTM",
    cardDescription: "Google Tag Manager installeren op je website.",
    ...content("Google Tag Manager", "analytics", {
      overview:
        "Google Tag Manager maakt het beheren van tracking-tags eenvoudiger. Nexavo installeert GTM en richt containers in.",
      howItWorks:
        "Analytics, pixels en andere tags worden via GTM geladen. Wijzigingen zijn mogelijk zonder code aan te passen.",
      configure:
        "We bespreken je container, tags en triggers. Nexavo implementeert GTM en test alle tags.",
    }),
  },
  {
    slug: "hotjar",
    name: "Hotjar",
    iconSlug: "hotjar",
    category: "analytics",
    tagline: "Heatmaps en sessie-opnames",
    cardDescription: "Begrijp hoe bezoekers je site gebruiken.",
    ...content("Hotjar", "analytics", {
      overview:
        "Hotjar laat zien waar bezoekers klikken, scrollen en afhaken. Nexavo installeert Hotjar op je website.",
      howItWorks:
        "Heatmaps en recordings geven visueel inzicht in gedrag. Zo verbeter je pagina's en conversies.",
      configure:
        "We koppelen je Hotjar-account en stellen tracking in. Nexavo respecteert privacy-instellingen.",
    }),
  },
  {
    slug: "microsoft-clarity",
    name: "Microsoft Clarity",
    iconSlug: "microsoft",
    category: "analytics",
    tagline: "Gratis heatmaps en sessie-opnames",
    cardDescription: "Microsoft Clarity installeren voor UX-inzicht.",
    ...content("Microsoft Clarity", "analytics", {
      overview:
        "Microsoft Clarity biedt gratis inzicht in bezoekersgedrag. Nexavo installeert Clarity op je website.",
      howItWorks:
        "Heatmaps en recordings tonen waar bezoekers vastlopen. Ideaal voor continue verbetering van je site.",
      configure:
        "We koppelen je Clarity-project en stellen privacy-vriendelijke tracking in.",
    }),
  },
  {
    slug: "looker-studio",
    name: "Looker Studio",
    iconSlug: "looker",
    category: "analytics",
    tagline: "Dashboards voor al je marketingdata",
    cardDescription: "Rapportages koppelen aan Looker Studio.",
    ...content("Looker Studio", "analytics", {
      overview:
        "Looker Studio combineert data uit Analytics, Ads en andere bronnen in overzichtelijke dashboards.",
      howItWorks:
        "Nexavo koppelt je databronnen zodat je prestaties, conversies en campagnes in één dashboard ziet.",
      configure:
        "We bespreken welke bronnen en KPI's je wilt volgen. Nexavo bouwt het dashboard en test dataflows.",
    }),
  },

  // Formulieren
  {
    slug: "typeform",
    name: "Typeform",
    iconSlug: "typeform",
    category: "formulieren",
    tagline: "Interactieve formulieren en enquêtes",
    cardDescription: "Typeform embedden op je website.",
    ...content("Typeform", "formulieren", {
      overview:
        "Typeform maakt formulieren persoonlijk en visueel aantrekkelijk. Nexavo integreert Typeform op je site.",
      howItWorks:
        "Bezoekers vullen Typeform in op je pagina's. Antwoorden kunnen gekoppeld worden aan e-mail, CRM of automations.",
      configure:
        "We bespreken je Typeform-account, formulieren en koppelingen. Nexavo embedt en test inzendingen.",
    }),
  },
  {
    slug: "jotform",
    name: "Jotform",
    iconSlug: "jotform",
    category: "formulieren",
    tagline: "Krachtige formulieren bouwen",
    cardDescription: "Jotform koppelen aan je website en workflows.",
    ...content("Jotform", "formulieren", {
      overview:
        "Jotform biedt flexibele formulieren voor leads, intake en enquêtes. Nexavo koppelt het aan je website.",
      howItWorks:
        "Formulieren op je site sturen data naar Jotform. Notificaties en automations kunnen direct starten.",
      configure:
        "We stemmen je Jotform-account, formulieren en triggers af. Nexavo embedt en test.",
    }),
  },
  {
    slug: "tally",
    name: "Tally",
    iconSlug: "tally",
    category: "formulieren",
    tagline: "Eenvoudige formulieren zonder code",
    cardDescription: "Tally-formulieren op je Nexavo-website.",
    ...content("Tally", "formulieren", {
      overview:
        "Tally is een lichtgewicht formulierplatform. Nexavo integreert Tally-formulieren netjes in je pagina's.",
      howItWorks:
        "Bezoekers vullen formulieren in op je site. Inzendingen kunnen doorgestuurd worden naar e-mail of andere tools.",
      configure:
        "Je deelt je Tally-formulieren en gewenste pagina's. Nexavo embedt en test de flow.",
    }),
  },
  {
    slug: "fillout",
    name: "Fillout",
    iconSlug: "fillout",
    category: "formulieren",
    tagline: "Formulieren met logica en styling",
    cardDescription: "Fillout integreren voor leads en intake.",
    iconColor: "6366F1",
    ...content("Fillout", "formulieren", {
      overview:
        "Fillout biedt moderne formulieren met conditionele logica. Nexavo koppelt Fillout aan je website.",
      howItWorks:
        "Formulieren passen zich aan op basis van antwoorden. Data stroomt naar je CRM, e-mail of automations.",
      configure:
        "We bespreken je Fillout-formulieren en koppelingen. Nexavo embedt en test inzendingen.",
    }),
  },

  // Automatisering
  {
    slug: "zapier",
    name: "Zapier",
    iconSlug: "zapier",
    category: "automatisering",
    tagline: "Koppel duizenden apps aan elkaar",
    cardDescription: "Automatiseer workflows tussen je website en tools.",
    ...content("Zapier", "automatisering", {
      overview:
        "Zapier verbindt je website met duizenden andere tools. Nexavo richt Zaps in voor je belangrijkste processen.",
      howItWorks:
        "Een trigger op je site, zoals een formulier of boeking, start acties in andere apps. Geen handmatig kopiëren meer.",
      configure:
        "We bespreken je Zapier-account, gewenste workflows en triggers. Nexavo bouwt en test elke Zap.",
    }),
  },
  {
    slug: "make",
    name: "Make",
    iconSlug: "make",
    category: "automatisering",
    tagline: "Visuele automatisering met Make",
    cardDescription: "Complexe workflows bouwen met Make (Integromat).",
    ...content("Make", "automatisering", {
      overview:
        "Make (voorheen Integromat) biedt krachtige visuele automatisering. Nexavo koppelt je website aan Make-scenario's.",
      howItWorks:
        "Data van formulieren, boekingen of betalingen stroomt automatisch door naar CRM, e-mail en andere systemen.",
      configure:
        "We stemmen je Make-account, scenario's en triggers af. Nexavo bouwt en test de flows.",
    }),
  },
  {
    slug: "n8n",
    name: "n8n",
    iconSlug: "n8n",
    category: "automatisering",
    tagline: "Open-source workflow automatisering",
    cardDescription: "n8n koppelen voor flexibele automatiseringen.",
    ...content("n8n", "automatisering", {
      overview:
        "n8n is een flexibel open-source automatiseringplatform. Nexavo koppelt je website aan n8n-workflows.",
      howItWorks:
        "Custom workflows verbinden je site met interne systemen, databases en externe API's. Volledige controle over je data.",
      configure:
        "We bespreken je n8n-setup, gewenste workflows en hosting. Nexavo bouwt en test de koppelingen.",
    }),
  },
];

export const integrationEntries: Integration[] = seeds.map((seed) => ({
  builtBy: "Nexavo",
  verified: seed.verified ?? true,
  overview: seed.overview ?? "",
  howItWorks: seed.howItWorks ?? "",
  configure: seed.configure ?? "",
  ...seed,
}));

export const pricingFeaturedSlugs = [
  "calendly",
  "google-calendar",
  "whatsapp",
  "meta",
  "tiktok",
  "mailchimp",
  "mollie",
  "sumup",
  "google-analytics",
  "google-reviews",
  "google-maps",
  "zapier",
];
