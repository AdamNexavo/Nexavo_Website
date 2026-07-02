import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { NexDualLineTitle } from "@/components/ui/nex-typography";
import { Button } from "@/components/ui/button";
import { DenseGridBackground } from "@/components/backgrounds/dense-grid-background";
import { SectionLines } from "@/components/backgrounds/section-lines";
import { SectionBadge, nexIntegrationCardClass } from "@/components/ui/nex-ui";
import { pricingFeaturedIntegrations } from "@/data/integrations";
import {
  getIntegrationLogoFallbackUrl,
  getIntegrationLogoUrl,
} from "@/lib/integrationLogos";
import type { Integration } from "@/data/integrations";

const IntegrationLogo = ({
  integration,
  index,
}: {
  integration: Integration;
  index: number;
}) => {
  const [src, setSrc] = useState(getIntegrationLogoUrl(integration));
  const [failed, setFailed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <Link
        to={`/integraties/${integration.slug}`}
        className="flex h-[5.5rem] flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 shadow-sm transition-colors hover:bg-muted/30"
      >
        {!failed ? (
          <img
            src={src}
            alt={integration.name}
            className="h-7 w-auto max-w-[90px] object-contain"
            loading="lazy"
            onError={() => {
              const fallback = getIntegrationLogoFallbackUrl(integration);
              if (src !== fallback) {
                setSrc(fallback);
                return;
              }
              setFailed(true);
            }}
          />
        ) : (
          <span className="text-lg font-bold text-muted-foreground/70 tracking-tight">
            {integration.name.split(" ")[0]}
          </span>
        )}
        <span className="text-[11px] font-medium text-muted-foreground text-center leading-tight">
          {integration.name}
        </span>
      </Link>
    </motion.div>
  );
};

export const PricingIntegrations = () => {
  return (
    <section id="integraties" className="nex-section nex-surface-subtle relative overflow-hidden scroll-mt-28 nex-hairline-b">
      <SectionLines />
      <DenseGridBackground />
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(106, 80, 255, 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="nex-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <SectionBadge className="mx-auto">Koppelingen</SectionBadge>
          <NexDualLineTitle
            sans="Koppel met de tools"
            serif="die je al gebruikt"
            className="mb-4"
          />
          <p className="text-lg text-muted-foreground">
            Van boekingen tot formulieren en reviews. Nexavo sluit aan op de
            systemen die jouw bedrijf al draaiende houden.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto mb-3">
          {pricingFeaturedIntegrations.map((integration, index) => (
            <IntegrationLogo
              key={integration.slug}
              integration={integration}
              index={index}
            />
          ))}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: pricingFeaturedIntegrations.length * 0.04 }}
          >
            <Link
              to="/integraties"
              className="flex flex-col items-center justify-center gap-2 h-[5.5rem] px-4 bg-[rgb(var(--surface-muted))] rounded-xl border border-border/80 shadow-card hover:shadow-hover transition-all duration-200"
            >
              <span className="font-sans text-2xl font-bold text-primary tracking-tight">+40</span>
            </Link>
          </motion.div>
        </div>

        <p className="text-center text-sm text-muted-foreground max-w-xl mx-auto mb-6">
          Staat jouw tool er niet tussen? Via Maatwerk koppelen we ook andere
          koppelingen op aanvraag.
        </p>

        <div className="text-center mb-20">
          <Button asChild variant="brand">
            <Link to="/integraties">Bekijk alle koppelingen</Link>
          </Button>
        </div>

        <div
          aria-hidden
          className="mx-auto max-w-6xl h-px bg-border/55"
        />
      </div>
    </section>
  );
};
