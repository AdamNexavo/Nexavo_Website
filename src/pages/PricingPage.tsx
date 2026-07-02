import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PricingHero } from "@/components/pricing/PricingHero";
import { PricingCards } from "@/components/pricing/PricingCards";
import { PricingBlueprint } from "@/components/pricing/PricingBlueprint";
import { PricingComparisonTable } from "@/components/pricing/PricingComparisonTable";
import { PricingGuide } from "@/components/pricing/PricingGuide";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";
import { PricingCTA } from "@/components/pricing/PricingCTA";
import { PricingIntegrations } from "@/components/pricing/PricingIntegrations";
import { PricingMaintenance } from "@/components/pricing/PricingMaintenance";
import { motion } from "framer-motion";
import { NexDualLineTitle } from "@/components/ui/nex-typography";
import { ArrowDown } from "lucide-react";
import { DenseGridBackground } from "@/components/backgrounds/dense-grid-background";
import { SectionLines } from "@/components/backgrounds/section-lines";
import { SectionBadge } from "@/components/ui/nex-ui";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="relative">
          <PricingHero />
          <a
            href="#hoofdpakketten"
            aria-label="Ga naar pakketten"
            className="absolute bottom-0 left-1/2 z-30 flex h-12 w-12 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-white text-foreground shadow-soft hover:border-border transition-all duration-200"
          >
            <ArrowDown className="w-5 h-5" strokeWidth={2.5} />
          </a>
        </div>

        {/* 2. Hoofdpakketten */}
        <section id="hoofdpakketten" className="relative z-0 overflow-hidden pt-28 nex-section bg-card nex-hairline-b scroll-mt-24">
          <SectionLines opacity="subtle" />
          <div className="nex-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <SectionBadge className="mx-auto">Hoofdpakketten</SectionBadge>
              <NexDualLineTitle
                sans={
                  <>
                    Kies je <span className="text-primary">pakket</span>
                  </>
                }
                serif="en start direct"
                className="mb-6"
              />
              <p className="nex-body-lg mx-auto text-muted-foreground">
                Eén pagina, een complete website of het volledige pakket. Jij
                kiest wat past, later uitbreiden kan altijd.
              </p>
              <p className="nex-body-sm mx-auto mt-3 text-muted-foreground">
                Alle prijzen zijn eenmalig, exclusief btw.
              </p>
            </motion.div>

            <PricingCards />
          </div>
        </section>

        {/* 3. Keuzehulp */}
        <PricingGuide />

        {/* 4. Vergelijkingstabel */}
        <section className="nex-section nex-surface-muted relative overflow-hidden nex-hairline-b">
          <SectionLines opacity="strong" />
          <DenseGridBackground />
          <div className="nex-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <SectionBadge className="mx-auto">Vergelijking</SectionBadge>
              <h2 className="nex-dual-heading nex-dual-heading-inline mb-4 text-center">
                <span className="nex-type-section-sans">Alles op</span>
                <span className="nex-type-section-serif whitespace-nowrap">
                  <span className="nex-tremor-char">é</span>
                  <span>én rij</span>
                </span>
              </h2>
              <p className="nex-section-intro mx-auto">
                Bekijk per pakket wat inbegrepen is en waar je op kunt
                uitbreiden.
              </p>
            </motion.div>

            <PricingComparisonTable />
          </div>
        </section>

        {/* 5. Onderhoud & support */}
        <PricingMaintenance />

        {/* 6. Onze werkwijze */}
        <PricingBlueprint />

        {/* 7. Integraties */}
        <PricingIntegrations />

        <PricingFAQ />
        <PricingCTA />
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
