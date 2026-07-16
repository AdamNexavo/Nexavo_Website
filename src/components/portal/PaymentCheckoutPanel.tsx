import { useState } from "react";
import { Check, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PortalCard } from "@/components/portal/PortalUI";
import { PaymentLinesTable } from "@/components/portal/PaymentLinesTable";
import { formatEuroAmount } from "@/lib/portal/billing";
import { PAYMENT_TERM_DAYS } from "@/lib/portal/helpers";
import {
  PORTAL_PAYMENT_METHODS,
  getPaymentMethodById,
  type PortalPaymentMethodId,
} from "@/lib/portal/payment-methods";
import type { PaymentLine } from "@/lib/portal/types";

type PaymentBreakdown = {
  lines: PaymentLine[];
  subtotalEx: number;
  vatAmount: number;
  totalInc: number;
};

type PaymentCheckoutPanelProps = {
  breakdown: PaymentBreakdown | null;
  packageName: string;
  statusLabel?: string;
  disabled?: boolean;
  onPay: (methodId: PortalPaymentMethodId, methodLabel: string) => void;
};

function PaymentMethodLogo({
  logo,
  icon: Icon,
  name,
}: {
  logo?: string;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  name: string;
}) {
  if (logo) {
    return (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#E2E0DB] bg-white p-1.5">
        <img src={logo} alt="" className="h-full w-full object-contain" />
      </span>
    );
  }
  if (Icon) {
    return (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#E2E0DB] bg-[#FAFAF8] text-[#374151]">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
    );
  }
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#E2E0DB] bg-[#FAFAF8] text-[11px] font-semibold text-[#6B7280]">
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}

export function PaymentCheckoutPanel({
  breakdown,
  packageName,
  statusLabel = "Wacht op betaling",
  disabled = false,
  onPay,
}: PaymentCheckoutPanelProps) {
  const [selectedMethod, setSelectedMethod] = useState<PortalPaymentMethodId>("ideal");
  const selected = getPaymentMethodById(selectedMethod);

  return (
    <PortalCard className="overflow-hidden border-[#E2E0DB] !p-0">
      <div className="border-b border-[#E2E0DB] bg-[#FAFAF8] px-5 py-5 md:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#7547F8]">Veilig afrekenen</p>
            <h3 className="mt-1 text-[18px] font-semibold text-[#111111]">Betaal je pakket</h3>
            <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-[#6B7280]">
              Kies een betaalmethode en rond je betaling af via onze beveiligde Mollie-omgeving. Na ontvangst starten
              we met de bouw van je website.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#E2E0DB] bg-white px-3 py-1.5">
            <ShieldCheck className="h-4 w-4 text-[#10B981]" strokeWidth={1.75} />
            <span className="text-[12px] font-medium text-[#374151]">SSL-beveiligd</span>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[14px] border border-[#E2E0DB] bg-white p-4">
            <p className="text-[12px] font-medium text-[#6B7280]">Te betalen</p>
            <p className="mt-1 text-[34px] font-semibold tracking-tight text-[#111111]">
              {breakdown ? formatEuroAmount(breakdown.totalInc) : "—"}
            </p>
            <p className="mt-1 text-[12px] text-[#9CA3AF]">
              {breakdown
                ? `${formatEuroAmount(breakdown.subtotalEx)} excl. btw · 21% btw ${formatEuroAmount(breakdown.vatAmount)}`
                : "Bedrag wordt berekend op basis van je selectie"}
            </p>
            <p className="mt-2 text-[12px] text-[#6B7280]">Betaaltermijn {PAYMENT_TERM_DAYS} dagen</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[12px] border border-[#E2E0DB] bg-white px-3 py-2.5">
              <p className="text-[11px] text-[#9CA3AF]">Pakket</p>
              <p className="text-[13px] font-medium text-[#111111]">{packageName}</p>
            </div>
            <div className="rounded-[12px] border border-[#E2E0DB] bg-white px-3 py-2.5">
              <p className="text-[11px] text-[#9CA3AF]">Provider</p>
              <p className="text-[13px] font-medium text-[#111111]">Mollie</p>
            </div>
            <div className="rounded-[12px] border border-[#E2E0DB] bg-white px-3 py-2.5">
              <p className="text-[11px] text-[#9CA3AF]">Status</p>
              <p className="text-[13px] font-medium text-[#111111]">{statusLabel}</p>
            </div>
          </div>
        </div>

        {breakdown && (
          <div className="mt-4 overflow-hidden rounded-[12px] border border-[#E2E0DB] bg-white p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">Boekingsregels</p>
            <PaymentLinesTable lines={breakdown.lines} />
          </div>
        )}
      </div>

      <div className="space-y-5 p-5 md:p-6">
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-[15px] font-semibold text-[#111111]">Kies je betaalmethode</h4>
            <span className="text-[12px] text-[#6B7280]">Alle methoden via Mollie</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {PORTAL_PAYMENT_METHODS.map((method) => {
              const isSelected = selectedMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedMethod(method.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-[14px] border bg-white px-3.5 py-3 text-left transition-colors",
                    isSelected
                      ? "border-[#7547F8] ring-1 ring-[#7547F8]/15"
                      : "border-[#E2E0DB] hover:border-[#7547F8]/35",
                    disabled && "cursor-not-allowed opacity-60",
                  )}
                >
                  <PaymentMethodLogo logo={method.logo} icon={method.icon} name={method.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[13px] font-semibold text-[#111111]">{method.name}</p>
                      {method.popular && (
                        <span className="rounded-full bg-[#EDE9FE] px-2 py-0.5 text-[10px] font-semibold text-[#7547F8]">
                          Populair
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[12px] text-[#6B7280]">{method.description}</p>
                  </div>
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                      isSelected ? "border-[#7547F8] bg-[#7547F8] text-white" : "border-[#D1D5DB] bg-white",
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-[12px] border border-[#E2E0DB] bg-[#FAFAF8] px-4 py-3">
          <Lock className="h-4 w-4 shrink-0 text-[#6B7280]" strokeWidth={1.75} />
          <p className="text-[12px] leading-relaxed text-[#6B7280]">
            Je betaalgegevens worden versleuteld verwerkt. Nexavo slaat geen kaart- of bankgegevens op. Betalingen
            verlopen via Mollie — dezelfde provider die ook grote webshops gebruiken.
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#E2E0DB] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <img src="/integrations/mollie.png" alt="Mollie" className="h-8 w-auto" />
            <div className="flex flex-wrap items-center gap-2">
              {["/integrations/wero.svg", "/integrations/apple-pay.png", "/integrations/google-pay.png", "/integrations/paypal.png", "/integrations/klarna.png"].map(
                (logo) => (
                  <span
                    key={logo}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E2E0DB] bg-white p-1"
                  >
                    <img src={logo} alt="" className="h-full w-full object-contain" />
                  </span>
                ),
              )}
            </div>
          </div>
          <Button
            type="button"
            variant="default"
            size="lg"
            disabled={disabled || !breakdown}
            className="w-full rounded-full sm:w-auto"
            onClick={() => onPay(selectedMethod, selected.checkoutLabel)}
          >
            Betaal {breakdown ? formatEuroAmount(breakdown.totalInc) : ""} met {selected.checkoutLabel}
          </Button>
        </div>
      </div>
    </PortalCard>
  );
}
