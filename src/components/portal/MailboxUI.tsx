import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReferenceBadge } from "@/components/portal/reference/ReferenceUI";

export function ReferencePanelCard({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-[16px] border border-[#E2E0DB] shadow-[0_1px_3px_rgba(15,23,42,0.06)]", className)}>
      <div className="border-b border-[#E2E0DB] bg-[#F5F5F5] px-4 py-3.5 md:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold text-[#111111]">{title}</h2>
            {subtitle && <p className="mt-0.5 text-[13px] text-[#6B7280]">{subtitle}</p>}
          </div>
          {action}
        </div>
      </div>
      <div className="bg-white">{children}</div>
    </div>
  );
}

export function MailboxRow({
  selected,
  unread,
  onClick,
  badge,
  title,
  preview,
  meta,
  date,
  status,
  statusVariant = "default",
}: {
  selected?: boolean;
  unread?: boolean;
  onClick?: () => void;
  badge?: React.ReactNode;
  title: React.ReactNode;
  preview?: string;
  meta?: string;
  date?: string;
  status?: string;
  statusVariant?: "default" | "green" | "purple" | "orange" | "red" | "blue";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 border-b border-[#E2E0DB]/70 px-4 py-3 text-left transition-colors last:border-0",
        "first:rounded-tl-[16px] first:rounded-tr-[16px] first:border-t-0 lg:first:rounded-tr-none",
        selected ? "bg-[#EDE9FE]/40" : "bg-white hover:bg-[#FAFAF8]",
      )}
    >
      <div className="flex w-2 shrink-0 justify-center">
        {unread ? <span className="h-2 w-2 rounded-full bg-[#7547F8]" /> : <span className="h-2 w-2" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {badge}
          <span className="truncate text-[13px] font-semibold text-[#111111]">{title}</span>
        </div>
        {meta && <p className="mt-0.5 truncate text-[12px] text-[#6B7280]">{meta}</p>}
        {preview && <p className="mt-0.5 line-clamp-1 text-[12px] text-[#9CA3AF]">{preview}</p>}
      </div>
      <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
        {date && <span className="text-[11px] text-[#9CA3AF]">{date}</span>}
        {status && <ReferenceBadge variant={statusVariant}>{status}</ReferenceBadge>}
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-[#C4C4C4]" />
    </button>
  );
}

export function MailboxLayout({
  list,
  detail,
  className,
}: {
  list: React.ReactNode;
  detail: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-0 overflow-hidden lg:grid-cols-[minmax(300px,0.95fr)_1.05fr]", className)}>
      <div className="max-h-[640px] overflow-y-auto border-b border-[#E2E0DB] bg-white lg:border-b-0 lg:border-r">{list}</div>
      <div className="max-h-[640px] overflow-y-auto bg-white">{detail}</div>
    </div>
  );
}
