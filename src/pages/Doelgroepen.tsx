import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Niche } from "@/components/sections/Niche";
import { Contact } from "@/components/sections/Contact";

const Doelgroepen = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Niche />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Doelgroepen;












