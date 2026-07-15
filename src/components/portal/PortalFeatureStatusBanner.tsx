import { Link } from "react-router-dom";
import { AlertCircle, Clock, Lock, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { FeatureModuleBlockReason } from "@/lib/portal/integration-helpers";

const CONFIG: Record<
  FeatureModuleBlockReason,
  {
    icon: typeof Lock;
    title: string;
    tone: "gray" | "orange" | "purple" | "amber";
    getMessage: (moduleLabel: string) => string;
    cta?: { label: string; href: string };
  }
> = {
  no_package: {
    icon: Package,
    title: "Eerst een pakket kiezen",
    tone: "gray",
    getMessage: () =>
      "Kies eerst een websitepakket in stap 5. Daarna zie je welke modules — zoals boekingskalender of review management — bij jou horen.",
    cta: { label: "Naar pakket kiezen", href: "/portal/stap/pakket" },
  },
  not_in_package: {
    icon: Lock,
    title: "Niet in je huidige pakket",
    tone: "gray",
    getMessage: (label) =>
      `${label} zit niet in je gekozen pakket. Upgrade naar Groei of Pro, of voeg de module toe als add-on via pakket kiezen.`,
    cta: { label: "Pakket bekijken", href: "/portal/stap/pakket" },
  },
  intake_incomplete: {
    icon: AlertCircle,
    title: "Intake nog niet afgerond",
    tone: "orange",
    getMessage: (label) =>
      `${label} wordt beschikbaar zodra je intake volledig is ingevuld en verstuurd. Rond eerst alle stappen af op je dashboard.`,
    cta: { label: "Naar dashboard", href: "/portal" },
  },
  pending_admin: {
    icon: Clock,
    title: "Koppeling in behandeling",
    tone: "purple",
    getMessage: (label) =>
      `Je aanvraag voor ${label.toLowerCase()} is ontvangen. Zodra Nexavo de koppeling heeft goedgekeurd en geactiveerd, verschijnt alles hier automatisch.`,
    cta: { label: "Bekijk koppelingen", href: "/portal/koppelingen" },
  },
  awaiting_link: {
    icon: AlertCircle,
    title: "Koppeling nog niet actief",
    tone: "amber",
    getMessage: (label) =>
      `${label} zit wel in je pakket, maar is nog niet gekoppeld. Vraag de gewenste tool aan via Koppelingen — na goedkeuring door Nexavo wordt de module geactiveerd.`,
    cta: { label: "Naar koppelingen", href: "/portal/koppelingen" },
  },
};

const toneClass = {
  gray: "border-[#E2E0DB] bg-[#FAFAF8]",
  orange: "border-[#FED7AA] bg-[#FFF7ED]",
  purple: "border-[#DDD6FE] bg-[#F5F3FF]",
  amber: "border-[#FDE68A] bg-[#FFFBEB]",
};

const iconToneClass = {
  gray: "text-[#9CA3AF]",
  orange: "text-[#EA580C]",
  purple: "text-[#7547F8]",
  amber: "text-[#D97706]",
};

export function PortalFeatureStatusBanner({
  reason,
  moduleLabel,
  className,
}: {
  reason: FeatureModuleBlockReason;
  moduleLabel: string;
  className?: string;
}) {
  const cfg = CONFIG[reason];
  const Icon = cfg.icon;

  return (
    <div className={cn("rounded-[16px] border p-5", toneClass[cfg.tone], className)}>
      <div className="flex gap-3">
        <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconToneClass[cfg.tone])} strokeWidth={1.75} />
        <div className="flex-1">
          <h3 className="text-[15px] font-semibold text-[#111111]">{cfg.title}</h3>
          <p className="mt-1 text-[14px] leading-relaxed text-[#6B7280]">{cfg.getMessage(moduleLabel)}</p>
          {cfg.cta && (
            <Button asChild variant="default" size="sm" className="mt-4">
              <Link to={cfg.cta.href}>{cfg.cta.label}</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
