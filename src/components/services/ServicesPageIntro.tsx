import { motion } from "framer-motion";
import { Headset, Layers, Sparkles } from "lucide-react";
import { SectionBadge } from "@/components/ui/nex-ui";
import { SectionBackdrop } from "@/components/backgrounds/section-backdrop";

const highlights = [
  {
    icon: Layers,
    title: "7 diensten",
    description: "Van website tot automatisering, alles onder één dak.",
  },
  {
    icon: Sparkles,
    title: "Op maat ingericht",
    description: "Geen templates. Alles sluit aan op jouw merk en processen.",
  },
  {
    icon: Headset,
    title: "Persoonlijke begeleiding",
    description: "Van demo tot livegang blijf je één aanspreekpunt houden.",
  },
];

export const ServicesPageIntro = () => (
  <section className="relative overflow-hidden border-b border-border/40 bg-[#f8f6f1] py-10 md:py-12">
    <SectionBackdrop surface="subtle" />
    <div className="nex-container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="mb-8 text-center md:mb-10"
      >
        <SectionBadge className="mx-auto mb-4">Waarom Nexavo</SectionBadge>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Kies een dienst hieronder en ontdek wat we concreet voor jouw bedrijf
          kunnen regelen. Alles bouwen we modulair, zodat je later eenvoudig
          kunt uitbreiden.
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.07 }}
            className="rounded-2xl border border-border/50 bg-white/80 p-5 shadow-sm md:p-6"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <item.icon className="h-5 w-5" />
            </div>
            <h3 className="mb-1.5 font-bold text-foreground">{item.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
