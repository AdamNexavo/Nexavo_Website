import { motion } from "framer-motion";
import { TypingText } from "@/components/TypingText";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Paintbrush, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Phone,
    title: "Kennismaken",
    description: "We bespreken je wensen, doelen en ideeën in een vrijblijvend gesprek.",
    color: "purple",
  },
  {
    number: "02",
    icon: Paintbrush,
    title: "Ontwerp & bouw",
    description: "Wij gaan aan de slag en houden je op de hoogte van de voortgang.",
    color: "purple",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Livegang",
    description: "Je website gaat live en je bent klaar om te groeien. Wij blijven ondersteunen.",
    color: "purple",
  },
];

export const Process = () => {
  return (
    <section className="py-24 bg-white relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">Zo simpel is het</p>
          <TypingText className="text-4xl md:text-5xl font-extrabold mb-6">
            Van idee tot{" "}
            <span className="text-[#6a50ff]">realisatie</span>{" "}
            in 3 stappen
          </TypingText>
          <p className="text-lg text-muted-foreground">
            Bij Nexavo nemen we je alle zorgen uit handen. Jij focust op ondernemen.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#6a50ff]/30 to-transparent" />
              )}
              
              {/* Number badge */}
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-white text-sm font-bold mb-6 ${
                step.color === "orange" ? "bg-orange-500" : "bg-[#6a50ff]"
              }`}>
                {step.number}
              </div>
              
              {/* Icon */}
              <div className="w-20 h-20 rounded-3xl bg-white shadow-card border border-border/50 flex items-center justify-center mx-auto mb-6">
                <step.icon className={`w-10 h-10 ${
                  step.color === "orange" ? "text-orange-500" : "text-[#6a50ff]"
                }`} />
              </div>
              
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto bg-white rounded-3xl p-8 text-center shadow-card border border-border/50"
        >
          <h3 className="text-xl font-bold mb-3">Klaar om te beginnen?</h3>
          <p className="text-muted-foreground mb-6">
            Sluit je aan bij tientallen tevreden ondernemers die al zijn overgestapt naar Nexavo.
          </p>
          <Link to="/contact">
            <Button size="lg">
              Start nu
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">Vrijblijvend kennismakingsgesprek</p>
        </motion.div>
      </div>
    </section>
  );
};
