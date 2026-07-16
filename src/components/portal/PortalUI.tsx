import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

/* ─── Layout shells ─── */

export function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="portal-shell min-h-screen bg-[#FAFAFA] font-sans text-[#0B0B0D]">
      <div className="pointer-events-none fixed inset-0 nex-bg-dots opacity-[0.35]" aria-hidden />
      <div className="relative flex min-h-screen flex-col gap-3 p-3 md:gap-5 md:p-5 lg:flex-row lg:p-6">
        {children}
      </div>
    </div>
  );
}

export function PortalMain({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-w-0 flex-1">
      <div className="portal-content-area min-h-[calc(100vh-2.5rem)] rounded-[28px] border border-black/[0.08] bg-white/80 p-5 shadow-card backdrop-blur-sm md:p-8 lg:p-10">
        <div className="mx-auto max-w-[1040px]">{children}</div>
      </div>
    </main>
  );
}

/* ─── Cards ─── */

export function PortalCard({
  className,
  children,
  hover,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-[24px] border border-black/[0.08] bg-[#F5F5F5] p-6 md:p-7 shadow-block",
        hover && "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-hover",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function PortalMutedCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-black/[0.06] bg-[#F5F5F5] p-5 md:p-6 shadow-block",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ─── Typography ─── */

export function PortalLabel({
  children,
  className,
  recommended,
  optional,
}: {
  children: React.ReactNode;
  className?: string;
  recommended?: boolean;
  optional?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B7280]",
        className,
      )}
    >
      {children}
      {recommended && (
        <span className="normal-case tracking-normal text-[#7547F8]">· Aanbevelen</span>
      )}
      {optional && (
        <span className="normal-case tracking-normal text-[#9CA3AF]">· (optioneel)</span>
      )}
    </span>
  );
}

export function PortalFieldLabel({
  children,
  className,
  required,
  recommended,
}: {
  children: React.ReactNode;
  className?: string;
  required?: boolean;
  recommended?: boolean;
}) {
  return (
    <span className={cn("text-[12px] text-[#6B7280]", className)}>
      {children}
      {required && <span className="text-[#EA580C]"> *</span>}
      {recommended && (
        <span className="ml-1.5 inline-flex rounded-full bg-[#EDE9FE] px-2 py-0.5 text-[10px] font-medium text-[#7547F8]">
          Aanbevelen
        </span>
      )}
    </span>
  );
}

export function PortalPageHeader({
  label,
  title,
  subtitle,
  action,
}: {
  label?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {label && <PortalLabel className="mb-3">{label}</PortalLabel>}
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#0B0B0D] md:text-[34px] md:leading-[1.1]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-[15px] leading-relaxed text-[#6B7280]">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/* ─── Tabs ─── */

export function PortalTabs({
  items,
  active,
  onChange,
}: {
  items: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="mb-8 flex gap-1 overflow-x-auto border-b border-black/[0.08] pb-px">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={cn(
            "relative shrink-0 px-4 py-3 text-sm font-medium transition-colors",
            active === item.id ? "text-[#7547F8]" : "text-[#6B7280] hover:text-[#0B0B0D]",
          )}
        >
          {item.label}
          {active === item.id && (
            <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#7547F8]" />
          )}
        </button>
      ))}
    </div>
  );
}

/* ─── Stats & progress ─── */

export function PortalStatCard({
  label,
  value,
  sub,
  showCheck,
}: {
  label: string;
  value: string;
  sub?: string;
  showCheck?: boolean;
}) {
  return (
    <PortalCard className="relative min-h-[132px]">
      {showCheck && (
        <div className="absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-full bg-[#ECFDF5] text-[#059669]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      )}
      <p className="text-[13px] text-[#6B7280]">{label}</p>
      <p className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-[#0B0B0D]">{value}</p>
      {sub && <p className="mt-1.5 text-[13px] text-[#6B7280]">{sub}</p>}
    </PortalCard>
  );
}

export function PortalProgressBar({
  percent,
  trackClassName = "bg-[#F5F5F5]",
}: {
  percent: number;
  trackClassName?: string;
}) {
  return (
    <div className={cn("h-2.5 w-full overflow-hidden rounded-full", trackClassName)}>
      <motion.div
        className="h-full rounded-full bg-[#7547F8]"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

export function PortalChecklist({
  items,
}: {
  items: { label: string; done?: boolean; status?: "empty" | "partial" | "complete" }[];
}) {
  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const status = item.status ?? (item.done ? "complete" : "empty");
        return (
        <li key={item.label} className="flex items-center gap-3 text-[14px]">
          {status === "complete" ? (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-[#10B981]">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          ) : status === "partial" ? (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFEDD5] text-[#EA580C]">
              <span className="h-2 w-2 rounded-full bg-current" />
            </span>
          ) : (
            <span className="h-5 w-5 shrink-0 rounded-full border border-[#D1D5DB] bg-white" />
          )}
          <span
            className={cn(
              status === "complete" && "font-medium text-[#111111]",
              status === "partial" && "font-medium text-[#EA580C]",
              status === "empty" && "text-[#6B7280]",
            )}
          >
            {item.label}
          </span>
        </li>
      );
      })}
    </ul>
  );
}

/* ─── Badges ─── */

export function PortalBadge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "purple" | "green" | "orange" | "dark";
}) {
  const variants = {
    default: "bg-[#F5F5F5] text-[#6B7280]",
    purple: "bg-[#EDE9FE] text-[#7547F8]",
    green: "bg-[#ECFDF5] text-[#059669]",
    orange: "bg-[#FFF7ED] text-[#EA580C]",
    dark: "bg-[#0B0B0D] text-white",
  };
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[12px] font-medium", variants[variant])}>
      {children}
    </span>
  );
}

/* ─── Empty states ─── */

export function PortalEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <PortalMutedCard className="flex flex-col items-center justify-center py-12 text-center">
      <h3 className="text-lg font-semibold text-[#0B0B0D]">{title}</h3>
      <p className="mt-2 max-w-md text-[14px] leading-relaxed text-[#6B7280]">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </PortalMutedCard>
  );
}

/* ─── Preview mockup ─── */

export function PortalBrowserPreview({
  url,
  status,
}: {
  url?: string;
  status?: string;
}) {
  return (
    <PortalMutedCard className="overflow-hidden p-0">
      <div className="flex items-center gap-2 border-b border-black/[0.06] bg-white px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#E5E7EB]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#E5E7EB]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#E5E7EB]" />
        <span className="ml-2 truncate text-[12px] text-[#6B7280]">
          {url ?? "preview.jouwbedrijf.works"}
        </span>
        {status && <PortalBadge variant="orange" className="ml-auto">{status}</PortalBadge>}
      </div>
      <div className="space-y-3 p-6">
        <div className="flex gap-2">
          <div className="h-2 w-16 rounded bg-[#E5E7EB]" />
          <div className="h-2 w-10 rounded bg-[#E5E7EB]" />
          <div className="h-2 w-10 rounded bg-[#E5E7EB]" />
        </div>
        <div className="h-4 w-3/4 rounded bg-[#E5E7EB]" />
        <div className="h-2 w-full rounded bg-[#F5F5F5]" />
        <div className="h-2 w-5/6 rounded bg-[#F5F5F5]" />
        <div className="mt-4 h-24 rounded-[16px] bg-gradient-to-br from-[#7547F8]/10 to-[#F5F5F5]" />
      </div>
    </PortalMutedCard>
  );
}

/* ─── Integration mini card ─── */

export function PortalIntegrationMini({
  name,
  status,
}: {
  name: string;
  status: string;
}) {
  return (
    <div className="rounded-[16px] border border-black/[0.08] bg-[#FAFAFA] p-4">
      <p className="text-[14px] font-medium text-[#0B0B0D]">{name}</p>
      <p className="mt-1 text-[12px] text-[#6B7280]">{status}</p>
    </div>
  );
}

/* ─── Action row ─── */

export function PortalActionRow({
  label,
  done,
  href,
}: {
  label: string;
  done: boolean;
  href?: string;
}) {
  const content = (
    <div
      className={cn(
        "flex items-center justify-between rounded-[16px] border px-4 py-3.5 transition-colors",
        done
          ? "border-black/[0.06] bg-[#FAFAFA]"
          : "border-[#7547F8]/20 bg-[#F5F3FF]/50 hover:border-[#7547F8]/30",
      )}
    >
      <div className="flex items-center gap-3">
        {done ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7547F8] text-white">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
        ) : (
          <span className="h-5 w-5 rounded-full border-2 border-[#7547F8]/40" />
        )}
        <span className={cn("text-[14px]", done ? "text-[#6B7280]" : "font-medium text-[#0B0B0D]")}>
          {label}
        </span>
      </div>
      {!done && href && (
        <span className="text-[13px] font-medium text-[#7547F8]">Open →</span>
      )}
    </div>
  );

  if (href && !done) {
    return <Link to={href}>{content}</Link>;
  }
  return content;
}

/* ─── Intake journey (stap 1–4) ─── */

export function PortalIntakeJourney({
  steps,
}: {
  steps: { id: number; label: string; href: string; done: boolean; active: boolean }[];
}) {
  return (
    <PortalCard className="border-[#7547F8]/15 bg-gradient-to-br from-[#F5F3FF]/60 to-white">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[13px] font-medium text-[#7547F8]">Volgende stap</p>
          <h3 className="text-[18px] font-semibold text-[#0B0B0D]">Ga verder met je intake</h3>
          <p className="mt-1 text-[14px] text-[#6B7280]">
            Doorloop de stappen zodat we direct kunnen starten met je website.
          </p>
        </div>
        {steps.find((s) => s.active) && (
          <ButtonLink href={steps.find((s) => s.active)!.href} />
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {steps.map((step) => (
          <Link
            key={step.id}
            to={step.href}
            className={cn(
              "rounded-[18px] border px-4 py-4 transition-all",
              step.done
                ? "border-[#10B981]/20 bg-[#ECFDF5]/50"
                : step.active
                  ? "border-[#7547F8]/30 bg-white shadow-[0_8px_24px_-16px_rgba(117,71,248,0.35)]"
                  : "border-black/[0.06] bg-[#FAFAFA] opacity-70",
            )}
          >
            <span
              className={cn(
                "mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-semibold",
                step.done
                  ? "bg-[#10B981] text-white"
                  : step.active
                    ? "bg-[#7547F8] text-white"
                    : "bg-[#E5E7EB] text-[#6B7280]",
              )}
            >
              {step.done ? "✓" : step.id}
            </span>
            <p className="text-[14px] font-medium text-[#0B0B0D]">{step.label}</p>
          </Link>
        ))}
      </div>
    </PortalCard>
  );
}

function ButtonLink({ href }: { href: string }) {
  return (
    <Link
      to={href}
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#7547F8] px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#6840E0]"
    >
      Doorgaan →
    </Link>
  );
}

export function PortalLockedBlock({
  locked,
  lockMessage = "Beschikbaar na voltooiing intake en betaling",
  children,
  className,
}: {
  locked?: boolean;
  lockMessage?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div className={cn(locked && "pointer-events-none select-none blur-[1px] opacity-[0.72]")}>{children}</div>
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[0.5px]">
          <div className="mx-2 max-w-[140px] rounded-[12px] border border-black/[0.08] bg-white/95 px-3 py-2.5 text-center shadow-md">
            <Lock className="mx-auto h-4 w-4 text-[#7547F8]" strokeWidth={1.75} />
            <p className="mt-1.5 text-[11px] font-medium leading-snug text-[#0B0B0D]">{lockMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Locked / blurred module section ─── */

export function PortalLockedSection({
  title,
  subtitle,
  children,
  locked,
  lockMessage = "Beschikbaar na livegang of na aanvraag van deze module",
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  locked?: boolean;
  lockMessage?: string;
  className?: string;
}) {
  return (
    <PortalCard className={cn("relative overflow-hidden", className)}>
      <div className={cn(locked && "pointer-events-none select-none blur-[1px] opacity-[0.72]")}>
        <div className="mb-4">
          <h3 className="text-[16px] font-semibold text-[#0B0B0D]">{title}</h3>
          {subtitle && <p className="mt-1 text-[13px] text-[#6B7280]">{subtitle}</p>}
        </div>
        {children}
      </div>
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/25 backdrop-blur-[0.5px]">
          <div className="mx-4 max-w-xs rounded-[16px] border border-black/[0.08] bg-white/95 px-5 py-4 text-center shadow-lg">
            <Lock className="mx-auto h-5 w-5 text-[#7547F8]" strokeWidth={1.75} />
            <p className="mt-2 text-[14px] font-medium text-[#0B0B0D]">{lockMessage}</p>
          </div>
        </div>
      )}
    </PortalCard>
  );
}

/* ─── Preview site card (screenshot style) ─── */

export function PortalPreviewSiteCard({
  url,
  status = "In livegang",
  footer,
  previewHref,
  buildPercent,
  phase,
  steps,
}: {
  url: string;
  status?: string;
  footer?: string;
  previewHref?: string | null;
  buildPercent?: number;
  phase?: string;
  steps?: { label: string; done?: boolean }[];
}) {
  return (
    <PortalCard>
      {(buildPercent !== undefined || phase) && (
        <div className="mb-5 border-b border-black/[0.06] pb-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[14px] font-semibold text-[#111111]">Voortgang website</h3>
              {phase && <p className="text-[12px] text-[#6B7280]">{phase}</p>}
            </div>
            {buildPercent !== undefined && (
              <span className="text-[13px] font-semibold text-[#7547F8]">{buildPercent}%</span>
            )}
          </div>
          {buildPercent !== undefined && <PortalProgressBar percent={buildPercent} />}
          {steps && steps.length > 0 && (
            <ul className="mt-3 space-y-2">
              {steps.map((step) => (
                <li key={step.label} className="flex items-center gap-2 text-[12px]">
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                      step.done
                        ? "border-[#10B981]/30 bg-[#ECFDF5] text-[#10B981]"
                        : "border-[#D1D5DB] bg-white text-transparent",
                    )}
                  >
                    {step.done && (
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    )}
                  </span>
                  <span className={step.done ? "text-[#6B7280]" : "text-[#111111]"}>{step.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-[16px] font-semibold text-[#0B0B0D]">Preview</h3>
        <PortalBadge variant="orange">{status}</PortalBadge>
      </div>
      <p className="text-[12px] text-[#6B7280]">Omgeving</p>
      <p className="text-[14px] text-[#6B7280]">{url}</p>
      <div className="mt-4 overflow-hidden rounded-[16px] border border-black/[0.08] bg-[#FAFAFA]">
        <div className="flex gap-1.5 border-b border-black/[0.06] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#E5E7EB]" />
          <span className="h-2 w-2 rounded-full bg-[#E5E7EB]" />
          <span className="h-2 w-2 rounded-full bg-[#E5E7EB]" />
        </div>
        <div className="p-4">
          <p className="text-[12px] text-[#9CA3AF]">Homepage — concept</p>
          <div className="mt-3 h-3 w-2/3 rounded-full bg-[#E5E7EB]" />
          <div className="mt-2 h-2 w-full rounded-full bg-[#F5F5F5]" />
          <div className="mt-2 h-2 w-4/5 rounded-full bg-[#F5F5F5]" />
          <div className="mt-4 h-20 rounded-[12px] bg-gradient-to-br from-[#7547F8]/8 to-[#F5F5F5]" />
        </div>
      </div>
      {previewHref && (
        <a
          href={previewHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center text-[13px] font-medium text-[#7547F8] hover:underline"
        >
          Bekijk live voortgang →
        </a>
      )}
      {footer && <p className="mt-3 text-[13px] text-[#6B7280]">{footer}</p>}
    </PortalCard>
  );
}

/* ─── Dashboard live tabs ─── */

export function PortalDashboardTabs({
  items,
  active,
  onChange,
}: {
  items: { id: string; label: string }[];
  active: string;
  onChange?: (id: string) => void;
}) {
  return (
    <div className="mb-8 flex gap-6 border-b border-black/[0.06]">
      {items.map((item) => {
        const El = onChange ? "button" : "span";
        return (
          <El
            key={item.id}
            type={onChange ? "button" : undefined}
            onClick={onChange ? () => onChange(item.id) : undefined}
            className={cn(
              "pb-3 text-[15px] font-medium transition-colors",
              active === item.id
                ? "border-b-2 border-[#7547F8] text-[#0B0B0D]"
                : "text-[#9CA3AF]",
              onChange && "cursor-pointer hover:text-[#0B0B0D]",
            )}
          >
            {item.label}
          </El>
        );
      })}
    </div>
  );
}

/* ─── Pill input styling helper ─── */

export const portalPillInputClass =
  "rounded-[12px] border border-[#E2E0DB] bg-white shadow-block px-4 py-2.5 text-[14px] text-[#111111] shadow-card placeholder:text-[#9CA3AF] focus-visible:border-[#7547F8]/50 focus-visible:ring-2 focus-visible:ring-[#7547F8]/20";

export const portalPillTextareaClass =
  "rounded-[14px] border border-[#E2E0DB] bg-white px-4 py-3 text-[14px] text-[#111111] shadow-card placeholder:text-[#9CA3AF] focus-visible:border-[#7547F8]/50 focus-visible:ring-2 focus-visible:ring-[#7547F8]/20";

export function portalChoiceChipClass(selected?: boolean) {
  return cn(
    "rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
    selected
      ? "border-[#7547F8] bg-white text-[#7547F8] shadow-sm"
      : "border-[#E2E0DB] bg-white text-[#374151] hover:border-[#7547F8]/40",
  );
}

export function portalChoiceRowClass(selected?: boolean) {
  return cn(
    "flex w-full items-center gap-3 rounded-[14px] border bg-white px-4 py-3 text-left text-[14px] text-[#111111] transition-colors",
    selected
      ? "border-[#7547F8]/50 shadow-sm ring-1 ring-[#7547F8]/15"
      : "border-[#E2E0DB] hover:border-[#7547F8]/30",
  );
}
