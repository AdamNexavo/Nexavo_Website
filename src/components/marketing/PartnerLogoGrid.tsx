import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ImageLogo = {
  type: "image";
  alt: string;
  src: string;
};

type DummyLogo = {
  type: "dummy";
  name: string;
  icon: ReactNode;
};

type PartnerLogo = ImageLogo | DummyLogo;

const DummyIcon = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    className={cn("h-5 w-5 shrink-0", className)}
    aria-hidden
  >
    {children}
  </svg>
);

const partnerLogos: PartnerLogo[] = [
  { type: "image", src: "/partners/veta-network.png", alt: "VETA Network" },
  { type: "image", src: "/partners/ruby-asset-finance.png", alt: "Ruby Asset Finance" },
  { type: "image", src: "/partners/bibi.png", alt: "bibi" },
  { type: "image", src: "/partners/crewstar.png?v=4", alt: "crewstars" },
  { type: "image", src: "/partners/tap.png", alt: "TAP" },
  { type: "image", src: "/partners/akoudad.png", alt: "Akoudad Investments" },
  {
    type: "dummy",
    name: "granola",
    icon: (
      <DummyIcon>
        <path d="M10 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm0 2.2a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm-3.2 4.3a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm6.4 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm-3.2 3.2a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z" />
      </DummyIcon>
    ),
  },
  {
    type: "dummy",
    name: "Flow",
    icon: (
      <DummyIcon>
        <rect x="3" y="11" width="2.5" height="6" rx="0.6" />
        <rect x="8.75" y="7" width="2.5" height="10" rx="0.6" />
        <rect x="14.5" y="4" width="2.5" height="13" rx="0.6" />
      </DummyIcon>
    ),
  },
  {
    type: "dummy",
    name: "Listen",
    icon: (
      <DummyIcon>
        <path d="M4 6.5 10 3l6 3.5v7L10 17l-6-3.5v-7Zm2 1.8v3.4L10 14.2l4-2.5V8.3L10 5.8 6 8.3Z" />
      </DummyIcon>
    ),
  },
  {
    type: "dummy",
    name: "Obvious",
    icon: (
      <DummyIcon>
        <path d="M10 3.5 12.8 9H17l-4 3.2 1.5 5.3L10 14.8 5.5 17.5 7 12.2 3 9h4.2L10 3.5Z" />
      </DummyIcon>
    ),
  },
];

type PartnerLogoGridProps = {
  className?: string;
};

const partnerLogoCellClass = (index: number) =>
  cn(
    "transition-opacity duration-200",
    index < 2 ? "opacity-[0.55] hover:opacity-75" : "opacity-100",
    index < 3 ? "sm:opacity-[0.55] sm:hover:opacity-75" : "sm:opacity-100",
    index < 5 ? "lg:opacity-[0.55] lg:hover:opacity-75" : "lg:opacity-100",
  );

export const PartnerLogoGrid = ({ className }: PartnerLogoGridProps) => (
  <div className={cn("mt-8 border-t border-border/60 pt-6 md:mt-10 md:pt-8", className)}>
    <p className="mb-4 text-center text-sm font-medium tracking-tight text-muted-foreground/70 md:mb-5">
      Vertrouwd door veel ondernemers
    </p>

    <div className="relative">
      <div className="grid grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-10 lg:gap-y-10">
        {partnerLogos.map((logo, index) =>
          logo.type === "image" ? (
            <div
              key={logo.alt}
              className={cn(
                "flex h-8 cursor-default items-center justify-center",
                partnerLogoCellClass(index),
              )}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-h-8 w-auto max-w-[min(120px,100%)] object-contain object-center"
                loading="lazy"
              />
            </div>
          ) : (
            <div
              key={logo.name}
              className={cn(
                "flex h-8 items-center justify-center gap-2 text-foreground sm:justify-start lg:justify-center",
                partnerLogoCellClass(index),
              )}
            >
              <div className="flex h-4 w-4 shrink-0 items-center justify-center [&_svg]:h-4 [&_svg]:w-4">
                {logo.icon}
              </div>
              <span className="text-xs font-medium tracking-tight">{logo.name}</span>
            </div>
          ),
        )}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] min-h-[6rem]"
        style={{
          background:
            "linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background) / 0.94) 14%, hsl(var(--background) / 0.72) 36%, hsl(var(--background) / 0.42) 56%, hsl(var(--background) / 0.18) 72%, hsl(var(--background) / 0.07) 86%, hsl(var(--background) / 0.03) 100%)",
        }}
      />
    </div>
  </div>
);
