import { motion } from "framer-motion";
import { serviceRows } from "@/data/services";
import { ServiceCatalogCard } from "@/components/services/ServiceCatalogCard";
import { SectionBackdrop } from "@/components/backgrounds/section-backdrop";
import { getServiceCatalogVariant } from "@/lib/serviceCatalogVisual";
import { cn } from "@/lib/utils";

export const ServicesCatalog = () => {
  return (
    <section className="relative overflow-hidden bg-background py-14 md:py-20 nex-hairline-b">
      <SectionBackdrop surface="dots-grid" />
      <div className="nex-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center md:mb-12"
        >
          <h2 className="nex-section-title mb-3 text-foreground">
            Ontdek alle mogelijkheden
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground leading-relaxed">
            Klik op een dienst voor het volledige overzicht, werkwijze en
            pakketadvies.
          </p>
        </motion.div>

        <div className="space-y-4 md:space-y-5">
          {serviceRows.map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: rowIndex * 0.08 }}
              className={cn(
                "grid gap-4 md:gap-5",
                row.layout === "triple"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : row.columns ?? "md:grid-cols-2",
              )}
            >
              {row.services.map((service) => (
                <ServiceCatalogCard
                  key={service.slug}
                  service={service}
                  variant={getServiceCatalogVariant(service.slug)}
                />
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
