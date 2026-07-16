import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Check, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { NexDisplayHeading, NexSectionHeading } from "@/components/ui/nex-typography";
import { RadialGlowBackground } from "@/components/backgrounds/radial-glow-background";
import { DotGridBackground } from "@/components/backgrounds/dot-grid-background";
import { SectionLines } from "@/components/backgrounds/section-lines";
import { Container as LayoutContainer } from "@/components/layout/container";
import { Section as LayoutSection } from "@/components/layout/section";
import type { NexSurface } from "@/components/ui/nex-surfaces";
import { integrationCardClass } from "@/components/marketing/integration-card";

/* ——— Layout ——— */

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  surface?: NexSurface;
  divider?: boolean;
  framed?: boolean;
  size?: "default" | "sm";
  glow?: boolean;
};

export const NexContainer = LayoutContainer;

export const NexSection = (props: SectionProps) => <LayoutSection {...props} />;

/* ——— Section header ——— */

type SectionHeaderProps = {
  label?: string;
  title?: React.ReactNode;
  titleLine1?: string;
  titleLine2?: string;
  titleLine2Serif?: boolean;
  titleLine2Purple?: boolean;
  intro?: string;
  align?: "left" | "center";
  className?: string;
};

export const NexSectionHeader = ({
  label,
  title,
  titleLine1,
  titleLine2,
  titleLine2Serif = true,
  titleLine2Purple = false,
  intro,
  align = "center",
  className,
}: SectionHeaderProps) => (
  <div
    className={cn(
      "mb-12 md:mb-16 max-w-3xl",
      align === "center" && "mx-auto text-center",
      className,
    )}
  >
    {label && <SectionBadge className={align === "center" ? "mx-auto" : undefined}>{label}</SectionBadge>}
    {titleLine1 ? (
      <NexSectionHeading
        line1={titleLine1}
        line2={titleLine2}
        line2Serif={titleLine2Serif}
        line2Purple={titleLine2Purple}
        align={align}
        className="mb-4"
      />
    ) : (
      <h2 className="nex-section-title mb-4">{title}</h2>
    )}
    {intro && (
      <p className={cn("nex-section-intro", align === "center" && "mx-auto")}>
        {intro}
      </p>
    )}
  </div>
);

/* ——— Page hero ——— */

type PageHeroProps = {
  label?: string;
  title?: React.ReactNode;
  titleLine1?: string;
  titleLine2?: string;
  titleLine2Serif?: boolean;
  titleLine2Purple?: boolean;
  intro?: string;
  children?: React.ReactNode;
  muted?: boolean;
  dots?: boolean;
  className?: string;
};

export const NexPageHero = ({
  label,
  title,
  titleLine1,
  titleLine2,
  titleLine2Serif = true,
  titleLine2Purple = false,
  intro,
  children,
  muted = false,
  dots = true,
  className,
}: PageHeroProps) => (
  <section
    className={cn(
      muted ? "nex-page-hero-muted" : "nex-page-hero",
      className,
    )}
  >
    {dots && <RadialGlowBackground color="neutral" />}
    <SectionLines opacity="subtle" />
    {dots && <DotGridBackground className="opacity-50" />}
    <NexContainer>
      <div className={cn("max-w-3xl", !children && "mx-auto text-center")}>
        {label && (
          <SectionBadge className={children ? undefined : "mx-auto"}>{label}</SectionBadge>
        )}
        {titleLine1 ? (
          <NexDisplayHeading
            line1={titleLine1}
            line2={titleLine2}
            line2Serif={titleLine2Serif}
            line2Purple={titleLine2Purple}
            align={children ? "left" : "center"}
            className="mb-5"
          />
        ) : (
          <h1 className="nex-display mb-5">{title}</h1>
        )}
        {intro && (
          <p className={cn("nex-section-intro mb-8", !children && "mx-auto")}>
            {intro}
          </p>
        )}
      </div>
      {children}
    </NexContainer>
  </section>
);

/* ——— Shared UI patterns ——— */

export const SectionBadge = ({
  children,
  icon: Icon,
  className,
  inverted = false,
  size = "default",
  uppercase = true,
}: {
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
  inverted?: boolean;
  size?: "default" | "lg";
  uppercase?: boolean;
}) => (
  <Badge
    variant="outline"
    className={cn(
      "mb-5 inline-flex rounded-lg border px-3.5 py-1.5 font-semibold",
      size === "default" ? "text-xs" : "text-sm",
      uppercase && "uppercase tracking-wider",
      inverted
        ? "border-white/15 bg-white/[0.06] text-white/90"
        : "border-border/80 bg-card text-muted-foreground",
      className,
    )}
  >
    {Icon && <Icon className="mr-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
    {children}
  </Badge>
);

export const FeatureCheck = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "purple";
}) => (
  <li className="flex items-start gap-3">
    <span
      className={cn(
        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
        variant === "purple" ? "bg-[#ebe8ff]" : "bg-muted",
      )}
    >
      <Check
        className={cn(
          "h-3 w-3",
          variant === "purple" ? "text-primary" : "text-muted-foreground",
        )}
        strokeWidth={2.5}
      />
    </span>
    <span className="text-sm text-foreground leading-relaxed">{children}</span>
  </li>
);

export const NexNotice = ({
  icon,
  title,
  subtitle,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  className?: string;
}) => (
  <Card className={cn("absolute rounded-2xl border-border shadow-card", className)}>
    <CardContent className="flex items-center gap-3 p-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/80 border border-border/60">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </CardContent>
  </Card>
);

/* ——— Badge ——— */

type NexBadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "popular" | "orange";
  className?: string;
};

export const NexBadge = ({
  children,
  variant = "default",
  className,
}: NexBadgeProps) => (
  <Badge
    variant={
      variant === "popular" ? "primary" : variant === "orange" ? "orange" : "secondary"
    }
    className={cn("rounded-full px-3 py-1", className)}
  >
    {children}
  </Badge>
);

/* ——— Generic card ——— */

type NexCardProps = HTMLMotionProps<"div"> & {
  hover?: boolean;
  featured?: boolean;
  padding?: boolean;
};

export const NexCard = ({
  children,
  className,
  hover = false,
  featured = false,
  padding = true,
  ...props
}: NexCardProps) => (
  <motion.div
    className={cn(
      featured && "nex-card-featured",
      !featured && hover && "nex-card-hover",
      !featured && !hover && "nex-card-shadow",
      padding && "p-6 md:p-8",
      className,
    )}
    {...props}
  >
    {children}
  </motion.div>
);

/* ——— Pricing card ——— */

const pricingCardShellClass = (highlighted: boolean) =>
  cn(
    "relative z-0 flex flex-col rounded-2xl p-7 md:p-8 border transition-[box-shadow,border-color] duration-300 h-full hover:z-20",
    highlighted
      ? "nex-pricing-highlight hover:shadow-[0_28px_56px_-22px_hsl(255_80%_60%_/_0.38)]"
      : "bg-[#f5f5f7] border-border shadow-card hover:border-border/80 hover:shadow-hover",
  );

const maintenanceCardShellClass = (highlighted: boolean) =>
  cn(
    "relative z-0 flex flex-col rounded-2xl p-7 md:p-8 border transition-[box-shadow,border-color] duration-300 h-full hover:z-20",
    highlighted
      ? "nex-pricing-highlight bg-white hover:shadow-[0_28px_56px_-22px_hsl(255_80%_60%_/_0.38)]"
      : "bg-white border-border shadow-card hover:border-border/80 hover:shadow-hover",
  );

const pricingHighlightBadgeClass =
  "px-4 py-1 font-semibold shadow-md ring-2 ring-white/90";

type PricingPriceDisplayProps = {
  price: string;
  pricePrefix?: string;
  priceDetail?: string;
  size?: "card" | "banner";
};

export const PricingPriceDisplay = ({
  price,
  pricePrefix,
  priceDetail,
  size = "card",
}: PricingPriceDisplayProps) => (
  <>
    <div className="relative pt-3">
      <span
        className={cn(
          "absolute top-0 left-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground leading-none",
          !pricePrefix && "invisible",
        )}
      >
        {pricePrefix ?? "Vanaf"}
      </span>
      <p
        className={cn(
          "font-sans font-bold tracking-tight text-foreground",
          size === "card" ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl",
        )}
      >
        {price}
      </p>
    </div>
    {priceDetail && (
      <p className="text-xs text-muted-foreground mt-1 mb-4">{priceDetail}</p>
    )}
    {!priceDetail && <div className="mb-4" />}
  </>
);

type PricingCardProps = {
  name: string;
  price: string;
  pricePrefix?: string;
  priceDetail?: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
  badge?: string;
  index?: number;
};

export const PricingCard = ({
  name,
  price,
  pricePrefix,
  priceDetail,
  description,
  features,
  cta,
  ctaHref,
  highlighted = false,
  badge,
  index = 0,
}: PricingCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ y: -12 }}
    viewport={{ once: true }}
    transition={{
      duration: 0.5,
      delay: index * 0.08,
      y: { type: "spring", stiffness: 420, damping: 28 },
    }}
    className={pricingCardShellClass(highlighted)}
  >
    {badge && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-[2]">
        <NexBadge
          variant="orange"
          className={cn(highlighted && pricingHighlightBadgeClass)}
        >
          {badge}
        </NexBadge>
      </div>
    )}

    <div className="mb-6">
      <h3 className={cn("nex-card-title mb-1", highlighted && "text-foreground")}>
        {name}
      </h3>
      <PricingPriceDisplay
        price={price}
        pricePrefix={pricePrefix}
        priceDetail={priceDetail}
      />
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>

    <ul className="space-y-3 mb-8 flex-1">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-3">
          <Check
            className={cn(
              "w-4 h-4 shrink-0 mt-0.5",
              highlighted ? "text-primary" : "text-muted-foreground",
            )}
            strokeWidth={2.5}
          />
          <span
            className={cn(
              "text-sm",
              highlighted ? "text-foreground/80" : "text-muted-foreground",
            )}
          >
            {feature}
          </span>
        </li>
      ))}
    </ul>

    <Link to={ctaHref} className="mt-auto">
      <Button
        variant={highlighted ? "default" : "outline"}
        className={cn("w-full", highlighted && "shadow-md")}
      >
        {cta}
      </Button>
    </Link>
  </motion.div>
);

/* ——— Maintenance card ——— */

type MaintenanceCardProps = {
  name: string;
  price: string;
  priceNote: string;
  description: string;
  highlights: string[];
  features: string[];
  highlighted?: boolean;
  badge?: string;
  index?: number;
};

export const MaintenanceCard = ({
  name,
  price,
  priceNote,
  description,
  highlights,
  features,
  highlighted = false,
  badge,
  index = 0,
}: MaintenanceCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ y: -12 }}
    viewport={{ once: true }}
    transition={{
      duration: 0.5,
      delay: index * 0.08,
      y: { type: "spring", stiffness: 420, damping: 28 },
    }}
    className={maintenanceCardShellClass(highlighted)}
  >
    {badge && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-[2]">
        <NexBadge
          variant="orange"
          className={cn(highlighted && pricingHighlightBadgeClass)}
        >
          {badge}
        </NexBadge>
      </div>
    )}

    <div className="mb-6">
      <h3 className={cn("nex-card-title mb-1", highlighted && "text-foreground")}>
        {name}
      </h3>
      <p className="font-sans text-3xl md:text-4xl font-bold tracking-tight text-foreground">
        {price}
        <span className="ml-1 text-lg md:text-xl font-semibold text-muted-foreground">p.m.</span>
      </p>
      <p className="text-xs text-muted-foreground mt-1 mb-4">{priceNote}</p>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>

    <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-border/50">
      {highlights.map((item) => (
        <Badge
          key={item}
          variant="primary"
          className={cn("rounded-full", highlighted && "shadow-sm")}
        >
          {item}
        </Badge>
      ))}
    </div>

    <ul className="space-y-3 mb-8 flex-1">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-3">
          <Check
            className={cn(
              "w-4 h-4 shrink-0 mt-0.5",
              highlighted ? "text-primary" : "text-muted-foreground",
            )}
            strokeWidth={2.5}
          />
          <span
            className={cn(
              "text-sm",
              highlighted ? "text-foreground/80" : "text-muted-foreground",
            )}
          >
            {feature}
          </span>
        </li>
      ))}
    </ul>

    <Link to="/contact" className="mt-auto">
      <Button
        variant={highlighted ? "default" : "secondary"}
        className={cn("w-full", highlighted && "shadow-md")}
      >
        Kies {name}
      </Button>
    </Link>
  </motion.div>
);

/* ——— Integration card ——— */

export const nexIntegrationCardClass = integrationCardClass;
