import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";
import { SectionBackdrop, type SectionSurface } from "@/components/backgrounds/section-backdrop";

export type { SectionSurface };

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  surface?: SectionSurface;
  divider?: boolean;
  framed?: boolean;
  size?: "default" | "sm";
  glow?: boolean;
};

const surfaceBg: Record<SectionSurface, string> = {
  plain: "bg-background",
  white: "bg-card",
  muted: "nex-surface-muted",
  subtle: "nex-surface-subtle",
  dots: "bg-background",
  grid: "bg-background",
  "dots-grid": "bg-background",
  bento: "bg-background",
  framed: "nex-bg-framed",
};

export const Section = ({
  children,
  className,
  id,
  surface = "plain",
  divider = true,
  framed = false,
  size = "default",
  glow = false,
}: SectionProps) => (
  <section
    id={id}
    className={cn(
      size === "sm" ? "nex-section-sm" : "nex-section",
      "relative overflow-hidden",
      divider && "nex-hairline-b",
      surfaceBg[surface],
      className,
    )}
  >
    <SectionBackdrop surface={surface} glow={glow} />
    <Container className={cn("relative z-10", framed && "nex-content-frame")}>
      {children}
    </Container>
  </section>
);

/** @deprecated Use Section */
export const NexSection = Section;
