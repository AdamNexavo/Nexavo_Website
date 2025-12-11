import { motion } from "framer-motion";
import { XCircle, AlertTriangle } from "lucide-react";
import { TypingText } from "@/components/TypingText";

const existingWebsite = [
  "Verouderd design dat niet meer converteert",
  "Trage laadtijden en slechte performance",
  "Slechte SEO en lage vindbaarheid",
  "Geen automatiseringen of integraties",
  "Afhankelijk van dure developers",
  "Trage support bij problemen",
  "Constante technische issues",
];

const noWebsite = [
  "Geen online zichtbaarheid",
  "Volledig afhankelijk van social media",
  "Onprofessionele uitstraling",
  "Geen bookingsysteem voor klanten",
  "Geen centrale info-hub",
  "Geen reviewsysteem",
  "Geen startpunt voor marketing",
];

export const PainPoints = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <TypingText className="text-3xl md:text-4xl font-bold mb-4">
            Herken jij dit?
          </TypingText>
          <p className="text-lg text-muted-foreground">
            Of je nu een verouderde website hebt of helemaal geen website — 
            je loopt omzet en kansen mis.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Existing Website Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-background rounded-2xl p-8 shadow-card border border-border/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold">Bestaande website?</h3>
            </div>
            <ul className="space-y-4">
              {existingWebsite.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive/60 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* No Website Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-background rounded-2xl p-8 shadow-card border border-border/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold">Geen website?</h3>
            </div>
            <ul className="space-y-4">
              {noWebsite.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500/60 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
