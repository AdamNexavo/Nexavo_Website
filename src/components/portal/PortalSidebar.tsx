import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Globe,
  Link2,
  Receipt,
  CalendarClock,
  Star,
  Headphones,
  ChevronDown,
  LogOut,
  User,
  Package,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePortalAuth } from "@/context/PortalAuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NexavoLogo } from "@/components/layout/NexavoLogo";
import { ROUTES } from "@/lib/routes";
import { hasPendingPackage } from "@/lib/portal/helpers";

const overviewNav = [
  { label: "Dashboard", href: "/portal", icon: LayoutGrid, exact: true },
  { label: "Website", href: "/portal/website", icon: Globe },
  { label: "Pakketten", href: "/portal/pakketten", icon: Package },
  { label: "Koppelingen", href: "/portal/koppelingen", icon: Link2 },
  { label: "Facturatie", href: "/portal/facturatie", icon: Receipt },
];

const automationNav = [
  { label: "Boekingskalender", href: "/portal/boekingskalender", icon: CalendarClock },
  { label: "Review management", href: "/portal/reviews", icon: Star },
];

function NavItem({
  href,
  label,
  icon: Icon,
  exact,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  exact?: boolean;
  onNavigate?: () => void;
}) {
  const location = useLocation();
  const active = exact
    ? location.pathname === href
    : location.pathname === href || location.pathname.startsWith(`${href}/`);

  return (
    <Link
      to={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-[14px] px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200",
        active
          ? "bg-[#F5F4F2] text-[#0B0B0D] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]"
          : "text-[#6B7280] hover:bg-[#FAFAFA] hover:text-[#0B0B0D]",
      )}
    >
      <Icon
        className={cn("h-[18px] w-[18px] shrink-0", active && "text-[#7547F8]")}
        strokeWidth={1.75}
      />
      {label}
    </Link>
  );
}

type PortalSidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export function PortalSidebar({ className, onNavigate }: PortalSidebarProps) {
  const { client, logout } = usePortalAuth();
  const navigate = useNavigate();
  const companyInitial = client?.companyName?.[0]?.toUpperCase() ?? "J";
  const userInitials = client?.user.avatarInitials ?? "JD";

  const go = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <aside className={cn("flex w-[260px] shrink-0 flex-col", className)}>
      <div className="flex h-full flex-col rounded-[28px] border border-black/[0.08] bg-white p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_24px_48px_-32px_rgba(15,23,42,0.12)]">
        <Link to="/portal" className="mb-5 px-2 pt-1" onClick={onNavigate}>
          <NexavoLogo className="h-6" />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="mb-6 flex w-full items-center gap-3 rounded-[16px] border border-black/[0.08] bg-[#FAFAFA] px-3.5 py-3 text-left transition-colors hover:bg-[#F5F4F2]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7547F8] to-[#6A50FF] text-sm font-semibold text-white shadow-sm">
                {companyInitial}
              </span>
              <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-[#0B0B0D]">
                {client?.companyName || "Jouw bedrijf"}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 rounded-[16px]">
            <DropdownMenuItem onClick={() => go("/portal/profiel")}>
              Bedrijfsprofiel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => go("/portal/website")}>
              Website intake
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {!client?.onboarding.completed && (
          <Link
            to="/portal/website"
            onClick={onNavigate}
            className="mb-4 block rounded-[16px] border border-[#7547F8]/20 bg-[#F5F3FF]/50 p-3.5 transition-colors hover:bg-[#F5F3FF]"
          >
            <p className="text-[13px] font-semibold text-[#7547F8]">Intake afronden</p>
            <p className="mt-0.5 text-[12px] text-[#6B7280]">Ga verder met je kennismaking →</p>
          </Link>
        )}

        {client && hasPendingPackage(client) && (
          <Link
            to="/portal/pakketten"
            onClick={onNavigate}
            className="mb-4 block rounded-[16px] border border-black/[0.08] bg-[#FAFAFA] p-3.5 hover:bg-[#F5F4F2]"
          >
            <p className="text-[13px] font-semibold">Pakket kiezen</p>
            <p className="mt-0.5 text-[12px] text-[#6B7280]">Kies je websitepakket →</p>
          </Link>
        )}

        <nav className="flex-1 space-y-7 overflow-y-auto px-1">
          <div>
            <p className="mb-2.5 px-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">
              Overzicht
            </p>
            <div className="space-y-1">
              {overviewNav.map((item) => (
                <NavItem key={item.href} {...item} onNavigate={onNavigate} />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2.5 px-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">
              Automatiseringen
            </p>
            <div className="space-y-1">
              {automationNav.map((item) => (
                <NavItem key={item.href} {...item} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        </nav>

        <div className="mt-4 space-y-1 border-t border-black/[0.06] pt-4">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">
            Account
          </p>
          <NavItem href="/portal/profiel" label="Profiel" icon={User} onNavigate={onNavigate} />
          <NavItem href="/portal/klantenservice" label="Klantenservice" icon={Headphones} onNavigate={onNavigate} />
          <a
            href={ROUTES.kennisbank}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-[14px] bg-[#FAFAFA] px-3.5 py-2.5 text-[14px] font-medium text-[#6B7280] transition-colors hover:bg-[#F5F4F2] hover:text-[#0B0B0D]"
          >
            <Lightbulb className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
            Kennisbank
            <ExternalLink className="ml-auto h-3.5 w-3.5 text-[#9CA3AF]" />
          </a>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-[16px] border border-black/[0.08] bg-white px-3.5 py-3 text-left transition-colors hover:bg-[#FAFAFA]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/[0.08] bg-[#FAFAFA] text-xs font-semibold text-[#374151]">
                  {userInitials}
                </span>
                <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-[#0B0B0D]">
                  {client?.user.firstName ?? "Jij"}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 rounded-[16px]">
              <DropdownMenuItem onClick={() => go("/portal/profiel")}>
                <User className="mr-2 h-4 w-4" />
                Mijn profiel
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  onNavigate?.();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Uitloggen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
}
