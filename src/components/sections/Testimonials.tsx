import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { NexSection, SectionBadge } from "@/components/ui/nex-ui";
import { NexDualLineTitle } from "@/components/ui/nex-typography";
import { cn } from "@/lib/utils";

const testimonialCardClass =
  "bg-white border-[#e8e6e2] border-l-[3px] border-l-primary";

const testimonials = [
  {
    name: "Femke Kuipers",
    role: "Yogastudio, Haarlem",
    content:
      "Sinds de nieuwe website krijg ik veel meer boekingen binnen. Het systeem werkt soepel en ik hoef veel minder heen en weer te appen.",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&auto=format&q=80",
    rating: 5,
  },
  {
    name: "Jeroen Dekker",
    role: "Businesscoach, Eindhoven",
    content:
      "Eindelijk een site die professioneel oogt en ook echt voor me werkt. Snel opgeleverd en goede begeleiding tijdens het traject.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format&q=80",
    rating: 5,
  },
  {
    name: "Marloes Peeters",
    role: "Nagelstudio, Breda",
    content:
      "Klanten boeken nu zelf online en de reviewverzoeken lopen automatisch. Scheelt me elke week een hoop tijd.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&auto=format&q=80",
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <NexSection surface="white" divider>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="-mt-2 md:-mt-4"
        >
          <SectionBadge className="mb-6">Klanten aan het woord</SectionBadge>
          <NexDualLineTitle
            sans="Wat ondernemers"
            serif="zeggen"
            align="left"
            className="mb-6"
          />
          <p className="nex-body-lg mb-8">
            Meer dan 50 ondernemers gingen je voor. Dit is wat ze te zeggen hebben.
          </p>

          <div className="flex items-center gap-8">
            <div>
              <div className="mb-1 flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">5.0 gemiddeld</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <p className="text-2xl font-semibold tracking-tight">65+</p>
              <p className="text-sm text-muted-foreground">Tevreden klanten</p>
            </div>
          </div>
        </motion.div>

        <div className="relative overflow-visible pr-4 sm:pr-8 md:pr-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.12 }}
              className={cn(
                "relative rounded-xl border p-4 shadow-card",
                testimonialCardClass,
                index > 0 && "-mt-3",
              )}
              style={{
                marginLeft: index * 24,
                zIndex: index + 1,
              }}
            >
              <div className="flex items-start gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-yellow-400 text-yellow-400"
                          strokeWidth={0}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mb-1.5 text-xs text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm leading-snug text-foreground/90">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </NexSection>
  );
};
