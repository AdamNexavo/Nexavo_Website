import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export const Container = ({ children, className }: ContainerProps) => (
  <div className={cn("nex-container", className)}>{children}</div>
);

/** @deprecated Use Container — kept for backward compatibility */
export const NexContainer = Container;
