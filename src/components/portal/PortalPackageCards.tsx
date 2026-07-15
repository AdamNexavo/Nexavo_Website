import { MaintenanceCard, PricingCard } from "@/components/ui/nex-ui";
import { getPlanById, getMaintenanceById } from "@/lib/portal/constants";

export function PortalWebsitePackageCard({
  planId,
  compact,
}: {
  planId: string;
  compact?: boolean;
}) {
  const plan = getPlanById(planId);
  if (!plan) return null;

  if (compact) {
    return (
      <div className="rounded-[20px] border border-black/[0.08] bg-[#F5F4F2] p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B7280]">Websitepakket</p>
        <p className="mt-2 text-xl font-semibold text-[#0B0B0D]">{plan.name}</p>
        <p className="mt-1 text-[14px] text-[#6B7280]">{plan.pricePrefix ? `${plan.pricePrefix} ` : ""}{plan.price} · {plan.priceDetail}</p>
        <p className="mt-3 text-[13px] leading-relaxed text-[#6B7280] line-clamp-3">{plan.description}</p>
      </div>
    );
  }

  return (
    <PricingCard
      name={plan.name}
      price={plan.price}
      pricePrefix={plan.pricePrefix}
      priceDetail={plan.priceDetail}
      description={plan.description}
      features={plan.features.slice(0, 4)}
      cta="Je pakket"
      ctaHref="/portal/pakketten"
      highlighted={plan.highlighted}
      badge={plan.badge}
    />
  );
}

export function PortalMaintenancePackageCard({
  maintenanceId = "plus",
  compact,
}: {
  maintenanceId?: string;
  compact?: boolean;
}) {
  const pkg = getMaintenanceById(maintenanceId);
  if (!pkg) return null;

  if (compact) {
    return (
      <div className="rounded-[20px] border border-[#7547F8]/20 bg-[#F5F3FF]/40 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7547F8]">Onderhoud</p>
        <p className="mt-2 text-xl font-semibold text-[#0B0B0D]">{pkg.name}</p>
        <p className="mt-1 text-[14px] text-[#6B7280]">{pkg.price} {pkg.priceNote}</p>
        <ul className="mt-3 space-y-1">
          {pkg.highlights.map((h) => (
            <li key={h} className="text-[13px] text-[#6B7280]">· {h}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <MaintenanceCard
      name={pkg.name}
      price={pkg.price}
      priceNote={pkg.priceNote}
      description={pkg.description}
      highlights={pkg.highlights}
      features={pkg.features.slice(0, 4)}
      highlighted={pkg.highlighted}
      badge={pkg.badge}
    />
  );
}
