import type { ClientAccount, PaymentRecord } from "./types";
import { generateId } from "./storage";
import { addPaymentTermDays, getClientReferenceNumber, PAYMENT_TERM_DAYS } from "./helpers";

const INVOICE_COUNTER_KEY = "nexavo_invoice_counter";

function readCounter(): { year: number; seq: number } {
  try {
    const raw = localStorage.getItem(INVOICE_COUNTER_KEY);
    if (raw) return JSON.parse(raw) as { year: number; seq: number };
  } catch {
    /* ignore */
  }
  return { year: new Date().getFullYear(), seq: 0 };
}

function writeCounter(data: { year: number; seq: number }) {
  localStorage.setItem(INVOICE_COUNTER_KEY, JSON.stringify(data));
}

/** Officieel factuurnummer: NX-2026-00001 */
export function nextInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const counter = readCounter();
  if (counter.year !== year) {
    counter.year = year;
    counter.seq = 0;
  }
  counter.seq += 1;
  writeCounter(counter);
  return `NX-${year}-${String(counter.seq).padStart(5, "0")}`;
}

export function getClientPreviewHref(client: ClientAccount): string | null {
  const raw = client.progress.previewUrl ?? client.websiteUrl;
  if (!raw?.trim()) return null;
  return raw.startsWith("http") ? raw : `https://${raw.replace(/^\/\//, "")}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildInvoiceHtml(payment: PaymentRecord, client: ClientAccount): string {
  const billing = client.billingInfo ?? {};
  const invoiceNo = payment.invoiceNumber ?? "Concept";
  const issued = payment.issuedAt ?? payment.createdAt ?? new Date().toISOString();
  const due = payment.dueDate;
  const isRecurring = payment.billingType === "recurring";

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <title>Factuur ${escapeHtml(invoiceNo)}</title>
  <style>
    body { font-family: system-ui, sans-serif; color: #111; max-width: 720px; margin: 40px auto; padding: 24px; }
    h1 { font-size: 22px; margin: 0 0 4px; }
    .muted { color: #6b7280; font-size: 13px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 28px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; }
    th, td { text-align: left; padding: 10px 8px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
    th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: #9ca3af; }
    .total { font-size: 18px; font-weight: 700; text-align: right; margin-top: 16px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; background: #ede9fe; color: #7547f8; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;">
    <div>
      <h1>Nexavo</h1>
      <p class="muted">Factuur ${escapeHtml(invoiceNo)}</p>
    </div>
    <span class="badge">${payment.status === "paid" ? "Betaald" : isRecurring ? "Periodiek" : "Eenmalig"}</span>
  </div>
  <div class="grid">
    <div>
      <p class="muted">Factuur aan</p>
      <p><strong>${escapeHtml(billing.companyName ?? client.companyName)}</strong></p>
      <p class="muted">${escapeHtml(billing.address ?? "")} ${escapeHtml(billing.houseNumber ?? "")}</p>
      <p class="muted">${escapeHtml(billing.postcode ?? "")} ${escapeHtml(billing.city ?? "")}</p>
      <p class="muted">${escapeHtml(billing.email ?? client.email)}</p>
      <p class="muted">Klantnr. ${escapeHtml(getClientReferenceNumber(client))}</p>
    </div>
    <div>
      <p class="muted">Factuurdatum</p>
      <p>${new Date(issued).toLocaleDateString("nl-NL")}</p>
      <p class="muted" style="margin-top:12px">Vervaldatum</p>
      <p>${new Date(due).toLocaleDateString("nl-NL")} (${PAYMENT_TERM_DAYS} dagen)</p>
    </div>
  </div>
  <table>
    <thead><tr><th>Omschrijving</th><th>Type</th><th style="text-align:right">Bedrag</th></tr></thead>
    <tbody>
      <tr>
        <td>${escapeHtml(payment.description)}</td>
        <td>${isRecurring ? "Onderhoud (maandelijks)" : "Eenmalig"}</td>
        <td style="text-align:right">${escapeHtml(payment.amount)} excl. btw</td>
      </tr>
    </tbody>
  </table>
  <p class="total">Totaal: ${escapeHtml(payment.amount)} excl. btw</p>
  <p class="muted" style="margin-top:32px">Betaling via Mollie (iDEAL). Na betaling ontvang je een bevestiging per e-mail.</p>
</body>
</html>`;
}

export function buildInvoicePdfDataUrl(payment: PaymentRecord, client: ClientAccount): string {
  return `data:text/html;charset=utf-8,${encodeURIComponent(buildInvoiceHtml(payment, client))}`;
}

export function attachInvoicePdf(payment: PaymentRecord, client: ClientAccount): PaymentRecord {
  if (payment.pdfDataUrl) return payment;
  return { ...payment, pdfDataUrl: buildInvoicePdfDataUrl(payment, client) };
}

export function createOneTimePackageInvoice(
  client: ClientAccount,
  planName: string,
  amount: string,
): PaymentRecord {
  const now = new Date();
  const record: PaymentRecord = {
    id: generateId(),
    invoiceNumber: nextInvoiceNumber(),
    description: `${planName} — eenmalig`,
    amount,
    billingType: "one_time",
    status: "open",
    dueDate: addPaymentTermDays(now).toISOString(),
    issuedAt: now.toISOString(),
    createdAt: now.toISOString(),
  };
  return attachInvoicePdf(record, client);
}

export function createRecurringMaintenanceInvoice(
  client: ClientAccount,
  description: string,
  amount: string,
  dueDate: Date,
): PaymentRecord {
  const now = new Date();
  const record: PaymentRecord = {
    id: generateId(),
    invoiceNumber: nextInvoiceNumber(),
    description,
    amount,
    billingType: "recurring",
    status: "open",
    dueDate: dueDate.toISOString(),
    issuedAt: now.toISOString(),
    createdAt: now.toISOString(),
  };
  return attachInvoicePdf(record, client);
}

export function migratePaymentRecord(payment: PaymentRecord, client: ClientAccount): PaymentRecord {
  const billingType =
    payment.billingType ??
    (payment.description.toLowerCase().includes("onderhoud") ||
    payment.description.toLowerCase().includes("maandelijks")
      ? "recurring"
      : "one_time");

  let migrated: PaymentRecord = {
    ...payment,
    billingType,
    createdAt: payment.createdAt ?? payment.issuedAt ?? payment.dueDate,
    status: payment.status === "pending" ? "open" : payment.status,
  };

  if (!migrated.invoiceNumber && migrated.status !== "pending") {
    const year = new Date(migrated.createdAt ?? migrated.dueDate).getFullYear();
    const suffix = migrated.id.replace(/-/g, "").slice(0, 6).toUpperCase();
    migrated = { ...migrated, invoiceNumber: `NX-${year}-LEG${suffix}` };
  }

  if (migrated.invoiceNumber && !migrated.issuedAt) {
    migrated = { ...migrated, issuedAt: migrated.createdAt };
  }

  if (migrated.invoiceNumber) {
    migrated = attachInvoicePdf(migrated, client);
  }

  return migrated;
}

export function markInvoicePaid(payment: PaymentRecord, client: ClientAccount): PaymentRecord {
  const paid: PaymentRecord = {
    ...attachInvoicePdf(payment, client),
    status: "paid",
    paidAt: new Date().toISOString(),
  };
  return paid;
}

export const INVOICE_STATUS_LABELS: Record<PaymentRecord["status"], string> = {
  pending: "Gepland",
  open: "Gefactureerd",
  paid: "Betaald",
  overdue: "Achterstallig",
};

export function getInvoiceStatusVariant(
  status: PaymentRecord["status"],
): "default" | "green" | "purple" | "orange" {
  if (status === "paid") return "green";
  if (status === "overdue") return "orange";
  if (status === "open") return "purple";
  return "default";
}
