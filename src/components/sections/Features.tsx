import { motion } from "framer-motion";
import { Check } from "lucide-react";

const features = [
  "Op maat gemaakt webdesign",
  "Hosting & SSL inbegrepen",
  "Online bookingsysteem",
  "Review management",
  "Maandelijkse optimalisaties",
  "SEO & vindbaarheid",
  "Responsive design",
  "Persoonlijke begeleiding",
];

export const Features = () => {
  return (
    <section className="py-24 bg-[#f5f5f7]">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                alt="Team aan het werk"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
              Wat je krijgt
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Alles wat je nodig hebt voor{" "}
              <span className="text-[#6a50ff]">online succes</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Bij elk project leveren we een compleet pakket. Geen losse kosten, 
              geen verrassingen — gewoon alles wat je nodig hebt om online te groeien.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-[#6a50ff]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#6a50ff]" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
