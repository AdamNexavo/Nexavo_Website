import { useState } from "react";
import { motion } from "framer-motion";
import {
  integrationCategories,
  integrations,
  getIntegrationsByCategory,
  getCategoryLabel,
  type IntegrationCategoryId,
} from "@/data/integrations";
import { IntegrationAppCard } from "./IntegrationAppCard";
import { DenseGridBackground } from "@/components/backgrounds/dense-grid-background";
import { SectionLines } from "@/components/backgrounds/section-lines";
import { SectionBadge } from "@/components/ui/nex-ui";
import { cn } from "@/lib/utils";

export const IntegrationsCatalog = () => {
  const [activeCategory, setActiveCategory] =
    useState<IntegrationCategoryId>("agenda");

  const visibleIntegrations = getIntegrationsByCategory(activeCategory);

  return (
    <section
      id="integraties-catalogus"
      className="nex-section relative overflow-hidden bg-card nex-hairline-b scroll-mt-28"
    >
      <SectionLines opacity="subtle" />
      <DenseGridBackground />
      <div className="nex-container relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          <aside className="lg:w-56 shrink-0">
            <SectionBadge className="mb-4 !mt-0">Categorieën</SectionBadge>
            <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
              {integrationCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                    activeCategory === category.id
                      ? "bg-[#f5f5f7] text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-[#f5f5f7]/60",
                  )}
                >
                  {category.label}
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1 min-w-0">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <SectionBadge className="mb-6 !mt-0">{getCategoryLabel(activeCategory)}</SectionBadge>
              <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
                {visibleIntegrations.map((integration) => (
                  <IntegrationAppCard
                    key={integration.slug}
                    integration={integration}
                  />
                ))}
              </div>
            </motion.div>

            <p className="mt-10 text-sm text-muted-foreground max-w-xl">
              Staat jouw tool er niet tussen? Via Maatwerk koppelen we ook andere
              koppelingen op aanvraag. Nexavo ondersteunt in totaal meer dan 50
              koppelingen.
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-border/40 pt-8">
          <div className="mb-6">
            <div>
              <SectionBadge className="mb-4 !mt-0">Alle koppelingen</SectionBadge>
              <h2 className="font-sans text-2xl font-bold tracking-[-0.03em] text-foreground">
                Scroll door alle beschikbare tools
              </h2>
            </div>
          </div>

          <div className="relative rounded-[1.5rem] border border-border/50 bg-white p-3 shadow-sm">
            <div className="max-h-[520px] overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:hsl(var(--border))_transparent] lg:max-h-[456px]">
              <div className="grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
                {integrations.map((integration) => (
                  <IntegrationAppCard
                    key={`all-${integration.slug}`}
                    integration={integration}
                    compact
                  />
                ))}
              </div>
            </div>
            <div
              className="pointer-events-none absolute inset-x-3 bottom-3 h-16 rounded-b-[1.25rem] bg-gradient-to-t from-white to-transparent"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
};
