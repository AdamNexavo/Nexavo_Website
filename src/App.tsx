import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieBanner />
        <NexavoChatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
// Auto-backup test comment 19:53:49
