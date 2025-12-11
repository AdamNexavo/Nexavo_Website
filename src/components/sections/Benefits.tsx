import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target, Smartphone, Shield, Sparkles, Users, Heart, Droplet, Zap } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { TypingText } from "@/components/TypingText";

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
    icon: Sparkles,
    title: "AI geoptimaliseerd",
    description: "Geavanceerde AI-technologie voor optimale prestaties en gebruikerservaring.",
    color: "orange",
  },
];

const stats = [
  { value: 65, suffix: "+", label: "Projecten", icon: Target },
  { value: 7, suffix: " dagen", label: "Levertijd", icon: Zap },
  { value: 100, suffix: "%", label: "Tevreden", icon: Heart },
  { value: 24, suffix: "/7", label: "Support", icon: Users },
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
    <section className="py-24 bg-[#f5f5f7] relative">
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
          
          <TypingText className="text-4xl md:text-5xl font-extrabold mb-6">
            Waarom kiezen voor{" "}
            <span className="text-[#6a50ff]">Nexavo</span>?
          </TypingText>
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
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { type: "spring", stiffness: 400, damping: 17 }
              }}
              className="bg-white rounded-2xl p-6 shadow-soft border border-border/50 hover:shadow-card"
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

        {/* Combined Stats & CTA Section - Split Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 lg:p-16 shadow-soft">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
              {/* Left Side - Content & CTA */}
              <div className="flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="space-y-3"
                >
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
                    Resultaten waarop je kunt bouwen.
                  </h3>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    We nemen het denkwerk uit handen en bouwen een website die jouw bedrijf vooruithelpt.
                  </p>
                  <div className="pt-4">
                    <Link to="/contact">
                      <Button>Get in Touch</Button>
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Right Side - Stats Grid */}
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {stats.map((stat, index) => {
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex flex-col items-start gap-4">
                        <div className="w-12 h-1 bg-orange-500 rounded-full"></div>
                        <div>
                          <p className="text-3xl md:text-4xl font-extrabold text-foreground mb-1">
                            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {stat.label}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};