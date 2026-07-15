import { ChevronRight, Check, Building2, Target, Image, Link2, Receipt, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { OnboardingStepId } from "@/lib/portal/types";
import { ONBOARDING_STEPS } from "@/lib/portal/types";

const STEP_ICONS: Record<OnboardingStepId, React.ComponentType<{ className?: string }>> = {
  company: Building2,
  wishes: Target,
  media: Image,
  integrations: Link2,
  billing: Receipt,
  review: CheckCircle2,
};

type IntakeStepSidebarProps = {
  currentStep: OnboardingStepId;
  completedSteps: OnboardingStepId[];
  completed: boolean;
};

export function IntakeStepSidebar({ currentStep, completedSteps, completed }: IntakeStepSidebarProps) {
  const doneCount = completedSteps.length + (completed ? 1 : 0);
  const total = ONBOARDING_STEPS.length;

  return (
    <div className="rounded-[24px] border border-black/[0.08] bg-white p-5 shadow-[0_12px_32px_-20px_rgba(15,23,42,0.10)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-[14px] font-medium leading-snug text-[#0B0B0D]">
          Rond de stappen af om je intake te voltooien
        </p>
        <span className="shrink-0 rounded-full bg-[#F5F4F2] px-2.5 py-1 text-[12px] font-semibold text-[#6B7280]">
          {Math.min(doneCount, total)}/{total}
        </span>
      </div>
      <div className="space-y-2">
        {ONBOARDING_STEPS.map((step, index) => {
          const done = completed || completedSteps.includes(step.id);
          const active = !done && step.id === currentStep;
          return (
            <Link
              key={step.id}
              to={
                step.id === "billing" || step.id === "review"
                  ? "/portal?task=submit"
                  : step.id === "company" ||
                      step.id === "wishes" ||
                      step.id === "media" ||
                      step.id === "integrations"
                    ? `/portal?task=${step.id}`
                    : `/portal/website?step=${step.id}`
              }
              className={cn(
                "flex items-center gap-3 rounded-[16px] px-4 py-3.5 transition-all",
                done && "bg-[#ECFDF5]/80",
                active && !done && "bg-[#F5F3FF] ring-1 ring-[#7547F8]/20",
                !done && !active && "bg-[#FAFAFA] hover:bg-[#F5F4F2]",
              )}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#6B7280]">
                {(() => {
                  const Icon = STEP_ICONS[step.id];
                  return <Icon className="h-3.5 w-3.5" />;
                })()}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-[14px] font-medium",
                    done ? "text-[#6B7280] line-through" : "text-[#0B0B0D]",
                  )}
                >
                  {step.label}
                </p>
                <p className="text-[12px] text-[#9CA3AF]">Stap {index + 1} van {total}</p>
              </div>
              {done ? (
                <span className="flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2 py-1 text-[11px] font-medium text-[#10B981]">
                  <Check className="h-3 w-3" /> Afgerond
                </span>
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

type PortalStepperProps = {
  steps: { id: string; label: string }[];
  current: string;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  backLabel?: string;
};

export function PortalStepper({
  steps,
  current,
  onBack,
  onNext,
  nextLabel = "Volgende",
  nextDisabled,
  backLabel = "Terug",
}: PortalStepperProps) {
  const currentIndex = steps.findIndex((s) => s.id === current);

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-0">
        {steps.map((step, i) => {
          const done = i < currentIndex;
          const active = step.id === current;
          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold",
                    done || active ? "bg-[#7547F8] text-white" : "border-2 border-[#E5E7EB] bg-white text-[#9CA3AF]",
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "hidden text-[14px] font-medium sm:inline",
                    active ? "text-[#0B0B0D]" : "text-[#9CA3AF]",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1 rounded-full",
                    i < currentIndex ? "bg-[#7547F8]" : "bg-[#E5E7EB]",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {onBack && currentIndex > 0 && (
          <button type="button" onClick={onBack} className="text-[14px] font-medium text-[#7547F8] hover:underline">
            ← {backLabel}
          </button>
        )}
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-medium text-white transition-colors",
              nextDisabled ? "cursor-not-allowed bg-[#7547F8]/40" : "bg-[#7547F8] hover:bg-[#6840E0]",
            )}
          >
            {nextLabel} →
          </button>
        )}
      </div>
    </div>
  );
}

export function PortalCommentsBox({
  value,
  onChange,
  placeholder,
  hint,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="text-[12px] text-[#6B7280]">Opmerkingen</label>
      {hint && (
        <p className="mt-1 text-[12px] italic text-[#9CA3AF]">{hint}</p>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 min-h-[90px] w-full rounded-[20px] border-0 bg-[#F5F4F2] px-4 py-3 text-[14px] italic text-[#6B7280] shadow-none placeholder:text-[#9CA3AF] placeholder:not-italic focus:outline-none focus:ring-2 focus:ring-[#7547F8]/30"
      />
    </div>
  );
}
