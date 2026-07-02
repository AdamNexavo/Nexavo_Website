import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RadialGlowBackground } from "@/components/backgrounds/radial-glow-background";
import { SectionLines } from "@/components/backgrounds/section-lines";
import { Container } from "@/components/layout/container";

type CtaSectionProps = {
  title: React.ReactNode;
  description?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
  dark?: boolean;
};

export const CtaSection = ({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  className,
  dark = false,
}: CtaSectionProps) => (
  <section
    className={cn(
      "relative overflow-hidden nex-section-sm",
      dark ? "bg-[#09090B] text-white nex-hairline-t" : "bg-background nex-hairline-b",
      className,
    )}
  >
    {!dark && (
      <>
        <RadialGlowBackground color="primary" />
        <SectionLines className="opacity-10" />
      </>
    )}
    <Container className="relative z-10">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className={cn("nex-cta-headline mb-5", dark ? "text-white" : "text-foreground")}>
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "text-body mb-8 max-w-xl mx-auto",
              dark ? "text-white/60" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to={primaryHref}>
            <Button size="lg" variant={dark ? "secondary" : "default"}>
              {primaryLabel}
            </Button>
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link to={secondaryHref}>
              <Button size="lg" variant="outline" className={dark ? "border-white/20 text-white hover:bg-white/10" : ""}>
                {secondaryLabel}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Container>
  </section>
);
