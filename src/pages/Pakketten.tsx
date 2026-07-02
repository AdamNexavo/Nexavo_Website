import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { BottomCTA } from "@/components/sections/BottomCTA";
import { NexPageHero } from "@/components/ui/nex-ui";

const Pakketten = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <NexPageHero
          label="Pakketten"
          titleLine1="Investeer in"
          titleLine2="groei"
          titleLine2Serif
          titleLine2Purple
          intro="Transparante pakketten zonder verborgen kosten. Kies het pakket dat bij jouw ambities past."
        />
        <Pricing />
        <FAQ />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Pakketten;
