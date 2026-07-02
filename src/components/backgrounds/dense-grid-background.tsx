import { cn } from "@/lib/utils";

type Props = { className?: string };

/** Smaller grid cells with edge fade — matches WorkShowcase / Ons werk. */
export const DenseGridBackground = ({ className }: Props) => (
  <div
    className={cn(
      "pointer-events-none absolute inset-0 nex-bg-grid-dense opacity-35",
      className,
    )}
    aria-hidden
  />
);
