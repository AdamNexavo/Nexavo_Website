import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { NexDualLineTitle } from "@/components/ui/nex-typography";
import { SectionLines } from "@/components/backgrounds/section-lines";

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
    <section className="relative overflow-hidden py-24 bg-[#f5f5f7]">
      <SectionLines />
      <div className="container relative z-10">
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
            <NexDualLineTitle
              sans="Alles wat je nodig hebt voor"
              serif={<span className="text-primary">online succes</span>}
              align="left"
              className="mb-6"
            />
            <p className="text-lg text-muted-foreground mb-8">
              Bij elk project leveren we een compleet pakket. Geen losse kosten, 
              geen verrassingen. Gewoon alles wat je nodig hebt om online te groeien.
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
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
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
