import { motion } from "framer-motion";
import { Palette, Zap, Globe, Star } from "lucide-react";
import { NexDualLineTitle } from "@/components/ui/nex-typography";

const diensten = [
  {
    icon: Palette,
    title: "Op maat gemaakt",
    description: "Uniek design dat perfect aansluit bij jouw merk en doelgroep.",
    color: "purple",
  },
  {
    icon: Zap,
    title: "Supersnel",
    description: "Geoptimaliseerd voor snelheid. Je website laadt in milliseconden.",
    color: "orange",
  },
  {
    icon: Globe,
    title: "Altijd online",
    description: "99.9% uptime met betrouwbare hosting en SSL inbegrepen.",
    color: "purple",
  },
];

export const Solution = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left - Browser mockup with real preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-[#f5f5f7] rounded-2xl p-3 md:p-4">
              {/* Browser window */}
              <div className="overflow-hidden rounded-2xl border border-[#e8e6e2] bg-white shadow-[0_20px_60px_-32px_rgba(15,23,42,0.18)]">
                {/* Browser header */}
                <div className="flex items-center gap-2 border-b border-[#ebe8e4] bg-[#f8f7f5] px-3 py-2">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#e0ddd8]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#e0ddd8]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#e0ddd8]" />
                  </div>
                  <div className="mx-2 flex-1">
                    <div className="mx-auto flex max-w-[200px] items-center gap-1.5 rounded-lg border border-[#ebe8e4] bg-white px-3 py-1 text-xs text-muted-foreground">
                      <Globe className="h-3 w-3 text-emerald-600" />
                      <span className="truncate">jouwbedrijf.nl</span>
                    </div>
                  </div>
                </div>
                
                {/* Clean website skeleton */}
                <div className="p-5">
                  {/* Navigation skeleton */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className="h-6 w-20 rounded-lg bg-primary" />
                    <div className="flex gap-4">
                      <div className="h-2 w-12 rounded bg-[#eceae6]" />
                      <div className="h-2 w-12 rounded bg-[#eceae6]" />
                      <div className="h-2 w-12 rounded bg-[#eceae6]" />
                    </div>
                  </div>
                  
                  {/* Hero skeleton */}
                  <div className="mb-6 flex gap-6">
                    <div className="flex-1">
                      <div className="mb-2 h-4 w-3/4 rounded bg-foreground/80" />
                      <div className="mb-4 h-4 w-1/2 rounded bg-foreground/80" />
                      <div className="mb-1 h-2 w-full rounded bg-[#eceae6]" />
                      <div className="mb-4 h-2 w-4/5 rounded bg-[#eceae6]" />
                      <div className="h-8 w-24 rounded-xl bg-primary" />
                    </div>
                    <div className="h-24 w-32 rounded-xl border border-[#ebe8e4] bg-gradient-to-br from-primary/20 to-brand-orange/10" />
                  </div>
                  
                  {/* Cards skeleton */}
                  <div className="flex gap-3">
                    <div className="flex-1 rounded-xl border border-[#ebe8e4] bg-[#fafaf9] shadow-block p-3">
                      <div className="mb-2 h-8 w-8 rounded-lg bg-primary/20" />
                      <div className="mb-1 h-2 w-16 rounded bg-[#eceae6]" />
                      <div className="h-1.5 w-full rounded bg-[#eceae6]" />
                    </div>
                    <div className="flex-1 rounded-xl border border-[#ebe8e4] bg-[#fafaf9] shadow-block p-3">
                      <div className="mb-2 h-8 w-8 rounded-lg bg-brand-orange/20" />
                      <div className="mb-1 h-2 w-16 rounded bg-[#eceae6]" />
                      <div className="h-1.5 w-full rounded bg-[#eceae6]" />
                    </div>
                    <div className="flex-1 rounded-xl border border-[#ebe8e4] bg-[#fafaf9] shadow-block p-3">
                      <div className="mb-2 h-8 w-8 rounded-lg bg-primary/20" />
                      <div className="mb-1 h-2 w-16 rounded bg-[#eceae6]" />
                      <div className="h-1.5 w-full rounded bg-[#eceae6]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating review card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -bottom-4 -right-4 hidden rounded-2xl border border-[#e8e6e2] bg-white p-3 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.14)] md:block"
            >
              <div className="flex items-center gap-2 mb-1">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop"
                  alt="Klant"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-semibold">Lisa B.</p>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">"Fantastische website!"</p>
            </motion.div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-6">
              <span className="text-sm font-semibold">Effectief & professioneel</span>
            </div>
            
            <NexDualLineTitle
              sans="Websites die"
              serif={<span className="text-primary">werken</span>}
              align="left"
              className="mb-6"
            />
            <p className="text-lg text-muted-foreground mb-8">
              Geen standaard templates, maar een website die écht bij jouw bedrijf past. 
              Ontworpen om bezoekers om te zetten in klanten.
            </p>

            {/* Mini feature list */}
            <div className="space-y-4">
              {diensten.map((dienst, index) => (
                <motion.div
                  key={dienst.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-soft border border-border/50 hover:shadow-card"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    dienst.color === "orange" ? "bg-orange-100" : "bg-primary/10"
                  }`}>
                    <dienst.icon className={`w-6 h-6 ${
                      dienst.color === "orange" ? "text-orange-500" : "text-primary"
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold">{dienst.title}</h3>
                    <p className="text-sm text-muted-foreground">{dienst.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
