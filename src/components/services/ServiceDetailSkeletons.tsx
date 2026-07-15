import type { ComponentType, ReactNode } from "react";
import type { ServiceSkeletonId } from "@/data/services";
import {
  BarChart3,
  Bell,
  Calendar,
  Check,
  Code2,
  CreditCard,
  FileText,
  Globe,
  Link2,
  Mail,
  MessageSquare,
  MonitorSmartphone,
  MousePointerClick,
  Palette,
  PenLine,
  Search,
  Server,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type StepStatus = "done" | "active" | "pending";

type FlowStep = {
  label: string;
  sublabel: string;
  status: StepStatus;
};

type FlowConfig = {
  title: string;
  subtitle: string;
  icon: ComponentType<{ className?: string }>;
  steps: FlowStep[];
};

const detailFlows: Record<ServiceSkeletonId, FlowConfig> = {
  websites: {
    title: "Website traject",
    subtitle: "Van idee tot live site",
    icon: Globe,
    steps: [
      { label: "Intake & design", sublabel: "Doelen en huisstijl", status: "done" },
      { label: "Content & structuur", sublabel: "Pagina's en teksten", status: "done" },
      { label: "Ontwikkeling", sublabel: "Bouw en koppelingen", status: "active" },
      { label: "Livegang", sublabel: "Testen en opleveren", status: "pending" },
    ],
  },
  boekingskalender: {
    title: "Boekingsflow",
    subtitle: "Van klik tot bevestigde afspraak",
    icon: Calendar,
    steps: [
      { label: "Dienst kiezen", sublabel: "Klant selecteert behandeling", status: "done" },
      { label: "Datum & tijd", sublabel: "Beschikbare slots tonen", status: "done" },
      { label: "Bevestiging", sublabel: "Automatisch per e-mail", status: "active" },
      { label: "Herinnering", sublabel: "24 uur van tevoren", status: "pending" },
    ],
  },
  "review-management": {
    title: "Review flow",
    subtitle: "Automatisch na elke afspraak",
    icon: Sparkles,
    steps: [
      { label: "Boeking", sublabel: "Afspraak afgerond", status: "done" },
      { label: "Follow-up", sublabel: "24 uur wachten", status: "done" },
      { label: "Reviewverzoek", sublabel: "Automatisch per mail", status: "active" },
      { label: "Filteren", sublabel: "Positief op site, rest intern", status: "pending" },
    ],
  },
  automatiseringen: {
    title: "Automatisering",
    subtitle: "Trigger tot resultaat",
    icon: Workflow,
    steps: [
      { label: "Trigger", sublabel: "Formulier of boeking", status: "done" },
      { label: "Actie", sublabel: "E-mail of notificatie", status: "done" },
      { label: "Opvolging", sublabel: "CRM of WhatsApp", status: "active" },
      { label: "Afgerond", sublabel: "Taak automatisch klaar", status: "pending" },
    ],
  },
  integraties: {
    title: "Koppeling flow",
    subtitle: "Website en tools verbonden",
    icon: Link2,
    steps: [
      { label: "Selecteren", sublabel: "Juiste tool kiezen", status: "done" },
      { label: "Installeren", sublabel: "Tag, pixel of API", status: "done" },
      { label: "Testen", sublabel: "Volledige keten doorlopen", status: "active" },
      { label: "Live", sublabel: "Alles synchroniseert", status: "pending" },
    ],
  },
  "hosting-onderhoud": {
    title: "Hosting & onderhoud",
    subtitle: "Altijd online en veilig",
    icon: Server,
    steps: [
      { label: "Hosting", sublabel: "Site staat live", status: "done" },
      { label: "SSL & beveiliging", sublabel: "Certificaat actief", status: "done" },
      { label: "Back-ups", sublabel: "Dagelijks veiliggesteld", status: "active" },
      { label: "Monitoring", sublabel: "Uptime in de gaten", status: "pending" },
    ],
  },
  "content-seo": {
    title: "Content & SEO",
    subtitle: "Gevonden worden en overtuigen",
    icon: PenLine,
    steps: [
      { label: "Zoekwoorden", sublabel: "Doelgroep en intentie", status: "done" },
      { label: "Schrijven", sublabel: "Pagina's uitwerken", status: "done" },
      { label: "SEO-instellingen", sublabel: "Titels en structuur", status: "active" },
      { label: "Publiceren", sublabel: "Live op je website", status: "pending" },
    ],
  },
};

const statusStyles: Record<
  StepStatus,
  { dot: string; line: string; label: string; badge?: string; badgeClass?: string }
> = {
  done: {
    dot: "border-emerald-500 bg-emerald-500 text-white",
    line: "bg-emerald-300",
    label: "text-foreground",
    badge: "Klaar",
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
  active: {
    dot: "border-primary bg-primary text-white shadow-sm shadow-primary/30",
    line: "bg-primary/25",
    label: "text-foreground font-semibold",
    badge: "Actief",
    badgeClass: "bg-primary/10 text-primary",
  },
  pending: {
    dot: "border-border bg-white text-muted-foreground",
    line: "bg-border/60",
    label: "text-muted-foreground",
  },
};

const FloatingBadge = ({
  icon: Icon,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  className?: string;
}) => (
  <div
    className={cn(
      "absolute z-10 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg ring-4 ring-[#f8f6f1]",
      className,
    )}
  >
    <Icon className="h-5 w-5" />
  </div>
);

const FlowStepsSkeleton = ({ config }: { config: FlowConfig }) => {
  const Icon = config.icon;

  return (
    <div className="relative mx-auto w-full max-w-[292px]">
      <div className="overflow-hidden rounded-2xl border border-[#e8e6e2] bg-white shadow-[0_20px_60px_-32px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between border-b border-[#ebe8e4] bg-[#f8f7f5] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-foreground">{config.title}</p>
              <p className="text-[10px] text-muted-foreground">{config.subtitle}</p>
            </div>
          </div>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary">
            4 stappen
          </span>
        </div>

        <div className="space-y-0 p-4">
          {config.steps.map((step, index) => {
            const styles = statusStyles[step.status];
            const isLast = index === config.steps.length - 1;

            return (
              <div key={step.label} className="relative flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold",
                      styles.dot,
                    )}
                  >
                    {step.status === "done" ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {!isLast && (
                    <div className={cn("my-0.5 h-8 w-0.5", styles.line)} aria-hidden />
                  )}
                </div>

                <div className={cn("min-w-0 flex-1 pb-4", isLast && "pb-0")}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={cn("text-[11px] leading-tight", styles.label)}>
                        Stap {index + 1}: {step.label}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {step.sublabel}
                      </p>
                    </div>
                    {styles.badge && (
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold",
                          styles.badgeClass,
                        )}
                      >
                        {styles.badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/** Originele stappenplan-visual, gebruikt voor de eerste contentsectie. */
export const ServiceDetailSkeleton = ({ id }: { id: ServiceSkeletonId }) => {
  const FirstVisual = firstDetailVisuals[id];
  if (FirstVisual) return <FirstVisual id={id} />;

  const config = detailFlows[id];
  if (!config) return null;
  return <FlowStepsSkeleton config={config} />;
};

const visualCopies: Record<
  ServiceSkeletonId,
  {
    primary: string;
    secondary: string;
    metric: string;
    accent: string;
  }
> = {
  websites: {
    primary: "Website preview",
    secondary: "Responsive",
    metric: "98",
    accent: "Live",
  },
  boekingskalender: {
    primary: "Boekingsflow",
    secondary: "Agenda sync",
    metric: "12",
    accent: "Slots",
  },
  "review-management": {
    primary: "Review inbox",
    secondary: "Feedback",
    metric: "4.9",
    accent: "Score",
  },
  automatiseringen: {
    primary: "Automatisering",
    secondary: "Taken klaar",
    metric: "3",
    accent: "Flows",
  },
  integraties: {
    primary: "Koppelingen",
    secondary: "Tools actief",
    metric: "8",
    accent: "Apps",
  },
  "hosting-onderhoud": {
    primary: "Monitoring",
    secondary: "Veilig online",
    metric: "99.9",
    accent: "Uptime",
  },
  "content-seo": {
    primary: "Content hub",
    secondary: "SEO klaar",
    metric: "92",
    accent: "Score",
  },
};

const visualIcons: Record<ServiceSkeletonId, ComponentType<{ className?: string }>> = {
  websites: MonitorSmartphone,
  boekingskalender: Calendar,
  "review-management": Star,
  automatiseringen: Workflow,
  integraties: Link2,
  "hosting-onderhoud": ShieldCheck,
  "content-seo": Search,
};

const Shell = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("relative mx-auto w-full max-w-[360px]", className)}>
    {children}
  </div>
);

const BrowserCanvas = ({ id }: { id: ServiceSkeletonId }) => {
  const copy = visualCopies[id];
  const Icon = visualIcons[id];

  return (
    <Shell>
      <div className="overflow-hidden rounded-2xl border border-[#e8e6e2] bg-white shadow-[0_20px_60px_-32px_rgba(15,23,42,0.18)]">
        <div className="flex items-center gap-1.5 border-b border-[#ebe8e4] bg-[#f8f7f5] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          <div className="ml-3 h-5 flex-1 rounded-full bg-muted" />
        </div>
        <div className="grid gap-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">
                {copy.primary}
              </p>
              <div className="mt-2 h-3 w-28 rounded bg-foreground/85" />
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <div className="grid grid-cols-[1.15fr_0.85fr] gap-3">
            <div className="rounded-xl bg-primary/[0.08] p-4">
              <div className="mb-10 h-3 w-20 rounded bg-primary/30" />
              <div className="space-y-2">
                <div className="h-2 w-full rounded bg-white/80" />
                <div className="h-2 w-4/5 rounded bg-white/80" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-16 rounded-xl bg-brand-orange/15" />
              <div className="h-16 rounded-xl bg-[#eceae6]" />
            </div>
          </div>
        </div>
      </div>
      <FloatingBadge icon={MousePointerClick} className="-right-2 bottom-7 bg-brand-orange" />
    </Shell>
  );
};

const AutomationBoard = ({ id }: { id: ServiceSkeletonId }) => {
  const copy = visualCopies[id];
  const rows = ["Trigger", copy.secondary, "Opvolging"];

  return (
    <Shell className="max-w-[340px]">
      <div className="rounded-2xl border border-[#e8e6e2] bg-white p-4 shadow-[0_20px_60px_-32px_rgba(15,23,42,0.18)]">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[11px] font-semibold text-foreground">{copy.primary}</p>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary">
            Actief
          </span>
        </div>
        <div className="space-y-3">
          {rows.map((row, index) => (
            <div key={row} className="flex items-center gap-3 rounded-xl bg-[#fafaf9] p-3">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg text-white",
                  index === 1 ? "bg-brand-orange" : "bg-primary",
                )}
              >
                {index === 0 ? (
                  <Zap className="h-4 w-4" />
                ) : index === 1 ? (
                  <Mail className="h-4 w-4" />
                ) : (
                  <Bell className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-foreground">{row}</p>
                <div className="mt-1.5 h-1.5 w-4/5 rounded bg-border" />
              </div>
              <Check className="h-4 w-4 text-emerald-500" />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-4 right-6 rounded-xl border border-[#e8e6e2] bg-white px-3 py-2 text-[10px] font-semibold text-foreground shadow-md">
        {copy.accent} verbonden
      </div>
    </Shell>
  );
};

const MetricsPanel = ({ id }: { id: ServiceSkeletonId }) => {
  const copy = visualCopies[id];

  return (
    <Shell>
      <div className="rounded-2xl border border-[#e8e6e2] bg-white p-5 shadow-[0_20px_60px_-32px_rgba(15,23,42,0.18)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Dashboard
            </p>
            <p className="text-sm font-bold text-foreground">{copy.secondary}</p>
          </div>
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <div className="grid grid-cols-[0.8fr_1.2fr] gap-4">
          <div className="rounded-2xl bg-primary p-4 text-white">
            <p className="text-[10px] uppercase tracking-wide text-white/70">
              {copy.accent}
            </p>
            <p className="mt-2 text-3xl font-bold">{copy.metric}</p>
          </div>
          <div className="flex h-28 items-end gap-2 rounded-2xl bg-[#fafaf9] p-4">
            {[38, 54, 45, 72, 62, 86].map((height, index) => (
              <div
                key={height}
                className={cn(
                  "flex-1 rounded-t bg-primary/25",
                  index === 5 && "bg-brand-orange",
                )}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {["Leads", "Kliks", "Acties"].map((label) => (
            <div key={label} className="rounded-xl bg-[#fafaf9] px-3 py-2">
              <p className="text-[9px] text-muted-foreground">{label}</p>
              <div className="mt-1 h-2 w-10 rounded bg-foreground/70" />
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
};

const IntegrationGrid = ({ id }: { id: ServiceSkeletonId }) => {
  const copy = visualCopies[id];
  const tools = [
    { label: "Agenda", icon: Calendar, color: "bg-blue-100 text-blue-700" },
    { label: "Mail", icon: Mail, color: "bg-orange-100 text-orange-700" },
    { label: "CRM", icon: Users, color: "bg-purple-100 text-primary" },
    { label: "Chat", icon: MessageSquare, color: "bg-emerald-100 text-emerald-700" },
  ];

  return (
    <Shell className="max-w-[350px]">
      <div className="grid grid-cols-2 gap-3">
        {tools.map((tool, index) => (
          <div
            key={tool.label}
            className="rounded-2xl border border-[#e8e6e2] bg-white p-4 shadow-sm"
          >
            <div
              className={cn(
                "mb-4 flex h-10 w-10 items-center justify-center rounded-xl",
                tool.color,
              )}
            >
              <tool.icon className="h-5 w-5" />
            </div>
            <p className="text-[11px] font-semibold text-foreground">{tool.label}</p>
            <div className="mt-2 h-1.5 w-full rounded bg-muted" />
            <div
              className={cn(
                "mt-1.5 h-1.5 rounded bg-primary/30",
                index % 2 === 0 ? "w-3/4" : "w-1/2",
              )}
            />
          </div>
        ))}
      </div>
      <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-xl ring-8 ring-[#f8f6f1]">
        <Link2 className="h-6 w-6" />
      </div>
      <div className="mt-4 rounded-xl border border-[#e8e6e2] bg-white px-4 py-3 text-center text-[11px] font-semibold text-foreground shadow-sm">
        {copy.primary} centraal gekoppeld
      </div>
    </Shell>
  );
};

const MobilePreview = ({ id }: { id: ServiceSkeletonId }) => {
  const copy = visualCopies[id];

  return (
    <Shell className="max-w-[330px]">
      <div className="mx-auto w-[190px] rounded-[2rem] border-[7px] border-foreground bg-white p-3 shadow-[0_20px_60px_-32px_rgba(15,23,42,0.18)]">
        <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-muted-foreground/25" />
        <div className="rounded-2xl bg-[#f8f6f1] p-3">
          <div className="mb-3 flex items-center justify-between">
            <Smartphone className="h-4 w-4 text-primary" />
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[8px] font-bold text-emerald-700">
              Online
            </span>
          </div>
          <div className="mb-4 h-20 rounded-xl bg-primary/15" />
          <div className="space-y-2">
            <div className="h-2 w-full rounded bg-foreground/75" />
            <div className="h-2 w-4/5 rounded bg-muted-foreground/20" />
            <div className="h-8 rounded-lg bg-primary" />
          </div>
        </div>
      </div>
      <div className="absolute right-3 top-10 w-32 rounded-xl border border-[#e8e6e2] bg-white p-3 shadow-md">
        <p className="text-[10px] font-semibold text-foreground">{copy.secondary}</p>
        <div className="mt-2 flex gap-1">
          {[0, 1, 2, 3, 4].map((item) => (
            <Star key={item} className="h-3 w-3 fill-brand-orange text-brand-orange" />
          ))}
        </div>
      </div>
    </Shell>
  );
};

const ContentEditor = ({ id }: { id: ServiceSkeletonId }) => {
  const copy = visualCopies[id];

  return (
    <Shell>
      <div className="rounded-2xl border border-[#e8e6e2] bg-white p-4 shadow-[0_20px_60px_-32px_rgba(15,23,42,0.18)]">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[11px] font-semibold text-foreground">{copy.primary}</p>
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-3 rounded-xl bg-[#fafaf9] p-4">
          <div className="h-3 w-3/4 rounded bg-foreground/80" />
          <div className="h-2 w-full rounded bg-white" />
          <div className="h-2 w-5/6 rounded bg-white" />
          <div className="h-2 w-2/3 rounded bg-white" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-dashed border-primary/30 bg-primary/[0.04] p-3">
            <p className="mb-2 text-[10px] font-semibold text-primary">SEO</p>
            <div className="h-2 w-full rounded bg-primary/25" />
          </div>
          <div className="rounded-xl border border-[#e8e6e2] bg-[#f8f7f5] p-3">
            <p className="mb-2 text-[10px] font-semibold text-foreground">Design</p>
            <div className="flex gap-1.5">
              <span className="h-5 w-5 rounded-full bg-primary" />
              <span className="h-5 w-5 rounded-full bg-brand-orange" />
              <span className="h-5 w-5 rounded-full bg-foreground" />
            </div>
          </div>
        </div>
      </div>
      <FloatingBadge icon={Palette} className="-bottom-3 left-8 bg-brand-orange" />
    </Shell>
  );
};

const SecurityStack = ({ id }: { id: ServiceSkeletonId }) => {
  const copy = visualCopies[id];
  const items = [
    { label: "SSL", icon: ShieldCheck },
    { label: "Backups", icon: Server },
    { label: "Code", icon: Code2 },
  ];

  return (
    <Shell className="max-w-[330px]">
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              "flex items-center gap-3 rounded-2xl border border-[#e8e6e2] bg-white p-4 shadow-sm",
              index === 1 && "ml-8",
              index === 2 && "ml-4",
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <item.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-foreground">{item.label}</p>
              <div className="mt-1.5 h-1.5 w-4/5 rounded bg-muted" />
            </div>
            <Check className="h-4 w-4 text-emerald-500" />
          </div>
        ))}
      </div>
      <div className="absolute -right-1 top-5 rounded-xl bg-primary px-3 py-2 text-[10px] font-semibold text-white shadow-lg">
        {copy.accent} OK
      </div>
    </Shell>
  );
};

const PaymentFlow = ({ id }: { id: ServiceSkeletonId }) => {
  const copy = visualCopies[id];

  return (
    <Shell className="max-w-[340px]">
      <div className="rounded-2xl border border-[#e8e6e2] bg-white p-5 shadow-[0_20px_60px_-32px_rgba(15,23,42,0.18)]">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[11px] font-semibold text-foreground">{copy.secondary}</p>
          <CreditCard className="h-5 w-5 text-primary" />
        </div>
        <div className="grid grid-cols-3 items-center gap-2">
          {["Aanvraag", "Betaal", "Live"].map((label, index) => (
            <div key={label} className="text-center">
              <div
                className={cn(
                  "mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl text-white",
                  index === 1 ? "bg-brand-orange" : "bg-primary",
                )}
              >
                {index === 0 ? (
                  <MousePointerClick className="h-5 w-5" />
                ) : index === 1 ? (
                  <CreditCard className="h-5 w-5" />
                ) : (
                  <Check className="h-5 w-5" />
                )}
              </div>
              <p className="text-[10px] font-semibold text-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-3 left-8 right-8 rounded-xl border border-[#e8e6e2] bg-white px-4 py-2 text-center text-[10px] font-semibold text-foreground shadow-md">
        {copy.primary} klaar voor conversie
      </div>
    </Shell>
  );
};

const WebsitePlanningVisual = (_props: { id: ServiceSkeletonId }) => {
  const config = detailFlows.websites;

  return <FlowStepsSkeleton config={config} />;
};

const BookingSlotsVisual = (_props: { id: ServiceSkeletonId }) => {
  const slots = ["09:00", "10:30", "13:00", "15:30"];

  return (
    <Shell className="max-w-[340px]">
      <div className="overflow-hidden rounded-2xl border border-[#e8e6e2] bg-white shadow-[0_20px_60px_-32px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between border-b border-[#ebe8e4] bg-[#f8f7f5] px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Beschikbaarheid
            </p>
            <p className="text-sm font-bold text-foreground">Vandaag</p>
          </div>
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div className="grid grid-cols-[0.8fr_1.2fr] gap-4 p-4">
          <div className="rounded-2xl bg-primary/10 p-3">
            <p className="mb-3 text-[10px] font-semibold text-primary">Maart</p>
            <div className="grid grid-cols-3 gap-1.5">
              {Array.from({ length: 12 }).map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-7 rounded-md bg-white",
                    index === 7 && "bg-primary shadow-sm",
                    index === 10 && "bg-brand-orange/80",
                  )}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {slots.map((slot, index) => (
              <div
                key={slot}
                className={cn(
                  "flex items-center justify-between rounded-xl border border-[#e8e6e2] px-3 py-2",
                  index === 1 && "border-primary/30 bg-primary/[0.05]",
                )}
              >
                <span className="text-[11px] font-semibold text-foreground">{slot}</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <FloatingBadge icon={Bell} className="-bottom-3 right-8 bg-brand-orange" />
    </Shell>
  );
};

const ReviewInboxVisual = (_props: { id: ServiceSkeletonId }) => (
  <Shell className="max-w-[350px]">
    <div className="space-y-3">
      {[
        { name: "Lisa", score: "5.0", text: "Top service" },
        { name: "Mark", score: "4.8", text: "Snel geregeld" },
        { name: "Sophie", score: "5.0", text: "Nieuwe klanten" },
      ].map((review, index) => (
        <div
          key={review.name}
          className={cn(
            "rounded-2xl border border-[#e8e6e2] bg-white p-4 shadow-sm",
            index === 1 && "ml-8",
            index === 2 && "mr-6",
          )}
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-bold text-foreground">{review.name}</p>
            <div className="flex items-center gap-1 text-brand-orange">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-[10px] font-bold">{review.score}</span>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">{review.text}</p>
          <div className="mt-3 h-1.5 w-4/5 rounded bg-muted" />
        </div>
      ))}
    </div>
    <FloatingBadge icon={Sparkles} className="-right-2 top-8 bg-primary" />
  </Shell>
);

const AutomationCanvasVisual = (_props: { id: ServiceSkeletonId }) => (
  <Shell className="max-w-[360px]">
    <div className="relative rounded-2xl border border-[#e8e6e2] bg-white p-5 shadow-[0_20px_60px_-32px_rgba(15,23,42,0.18)]">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[11px] font-bold text-foreground">Flow builder</p>
        <Workflow className="h-5 w-5 text-primary" />
      </div>
      <div className="grid grid-cols-3 items-center gap-3">
        {[
          { label: "Formulier", icon: FileText, color: "bg-primary" },
          { label: "Actie", icon: Zap, color: "bg-brand-orange" },
          { label: "CRM", icon: Users, color: "bg-emerald-600" },
        ].map((node, index) => (
          <div key={node.label} className="relative text-center">
            {index > 0 && (
              <div className="absolute right-full top-6 h-px w-3 bg-border" aria-hidden />
            )}
            <div
              className={cn(
                "mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm",
                node.color,
              )}
            >
              <node.icon className="h-5 w-5" />
            </div>
            <p className="text-[10px] font-semibold text-foreground">{node.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-xl bg-[#fafaf9] p-3">
        <div className="mb-2 h-2 w-24 rounded bg-foreground/70" />
        <div className="h-2 w-full rounded bg-white" />
      </div>
    </div>
  </Shell>
);

const IntegrationHubVisual = (_props: { id: ServiceSkeletonId }) => (
  <Shell className="max-w-[360px]">
    <div className="relative h-[270px]">
      <div className="absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[1.5rem] bg-primary text-white shadow-xl">
        <Link2 className="h-8 w-8" />
      </div>
      {[
        { label: "Calendar", x: "left-0 top-3", color: "bg-blue-100 text-blue-700" },
        { label: "Mail", x: "right-2 top-0", color: "bg-orange-100 text-orange-700" },
        { label: "Pixel", x: "left-4 bottom-6", color: "bg-purple-100 text-primary" },
        { label: "Pay", x: "right-0 bottom-8", color: "bg-emerald-100 text-emerald-700" },
      ].map((tool) => (
        <div
          key={tool.label}
          className={cn(
            "absolute w-32 rounded-2xl border border-[#e8e6e2] bg-white p-3 shadow-sm",
            tool.x,
          )}
        >
          <div className={cn("mb-2 h-8 w-8 rounded-xl", tool.color)} />
          <p className="text-[10px] font-bold text-foreground">{tool.label}</p>
          <div className="mt-2 h-1.5 w-4/5 rounded bg-muted" />
        </div>
      ))}
    </div>
  </Shell>
);

const HostingMonitorVisual = (_props: { id: ServiceSkeletonId }) => (
  <Shell className="max-w-[350px]">
    <div className="rounded-2xl border border-[#e8e6e2] bg-[#0f172a] p-5 text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-white/50">Uptime</p>
          <p className="text-3xl font-bold">99.9%</p>
        </div>
        <ShieldCheck className="h-7 w-7 text-emerald-400" />
      </div>
      <div className="grid grid-cols-8 items-end gap-1.5 rounded-2xl bg-white/8 p-3">
        {[42, 58, 51, 74, 68, 82, 76, 92].map((height) => (
          <span
            key={height}
            className="rounded-t bg-emerald-400"
            style={{ height: `${height}px` }}
          />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {["SSL", "Backups", "Updates"].map((item) => (
          <div key={item} className="rounded-xl bg-white/10 px-3 py-2 text-[10px] font-semibold">
            {item}
          </div>
        ))}
      </div>
    </div>
  </Shell>
);

const SeoSearchPreviewVisual = (_props: { id: ServiceSkeletonId }) => (
  <Shell className="max-w-[360px]">
    <div className="rounded-2xl border border-[#e8e6e2] bg-white p-5 shadow-[0_20px_60px_-32px_rgba(15,23,42,0.18)]">
      <div className="mb-4 flex items-center gap-2 rounded-full border border-[#e8e6e2] px-4 py-2">
        <Search className="h-4 w-4 text-primary" />
        <div className="h-2 flex-1 rounded bg-muted" />
      </div>
      <div className="space-y-4">
        <div className="rounded-xl bg-primary/[0.05] p-4">
          <p className="mb-1 text-[10px] text-emerald-700">nexavo.works/diensten</p>
          <div className="mb-2 h-3 w-44 rounded bg-primary/70" />
          <div className="h-2 w-full rounded bg-muted" />
        </div>
        <div className="rounded-xl border border-[#e8e6e2] p-4">
          <div className="mb-2 h-3 w-36 rounded bg-foreground/80" />
          <div className="h-2 w-5/6 rounded bg-muted" />
        </div>
      </div>
    </div>
    <FloatingBadge icon={PenLine} className="-bottom-3 right-10 bg-brand-orange" />
  </Shell>
);

const firstDetailVisuals: Partial<
  Record<ServiceSkeletonId, ComponentType<{ id: ServiceSkeletonId }>>
> = {
  websites: WebsitePlanningVisual,
  boekingskalender: BookingSlotsVisual,
  "review-management": ReviewInboxVisual,
  automatiseringen: AutomationCanvasVisual,
  integraties: IntegrationHubVisual,
  "hosting-onderhoud": HostingMonitorVisual,
  "content-seo": SeoSearchPreviewVisual,
};

const serviceVisualSequences: Record<
  ServiceSkeletonId,
  ComponentType<{ id: ServiceSkeletonId }>[]
> = {
  websites: [
    BrowserCanvas,
    MobilePreview,
    ContentEditor,
    AutomationBoard,
    SecurityStack,
    MetricsPanel,
    PaymentFlow,
  ],
  boekingskalender: [
    MobilePreview,
    AutomationBoard,
    IntegrationGrid,
    MetricsPanel,
    PaymentFlow,
    SecurityStack,
  ],
  "review-management": [
    MetricsPanel,
    AutomationBoard,
    IntegrationGrid,
    MobilePreview,
    ContentEditor,
    PaymentFlow,
  ],
  automatiseringen: [
    IntegrationGrid,
    MetricsPanel,
    ContentEditor,
    MobilePreview,
    SecurityStack,
    PaymentFlow,
  ],
  integraties: [
    IntegrationGrid,
    AutomationBoard,
    MetricsPanel,
    SecurityStack,
    MobilePreview,
    PaymentFlow,
  ],
  "hosting-onderhoud": [
    SecurityStack,
    MetricsPanel,
    AutomationBoard,
    IntegrationGrid,
    ContentEditor,
    PaymentFlow,
  ],
  "content-seo": [
    ContentEditor,
    MetricsPanel,
    BrowserCanvas,
    MobilePreview,
    AutomationBoard,
    PaymentFlow,
  ],
};

export const ServiceDetailSectionVisual = ({
  id,
  index,
}: {
  id: ServiceSkeletonId;
  index: number;
}) => {
  const sequence = serviceVisualSequences[id];
  const Visual = sequence[index % sequence.length];

  return <Visual id={id} />;
};
