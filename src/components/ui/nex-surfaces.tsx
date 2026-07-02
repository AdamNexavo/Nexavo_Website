import { SectionBackdrop } from "@/components/backgrounds/section-backdrop";
import type { SectionSurface } from "@/components/backgrounds/section-backdrop";

/** Premium section background variants */
export type NexSurface = SectionSurface;

export { SectionBackdrop as NexSectionBackdrop };
export type { SectionSurface };

const surfaceBg: Record<NexSurface, string> = {
  plain: "bg-background",
  white: "bg-card",
  muted: "nex-surface-muted",
  subtle: "nex-surface-subtle",
  dots: "bg-background",
  grid: "bg-background",
  "dots-grid": "bg-background",
  framed: "nex-bg-framed",
  bento: "bg-background",
};

export const getSurfaceClass = (surface: NexSurface) => surfaceBg[surface];
