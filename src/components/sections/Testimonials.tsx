import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Lisa van der Berg",
    role: "Yoga Instructor",
    content: "Sinds de nieuwe website ontvang ik veel meer boekingen. Het bookingsysteem werkt fantastisch en bespaart me zoveel tijd!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    rating: 5,
  },
  {
    name: "Mark Jansen",
    role: "Business Coach",
    content: "Eindelijk een website die voor mij werkt. Professioneel, snel en altijd up-to-date. De persoonlijke begeleiding is top.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    rating: 5,
  },
  {
    name: "Sophie de Vries",
    role: "Schoonheidssalon",
    content: "Mijn klanten zijn enthousiast over het online boeken. Ik bespaar uren per week en de reviews komen automatisch binnen.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-[#f5f5f7] relative">
      {/* Diagonal divider top */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden">
        <svg className="w-full h-16" preserveAspectRatio="none" viewBox="0 0 1440 64">
          <path fill="white" d="M0,0 L1440,64 L1440,0 L0,0 Z"></path>
        </svg>
      </div>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Header & Featured */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
              Klanten aan het woord
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              Wat ondernemers{" "}
              <span className="text-[#6a50ff]">zeggen</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Meer dan 50 ondernemers gingen je voor. Dit is wat ze te zeggen hebben.
            </p>
            
            {/* Stats */}
            <div className="flex items-center gap-8">
              <div>
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">5.0 gemiddeld</p>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div>
                <p className="text-2xl font-bold">65+</p>
                <p className="text-sm text-muted-foreground">Tevreden klanten</p>
              </div>
            </div>
          </motion.div>

          {/* Right side - Stacked testimonials */}
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`bg-white rounded-2xl p-6 shadow-card border border-border/50 ${
                  index === 0 ? "" : "-mt-4"
                }`}
                style={{
                  marginLeft: index * 16,
                  position: "relative",
                  zIndex: testimonials.length - index,
                }}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{testimonial.name}</p>
                      <div className="flex gap-0.5">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{testimonial.role}</p>
                    <p className="text-foreground text-sm leading-relaxed">
                      "{testimonial.content}"
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
