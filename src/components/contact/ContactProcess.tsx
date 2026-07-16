import { motion } from "framer-motion";
import { CalendarCheck, MessageSquareText, Rocket } from "lucide-react";
import { SectionLines } from "@/components/backgrounds/section-lines";
import { NexDualLineTitle } from "@/components/ui/nex-typography";
import { SectionBadge } from "@/components/ui/nex-ui";

const steps = [
  {
    number: "01",
    icon: MessageSquareText,
    title: "Je bericht komt binnen",
    description:
      "We lezen je aanvraag en bepalen wie het beste kan helpen: sales, project of support.",
  },
  {
    number: "02",
    icon: CalendarCheck,
    title: "Korte afstemming",
    description:
      "We nemen contact op met gerichte vragen of plannen direct een demo of belafspraak in.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Concreet vervolg",
    description:
      "Je ontvangt een helder voorstel, planning of vervolgstap. Zonder verrassingen achteraf.",
  },
];

export const ContactProcess = () => (
  <section className="relative overflow-hidden bg-[#f5f5f7] py-16 md:py-24">
    <SectionLines opacity="subtle" />
    <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-primary/[0.06] blur-3xl" />
    <div className="pointer-events-none absolute -right-24 bottom-16 h-64 w-64 rounded-full bg-brand-orange/10 blur-3xl" />

    <div className="nex-container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-12 max-w-2xl text-center md:mb-16"
      >
        <SectionBadge className="mx-auto mb-4">Zo werkt het</SectionBadge>
        <NexDualLineTitle
          sans="Van bericht tot"
          serif={<span className="text-primary">volgende stap</span>}
          className="mb-5"
        />
        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
          Geen eindeloze mailwisselingen. We houden het kort, duidelijk en persoonlijk.
        </p>
      </motion.div>

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="relative rounded-[1.5rem] border border-border/50 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Stap {step.number}
              </span>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="h-5 w-5" />
              </div>
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">{step.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
