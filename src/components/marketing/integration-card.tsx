import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type IntegrationCardProps = {
  name: string;
  href?: string;
  icon: React.ReactNode;
  className?: string;
  highlight?: boolean;
};

export const integrationCardClass = cn(
  "group flex flex-col items-center justify-center rounded-2xl border border-[#e8e6e2] bg-[#f6f6f7] p-5 md:p-6 shadow-card",
  "transition-colors duration-200 hover:border-[#dedee2] hover:bg-[#efeff1] hover:shadow-hover",
);

export const IntegrationCard = ({
  name,
  href,
  icon,
  className,
  highlight = false,
}: IntegrationCardProps) => {
  const content = (
    <>
      <div
        className={cn(
          "mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-muted/40",
          highlight && "border-primary/20 bg-primary/[0.04]",
        )}
      >
        {icon}
      </div>
      <span className="text-sm font-medium text-foreground text-center">{name}</span>
    </>
  );

  if (href) {
    return (
      <Link to={href} className={cn(integrationCardClass, className)}>
        {content}
      </Link>
    );
  }

  return <div className={cn(integrationCardClass, className)}>{content}</div>;
};

/** @deprecated Use integrationCardClass */
export const nexIntegrationCardClass = integrationCardClass;
