import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border font-sans text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-foreground text-background px-2.5 py-0.5",
        secondary: "border-border bg-muted text-muted-foreground px-2.5 py-0.5",
        destructive: "border-transparent bg-destructive text-destructive-foreground px-2.5 py-0.5",
        outline: "border-border bg-background text-foreground px-2.5 py-0.5",
        primary: "border-primary/20 bg-primary/10 text-primary px-2.5 py-0.5",
        orange: "border-transparent bg-brand-orange-light text-brand-orange px-2.5 py-0.5",
        accent: "border-border bg-card text-muted-foreground px-2.5 py-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
