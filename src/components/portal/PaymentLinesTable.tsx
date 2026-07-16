import type { PaymentLine } from "@/lib/portal/types";
import { formatEuroAmount } from "@/lib/portal/billing";
import { cn } from "@/lib/utils";

export function PaymentLinesTable({ lines }: { lines: PaymentLine[] }) {
  const billable = lines.filter((l) => !["subtotal", "vat", "total", "discount"].includes(l.type));
  const summary = lines.filter((l) => ["subtotal", "vat", "total", "discount"].includes(l.type));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-[13px]">
        <thead>
          <tr className="border-b border-[#E2E0DB] text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
            <th className="pb-2.5 pr-4">Omschrijving</th>
            <th className="pb-2.5 pr-4 text-right">Aantal</th>
            <th className="pb-2.5 pr-4">Eenheid</th>
            <th className="pb-2.5 pr-4 text-right">Excl. btw</th>
            <th className="pb-2.5 pr-4 text-right">Btw</th>
            <th className="pb-2.5 text-right">Incl. btw</th>
          </tr>
        </thead>
        <tbody>
          {billable.map((line) => (
            <tr key={line.id} className="border-b border-[#E2E0DB]/50">
              <td className="py-2.5 pr-4 font-medium text-[#111111]">{line.description}</td>
              <td className="py-2.5 pr-4 text-right text-[#374151]">{line.quantity ?? 1}</td>
              <td className="py-2.5 pr-4 text-[#6B7280]">{line.unit ?? "stuk"}</td>
              <td className="py-2.5 pr-4 text-right font-medium text-[#374151]">
                {formatEuroAmount(line.totalExVat ?? 0)}
              </td>
              <td className="py-2.5 pr-4 text-right text-[#6B7280]">
                {formatEuroAmount(line.vatAmount ?? 0)}
              </td>
              <td className="py-2.5 text-right font-semibold text-[#111111]">
                {formatEuroAmount(line.totalIncVat ?? 0)}
              </td>
            </tr>
          ))}
          {summary.map((line) => (
            <tr
              key={line.id}
              className={cn(
                "border-b border-[#E2E0DB]/50 last:border-0",
                line.type === "total" && "bg-[#FAFAF8] font-semibold",
              )}
            >
              <td colSpan={3} className="py-2.5 pr-4 text-[#374151]">
                {line.description}
              </td>
              <td className="py-2.5 pr-4 text-right">
                {line.type !== "vat" ? formatEuroAmount(line.totalExVat ?? 0) : "—"}
              </td>
              <td className="py-2.5 pr-4 text-right">
                {line.type === "vat" || line.type === "total"
                  ? formatEuroAmount(line.vatAmount ?? line.totalExVat ?? 0)
                  : "—"}
              </td>
              <td className="py-2.5 text-right text-[#111111]">
                {line.type === "total" ? formatEuroAmount(line.totalIncVat ?? 0) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
