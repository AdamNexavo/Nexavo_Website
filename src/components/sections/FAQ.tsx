import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Hoe snel kan mijn website live?",
    answer: "Afhankelijk van het pakket en de complexiteit is je website binnen 7 dagen live. We houden je gedurende het hele proces op de hoogte.",
  },
  {
    question: "Heb ik technische kennis nodig?",
    answer: "Nee, absoluut niet. Wij regelen alles: van design tot hosting. Jij hoeft alleen content aan te leveren en feedback te geven.",
  },
  {
    question: "Zijn er verborgen kosten?",
    answer: "Nee, al onze pakketten zijn all-inclusive. Hosting, SSL-certificaat, onderhoud en support zitten allemaal in de prijs. Geen verrassingen achteraf.",
  },
  {
    question: "Wat als ik niet tevreden ben?",
    answer: "We werken net zo lang door tot je 100% tevreden bent. In het onwaarschijnlijke geval dat we er niet uitkomen, krijg je je geld terug.",
  },
  {
    question: "Hoe werkt het review management systeem?",
    answer: "24 uur na elke afspraak ontvangen je klanten automatisch een reviewverzoek via e-mail, SMS of WhatsApp. Positieve reviews worden direct gepubliceerd, negatieve feedback kun je eerst intern afhandelen.",
  },
];

export const FAQ = () => {
  return (
    <section className="py-24 bg-[#f5f5f7] relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
            Vragen
          </p>
          <h2 className="text-4xl md:text-5xl font-bold">
            Veelgestelde{" "}
            <span className="text-[#6a50ff]">vragen</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-lg border border-border px-6"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5 text-black">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
