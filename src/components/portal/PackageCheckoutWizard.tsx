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
import { addPaymentTermDays, formatMonthlyPriceDisplay } from "@/lib/portal/helpers";
import { pricingPackages as allPlans } from "@/data/pricing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { PortalPricingSelectRow, PortalMaintenanceSelectRow, PortalCompareLink } from "@/components/portal/PortalPricingSelectCard";
import { validateIntakeStep } from "@/lib/portal/step-validation";
import { planIncludesAddon } from "@/lib/portal/package-features";
import { IntakeValidationDialog } from "@/components/portal/IntakeValidationDialog";
import {
  MaatwerkWishlistPicker,
  MaatwerkCompletionBlock,
  getMaatwerkWishlistFromClient,
} from "@/components/portal/MaatwerkWishlistPicker";
import type { MaatwerkWishlist } from "@/lib/portal/types";

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
  const [step, setStep] = useState(() => {
    const pkg = client?.package;
    if (pkg?.planId === "maatwerk" && pkg.pendingSelection === false) return "confirm";
    return "packages";
  });
  const [selectedPlan, setSelectedPlan] = useState(client?.package.planId ?? "");
  const [selectedMaintenance, setSelectedMaintenance] = useState(client?.package.maintenanceId ?? "plus");
  const [selectedAddons, setSelectedAddons] = useState<string[]>(client?.package.selectedAddons ?? []);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [maatwerkWishlist, setMaatwerkWishlist] = useState<MaatwerkWishlist>(() =>
    client ? getMaatwerkWishlistFromClient(client) : { pages: [], integrations: [], addons: [] },
  );
  const [maatwerkJustConfirmed, setMaatwerkJustConfirmed] = useState(false);

  useEffect(() => {
    setSelectedAddons((prev) => prev.filter((id) => !planIncludesAddon(selectedPlan, id)));
  }, [selectedPlan]);

  useEffect(() => {
    if (!client) return;
    setMaatwerkWishlist(getMaatwerkWishlistFromClient(client));
  }, [client?.id, client?.package.maatwerkWishlist, client?.onboarding.desiredPages, client?.onboarding.integrations]);

  if (!client) return null;

  const plan = getPlanById(selectedPlan);
  const maintenance = getMaintenanceById(selectedMaintenance);
  const isMaatwerkSelected = selectedPlan === "maatwerk";
  const maatwerkSubmitted =
    maatwerkJustConfirmed ||
    (client.package.planId === "maatwerk" &&
      client.package.pendingSelection === false &&
      client.package.maatwerkPending === true);

  const persistMaatwerkWishlist = (wishlist: MaatwerkWishlist) => {
    upsertClient({
      ...client,
      package: {
        ...client.package,
        maatwerkWishlist: wishlist,
      },
      onboarding: {
        ...client.onboarding,
        desiredPages: wishlist.pages.length > 0 ? wishlist.pages : client.onboarding.desiredPages,
        integrations:
          wishlist.integrations.length > 0 ? wishlist.integrations : client.onboarding.integrations,
      },
    });
    refreshClient();
  };

  const handleMaatwerkWishlistChange = (wishlist: MaatwerkWishlist) => {
    setMaatwerkWishlist(wishlist);
    persistMaatwerkWishlist(wishlist);
  };

  const markSelectionPending = () => {
    if (client.package.pendingSelection) return;
    upsertClient({
      ...client,
      package: { ...client.package, pendingSelection: true },
    });
    refreshClient();
  };

  const toggleAddon = (id: string) => {
    if (planIncludesAddon(selectedPlan, id)) return;
    setSelectedAddons((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
    markSelectionPending();
  };

  const confirmCheckout = () => {
    if (!plan) return false;
    const isMaatwerk = selectedPlan === "maatwerk";
    if (!isMaatwerk && !maintenance) return false;
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
        maintenanceIncluded: isMaatwerk ? [] : (maintenance?.highlights ?? []),
        pendingSelection: false,
        maatwerkPending: isMaatwerk,
        maatwerkWishlist: isMaatwerk ? maatwerkWishlist : undefined,
        selectedAddons: isMaatwerk ? [] : billableAddons,
      },
      onboarding: isMaatwerk
        ? {
            ...client.onboarding,
            desiredPages:
              maatwerkWishlist.pages.length > 0
                ? maatwerkWishlist.pages
                : client.onboarding.desiredPages,
            integrations:
              maatwerkWishlist.integrations.length > 0
                ? maatwerkWishlist.integrations
                : client.onboarding.integrations,
          }
        : client.onboarding,
    });
    refreshClient();
    if (isMaatwerk) setMaatwerkJustConfirmed(true);
    toast({
      title: isMaatwerk ? "Maatwerk-aanvraag ontvangen" : "Pakket opgeslagen",
      description: isMaatwerk
        ? "We nemen zo snel mogelijk contact met je op om alles samen in te delen."
        : "Je keuze is bevestigd.",
    });
    return true;
  };

  const goBack = () => {
    if (step === "maintenance") setStep("packages");
    else if (step === "confirm") {
      setStep(isMaatwerkSelected ? "packages" : "maintenance");
    }
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

  const saveDraftSelection = () => {
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
        maintenanceIncluded: maintenance?.highlights ?? client.package.maintenanceIncluded ?? [],
        pendingSelection: true,
        maatwerkPending: isMaatwerk ? client.package.maatwerkPending : false,
        maatwerkWishlist: isMaatwerk ? maatwerkWishlist : undefined,
        selectedAddons: billableAddons,
      },
    });
    refreshClient();
  };

  const stepIndex = CHECKOUT_STEPS.findIndex((s) => s.id === step);

  const saveAndBack = () => {
    if (step === "confirm") {
      confirmCheckout();
    } else {
      saveDraftSelection();
    }
    toast({ title: "Opgeslagen" });
    onSaved?.();
    navigate("/portal");
  };

  const saveAndContinue = () => {
    const maatwerkAlreadySubmitted =
      client.package.planId === "maatwerk" &&
      client.package.pendingSelection === false &&
      client.package.maatwerkPending === true;

    if (step !== "confirm" && !maatwerkAlreadySubmitted) {
      saveDraftSelection();
      setValidationErrors([
        isMaatwerkSelected
          ? "Bevestig je aanvraag met 'Aanvraag bevestigen' voordat je naar de volgende stap gaat."
          : "Bevestig je pakketkeuze met 'Keuze bevestigen' voordat je naar de volgende stap gaat.",
      ]);
      setValidationDialogOpen(true);
      return;
    }
    if (!maatwerkAlreadySubmitted && !confirmCheckout()) return;
    if (isMaatwerkSelected || maatwerkAlreadySubmitted) {
      if (nextStepHref) navigate(nextStepHref);
      return;
    }
    const check = validateIntakeStep(
      {
        ...client,
        package: {
          ...client.package,
          planId: selectedPlan,
          planName: plan?.name ?? client.package.planName,
          planPrice: plan?.price ?? client.package.planPrice,
          pendingSelection: false,
          maintenanceId: selectedPlan === "maatwerk" ? undefined : selectedMaintenance,
          maintenanceName: selectedPlan === "maatwerk" ? undefined : maintenance?.name,
          monthlyPrice: selectedPlan === "maatwerk" ? "—" : (maintenance?.price ?? client.package.monthlyPrice),
          selectedAddons: selectedAddons.filter((id) => !planIncludesAddon(selectedPlan, id)),
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

  const wizardNavButtonClass =
    "rounded-full border-[#E2E0DB] bg-[#F5F5F5] text-[#111111] shadow-none hover:bg-[#EBEBEA]";

  const wizardStepNav = (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {stepIndex > 0 && (
        <Button variant="outline" onClick={goBack} className={wizardNavButtonClass}>
          Vorige
        </Button>
      )}
      {step !== "confirm" && (
        <Button variant="outline" onClick={goNext} disabled={nextDisabled} className={wizardNavButtonClass}>
          {step === "packages" ? (
            <>
              <span className="font-semibold">Volgende:</span>{" "}
              {isMaatwerkSelected ? "Bevestigen →" : "Onderhoud →"}
            </>
          ) : step === "maintenance" ? (
            <>
              <span className="font-semibold">Volgende:</span> Bevestigen →
            </>
          ) : (
            <>
              <span className="font-semibold">Volgende</span> →
            </>
          )}
        </Button>
      )}
      {step === "confirm" && !maatwerkSubmitted && (
        <Button variant="outline" onClick={() => confirmCheckout()} className={wizardNavButtonClass}>
          {isMaatwerkSelected ? "Aanvraag bevestigen" : "Keuze bevestigen"}
        </Button>
      )}
    </div>
  );

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
              <div className="space-y-1">
                {allPlans.map((pkg) => (
                  <PortalPricingSelectRow
                    key={pkg.id}
                    pkg={pkg}
                    selected={selectedPlan === pkg.id}
                    onSelect={() => {
                      setSelectedPlan(pkg.id);
                      markSelectionPending();
                    }}
                  />
                ))}
              </div>
              {embedded && <div className="mt-4">{wizardStepNav}</div>}
              <PortalCompareLink className={embedded ? "mt-3" : "mt-4"} />
            </>
          )}

          {step === "maintenance" && selectedPlan !== "maatwerk" && (
            <>
              <p className="mb-1 text-[15px] font-semibold text-[#111111]">Maandelijks onderhoud</p>
              <p className="mb-3 text-[13px] text-[#6B7280]">
                Verplicht gedurende de initiële contractperiode.
              </p>
              <div className="space-y-1">
                {maintenancePackages.map((pkg) => (
                  <PortalMaintenanceSelectRow
                    key={pkg.id}
                    pkg={pkg}
                    selected={selectedMaintenance === pkg.id}
                    onSelect={() => {
                      setSelectedMaintenance(pkg.id);
                      markSelectionPending();
                    }}
                  />
                ))}
              </div>
              {embedded && <div className="mt-4">{wizardStepNav}</div>}
              <PortalCompareLink className={embedded ? "mt-3" : "mt-5"} />
            </>
          )}

          {step === "confirm" && (
            <div className="space-y-4">
              {isMaatwerkSelected ? (
                maatwerkSubmitted ? (
                  <MaatwerkCompletionBlock wishlist={maatwerkWishlist} />
                ) : (
                  <ReferenceCard className="space-y-3">
                    <h3 className="text-[15px] font-semibold">Maatwerk — persoonlijk contact</h3>
                    <p className="text-[14px] leading-relaxed text-[#6B7280]">
                      Je hebt gekozen voor maatwerk. Bevestig je aanvraag hieronder. Daarna nemen we zo snel mogelijk
                      contact met je op om alles samen in te delen.
                    </p>
                    <MaatwerkWishlistPicker
                      value={maatwerkWishlist}
                      onChange={handleMaatwerkWishlistChange}
                    />
                  </ReferenceCard>
                )
              ) : (
                <>
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
                    <p className="text-[#7547F8]">{formatMonthlyPriceDisplay(maintenance?.price)}</p>
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
                </>
              )}
            </div>
          )}
          {embedded && step === "confirm" && <div className="mt-4">{wizardStepNav}</div>}

          {!embedded && (
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
                    {step === "packages" && isMaatwerkSelected
                      ? "Volgende: Bevestigen →"
                      : step === "maintenance"
                        ? "Volgende: Bevestigen →"
                        : "Volgende →"}
                  </Button>
                )}
                {step === "confirm" && !maatwerkSubmitted && (
                  <Button variant="brand" onClick={() => confirmCheckout()}>
                    {isMaatwerkSelected ? "Aanvraag bevestigen" : "Pakket bevestigen"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {!embedded && (
          <ReferencePackageOverview
            planName={plan?.name ?? "Kies een pakket"}
            planPrice={plan?.price ?? "—"}
            maintenanceLine={
              maintenance ? `Onderhoud ${formatMonthlyPriceDisplay(maintenance.price)}` : undefined
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
        <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-[#E2E0DB] pt-4">
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
