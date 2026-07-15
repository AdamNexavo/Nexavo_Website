import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { upsertClient, generateId } from "@/lib/portal/storage";
import {
  ReferenceCard,
  ReferencePageTitle,
  ReferencePackageOverview,
} from "@/components/portal/reference/ReferenceUI";
import {
  getPlanById,
  getMaintenanceById,
  PORTAL_ADDONS,
  maintenancePackages,
} from "@/lib/portal/constants";
import { addPaymentTermDays } from "@/lib/portal/helpers";
import { createOneTimePackageInvoice } from "@/lib/portal/invoices";
import { pricingPackages as allPlans } from "@/data/pricing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { PortalPricingSelectCard, PortalCompareLink } from "@/components/portal/PortalPricingSelectCard";
import { validateIntakeStep } from "@/lib/portal/step-validation";
import { planIncludesAddon } from "@/lib/portal/package-features";
import { IntakeValidationDialog } from "@/components/portal/IntakeValidationDialog";

const CHECKOUT_STEPS = [
  { id: "packages", label: "Pakket" },
  { id: "maintenance", label: "Onderhoud" },
  { id: "confirm", label: "Bevestigen" },
];

type PackageCheckoutWizardProps = {
  embedded?: boolean;
  onSaved?: () => void;
  nextStepHref?: string;
  nextStepLabel?: string;
  stepComplete?: boolean;
};

export function PackageCheckoutWizard({
  embedded,
  onSaved,
  nextStepHref,
  nextStepLabel,
  stepComplete,
}: PackageCheckoutWizardProps = {}) {
  const { client, refreshClient } = usePortalAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState("packages");
  const [selectedPlan, setSelectedPlan] = useState(client?.package.planId ?? "");
  const [selectedMaintenance, setSelectedMaintenance] = useState(client?.package.maintenanceId ?? "plus");
  const [selectedAddons, setSelectedAddons] = useState<string[]>(client?.package.selectedAddons ?? []);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    setSelectedAddons((prev) => prev.filter((id) => !planIncludesAddon(selectedPlan, id)));
  }, [selectedPlan]);

  if (!client) return null;

  const plan = getPlanById(selectedPlan);
  const maintenance = getMaintenanceById(selectedMaintenance);

  const toggleAddon = (id: string) => {
    if (planIncludesAddon(selectedPlan, id)) return;
    setSelectedAddons((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  const confirmCheckout = () => {
    if (!plan) return;
    const isMaatwerk = selectedPlan === "maatwerk";
    if (!isMaatwerk && !maintenance) return;
    const billableAddons = selectedAddons.filter((id) => !planIncludesAddon(selectedPlan, id));
    upsertClient({
      ...client,
      package: {
        planId: selectedPlan,
        planName: plan.name,
        planPrice: plan.price,
        maintenanceId: isMaatwerk ? undefined : selectedMaintenance,
        maintenanceName: isMaatwerk ? undefined : maintenance?.name,
        monthlyPrice: isMaatwerk ? "—" : (maintenance?.price ?? "€99"),
        maintenanceIncluded: maintenance?.highlights ?? [],
        pendingSelection: false,
        selectedAddons: billableAddons,
      },
      payments: isMaatwerk
        ? client.payments
        : client.payments.some((p) => p.billingType === "one_time" && p.status !== "paid")
          ? client.payments
          : [
              ...client.payments.filter((p) => p.billingType !== "one_time" || p.status === "paid"),
              createOneTimePackageInvoice(client, plan.name, plan.price),
            ],
    });
    refreshClient();
    toast({ title: "Pakket opgeslagen", description: "Je keuze is bevestigd." });
    return true;
  };

  const goBack = () => {
    if (step === "maintenance") setStep("packages");
    else if (step === "confirm") setStep("maintenance");
  };

  const goNext = () => {
    if (step === "packages") {
      if (selectedPlan === "maatwerk") setStep("confirm");
      else setStep("maintenance");
    } else if (step === "maintenance") setStep("confirm");
    else confirmCheckout();
  };

  const nextDisabled =
    (step === "packages" && (!selectedPlan || selectedPlan === "none")) ||
    (step === "maintenance" && selectedPlan !== "maatwerk" && !selectedMaintenance);

  const persistSelection = () => {
    if (!selectedPlan || selectedPlan === "none") return;
    const isMaatwerk = selectedPlan === "maatwerk";
    const billableAddons = selectedAddons.filter((id) => !planIncludesAddon(selectedPlan, id));
    upsertClient({
      ...client,
      package: {
        ...client.package,
        planId: selectedPlan,
        planName: plan?.name ?? client.package.planName,
        planPrice: plan?.price ?? client.package.planPrice,
        maintenanceId: isMaatwerk ? undefined : selectedMaintenance,
        maintenanceName: isMaatwerk ? undefined : maintenance?.name,
        monthlyPrice: isMaatwerk ? "—" : (maintenance?.price ?? client.package.monthlyPrice),
        pendingSelection: false,
        selectedAddons: billableAddons,
      },
    });
    refreshClient();
  };

  const stepIndex = CHECKOUT_STEPS.findIndex((s) => s.id === step);

  const saveAndBack = () => {
    if (step === "confirm") confirmCheckout();
    else if (selectedPlan && selectedPlan !== "none" && maintenance) {
      upsertClient({
        ...client,
        package: {
          ...client.package,
          planId: selectedPlan,
          planName: plan?.name ?? client.package.planName,
          planPrice: plan?.price ?? client.package.planPrice,
          maintenanceId: selectedMaintenance,
          maintenanceName: maintenance?.name,
          monthlyPrice: maintenance?.price ?? client.package.monthlyPrice,
          pendingSelection: false,
          selectedAddons,
        },
      });
      refreshClient();
    }
    toast({ title: "Opgeslagen" });
    onSaved?.();
    navigate("/portal");
  };

  const saveAndContinue = () => {
    if (step === "confirm") {
      if (!confirmCheckout()) return;
    } else {
      persistSelection();
    }
    const check = validateIntakeStep(
      {
        ...client,
        package: {
          ...client.package,
          planId: selectedPlan,
          pendingSelection: false,
          maintenanceId: selectedPlan === "maatwerk" ? undefined : selectedMaintenance,
        },
      },
      "package",
    );
    if (!check.valid) {
      setValidationErrors(check.errors);
      setValidationDialogOpen(true);
      return;
    }
    toast({ title: "Opgeslagen" });
    if (nextStepHref) navigate(nextStepHref);
  };

  const packageValidationClient = {
    ...client,
    package: {
      ...client.package,
      planId: selectedPlan || client.package.planId,
      pendingSelection: !selectedPlan || selectedPlan === "none",
      maintenanceId: selectedPlan === "maatwerk" ? undefined : selectedMaintenance,
    },
  };
  const packageStepComplete = validateIntakeStep(
    { ...packageValidationClient, package: { ...packageValidationClient.package, pendingSelection: false } },
    "package",
  ).valid;
  const canContinuePackage = embedded ? packageStepComplete : stepComplete;

  return (
    <div>
      {!embedded && (
        <ReferencePageTitle
          title="Pakket kiezen"
          subtitle="Selecteer het pakket dat past bij je ambities. Je kunt later altijd wijzigen vóór betaling."
          back={{ label: client.companyName || "Dashboard", href: "/portal" }}
        />
      )}

      <div className="mb-5 flex items-center gap-2">
        {CHECKOUT_STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => i <= stepIndex && setStep(s.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors",
                step === s.id
                  ? "bg-[#7547F8] text-white"
                  : i < stepIndex
                    ? "bg-[#EDE9FE] text-[#7547F8]"
                    : "bg-[#F5F4F2] text-[#9CA3AF]",
              )}
            >
              {i + 1}. {s.label}
            </button>
            {i < CHECKOUT_STEPS.length - 1 && <span className="text-[#D1D5DB]">→</span>}
          </div>
        ))}
      </div>

      <div className={cn("grid gap-5", !embedded && "lg:grid-cols-[1fr_280px]")}>
        <div>
          {step === "packages" && (
            <>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {allPlans.filter((p) => p.id !== "maatwerk").map((pkg) => (
                  <PortalPricingSelectCard
                    key={pkg.id}
                    pkg={pkg}
                    compact
                    selected={selectedPlan === pkg.id}
                    onSelect={() => setSelectedPlan(pkg.id)}
                  />
                ))}
              </div>
              {allPlans.filter((p) => p.id === "maatwerk").map((pkg) => (
                <div key={pkg.id} className="mt-3 max-w-md">
                  <PortalPricingSelectCard
                    pkg={pkg}
                    compact
                    selected={selectedPlan === pkg.id}
                    onSelect={() => setSelectedPlan(pkg.id)}
                  />
                </div>
              ))}
              <PortalCompareLink className="mt-4" />
            </>
          )}

          {step === "maintenance" && selectedPlan !== "maatwerk" && (
            <>
              <ReferenceCard>
                <h3 className="mb-1 text-[15px] font-semibold">Maandelijks onderhoud</h3>
                <p className="mb-4 text-[13px] text-[#6B7280]">Verplicht gedurende de initiële contractperiode.</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {maintenancePackages.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedMaintenance(pkg.id)}
                      className={cn(
                        "rounded-[14px] border p-4 text-left transition-colors",
                        selectedMaintenance === pkg.id
                          ? "border-[#7547F8] bg-[#EDE9FE]/25"
                          : "border-[#E2E0DB] hover:border-[#7547F8]/30",
                      )}
                    >
                      {pkg.badge && (
                        <span className="mb-1 inline-block text-[10px] font-medium text-[#10B981]">{pkg.badge}</span>
                      )}
                      <p className="text-[14px] font-semibold">{pkg.name}</p>
                      <p className="text-[18px] font-semibold">{pkg.price}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{pkg.priceNote}</p>
                    </button>
                  ))}
                </div>
              </ReferenceCard>
              <PortalCompareLink className="mt-5" />
            </>
          )}

          {step === "confirm" && (
            <div className="space-y-4">
              <ReferenceCard className="space-y-3">
                <h3 className="text-[15px] font-semibold">Je selectie</h3>
                <div className="grid gap-3 sm:grid-cols-2 text-[13px]">
                  <div className="rounded-[12px] bg-[#FAFAF8] p-3">
                    <p className="text-[#9CA3AF]">Websitepakket</p>
                    <p className="font-semibold">{plan?.name}</p>
                    <p className="text-[#7547F8]">{plan?.price}</p>
                  </div>
                  <div className="rounded-[12px] bg-[#FAFAF8] p-3">
                    <p className="text-[#9CA3AF]">Onderhoud</p>
                    <p className="font-semibold">{maintenance?.name}</p>
                    <p className="text-[#7547F8]">{maintenance?.price} {maintenance?.priceNote}</p>
                  </div>
                </div>
              </ReferenceCard>

              <ReferenceCard>
                <h3 className="mb-3 text-[15px] font-semibold">Add-ons (optioneel)</h3>
                <div className="divide-y divide-[#E2E0DB]">
                  {PORTAL_ADDONS.map((addon) => {
                    const included = planIncludesAddon(selectedPlan, addon.id);
                    return (
                    <label
                      key={addon.id}
                      className={cn(
                        "flex items-start gap-3 py-3 first:pt-0 last:pb-0",
                        included ? "cursor-default" : "cursor-pointer",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={included || selectedAddons.includes(addon.id)}
                        disabled={included}
                        onChange={() => toggleAddon(addon.id)}
                        className="mt-1 h-4 w-4 rounded border-[#D1D5DB] text-[#7547F8] disabled:opacity-50"
                      />
                      <div className="flex-1">
                        <p
                          className={cn(
                            "text-[13px] font-medium",
                            included && "text-[#9CA3AF] line-through",
                          )}
                        >
                          {addon.name}
                        </p>
                        <p className="text-[12px] text-[#6B7280]">{addon.description}</p>
                        {included && (
                          <p className="mt-0.5 text-[11px] font-medium text-[#10B981]">
                            Al inclusief in je pakket
                          </p>
                        )}
                      </div>
                      {!included && <p className="text-[13px] font-semibold">+ {addon.price}</p>}
                    </label>
                  );
                  })}
                </div>
              </ReferenceCard>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E0DB] pt-4">
            <div className="flex gap-2">
              {stepIndex > 0 && (
                <Button variant="outline" onClick={goBack}>
                  Vorige
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {step !== "confirm" && (
                <Button variant="brand" onClick={goNext} disabled={nextDisabled}>
                  {step === "maintenance" ? "Volgende: Bevestigen →" : "Volgende →"}
                </Button>
              )}
              {step === "confirm" && (
                <Button variant="brand" onClick={() => confirmCheckout()}>
                  Pakket bevestigen
                </Button>
              )}
            </div>
          </div>
        </div>

        {!embedded && (
          <ReferencePackageOverview
            planName={plan?.name ?? "Kies een pakket"}
            planPrice={plan?.price ?? "—"}
            maintenanceLine={
              maintenance ? `Onderhoud ${maintenance.price} ${maintenance.priceNote}` : undefined
            }
            extraLines={selectedAddons
              .filter((id) => !planIncludesAddon(selectedPlan, id))
              .map((id) => {
              const a = PORTAL_ADDONS.find((x) => x.id === id);
              return a ? `+ ${a.name}` : "";
            }).filter(Boolean)}
          />
        )}
      </div>

      {embedded && (
        <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-[#E2E0DB] pt-4">
          <Button variant="default" onClick={saveAndBack}>
            Opslaan & terug
          </Button>
          {nextStepHref && (
            <Button variant="brand" onClick={saveAndContinue}>
              Naar de volgende stap
            </Button>
          )}
        </div>
      )}

      <IntakeValidationDialog
        open={validationDialogOpen}
        onOpenChange={setValidationDialogOpen}
        errors={validationErrors}
      />
    </div>
  );
}
