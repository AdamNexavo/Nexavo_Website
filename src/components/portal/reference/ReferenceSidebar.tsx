import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutGrid,
  Globe,
  Link2,
  Receipt,
  CalendarClock,
  Star,
  User,
  Headphones,
  Ticket,
  ChevronDown,
  LogOut,
  Lightbulb,
  ExternalLink,
  X,
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
import { Button } from "@/components/ui/button";

const overviewNav = [
  { label: "Dashboard", href: "/portal", icon: LayoutGrid, exact: true },
  { label: "Website", href: "/portal/website", icon: Globe },
  { label: "Koppelingen", href: "/portal/koppelingen", icon: Link2 },
  { label: "Facturatie & betaling", href: "/portal/facturatie", icon: Receipt },
];

const automationNav = [
  { label: "Boekingskalender", href: "/portal/boekingskalender", icon: CalendarClock },
  { label: "Review management", href: "/portal/reviews", icon: Star },
];

const supportNav = [
  { label: "Tickets", href: "/portal/tickets", icon: Ticket },
  { label: "Klantenservice", href: "/portal/klantenservice", icon: Headphones },
];

const INTRO_DISMISS_KEY = "nexavo_portal_intro_dismissed";

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
  const [path, query] = href.split("?");
  const active = exact
    ? location.pathname === path && (!query || location.search.includes(query.split("=")[1] ?? ""))
    : location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <Link
      to={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2 rounded-[10px] px-2 py-1.5 text-[12px] font-medium transition-colors",
        active
          ? "bg-[#F5F5F5] text-[#111111]"
          : "text-[#6B7280] hover:bg-[#EDE9FE]/60 hover:text-[#7547F8]",
      )}
    >
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
          active ? "bg-[#7547F8] text-white" : "bg-transparent text-[#9CA3AF]",
        )}
      >
        <Icon className="h-[14px] w-[14px]" strokeWidth={1.75} />
      </span>
      {label}
    </Link>
  );
}

type ReferenceSidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export function ReferenceSidebar({ className, onNavigate }: ReferenceSidebarProps) {
  const { client, logout } = usePortalAuth();
  const navigate = useNavigate();
  const userName = client?.user.firstName ?? "Jij";
  const [introDismissed, setIntroDismissed] = useState(
    () => typeof window !== "undefined" && localStorage.getItem(INTRO_DISMISS_KEY) === "1",
  );

  const dismissIntro = () => {
    localStorage.setItem(INTRO_DISMISS_KEY, "1");
    setIntroDismissed(true);
  };

  const go = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <aside
      className={cn(
        "flex h-screen w-[220px] shrink-0 flex-col overflow-hidden border-r border-[#E2E0DB] bg-[#FAFAF8] px-2.5 py-3",
        className,
      )}
    >
      <div className="mb-4 flex justify-center px-1">
        <Link to="/portal" onClick={onNavigate} className="inline-flex">
          <NexavoLogo className="h-7" />
        </Link>
      </div>

      {!introDismissed && (
        <div className="relative mb-4 rounded-[14px] border border-[#E2E0DB] bg-[#F5F5F5] p-3">
          <button
            type="button"
            onClick={dismissIntro}
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-md text-[#9CA3AF] transition-colors hover:bg-white hover:text-[#6B7280]"
            aria-label="Melding sluiten"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <p className="pr-6 text-[13px] font-semibold text-[#111111]">Website in bouw</p>
          <p className="mt-1 text-[12px] leading-relaxed text-[#6B7280]">
            Volg je voortgang, lever input aan en beheer support vanuit dit portaal.
          </p>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="mt-3 h-8 w-full rounded-full border-[#7547F8] bg-white text-[12px] text-[#111111] hover:bg-white"
          >
            <Link to="/portal" onClick={onNavigate}>
              Bekijk taken
            </Link>
          </Button>
        </div>
      )}

      <nav className="min-h-0 flex-1 space-y-4 overflow-y-auto">
        <div>
          <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">
            Overzicht
          </p>
          <div className="space-y-0.5">
            {overviewNav.map((item) => (
              <NavItem key={item.href + item.label} {...item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">
            Automatiseringen
          </p>
          <div className="space-y-0.5">
            {automationNav.map((item) => (
              <NavItem key={item.href + item.label} {...item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">
            Support
          </p>
          <div className="space-y-0.5">
            {supportNav.map((item) => (
              <NavItem key={item.href + item.label} {...item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </nav>

      <div className="mt-3 space-y-1 border-t border-[#E2E0DB] pt-3">
        <NavItem href="/portal/profiel" label="Profiel" icon={User} onNavigate={onNavigate} />
        <a
          href={ROUTES.kennisbank}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-[10px] px-2 py-1.5 text-[12px] font-medium text-[#6B7280] transition-colors hover:bg-[#EDE9FE]/60 hover:text-[#7547F8]"
        >
          <Lightbulb className="h-[14px] w-[14px] shrink-0" strokeWidth={1.75} />
          Kennisbank
          <ExternalLink className="ml-auto h-3.5 w-3.5 text-[#9CA3AF]" />
        </a>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-[14px] border border-[#E2E0DB] bg-white px-2.5 py-2 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:bg-[#FAFAF8]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F5F5F5] text-[10px] font-semibold text-[#374151]">
                {client?.user.avatarInitials ?? userName[0]?.toUpperCase()}
              </span>
              <span className="min-w-0 flex-1 truncate text-left">
                <span className="block text-[13px] font-semibold text-[#111111]">{userName}</span>
                <span className="block truncate text-[11px] text-[#9CA3AF]">
                  {client?.companyName || "Klant"}
                </span>
              </span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#9CA3AF]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 rounded-[16px]">
            <DropdownMenuItem onClick={() => go("/portal/profiel")}>Mijn profiel</DropdownMenuItem>
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
    </aside>
  );
}
