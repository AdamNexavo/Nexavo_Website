import type { ClientAccount } from "./types";
import { getMaintenanceById, getPlanById } from "./constants";
import { getClientReferenceNumber } from "./helpers";
import { pricingPackages } from "@/data/pricing";

function planScopeBlock(planId: string): string[] {
  const pkg = pricingPackages.find((p) => p.id === planId);
  if (!pkg) return ["- Bouw binnen de scope van het gekozen pakket."];
  return [
    `- Pakket: ${pkg.name} (${pkg.price}, ${pkg.priceDetail ?? "excl. btw"})`,
    `- Scope-beschrijving: ${pkg.description}`,
    ...pkg.features.map((f) => `  • ${f}`),
  ];
}

export function buildWebsitePrompt(client: ClientAccount): string {
  const { onboarding: o, package: pkg, user } = client;
  const plan = getPlanById(pkg.planId);
  const maintenance = getMaintenanceById(pkg.maintenanceId ?? "plus");
  const clientRef = getClientReferenceNumber(client);
  const company = o.company.name || client.companyName;
  const contactEmail = o.company.email || client.email;
  const contactPhone = o.company.phone || user.phone || "";

  const openingHours = o.openingHours;
  let hoursText = "Niet opgegeven";
  if (openingHours?.scheduleType === "other" && openingHours.otherNote) {
    hoursText = openingHours.otherNote;
  } else if (openingHours?.days) {
    const dayLabels: Record<string, string> = {
      mon: "Ma", tue: "Di", wed: "Wo", thu: "Do", fri: "Vr", sat: "Za", sun: "Zo",
    };
    hoursText = Object.entries(openingHours.days)
      .map(([key, day]) => {
        if (day?.alwaysOpen) return `${dayLabels[key] ?? key}: altijd open`;
        if (day?.closed) return `${dayLabels[key] ?? key}: gesloten`;
        return `${dayLabels[key] ?? key}: ${day?.open ?? "?"}–${day?.close ?? "?"}`;
      })
      .join(" · ");
  }

  const lines: string[] = [
    "═══════════════════════════════════════════════════════════════",
    `  NEXAVO WEBSITE BUILD — ${company.toUpperCase()}`,
    "═══════════════════════════════════════════════════════════════",
    "",
    "Je bent een senior frontend developer bij Nexavo. Bouw een professionele,",
    "conversiegerichte website voor een Nederlands MKB/servicebedrijf.",
    "Volg exact de Nexavo designstandaarden (Attio/Framer-inspired, premium clean).",
    "",
    "=== PROJECT IDENTITEIT ===",
    `Klantnummer: ${clientRef}`,
    `Bedrijfsnaam: ${company}`,
    `Contactpersoon: ${o.company.contactPerson || `${user.firstName} ${user.lastName}`}`,
    `E-mail: ${contactEmail}`,
    `Telefoon: ${contactPhone || "Niet opgegeven"}`,
    `Branche: ${o.company.industry || "Niet opgegeven"}`,
    `Locatie: ${o.company.location || "Niet opgegeven"}`,
    `Doelgroep: ${o.company.targetAudience || "Niet opgegeven"}`,
    `Gewenst domein: ${o.company.desiredDomain || "Nog te bepalen"}`,
    `Bestaande website: ${o.company.existingWebsite || "Geen"}`,
    "",
    "=== BEDRIJFSVERHAAL ===",
    o.company.aboutCompany || o.company.description || "Geen uitgebreid verhaal opgegeven.",
    "",
    "=== PAKKET & SCOPE ===",
    `Websitepakket: ${plan?.name ?? pkg.planName} (${plan?.price ?? pkg.planPrice ?? "—"}, excl. btw)`,
    `Onderhoud: ${maintenance?.name ?? pkg.maintenanceName ?? "Plus Beheer"} (${maintenance?.price ?? pkg.monthlyPrice}/maand, excl. btw)`,
    "",
    "Scope-grenzen (bouw ALLEEN wat in dit pakket hoort):",
    ...planScopeBlock(pkg.planId),
    "",
    "=== DOELEN & CONVERSIE ===",
    ...(o.goals.length ? o.goals.map((g) => `- ${g}`) : ["- Standaard: leads genereren, vertrouwen opbouwen, contact stimuleren"]),
    "",
    "=== PAGINA'S & SECTIES ===",
    ...(o.desiredPages.length ? o.desiredPages.map((p) => `- ${p}`) : ["- Homepage", "- Over ons", "- Diensten", "- Contact"]),
    o.customPages ? `- Extra pagina's/wensen: ${o.customPages}` : "",
    "",
    "=== TONE OF VOICE & STIJL ===",
    `Tone of voice: ${o.toneOfVoice || "Professioneel, direct, vertrouwenwekkend"}`,
    `Gewenste uitstraling: ${o.stylePreference || "Premium / clean / modern"}`,
    "Stijlreferentie Nexavo: Attio/Framer — border-first, minimale schaduwen, veel witruimte",
    "",
    "=== BRANDING & KLEUREN ===",
    `Hoofdkleur (primary): ${o.colors.primary}`,
    `Secundaire kleur: ${o.colors.secondary}`,
    `Accentkleur: ${o.colors.accent}`,
    o.colors.extra ? `Extra kleur: ${o.colors.extra}` : "",
    `Kleurenpalet: ${o.colors.palette.join(", ")}`,
    "",
    "Pas kleuren toe op: CTA-knoppen, links, accenten, badges, hover-states.",
    "Behoud Nexavo layout/spacing/typografie — vervang alleen brand-kleuren.",
    "",
    "=== OPENINGSTIJDEN ===",
    hoursText,
    "",
    "=== MEDIA & ASSETS ===",
    o.media.length
      ? o.media.map((m) => `- ${m.name} (${m.type}, ${Math.round(m.size / 1024)} KB)`).join("\n")
      : "- Geen media geüpload — gebruik professionele placeholders tot assets beschikbaar zijn",
    o.largeFilesSubmitted ? "- Grote bestanden per e-mail aangeleverd (check klantnummer in mailbox)" : "",
    "",
    "=== REFERENTIEWEBSITES ===",
    ...(o.referenceWebsites.filter(Boolean).length
      ? o.referenceWebsites.filter(Boolean).map((u) => `- ${u}`)
      : ["- Geen referenties — volg Nexavo premium standaard"]),
    o.referenceNotes ? `Opmerkingen: ${o.referenceNotes}` : "",
    "Match layout-dichtheid en premium gevoel, NOOIT letterlijk kopiëren.",
    "",
    "=== KOPPELINGEN & AUTOMATISERINGEN ===",
    ...(o.integrations.length ? o.integrations.map((i) => `- ${i}`) : ["- Geen koppelingen geselecteerd"]),
    "",
  ];

  if (o.automationDetails.booking) {
    lines.push(
      "Boekingskalender:",
      `- Bestaande tool: ${o.automationDetails.booking.existingTool || o.automationDetails.booking.toolName || "—"}`,
      `- Herinneringen: ${o.automationDetails.booking.reminders ? "Ja" : "Nee"}`,
      `- Reviews koppelen: ${o.automationDetails.booking.linkReviews ? "Ja" : "Nee"}`,
      "",
    );
  }
  if (o.automationDetails.reviews) {
    lines.push(
      "Review management:",
      `- Verzendmoment: ${o.automationDetails.reviews.sendMoment || "—"}`,
      `- Kanaal: ${o.automationDetails.reviews.channel || "—"}`,
      `- Negatieve reviews intern: ${o.automationDetails.reviews.internalNegative ? "Ja" : "Nee"}`,
      `- Tonen op website: ${o.automationDetails.reviews.showOnWebsite ? "Ja" : "Nee"}`,
      "",
    );
  }
  if (o.automationDetails.chatbot) {
    lines.push(
      "AI-chatbot:",
      `- Veelgestelde vragen: ${o.automationDetails.chatbot.commonQuestions || "—"}`,
      `- Doorverwijzen naar: ${o.automationDetails.chatbot.referTo || "—"}`,
      `- Kennisbank: ${o.automationDetails.chatbot.knowledge || "—"}`,
      "",
    );
  }

  lines.push(
    "=== OPMERKINGEN KLANT ===",
    o.notes || "Geen aanvullende opmerkingen.",
    "",
    "═══════════════════════════════════════════════════════════════",
    "  NEXAVO DESIGN SYSTEM — VERPLICHT TOEPASSEN",
    "═══════════════════════════════════════════════════════════════",
    "",
    "TECH STACK:",
    "- React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui (Radix)",
    "- Framer Motion voor scroll-animaties (whileInView, once: true, fade-up)",
    "- Lucide icons · React Router · data-driven content in src/data/*",
    "",
    "TYPOGRAFIE:",
    "- Inter (sans) voor body en headings",
    "- Playfair Display (serif) voor accent-regel in dual-line titels",
    "- Patroon: NexDualLineTitle — regel 1 sans bold, regel 2 serif of paars accent",
    "- SectionBadge: kleine uppercase pill boven headings",
    "",
    "LAYOUT & SPACING:",
    "- nex-container (max ~1152px), nex-section (88–120px vertical padding)",
    "- scroll-mt voor fixed header offset",
    "- Afwisselende sectie-achtergronden: bg-background, #f5f5f7, #fafafa",
    "- Hairline dividers tussen secties",
    "",
    "COMPONENTEN & SURFACES:",
    "- Cards: rounded-2xl, 1px border, shadow-card, hover lift",
    "- Buttons: 12px radius, h-10/h-11, variant brand (paars) voor primary CTA",
    "- Outline/secondary voor secundaire acties",
    "- Subtle dot grids / radial purple blurs als achtergrond (aria-hidden)",
    "",
    "PAGINA-ARCHITECTUUR (pas aan op pakket-scope):",
    "",
    "Homepage (Start/Groei/Pro):",
    "  1. Hero — dual-line heading, primary CTA, trust element",
    "  2. Benefits — bento/grid met USP's",
    "  3. Diensten/overzicht — cards met iconen",
    "  4. Social proof — testimonials met paarse accent-balk links",
    "  5. Proces/werkwijze — 3 stappen",
    "  6. FAQ — accordion, 2-kolom layout",
    "  7. BottomCTA — contact/demo + footnote",
    "",
    "Funnel/One-page:",
    "  - Eén scroll-pagina: hero → benefits → social proof → FAQ → CTA",
    "  - Focus op één conversie-actie",
    "",
    "Universele shell:",
    "  - Fixed Header (transparant → wit bij scroll)",
    "  - Footer (#09090B, multi-column links)",
    "  - lang=\"nl\", semantic HTML, meta title + description",
    "",
    "CONVERSION & COPY:",
    "- Primary CTA: \"Plan een demo\" of \"Neem contact op\"",
    `- Contact: ${contactEmail}${contactPhone ? ` · ${contactPhone}` : ""}`,
    "- Alle copy in het Nederlands, MKB/service-business toon",
    `- Tone of voice: ${o.toneOfVoice || "professioneel, direct, vertrouwenwekkend"}`,
    "- Benefit-led headlines, geen feature-dumps",
    "- Trust signals: testimonials, process, FAQ",
    "",
    "AUTOMATISERING SHOWCASES (indien geselecteerd):",
    "- Booking: UI skeleton van boekingsflow (niet generieke stock foto's)",
    "- Reviews: widget mockup / review cards",
    "- Chatbot: chat-widget preview in hero of hoek",
    "- Integraties: logo strip + korte uitleg per tool",
    "",
    "TECHNISCHE EISEN:",
    "- Mobile-first responsive design",
    "- SEO: meta tags, heading hierarchy (h1→h2→h3), alt-teksten",
    "- Performance: lazy images, geen zware onnodige animaties",
    "- Accessibility: prefers-reduced-motion, aria-labels, focus states",
    "",
    "DATA-ARCHITECTUUR:",
    "- Content in src/data/* modules (niet hardcoded in page components)",
    "- Pages als dunne composers die sections importeren",
    "- Herbruikbare sections in src/components/sections/*",
    "",
    "═══════════════════════════════════════════════════════════════",
    "  BOUWINSTRUCTIES — START HIER",
    "═══════════════════════════════════════════════════════════════",
    "",
    `1. Begin met een overzicht van pagina's en secties voor ${company}.`,
    `2. Map elke gewenste pagina/sectie aan het ${plan?.name ?? pkg.planName}-pakket.`,
    "3. Genereer eerst de data-layer (content objecten), dan components, dan pages.",
    `4. Pas brand-kleuren toe: primary ${o.colors.primary}, secondary ${o.colors.secondary}, accent ${o.colors.accent}.`,
    "5. Bouw mobile-first, test op 375px en 1440px.",
    "6. Implementeer alle geselecteerde koppelingen visueel (mock UI waar geen API is).",
    "7. Eindig elke pagina met FAQ + BottomCTA.",
    "8. Lever productie-klaar code — geen placeholders behalve waar expliciet aangegeven.",
    "",
    "Doel: een website die eruitziet alsof Nexavo hem heeft gebouwd — premium, snel,",
    "conversiegericht, en perfect afgestemd op dit MKB-bedrijf.",
  );

  return lines.filter(Boolean).join("\n");
}
