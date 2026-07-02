import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  color?: "primary" | "neutral" | "orange";
};

export const RadialGlowBackground = ({ className, color = "primary" }: Props) => (
  <div
    className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}
    aria-hidden
  >
    <div
      className={cn(
        "absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[min(900px,90vw)] h-[min(500px,60vh)] rounded-full blur-3xl",
        color === "primary" && "bg-primary/[0.06]",
        color === "neutral" && "bg-foreground/[0.025]",
        color === "orange" && "bg-brand-orange/[0.05]",
      )}
    />
  </div>
);
