import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { IntegrationsHero } from "@/components/integrations/IntegrationsHero";
import { IntegrationsIntro } from "@/components/integrations/IntegrationsIntro";
import { IntegrationsCatalog } from "@/components/integrations/IntegrationsCatalog";

const IntegratiesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <IntegrationsHero />
        <IntegrationsIntro />
        <IntegrationsCatalog />
      </main>
      <Footer />
    </div>
  );
};

export default IntegratiesPage;
