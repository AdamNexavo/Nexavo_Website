import { cn } from "@/lib/utils";

type NexavoLogoProps = {
  /** Colored icon + white wordmark on the hero; full black logo elsewhere. */
  variant?: "hero" | "default";
  className?: string;
};

const LOGO_SRC = "/2.svg";
const ICON_CLIP = "inset(0 72.65% 0 0)";
const WORDMARK_CLIP = "inset(0 0 0 27.77%)";

export const NexavoLogo = ({
  variant = "default",
  className,
}: NexavoLogoProps) => {
  const isHero = variant === "hero";

  return (
    <span
      className={cn(
        "relative inline-block h-[1.375rem] shrink-0 aspect-[270/67.5]",
        className,
      )}
      aria-hidden
    >
      <img
        src={LOGO_SRC}
        alt=""
        draggable={false}
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full select-none object-contain object-left",
          isHero ? "" : "brightness-0",
        )}
        style={{ clipPath: ICON_CLIP }}
      />
      <img
        src={LOGO_SRC}
        alt=""
        draggable={false}
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full select-none object-contain object-left",
          isHero ? "brightness-0 invert" : "brightness-0",
        )}
        style={{ clipPath: WORDMARK_CLIP }}
      />
    </span>
  );
};
