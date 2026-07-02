import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/** Attio-style buttons: 12px radius, 1px borders, consistent height/padding. */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-foreground text-background hover:bg-foreground/90",
        brand:
          "border border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "border border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border/80 bg-background text-foreground shadow-none hover:bg-muted/50",
        secondary:
          "border border-border/70 bg-[#f5f5f7] text-foreground shadow-none hover:bg-muted/60",
        ghost: "border border-transparent text-foreground hover:bg-muted/60",
        link: "border border-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 rounded-[12px] px-6",
        sm: "h-9 rounded-[12px] px-4 text-sm",
        lg: "h-11 rounded-[12px] px-7 text-sm",
        xl: "h-12 rounded-[12px] px-8 text-sm",
        icon: "h-10 w-10 rounded-[12px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
