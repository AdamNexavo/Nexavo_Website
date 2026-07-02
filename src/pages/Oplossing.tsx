import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Automations } from "@/components/sections/Automations";
import { BottomCTA } from "@/components/sections/BottomCTA";

const Oplossing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Automations />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Oplossing;












