import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";

const Werkwijze = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Werkwijze;











