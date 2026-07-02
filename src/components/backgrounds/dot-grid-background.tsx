import { cn } from "@/lib/utils";

type Props = { className?: string };

export const DotGridBackground = ({ className }: Props) => (
  <div className={cn("absolute inset-0 nex-bg-dots pointer-events-none", className)} aria-hidden />
);
