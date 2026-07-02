import { DotGridBackground } from "@/components/backgrounds/dot-grid-background";
import { SoftGridBackground } from "@/components/backgrounds/soft-grid-background";
import { RadialGlowBackground } from "@/components/backgrounds/radial-glow-background";
import { FramedSectionBackground } from "@/components/backgrounds/framed-section";
import { BentoGridBackground } from "@/components/backgrounds/bento-grid-background";
import { SectionLines } from "@/components/backgrounds/section-lines";

export type SectionSurface =
  | "plain"
  | "white"
  | "muted"
  | "subtle"
  | "dots"
  | "grid"
  | "dots-grid"
  | "framed"
  | "bento";

const vlineSurfaces: SectionSurface[] = ["plain", "white", "muted", "subtle"];

type SectionBackdropProps = {
  surface?: SectionSurface;
  className?: string;
  glow?: boolean;
};

export const SectionBackdrop = ({
  surface = "plain",
  className,
  glow = false,
}: SectionBackdropProps) => {
  if (surface === "plain") {
    return (
      <>
        <SectionLines className={className} />
        {glow ? <RadialGlowBackground className={className} color="neutral" /> : null}
      </>
    );
  }

  return (
    <>
      {vlineSurfaces.includes(surface) && (
        <SectionLines
          className={className}
          opacity={surface === "muted" ? "strong" : "default"}
        />
      )}
      {surface === "dots" && <DotGridBackground className={className} />}
      {surface === "grid" && <SoftGridBackground className={className} />}
      {(surface === "dots-grid" || surface === "bento") && (
        <BentoGridBackground className={className} />
      )}
      {surface === "framed" && <FramedSectionBackground className={className} />}
      {glow && <RadialGlowBackground className={className} color="neutral" />}
    </>
  );
};
