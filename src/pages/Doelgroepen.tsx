import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Niche } from "@/components/sections/Niche";
import { BottomCTA } from "@/components/sections/BottomCTA";

const Doelgroepen = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Niche />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Doelgroepen;












