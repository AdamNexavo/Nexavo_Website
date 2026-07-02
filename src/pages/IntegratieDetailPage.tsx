import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { IntegrationDetailContent } from "@/components/integrations/IntegrationDetailContent";
import { getIntegrationBySlug } from "@/data/integrations";
import { Button } from "@/components/ui/button";

const IntegratieDetailPage = () => {
  const { slug = "" } = useParams();
  const integration = getIntegrationBySlug(slug);

  if (!integration) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-32 text-center">
          <h1 className="nex-display mb-4">Koppeling niet gevonden</h1>
          <p className="text-muted-foreground mb-8">
            Deze koppeling bestaat niet of is verplaatst.
          </p>
          <Button asChild>
            <Link to="/integraties">Terug naar koppelingen</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <IntegrationDetailContent integration={integration} />
      </main>
      <Footer />
    </div>
  );
};

export default IntegratieDetailPage;
