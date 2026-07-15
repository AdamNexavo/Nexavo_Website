import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { ReferenceSidebar } from "@/components/portal/reference/ReferenceSidebar";
import { ReferenceShell, ReferenceMain } from "@/components/portal/reference/ReferenceUI";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NexavoLogo } from "@/components/layout/NexavoLogo";

export function PortalLayout() {
  const { isClient, isLoading, client } = usePortalAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF8]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#7547F8] border-t-transparent" />
      </div>
    );
  }

  if (!isClient) {
    return <Navigate to="/portal/login" replace />;
  }

  if (!client) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF8]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#7547F8] border-t-transparent" />
      </div>
    );
  }

  return (
    <ReferenceShell>
      <ReferenceSidebar className="hidden lg:flex" />

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-[272px] border-[#E2E0DB] p-0">
          <ReferenceSidebar className="w-full border-0" onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center justify-between border-b border-[#E2E0DB] bg-[#FAFAF8] px-4 py-3 lg:hidden">
          <NexavoLogo className="h-7" />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-[12px] border-[#E2E0DB]"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Menu openen"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <ReferenceMain>
          <Outlet />
        </ReferenceMain>
      </div>
    </ReferenceShell>
  );
}
