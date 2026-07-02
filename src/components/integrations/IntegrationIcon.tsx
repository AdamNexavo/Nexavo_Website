import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Integration } from "@/data/integrations";
import {
  getIntegrationLogoFallbackUrl,
  getIntegrationLogoUrl,
  isSquareIntegrationLogo,
} from "@/lib/integrationLogos";
import { WeroLogo } from "./WeroLogo";

type IntegrationIconProps = {
  integration: Pick<Integration, "name" | "slug" | "iconSlug" | "logoUrl">;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const squareSizeClasses = {
  sm: "h-7 w-7",
  md: "h-10 w-10",
  lg: "h-14 w-14",
};

export const IntegrationIcon = ({
  integration,
  size = "md",
  className,
}: IntegrationIconProps) => {
  const [src, setSrc] = useState(getIntegrationLogoUrl(integration as Integration));
  const [failed, setFailed] = useState(false);
  const isSquareLogo = isSquareIntegrationLogo(integration.slug);

  if (integration.slug === "wero") {
    return (
      <WeroLogo
        className={cn(squareSizeClasses[size], className)}
      />
    );
  }

  if (failed) {
    return (
      <span
        className={cn(
          "flex items-center justify-center rounded-lg bg-[#f5f5f7] text-xs font-bold text-muted-foreground",
          size === "lg" ? "h-14 w-14 text-sm" : size === "md" ? "h-10 w-10" : "h-8 w-8",
          className,
        )}
      >
        {integration.name.charAt(0)}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={integration.name}
      className={cn(
        isSquareLogo ? squareSizeClasses[size] : sizeClasses[size],
        "object-contain",
        className,
      )}
      loading="lazy"
      onError={() => {
        const fallback = getIntegrationLogoFallbackUrl(integration as Integration);
        if (src !== fallback) {
          setSrc(fallback);
          return;
        }
        setFailed(true);
      }}
    />
  );
};

export const IntegrationIconTile = ({
  integration,
  large = false,
  xl = false,
  bare = false,
}: {
  integration: Pick<Integration, "name" | "slug" | "iconSlug" | "logoUrl">;
  large?: boolean;
  xl?: boolean;
  bare?: boolean;
}) => {
  const [src, setSrc] = useState(getIntegrationLogoUrl(integration as Integration));
  const [failed, setFailed] = useState(false);
  const isSquareLogo = isSquareIntegrationLogo(integration.slug);

  const squareClass = xl
    ? "h-14 w-14"
    : large
      ? "h-12 w-12"
      : "h-9 w-9";

  const defaultClass = xl
    ? "h-10 w-10 max-w-[56px]"
    : large
      ? "h-8 w-8 max-w-[48px]"
      : "h-6 w-6 max-w-[32px]";

  const icon =
    integration.slug === "wero" ? (
      <WeroLogo className={cn(squareClass, "max-w-none")} />
    ) : !failed ? (
      <img
        key={src}
        src={src}
        alt={integration.name}
        className={cn("object-contain", isSquareLogo ? squareClass : defaultClass)}
        loading="lazy"
        onError={() => {
          const fallback = getIntegrationLogoFallbackUrl(integration as Integration);
          if (src !== fallback) {
            setSrc(fallback);
            return;
          }
          setFailed(true);
        }}
      />
    ) : (
      <span className="text-xs font-bold text-muted-foreground">
        {integration.name.split(" ")[0].slice(0, 2)}
      </span>
    );

  if (bare) {
    return icon;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-white border border-border/40 shrink-0 overflow-hidden",
        isSquareLogo
          ? xl
            ? "h-20 w-20 rounded-2xl p-1"
            : large
              ? "h-16 w-16 rounded-xl p-1"
              : "h-12 w-12 rounded-lg p-0.5"
          : xl
            ? "h-20 w-20 rounded-2xl"
            : large
              ? "h-16 w-16 rounded-xl"
              : "h-12 w-12 rounded-lg",
      )}
    >
      {icon}
    </div>
  );
};
