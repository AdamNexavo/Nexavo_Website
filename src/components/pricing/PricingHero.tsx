import { motion } from "framer-motion";
import { PricingHeroSkeleton } from "./PricingHeroSkeleton";
import { DenseGridBackground } from "@/components/backgrounds/dense-grid-background";
import { SectionLines } from "@/components/backgrounds/section-lines";
import { NexDisplayHeading } from "@/components/ui/nex-typography";
import { SectionBadge } from "@/components/ui/nex-ui";

export const PricingHero = () => {
  return (
    <section className="nex-page-hero-muted relative overflow-hidden">
      <SectionLines />
      <DenseGridBackground />
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full bg-primary/[0.04] blur-3xl" />
      </div>
      <div className="nex-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <SectionBadge className="mb-6">Prijzen</SectionBadge>
            <NexDisplayHeading
              line1="Kies het pakket dat"
              line2="bij je past"
              line2Serif
              align="left"
              className="mb-5"
            />
            <p className="nex-section-intro">
              Websitepakketten vanaf €745 eenmalig, exclusief btw. Maandelijks
              onderhoud kies je apart via de onderhoudspakketten hieronder.
            </p>
          </motion.div>

          <PricingHeroSkeleton />
        </div>
      </div>
    </section>
  );
};
