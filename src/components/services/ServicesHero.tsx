import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DenseGridBackground } from "@/components/backgrounds/dense-grid-background";
import { SectionLines } from "@/components/backgrounds/section-lines";
import { NexDisplayHeading } from "@/components/ui/nex-typography";
import { SectionBadge } from "@/components/ui/nex-ui";

export const ServicesHero = () => (
  <section className="nex-page-hero-muted relative overflow-hidden">
    <SectionLines />
    <DenseGridBackground />
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div className="absolute left-1/3 top-1/2 h-[400px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-3xl" />
    </div>
    <div className="nex-container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl text-center"
      >
        <SectionBadge className="mx-auto mb-6">Onze diensten</SectionBadge>
        <NexDisplayHeading
          line1="Alles wat je nodig hebt"
          line2="om online te groeien"
          line2Serif
          align="center"
          className="mb-5"
        />
        <p className="nex-section-intro mx-auto">
          Van websites tot automatiseringen. Kies een dienst en ontdek wat Nexavo voor
          jouw bedrijf kan betekenen.
        </p>
        <Button asChild variant="brand" size="lg" className="mt-8">
          <a href="#werkwijze">Hoe werkt het</a>
        </Button>
      </motion.div>
    </div>
  </section>
);
