import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const projecten = [
  {
    title: "Yoga Studio Amsterdam",
    category: "Website + Bookingsysteem",
    description: "Complete website met online boekingen voor een yoga studio in Amsterdam.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
  },
  {
    title: "Business Coach Rotterdam",
    category: "Website + Content",
    description: "Professionele website met lead generation voor een business coach.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
  },
  {
    title: "Schoonheidssalon Utrecht",
    category: "Website + Automatisering",
    description: "Moderne website met online boekingen en review management.",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop",
  },
  {
    title: "Personal Trainer Den Haag",
    category: "Website + Bookingsysteem",
    description: "Dynamische website met abonnementenbeheer en planning.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
  },
  {
    title: "Therapeut Eindhoven",
    category: "Website",
    description: "Rustige, professionele website met focus op vertrouwen.",
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=600&fit=crop",
  },
  {
    title: "Consultancy Bureau Arnhem",
    category: "Website + Content",
    description: "Corporate website met case studies en thought leadership.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
  },
];

export default function Projecten() {
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
                Ons werk
              </p>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Projecten waar we{" "}
                <span className="text-[#6a50ff]">trots</span> op zijn
              </h1>
              <p className="text-lg text-muted-foreground">
                Bekijk een selectie van websites die we hebben gemaakt voor ondernemers zoals jij.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projecten.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-sm text-[#6a50ff] font-medium mb-1">{project.category}</p>
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm">{project.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-24 bg-secondary/50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Jouw project kan hier staan
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Plan een vrijblijvend gesprek en ontdek wat we voor jou kunnen betekenen.
              </p>
              <Link to="/contact">
                <Button size="lg">
                  Start een project
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
