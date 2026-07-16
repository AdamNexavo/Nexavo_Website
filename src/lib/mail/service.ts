import type { ClientAccount } from "@/lib/portal/types";
import { getPortalTasks } from "@/lib/portal/helpers";
import { getMailTemplate } from "./templates";
import type { MailEvent, MailSendResult, MailTemplateId } from "./types";

const MAIL_FROM = import.meta.env.MAIL_FROM ?? "no-reply@nexavo.works";
const ADMIN_EMAIL = import.meta.env.ADMIN_NOTIFICATION_EMAIL ?? import.meta.env.VITE_PORTAL_ADMIN_EMAIL;

function appUrl(path = ""): string {
  const base = import.meta.env.VITE_APP_URL ?? window.location.origin;
  return `${base.replace(/\/$/, "")}${path}`;
}

export async function sendMailEvent(event: MailEvent): Promise<MailSendResult> {
  const template = getMailTemplate(event.type);
  if (!template) return { ok: false, error: `Onbekend mailtype: ${event.type}` };

  const rendered = template.render(event.vars);

  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: event.to,
        from: MAIL_FROM,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
      }),
    });

    const data = (await res.json()) as { ok?: boolean; mode?: string; message?: string; id?: string; error?: string };

    if (!res.ok) {
      return { ok: false, error: data.error ?? "Verzenden mislukt" };
    }

    if (data.mode === "demo") {
      return { ok: true, mode: "demo", message: data.message ?? "Demo-modus: e-mail niet verzonden." };
    }

    return { ok: true, mode: "sent", id: data.id };
  } catch {
    console.info("[mail:demo]", event.type, event.to, rendered.subject);
    return {
      ok: true,
      mode: "demo",
      message: "Geen mail-API bereikbaar — opgeslagen in demo-modus (console).",
    };
  }
}

export async function notifyIntegrationRequested(client: ClientAccount, integrationName: string) {
  const vars = {
    customerName: client.user.firstName,
    companyName: client.companyName,
    integrationName,
    portalLink: appUrl("/portal/koppelingen"),
    adminLink: appUrl("/admin/aanvragen"),
  };

  await sendMailEvent({ type: "integration_requested", to: client.email, vars });
  if (ADMIN_EMAIL) {
    await sendMailEvent({ type: "integration_requested_admin", to: ADMIN_EMAIL, vars });
  }
}

export async function maybeSendIntakeReminder(client: ClientAccount): Promise<MailSendResult | null> {
  const tasks = getPortalTasks(client);
  const started = tasks.some((t) => t.status === "partial" || t.status === "complete");
  const openCount = tasks.filter((t) => t.status !== "complete").length;
  if (!started || openCount < 4 || client.onboarding.completed) return null;

  const openSteps = tasks
    .filter((t) => t.status !== "complete")
    .map((t) => `• ${t.title}`)
    .join("\n");

  return sendMailEvent({
    type: "intake_reminder",
    to: client.email,
    vars: {
      customerName: client.user.firstName,
      companyName: client.companyName,
      intakeLink: appUrl("/portal"),
      openSteps,
    },
  });
}

export function previewMailTemplate(id: MailTemplateId, vars = {}) {
  const template = getMailTemplate(id);
  if (!template) return null;
  return template.render(vars);
}
