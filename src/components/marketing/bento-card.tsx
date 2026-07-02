import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

type BentoCardProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
  span?: "default" | "wide" | "tall";
};

const spanClass = {
  default: "",
  wide: "md:col-span-2",
  tall: "md:row-span-2",
};

export const BentoCard = ({
  title,
  description,
  icon: Icon,
  children,
  className,
  span = "default",
}: BentoCardProps) => (
  <Card
    className={cn(
      "rounded-2xl border-border shadow-card transition-colors duration-200 hover:border-border/80 hover:shadow-hover",
      spanClass[span],
      className,
    )}
  >
    <CardContent className="p-6 md:p-8 h-full flex flex-col">
      {Icon && (
        <div className="nex-icon-box mb-5">
          <Icon className="h-5 w-5 text-brand-orange/75" strokeWidth={1.75} />
        </div>
      )}
      <h3 className="nex-card-title mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      )}
      {children}
    </CardContent>
  </Card>
);
