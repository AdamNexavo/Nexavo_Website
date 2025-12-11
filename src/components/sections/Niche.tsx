import { motion } from "framer-motion";
import { Users, Briefcase, Scissors, Dumbbell, Heart, Building } from "lucide-react";

const niches = [
  { 
    icon: Users, 
    label: "Coaches & Consultants",
    challenge: "Veel boekingen, weinig tijd voor administratie",
    solution: "Automatisch bookingsysteem en reviewverzameling",
    benefit: "Meer tijd voor je klanten, meer reviews, meer groei"
  },
  { 
    icon: Scissors, 
    label: "Salons",
    challenge: "Klanten willen online boeken en reviews achterlaten",
    solution: "24/7 boekingen en automatische reviewverzoeken",
    benefit: "Meer boekingen, betere reviews, minder telefoontjes"
  },
  { 
    icon: Dumbbell, 
    label: "Personal Trainers",
    challenge: "Behoud van klanten en nieuwe aanmeldingen",
    solution: "Online boekingen en reviewsysteem voor vertrouwen",
    benefit: "Meer aanmeldingen, betere klantretentie"
  },
  { 
    icon: Heart, 
    label: "Therapeuten",
    challenge: "Professionele uitstraling en vertrouwen opbouwen",
    solution: "Moderne website met reviews en boekingssysteem",
    benefit: "Meer vertrouwen, meer aanmeldingen, betere conversie"
  },
  { 
    icon: Building, 
    label: "Dienstverlenend MKB",
    challenge: "Alles op één plek: website, boekingen, reviews",
    solution: "Complete oplossing met alle systemen geïntegreerd",
    benefit: "Eén platform voor alles, meer efficiëntie en groei"
  },
];

export const Niche = () => {
  return (
    <section className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Voor wie?
          </span>
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Perfect voor{" "}
            <span className="text-gradient">dienstverlenende ondernemers</span>
          </motion.h2>
          <p className="text-lg text-muted-foreground">
            Nexavo is speciaal ontwikkeld voor ondernemers die veel bookings hebben, 
            reviews willen verzamelen en automatisering nodig hebben.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {niches.map((niche, index) => (
            <motion.div
              key={niche.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-hover transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                <niche.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{niche.label}</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground font-medium mb-1">Uitdaging:</p>
                  <p className="text-foreground">{niche.challenge}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium mb-1">Oplossing:</p>
                  <p className="text-foreground">{niche.solution}</p>
                </div>
                <div>
                  <p className="text-primary font-medium mb-1">Voordeel:</p>
                  <p className="text-foreground">{niche.benefit}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
