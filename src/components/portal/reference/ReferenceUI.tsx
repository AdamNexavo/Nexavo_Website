import { Link } from "react-router-dom";
import { Check, ChevronRight, X, Calendar, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";

/* ─── Design tokens (referentie-screenshots) ─── */
export const ref = {
  bg: "#FAFAFA",
  card: "#FFFFFF",
  muted: "#F5F5F5",
  border: "#E5E5E5",
  text: "#111111",
  textMuted: "#6B7280",
  textLabel: "#9CA3AF",
  accent: "#7547F8",
  accentSoft: "#EDE9FE",
  success: "#10B981",
  successBg: "#ECFDF5",
} as const;

/* ─── Layout ─── */

export function ReferenceShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAF8] font-sans text-[#111111]">
      {children}
    </div>
  );
}

export function ReferenceMain({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-white">
      <div className="w-full px-3 py-5 md:px-4 md:py-6">{children}</div>
    </main>
  );
}

/* ─── Cards ─── */

export function ReferenceCard({
  className,
  children,
  muted,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { muted?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[16px] border border-[#E2E0DB] p-4 md:p-5",
        muted ? "bg-[#EAEAEA]" : "bg-[#F5F5F5] shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ReferenceInnerCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-[16px] border border-[#E2E0DB] bg-[#FAFAF8] p-4", className)}>
      {children}
    </div>
  );
}

/* ─── Typography ─── */

export function ReferencePageTitle({
  title,
  subtitle,
  back,
  action,
}: {
  title: string;
  subtitle?: React.ReactNode;
  back?: { label: string; href: string };
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      {back && (
        <Link
          to={back.href}
          className="mb-3 inline-flex items-center gap-1.5 text-[14px] text-[#6B7280] hover:text-[#111111]"
        >
          ← {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.03em] text-[#111111] md:text-[26px]">
            {title}
          </h1>
          {subtitle && <div className="mt-1.5 text-[14px] text-[#6B7280]">{subtitle}</div>}
        </div>
        {action}
      </div>
    </div>
  );
}

export function ReferenceGreeting({ name, date }: { name: string; date: string }) {
  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-[-0.03em] text-[#111111] md:text-[26px]">
        Goedemiddag {name},
      </h1>
      <p className="mt-1.5 flex items-center gap-2 text-[14px] text-[#6B7280]">
        <Calendar className="h-4 w-4 shrink-0 text-[#9CA3AF]" strokeWidth={1.75} />
        {date}
      </p>
    </div>
  );
}

/* ─── Tabs ─── */

export function ReferenceTabs({
  items,
  active,
  onChange,
}: {
  items: { id: string; label: string }[];
  active: string;
  onChange?: (id: string) => void;
}) {
  return (
    <div className="mb-6 flex gap-6 border-b border-[#E2E0DB]">
      {items.map((item) => {
        const isActive = active === item.id;
        const El = onChange ? "button" : "span";
        return (
          <El
            key={item.id}
            type={onChange ? "button" : undefined}
            onClick={onChange ? () => onChange(item.id) : undefined}
            className={cn(
              "pb-3 text-[15px] font-medium transition-colors",
              isActive
                ? "border-b-2 border-[#7547F8] text-[#111111]"
                : "text-[#9CA3AF] hover:text-[#6B7280]",
              onChange && "cursor-pointer",
            )}
          >
            {item.label}
          </El>
        );
      })}
    </div>
  );
}

/* ─── Filter pills ─── */

export function ReferenceFilterPills({
  items,
  active,
  onChange,
}: {
  items: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              "rounded-full px-4 py-2 text-[14px] font-medium transition-colors",
              isActive
                ? "bg-[#7547F8] text-white"
                : "border border-[#E2E0DB] bg-white text-[#111111] hover:bg-[#FAFAF8]",
            )}
          >
            {item.label}
            {item.count !== undefined ? ` (${item.count})` : ""}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Stepper (horizontal, referentie) ─── */

export function ReferenceStepper({
  steps,
  current,
  onBack,
  onNext,
  nextLabel = "Volgende",
  backLabel = "Terug",
  nextDisabled,
  showActions = true,
}: {
  steps: { id: string; label: string }[];
  current: string;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  showActions?: boolean;
}) {
  const currentIndex = steps.findIndex((s) => s.id === current);

  return (
    <ReferenceCard className="mb-8 !p-5 md:!p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2 md:gap-0">
          {steps.map((step, i) => {
            const done = i < currentIndex;
            const active = step.id === current;
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold",
                      done || active
                        ? "bg-[#7547F8] text-white"
                        : "border-2 border-[#7547F8]/40 text-[#7547F8]",
                    )}
                  >
                    {done ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      "hidden text-[14px] font-medium sm:inline",
                      active ? "text-[#111111]" : "text-[#6B7280]",
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 hidden h-0.5 w-8 md:block lg:w-16",
                      i < currentIndex ? "bg-[#7547F8]" : "bg-[#E2E0DB]",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
        {showActions && (
          <div className="flex items-center gap-3">
            {onBack && currentIndex > 0 && (
              <button
                type="button"
                onClick={onBack}
                className="text-[14px] font-medium text-[#7547F8] hover:underline"
              >
                ← {backLabel}
              </button>
            )}
            {onNext && (
              <Button
                type="button"
                onClick={onNext}
                disabled={nextDisabled}
                className={cn(
                  "rounded-full px-6",
                  nextDisabled
                    ? "bg-[#7547F8]/30 text-white hover:bg-[#7547F8]/30"
                    : "bg-[#7547F8] hover:bg-[#6840E0]",
                )}
              >
                {nextLabel} →
              </Button>
            )}
          </div>
        )}
      </div>
    </ReferenceCard>
  );
}

/* ─── Task list (dashboard referentie) ─── */

export type ReferenceTaskStatus = "empty" | "partial" | "complete";

export type ReferenceTask = {
  id: string;
  title: string;
  stepLabel: string;
  href: string;
  done: boolean;
  status?: ReferenceTaskStatus;
  icon?: React.ReactNode;
  action?: React.ReactNode;
};

function resolveTaskStatus(task: ReferenceTask): ReferenceTaskStatus {
  if (task.status) return task.status;
  return task.done ? "complete" : "empty";
}

function TaskStatusIcon({ status, icon }: { status: ReferenceTaskStatus; icon?: React.ReactNode }) {
  if (status === "complete") {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ECFDF5] text-[#10B981]">
        <Check className="h-3.5 w-3.5" />
      </span>
    );
  }
  if (status === "partial") {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFEDD5] text-[#EA580C]">
        <Circle className="h-3 w-3 fill-current" strokeWidth={0} />
      </span>
    );
  }
  return (
    icon ?? (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#6B7280]">
        <Circle className="h-3 w-3" strokeWidth={2} />
      </span>
    )
  );
}

function TaskStatusBadge({ status }: { status: ReferenceTaskStatus }) {
  if (status === "complete") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-medium text-[#10B981]">
        <Check className="h-3 w-3" /> Afgerond
      </span>
    );
  }
  if (status === "partial") {
    return (
      <span className="rounded-full bg-[#FFEDD5] px-2 py-0.5 text-[10px] font-medium text-[#EA580C]">
        Deels ingevuld
      </span>
    );
  }
  return <ChevronRight className="h-4 w-4 shrink-0 text-[#9CA3AF]" />;
}

function taskRowClass(status: ReferenceTaskStatus, active?: boolean) {
  if (active) return "bg-[#EDE9FE] ring-1 ring-[#7547F8]/25";
  if (status === "complete") return "bg-[#FAFAF8]";
  if (status === "partial") return "bg-[#FFF7ED] hover:bg-[#FFEDD5]/40";
  return "bg-[#F5F5F5] hover:bg-[#EBEBEA]";
}

export function ReferenceTaskList({
  title,
  progress,
  tasks,
  onTaskClick,
  activeTaskId,
}: {
  title: string;
  progress: string;
  tasks: ReferenceTask[];
  onTaskClick?: (taskId: string) => void;
  activeTaskId?: string | null;
}) {
  return (
    <ReferenceCard>
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="max-w-lg text-[14px] font-semibold leading-snug text-[#111111]">{title}</h2>
        <span className="shrink-0 rounded-full bg-[#F5F5F5] px-2 py-0.5 text-[11px] font-semibold text-[#6B7280]">
          {progress}
        </span>
      </div>
      <div className="space-y-1">
        {tasks.map((task) => {
          const status = resolveTaskStatus(task);
          return (
          <div key={task.id}>
            {task.action ? (
              <div className="flex items-center justify-between gap-3 rounded-[12px] bg-[#F5F5F5] px-3 py-3">
                <div className="flex items-center gap-2.5">
                  {task.icon}
                  <div>
                    <p className="text-[13px] font-medium text-[#111111]">{task.title}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{task.stepLabel}</p>
                  </div>
                </div>
                {task.action}
              </div>
            ) : onTaskClick ? (
              <button
                type="button"
                onClick={() => onTaskClick(task.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-[12px] px-3 py-3 text-left transition-colors",
                  taskRowClass(status, activeTaskId === task.id),
                )}
              >
                <div className="flex items-center gap-2.5">
                  <TaskStatusIcon status={status} icon={task.icon} />
                  <div>
                    <p
                      className={cn(
                        "text-[13px] font-medium",
                        status === "complete" ? "text-[#9CA3AF] line-through" : "text-[#111111]",
                      )}
                    >
                      {task.title}
                    </p>
                    <p className="text-[11px] text-[#9CA3AF]">{task.stepLabel}</p>
                  </div>
                </div>
                <TaskStatusBadge status={status} />
              </button>
            ) : (
              <Link
                to={task.href}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-[12px] px-3 py-3 transition-colors",
                  taskRowClass(status),
                )}
              >
                <div className="flex items-center gap-2.5">
                  <TaskStatusIcon status={status} icon={task.icon} />
                  <div>
                    <p
                      className={cn(
                        "text-[13px] font-medium",
                        status === "complete" ? "text-[#9CA3AF] line-through" : "text-[#111111]",
                      )}
                    >
                      {task.title}
                    </p>
                    <p className="text-[11px] text-[#9CA3AF]">{task.stepLabel}</p>
                  </div>
                </div>
                <TaskStatusBadge status={status} />
              </Link>
            )}
          </div>
        );
        })}
      </div>
    </ReferenceCard>
  );
}

/* ─── Package overview card (rechts in flows) ─── */

export function ReferencePackageOverview({
  planName,
  planPrice,
  maintenanceLine,
  extraLines,
}: {
  planName: string;
  planPrice: string;
  maintenanceLine?: string;
  extraLines?: string[];
}) {
  return (
    <ReferenceCard>
      <h3 className="mb-4 text-[16px] font-semibold text-[#111111]">Pakket overzicht</h3>
      <div className="overflow-hidden rounded-[18px] bg-[#7547F8] p-5 text-white">
        <p className="text-[22px] font-semibold">{planName}</p>
        <p className="mt-2 text-[14px] opacity-90">Pakketkosten {planPrice}</p>
        {maintenanceLine && <p className="text-[14px] opacity-90">{maintenanceLine}</p>}
        {extraLines?.map((line) => (
          <p key={line} className="text-[14px] opacity-90">
            {line}
          </p>
        ))}
      </div>
      <p className="mt-3 rounded-[12px] bg-[#F5F5F5] py-2.5 text-center text-[12px] text-[#6B7280]">
        Alle bedragen zijn exclusief btw
      </p>
    </ReferenceCard>
  );
}

/* ─── Empty state ─── */

export function ReferenceEmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-[#7547F8]">{icon}</div>}
      <p className="text-[16px] font-semibold text-[#111111]">{title}</p>
      {description && <p className="mt-2 max-w-sm text-[14px] text-[#6B7280]">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ─── Modal (referentie stijl) ─── */

export function ReferenceModal({
  open,
  onOpenChange,
  title,
  children,
  footer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-[24px] border-[#E2E0DB] p-0 shadow-xl [&>button]:hidden">
          <div className="relative overflow-hidden rounded-t-[24px] bg-[#F5F5F5] px-6 pb-8 pt-10 text-center">
            <div className="pointer-events-none absolute -left-8 -top-12 h-32 w-[120%] rounded-[50%] bg-[#EAEAEA]" />
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E2E0DB] bg-white text-[#6B7280] hover:bg-[#FAFAF8]"
              aria-label="Sluiten"
            >
              <X className="h-4 w-4" />
            </button>
            <h2 className="relative text-[22px] font-semibold text-[#111111]">{title}</h2>
          </div>
          <div className="px-6 py-6">{children}</div>
          {footer && (
            <div className="border-t border-[#E2E0DB] px-6 py-4">{footer}</div>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

/* ─── Form helpers ─── */

export const refInputClass =
  "h-11 w-full rounded-[12px] border border-[#E2E0DB] bg-white px-4 text-[14px] text-[#111111] placeholder:text-[#9CA3AF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7547F8]/25";

export const refLabelClass = "mb-1.5 block text-[13px] font-medium text-[#6B7280]";

export function ReferenceSearchInput({
  value,
  onChange,
  placeholder = "Zoeken...",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(refInputClass, "max-w-xs", className)}
    />
  );
}

export function ReferenceStatCard({
  label,
  value,
  sub,
  trend,
  className,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}) {
  return (
    <div className={cn("rounded-[16px] border border-[#E2E0DB] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]", className)}>
      <p className="text-[12px] font-medium text-[#9CA3AF]">{label}</p>
      <p className="mt-1 text-[24px] font-semibold tracking-tight text-[#111111]">{value}</p>
      {sub && (
        <p
          className={cn(
            "mt-0.5 text-[12px]",
            trend === "up" && "text-[#10B981]",
            trend === "down" && "text-[#EF4444]",
            !trend && "text-[#6B7280]",
          )}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/* ─── Badge ─── */

export function ReferenceBadge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "green" | "purple" | "orange";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium leading-none",
        variant === "green" && "bg-[#ECFDF5] text-[#10B981]",
        variant === "purple" && "bg-[#EDE9FE] text-[#7547F8]",
        variant === "orange" && "bg-[#FFF7ED] text-[#EA580C]",
        variant === "default" && "bg-[#EAEAEA] text-[#6B7280]",
      )}
    >
      {children}
    </span>
  );
}

/* ─── Info callout (geel/beige blok) ─── */

export function ReferenceInfoCallout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[16px] border border-[#E8DFC8] bg-[#FBF6EA] p-5">
      <p className="font-semibold text-[#8B6914]">{title}</p>
      <div className="mt-2 text-[14px] leading-relaxed text-[#6B7280]">{children}</div>
    </div>
  );
}
