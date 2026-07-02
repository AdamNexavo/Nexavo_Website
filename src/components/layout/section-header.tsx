import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type SectionHeaderProps = {
  badge?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
};

export const SectionHeader = ({
  badge,
  title,
  description,
  align = "left",
  className,
  titleClassName,
}: SectionHeaderProps) => (
  <div
    className={cn(
      "max-w-3xl",
      align === "center" && "mx-auto text-center",
      className,
    )}
  >
    {badge && (
      <Badge variant="outline" className="mb-5 font-normal text-muted-foreground">
        {badge}
      </Badge>
    )}
    <h2 className={cn("text-section-title", titleClassName)}>{title}</h2>
    {description && (
      <p className="mt-4 text-body text-muted-foreground max-w-2xl">{description}</p>
    )}
  </div>
);

/** @deprecated Use SectionHeader */
export const NexSectionHeader = SectionHeader;
