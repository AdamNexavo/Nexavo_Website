import { allKnowledgeArticles } from "@/data/knowledgeBase";
import { contactInfo } from "@/data/contact";
import { maintenancePackages, revisionExamples } from "@/data/maintenance";
import { pricingPackages, pricingFaqs } from "@/data/pricing";
import { homepageFaqs, contactFaqs } from "@/data/faq";
import { projects } from "@/data/projects";
import { allServices } from "@/data/services";
import { serviceDetails } from "@/data/serviceDetails";

export type KnowledgeChunk = {
  id: string;
  title: string;
  content: string;
  keywords: string[];
};

function chunk(
  id: string,
  title: string,
  content: string,
  keywords: string[] = [],
): KnowledgeChunk {
  return { id, title, content, keywords };
}

const articleChunks: KnowledgeChunk[] = allKnowledgeArticles.map((article) =>
  chunk(article.id, article.question, article.answer, [
    article.categoryTitle,
    article.categoryId,
  ]),
);

const faqChunks: KnowledgeChunk[] = [
  ...homepageFaqs.map((faq, index) =>
    chunk(`faq-home-${index}`, faq.question, faq.answer, ["faq", "homepage"]),
  ),
  ...contactFaqs.map((faq, index) =>
    chunk(`faq-contact-${index}`, faq.question, faq.answer, ["faq", "contact"]),
  ),
  ...pricingFaqs.map((faq, index) =>
    chunk(`faq-pricing-${index}`, faq.question, faq.answer, ["faq", "prijs", "pakket"]),
  ),
];

const pricingChunks: KnowledgeChunk[] = pricingPackages.map((pkg) =>
  chunk(
    `pkg-${pkg.id}`,
    `${pkg.name} — ${pkg.price}`,
    [
      pkg.description,
      pkg.priceDetail
        ? `Prijs: ${pkg.pricePrefix ? `${pkg.pricePrefix} ` : ""}${pkg.price} (${pkg.priceDetail})`
        : `Prijs: ${pkg.price}`,
      "Inbegrepen:",
      ...pkg.features.map((f) => `• ${f}`),
    ].join("\n"),
    ["pakket", "prijs", pkg.id, pkg.name.toLowerCase(), "website"],
  ),
);

const maintenanceChunks: KnowledgeChunk[] = maintenancePackages.map((pkg) =>
  chunk(
    `maint-${pkg.id}`,
    `Onderhoud: ${pkg.name} — ${pkg.price}`,
    [
      pkg.description,
      `Prijs: ${pkg.price} ${pkg.priceNote}`,
      pkg.highlights.join(" · "),
      "Inhoud:",
      ...pkg.features.map((f) => `• ${f}`),
    ].join("\n"),
    ["onderhoud", "beheer", "revisie", pkg.id, "hosting"],
  ),
);

const revisionChunk = chunk(
  "revision-policy",
  "Revisiebeleid Nexavo",
  [
    "Een revisie is een kleine wijziging aan iets wat al bestaat. Denk aan teksten aanpassen, afbeeldingen vervangen, openingstijden wijzigen, een knop aanpassen of een aangeleverd blogartikel plaatsen.",
    "",
    "Wel een revisie (inbegrepen in onderhoud waar van toepassing):",
    ...revisionExamples.included.map((item) => `• ${item}`),
    "",
    "Geen revisie, dit is meerwerk:",
    ...revisionExamples.notIncluded.map((item) => `• ${item}`),
    "",
    "Niet-gebruikte revisies of verwerkingstijd worden niet meegenomen naar de volgende maand.",
  ].join("\n"),
  ["revisie", "wijziging", "meerwerk", "onderhoud"],
);

const meerwerkChunk = chunk(
  "meerwerk-tarieven",
  "Meerwerk tarieven",
  [
    "Nieuwe pagina's, nieuwe secties, nieuwe functionaliteiten, automatiseringen, AI-chatbots, API-koppelingen, contentcreatie en spoedwerk vallen buiten standaard beheer.",
    "",
    "• Standaard meerwerk: vanaf €65 per uur",
    "• Technisch werk / development: vanaf €85 per uur",
    "• API-koppelingen, automatiseringen of AI-chatbots: vanaf €85 tot €110 per uur",
    "• Spoedwerk: vanaf €95 per uur",
    "",
    "Nexavo start pas met meerwerk nadat de klant akkoord heeft gegeven op de kosteninschatting of offerte.",
  ].join("\n"),
  ["meerwerk", "uur", "tarief", "spoed"],
);

const upsellChunks: KnowledgeChunk[] = [
  chunk(
    "upsell-website",
    "Website-uitbreidingen (losse modules)",
    [
      "• Extra eenvoudige pagina: €175 – €250",
      "• Extra uitgebreide pagina: €300 – €450",
      "• Extra landingspagina: vanaf €350",
      "• Nieuwe sectie op bestaande pagina: €100 – €200",
      "• Kleine website 2 pagina's: vanaf €995",
      "• Kleine website 3 pagina's: vanaf €1.195",
      "• Meerdere locaties pagina-opzet: vanaf €495",
      "• Locatiepagina per extra vestiging: €175 – €300",
      "• Kleine design-aanpassing: €100 – €250",
    ].join("\n"),
    ["uitbreiding", "pagina", "maatwerk"],
  ),
  chunk(
    "upsell-automation",
    "Automatiseringen (losse modules)",
    [
      "• Boekingskalender basis: vanaf €295",
      "• Boekingskalender uitgebreid: €450 – €750",
      "• Calendly-integratie basis: vanaf €195",
      "• Google Calendar-koppeling: vanaf €295",
      "• Reviewmanagement basis: vanaf €295",
      "• Reviewmanagement uitgebreid: €450 – €650",
      "• Automatische opvolgmail na formulier: vanaf €150",
      "• Formulier met extra logica: €250 – €450",
      "• Meerstaps aanvraagformulier: €350 – €650",
      "• Leadmelding naar e-mail: vanaf €150",
      "• Kleine maatwerk automatisering: vanaf €495",
      "• Uitgebreide maatwerk automatisering: vanaf €950",
    ].join("\n"),
    ["automatisering", "boeking", "review", "formulier", "calendly"],
  ),
  chunk(
    "upsell-chatbot",
    "AI & chatbot (losse modules)",
    [
      "• Webchat-widget basis: vanaf €150",
      "• AI-chatbot basis: vanaf €495",
      "• AI-chatbot getraind op FAQ en diensten: €650 – €950",
      "• AI-chatbot met boekingsflow: €850 – €1.250",
      "• AI-chatbot met reviewflow: €850 – €1.250",
      "• AI-chatbot met meerdere flows: vanaf €1.250",
      "• Chatbot optimalisatieronde: vanaf €195",
      "• Chatbot opnieuw trainen: vanaf €150",
    ].join("\n"),
    ["chatbot", "ai", "webchat"],
  ),
  chunk(
    "upsell-combinaties",
    "Voorbeeld pakketcombinaties",
    [
      "Funnel + boekingskalender: vanaf €995 – €1.095 eenmalig",
      "Funnel + reviewmanagement: vanaf €1.195 eenmalig",
      "Kleine website 2 pagina's: vanaf €995 eenmalig",
      "Kleine website 3 pagina's + reviewmanagement: vanaf €1.495 eenmalig",
      "Start website + boekingskalender: vanaf €1.795 eenmalig",
      "Website + AI-chatbot basis: vanaf €1.995 eenmalig",
      "Groei + AI-chatbot: vanaf €2.695 – €2.745 eenmalig",
      "Bestaande website uitbreiden met booking + reviews: vanaf €895 eenmalig",
    ].join("\n"),
    ["combinatie", "offerte", "pakket"],
  ),
];

const serviceChunks: KnowledgeChunk[] = allServices.map((service) =>
  chunk(
    `service-${service.slug}`,
    `Dienst: ${service.title}`,
    [
      service.tagline,
      service.overview,
      `Hoe het werkt: ${service.howItWorks}`,
      `Highlights: ${service.highlights.join(", ")}`,
    ].join("\n"),
    ["dienst", service.slug, service.title.toLowerCase()],
  ),
);

const serviceDetailChunks: KnowledgeChunk[] = Object.entries(serviceDetails).flatMap(
  ([slug, detail]) => [
    chunk(
      `detail-${slug}-overview`,
      `${slug}: aanbevolen pakketten`,
      [
        `Aanbevolen pakketten: ${detail.recommendedPlans.join(", ")}`,
        detail.pricingTeaser,
        ...detail.sections.map(
          (s) =>
            `${s.title}: ${s.paragraphs.join(" ")}${s.bullets ? ` (${s.bullets.join("; ")})` : ""}`,
        ),
      ].join("\n"),
      [slug, "dienst", "uitleg"],
    ),
    ...detail.faqs.map((faq, index) =>
      chunk(`detail-${slug}-faq-${index}`, faq.question, faq.answer, [
        slug,
        "faq",
      ]),
    ),
  ],
);

const contactChunk = chunk(
  "contact-info",
  "Contactgegevens Nexavo",
  [
    `E-mail verkoop: ${contactInfo.email.sales}`,
    `E-mail support: ${contactInfo.email.support}`,
    `Telefoon: ${contactInfo.primaryPhone}`,
    `Bereikbaar: ${contactInfo.days}, ${contactInfo.hours}`,
    `Reactietijd: ${contactInfo.responseTime}`,
    `Klantportaal: ${contactInfo.portal}`,
    `Demo boeken: ${contactInfo.bookingUrl}`,
    `Adres: ${contactInfo.address.company}, ${contactInfo.address.city}, ${contactInfo.address.country}`,
  ].join("\n"),
  ["contact", "bereikbaar", "support", "demo", "bellen", "mail"],
);

const projectsChunk = chunk(
  "projecten",
  "Recente Nexavo projecten",
  projects
    .map(
      (p) =>
        `• ${p.title} (${p.type}) — ${p.href.replace(/^https?:\/\//, "")}: ${p.description}`,
    )
    .join("\n"),
  ["project", "case", "portfolio", "voorbeeld"],
);

const companyChunk = chunk(
  "over-nexavo",
  "Over Nexavo",
  [
    "Nexavo bouwt professionele websites met automatiseringen voor dienstverlenende ondernemers.",
    "Focus: conversiegerichte websites, boekingskalenders, reviewmanagement, AI-chatbots en koppelingen.",
    "Geen webshops. Wel snelle oplevering via de vaste Blueprint-workflow (7 tot 10 dagen).",
    "Alle websitepakketten zijn eenmalig exclusief btw. Onderhoud kies je apart.",
    "Werkwijze: demo/advies → Blueprint-workflow → oplevering. Jij levert content, wij regelen design, techniek en hosting.",
    "Veel klanten: salons, wellness, gyms, personal trainers, coaches, lokale dienstverleners.",
  ].join("\n"),
  ["nexavo", "bedrijf", "werkwijze", "blueprint", "wie"],
);

export const knowledgeChunks: KnowledgeChunk[] = [
  ...articleChunks,
  ...faqChunks,
  ...pricingChunks,
  ...maintenanceChunks,
  revisionChunk,
  meerwerkChunk,
  ...upsellChunks,
  ...serviceChunks,
  ...serviceDetailChunks,
  contactChunk,
  projectsChunk,
  companyChunk,
];

export const suggestedQuestions = [
  "Help mij het juiste pakket kiezen",
  "Wat kost een normale website?",
  "Zit onderhoud erbij?",
  "Ik heb een kapsalon",
  "Wat is het verschil tussen Groei en Pro?",
];
