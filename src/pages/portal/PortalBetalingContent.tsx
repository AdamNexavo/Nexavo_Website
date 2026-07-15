import { usePortalAuth } from "@/context/PortalAuthContext";
import { PortalCard } from "@/components/portal/PortalUI";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText, ExternalLink } from "lucide-react";
import { INVOICE_STATUS_LABELS, getInvoiceStatusVariant } from "@/lib/portal/invoices";
import { ReferenceBadge } from "@/components/portal/reference/ReferenceUI";

export default function PortalBetalingContent({
  markPaid,
}: {
  markPaid?: (id: string) => void;
}) {
  const { client } = usePortalAuth();
  const { toast } = useToast();
  if (!client) return null;

  const pending = client.payments.filter((p) => p.status !== "paid");

  return (
    <div className="space-y-4">
      {pending.map((p) => (
        <PortalCard key={p.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              {p.invoiceNumber && (
                <span className="font-mono text-[12px] text-[#7547F8]">{p.invoiceNumber}</span>
              )}
              <ReferenceBadge variant={getInvoiceStatusVariant(p.status)}>
                {INVOICE_STATUS_LABELS[p.status]}
              </ReferenceBadge>
              {p.billingType === "one_time" && (
                <span className="text-[11px] text-[#9CA3AF]">Eenmalig</span>
              )}
            </div>
            <p className="font-medium">{p.description}</p>
            <p className="text-[13px] text-[#6B7280]">
              Vervalt {new Date(p.dueDate).toLocaleDateString("nl-NL")}
            </p>
            {p.pdfDataUrl && (
              <a
                href={p.pdfDataUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium text-[#7547F8] hover:underline"
              >
                <FileText className="h-3.5 w-3.5" />
                Factuur PDF openen
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <span className="text-xl font-semibold">{p.amount}</span>
            <Button
              className="rounded-full bg-[#7547F8] hover:bg-[#6840E0]"
              onClick={() => toast({ title: "Betaling (demo)", description: "Mollie-koppeling volgt — daarna betaal je direct via iDEAL." })}
            >
              Nu betalen
            </Button>
            {markPaid && (
              <Button variant="outline" className="rounded-full" onClick={() => markPaid(p.id)}>
                Demo: betaald
              </Button>
            )}
          </div>
        </PortalCard>
      ))}
      {pending.length === 0 && (
        <PortalCard>
          <p className="text-[14px] font-medium text-[#111111]">Geen openstaande betalingen</p>
          <p className="mt-1 text-[14px] text-[#6B7280]">
            Alles is betaald — nieuwe facturen verschijnen hier automatisch.
          </p>
        </PortalCard>
      )}
    </div>
  );
}
