import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReferenceCard } from "@/components/portal/reference/ReferenceUI";
import {
  MAINTENANCE_POLICY,
  REVISION_POLICY,
  UPSELL_CATEGORIES,
  COMBO_PACKAGES,
} from "@/data/revision-policy";

function PricingTable({ rows }: { rows: { label: string; price: string }[] }) {
  return (
    <div className="overflow-hidden rounded-[12px] border border-[#E2E0DB]">
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={cn(
            "flex items-start justify-between gap-4 px-4 py-2.5 text-[13px]",
            i % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]",
          )}
        >
          <span className="text-[#111111]">{row.label}</span>
          <span className="shrink-0 font-medium text-[#7547F8]">{row.price}</span>
        </div>
      ))}
    </div>
  );
}

export function MaintenancePolicyContent({ compact }: { compact?: boolean }) {
  return (
    <div className="space-y-4">
      <p className="text-[13px] leading-relaxed text-[#6B7280]">{MAINTENANCE_POLICY.coreRule}</p>
      {!compact && (
        <a
          href={MAINTENANCE_POLICY.pdfHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-[13px] font-medium text-[#7547F8] hover:underline"
        >
          Download volledig PDF-beleid (v{MAINTENANCE_POLICY.version})
        </a>
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        {MAINTENANCE_POLICY.packages.map((pkg) => (
          <div
            key={pkg.id}
            className={cn(
              "rounded-[14px] border p-4",
              pkg.recommended ? "border-[#7547F8]/30 bg-[#EDE9FE]/20" : "border-[#E2E0DB] bg-[#FAFAF8]",
            )}
          >
            {pkg.recommended && (
              <span className="mb-1 inline-block text-[10px] font-semibold uppercase text-[#7547F8]">
                Aanbevolen
              </span>
            )}
            <p className="text-[14px] font-semibold">{pkg.name}</p>
            <p className="text-[18px] font-semibold text-[#111111]">{pkg.price}</p>
            <p className="mt-1 text-[12px] text-[#6B7280]">{pkg.summary}</p>
            {!compact && (
              <ul className="mt-3 space-y-1 text-[11px] text-[#6B7280]">
                {pkg.highlights.slice(0, 4).map((h) => (
                  <li key={h}>• {h}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      {!compact && (
        <>
          <div>
            <p className="mb-2 text-[13px] font-semibold">Meerwerk tarieven</p>
            <PricingTable rows={MAINTENANCE_POLICY.meerwerkRates.map((r) => ({ label: r.type, price: r.rate }))} />
          </div>
          <div>
            <p className="mb-2 text-[13px] font-semibold">Kleine wijzigingen (voorbeelden)</p>
            <p className="text-[12px] leading-relaxed text-[#6B7280]">
              {MAINTENANCE_POLICY.smallChanges.join(" · ")}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export function RevisionPolicyContent() {
  return (
    <div className="space-y-4">
      <p className="text-[13px] text-[#6B7280]">{REVISION_POLICY.summary}</p>
      {REVISION_POLICY.sections.map((section) => (
        <div key={section.heading}>
          <p className="text-[13px] font-semibold text-[#111111]">{section.heading}</p>
          <p className="mt-1 text-[13px] leading-relaxed text-[#6B7280]">{section.body}</p>
        </div>
      ))}
    </div>
  );
}

export function UpsellPricingContent({ compact }: { compact?: boolean }) {
  const [openId, setOpenId] = useState<string | null>(compact ? null : "website");

  return (
    <div className="space-y-4">
      <p className="text-[13px] text-[#6B7280]">
        Onderstaande richtprijzen zijn indicatief. Offertes kunnen afwijken op basis van scope en complexiteit.
      </p>
      {UPSELL_CATEGORIES.map((cat) => (
        <div key={cat.id} className="rounded-[14px] border border-[#E2E0DB] overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenId((o) => (o === cat.id ? null : cat.id))}
            className="flex w-full items-center justify-between bg-[#FAFAF8] px-4 py-3 text-left"
          >
            <span className="text-[14px] font-semibold">{cat.title}</span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", openId === cat.id && "rotate-180")} />
          </button>
          {openId === cat.id && (
            <div className="border-t border-[#E2E0DB] p-3">
              <PricingTable rows={cat.rows} />
            </div>
          )}
        </div>
      ))}
      {!compact && (
        <div>
          <p className="mb-3 text-[14px] font-semibold">Voorbeeldcombinaties</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {COMBO_PACKAGES.slice(0, 4).map((combo) => (
              <ReferenceCard key={combo.id} className="!p-4">
                <p className="text-[13px] font-semibold">{combo.title}</p>
                <div className="mt-2 space-y-1 text-[12px] text-[#6B7280]">
                  {combo.lines.map((l) => (
                    <div key={l.label} className="flex justify-between gap-2">
                      <span>{l.label}</span>
                      <span className="font-medium">{l.price}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[12px] font-semibold text-[#7547F8]">{combo.advicePrice}</p>
              </ReferenceCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function PortalDocumentBody({ type }: { type?: string }) {
  if (type === "maintenance") return <MaintenancePolicyContent />;
  if (type === "revision") return <RevisionPolicyContent />;
  if (type === "upsell") return <UpsellPricingContent compact />;
  return null;
}
