import type { ClientAccount, TermsAcceptanceAudit } from "./types";
import { generateId } from "./storage";
import { termsSections } from "@/data/legalContent";

export const TERMS_VERSION = "2026.1";

const CHECKBOX_TEXT =
  "Ik ga akkoord met de algemene voorwaarden van Nexavo en bevestig dat de ingevulde gegevens correct zijn.";

function extractPlainText(node: unknown): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractPlainText).join("\n");
  if (node && typeof node === "object" && "props" in (node as object)) {
    const children = (node as { props?: { children?: unknown } }).props?.children;
    return extractPlainText(children);
  }
  return "";
}

export function buildTermsSnapshotText(): string {
  return termsSections
    .map((section) => `${section.title}\n${section.paragraphs.map(extractPlainText).join("\n")}`)
    .join("\n\n");
}

export async function captureTermsAcceptance(
  client?: ClientAccount,
  source: TermsAcceptanceAudit["source"] = "intake",
): Promise<TermsAcceptanceAudit> {
  let ipAddress = "onbekend (demo)";
  try {
    const res = await fetch("https://api.ipify.org?format=json", { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = (await res.json()) as { ip?: string };
      if (data.ip) ipAddress = data.ip;
    }
  } catch {
    /* offline */
  }

  const documentId = `NX-TERMS-${generateId().slice(0, 8).toUpperCase()}`;

  return {
    acceptedAt: new Date().toISOString(),
    ipAddress,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    customerName: client ? `${client.user.firstName} ${client.user.lastName}`.trim() : undefined,
    companyName: client?.companyName ?? client?.onboarding.company.name,
    email: client?.email,
    version: TERMS_VERSION,
    snapshotText: buildTermsSnapshotText(),
    source,
    checkboxText: CHECKBOX_TEXT,
    acceptedByName: client
      ? `${client.user.firstName} ${client.user.lastName}`.trim()
      : undefined,
    documentId,
  };
}

export function buildTermsAcceptanceDocumentHtml(audit: TermsAcceptanceAudit): string {
  const accepted = new Date(audit.acceptedAt).toLocaleString("nl-NL");
  return `<!DOCTYPE html>
<html lang="nl"><head><meta charset="utf-8"/><title>Acceptatie algemene voorwaarden</title>
<style>
body{font-family:system-ui,sans-serif;max-width:760px;margin:40px auto;padding:24px;color:#111}
h1{font-size:22px} .meta{font-size:13px;color:#6b7280;margin:16px 0;padding:16px;background:#f5f5f5;border-radius:12px}
.snapshot{white-space:pre-wrap;font-size:13px;line-height:1.6;border:1px solid #e5e5e5;border-radius:12px;padding:20px;margin-top:20px}
</style></head><body>
<h1>Acceptatie algemene voorwaarden</h1>
<div class="meta">
<p><strong>Document-ID:</strong> ${audit.documentId ?? "—"}</p>
<p><strong>Versie:</strong> ${audit.version ?? "—"}</p>
<p><strong>Geaccepteerd op:</strong> ${accepted}</p>
<p><strong>Klant:</strong> ${audit.customerName ?? "—"} (${audit.companyName ?? "—"})</p>
<p><strong>E-mail:</strong> ${audit.email ?? "—"}</p>
<p><strong>IP-adres:</strong> ${audit.ipAddress ?? "—"}</p>
<p><strong>Bron:</strong> ${audit.source ?? "—"}</p>
<p><strong>Akkoordverklaring:</strong> ${audit.checkboxText ?? "—"}</p>
</div>
<h2>Voorwaarden-snapshot (${audit.version})</h2>
<div class="snapshot">${(audit.snapshotText ?? "").replace(/</g, "&lt;")}</div>
</body></html>`;
}
