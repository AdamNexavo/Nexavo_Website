import { motion } from "framer-motion";
import { NexDualLineTitle } from "@/components/ui/nex-typography";
import { HelpCircle, ArrowUpRight, Building2, Rocket } from "lucide-react";
import { SectionLines } from "@/components/backgrounds/section-lines";

const guideSteps = [
  {
    icon: HelpCircle,
    title: "Bepaal je doel",
    description:
      "Wil je één sterke pagina, een complete basiswebsite, meer aanvragen automatiseren of alles combineren met AI?",
    color: "purple" as const,
  },
  {
    icon: Building2,
    title: "Kijk naar je situatie",
    description:
      "Aantal pagina's, koppelingen en locaties bepalen welk pakket het beste aansluit.",
    color: "orange" as const,
  },
  {
    icon: Rocket,
    title: "Plan een demo",
    description:
      "Twijfel je tussen twee pakketten? In een kort gesprek kijken we samen wat het beste past.",
    color: "purple" as const,
  },
];

export const PricingGuide = () => {
  return (
    <section className="relative overflow-hidden py-24 nex-surface-muted nex-hairline-b">
      <SectionLines opacity="strong" />
      <div className="nex-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white text-primary rounded-full px-4 py-2 mb-6 shadow-soft">
            <span className="text-sm font-semibold">Keuzehulp</span>
          </div>
          <NexDualLineTitle
            sans="Zo kies je"
            serif={
              <>
                het <span className="text-primary">juiste pakket</span>
              </>
            }
            className="mb-4"
          />
          <p className="text-muted-foreground">
            Drie simpele stappen om te bepalen welke oplossing bij jouw bedrijf
            hoort.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {guideSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative bg-white rounded-2xl p-6 shadow-soft border border-border/50"
            >
              <div className="absolute top-4 right-4 text-muted-foreground/30">
                <ArrowUpRight className="w-5 h-5" />
              </div>

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  step.color === "orange"
                    ? "bg-orange-100"
                    : "bg-primary/10"
                }`}
              >
                <step.icon
                  className={`w-6 h-6 ${
                    step.color === "orange"
                      ? "text-orange-500"
                      : "text-primary"
                  }`}
                />
              </div>

              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Stap {index + 1}
              </span>
              <h3 className="font-bold text-lg mt-1 mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
