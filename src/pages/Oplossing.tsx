import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Automations } from "@/components/sections/Automations";
import { Contact } from "@/components/sections/Contact";

const Oplossing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Automations />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Oplossing;












