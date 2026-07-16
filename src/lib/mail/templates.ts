import type { MailTemplate, MailTemplateVars } from "./types";
import { greeting, company, renderMailParts } from "./base";

function tpl(
  id: MailTemplate["id"],
  subject: string,
  description: string,
  build: (vars: MailTemplateVars) => ReturnType<MailTemplate["render"]>,
): MailTemplate {
  return { id, subject, description, render: build };
}

export const MAIL_TEMPLATES: MailTemplate[] = [
  tpl("account_invitation", "Je Nexavo klantportaal staat klaar", "Uitnodiging nieuwe klant", (vars) => {
    const subj = "Je Nexavo klantportaal staat klaar";
    const { html, text } = renderMailParts(
      `Welkom bij Nexavo, ${greeting(vars)}`,
      [
        `Je account voor ${company(vars)} is aangemaakt. Via het klantportaal volg je de voortgang van je website, beheer je facturen en dien je supportvragen in.`,
        "Klik op de knop hieronder om je account te activeren en je intake te starten.",
      ],
      vars,
      { label: "Account activeren", hrefKey: "portalLink" },
    );
    return { subject: subj, html, text };
  }),

  tpl("intake_reminder", "Herinnering: rond je Nexavo intake af", "Intake reminder (4+ open stappen)", (vars) => {
    const subj = "Herinnering: rond je Nexavo intake af";
    const { html, text } = renderMailParts(
      `Nog even afronden, ${greeting(vars)}`,
      [
        `Je bent al begonnen met je intake voor ${company(vars)}. De volgende onderdelen staan nog open:`,
        vars.openSteps ?? "—",
        "Rond je intake af zodat we direct met je website kunnen starten.",
      ],
      vars,
      { label: "Naar intake", hrefKey: "intakeLink" },
    );
    return { subject: subj, html, text };
  }),

  tpl("password_reset", "Wachtwoord opnieuw instellen", "Wachtwoord reset", (vars) => {
    const subj = "Wachtwoord opnieuw instellen";
    const { html, text } = renderMailParts(
      "Wachtwoord opnieuw instellen",
      [
        `Hoi ${greeting(vars)}, je hebt een verzoek ingediend om je wachtwoord te resetten.`,
        "Deze link is 60 minuten geldig. Heb je dit niet aangevraagd? Negeer dit bericht — je wachtwoord blijft ongewijzigd.",
      ],
      vars,
      { label: "Wachtwoord instellen", hrefKey: "resetLink" },
    );
    return { subject: subj, html, text };
  }),

  tpl("intake_received", "Je intake is ontvangen", "Bevestiging intake", (vars) => {
    const subj = "Je intake is ontvangen";
    const { html, text } = renderMailParts(
      "Bedankt — we gaan aan de slag",
      [
        `Hoi ${greeting(vars)}, we hebben je intake voor ${company(vars)} ontvangen.`,
        "Ons team bekijkt je gegevens en neemt contact op over de volgende stappen. Je kunt de voortgang volgen in je klantportaal.",
      ],
      vars,
      { label: "Naar klantportaal", hrefKey: "portalLink" },
    );
    return { subject: subj, html, text };
  }),

  tpl("integration_requested", "Koppeling aangevraagd: [koppeling]", "Bevestiging koppeling klant", (vars) => {
    const name = vars.integrationName ?? "koppeling";
    const subj = `Koppeling aangevraagd: ${name}`;
    const { html, text } = renderMailParts(
      "Aanvraag ontvangen",
      [
        `Hoi ${greeting(vars)}, we hebben je aanvraag voor ${name} ontvangen.`,
        "Nexavo neemt dit in behandeling en houdt je op de hoogte via het klantportaal.",
      ],
      vars,
      { label: "Bekijk koppelingen", hrefKey: "portalLink" },
    );
    return { subject: subj.replace("[koppeling]", name), html, text };
  }),

  tpl(
    "integration_requested_admin",
    "Nieuwe koppeling aangevraagd",
    "Interne notificatie admin",
    (vars) => {
      const name = vars.integrationName ?? "—";
      const subj = `Nieuwe koppeling aangevraagd door ${company(vars)}`;
      const { html, text } = renderMailParts(
        "Nieuwe koppeling-aanvraag",
        [
          `Klant: ${company(vars)} (${vars.customerName ?? "—"})`,
          `Koppeling: ${name}`,
          `Vervaldatum/betaaltermijn: ${vars.dueDate ?? "—"}`,
        ],
        vars,
        { label: "Open in admin", hrefKey: "adminLink" },
      );
      return { subject: subj, html, text };
    },
  ),

  tpl("ticket_received", "We hebben je supportvraag ontvangen", "Ticket bevestiging", (vars) => {
    const subj = "We hebben je supportvraag ontvangen";
    const { html, text } = renderMailParts(
      `Ticket ${vars.ticketNumber ?? ""} ontvangen`,
      [
        `Hoi ${greeting(vars)}, bedankt voor je bericht. We reageren zo snel mogelijk.`,
        "Je kunt de status volgen in je klantportaal onder Tickets.",
      ],
      vars,
      { label: "Naar tickets", hrefKey: "portalLink" },
    );
    return { subject: subj, html, text };
  }),

  tpl("ticket_replied", "Reactie op je supportvraag", "Ticket antwoord", (vars) => {
    const subj = "Reactie op je supportvraag";
    const { html, text } = renderMailParts(
      `Update op ticket ${vars.ticketNumber ?? ""}`,
      [
        `Hoi ${greeting(vars)}, er is een reactie geplaatst op je supportvraag.`,
        "Bekijk het volledige antwoord in je klantportaal.",
      ],
      vars,
      { label: "Bekijk reactie", hrefKey: "portalLink" },
    );
    return { subject: subj, html, text };
  }),

  tpl("invoice_available", "Nieuwe factuur beschikbaar in je Nexavo portaal", "Factuur beschikbaar", (vars) => {
    const subj = "Nieuwe factuur beschikbaar in je Nexavo portaal";
    const { html, text } = renderMailParts(
      `Factuur ${vars.invoiceNumber ?? ""}`,
      [
        `Hoi ${greeting(vars)}, er staat een nieuwe factuur klaar voor ${company(vars)}.`,
        `Bedrag: ${vars.amount ?? "—"} · Vervaldatum: ${vars.dueDate ?? "—"}`,
        "Je kunt de factuur bekijken en betalen via het klantportaal.",
      ],
      vars,
      { label: "Naar facturatie", hrefKey: "portalLink" },
    );
    return { subject: subj, html, text };
  }),

  tpl("payment_reminder", "Herinnering openstaande betaling", "Betalingsherinnering", (vars) => {
    const subj = "Herinnering openstaande betaling";
    const { html, text } = renderMailParts(
      "Openstaande betaling",
      [
        `Hoi ${greeting(vars)}, er staat nog een openstaande betaling voor ${company(vars)}.`,
        `Factuur ${vars.invoiceNumber ?? "—"} · ${vars.amount ?? "—"} · vervalt op ${vars.dueDate ?? "—"}`,
        "Betaal eenvoudig via het klantportaal.",
      ],
      vars,
      { label: "Nu betalen", hrefKey: "portalLink" },
    );
    return { subject: subj, html, text };
  }),
];

export function getMailTemplate(id: MailTemplate["id"]): MailTemplate | undefined {
  return MAIL_TEMPLATES.find((t) => t.id === id);
}

export function getDemoMailVars(): MailTemplateVars {
  return {
    customerName: "Lisa",
    companyName: "Jouw Bedrijf BV",
    portalLink: "https://nexavo.works/portal",
    intakeLink: "https://nexavo.works/portal/stap/bedrijfsgegevens",
    resetLink: "https://nexavo.works/portal/login?reset=demo",
    invoiceNumber: "NX-2026-00001",
    amount: "€1.495,00 excl. btw",
    dueDate: "28 juli 2026",
    packageName: "Startpakket",
    integrationName: "Google Calendar",
    ticketNumber: "NX-T-1042",
    openSteps: "• Media & huisstijl\n• Facturatie & voorwaarden\n• Betalen & versturen",
    adminLink: "https://nexavo.works/admin/aanvragen",
  };
}
