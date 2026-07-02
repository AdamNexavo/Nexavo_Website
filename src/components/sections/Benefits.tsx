import { useRef } from "react";
import { motion } from "framer-motion";
import { NexSection, SectionBadge } from "@/components/ui/nex-ui";
import { NexSectionHeading } from "@/components/ui/nex-typography";
import { PartnerLogoGrid } from "@/components/marketing/PartnerLogoGrid";
import { BenefitsConnector } from "@/components/sections/BenefitsConnector";
import {
  BenefitsIntegrationsStrip,
  BenefitsMiniDashboard,
} from "@/components/sections/BenefitsShowcase";

export const Benefits = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const integrationsRef = useRef<HTMLDivElement>(null);

  return (
    <NexSection surface="bento" divider glow className="!pb-20 md:!pb-28">
      <div ref={containerRef} className="relative isolate pb-12 lg:pb-16">
        <div className="relative z-[2] grid gap-10 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-0 xl:gap-x-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 max-w-lg lg:col-start-1 lg:row-start-1 lg:pt-2"
          >
            <SectionBadge className="mb-0">Waarom Nexavo</SectionBadge>
            <NexSectionHeading
              line1="Waarom kiezen voor"
              line2="Nexavo?"
              line2Serif={false}
              line2Purple={false}
              align="left"
              className="mt-5 mb-4"
            />
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              Van website tot boekingen en koppelingen: alles wat je online nodig
              hebt op één plek. Persoonlijk, snel en zonder gedoe met losse
              leveranciers.
            </p>
          </motion.div>

          <div className="order-2 flex w-full justify-center sm:justify-end lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:justify-end lg:pl-4 xl:pl-8 2xl:pl-12">
            <BenefitsMiniDashboard ref={dashboardRef} />
          </div>

          <div className="order-3 max-w-lg lg:col-start-1 lg:row-start-2 lg:self-end lg:pt-16">
            <BenefitsIntegrationsStrip ref={integrationsRef} />
          </div>
        </div>

        <BenefitsConnector
          containerRef={containerRef}
          dashboardRef={dashboardRef}
          integrationsRef={integrationsRef}
        />
      </div>

      <PartnerLogoGrid />
    </NexSection>
  );
};
