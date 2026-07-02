import { cn } from "@/lib/utils";

type Props = { className?: string };

export const FramedSectionBackground = ({ className }: Props) => (
  <div className={cn("absolute inset-0 nex-bg-framed pointer-events-none", className)} aria-hidden />
);

/** Wrapper for framed section content */
export const FramedSection = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("relative overflow-hidden nex-bg-framed", className)}>
    {children}
  </div>
);
