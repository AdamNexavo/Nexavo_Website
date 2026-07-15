import { ChevronDown, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import type { DayOpeningHours, OpeningHours, WeekdayKey } from "@/lib/portal/types";
import { PortalTimeSelect } from "@/components/portal/PortalTimeSelect";

const WEEKDAYS: { key: WeekdayKey; label: string }[] = [
  { key: "mon", label: "Maandag" },
  { key: "tue", label: "Dinsdag" },
  { key: "wed", label: "Woensdag" },
  { key: "thu", label: "Donderdag" },
  { key: "fri", label: "Vrijdag" },
  { key: "sat", label: "Zaterdag" },
  { key: "sun", label: "Zondag" },
];

type OpeningHoursEditorProps = {
  value: OpeningHours;
  onChange: (hours: OpeningHours) => void;
};

function daySummary(day: DayOpeningHours | undefined): string {
  if (!day) return "Niet ingesteld";
  if (day.alwaysOpen) return "Altijd open";
  if (day.closed) return "Gesloten";
  return `${day.open ?? "09:00"} – ${day.close ?? "17:00"}`;
}

export function OpeningHoursEditor({ value, onChange }: OpeningHoursEditorProps) {
  const days = value.days ?? {};

  const updateDay = (key: WeekdayKey, patch: Partial<DayOpeningHours>) => {
    onChange({
      ...value,
      scheduleType: "custom",
      days: {
        ...days,
        [key]: { ...days[key], ...patch },
      },
    });
  };

  const applyToAll = (patch: Partial<DayOpeningHours>) => {
    const nextDays = { ...days };
    WEEKDAYS.forEach(({ key }) => {
      nextDays[key] = { ...nextDays[key], ...patch };
    });
    onChange({ ...value, scheduleType: "custom", days: nextDays });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label>Openingstijden</Label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyToAll({ alwaysOpen: true, closed: false, open: undefined, close: undefined })}
            className="rounded-full bg-[#F5F4F2] px-3 py-1.5 text-[12px] font-medium text-[#6B7280] hover:bg-[#EBEBEA]"
          >
            Altijd open
          </button>
          <button
            type="button"
            onClick={() =>
              applyToAll({ alwaysOpen: false, closed: false, open: "09:00", close: "17:00" })
            }
            className="rounded-full bg-[#F5F4F2] px-3 py-1.5 text-[12px] font-medium text-[#6B7280] hover:bg-[#EBEBEA]"
          >
            Ma–vr 09:00–17:00
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {WEEKDAYS.map(({ key, label }) => {
          const day = days[key] ?? { open: "09:00", close: "17:00" };
          return (
            <details
              key={key}
              className="group rounded-[16px] border border-black/[0.08] bg-[#FAFAFA] open:border-[#7547F8]/20 open:bg-white"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 text-[14px] [&::-webkit-details-marker]:hidden">
                <span className="font-medium text-[#0B0B0D]">{label}</span>
                <span className="flex items-center gap-2 text-[13px] text-[#6B7280]">
                  {daySummary(day)}
                  <Pencil className="h-3.5 w-3.5 text-[#9CA3AF] group-open:text-[#7547F8]" strokeWidth={1.75} />
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                </span>
              </summary>
              <div className="space-y-3 border-t border-black/[0.06] px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["open", "Open", { alwaysOpen: false, closed: false, open: "09:00", close: "17:00" }],
                      ["closed", "Gesloten", { closed: true, alwaysOpen: false }],
                      ["always", "Altijd open", { alwaysOpen: true, closed: false }],
                    ] as const
                  ).map(([mode, text, patch]) => {
                    const active =
                      mode === "always"
                        ? day.alwaysOpen
                        : mode === "closed"
                          ? day.closed && !day.alwaysOpen
                          : !day.closed && !day.alwaysOpen;
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => updateDay(key, patch)}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-[12px] font-medium",
                          active ? "bg-[#7547F8] text-white" : "bg-[#F5F4F2] text-[#6B7280]",
                        )}
                      >
                        {text}
                      </button>
                    );
                  })}
                </div>
                {!day.closed && !day.alwaysOpen && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[12px] text-[#6B7280]">Open</Label>
                      <PortalTimeSelect
                        value={day.open ?? "09:00"}
                        onChange={(open) => updateDay(key, { open, closed: false, alwaysOpen: false })}
                        className="mt-1.5 w-full"
                      />
                    </div>
                    <div>
                      <Label className="text-[12px] text-[#6B7280]">Sluit</Label>
                      <PortalTimeSelect
                        value={day.close ?? "17:00"}
                        onChange={(close) => updateDay(key, { close, closed: false, alwaysOpen: false })}
                        className="mt-1.5 w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
