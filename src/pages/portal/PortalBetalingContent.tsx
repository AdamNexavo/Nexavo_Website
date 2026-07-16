import { useMemo } from "react";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { INVOICE_STATUS_LABELS, getInvoiceStatusVariant } from "@/lib/portal/invoices";
import { ReferenceBadge } from "@/components/portal/reference/ReferenceUI";
import { PaymentCheckoutPanel } from "@/components/portal/PaymentCheckoutPanel";
import { InvoicePdfButton } from "@/components/portal/InvoicePdfButton";
import { buildClientPaymentLines, getProcessingPayments, summarizePaymentLines } from "@/lib/portal/billing";
import { PAYMENT_TERM_DAYS } from "@/lib/portal/helpers";

export default function PortalBetalingContent({
  markPaid,
  compact = false,
}: {
  markPaid?: (id: string) => void;
  compact?: boolean;
}) {
  const { client } = usePortalAuth();
  const { toast } = useToast();
  const pending = client ? getProcessingPayments(client) : [];
  const primary = pending[0];
  const breakdown = useMemo(() => {
    if (!client) return null;
    const raw = buildClientPaymentLines(client);
    if (!raw.length) return null;
    return summarizePaymentLines(raw);
  }, [client]);

  if (!client) return null;

  if (pending.length === 0) {
    return (
      <div className={compact ? "rounded-[12px] border border-[#E2E0DB] bg-white shadow-block px-4 py-6 text-center" : ""}>
        <p className="text-[14px] font-medium text-[#111111]">Geen openstaande betalingen</p>
        <p className="mt-1 text-[14px] text-[#6B7280]">
          Openstaande betalingen verschijnen hier zodra je pakket is gekozen.
        </p>
      </div>
    );
  }

  if (!compact && primary) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <ReferenceBadge variant={getInvoiceStatusVariant(primary.status)}>
            {INVOICE_STATUS_LABELS[primary.status]}
          </ReferenceBadge>
          <span className="text-[13px] text-[#6B7280]">
            Vervalt {new Date(primary.dueDate).toLocaleDateString("nl-NL")} · {primary.paymentTermDays ?? PAYMENT_TERM_DAYS} dagen
          </span>
        </div>
        <PaymentCheckoutPanel
          breakdown={breakdown}
          packageName={primary.packageName ?? client.package.planName}
          statusLabel="Openstaande betaling"
          onPay={(_methodId, methodLabel) =>
            toast({
              title: "Betaling (demo)",
              description: `Mollie-koppeling volgt — daarna betaal je met ${methodLabel}.`,
            })
          }
        />
        <div className="flex flex-wrap items-center gap-2">
          <InvoicePdfButton pdfUrl={null} />
          {markPaid && (
            <Button variant="outline" className="rounded-full" onClick={() => markPaid(primary.id)}>
              Demo: betaald
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pending.map((p) => (
        <div
          key={p.id}
          className="flex flex-col gap-3 rounded-[12px] border border-[#E2E0DB] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-wrap items-center gap-2">
            <ReferenceBadge variant={getInvoiceStatusVariant(p.status)}>{INVOICE_STATUS_LABELS[p.status]}</ReferenceBadge>
            <span className="text-xl font-semibold text-[#111111]">{p.amountIncVat ?? p.amount}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <InvoicePdfButton pdfUrl={null} />
            <Button
              className="rounded-full bg-[#7547F8] hover:bg-[#6840E0]"
              onClick={() =>
                toast({ title: "Betaling (demo)", description: "Mollie-koppeling volgt — kies je betaalmethode op de betalingspagina." })
              }
            >
              Nu betalen
            </Button>
            {markPaid && (
              <Button variant="outline" className="rounded-full" onClick={() => markPaid(p.id)}>
                Demo: betaald
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
