import { motion } from "framer-motion";
import { ArrowDownRight, Grid2X2, Plug, Search } from "lucide-react";
import { SectionLines } from "@/components/backgrounds/section-lines";
import { SectionBadge } from "@/components/ui/nex-ui";

const categoryPreview = [
  "Agenda & boekingen",
  "Betalingen",
  "Analytics & reviews",
  "Automatisering",
];

export const IntegrationsIntro = () => (
  <section className="relative overflow-hidden border-y border-border/50 bg-[#f8f6f1] py-10 md:py-12">
    <SectionLines opacity="subtle" />
    <div className="nex-container relative z-10">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <SectionBadge className="mb-4">Categorieën & koppelingen</SectionBadge>
          <h2 className="mb-3 font-sans text-2xl font-bold tracking-[-0.03em] text-foreground md:text-3xl">
            Koppelingen die je workflow compleet maken
          </h2>
          <p className="max-w-xl leading-relaxed text-muted-foreground">
            Van agenda en betalingen tot analytics, formulieren en automatisering:
            koppelingen zorgen dat je website samenwerkt met de tools die je al
            gebruikt. Hieronder kun je gericht per categorie zoeken of het volledige
            overzicht bekijken.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mx-auto w-full max-w-md rounded-[1.5rem] border border-[#e8e6e2] bg-white p-3 shadow-sm"
        >
          <div className="grid gap-3 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-[#ebe8e4] bg-white p-3">
              <div className="mb-3 flex items-center gap-2">
                <Grid2X2 className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Categorieën
                </p>
              </div>
              <div className="space-y-2">
                {categoryPreview.map((category, index) => (
                  <div
                    key={category}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
                      index === 0
                        ? "bg-[#e4e4e7] text-foreground"
                        : "bg-[#f0f0f1] text-foreground/80"
                    }`}
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#ebe8e4] bg-[#0f172a] p-3 text-white">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#d4d4d8]">
                    Alle koppelingen
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    Scrollbaar overzicht
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f0f0f1]">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex h-9 items-center justify-center rounded-xl bg-[#ececee]"
                  >
                    <Plug className="h-4 w-4 text-muted-foreground/70" />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#d4d4d8]">
                <ArrowDownRight className="h-4 w-4 text-white" />
                Direct onder deze sectie
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);
