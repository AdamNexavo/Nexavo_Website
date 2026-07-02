import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Features } from "@/components/sections/Features";
import { BottomCTA } from "@/components/sections/BottomCTA";

const Functionaliteiten = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Features />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Functionaliteiten;












