import { cn } from "@/lib/utils";
import type { Integration, IntegrationCategoryId } from "@/data/integrations";
import { IntegrationIconTile } from "@/components/integrations/IntegrationIcon";
import { BookingShowcaseSkeleton } from "@/components/skeletons/BookingShowcaseSkeleton";
import { ReviewShowcaseSkeleton } from "@/components/skeletons/ReviewShowcaseSkeleton";
import { CreditCard, MessageSquare, BarChart3, FileText, Zap } from "lucide-react";

type IntegrationCategoryPreviewProps = {
  integration: Integration;
  className?: string;
};

function GenericPreview({ icon: Icon, label }: { icon: typeof CreditCard; label: string }) {
  return (
    <div className="mx-auto w-full max-w-[252px] overflow-hidden rounded-[1.25rem] border border-[#ebe8e4] bg-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.18)]">
      <div className="border-b border-[#ebe8e4] bg-[#f8f7f5] px-4 py-3">
        <p className="text-[10px] font-medium uppercase tracking-wide text-[#9CA3AF]">Voorbeeld</p>
        <p className="text-sm font-semibold text-[#111111]">{label}</p>
      </div>
      <div className="space-y-2 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2 rounded-xl bg-[#fafaf9] p-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eceae6]">
              <Icon className="h-4 w-4 text-[#7547F8]" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="h-2 w-20 rounded bg-[#eceae6]" />
              <div className="mt-1.5 h-2 w-28 rounded bg-[#f3f2ef]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategorySkeleton({ category }: { category: IntegrationCategoryId }) {
  switch (category) {
    case "agenda":
      return <BookingShowcaseSkeleton size="catalog" className="mx-auto" />;
    case "analytics":
      return <ReviewShowcaseSkeleton size="catalog" className="mx-auto" />;
    case "betalingen":
      return <GenericPreview icon={CreditCard} label="Betaling ontvangen" />;
    case "communicatie":
      return <GenericPreview icon={MessageSquare} label="Berichten & chat" />;
    case "marketing":
      return <GenericPreview icon={BarChart3} label="Campagne-overzicht" />;
    case "formulieren":
      return <GenericPreview icon={FileText} label="Formulier inzendingen" />;
    case "automatisering":
      return <GenericPreview icon={Zap} label="Automatisering actief" />;
    default:
      return <GenericPreview icon={Zap} label="Koppeling actief" />;
  }
}

export function IntegrationCategoryPreview({ integration, className }: IntegrationCategoryPreviewProps) {
  return (
    <div className={cn("relative flex min-h-[280px] items-center justify-center rounded-[20px] bg-[#FAFAF8] p-6", className)}>
      <CategorySkeleton category={integration.category} />
      <div className="absolute bottom-5 left-5 flex items-center gap-2.5 rounded-2xl border border-[#E2E0DB] bg-white px-3 py-2 shadow-sm">
        <IntegrationIconTile integration={integration} bare large />
        <div>
          <p className="text-[11px] font-medium text-[#9CA3AF]">Preview</p>
          <p className="text-[13px] font-semibold text-[#111111]">{integration.name}</p>
        </div>
      </div>
    </div>
  );
}
