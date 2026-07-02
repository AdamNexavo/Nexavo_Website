import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesCatalog } from "@/components/services/ServicesCatalog";
import { Process } from "@/components/sections/Process";
import { BottomCTA } from "@/components/sections/BottomCTA";

export default function Diensten() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ServicesHero />
        <ServicesCatalog />
        <Process />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
}
