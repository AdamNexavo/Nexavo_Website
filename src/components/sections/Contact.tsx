import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Aanvraag verzonden!",
      description: "We nemen zo snel mogelijk contact met je op.",
    });
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section className="py-16 md:py-24 bg-[#f5f5f7]">
      <div className="container relative">
        {/* Image positioned absolutely to overlay outside form block border, above background */}
        <div className="absolute left-16 md:left-24 lg:left-32 top-28 -translate-y-1/2 z-30">
          <div className="relative">
            <div className="absolute inset-0" style={{ filter: 'drop-shadow(rgba(0, 0, 0, 0.2) 0px 10px 20px)', maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)', pointerEvents: 'none' }}></div>
            <img
              src="/person.png"
              alt=""
              className="w-[380px] h-auto object-contain relative z-10"
            />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#6a50ff] to-transparent pointer-events-none z-20"></div>
          </div>
        </div>

        {/* Block container */}
        <div className="relative rounded-3xl overflow-hidden min-h-[600px]">
          {/* Purple background */}
          <div className="absolute inset-0 bg-[#6a50ff] rounded-3xl"></div>
          
          {/* Curved arc shape on the right */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2">
            <svg 
              className="absolute right-0 top-0 h-full"
              viewBox="0 0 400 700" 
              preserveAspectRatio="none"
              style={{ height: '100%', width: 'auto', minWidth: '300px' }}
            >
              <path 
                d="M400,0 L400,700 L100,700 C250,550 250,150 100,0 Z" 
                fill="#5842d9"
              />
            </svg>
          </div>

          <div className="relative z-10 p-8 md:p-12 lg:p-16 h-full">

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left side - Text */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative flex flex-col"
              >
                {/* Text content */}
                <div className="mt-auto pt-28 md:pt-32">
                  <h2 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight text-white">
                    Plan een{" "}
                    <span className="text-orange-500">gratis demo</span>
                  </h2>
                  <p className="text-white/90 max-w-md leading-relaxed text-base md:text-lg">
                    Krijg een persoonlijke rondleiding door onze applicatie en ontdek de wereld van plangemak.
                  </p>
                </div>
              </motion.div>

              {/* Right side - Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative z-10"
              >
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl">
                  <h3 className="text-lg md:text-xl font-bold mb-6 text-gray-900">
                    Maak virtueel kennis. Plan een afspraak.
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="relative">
                      <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Voor- en achternaam"
                        required
                        className="w-full h-14 pl-12 pr-4 bg-[#f5f5f7] rounded-lg border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#6a50ff]/20"
                      />
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Email adres"
                        required
                        className="w-full h-14 pl-12 pr-4 bg-[#f5f5f7] rounded-lg border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#6a50ff]/20"
                      />
                    </div>

                    {/* Phone */}
                    <div className="relative">
                      <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Telefoonnummer"
                        required
                        className="w-full h-14 pl-12 pr-4 bg-[#f5f5f7] rounded-lg border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#6a50ff]/20"
                      />
                    </div>

                    {/* Message */}
                    <div className="relative">
                      <svg className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Jouw bericht"
                        required
                        rows={4}
                        className="w-full pl-12 pr-4 pt-4 pb-4 bg-[#f5f5f7] rounded-lg border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#6a50ff]/20 resize-none"
                      />
                    </div>

                    {/* Submit button */}
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-4 rounded-lg"
                    >
                      Verzend
                    </Button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
