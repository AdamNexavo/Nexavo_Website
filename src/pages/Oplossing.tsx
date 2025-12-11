import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Solution } from "@/components/sections/Solution";
import { Contact } from "@/components/sections/Contact";

const Oplossing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Solution />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Oplossing;











