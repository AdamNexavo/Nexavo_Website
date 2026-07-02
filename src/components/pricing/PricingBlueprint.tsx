import { motion } from "framer-motion";
import { MessageCircle, Palette, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FeatureCheck, SectionBadge } from "@/components/ui/nex-ui";
import { NexSectionHeading } from "@/components/ui/nex-typography";
import { SectionLines } from "@/components/backgrounds/section-lines";

const approachSteps = [
  {
    icon: MessageCircle,
    title: "Demo en persoonlijk advies",
    description:
      "We bespreken je doelen, situatie en wensen. Jij deelt je plannen, wij denken direct mee over de beste aanpak.",
  },
  {
    icon: Palette,
    title: "Ontwerp en realisatie",
    description:
      "Nexavo bouwt je website en richt automatiseringen in. Jij hoeft niet technisch te zijn, wij regelen het traject.",
  },
  {
    icon: Rocket,
    title: "Oplevering en begeleiding",
    description:
      "We lanceren samen, stellen alles goed in en blijven beschikbaar via onderhoud en support.",
  },
];

const approachTopics = [
  "Logo, huisstijl en uitstraling",
  "Pagina's, content en doelgroep",
  "Google Maps en Calendly koppelingen",
  "Boekingen en reviewflows",
  "Formulieren en klantcontact",
  "Automatiseringen en koppelingen",
];

export const PricingBlueprint = () => {
  return (
    <section className="nex-section nex-surface-subtle relative overflow-hidden nex-hairline-b">
      <SectionLines />
      <div className="nex-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionBadge>Onze werkwijze</SectionBadge>

            <NexSectionHeading
              line1="Eerst begrijpen,"
              line2="daarna bouwen"
              line2Serif
              line2Purple
              align="left"
              className="mb-6"
            />

            <p className="nex-section-intro mb-8">
              We starten met een demo en persoonlijk advies, zodat we precies
              weten wat jouw bedrijf nodig heeft. Daarna nemen wij het bouwen,
              inrichten en opleveren uit handen. Jij houdt regie, Nexavo doet
              het werk.
            </p>

            <p className="text-sm text-muted-foreground mb-8">
              In het startgesprek brengen we samen in kaart wat er nodig is.
              Daarna vertalen wij dat naar een professionele oplossing die bij
              jou past.
            </p>

            <ul className="mb-8 grid gap-1 sm:grid-cols-2">
              {approachTopics.map((item) => (
                <FeatureCheck key={item} variant="purple">
                  {item}
                </FeatureCheck>
              ))}
            </ul>

            <Link to="/contact">
              <Button>Plan demo</Button>
            </Link>
          </motion.div>

          <div className="space-y-4">
            {approachSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="flex gap-5 border-border/40 bg-[#f8f6f1] p-6 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-center gap-3">
                      <span className="text-xs font-bold tabular-nums text-muted-foreground">
                        {index + 1}.
                      </span>
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
