import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type NexDualLineTitleProps = {
  sans: ReactNode;
  serif: ReactNode;
  serifPurple?: boolean;
  inline?: boolean;
  as?: "h1" | "h2" | "h3";
  size?: "display" | "section";
  align?: "left" | "center";
  className?: string;
  sansClassName?: string;
  serifClassName?: string;
};

const sansClass = (size: "display" | "section") =>
  size === "display" ? "nex-type-display-sans" : "nex-type-section-sans";

const serifClass = (size: "display" | "section") =>
  size === "display" ? "nex-type-display-serif" : "nex-type-section-serif";

/** Standaard kop: Inter Bold (regel 1) + Playfair Display (regel 2) */
export const NexDualLineTitle = ({
  sans,
  serif,
  serifPurple = false,
  inline = false,
  as: Tag = "h2",
  size = "section",
  align = "center",
  className,
  sansClassName,
  serifClassName,
}: NexDualLineTitleProps) => (
  <Tag
    className={cn(
      inline ? "nex-dual-heading-inline" : "nex-dual-heading",
      align === "center" && "text-center",
      inline && align === "left" && "justify-start",
      className,
    )}
  >
    <span className={cn(sansClass(size), !inline && "block", sansClassName)}>{sans}</span>
    <span
      className={cn(
        serifClass(size),
        !inline && "block",
        serifPurple && "text-primary",
        serifClassName,
      )}
    >
      {serif}
    </span>
  </Tag>
);

const displayLine2Class = (
  line2Serif: boolean,
  line2Purple: boolean,
  line2ClassName?: string,
) => {
  if (line2Serif && line2Purple) {
    return cn("nex-type-display-serif text-primary", line2ClassName);
  }
  if (line2Purple) {
    return cn(
      "font-sans text-[2.125rem] font-bold leading-[1.04] tracking-[-0.035em] text-primary sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.5rem]",
      line2ClassName,
    );
  }
  if (line2Serif) {
    return cn("nex-type-display-serif", line2ClassName);
  }
  return cn("nex-type-display-sans", line2ClassName);
};

const sectionLine2Class = (
  line2Serif: boolean,
  line2Purple: boolean,
  line2ClassName?: string,
) => {
  if (line2Serif && line2Purple) {
    return cn("nex-type-section-serif text-primary", line2ClassName);
  }
  if (line2Purple) {
    return cn(
      "font-sans text-[1.75rem] font-bold leading-[1.04] tracking-[-0.03em] text-primary sm:text-[2rem] md:text-[2.5rem] lg:text-[2.75rem]",
      line2ClassName,
    );
  }
  if (line2Serif) {
    return cn("nex-type-section-serif", line2ClassName);
  }
  return cn("nex-type-section-sans", line2ClassName);
};

type NexDisplayHeadingProps = {
  line1: ReactNode;
  line2?: ReactNode;
  line2Serif?: boolean;
  line2Purple?: boolean;
  as?: "h1" | "h2";
  align?: "left" | "center";
  className?: string;
  line1ClassName?: string;
  line2ClassName?: string;
};

/** Grote page hero — Inter Bold + Playfair Display */
export const NexDisplayHeading = ({
  line1,
  line2,
  line2Serif = true,
  line2Purple = false,
  as: Tag = "h1",
  align = "center",
  className,
  line1ClassName,
  line2ClassName,
}: NexDisplayHeadingProps) => (
  <Tag
    className={cn(
      "nex-dual-heading",
      align === "center" && "text-center",
      className,
    )}
  >
    <span className={cn("nex-type-display-sans block", line1ClassName)}>
      {line1}
    </span>
    {line2 && (
      <span className={cn("block", displayLine2Class(line2Serif, line2Purple, line2ClassName))}>
        {line2}
      </span>
    )}
  </Tag>
);

type NexSectionHeadingProps = {
  line1: ReactNode;
  line2?: ReactNode;
  line2Serif?: boolean;
  line2Purple?: boolean;
  as?: "h2" | "h3";
  align?: "left" | "center";
  className?: string;
  line1ClassName?: string;
  line2ClassName?: string;
};

/** Sectie heading — Inter Bold + Playfair Display */
export const NexSectionHeading = ({
  line1,
  line2,
  line2Serif = true,
  line2Purple = false,
  as: Tag = "h2",
  align = "center",
  className,
  line1ClassName,
  line2ClassName,
}: NexSectionHeadingProps) => (
  <Tag
    className={cn(
      "nex-dual-heading",
      align === "center" && "text-center",
      className,
    )}
  >
    <span className={cn("nex-type-section-sans block", line1ClassName)}>
      {line1}
    </span>
    {line2 && (
      <span className={cn("block", sectionLine2Class(line2Serif, line2Purple, line2ClassName))}>
        {line2}
      </span>
    )}
  </Tag>
);

/** Serif accent binnen lopende tekst */
export const NexAccentSerif = ({
  children,
  purple = true,
  className,
}: {
  children: ReactNode;
  purple?: boolean;
  className?: string;
}) => (
  <span
    className={cn(
      "nex-accent-serif",
      purple && "text-primary",
      className,
    )}
  >
    {children}
  </span>
);
