import type { MailTemplateVars } from "./types";

const BRAND = "#7547F8";

function v(value: string | undefined, fallback = "—") {
  return value?.trim() ? value : fallback;
}

export function mailLayout({
  title,
  body,
  buttonLabel,
  buttonHref,
  footerNote,
}: {
  title: string;
  body: string;
  buttonLabel?: string;
  buttonHref?: string;
  footerNote?: string;
}): string {
  const button =
    buttonLabel && buttonHref
      ? `<p style="margin:28px 0 0"><a href="${buttonHref}" style="display:inline-block;background:${BRAND};color:#fff;text-decoration:none;padding:14px 28px;border-radius:999px;font-weight:600;font-size:15px">${buttonLabel}</a></p>`
      : "";

  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#F5F5F5;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#111111">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F5;padding:32px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #E5E5E5;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,0.06)">
        <tr><td style="padding:28px 32px 8px">
          <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:0.06em;color:${BRAND}">NEXAVO</p>
          <h1 style="margin:12px 0 0;font-size:24px;line-height:1.3;font-weight:600">${title}</h1>
        </td></tr>
        <tr><td style="padding:8px 32px 28px;font-size:15px;line-height:1.65;color:#4B5563">${body}${button}</td></tr>
        <tr><td style="padding:20px 32px;background:#FAFAFA;border-top:1px solid #E5E5E5;font-size:12px;color:#9CA3AF;line-height:1.5">
          ${footerNote ?? "Dit bericht is verzonden door Nexavo."}<br/>© Nexavo · Professionele websites voor MKB
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function renderMailParts(
  title: string,
  paragraphs: string[],
  vars: MailTemplateVars,
  button?: { label: string; hrefKey: keyof MailTemplateVars },
): { html: string; text: string } {
  const body = paragraphs.map((p) => `<p style="margin:0 0 14px">${p}</p>`).join("");
  const buttonHref = button ? v(vars[button.hrefKey]) : undefined;
  const html = mailLayout({
    title,
    body,
    buttonLabel: button?.label,
    buttonHref: buttonHref !== "—" ? buttonHref : undefined,
  });
  const text = [title, "", ...paragraphs, button ? `${button.label}: ${buttonHref}` : ""]
    .filter(Boolean)
    .join("\n");
  return { html, text };
}

export function greeting(vars: MailTemplateVars) {
  return v(vars.customerName, "daar");
}

export function company(vars: MailTemplateVars) {
  return v(vars.companyName, "je bedrijf");
}
