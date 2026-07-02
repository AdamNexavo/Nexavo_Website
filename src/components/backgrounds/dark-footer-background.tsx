import { cn } from "@/lib/utils";

type Props = { className?: string };

export const DarkFooterBackground = ({ className }: Props) => (
  <div className={cn("absolute inset-0 nex-footer-grid pointer-events-none opacity-60", className)} aria-hidden />
);
