import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Check, Upload, X, Plus, Trash2, Search, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { upsertClient } from "@/lib/portal/storage";
import {
  DESIRED_SECTIONS,
  STYLE_OPTIONS,
  TONE_OPTIONS,
  WEBSITE_GOALS,
} from "@/lib/portal/constants";
import {
  ONBOARDING_STEPS,
  type OnboardingData,
  type OnboardingStepId,
  createDefaultOnboarding,
} from "@/lib/portal/types";
import { getBuildSteps, PAYMENT_TERM_DAYS, getClientReferenceNumber } from "@/lib/portal/helpers";
import { captureTermsAcceptance } from "@/lib/portal/terms-audit";
import { validateIntakeStep, type IntakeStepKey } from "@/lib/portal/step-validation";
import { createDefaultWebsiteReferences } from "@/lib/portal/references";
import { ChevronDown } from "lucide-react";
import { notifyIntakeActivation } from "@/data/revision-policy";
import type { ClientAccount } from "@/lib/portal/types";
import { PortalBadge, PortalCard, PortalLabel, PortalFieldLabel, portalPillInputClass, portalPillTextareaClass } from "@/components/portal/PortalUI";
import { IntakeValidationDialog } from "@/components/portal/IntakeValidationDialog";
import { ReferenceStepper, ReferenceCard, ReferencePackageOverview } from "@/components/portal/reference/ReferenceUI";
import { getPlanById, getMaintenanceById } from "@/lib/portal/constants";
import { OpeningHoursEditor } from "@/components/portal/OpeningHoursEditor";
import { IntakeSuccessView } from "@/components/portal/IntakeSuccessView";
import { PortalCommentsBox } from "@/components/portal/IntakeStepSidebar";
import { PortalIntakeTerms } from "@/components/portal/PortalIntakeTerms";
import { IntegrationIconTile } from "@/components/integrations/IntegrationIcon";
import { integrations, integrationCategories, getIntegrationsByCategory, getCategoryLabel, type IntegrationCategoryId } from "@/data/integrations";
import { ROUTES } from "@/lib/routes";
import { contactInfo } from "@/data/contact";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

function generatePalette(primary: string, secondary: string, accent: string): string[] {
  return [primary, secondary, accent, "#F5F4F2", "#FFFFFF"];
}

const INTAKE_UI_STEPS = [
  { id: "company", label: "Gegevens" },
  { id: "wishes", label: "Website" },
  { id: "media", label: "Huisstijl" },
  { id: "integrations", label: "Koppelingen" },
  { id: "billing", label: "Facturatie" },
  { id: "payment", label: "Betalen" },
];

const NAV_ORDER: OnboardingStepId[] = ["company", "wishes", "media", "integrations", "billing", "payment"];

type OnboardingWizardProps = {
  embedded?: boolean;
  forcedStep?: OnboardingStepId;
  hideStepper?: boolean;
  hidePackageSidebar?: boolean;
  singleStep?: boolean;
  nextStepHref?: string;
  stepComplete?: boolean;
};

export function OnboardingWizard({
  embedded,
  forcedStep,
  hideStepper,
  hidePackageSidebar,
  singleStep,
  nextStepHref,
  stepComplete,
}: OnboardingWizardProps = {}) {
  const { client, refreshClient } = usePortalAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stepParam = searchParams.get("step");

  const [data, setData] = useState<OnboardingData>(() =>
    client?.onboarding ?? createDefaultOnboarding(),
  );
  const [showSuccess, setShowSuccess] = useState(() => client?.onboarding.completed ?? false);
  const [integrationCategory, setIntegrationCategory] = useState<IntegrationCategoryId>("agenda");
  const [integrationSearch, setIntegrationSearch] = useState("");
  const [termsLoading, setTermsLoading] = useState(false);
  const [paymentRulesOpen, setPaymentRulesOpen] = useState(false);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const currentStepKey: IntakeStepKey =
    forcedStep === "review" ? "payment" : (forcedStep ?? (data.currentStep === "review" ? "payment" : data.currentStep)) as IntakeStepKey;

  const validationClient = useMemo((): ClientAccount | null => {
    if (!client) return null;
    return { ...client, onboarding: data };
  }, [client, data]);

  const isMaatwerkPlan = client?.package.planId === "maatwerk";

  useEffect(() => {
    if (stepParam && ONBOARDING_STEPS.some((s) => s.id === stepParam || stepParam === "review")) {
      const mapped = stepParam === "review" ? "payment" : (stepParam as OnboardingStepId);
      setData((d) => ({ ...d, currentStep: mapped }));
      if (mapped !== "payment") setShowSuccess(false);
    }
  }, [stepParam]);

  useEffect(() => {
    if (forcedStep && forcedStep !== data.currentStep) {
      const mapped = forcedStep === "review" ? "payment" : forcedStep;
      setData((d) => ({ ...d, currentStep: mapped }));
      if (mapped !== "payment") setShowSuccess(false);
    }
  }, [forcedStep, data.currentStep]);


  const save = useCallback(
    (partial: Partial<OnboardingData>, markStep = false) => {
      if (!client) return;
      const stepToMark = (
        forcedStep === "review" ? "payment" : (forcedStep ?? data.currentStep)
      ) as OnboardingData["currentStep"];
      const completedSteps = markStep
        ? [...new Set([...data.completedSteps, stepToMark])]
        : data.completedSteps;
      const updated = { ...data, ...partial, completedSteps };
      setData(updated);
      upsertClient({ ...client, onboarding: updated });
      refreshClient();
    },
    [client, data, refreshClient, forcedStep],
  );

  const toggle = (field: "goals" | "desiredPages" | "integrations", value: string) => {
    const arr = data[field];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    setData((d) => ({ ...d, [field]: next }));
    save({ [field]: next });
  };

  const navStep = data.currentStep === "review" ? "payment" : data.currentStep;
  const navIndex = NAV_ORDER.indexOf(navStep);

  const updateBilling = (field: string, value: string) => {
    if (!client) return;
    upsertClient({ ...client, billingInfo: { ...client.billingInfo, [field]: value } });
    refreshClient();
  };

  const showValidationDialog = (errors: string[]) => {
    setValidationErrors(errors);
    setValidationDialogOpen(true);
  };

  const finishSingleStep = () => {
    if (!validationClient) return;
    const markVisited = currentStepKey === "integrations";
    save({}, markVisited);
    toast({ title: "Opgeslagen" });
    navigate("/portal");
  };

  const finishAndContinue = () => {
    if (!validationClient) return;
    const check = validateIntakeStep(validationClient, currentStepKey);
    if (!check.valid) {
      showValidationDialog(check.errors);
      return;
    }
    save({}, true);
    toast({ title: "Opgeslagen" });
    if (nextStepHref) navigate(nextStepHref);
  };

  const handleTermsChange = async (checked: boolean) => {
    if (!client) return;
    if (checked) {
      setTermsLoading(true);
      const audit = await captureTermsAcceptance();
      const updated = {
        ...data,
        termsAccepted: true,
        termsAcceptedAt: audit.acceptedAt,
      };
      setData(updated);
      upsertClient({ ...client, onboarding: updated, termsAcceptance: audit });
      refreshClient();
      setTermsLoading(false);
    } else {
      const updated = { ...data, termsAccepted: false, termsAcceptedAt: undefined };
      setData(updated);
      upsertClient({ ...client, onboarding: updated, termsAcceptance: undefined });
      refreshClient();
    }
  };

  const visibleIntegrations = useMemo(() => {
    const q = integrationSearch.trim().toLowerCase();
    let list = q
      ? integrations.filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            i.cardDescription.toLowerCase().includes(q) ||
            getCategoryLabel(i.category).toLowerCase().includes(q),
        )
      : getIntegrationsByCategory(integrationCategory);
    return list;
  }, [integrationSearch, integrationCategory]);

  const pendingPaymentTotal = client?.package.planPrice ?? "—";
  const clientRef = client ? getClientReferenceNumber(client) : "—";

  const goNext = () => {
    if (navIndex < NAV_ORDER.length - 1) {
      save({ currentStep: NAV_ORDER[navIndex + 1] }, true);
    }
  };
  const goPrev = () => {
    if (navIndex > 0) save({ currentStep: NAV_ORDER[navIndex - 1] });
  };

  const handleMedia = async (files: FileList | null) => {
    if (!files) return;
    const media = [...data.media];
    for (const file of Array.from(files)) {
      const maxSize = file.name.endsWith(".zip") || file.type.startsWith("video/") ? 25 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({ title: "Bestand te groot", description: `${file.name} overschrijdt de limiet.` });
        continue;
      }
      const dataUrl = await new Promise<string>((r) => {
        const reader = new FileReader();
        reader.onload = () => r(reader.result as string);
        reader.readAsDataURL(file);
      });
      media.push({ id: crypto.randomUUID(), name: file.name, type: file.type, size: file.size, dataUrl, uploadedAt: new Date().toISOString() });
    }
    save({ media });
    setData((d) => ({ ...d, media }));
  };

  const updateColor = (key: "primary" | "secondary" | "accent" | "extra", value: string) => {
    const colors = {
      ...data.colors,
      [key]: value,
      palette: generatePalette(
        key === "primary" ? value : data.colors.primary,
        key === "secondary" ? value : data.colors.secondary,
        key === "accent" ? value : data.colors.accent,
      ),
    };
    save({ colors });
    setData((d) => ({ ...d, colors }));
  };

  const handleSubmit = () => {
    if (!client || !validationClient) return;
    const steps: IntakeStepKey[] = ["company", "media", "wishes", "package", "billing", "payment"];
    for (const s of steps) {
      const check = validateIntakeStep(validationClient, s);
      if (!check.valid) {
        showValidationDialog(check.errors);
        return;
      }
    }
    if (!data.termsAccepted) {
      toast({ title: "Voorwaarden vereist", description: "Accepteer eerst de algemene voorwaarden in stap 6." });
      return;
    }
    const final = {
      ...data,
      completed: true,
      submittedAt: new Date().toISOString(),
      completedSteps: ONBOARDING_STEPS.map((s) => s.id),
    };
    const progress = {
      ...client.progress,
      percent: 35,
      phase: "Intake ontvangen",
      steps: getBuildSteps(final, 35),
      lastUpdate: new Date().toISOString(),
    };
    upsertClient({ ...client, onboarding: final, progress });
    setData(final);
    setShowSuccess(true);
    refreshClient();
    notifyIntakeActivation({
      companyName: data.company.name || client.companyName,
      clientNumber: getClientReferenceNumber(client),
      email: client.email,
      isMaatwerk: isMaatwerkPlan,
    });
    toast({
      title: "Intake verstuurd",
      description: isMaatwerkPlan
        ? "We nemen zo snel mogelijk contact met je op."
        : "We gaan aan de slag zodra je betaling is ontvangen.",
    });
    if (singleStep) navigate("/portal");
  };

  const filledCompany = [
    data.company.name,
    data.company.industry,
    data.company.location,
    data.company.contactPerson,
    data.company.targetAudience,
    data.company.aboutCompany,
    data.company.desiredDomain,
  ].filter(Boolean).length;

  const uiStep = navStep;
  const uiStepIndex = INTAKE_UI_STEPS.findIndex((s) => s.id === uiStep);
  const showStepper = !hideStepper && !embedded && !singleStep;
  const showSidebar = !hidePackageSidebar && !embedded && !singleStep;

  if (showSuccess && data.completed && !embedded && !singleStep) {
    return <IntakeSuccessView data={data} />;
  }

  const stepActions = singleStep ? (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <Button type="button" variant="default" onClick={finishSingleStep}>
        Opslaan & terug
      </Button>
      {nextStepHref && (
        <Button type="button" variant="brand" onClick={finishAndContinue}>
          Naar de volgende stap
        </Button>
      )}
      {!nextStepHref && currentStepKey === "payment" && (
        <Button type="button" variant="brand" onClick={handleSubmit}>
          {isMaatwerkPlan ? "Intake afronden — we nemen contact op" : "Intake versturen"}
        </Button>
      )}
    </div>
  ) : (
    <div className="flex items-center gap-3">
      {navIndex > 0 && (
        <button
          type="button"
          onClick={goPrev}
          className="text-[13px] font-medium text-[#7547F8] hover:underline"
        >
          Terug
        </button>
      )}
      <Button
        type="button"
        variant="brand"
        onClick={
          data.currentStep === "payment" || data.currentStep === "review"
            ? handleSubmit
            : goNext
        }
      >
        {data.currentStep === "payment" || data.currentStep === "review"
          ? "Intake versturen"
          : "Opslaan & volgende"}
      </Button>
    </div>
  );

  return (
    <div>
      {showStepper && (
      <ReferenceStepper
        steps={INTAKE_UI_STEPS}
        current={uiStep}
        onBack={uiStepIndex > 0 ? goPrev : undefined}
        onNext={
          data.currentStep === "review" || data.currentStep === "billing"
            ? handleSubmit
            : goNext
        }
        nextLabel={data.currentStep === "review" || data.currentStep === "billing" ? "Intake versturen" : "Volgende"}
      />
      )}

      {embedded && !singleStep && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-[14px] font-semibold text-[#111111]">
            {INTAKE_UI_STEPS.find((s) => s.id === uiStep)?.label ?? "Intake"}
          </p>
          {stepActions}
        </div>
      )}

      <div className={cn("grid gap-5", showSidebar && "lg:grid-cols-[1fr_300px]")}>
        <div>
      {data.currentStep === "company" && (
        <ReferenceCard>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold">Bedrijfsgegevens</h3>
            <PortalBadge variant="purple">{filledCompany}/7 ingevuld</PortalBadge>
          </div>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <PortalFieldLabel required>Bedrijfsnaam</PortalFieldLabel>
                <Input
                  value={data.company.name}
                  onChange={(e) => {
                    const company = { ...data.company, name: e.target.value };
                    setData((d) => ({ ...d, company }));
                    save({ company });
                  }}
                  placeholder="Jouw bedrijf B.V."
                  className={`mt-1.5 ${portalPillInputClass}`}
                />
              </div>
              <div>
                <PortalFieldLabel required>Branche</PortalFieldLabel>
                <Input
                  value={data.company.industry}
                  onChange={(e) => {
                    const company = { ...data.company, industry: e.target.value };
                    setData((d) => ({ ...d, company }));
                    save({ company });
                  }}
                  placeholder="Dienstverlening"
                  className={`mt-1.5 ${portalPillInputClass}`}
                />
              </div>
            </div>
            {([
              ["location", "Locatie", "Utrecht"],
              ["contactPerson", "Contactpersoon", "Jan de Vries"],
              ["desiredDomain", "Gewenste domeinnaam", "jouwbedrijf.nl"],
            ] as const).map(([key, label, ph]) => (
              <div key={key}>
                <PortalFieldLabel required>{label}</PortalFieldLabel>
                <Input
                  value={data.company[key] ?? ""}
                  onChange={(e) => {
                    const company = { ...data.company, [key]: e.target.value };
                    setData((d) => ({ ...d, company }));
                    save({ company });
                  }}
                  placeholder={ph}
                  className={`mt-1.5 ${portalPillInputClass}`}
                />
              </div>
            ))}
            <div>
              <PortalFieldLabel recommended>Huidige website</PortalFieldLabel>
              <p className="mt-1 text-[12px] text-[#9CA3AF]">
                Optioneel — alleen invullen als je al een website hebt die we kunnen bekijken.
              </p>
              <Input
                value={data.company.existingWebsite ?? ""}
                onChange={(e) => {
                  const company = { ...data.company, existingWebsite: e.target.value };
                  setData((d) => ({ ...d, company }));
                  save({ company });
                }}
                placeholder="https://jouw-huidige-site.nl"
                className={`mt-1.5 ${portalPillInputClass}`}
              />
            </div>
            <div>
              <PortalFieldLabel required>Doelgroep</PortalFieldLabel>
              <Textarea
                value={data.company.targetAudience}
                onChange={(e) => {
                  const company = { ...data.company, targetAudience: e.target.value };
                  setData((d) => ({ ...d, company }));
                  save({ company });
                }}
                placeholder="Typ hier je doelgroep..."
                className={`mt-1.5 min-h-[90px] border-dashed border-[#7547F8]/40 bg-[#F5F3FF]/15 ${portalPillTextareaClass}`}
              />
            </div>
            <div>
              <PortalFieldLabel required>Vertel meer over je bedrijf</PortalFieldLabel>
              <Textarea
                value={data.company.aboutCompany ?? ""}
                onChange={(e) => {
                  const company = { ...data.company, aboutCompany: e.target.value };
                  setData((d) => ({ ...d, company }));
                  save({ company });
                }}
                placeholder="Vertel alles wat je kwijt wilt: diensten, werkwijze, USP's, huisstijl..."
                className={`mt-1.5 min-h-[120px] ${portalPillTextareaClass}`}
              />
            </div>
            <OpeningHoursEditor
              value={data.openingHours ?? createDefaultOnboarding().openingHours!}
              onChange={(openingHours) => {
                save({ openingHours });
                setData((d) => ({ ...d, openingHours }));
              }}
            />
          </div>
        </ReferenceCard>
      )}

      {data.currentStep === "wishes" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <PortalCard>
            <PortalLabel className="mb-4">Doel website *</PortalLabel>
            <div className="space-y-2">
              {WEBSITE_GOALS.map((g) => (
                <button key={g} type="button" onClick={() => toggle("goals", g)} className={cn("flex w-full items-center gap-3 rounded-[14px] border px-4 py-3 text-left text-[14px]", data.goals.includes(g) ? "border-[#7547F8]/30 bg-[#F5F3FF]" : "border-black/[0.08]")}>
                  <span className={cn("flex h-5 w-5 items-center justify-center rounded-full border-2", data.goals.includes(g) ? "border-[#7547F8] bg-[#7547F8] text-white" : "border-[#D1D5DB]")}>{data.goals.includes(g) && <Check className="h-3 w-3" />}</span>{g}
                </button>
              ))}
            </div>
          </PortalCard>
          <div className="space-y-5">
            <PortalCard>
              <PortalLabel className="mb-4">Gewenste secties *</PortalLabel>
              <p className="mb-3 text-[13px] text-[#6B7280]">
                Selecteer welke onderdelen op je website moeten komen en wat daar ongeveer in hoort.
              </p>
              <div className="flex flex-wrap gap-2">
                {DESIRED_SECTIONS.map((p) => (
                  <button key={p} type="button" onClick={() => toggle("desiredPages", p)} className={cn("rounded-full px-3 py-1.5 text-[12px] font-medium", data.desiredPages.includes(p) ? "bg-[#7547F8] text-white" : "bg-[#F5F4F2] text-[#6B7280]")}>{p}</button>
                ))}
              </div>
              <Textarea
                value={data.sectionNotes ?? ""}
                onChange={(e) => save({ sectionNotes: e.target.value })}
                placeholder="Beschrijf per sectie wat erin moet komen (teksten, USP's, foto's, etc.)..."
                className={`mt-4 min-h-[100px] ${portalPillTextareaClass}`}
              />
              <Input value={data.customPages ?? ""} onChange={(e) => save({ customPages: e.target.value })} placeholder="Extra secties of pagina's..." className="mt-3 rounded-[12px]" />
            </PortalCard>
            <PortalCard>
              <PortalLabel className="mb-4">Tone of voice *</PortalLabel>
              <div className="flex flex-wrap gap-2">
                {TONE_OPTIONS.map((t) => (
                  <button key={t} type="button" onClick={() => save({ toneOfVoice: t })} className={cn("rounded-full px-3 py-1.5 text-[13px] font-medium", data.toneOfVoice === t ? "bg-[#0B0B0D] text-white" : "bg-[#F5F4F2] text-[#6B7280]")}>{t}</button>
                ))}
              </div>
            </PortalCard>
          </div>
        </div>
      )}

      {data.currentStep === "media" && (
        <div className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <PortalCard>
              <PortalLabel className="mb-2">Media uploaden</PortalLabel>
              <p className="mb-4 text-[13px] leading-relaxed text-[#6B7280]">
                Upload je logo, foto&apos;s, video&apos;s of huisstijldocumenten. Ondersteunde formaten: afbeeldingen,
                PDF, ZIP en video. Max. 10 MB per bestand (ZIP/video tot 25 MB).
              </p>
              <label className="flex cursor-pointer flex-col items-center rounded-[16px] border-2 border-dashed border-black/[0.12] bg-[#FAFAFA] px-5 py-8 hover:border-[#7547F8]/40 hover:bg-[#F5F3FF]/30">
                <Upload className="mb-2 h-7 w-7 text-[#9CA3AF]" />
                <span className="text-[13px] font-medium">Sleep bestanden hierheen of klik om te uploaden</span>
                <span className="mt-1 text-[11px] text-[#9CA3AF]">JPG, PNG, SVG, PDF, ZIP, MP4</span>
                <input type="file" multiple accept="image/*,.pdf,.svg,.zip,video/*" className="hidden" onChange={(e) => handleMedia(e.target.files)} />
              </label>
              {data.media.length > 0 && (
                <div className="mt-4 space-y-2">
                  {data.media.map((f) => (
                    <div key={f.id} className="flex items-center justify-between rounded-[10px] border border-black/[0.08] px-3 py-2 text-[12px]">
                      <span className="truncate">{f.name}</span>
                      <button type="button" onClick={() => { const media = data.media.filter((m) => m.id !== f.id); save({ media }); setData((d) => ({ ...d, media })); }}><X className="h-4 w-4 text-[#9CA3AF]" /></button>
                    </div>
                  ))}
                </div>
              )}
            </PortalCard>

            <PortalCard className="border-[#7547F8]/15 bg-[#F5F3FF]/20">
              <p className="text-[13px] font-semibold text-[#111111]">Hele grote bestanden? *</p>
              <p className="mt-2 text-[12px] leading-relaxed text-[#6B7280]">
                Bestanden groter dan 25 MB kun je per e-mail sturen naar{" "}
                <a href={`mailto:${contactInfo.email.support}`} className="font-medium text-[#7547F8]">
                  {contactInfo.email.support}
                </a>
                . Vermeld je klantnummer in het onderwerp:
              </p>
              <p className="mt-2 rounded-[8px] bg-white px-3 py-2 font-mono text-[13px] font-semibold text-[#7547F8]">
                {clientRef}
              </p>
              <label className="mt-4 flex cursor-pointer items-start gap-3">
                <Checkbox
                  checked={data.largeFilesStatus === "sent"}
                  onCheckedChange={(v) =>
                    save({
                      largeFilesStatus: v === true ? "sent" : undefined,
                      largeFilesSubmitted: v === true,
                    })
                  }
                  className="mt-0.5"
                />
                <span className="text-[12px] text-[#6B7280]">Ik heb grote bestanden per e-mail verstuurd (met klantnummer)</span>
              </label>
              <label className="mt-3 flex cursor-pointer items-start gap-3">
                <Checkbox
                  checked={data.largeFilesStatus === "not_applicable"}
                  onCheckedChange={(v) =>
                    save({
                      largeFilesStatus: v === true ? "not_applicable" : undefined,
                      largeFilesSubmitted: false,
                    })
                  }
                  className="mt-0.5"
                />
                <span className="text-[12px] text-[#6B7280]">
                  Niet van toepassing — ik hoef geen grote bestanden aan te leveren
                </span>
              </label>
            </PortalCard>
          </div>
          <PortalCard>
            <PortalLabel className="mb-4">Kleuren & huisstijl *</PortalLabel>
            <p className="mb-4 text-[13px] text-[#6B7280]">
              Kies je kleuren met de color picker of voer een hex-code in. Je palet wordt automatisch gegenereerd.
            </p>
            {(["primary", "secondary", "accent"] as const).map((key) => (
              <div key={key} className="mb-4">
                <Label>{key === "primary" ? "Hoofdkleur" : key === "secondary" ? "Secundair" : "Accent"}</Label>
                <div className="mt-2 flex items-center gap-3">
                  <label className="relative cursor-pointer">
                    <input
                      type="color"
                      value={data.colors[key]}
                      onChange={(e) => updateColor(key, e.target.value)}
                      className="absolute inset-0 h-12 w-12 cursor-pointer opacity-0"
                    />
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white shadow-md ring-2 ring-[#7547F8]/20"
                      style={{ backgroundColor: data.colors[key] }}
                    />
                  </label>
                  <Input
                    value={data.colors[key]}
                    onChange={(e) => updateColor(key, e.target.value)}
                    className={`max-w-[140px] font-mono uppercase ${portalPillInputClass}`}
                  />
                </div>
              </div>
            ))}
            <div className="mb-4 flex gap-2">
              {data.colors.palette.map((c, i) => (
                <div key={i} className="flex-1"><div className="aspect-square rounded-[12px] border border-black/[0.08]" style={{ backgroundColor: c }} /></div>
              ))}
            </div>
            <PortalLabel className="mb-3">Gewenste uitstraling *</PortalLabel>
            <div className="flex flex-wrap gap-2">
              {STYLE_OPTIONS.map((s) => (
                <button key={s} type="button" onClick={() => save({ stylePreference: s })} className={cn("rounded-full px-3 py-1.5 text-[13px]", data.stylePreference === s ? "bg-[#7547F8] text-white" : "bg-[#F5F4F2] text-[#6B7280]")}>{s}</button>
              ))}
            </div>
          </PortalCard>
        </div>
          <PortalCard>
            <PortalLabel className="mb-3" recommended>Referentiewebsites</PortalLabel>
            <p className="mb-4 text-[13px] text-[#6B7280]">
              Welke websites vind je mooi? Voeg de URL toe en beschrijf wat je ervan vindt — layout, kleuren, sfeer, etc.
            </p>
            <div className="space-y-4">
              {(data.websiteReferences?.length ? data.websiteReferences : createDefaultWebsiteReferences()).map(
                (ref, i) => (
                  <div key={i} className="rounded-[14px] border border-[#E2E0DB] bg-[#FAFAF8] p-4">
                    <Label className="text-[12px] text-[#6B7280]">Website URL</Label>
                    <Input
                      value={ref.url}
                      onChange={(e) => {
                        const websiteReferences = [
                          ...(data.websiteReferences ?? createDefaultWebsiteReferences()),
                        ];
                        websiteReferences[i] = { ...websiteReferences[i], url: e.target.value };
                        save({ websiteReferences, referenceWebsites: websiteReferences.map((r) => r.url) });
                        setData((d) => ({ ...d, websiteReferences }));
                      }}
                      placeholder="https://voorbeeld.nl"
                      className={`mt-1.5 ${portalPillInputClass}`}
                    />
                    <Label className="mt-3 block text-[12px] text-[#6B7280]">Wat vind je mooi aan deze website?</Label>
                    <Textarea
                      value={ref.note}
                      onChange={(e) => {
                        const websiteReferences = [
                          ...(data.websiteReferences ?? createDefaultWebsiteReferences()),
                        ];
                        websiteReferences[i] = { ...websiteReferences[i], note: e.target.value };
                        save({ websiteReferences });
                        setData((d) => ({ ...d, websiteReferences }));
                      }}
                      placeholder="Bijv. rustige layout, duidelijke CTA, mooie fotografie..."
                      className={`mt-1.5 min-h-[70px] ${portalPillTextareaClass}`}
                    />
                    {(data.websiteReferences?.length ?? 1) > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-[#6B7280]"
                        onClick={() => {
                          const websiteReferences = (data.websiteReferences ?? []).filter((_, j) => j !== i);
                          save({ websiteReferences, referenceWebsites: websiteReferences.map((r) => r.url) });
                          setData((d) => ({ ...d, websiteReferences }));
                        }}
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" /> Verwijderen
                      </Button>
                    )}
                  </div>
                ),
              )}
              <Button
                variant="outline"
                onClick={() => {
                  const websiteReferences = [
                    ...(data.websiteReferences ?? createDefaultWebsiteReferences()),
                    { url: "", note: "" },
                  ];
                  setData((d) => ({ ...d, websiteReferences }));
                  save({ websiteReferences });
                }}
                className="rounded-[12px]"
              >
                <Plus className="mr-2 h-4 w-4" />Nog een referentie toevoegen
              </Button>
            </div>
          </PortalCard>
        </div>
      )}

      {data.currentStep === "integrations" && (
        <div className="space-y-5">
          <PortalCard>
            <PortalLabel className="mb-2">Gewenste koppelingen</PortalLabel>
            <p className="mb-4 text-[13px] text-[#6B7280]">
              Zoek en selecteer koppelingen uit onze volledige catalogus van 50+ tools.
            </p>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
              <Input
                value={integrationSearch}
                onChange={(e) => setIntegrationSearch(e.target.value)}
                placeholder="Zoek koppelingen..."
                className="rounded-full pl-10"
              />
            </div>
            {!integrationSearch.trim() && (
              <div className="mb-4 flex flex-wrap gap-2">
                {integrationCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setIntegrationCategory(cat.id)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-[11px] font-medium",
                      integrationCategory === cat.id ? "bg-[#7547F8] text-white" : "bg-[#F5F4F2] text-[#6B7280]",
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
            <div className="grid gap-2 sm:grid-cols-2">
              {visibleIntegrations.map((int) => {
                const selected = data.integrations.includes(int.name);
                return (
                  <button
                    key={int.slug}
                    type="button"
                    onClick={() => toggle("integrations", int.name)}
                    className={cn(
                      "flex items-center gap-3 rounded-[12px] border px-3 py-2.5 text-left transition-colors",
                      selected ? "border-[#7547F8]/30 bg-[#F5F3FF]" : "border-black/[0.08] hover:bg-[#FAFAFA]",
                    )}
                  >
                    <IntegrationIconTile integration={int} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium">{int.name}</p>
                      <p className="truncate text-[11px] text-[#9CA3AF]">{getCategoryLabel(int.category)}</p>
                    </div>
                    {selected && <Check className="h-4 w-4 shrink-0 text-[#7547F8]" />}
                  </button>
                );
              })}
            </div>
            {visibleIntegrations.length === 0 && (
              <p className="py-6 text-center text-[13px] text-[#6B7280]">Geen koppelingen gevonden.</p>
            )}
            <p className="mt-4 text-[12px] text-[#9CA3AF]">
              {data.integrations.length} geselecteerd ·{" "}
              <Link to={ROUTES.portal.koppelingen} className="text-[#7547F8] hover:underline">
                Volledige koppelingenpagina
              </Link>
            </p>
          </PortalCard>
          {data.integrations.includes("Boekingskalender") && (
            <PortalCard>
              <h4 className="mb-3 font-medium">Boekingskalender</h4>
              <div className="grid gap-3 md:grid-cols-2">
                <Input placeholder="Huidige tool?" value={data.automationDetails.booking?.toolName ?? ""} onChange={(e) => save({ automationDetails: { ...data.automationDetails, booking: { ...data.automationDetails.booking, toolName: e.target.value } } })} className={portalPillInputClass} />
                <Input placeholder="Herinneringen gewenst? Ja/Nee" value={data.automationDetails.booking?.reminders ? "Ja" : ""} onChange={(e) => save({ automationDetails: { ...data.automationDetails, booking: { ...data.automationDetails.booking, reminders: e.target.value.toLowerCase().startsWith("j") } } })} className={portalPillInputClass} />
              </div>
            </PortalCard>
          )}
          {data.integrations.includes("Review management") && (
            <PortalCard>
              <h4 className="mb-3 font-medium">Review management</h4>
              <div className="grid gap-3 md:grid-cols-2">
                <Input placeholder="Moment van versturen" value={data.automationDetails.reviews?.sendMoment ?? ""} onChange={(e) => save({ automationDetails: { ...data.automationDetails, reviews: { ...data.automationDetails.reviews, sendMoment: e.target.value } } })} className={portalPillInputClass} />
                <Input placeholder="Kanaal: e-mail / WhatsApp / SMS" value={data.automationDetails.reviews?.channel ?? ""} onChange={(e) => save({ automationDetails: { ...data.automationDetails, reviews: { ...data.automationDetails.reviews, channel: e.target.value } } })} className={portalPillInputClass} />
              </div>
            </PortalCard>
          )}
          <PortalCard>
            <PortalCommentsBox
              value={data.notes}
              onChange={(notes) => save({ notes })}
              placeholder="We willen een strakke site met boekingen en automatische opvolgmails."
              hint="Tip: vermeld ook referenties naar websites die je mooi vindt."
            />
          </PortalCard>
        </div>
      )}

      {data.currentStep === "billing" && client && (
        <div className="space-y-4">
          <PortalCard className="space-y-4">
            <h3 className="text-[15px] font-semibold">Facturatiegegevens</h3>
            <p className="text-[13px] text-[#6B7280]">
              Vul je zakelijke factuurgegevens in. Betaaltermijn: {PAYMENT_TERM_DAYS} dagen.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <PortalFieldLabel required>Bedrijfsnaam</PortalFieldLabel>
                <Input defaultValue={client.billingInfo?.companyName ?? client.companyName} onBlur={(e) => updateBilling("companyName", e.target.value)} className={`mt-1.5 ${portalPillInputClass}`} />
              </div>
              <div>
                <PortalFieldLabel required>Voornaam ten namegestelde</PortalFieldLabel>
                <Input defaultValue={client.billingInfo?.accountHolderFirstName ?? client.user.firstName} onBlur={(e) => updateBilling("accountHolderFirstName", e.target.value)} className={`mt-1.5 ${portalPillInputClass}`} />
              </div>
              <div>
                <PortalFieldLabel required>Achternaam ten namegestelde</PortalFieldLabel>
                <Input defaultValue={client.billingInfo?.accountHolderLastName ?? client.user.lastName} onBlur={(e) => updateBilling("accountHolderLastName", e.target.value)} className={`mt-1.5 ${portalPillInputClass}`} />
              </div>
              <div>
                <PortalFieldLabel required>KVK-nummer</PortalFieldLabel>
                <Input defaultValue={client.billingInfo?.kvk ?? ""} onBlur={(e) => updateBilling("kvk", e.target.value)} placeholder="12345678" className={`mt-1.5 ${portalPillInputClass}`} />
              </div>
              <div>
                <PortalFieldLabel>BTW-nummer</PortalFieldLabel>
                <Input defaultValue={client.billingInfo?.btw ?? ""} onBlur={(e) => updateBilling("btw", e.target.value)} placeholder="NL123456789B01" className={`mt-1.5 ${portalPillInputClass}`} />
              </div>
              <div className="sm:col-span-2">
                <PortalFieldLabel required>E-mailadres facturen</PortalFieldLabel>
                <Input defaultValue={client.billingInfo?.email ?? client.email} onBlur={(e) => updateBilling("email", e.target.value)} className={`mt-1.5 ${portalPillInputClass}`} />
              </div>
              <div>
                <PortalFieldLabel required>Postcode</PortalFieldLabel>
                <Input defaultValue={client.billingInfo?.postcode ?? ""} onBlur={(e) => updateBilling("postcode", e.target.value)} className={`mt-1.5 ${portalPillInputClass}`} />
              </div>
              <div>
                <PortalFieldLabel required>Huisnummer</PortalFieldLabel>
                <Input defaultValue={client.billingInfo?.houseNumber ?? ""} onBlur={(e) => updateBilling("houseNumber", e.target.value)} className={`mt-1.5 ${portalPillInputClass}`} />
              </div>
              <div className="sm:col-span-2">
                <PortalFieldLabel required>Straatnaam</PortalFieldLabel>
                <Input defaultValue={client.billingInfo?.address ?? ""} onBlur={(e) => updateBilling("address", e.target.value)} className={`mt-1.5 ${portalPillInputClass}`} />
              </div>
              <div>
                <PortalFieldLabel required>Plaats</PortalFieldLabel>
                <Input defaultValue={client.billingInfo?.city ?? ""} onBlur={(e) => updateBilling("city", e.target.value)} className={`mt-1.5 ${portalPillInputClass}`} />
              </div>
            </div>
          </PortalCard>

          <PortalIntakeTerms
            checked={Boolean(data.termsAccepted)}
            loading={termsLoading}
            onCheckedChange={handleTermsChange}
          />
        </div>
      )}

      {(data.currentStep === "payment" || data.currentStep === "review") && client && (
        <div className="space-y-4">
          <PortalCard>
            <PortalLabel className="mb-4">Overzicht intake</PortalLabel>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-[13px]">
              <div><p className="text-[#6B7280]">Bedrijf</p><p className="font-medium">{data.company.name || "—"}</p></div>
              <div><p className="text-[#6B7280]">Domein</p><p className="font-medium">{data.company.desiredDomain || "—"}</p></div>
              <div><p className="text-[#6B7280]">Doelen</p><p className="font-medium">{data.goals.length ? data.goals.join(", ") : "—"}</p></div>
              <div><p className="text-[#6B7280]">Secties</p><p className="font-medium">{data.desiredPages.join(", ") || "—"}</p></div>
              <div><p className="text-[#6B7280]">Koppelingen</p><p className="font-medium">{data.integrations.length ? `${data.integrations.slice(0, 3).join(", ")}${data.integrations.length > 3 ? ` +${data.integrations.length - 3}` : ""}` : "—"}</p></div>
              <div><p className="text-[#6B7280]">Pakket</p><p className="font-medium">{client.package.planName}</p></div>
            </div>
          </PortalCard>

          <PortalCard className="overflow-hidden">
            <button
              type="button"
              onClick={() => setPaymentRulesOpen((o) => !o)}
              className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-[#FAFAF8]"
            >
              <div>
                <p className="text-[14px] font-semibold text-[#111111]">Betalingsregels</p>
                <p className="text-[12px] text-[#6B7280]">Wanneer betaal je wat, en wanneer starten we?</p>
              </div>
              <ChevronDown className={cn("h-5 w-5 text-[#6B7280] transition-transform", paymentRulesOpen && "rotate-180")} />
            </button>
            {paymentRulesOpen && (
              <div className="space-y-3 border-t border-[#E2E0DB] px-5 py-4 text-[13px] leading-relaxed text-[#6B7280]">
                <p>
                  <strong className="text-[#111111]">Eenmalig pakket:</strong> het websitepakket wordt in één keer gefactureerd
                  na intake. Betaaltermijn: {PAYMENT_TERM_DAYS} dagen.
                </p>
                <p>
                  <strong className="text-[#111111]">Onderhoud:</strong> maandelijks via automatische incasso, startend na
                  livegang van je website.
                </p>
                <p>
                  <strong className="text-[#111111]">Start bouw:</strong>{" "}
                  {isMaatwerkPlan
                    ? "na intake nemen wij contact op voor een offerte op maat."
                    : "zodra je betaling is ontvangen en je intake compleet is."}
                </p>
                <p>
                  <strong className="text-[#111111]">Add-ons:</strong> worden apart gefactureerd conform je selectie in stap 5.
                </p>
              </div>
            )}
          </PortalCard>

          {isMaatwerkPlan ? (
            <PortalCard className="border-[#7547F8]/15 bg-[#F5F3FF]/20">
              <h3 className="text-[16px] font-semibold text-[#111111]">Maatwerk — persoonlijk contact</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#6B7280]">
                Je hebt gekozen voor maatwerk. Er is geen online betaling nodig — we nemen contact met je op voor een
                vrijblijvend gesprek en een offerte op maat.
              </p>
              <p className="mt-3 text-[13px] text-[#6B7280]">
                Rond je intake af met de knop onderaan. Heb je vragen? Mail ons op{" "}
                <a href={`mailto:${contactInfo.email}`} className="font-medium text-[#7547F8] hover:underline">
                  {contactInfo.email}
                </a>
                .
              </p>
            </PortalCard>
          ) : (
            <PortalCard className="overflow-hidden border-[#E2E0DB]">
              <div className="border-b border-[#E2E0DB] bg-[#FAFAF8] px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-medium text-[#6B7280]">Te betalen</p>
                    <p className="text-[32px] font-semibold tracking-tight text-[#111111]">{pendingPaymentTotal}</p>
                    <p className="mt-1 text-[12px] text-[#9CA3AF]">Exclusief btw · Betaaltermijn {PAYMENT_TERM_DAYS} dagen</p>
                  </div>
                  <img src="/integrations/mollie.png" alt="Mollie" className="h-9 w-auto" />
                </div>
              </div>
              <div className="space-y-4 p-5">
                <div className="grid gap-3 sm:grid-cols-3 text-[13px]">
                  <div className="rounded-[12px] bg-[#FAFAF8] p-3">
                    <p className="text-[#9CA3AF]">Pakket</p>
                    <p className="font-medium">{client.package.planName}</p>
                  </div>
                  <div className="rounded-[12px] bg-[#FAFAF8] p-3">
                    <p className="text-[#9CA3AF]">Betaalmethode</p>
                    <p className="font-medium">iDEAL via Mollie</p>
                  </div>
                  <div className="rounded-[12px] bg-[#FAFAF8] p-3">
                    <p className="text-[#9CA3AF]">Status</p>
                    <p className="font-medium">Wacht op betaling</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => toast({ title: "Mollie (demo)", description: "Betaling wordt gekoppeld zodra Mollie actief is." })}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Nu betalen via Mollie
                </Button>
                <p className="text-[12px] leading-relaxed text-[#6B7280]">
                  Je wordt doorgestuurd naar een beveiligde Mollie-betaalomgeving. Na ontvangst van je betaling starten
                  we met de bouw van je website.
                </p>
              </div>
            </PortalCard>
          )}

          {showSuccess && data.completed && (
            <PortalBadge variant="green">
              Intake ontvangen op {new Date(data.submittedAt!).toLocaleDateString("nl-NL")}
            </PortalBadge>
          )}
        </div>
      )}

        </div>

        {showSidebar && (
        <ReferencePackageOverview
          planName={client ? getPlanById(client.package.planId)?.name ?? client.package.planName : "—"}
          planPrice={client ? getPlanById(client.package.planId)?.price ?? client.package.planPrice ?? "—" : "—"}
          maintenanceLine={
            client?.package.maintenanceName
              ? `Onderhoud ${getMaintenanceById(client.package.maintenanceId ?? "plus")?.price ?? client.package.monthlyPrice}`
              : undefined
          }
        />
        )}
      </div>

      {(singleStep || (embedded && !showStepper)) && (
        <div className="mt-5 flex justify-end border-t border-[#E2E0DB] pt-4">{stepActions}</div>
      )}

      <IntakeValidationDialog
        open={validationDialogOpen}
        onOpenChange={setValidationDialogOpen}
        errors={validationErrors}
      />
    </div>
  );
}
