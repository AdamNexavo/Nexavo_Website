import { motion } from "framer-motion";
import { Palette, Zap, Globe, Star } from "lucide-react";

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
              <div className="bg-white rounded-xl shadow-card overflow-hidden">
                {/* Browser header */}
                <div className="bg-gray-100 px-3 py-2 flex items-center gap-2 border-b">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 mx-2">
                    <div className="bg-white rounded px-3 py-1 text-xs text-muted-foreground flex items-center gap-1.5 max-w-[200px] mx-auto border">
                      <Globe className="w-3 h-3 text-green-500" />
                      <span className="truncate">jouwbedrijf.nl</span>
                    </div>
                  </div>
                </div>
                
                {/* Clean website skeleton */}
                <div className="p-5">
                  {/* Navigation skeleton */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-20 h-6 bg-[#6a50ff] rounded"></div>
                    <div className="flex gap-4">
                      <div className="w-12 h-2 bg-gray-200 rounded"></div>
                      <div className="w-12 h-2 bg-gray-200 rounded"></div>
                      <div className="w-12 h-2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  
                  {/* Hero skeleton */}
                  <div className="flex gap-6 mb-6">
                    <div className="flex-1">
                      <div className="w-3/4 h-4 bg-gray-800 rounded mb-2"></div>
                      <div className="w-1/2 h-4 bg-gray-800 rounded mb-4"></div>
                      <div className="w-full h-2 bg-gray-200 rounded mb-1"></div>
                      <div className="w-4/5 h-2 bg-gray-200 rounded mb-4"></div>
                      <div className="w-24 h-8 bg-[#6a50ff] rounded-md"></div>
                    </div>
                    <div className="w-32 h-24 bg-gradient-to-br from-[#6a50ff]/20 to-orange-100 rounded-lg"></div>
                  </div>
                  
                  {/* Cards skeleton */}
                  <div className="flex gap-3">
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <div className="w-8 h-8 bg-[#6a50ff]/20 rounded mb-2"></div>
                      <div className="w-16 h-2 bg-gray-300 rounded mb-1"></div>
                      <div className="w-full h-1.5 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <div className="w-8 h-8 bg-orange-100 rounded mb-2"></div>
                      <div className="w-16 h-2 bg-gray-300 rounded mb-1"></div>
                      <div className="w-full h-1.5 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <div className="w-8 h-8 bg-[#6a50ff]/20 rounded mb-2"></div>
                      <div className="w-16 h-2 bg-gray-300 rounded mb-1"></div>
                      <div className="w-full h-1.5 bg-gray-200 rounded"></div>
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
              className="absolute -right-4 -bottom-4 bg-white rounded-xl shadow-lg p-3 hidden md:block"
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
            <div className="inline-flex items-center gap-2 bg-[#6a50ff]/10 text-[#6a50ff] rounded-full px-4 py-2 mb-6">
              <span className="text-sm font-semibold">Effectief & professioneel</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Websites die{" "}
            <span className="text-[#6a50ff]">werken</span>
            </h2>
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
                  className="flex items-center gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    dienst.color === "orange" ? "bg-orange-100" : "bg-[#6a50ff]/10"
                  }`}>
                    <dienst.icon className={`w-6 h-6 ${
                      dienst.color === "orange" ? "text-orange-500" : "text-[#6a50ff]"
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
