import { cn } from "@/lib/utils";
import { DotGridBackground } from "@/components/backgrounds/dot-grid-background";
import { RadialGlowBackground } from "@/components/backgrounds/radial-glow-background";
import { SectionLines } from "@/components/backgrounds/section-lines";

type Props = { className?: string };

export const HeroBackground = ({ className }: Props) => (
  <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)} aria-hidden>
    <DotGridBackground className="opacity-80" />
    <RadialGlowBackground color="neutral" />
    <SectionLines className="opacity-15" />
  </div>
);
