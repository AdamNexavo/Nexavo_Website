import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target, Smartphone, Shield, Users } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const features = [
  {
    icon: Target,
    title: "Conversiegericht",
    description: "Elke pagina is ontworpen om bezoekers om te zetten in klanten.",
    color: "purple",
  },
  {
    icon: Smartphone,
    title: "Mobiel perfect",
    description: "Responsive design dat er op elk apparaat fantastisch uitziet.",
    color: "orange",
  },
  {
    icon: Shield,
    title: "Veilig & betrouwbaar",
    description: "SSL certificaat, regelmatige backups en 24/7 monitoring.",
    color: "purple",
  },
  {
    icon: Users,
    title: "Persoonlijke service",
    description: "Direct contact met ons team, geen chatbots of wachttijden.",
    color: "orange",
  },
];

const stats = [
  { value: 65, suffix: "+", label: "Projecten" },
  { value: 7, suffix: " dagen", label: "Levertijd" },
  { value: 100, suffix: "%", label: "Tevreden" },
];

// Animated counter component
const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

export const Benefits = () => {
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
          {/* Section badge */}
          <div className="inline-flex items-center gap-2 bg-white text-[#6a50ff] rounded-full px-4 py-2 mb-6 shadow-soft">
            <span className="text-sm font-semibold">Ervaar het verschil</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Waarom kiezen voor{" "}
            <span className="text-[#6a50ff]">Nexavo</span>?
          </h2>
          <p className="text-lg text-muted-foreground">
            Professioneel en toch persoonlijk. Ontdek waarom ondernemers voor ons kiezen.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-soft border border-border/50 hover:shadow-card transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                feature.color === "orange" ? "bg-orange-100" : "bg-[#6a50ff]/10"
              }`}>
                <feature.icon className={`w-6 h-6 ${
                  feature.color === "orange" ? "text-orange-500" : "text-[#6a50ff]"
                }`} />
              </div>
              <h3 className="font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats with animated counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-12 mb-12"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-5xl font-extrabold mb-2 text-[#6a50ff]">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="text-xl font-bold mb-4">Ervaar het verschil zelf</h3>
          <p className="text-muted-foreground mb-6">
            Sluit je aan bij tientallen tevreden ondernemers die al zijn overgestapt
          </p>
          <Link to="/contact">
            <Button size="lg">
              Neem contact op
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
// Test auto backup 19:58:23
