import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookingReminderPopup } from "@/components/skeletons/BookingReminderPopup";
import {
  showcaseBorder,
  showcaseCardShadow,
  showcaseShellShadow,
} from "@/components/skeletons/showcase-tokens";

type BookingShowcaseSkeletonProps = {
  size?: "section" | "catalog";
  className?: string;
};

const days = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

const appointments = [
  {
    initials: "MJ",
    name: "Mark Jansen",
    time: "10:00 - Consultatie",
    status: "Bevestigd",
    statusClass: "text-emerald-600",
  },
  {
    initials: "SV",
    name: "Sophie de Vries",
    time: "14:30 - Intake",
    status: "Nieuw",
    statusClass: "text-amber-600",
  },
];

const BookingSectionSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("relative mx-auto w-full max-w-lg", className)}>
    <div
      className={cn(
        "overflow-hidden rounded-[1.25rem] bg-white md:rounded-[1.5rem]",
        showcaseBorder,
        showcaseShellShadow,
      )}
    >
      <div className="p-6 md:p-8">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">Maart 2026</h4>
          <div className="flex gap-1.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#ebe8e4] bg-[#fafaf9] shadow-block text-xs text-muted-foreground">
              ‹
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#ebe8e4] bg-[#fafaf9] shadow-block text-xs text-muted-foreground">
              ›
            </span>
          </div>
        </div>

        <div className="mb-3 grid grid-cols-7 gap-1.5">
          {days.map((day) => (
            <div
              key={day}
              className="py-1 text-center text-[10px] font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="mb-3 grid grid-cols-7 gap-1.5">
          {Array.from({ length: 31 }, (_, i) => {
            const date = i + 1;
            const isSelected = date === 12;
            const isBooked = date === 8 || date === 19;

            return (
              <div
                key={date}
                className={cn(
                  "rounded-lg py-1 text-center text-xs font-medium",
                  isSelected && "bg-primary text-white",
                  !isSelected && isBooked && "bg-brand-orange/15 text-brand-orange",
                  !isSelected && !isBooked && "text-foreground/80",
                )}
              >
                {date}
              </div>
            );
          })}
        </div>

        <div className="mb-3 border-t border-[#ebe8e4]" />

        <p className="mb-2 text-xs font-medium text-foreground">Aankomende afspraken</p>
        <div className="space-y-2">
          {appointments.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-2 rounded-xl border border-[#ebe8e4] bg-[#fafaf9] shadow-block p-2"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#eceae6] text-[10px] font-semibold text-foreground">
                {item.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">{item.name}</p>
                <p className="text-[10px] text-muted-foreground">{item.time}</p>
              </div>
              <span className={cn("shrink-0 text-[10px] font-semibold", item.statusClass)}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <BookingReminderPopup />
  </div>
);

const catalogDates = [
  null,
  null,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
];

const BookingCatalogSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("relative w-full max-w-[252px]", className)}>
    <div
      className={cn(
        "overflow-hidden rounded-[1.25rem] bg-white",
        showcaseBorder,
        showcaseShellShadow,
      )}
    >
      <div className="flex items-center justify-between border-b border-[#ebe8e4] bg-[#f8f7f5] px-3.5 py-2.5">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Maart 2026
          </p>
          <p className="text-sm font-semibold text-foreground">Boek een afspraak</p>
        </div>
        <div className="flex gap-1">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-[#ebe8e4] bg-[#fafaf9] shadow-block text-[10px] text-muted-foreground">
            ‹
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-[#ebe8e4] bg-[#fafaf9] shadow-block text-[10px] text-muted-foreground">
            ›
          </span>
        </div>
      </div>

      <div className="p-3">
        <div className="mb-1.5 grid grid-cols-7 gap-1">
          {days.map((day) => (
            <div
              key={day}
              className="text-center text-[9px] font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="mb-3 grid grid-cols-7 gap-1">
          {catalogDates.map((date, index) => {
            const isSelected = date === 12;
            const isBooked = date === 8 || date === 19;

            return (
              <div
                key={index}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-lg text-[10px] font-medium",
                  date === null && "invisible",
                  isSelected && "bg-primary text-white",
                  !isSelected && isBooked && "bg-brand-orange/15 text-brand-orange",
                  !isSelected && !isBooked && date && "bg-[#fafaf9] text-foreground/80",
                )}
              >
                {date ?? ""}
              </div>
            );
          })}
        </div>

        <div className="space-y-2 rounded-xl border border-[#ebe8e4] bg-[#fafaf9] shadow-block p-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#eceae6] text-[10px] font-semibold text-foreground">
              MJ
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold text-foreground">Intakegesprek</p>
              <p className="text-[10px] text-muted-foreground">12 mrt · 10:30</p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">
              Bevestigd
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
      className={cn(
        "absolute -bottom-2 -left-1 w-[7.5rem] rounded-2xl bg-white p-2",
        showcaseBorder,
        showcaseCardShadow,
      )}
    >
      <div className="flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} />
        <div>
          <p className="text-[9px] font-semibold text-foreground">Herinnering</p>
          <p className="text-[8px] text-muted-foreground">24 uur vooraf</p>
        </div>
      </div>
    </div>
  </div>
);

export const BookingShowcaseSkeleton = ({
  size = "section",
  className,
}: BookingShowcaseSkeletonProps) => {
  if (size === "catalog") {
    return <BookingCatalogSkeleton className={className} />;
  }

  return <BookingSectionSkeleton className={className} />;
};
