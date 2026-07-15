import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  Mail,
  FileText,
  Ticket,
  CreditCard,
  Globe,
  Settings,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { NexavoLogo } from "@/components/layout/NexavoLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAdminSettings } from "@/lib/portal/admin-settings";

const beheerNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutGrid, exact: true },
  { label: "Klanten", href: "/admin/klanten", icon: Users },
  { label: "Websites", href: "/admin/websites", icon: Globe },
  { label: "Uitnodigingen", href: "/admin/uitnodigingen", icon: Mail },
  { label: "Aanvragen", href: "/admin/aanvragen", icon: FileText },
];

const supportNav = [
  { label: "Tickets", href: "/admin/tickets", icon: Ticket },
  { label: "Betalingen", href: "/admin/betalingen", icon: CreditCard },
];

function AdminNavItem({
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
        "flex items-center gap-2 rounded-[10px] px-2 py-1.5 text-[12px] font-medium transition-colors",
        active
          ? "bg-[#F5F5F5] text-[#111111]"
          : "text-[#6B7280] hover:bg-[#FAFAF8] hover:text-[#111111]",
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

export function ReferenceAdminSidebar({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const { logout } = usePortalAuth();
  const navigate = useNavigate();
  const settings = getAdminSettings();

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
      <Link to="/admin" className="mb-4 px-1" onClick={onNavigate}>
        <NexavoLogo className="h-7" />
      </Link>

      <div className="mb-3 rounded-[14px] border border-[#E2E0DB] bg-white px-2.5 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Console</p>
        <p className="truncate text-[13px] font-semibold text-[#111111]">{settings.companyLabel}</p>
      </div>

      <nav className="min-h-0 flex-1 space-y-4 overflow-y-auto">
        <div>
          <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">
            Beheer
          </p>
          <div className="space-y-0.5">
            {beheerNav.map((item) => (
              <AdminNavItem key={item.href} {...item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">
            Support & finance
          </p>
          <div className="space-y-0.5">
            {supportNav.map((item) => (
              <AdminNavItem key={item.href} {...item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </nav>

      <div className="mt-3 space-y-1 border-t border-[#E2E0DB] pt-3">
        <AdminNavItem href="/admin/instellingen" label="Instellingen" icon={Settings} onNavigate={onNavigate} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-[14px] border border-[#E2E0DB] bg-white px-2.5 py-2 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:bg-[#FAFAF8]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-[10px] font-semibold text-[#7547F8]">
                {settings.displayName[0]?.toUpperCase() ?? "A"}
              </span>
              <span className="min-w-0 flex-1 truncate text-left">
                <span className="block text-[13px] font-semibold text-[#111111]">{settings.displayName}</span>
                <span className="block text-[11px] text-[#9CA3AF]">Administrator</span>
              </span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#9CA3AF]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 rounded-[16px]">
            <DropdownMenuItem onClick={() => go("/admin/instellingen")}>Instellingen</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                logout();
                navigate("/admin/login");
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
