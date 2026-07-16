import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Diensten from "./pages/Diensten";
import Projecten from "./pages/Projecten";
import Pakketten from "./pages/Pakketten";
import PricingPage from "./pages/PricingPage";
import IntegratiesPage from "./pages/IntegratiesPage";
import IntegratieDetailPage from "./pages/IntegratieDetailPage";
import DienstDetailPage from "./pages/DienstDetailPage";
import ContactPage from "./pages/ContactPage";
import KennisbankPage from "./pages/KennisbankPage";
import PrivacyPage from "./pages/PrivacyPage";
import VoorwaardenPage from "./pages/VoorwaardenPage";
import NotFound from "./pages/NotFound";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { NexavoChatbot } from "@/components/chatbot/NexavoChatbot";
import { PortalAuthProvider } from "@/context/PortalAuthContext";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { AdminLayout } from "@/components/portal/AdminLayout";
import PortalLoginPage from "./pages/portal/PortalLoginPage";
import PortalRegisterPage from "./pages/portal/PortalRegisterPage";
import PortalDashboardPage from "./pages/portal/PortalDashboardPage";
import PortalWebsitePage from "./pages/portal/PortalWebsitePage";
import PortalOnboardingPage from "./pages/portal/PortalOnboardingPage";
import PortalKlantenservicePage from "./pages/portal/PortalKlantenservicePage";
import PortalFacturatiePage from "./pages/portal/PortalFacturatiePage";
import PortalBetalingPage from "./pages/portal/PortalBetalingPage";
import PortalKoppelingenPage from "./pages/portal/PortalKoppelingenPage";
import PortalBoekingskalenderPage from "./pages/portal/PortalBoekingskalenderPage";
import PortalReviewsPage from "./pages/portal/PortalReviewsPage";
import PortalBoekingenPage from "./pages/portal/PortalBoekingenPage";
import PortalProfielPage from "./pages/portal/PortalProfielPage";
import PortalPakkettenPage from "./pages/portal/PortalPakkettenPage";
import PortalStapPage from "./pages/portal/PortalStapPage";
import PortalTicketsPage from "./pages/portal/PortalTicketsPage";
import PortalTakenPage from "./pages/portal/PortalTakenPage";
import PortalKoppelingDetailPage from "./pages/portal/PortalKoppelingDetailPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminClientsPage from "./pages/admin/AdminClientsPage";
import AdminClientDetailPage from "./pages/admin/AdminClientDetailPage";
import AdminInvitesPage from "./pages/admin/AdminInvitesPage";
import AdminTicketsPage from "./pages/admin/AdminTicketsPage";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";
import AdminApplicationsPage from "./pages/admin/AdminApplicationsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminWebsitesPage from "./pages/admin/AdminWebsitesPage";
import AdminMailPage from "./pages/admin/AdminMailPage";

const queryClient = new QueryClient();

function MarketingExtras() {
  const location = useLocation();
  const isPortal = location.pathname.startsWith("/portal") || location.pathname.startsWith("/admin");
  if (isPortal) return null;
  return (
    <>
      <CookieBanner />
      <NexavoChatbot />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PortalAuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Marketing */}
            <Route path="/" element={<Home />} />
            <Route path="/diensten" element={<Diensten />} />
            <Route path="/diensten/:slug" element={<DienstDetailPage />} />
            <Route path="/projecten" element={<Projecten />} />
            <Route path="/pakketten" element={<Pakketten />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/integraties" element={<IntegratiesPage />} />
            <Route path="/integraties/:slug" element={<IntegratieDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/kennisbank" element={<KennisbankPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/voorwaarden" element={<VoorwaardenPage />} />

            {/* Portal auth */}
            <Route path="/portal/login" element={<PortalLoginPage />} />
            <Route path="/portal/register" element={<PortalRegisterPage />} />

            {/* Portal (client) */}
            <Route path="/portal" element={<PortalLayout />}>
              <Route index element={<PortalDashboardPage />} />
              <Route path="stap/:stepSlug" element={<PortalStapPage />} />
              <Route path="taken" element={<PortalTakenPage />} />
              <Route path="website" element={<PortalWebsitePage />} />
              <Route path="onboarding" element={<PortalOnboardingPage />} />
              <Route path="koppelingen" element={<PortalKoppelingenPage />} />
              <Route path="koppelingen/:slug" element={<PortalKoppelingDetailPage />} />
              <Route path="pakketten" element={<PortalPakkettenPage />} />
              <Route path="facturatie" element={<PortalFacturatiePage />} />
              <Route path="betaling" element={<PortalBetalingPage />} />
              <Route path="boekingskalender" element={<PortalBoekingskalenderPage />} />
              <Route path="reviews" element={<PortalReviewsPage />} />
              <Route path="boekingen" element={<PortalBoekingenPage />} />
              <Route path="klantenservice" element={<PortalKlantenservicePage />} />
              <Route path="tickets" element={<PortalTicketsPage />} />
              <Route path="profiel" element={<PortalProfielPage />} />
            </Route>

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="klanten" element={<AdminClientsPage />} />
              <Route path="klanten/:id" element={<AdminClientDetailPage />} />
              <Route path="websites" element={<AdminWebsitesPage />} />
              <Route path="uitnodigingen" element={<AdminInvitesPage />} />
              <Route path="tickets" element={<AdminTicketsPage />} />
              <Route path="betalingen" element={<AdminPaymentsPage />} />
              <Route path="aanvragen" element={<AdminApplicationsPage />} />
              <Route path="mail" element={<AdminMailPage />} />
              <Route path="instellingen" element={<AdminSettingsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <MarketingExtras />
        </BrowserRouter>
      </PortalAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
