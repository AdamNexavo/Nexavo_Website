import { Link, Navigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { OnboardingWizard } from "@/components/portal/OnboardingWizard";
import { PackageCheckoutWizard } from "@/components/portal/PackageCheckoutWizard";
import { ReferencePageTitle } from "@/components/portal/reference/ReferenceUI";
import {
  INTAKE_STEP_CONFIG,
  getNextIntakeStepSlug,
  getIntakeStepNumber,
  isIntakeStepSlug,
} from "@/lib/portal/intakeSteps";
import { isIntakeStepComplete, intakeStepKeyFromSlug } from "@/lib/portal/step-validation";

export default function PortalStapPage() {
  const { stepSlug } = useParams<{ stepSlug: string }>();
  const { client } = usePortalAuth();

  if (!client) return null;
  if (!isIntakeStepSlug(stepSlug)) {
    return <Navigate to="/portal" replace />;
  }

  const config = INTAKE_STEP_CONFIG[stepSlug];
  const stepKey = intakeStepKeyFromSlug(stepSlug);
  const stepComplete = stepKey ? isIntakeStepComplete(client, stepKey) : false;
  const nextSlug = getNextIntakeStepSlug(stepSlug);
  const nextStepHref = nextSlug ? `/portal/stap/${nextSlug}` : undefined;

  return (
    <div>
      <Link
        to="/portal"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6B7280] hover:text-[#111111]"
      >
        <ChevronLeft className="h-4 w-4" />
        Terug naar dashboard
      </Link>

      <ReferencePageTitle title={config.title} subtitle={config.subtitle} />

      {stepKey && (
        <p className="mb-5 text-[12px] font-medium text-[#7547F8]">
          Stap {getIntakeStepNumber(stepSlug)} van 7
        </p>
      )}

      {config.type === "package" ? (
        <PackageCheckoutWizard
          embedded
          nextStepHref={nextStepHref}
          nextStepLabel="Naar de volgende stap"
          stepComplete={stepComplete}
        />
      ) : (
        <OnboardingWizard
          forcedStep={config.step}
          singleStep
          hideStepper
          hidePackageSidebar
          nextStepHref={nextStepHref}
          stepComplete={stepComplete}
        />
      )}
    </div>
  );
}
