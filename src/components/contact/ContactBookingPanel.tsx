import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactInfo } from "@/data/contact";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["ma", "di", "wo", "do", "vr", "za", "zo"];
const TIME_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "13:30", "14:00", "14:30", "15:00"];

const MONTHS = [
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
];

function buildCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const days: (number | null)[] = Array.from({ length: startOffset }, () => null);

  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(day);
  }

  return days;
}

function isPastDate(year: number, month: number, day: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const candidate = new Date(year, month, day);
  return candidate < today;
}

function isWeekend(year: number, month: number, day: number) {
  const dayOfWeek = new Date(year, month, day).getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
}

export const ContactBookingPanel = () => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const calendarDays = useMemo(() => buildCalendarDays(year, month), [year, month]);

  const goMonth = (delta: number) => {
    setViewDate(new Date(year, month + delta, 1));
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const handleConfirm = () => {
    window.open(contactInfo.bookingUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <div className="mb-5">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-brand-orange-light px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-brand-orange" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">
            Gratis adviesgesprek
          </span>
        </div>
        <h3 className="font-sans text-xl font-bold tracking-[-0.02em] text-foreground md:text-2xl">
          Plan je gratis strategiegesprek
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Online via Google Meet · 30 minuten · geen verplichtingen
        </p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-[#fafaf9] p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Kies een dag</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goMonth(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-white text-muted-foreground transition-colors hover:border-border hover:text-foreground"
              aria-label="Vorige maand"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[7.5rem] text-center text-sm font-semibold capitalize text-foreground">
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              onClick={() => goMonth(1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-white text-muted-foreground transition-colors hover:border-border hover:text-foreground"
              aria-label="Volgende maand"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mb-1 grid grid-cols-7 gap-1">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-1 text-center text-[11px] font-medium uppercase text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} />;
            }

            const disabled = isPastDate(year, month, day) || isWeekend(year, month, day);
            const isSelected = selectedDay === day;

            return (
              <button
                key={day}
                type="button"
                disabled={disabled}
                onClick={() => {
                  setSelectedDay(day);
                  setSelectedTime(null);
                }}
                className={cn(
                  "flex h-9 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  disabled && "cursor-not-allowed text-muted-foreground/35",
                  !disabled && !isSelected && "text-foreground hover:bg-primary/10",
                  isSelected && "bg-primary text-white",
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDay && (
        <div className="mt-4">
          <p className="mb-3 text-sm font-semibold text-foreground">Kies een tijd</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {TIME_SLOTS.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={cn(
                  "rounded-xl border px-2 py-2.5 text-sm font-medium transition-colors",
                  selectedTime === time
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 bg-white text-foreground hover:border-primary/30",
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-white px-3 py-2.5 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Tijdzone</span>
        <span className="inline-flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5" />
          Midden-Europese tijd
        </span>
      </div>

      <Button
        type="button"
        size="lg"
        variant="brand"
        className="mt-5 w-full"
        disabled={!selectedDay || !selectedTime}
        onClick={handleConfirm}
      >
        Bevestig afspraak
      </Button>
    </div>
  );
};
