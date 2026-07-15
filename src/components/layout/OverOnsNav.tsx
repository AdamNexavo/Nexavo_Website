import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  ChevronDown,
  Layers,
  LayoutGrid,
  LogIn,
  MessageCircle,
  Plug,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";
import { ROUTES } from "@/lib/routes";

type OverOnsItem = {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

const overOnsMenuItems: OverOnsItem[] = [
  {
    label: "Diensten",
    href: "/diensten",
    description: "Websites en automatiseringen op maat",
    icon: Layers,
  },
  {
    label: "Cases",
    href: "/projecten",
    description: "Projecten en resultaten van klanten",
    icon: LayoutGrid,
  },
  {
    label: "Koppelingen",
    href: "/integraties",
    description: "Tools die aansluiten op jouw website",
    icon: Plug,
  },
];

type QuickActionItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
};

const quickActionItems: QuickActionItem[] = [
  {
    label: "Contact",
    href: ROUTES.contact,
    icon: MessageCircle,
  },
  {
    label: "Kennisbank",
    href: ROUTES.kennisbank,
    icon: BookOpen,
  },
  {
    label: "Plan demo",
    href: ROUTES.contact,
    icon: Rocket,
  },
  {
    label: "Klantenportaal",
    href: ROUTES.portal.login,
    icon: LogIn,
  },
];

const isLinkActive = (pathname: string, hash: string, href: string) => {
  const pathOnly = href.split("#")[0];
  const linkHash = href.includes("#") ? `#${href.split("#")[1]}` : "";

  if (pathOnly === "/integraties") {
    return pathname === "/integraties" || pathname.startsWith("/integraties/");
  }

  if (pathname !== pathOnly) return false;
  return linkHash ? hash === linkHash : true;
};

const isOverOnsActive = (pathname: string, hash: string) =>
  overOnsMenuItems.some((item) => isLinkActive(pathname, hash, item.href));

type OverOnsNavProps = {
  useSolidStyle?: boolean;
  inverse?: boolean;
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
};

export const OverOnsNav = ({
  useSolidStyle = true,
  inverse = false,
  onNavigate,
  variant = "desktop",
}: OverOnsNavProps) => {
  const location = useLocation();
  const isActive = isOverOnsActive(location.pathname, location.hash);
  const [mobileOpen, setMobileOpen] = useState(false);

  const triggerClass = cn(
    "flex items-center gap-1 text-sm font-medium transition-colors",
    inverse
      ? isActive
        ? "text-white"
        : "text-white/70 hover:text-white"
      : isActive
        ? "text-foreground"
        : "text-foreground/70 hover:text-foreground",
  );

  if (variant === "mobile") {
    return (
      <div>
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className={cn(triggerClass, "w-full justify-between py-2 px-0 rounded-none")}
          aria-expanded={mobileOpen}
        >
          Over ons
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              mobileOpen && "rotate-180",
            )}
          />
        </button>
        {mobileOpen && (
          <div className="mt-2 flex flex-col gap-1 border-l border-border/40 ml-2 pl-4">
            {overOnsMenuItems.map((item) => {
              const linkActive = isLinkActive(
                location.pathname,
                location.hash,
                item.href,
              );

              return (
                <NavLink
                  key={item.label}
                  to={item.href}
                  className={cn(
                    "block py-2 text-base font-medium transition-colors",
                    linkActive
                      ? useSolidStyle
                        ? "text-primary font-semibold"
                        : "text-white font-semibold"
                      : useSolidStyle
                        ? "text-muted-foreground hover:text-foreground"
                        : "text-white/70 hover:text-white",
                  )}
                  onClick={() => {
                    setMobileOpen(false);
                    onNavigate?.();
                  }}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      <button
        type="button"
        className={triggerClass}
        aria-haspopup="true"
        aria-expanded="false"
      >
        Over ons
        <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-hover:rotate-180" />
      </button>

      <div className="absolute left-0 top-full z-50 pt-2 opacity-0 invisible translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
        <div className="flex w-[min(560px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border/50 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.12)]">
          <div className="flex-1 p-5">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Ontdek Nexavo
            </p>
            <div className="flex flex-col gap-1">
              {overOnsMenuItems.map((item) => {
                const linkActive = isLinkActive(
                  location.pathname,
                  location.hash,
                  item.href,
                );
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group/item flex gap-3.5 rounded-xl px-3 py-3 transition-colors",
                      linkActive
                        ? "bg-primary/10"
                        : "hover:bg-[#f5f5f7]",
                    )}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-[#fafafa]">
                      <Icon
                        className={cn(
                          "h-5 w-5",
                          linkActive ? "text-primary" : "text-gray-700",
                        )}
                        strokeWidth={1.75}
                      />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <p
                        className={cn(
                          "text-sm font-semibold leading-tight",
                          linkActive ? "text-primary" : "text-foreground",
                        )}
                      >
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm leading-snug text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="w-px shrink-0 bg-border/60" />

          <div className="w-[210px] shrink-0 p-5">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Snel naar
            </p>
            <div className="flex flex-col gap-1">
              {quickActionItems.map((item) => {
                const Icon = item.icon;
                const linkActive =
                  !item.external &&
                  isLinkActive(location.pathname, location.hash, item.href);
                const className = cn(
                  "group/quick flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-colors",
                  linkActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-[#f5f5f7] hover:text-primary",
                );

                const content = (
                  <>
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover/quick:text-primary" />
                    <span className="min-w-0 flex-1">{item.label}</span>
                  </>
                );

                return item.external ? (
                  <a
                    key={`quick-${item.label}`}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onNavigate}
                    className={className}
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    key={`quick-${item.label}`}
                    to={item.href}
                    onClick={onNavigate}
                    className={className}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
