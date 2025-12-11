import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const packages = [
  {
    name: "Starter",
    description: "Perfect om online te starten",
    features: [
      "Professionele website (tot 5 pagina's)",
      "Hosting & SSL inbegrepen",
      "Responsive design",
      "Basis maandelijkse updates",
      "E-mail support",
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    description: "Voor ondernemers die willen groeien",
    features: [
      "Alles van Starter",
      "Online bookingsysteem",
      "Review management",
      "Agenda-synchronisatie",
      "SEO & content updates",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Pro",
    description: "Maximale groei en ondersteuning",
    features: [
      "Alles van Growth",
      "Onbeperkte pagina's",
      "Maandelijkse optimalisaties",
      "Custom automatiseringen",
      "Dedicated account manager",
    ],
    highlighted: false,
  },
];

export const Pricing = () => {
  return (
    <section className="py-24 bg-[#f5f5f7]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
            Pakketten
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Kies het pakket dat bij{" "}
            <span className="text-[#6a50ff]">jou past</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Transparante pakketten zonder verborgen kosten.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-lg p-8 ${
                pkg.highlighted
                  ? "bg-foreground text-white border-2 border-foreground"
                  : "bg-white border border-border"
              }`}
            >
              {pkg.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Populair
                  </span>
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <p className={`text-sm ${pkg.highlighted ? "text-white/70" : "text-muted-foreground"}`}>
                  {pkg.description}
                </p>
              </div>
              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 mt-0.5 ${pkg.highlighted ? "text-[#6a50ff]" : "text-[#6a50ff]"}`} />
                    <span className={`text-sm ${pkg.highlighted ? "text-white/90" : "text-muted-foreground"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link to="/contact">
                <Button
                  variant={pkg.highlighted ? "secondary" : "default"}
                  className={`w-full ${pkg.highlighted ? "bg-white text-foreground hover:bg-white/90" : ""}`}
                >
                  Neem contact op
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
