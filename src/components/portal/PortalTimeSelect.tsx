import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const TIMES: string[] = [];
for (let h = 0; h < 24; h++) {
  for (const m of [0, 15, 30, 45]) {
    TIMES.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
}

type PortalTimeSelectProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function PortalTimeSelect({
  value,
  onChange,
  placeholder = "09:00",
  className,
  disabled,
}: PortalTimeSelectProps) {
  return (
    <Select value={value ?? ""} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          "h-10 rounded-full border-0 bg-[#F5F4F2] px-4 text-[14px] shadow-none focus:ring-[#7547F8]/30",
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-60 rounded-[16px]">
        {TIMES.map((t) => (
          <SelectItem key={t} value={t} className="rounded-lg">
            {t}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
