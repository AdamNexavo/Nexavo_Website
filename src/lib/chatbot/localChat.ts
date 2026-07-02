import { contactInfo } from "@/data/contact";
import { retrieveForConversation } from "./retrieve";
import type { ConversationMessage } from "./retrieve";

type Intent =
  | "greeting"
  | "package_advice"
  | "pricing"
  | "maintenance"
  | "revision"
  | "timeline"
  | "contact"
  | "chatbot"
  | "comparison"
  | "follow_up"
  | "general";

const GREETING_RE = /^(hoi|hey|hallo|goedemorgen|goedemiddag|goedenavond|dag)\b/i;
const FOLLOW_UP_RE =
  /\b(en |ook |dat |die |daar |verder|meer|duurder|goedkoper|groter|kleiner|verschil|wat zit|hoeveel kost)\b/i;

function detectIntent(query: string, messages: ConversationMessage[]): Intent {
  const q = query.toLowerCase();

  if (GREETING_RE.test(query.trim()) && messages.filter((m) => m.role === "user").length <= 1) {
    return "greeting";
  }

  if (FOLLOW_UP_RE.test(q) && messages.length > 2) return "follow_up";

  if (/\b(pakket|plan|funnel|start|groei|pro|maatwerk|welk|advies|aanbevel)\b/.test(q)) {
    return "package_advice";
  }
  if (/\b(verschil|vergelijk|of beter|tussen)\b/.test(q)) return "comparison";
  if (/\b(prijs|prijzen|kost|kosten|euro|€|betaal)\b/.test(q)) return "pricing";
  if (/\b(onderhoud|beheer|hosting|basis beheer|plus beheer|growth)\b/.test(q)) {
    return "maintenance";
  }
  if (/\b(revisie|wijziging|meerwerk|aanpass)\b/.test(q)) return "revision";
  if (/\b(snel|oplevering|live|klaar|dagen|levertijd)\b/.test(q)) return "timeline";
  if (/\b(contact|bellen|mail|bereikbaar|demo|afspraak maken)\b/.test(q)) return "contact";
  if (/\b(chatbot|ai|assistent)\b/.test(q)) return "chatbot";

  return "general";
}

function inferBusinessType(query: string): string | null {
  const q = query.toLowerCase();
  if (/\b(kapper|salon|barber|kapsalon)\b/.test(q)) return "kapper/salon";
  if (/\b(gym|fitness|personal trainer|coach|dansschool)\b/.test(q)) return "fitness/coaching";
  if (/\b(wellness|spa|massage|beauty)\b/.test(q)) return "wellness";
  if (/\b(funnel|campagne|lead|landing)\b/.test(q)) return "campagne/lead";
  if (/\b(starter|begin|nieuw bedrijf)\b/.test(q)) return "starter";
  return null;
}

function getLastTopic(messages: ConversationMessage[]): string | null {
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  if (!lastAssistant) return null;
  const text = lastAssistant.content.toLowerCase();
  if (/\bstart\b/.test(text)) return "start";
  if (/\bgroei\b/.test(text)) return "groei";
  if (/\bpro\b/.test(text)) return "pro";
  if (/\bfunnel\b/.test(text)) return "funnel";
  if (/\bonderhoud\b|\bbeheer\b/.test(text)) return "maintenance";
  if (/\brevisie\b/.test(text)) return "revision";
  return null;
}

function respondGreeting(): string {
  return `Hoi! Leuk dat je er bent. Ik help je graag met vragen over Nexavo: pakketten, prijzen, onderhoud of automatiseringen.

Vertel me gerust wat voor bedrijf je hebt en wat je online wilt bereiken, dan denk ik met je mee. Of stel direct een concrete vraag.`;
}

function respondPackageAdvice(query: string): string {
  const business = inferBusinessType(query);

  if (business === "kapper/salon" || business === "wellness") {
    return `Voor een ${business === "kapper/salon" ? "kapper of salon" : "wellnessbedrijf"} raad ik meestal Groei aan (€2.250 eenmalig, excl. btw). Daarmee krijg je een professionele website tot 8 pagina's, plus een boekingskalender en reviewmanagement. Klanten kunnen dan zelf online een afspraak plannen en je verzamelt automatisch reviews.

Wil je het simpeler houden zonder boekingen? Dan is Start (€1.495) een goede basis. Wil je ook een AI-chatbot voor veel klantvragen? Kijk dan naar Pro (€3.250).

Wat past het beste bij jou: alleen zichtbaarheid, of ook afspraken en reviews automatiseren?`;
  }

  if (business === "fitness/coaching") {
    return `Voor een gym, personal trainer of coach past Groei vaak goed (€2.250 eenmalig, excl. btw). Je krijgt een sterke website, online boekingen via een kalender en automatische reviewverzoeken na sessies.

Start (€1.495) werkt als je vooral een professionele site wilt zonder boekingssysteem. Pro (€3.250) is interessant als je veel vragen krijgt en een AI-chatbot wilt.

Boeken klanten nu vooral via WhatsApp of telefoon, of wil je dat ze direct op je site kunnen plannen?`;
  }

  if (business === "campagne/lead") {
    return `Voor een campagne of leadgeneratie is Funnel / One-page (vanaf €745 eenmalig, excl. btw) vaak de slimste keuze. Eén sterke pagina gericht op aanvragen, met contactformulier, webchat en basis opvolgmail.

Heb je meer pagina's nodig (diensten, over ons, contact)? Dan is Start (€1.495, tot 5 pagina's) logischer.

Wat is je hoofddoel: één actie (bijv. offerte aanvragen) of een volledige bedrijfswebsite?`;
  }

  return `Om het juiste pakket te adviseren, kijk ik naar je doel:

• Funnel (vanaf €745): één conversiepagina voor leads of campagnes
• Start (€1.495): complete basiswebsite, tot 5 pagina's
• Groei (€2.250): website + boekingen + reviews automatiseren
• Pro (€3.250): alles uit Groei + AI-chatbot en uitgebreide automatisering
• Maatwerk: specifieke combinaties op aanvraag

Wat voor bedrijf heb je en wil je vooral zichtbaarheid, online boekingen, of ook AI en automatisering?`;
}

function respondComparison(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("start") && q.includes("groei")) {
    return `Het verschil tussen Start en Groei:

Start (€1.495) is je complete basiswebsite: tot 5 pagina's, contactformulier, webchat en basis opvolgmail. Ideaal als je professioneel online wilt staan.

Groei (€2.250) bouwt daarop verder: tot 8 pagina's, boekingskalender, reviewmanagement, Calendly-koppeling en automatische opvolgmails. Perfect als klanten zelf online moeten kunnen boeken en je reviews wilt verzamelen.

Kort gezegd: Start = professionele website. Groei = website als groeimachine met afspraken en reviews.

Wil je dat klanten zelf online boeken? Dan is Groei de betere keuze.`;
  }

  if (q.includes("groei") && q.includes("pro")) {
    return `Groei vs Pro:

Groei (€2.250) automatiseert boekingen en reviews. Pro (€3.250) voegt daar een AI-chatbot, uitgebreide reviewflow, geavanceerde formulieren en klantopvolging aan toe. Ook tot 12 pagina's en prioriteit bij oplevering.

Pro is de keuze als je veel klantvragen krijgt en je website als volledig groeisysteem wilt inzetten.

Krijg je veel dezelfde vragen van bezoekers, of wil je vooral boekingen en reviews automatiseren?`;
  }

  return respondPackageAdvice(query);
}

function respondFollowUp(messages: ConversationMessage[]): string {
  const topic = getLastTopic(messages);
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const q = lastUser?.content.toLowerCase() ?? "";

  if (topic === "start" && /\b(groei|duurder|meer|groter)\b/.test(q)) {
    return respondComparison("start groei verschil");
  }
  if (topic === "groei" && /\b(pro|duurder|ai|chatbot)\b/.test(q)) {
    return respondComparison("groei pro verschil");
  }
  if (topic === "maintenance" || /\b(onderhoud|beheer)\b/.test(q)) {
    return respondMaintenance();
  }
  if (/\b(prijs|kost|euro|€)\b/.test(q)) {
    if (topic === "funnel") return `Funnel / One-page kost vanaf €745 eenmalig, exclusief btw. Onderhoud kies je apart (minimaal Basis Beheer €59/pm). Wil je weten wat er precies in zit?`;
    if (topic === "start") return `Start kost €1.495 eenmalig, exclusief btw. Daarin zitten tot 5 pagina's, hosting, SSL, contactformulier en oplevering binnen 7 dagen. Onderhoud is apart (vanaf €59/pm).`;
    if (topic === "groei") return `Groei kost €2.250 eenmalig, exclusief btw. Inclusief boekingskalender en reviewmanagement. Onderhoud apart vanaf €59/pm.`;
    if (topic === "pro") return `Pro kost €3.250 eenmalig, exclusief btw. Inclusief AI-chatbot en uitgebreide automatisering. Onderhoud apart vanaf €59/pm.`;
  }

  const chunks = retrieveForConversation(messages, 3);
  if (chunks[0]) {
    return `Goede vervolgvraag. ${chunks[0].content.split("\n").slice(0, 4).join(" ")}

Wil je dat ik een specifiek pakket verder uitwerk, of heb je een andere vraag?`;
  }

  return `Kun je je vraag iets specifieker stellen? Dan kan ik gerichter antwoorden. Je kunt ook vragen over pakketten, prijzen, onderhoud of onze werkwijze.`;
}

function respondMaintenance(): string {
  return `Nexavo heeft drie onderhoudspakketten (exclusief btw, los van je websitepakket):

• Basis Beheer €59/pm: 5 kleine wijzigingen, 60 minuten, 1 maandelijkse ronde. Minimaal verplicht als wij je site hosten.
• Plus Beheer €99/pm: 10 wijzigingen, 120 minuten, wekelijkse verwerking.
• Growth Beheer €199/pm: 20 wijzigingen, 240 minuten, prioriteit bij support.

Een revisie is een kleine wijziging (tekst, foto, openingstijden). Nieuwe pagina's of functionaliteit is meerwerk.

Hoe vaak verwacht je wijzigingen op je website?`;
}

function respondRevision(): string {
  return `Een revisie is een kleine aanpassing aan iets dat al bestaat: tekst wijzigen, foto vervangen, openingstijden aanpassen, een blogartikel plaatsen of een video embedden.

Geen revisie (wel mogelijk als meerwerk): nieuwe pagina's, nieuwe secties, koppelingen, automatiseringen, AI-chatbots of spoedwerk. Meerwerk start vanaf €65 per uur, altijd na jouw akkoord op een offerte.

Je revisies zitten in je onderhoudspakket (5, 10 of 20 per maand afhankelijk van het pakket). Ongebruikte revisies gaan niet mee naar de volgende maand.

Heb je een specifieke wijziging in gedachten?`;
}

function respondTimeline(): string {
  return `Na complete input leveren we meestal snel op:

• Funnel, Start en Groei: binnen 7 dagen
• Pro: binnen 7 tot 10 dagen (met prioriteit)

We werken via een vaste Blueprint-workflow. Jij levert content en feedback, wij regelen design, bouw en techniek. Hoe sneller je input compleet is, hoe sneller we live kunnen.

Heb je een specifieke deadline in gedachten?`;
}

function respondContact(): string {
  return `Je bereikt Nexavo op verschillende manieren:

• E-mail: ${contactInfo.email.sales} (verkoop) of ${contactInfo.email.support} (support)
• Telefoon: ${contactInfo.primaryPhone} (${contactInfo.days}, ${contactInfo.hours})
• Gratis demo: ${contactInfo.bookingUrl}
• Contactformulier op de website

We reageren meestal ${contactInfo.responseTime.toLowerCase()}. Bestaande klanten kunnen ook inloggen op ${contactInfo.portal}.

Wil je een demo inplannen of heb je een concrete vraag over je situatie?`;
}

function respondChatbot(): string {
  return `Een AI-chatbot kun je op verschillende manieren afnemen:

• In Pro-pakket (€3.250 eenmalig): AI-chatbot standaard inbegrepen, getraind op jouw FAQ, diensten en openingstijden.
• Losse module: AI-chatbot basis vanaf €495, getraind op FAQ vanaf €650-€950, met boekingsflow vanaf €850-€1.250.

De chatbot die je nu gebruikt is een voorbeeld van wat mogelijk is. Voor productie op jouw site trainen we hem op jouw eigen bedrijfsinformatie.

Wil je een chatbot als onderdeel van een nieuwe website, of op een bestaande site?`;
}

function respondFromChunks(messages: ConversationMessage[]): string {
  const chunks = retrieveForConversation(messages, 4);
  if (chunks.length === 0) {
    return `Daar heb ik geen specifieke informatie over. Voor een persoonlijk antwoord kun je mailen naar ${contactInfo.email.sales} of een gratis demo plannen via het contactformulier.

Kan ik je helpen met pakketten, prijzen, onderhoud of onze werkwijze?`;
  }

  const primary = chunks[0];
  const summary = primary.content
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("•"))
    .slice(0, 3)
    .join(" ");

  const bullets = primary.content
    .split("\n")
    .filter((line) => line.startsWith("•"))
    .slice(0, 4);

  let answer = summary || primary.content.slice(0, 400);

  if (bullets.length > 0) {
    answer += `\n\n${bullets.join("\n")}`;
  }

  if (chunks.length > 1 && chunks[1].score > chunks[0].score * 0.6) {
    const extra = chunks[1].content.split("\n")[0];
    if (extra) answer += `\n\n${extra}`;
  }

  answer += `\n\nHeb je hier nog vragen over, of wil je advies voor jouw situatie?`;
  return answer.trim();
}

export function generateLocalResponse(
  messages: ConversationMessage[],
): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return respondGreeting();

  const intent = detectIntent(lastUser.content, messages);

  switch (intent) {
    case "greeting":
      return respondGreeting();
    case "package_advice":
      return respondPackageAdvice(lastUser.content);
    case "comparison":
      return respondComparison(lastUser.content);
    case "follow_up":
      return respondFollowUp(messages);
    case "maintenance":
      return respondMaintenance();
    case "revision":
      return respondRevision();
    case "timeline":
      return respondTimeline();
    case "contact":
      return respondContact();
    case "chatbot":
      return respondChatbot();
    case "pricing":
      if (/\b(onderhoud|beheer)\b/i.test(lastUser.content)) return respondMaintenance();
      return respondPackageAdvice(lastUser.content);
    default:
      return respondFromChunks(messages);
  }
}
