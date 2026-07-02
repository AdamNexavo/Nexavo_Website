import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ServiceDetailContent } from "@/components/services/ServiceDetailContent";
import { getServiceDetail } from "@/data/serviceDetails";
import { Button } from "@/components/ui/button";

const DienstDetailPage = () => {
  const { slug = "" } = useParams();
  const service = getServiceDetail(slug);

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-32 text-center">
          <h1 className="nex-display mb-4">Dienst niet gevonden</h1>
          <p className="mb-8 text-muted-foreground">
            Deze dienst bestaat niet of is verplaatst.
          </p>
          <Button asChild>
            <Link to="/diensten">Terug naar diensten</Link>
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
        <ServiceDetailContent service={service} />
      </main>
      <Footer />
    </div>
  );
};

export default DienstDetailPage;
