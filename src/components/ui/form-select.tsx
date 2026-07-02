import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { inputErrorClass } from "@/components/ui/form-field-error";
import { cn } from "@/lib/utils";

export type FormSelectOption = {
  value: string;
  label: string;
};

type FormSelectProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: FormSelectOption[];
  placeholder?: string;
  className?: string;
  error?: boolean;
};

/** Custom dropdown styled like Radix Select, without page scroll lock. */
export const FormSelect = ({
  id,
  value,
  onChange,
  options,
  placeholder = "Kies een onderwerp",
  className,
  error = false,
}: FormSelectProps) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            "flex h-11 w-full items-center justify-between gap-2 rounded-[12px] border border-input bg-white px-3 text-left text-sm shadow-none transition-colors hover:border-border/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            inputErrorClass(error),
            className,
          )}
        >
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 opacity-50 transition-transform duration-200",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[var(--radix-popover-trigger-width)] rounded-xl border-border/60 bg-white p-1.5 shadow-lg"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <ul role="listbox" aria-labelledby={id} className="space-y-0.5">
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <li key={option.value} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg py-2.5 pl-3 pr-3 text-sm transition-colors",
                    isSelected
                      ? "bg-primary/10 text-foreground"
                      : "text-foreground hover:bg-primary/10",
                  )}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />}
                </button>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
};
