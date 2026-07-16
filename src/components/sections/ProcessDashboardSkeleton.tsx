import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  FileText,
  Globe,
  Headphones,
  LayoutDashboard,
  Link2,
  Loader2,
  Receipt,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ProcessStepId = 0 | 1 | 2;

type ProcessDashboardProps = {
  activeStep: ProcessStepId;
};

type NavItem = {
  label: string;
  icon: typeof LayoutDashboard;
  activeOn?: ProcessStepId[];
};

const overviewNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, activeOn: [2] },
  { label: "Website", icon: Globe, activeOn: [0, 1] },
  { label: "Koppelingen", icon: Link2, activeOn: [0, 1] },
  { label: "Facturatie", icon: Receipt },
  { label: "Betaling", icon: CreditCard },
];

const automationNav: NavItem[] = [
  { label: "Boekingskalender", icon: Calendar, activeOn: [1, 2] },
  { label: "Review management", icon: Star, activeOn: [1] },
  { label: "Boekingen", icon: FileText, activeOn: [2] },
];

const stepMeta: Record<
  ProcessStepId,
  { title: string; tab: string; subtitle: string }
> = {
  0: {
    title: "Kennismaking",
    tab: "Intakeformulier",
    subtitle: "Wensen en doelen vastleggen",
  },
  1: {
    title: "Ontwerp & bouw",
    tab: "Preview omgeving",
    subtitle: "Website wordt ingericht",
  },
  2: {
    title: "Livegang",
    tab: "Huidige maand",
    subtitle: "Je platform draait live",
  },
};

const cardClass = "rounded-2xl border border-[#e8e6e2] bg-white p-5 md:p-6 shadow-card";

const NavLink = ({
  item,
  activeStep,
}: {
  item: NavItem;
  activeStep: ProcessStepId;
}) => {
  const isActive = item.activeOn?.includes(activeStep) ?? false;

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12px] font-medium transition-colors",
        isActive ? "bg-[#eceae6] text-foreground" : "text-muted-foreground",
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      <span>{item.label}</span>
    </div>
  );
};

const Sidebar = ({ activeStep }: { activeStep: ProcessStepId }) => (
  <aside className="flex w-[200px] shrink-0 flex-col border-r border-[#ebe8e4] bg-[#f8f7f5] px-3 py-4 md:w-[216px] md:px-4 md:py-5">
    <button
      type="button"
      className="mb-5 flex w-full items-center gap-2.5 rounded-xl border border-[#ebe8e4] bg-white shadow-block px-2.5 py-2 text-left shadow-sm"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
        J
      </span>
      <span className="min-w-0 flex-1 truncate text-xs font-semibold text-foreground">
        Jouw bedrijf
      </span>
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>

    <nav className="flex-1 space-y-5">
      <div>
        <p className="mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Overzicht
        </p>
        <ul className="space-y-0.5">
          {overviewNav.map((item) => (
            <li key={item.label}>
              <NavLink item={item} activeStep={activeStep} />
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Automatiseringen
        </p>
        <ul className="space-y-0.5">
          {automationNav.map((item) => (
            <li key={item.label}>
              <NavLink item={item} activeStep={activeStep} />
            </li>
          ))}
        </ul>
      </div>
    </nav>

    <div className="mt-4 space-y-2 border-t border-[#ebe8e4] pt-4">
      <button
        type="button"
        className="flex w-full items-center gap-2.5 rounded-xl border border-[#ebe8e4] bg-white shadow-block px-2.5 py-2 text-left"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8e6e2] text-[10px] font-semibold text-foreground">
          JD
        </span>
        <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
          Jij
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </button>

      <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12px] font-medium text-muted-foreground">
        <Headphones className="h-4 w-4 shrink-0" strokeWidth={1.75} />
        <span>Klantenservice</span>
      </div>
    </div>
  </aside>
);

const StepZeroContent = () => (
  <div className="grid min-h-[580px] content-start gap-4 lg:grid-cols-2 lg:gap-5">
    <div className={cardClass}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-foreground">Bedrijfsgegevens</h4>
        <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
          3/5 ingevuld
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { label: "Bedrijfsnaam", value: "Jouw bedrijf B.V." },
          { label: "Branche", value: "Dienstverlening" },
          { label: "Locatie", value: "Utrecht" },
          { label: "Contactpersoon", value: "Jan de Vries" },
        ].map((field) => (
          <div key={field.label} className={field.label === "Contactpersoon" ? "sm:col-span-2" : ""}>
            <p className="mb-1 text-[11px] text-muted-foreground">{field.label}</p>
            <div className="rounded-xl border border-[#ebe8e4] bg-[#fafaf9] shadow-block px-3 py-2.5 text-xs font-medium text-foreground">
              {field.value}
            </div>
          </div>
        ))}
        <div className="sm:col-span-2">
          <p className="mb-1 text-[11px] text-muted-foreground">Doelgroep</p>
          <div className="rounded-xl border border-dashed border-primary/30 bg-primary/[0.03] px-3 py-2.5 text-xs text-muted-foreground">
            Typ hier je doelgroep…
          </div>
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-4 lg:gap-5">
      <div className={cn(cardClass, "flex-1")}>
        <h4 className="mb-4 text-sm font-semibold text-foreground">Doelen & wensen</h4>
        <ul className="space-y-2.5">
          {[
            "Meer aanvragen via de website",
            "Online afspraken laten inplannen",
            "Professionele uitstraling",
            "Koppeling met agenda",
          ].map((item, i) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl bg-[#fafaf9] px-3 py-2.5"
            >
              <span
                className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                  i < 3
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-[#e0ddd8] bg-white",
                )}
              >
                {i < 3 && <CheckCircle2 className="h-3 w-3" />}
              </span>
              <span className="text-xs leading-relaxed text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={cardClass}>
        <h4 className="mb-4 text-sm font-semibold text-foreground">Gewenste koppelingen</h4>
        <div className="mb-4 flex flex-wrap gap-2">
          {["Calendly", "Google Maps", "Mollie", "Reviews"].map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-[#ebe8e4] bg-[#fafaf9] shadow-block px-2.5 py-1 text-[11px] font-medium text-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mb-1.5 text-[11px] text-muted-foreground">Opmerkingen</p>
        <div className="rounded-xl border border-[#ebe8e4] bg-[#fafaf9] shadow-block p-3 text-xs leading-relaxed text-muted-foreground">
          We willen een strakke site met boekingen en automatische opvolgmails.
        </div>
        <button
          type="button"
          className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white"
        >
          Formulier versturen
        </button>
      </div>
    </div>
  </div>
);

const StepOneContent = () => (
  <div className="grid min-h-[580px] content-start gap-4 lg:grid-cols-2 lg:gap-5">
    <div className={cardClass}>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">Website</h4>
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
      </div>
      <p className="mb-1 text-[11px] text-muted-foreground">Voortgang</p>
      <p className="mb-3 text-2xl font-bold tabular-nums text-foreground">72%</p>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-[#f0eeea]">
        <div className="h-full w-[72%] rounded-full bg-primary" />
      </div>
      <ul className="space-y-2 text-xs text-muted-foreground">
        <li className="flex items-center gap-2 text-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          Design goedgekeurd
        </li>
        <li className="flex items-center gap-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
          Pagina&apos;s worden gebouwd
        </li>
        <li className="flex items-center gap-2 opacity-50">Koppelingen instellen</li>
      </ul>
    </div>

    <div
      className={cn(
        cardClass,
        "border-primary/25 shadow-[0_8px_24px_-16px_hsl(255_80%_60%_/_0.35)]",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-foreground">Preview</h4>
        <span className="shrink-0 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-600">
          In livegang
        </span>
      </div>
      <p className="mb-1 text-[11px] text-muted-foreground">Omgeving</p>
      <p className="mb-3 text-sm font-semibold text-primary">preview.jouwbedrijf.nl</p>
      <div className="mb-3 overflow-hidden rounded-xl border border-[#ebe8e4] bg-[#fafaf9] shadow-block">
        <div className="border-b border-[#ebe8e4] px-3 py-1.5 text-[10px] text-muted-foreground">
          Homepage · concept
        </div>
        <div className="space-y-2 p-3">
          <div className="h-2 w-3/4 rounded bg-foreground/75" />
          <div className="h-1.5 w-full rounded bg-muted-foreground/20" />
          <div className="mt-2 h-16 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5" />
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Laatste feedback verwerkt · 2 open punten
      </p>
    </div>

    <div className={cn(cardClass, "lg:col-span-2")}>
      <h4 className="mb-4 text-sm font-semibold text-foreground">Koppelingen</h4>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { name: "Boekingskalender", status: "Actief" },
          { name: "Review management", status: "Inrichten" },
          { name: "Contactformulier", status: "Inrichten" },
        ].map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-xl bg-[#fafaf9] px-4 py-3"
          >
            <span className="text-xs font-medium text-foreground">{item.name}</span>
            <span
              className={cn(
                "text-[11px] font-medium",
                item.status === "Actief" ? "text-emerald-600" : "text-amber-600",
              )}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const StepTwoContent = () => (
  <div className="grid min-h-[580px] content-start gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
    {[
      {
        title: "Websitebezoekers",
        label: "Deze maand",
        value: "1.284",
        sub: "+18% t.o.v. vorige maand",
        live: true,
      },
      {
        title: "Aanvragen",
        label: "Via formulier",
        value: "38",
        sub: "12 via contact · 26 via demo",
        live: true,
      },
      {
        title: "Afspraken",
        label: "Geboekt",
        value: "17",
        sub: "Via boekingskalender",
        live: true,
      },
      {
        title: "Reviews",
        label: "Gemiddelde score",
        value: "4,9",
        sub: "23 reviews ontvangen",
        live: true,
      },
      {
        title: "Conversie",
        label: "Bezoek → aanvraag",
        value: "3,1%",
        sub: "Boven branchegemiddelde",
        live: true,
      },
      {
        title: "Status",
        label: "jouwbedrijf.nl",
        value: "Live",
        sub: "SSL actief · 99,9% uptime",
        live: true,
        highlight: true,
      },
    ].map((card) => (
      <div
        key={card.title}
        className={cn(
          cardClass,
          card.highlight &&
            "border-primary/25 shadow-[0_8px_24px_-16px_hsl(255_80%_60%_/_0.3)]",
        )}
      >
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">{card.title}</h4>
          {card.live && (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={2} />
          )}
        </div>
        <p className="mb-1 text-[11px] text-muted-foreground">{card.label}</p>
        <p className="mb-1.5 text-2xl font-bold tabular-nums text-foreground">{card.value}</p>
        <p className="text-[11px] leading-relaxed text-muted-foreground">{card.sub}</p>
      </div>
    ))}
  </div>
);

export const ProcessDashboardSkeleton = ({ activeStep }: ProcessDashboardProps) => {
  const meta = stepMeta[activeStep];

  return (
    <div className="w-full overflow-hidden rounded-[1.25rem] border border-[#e8e6e2] bg-white shadow-[0_20px_60px_-32px_rgba(15,23,42,0.18)] md:rounded-[1.5rem]">
      <div className="flex">
        <Sidebar activeStep={activeStep} />

        <div className="min-w-0 flex-1 bg-white p-4 md:p-6 lg:p-7">
          <div className="mb-5 md:mb-6">
            <h3 className="text-lg font-bold tracking-tight text-foreground md:text-xl">
              {meta.title}
            </h3>
            <div className="mt-3 flex gap-5 border-b border-[#ebe8e4]">
              <span className="border-b-2 border-primary pb-2.5 text-xs font-semibold text-primary md:text-sm">
                {meta.tab}
              </span>
              <span className="pb-2.5 text-xs font-medium text-muted-foreground md:text-sm">
                {meta.subtitle}
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="min-h-[580px]"
            >
              {activeStep === 0 && <StepZeroContent />}
              {activeStep === 1 && <StepOneContent />}
              {activeStep === 2 && <StepTwoContent />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
