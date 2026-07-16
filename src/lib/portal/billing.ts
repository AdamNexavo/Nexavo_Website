import type { ClientAccount, PaymentLine, PaymentRecord } from "./types";
import { generateId } from "./storage";
import { getPlanById, getMaintenanceById, PORTAL_ADDONS } from "./constants";
import { planIncludesAddon } from "./package-features";
import { hasPendingPackage, hasInitialPaymentPaid, addPaymentTermDays, getClientPaymentTermDays } from "./helpers";
import { PACKAGE_INVOICE_DESCRIPTIONS } from "./invoices";

const VAT_RATE = 0.21;

const ADDON_AMOUNTS: Record<string, number> = {
  booking: 295,
  reviews: 295,
  chatbot: 495,
};

export function parseEuroAmount(value: string): number {
  if (!value?.trim()) return 0;

  const firstPart = value.split(/[–-]/)[0]?.trim() ?? value;
  const raw = firstPart.replace(/[^\d,.]/g, "");
  if (!raw) return 0;

  const hasComma = raw.includes(",");
  const hasDot = raw.includes(".");
  let normalized = raw;

  if (hasComma && hasDot) {
    const lastComma = raw.lastIndexOf(",");
    const lastDot = raw.lastIndexOf(".");
    normalized =
      lastComma > lastDot
        ? raw.replace(/\./g, "").replace(",", ".")
        : raw.replace(/,/g, "");
  } else if (hasComma) {
    const [, fraction = ""] = raw.split(",");
    normalized =
      fraction.length > 0 && fraction.length <= 2
        ? `${raw.split(",")[0].replace(/\./g, "")}.${fraction}`
        : raw.replace(/,/g, "");
  } else if (hasDot) {
    const [, fraction = ""] = raw.split(".");
    normalized = fraction.length === 3 ? raw.replace(/\./g, "") : raw;
  }

  const num = parseFloat(normalized);
  return Number.isFinite(num) ? num : 0;
}

export function formatEuroAmount(value: number): string {
  return `€${value.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatMaintenancePeriodDate(date: Date): string {
  return date.toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
}

function formatFirstMaintenancePeriodRange(from = new Date()): string {
  const to = new Date(from);
  to.setMonth(to.getMonth() + 1);
  return `${formatMaintenancePeriodDate(from)} – ${formatMaintenancePeriodDate(to)}`;
}

function line(
  description: string,
  type: PaymentLine["type"],
  totalExVat: number,
  quantity = 1,
  unit = "stuk",
): PaymentLine {
  const vatAmount = totalExVat * VAT_RATE;
  const totalIncVat = totalExVat + vatAmount;
  return {
    id: generateId(),
    description,
    type,
    quantity,
    unit,
    unitPriceExVat: totalExVat / quantity,
    vatRate: VAT_RATE,
    totalExVat,
    vatAmount,
    totalIncVat,
  };
}

function summaryLine(
  description: string,
  type: PaymentLine["type"],
  amounts: { excl?: number; vat?: number; incl?: number },
): PaymentLine {
  return {
    id: generateId(),
    description,
    type,
    quantity: 1,
    unit: "stuk",
    vatRate: VAT_RATE,
    totalExVat: amounts.excl,
    vatAmount: amounts.vat,
    totalIncVat: amounts.incl,
  };
}

export function buildClientPaymentLines(client: ClientAccount): PaymentLine[] {
  if (hasPendingPackage(client)) return [];

  const plan = getPlanById(client.package.planId);
  const maintenance = getMaintenanceById(client.package.maintenanceId ?? "plus");
  const lines: PaymentLine[] = [];

  if (plan) {
    const amount = parseEuroAmount(plan.price);
    const desc =
      PACKAGE_INVOICE_DESCRIPTIONS[plan.id] ??
      `${plan.name} — eenmalig websitepakket via Nexavo.`;
    lines.push(line(desc, "package", amount));
  }

  const addons = client.package.selectedAddons ?? [];
  for (const addonId of addons) {
    if (planIncludesAddon(client.package.planId, addonId)) continue;
    const addon = PORTAL_ADDONS.find((a) => a.id === addonId);
    const amount = ADDON_AMOUNTS[addonId] ?? 0;
    if (addon && amount > 0) {
      lines.push(line(`${addon.name} — add-on`, "addon", amount));
    }
  }

  if (maintenance && client.package.maintenanceId) {
    const amount = parseEuroAmount(maintenance.price);
    lines.push(
      line(
        `${maintenance.name} — maandelijks onderhoud (${formatFirstMaintenancePeriodRange()})`,
        "maintenance",
        amount,
      ),
    );
  }

  return lines;
}

export function summarizePaymentLines(lines: PaymentLine[]) {
  const billable = lines.filter((l) => !["subtotal", "vat", "total", "discount"].includes(l.type));
  const subtotalEx = billable.reduce((s, l) => s + (l.totalExVat ?? 0), 0);
  const vatAmount = subtotalEx * VAT_RATE;
  const totalInc = subtotalEx + vatAmount;
  return {
    lines: [
      ...billable,
      summaryLine("Subtotaal excl. btw", "subtotal", { excl: subtotalEx }),
      summaryLine("21% btw", "vat", { vat: vatAmount }),
      summaryLine("Totaal incl. btw", "total", { excl: subtotalEx, vat: vatAmount, incl: totalInc }),
    ],
    subtotalEx,
    vatAmount,
    totalInc,
  };
}

export function hasReachedPaymentStep(client: ClientAccount): boolean {
  const o = client.onboarding;
  return (
    !!o.paymentStepReached ||
    o.currentStep === "payment" ||
    o.currentStep === "review" ||
    o.completedSteps.includes("payment")
  );
}

export function shouldHaveOpenPayment(client: ClientAccount): boolean {
  if (!hasReachedPaymentStep(client)) return false;
  if (hasPendingPackage(client)) return false;
  if (hasInitialPaymentPaid(client)) return false;
  return buildClientPaymentLines(client).length > 0;
}

export function createOpenPaymentRecord(client: ClientAccount): PaymentRecord | null {
  const rawLines = buildClientPaymentLines(client);
  if (rawLines.length === 0) return null;

  const { lines, subtotalEx, vatAmount, totalInc } = summarizePaymentLines(rawLines);
  const now = new Date();
  const plan = getPlanById(client.package.planId);

  return {
    id: generateId(),
    description: `Openstaande betaling — ${plan?.name ?? client.package.planName}`,
    packageName: plan?.name ?? client.package.planName,
    amount: formatEuroAmount(subtotalEx),
    amountExVat: formatEuroAmount(subtotalEx),
    vatAmount: formatEuroAmount(vatAmount),
    amountIncVat: formatEuroAmount(totalInc),
    status: "processing",
    billingType: "one_time",
    paymentTermDays: getClientPaymentTermDays(client),
    dueDate: addPaymentTermDays(now, getClientPaymentTermDays(client)).toISOString(),
    createdAt: now.toISOString(),
    lines,
  };
}

export function getProcessingPayments(client: ClientAccount): PaymentRecord[] {
  return client.payments.filter((p) => p.status === "processing");
}

export function getInvoiceRecords(client: ClientAccount): PaymentRecord[] {
  return client.payments.filter((p) => p.status !== "processing");
}

export function getOpenPaymentRecords(client: ClientAccount): PaymentRecord[] {
  return client.payments.filter(
    (p) => p.status === "processing" || p.status === "open" || p.status === "overdue",
  );
}

export function syncClientBilling(client: ClientAccount): ClientAccount {
  const migrated = client.payments.map((p) => ({
    ...p,
    lines: p.lines ?? (p.status === "processing" ? summarizePaymentLines(buildClientPaymentLines(client)).lines : undefined),
  }));

  if (!hasReachedPaymentStep(client)) {
    return {
      ...client,
      payments: migrated.filter((p) => p.status === "paid"),
    };
  }

  const hasPaid = migrated.some((p) => p.status === "paid");
  const hasProcessing = migrated.some((p) => p.status === "processing");

  if (hasPaid) {
    return { ...client, payments: migrated.filter((p) => p.status !== "processing") };
  }

  if (shouldHaveOpenPayment(client)) {
    if (hasProcessing) {
      const openPayment = createOpenPaymentRecord(client);
      if (!openPayment) return { ...client, payments: migrated };
      return {
        ...client,
        payments: migrated.map((p) =>
          p.status === "processing"
            ? { ...openPayment, id: p.id, createdAt: p.createdAt ?? openPayment.createdAt }
            : p,
        ),
      };
    }
    const openPayment = createOpenPaymentRecord(client);
    if (openPayment) {
      return { ...client, payments: [...migrated.filter((p) => p.status !== "processing"), openPayment] };
    }
  }

  if (!shouldHaveOpenPayment(client) && hasProcessing) {
    return { ...client, payments: migrated.filter((p) => p.status !== "processing") };
  }

  return { ...client, payments: migrated };
}
