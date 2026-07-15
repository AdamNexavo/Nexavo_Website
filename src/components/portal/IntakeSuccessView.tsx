import { Link } from "react-router-dom";
import { CheckCircle2, CreditCard, Pencil, BookOpen } from "lucide-react";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { PortalBadge, PortalCard } from "@/components/portal/PortalUI";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { allInvoicesPaid } from "@/lib/portal/helpers";
import type { OnboardingData } from "@/lib/portal/types";

export function IntakeSuccessView({ data }: { data: OnboardingData }) {
  const { client } = usePortalAuth();
  const paid = client ? allInvoicesPaid(client) : false;
  const submitted = data.submittedAt
    ? new Date(data.submittedAt).toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "vandaag";

  return (
    <div className="mx-auto max-w-2xl py-4 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#ECFDF5]">
        <CheckCircle2 className="h-9 w-9 text-[#10B981]" strokeWidth={1.75} />
      </div>
      <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-[#0B0B0D]">
        Intake verstuurd
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-[#6B7280]">
        Bedankt! We hebben je gegevens ontvangen op {submitted}. We komen zo snel mogelijk bij je terug
        over de volgende stappen voor je website.
      </p>

      <PortalCard className="mt-8 text-left">
        <h3 className="mb-4 text-[16px] font-semibold text-[#0B0B0D]">Wat we hebben ontvangen</h3>
        <div className="grid gap-4 sm:grid-cols-2 text-[14px]">
          <div>
            <p className="text-[#6B7280]">Bedrijf</p>
            <p className="font-medium">{data.company.name || "—"}</p>
          </div>
          <div>
            <p className="text-[#6B7280]">Branche</p>
            <p className="font-medium">{data.company.industry || "—"}</p>
          </div>
          <div>
            <p className="text-[#6B7280]">Doelen</p>
            <p className="font-medium">{data.goals.length ? data.goals.slice(0, 2).join(", ") : "—"}</p>
          </div>
          <div>
            <p className="text-[#6B7280]">Koppelingen</p>
            <p className="font-medium">{data.integrations.length ? data.integrations.join(", ") : "—"}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <PortalBadge variant="green">Intake ontvangen</PortalBadge>
          {data.media.length > 0 && <PortalBadge variant="purple">{data.media.length} bestand(en)</PortalBadge>}
        </div>
      </PortalCard>

      {!paid && (
        <PortalCard className="mt-5 border-[#7547F8]/20 bg-[#F5F3FF]/30 text-left">
          <div className="flex gap-4">
            <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-[#7547F8]" />
            <div>
              <h3 className="font-semibold text-[#0B0B0D]">Zorg dat betalingen voldaan zijn</h3>
              <p className="mt-1 text-[14px] leading-relaxed text-[#6B7280]">
                Zodra je openstaande facturen zijn betaald, kunnen we direct aan de slag met de bouw van
                je website. Betaaltermijn: 14 dagen.
              </p>
              <Button asChild className="mt-4 rounded-full bg-[#7547F8] hover:bg-[#6840E0]">
                <Link to={ROUTES.portal.betaling}>Naar betaling</Link>
              </Button>
            </div>
          </div>
        </PortalCard>
      )}

      <PortalCard className="mt-5 text-left">
        <div className="flex gap-4">
          <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-[#6B7280]" />
          <div>
            <h3 className="font-semibold text-[#0B0B0D]">Nog vragen?</h3>
            <p className="mt-1 text-[14px] text-[#6B7280]">
              Bekijk onze kennisbank voor antwoorden over intake, betalingen en livegang.
            </p>
            <Button asChild variant="outline" className="mt-4 rounded-full border-black/[0.12]">
              <Link to={ROUTES.kennisbank}>Naar kennisbank</Link>
            </Button>
          </div>
        </div>
      </PortalCard>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="outline" className="rounded-full border-black/[0.12]">
          <Link to="/portal">
            <span className="flex items-center gap-2">
              Terug naar dashboard
            </span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full border-black/[0.12]">
          <Link to="/portal/website?step=company">
            <Pencil className="mr-2 h-4 w-4" />
            Intake aanpassen
          </Link>
        </Button>
      </div>
    </div>
  );
}
