import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
import { motion } from "framer-motion";

const Pakketten = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="py-24 pt-32">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
                Pakketten
              </p>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Investeer in{" "}
                <span className="text-[#6a50ff]">groei</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Transparante pakketten zonder verborgen kosten. Kies het pakket dat bij jouw ambities past.
              </p>
            </motion.div>
          </div>
        </section>
        
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Pakketten;
