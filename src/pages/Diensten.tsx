import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const diensten = [
  {
    title: "Webdesign",
    description: "Professionele websites op maat gemaakt voor jouw bedrijf. Van ontwerp tot oplevering — wij regelen alles.",
    features: [
      "Op maat gemaakt design",
      "Webflow development",
      "Responsive (mobiel-vriendelijk)",
      "SEO-optimalisatie",
      "Hosting inbegrepen",
      "Onderhoud & updates",
    ],
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
  },
  {
    title: "Automatisering",
    description: "Bespaar tijd met slimme systemen. Van online boeken tot automatische review verzoeken.",
    features: [
      "Online bookingsysteem",
      "Review management",
      "Agenda-synchronisatie",
      "Automatische herinneringen",
      "E-mail automatisering",
    ],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
  },
  {
    title: "Content",
    description: "Professionele teksten die je doelgroep aanspreken en goed scoren in Google.",
    features: [
      "Website copywriting",
      "SEO-content",
      "Blog posts",
      "Social media content",
    ],
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop",
  },
];

export default function Diensten() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="py-24 pt-32">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto mb-20"
            >
              <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
                Onze diensten
              </p>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Wat we voor je kunnen{" "}
                <span className="text-[#6a50ff]">betekenen</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Van ontwerp tot onderhoud — wij zorgen voor alles zodat jij kunt focussen op ondernemen.
              </p>
            </motion.div>

            <div className="space-y-24">
              {diensten.map((dienst, index) => (
                <motion.div
                  key={dienst.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? "lg:grid-flow-dense" : ""
                  }`}
                >
                  <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                    <div className="aspect-[4/3] rounded-lg overflow-hidden">
                      <img
                        src={dienst.image}
                        alt={dienst.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-4xl font-bold mb-4">{dienst.title}</h2>
                    <p className="text-lg text-muted-foreground mb-6">{dienst.description}</p>
                    
                    <div className="space-y-3 mb-8">
                      {dienst.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-[#6a50ff]/10 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-[#6a50ff]" />
                          </div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-24 bg-foreground text-white">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Klaar om te starten?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Plan een vrijblijvend gesprek en ontdek wat we voor jou kunnen betekenen.
              </p>
              <Link to="/contact">
                <Button size="lg" className="bg-[#6a50ff] hover:bg-[#5840e0]">
                  Neem contact op
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
