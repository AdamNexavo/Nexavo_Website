import { Link } from "react-router-dom";
import { isInternalPath } from "@/lib/routes";
import { cn } from "@/lib/utils";

type InternalLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  external?: boolean;
};

/** Renders React Router Link for internal paths, plain anchor for external URLs. */
export function InternalLink({
  href,
  className,
  children,
  onClick,
  external,
}: InternalLinkProps) {
  if (!external && isInternalPath(href)) {
    return (
      <Link to={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      onClick={onClick}
      {...(external || href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
