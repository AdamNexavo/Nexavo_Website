import { motion } from "framer-motion";
import { NexDualLineTitle } from "@/components/ui/nex-typography";
import { Check, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DenseGridBackground } from "@/components/backgrounds/dense-grid-background";
import { SectionLines } from "@/components/backgrounds/section-lines";
import { MaintenanceCard, SectionBadge, nexIntegrationCardClass } from "@/components/ui/nex-ui";
import {
  maintenancePackages,
  revisionExamples,
} from "@/data/maintenance";

export const PricingMaintenance = () => {
  return (
    <section className="nex-section nex-surface-muted relative overflow-hidden nex-hairline-b">
      <SectionLines opacity="strong" />
      <DenseGridBackground />
      <div className="nex-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <SectionBadge className="mx-auto">Onderhoud & support</SectionBadge>
          <NexDualLineTitle
            sans="Maandelijks beheer"
            serif="na oplevering"
            className="mb-4"
          />
          <p className="nex-body-lg mx-auto mb-3">
            Drie onderhoudspakketten voor hosting, support en kleine
            wijzigingen. Een revisie is een kleine wijziging aan iets wat al
            bestaat.
          </p>
          <p className="nex-body-sm mx-auto">
            Alles wat nieuw gebouwd, ontworpen of technisch gekoppeld moet
            worden, valt onder meerwerk.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto mb-16">
          {maintenancePackages.map((pkg, index) => (
            <MaintenanceCard
              key={pkg.id}
              index={index}
              name={pkg.name}
              price={pkg.price}
              priceNote={pkg.priceNote}
              description={pkg.description}
              highlights={pkg.highlights}
              features={pkg.features}
              highlighted={pkg.highlighted}
              badge={pkg.badge}
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-5 max-w-6xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="nex-card-shadow rounded-xl bg-white p-6 md:p-8"
          >
            <h3 className="nex-card-title mb-4">Wat valt onder revisies?</h3>
            <ul className="space-y-2.5">
              {revisionExamples.included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="nex-card-shadow rounded-xl bg-white p-6 md:p-8"
          >
            <h3 className="nex-card-title mb-4">Wat valt buiten revisies?</h3>
            <ul className="space-y-2.5">
              {revisionExamples.notIncluded.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <X className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground/50" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-center mt-10"
        >
          <Link to="/contact">
            <Button variant="brand" className="group">
              Vraag advies over onderhoud
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
