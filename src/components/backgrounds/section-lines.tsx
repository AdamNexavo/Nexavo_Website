import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  opacity?: "subtle" | "default" | "strong";
};

const opacityClass = {
  subtle: "opacity-25",
  default: "opacity-40",
  strong: "opacity-50",
} as const;

export const SectionLines = ({ className, opacity = "default" }: Props) => (
  <div
    className={cn(
      "pointer-events-none absolute inset-0 nex-bg-vlines",
      opacityClass[opacity],
      className,
    )}
    aria-hidden
  />
);
