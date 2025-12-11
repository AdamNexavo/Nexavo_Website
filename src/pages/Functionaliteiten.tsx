import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Features } from "@/components/sections/Features";
import { Contact } from "@/components/sections/Contact";

const Functionaliteiten = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Features />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Functionaliteiten;












