import { motion } from "framer-motion";
import { Star, Calendar, Mail, Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Automations = () => {
  return (
    <section className="py-24 bg-[#f5f5f7] overflow-hidden relative">
      {/* Diagonal divider top */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden">
        <svg className="w-full h-16" preserveAspectRatio="none" viewBox="0 0 1440 64">
          <path fill="white" d="M0,64 L1440,0 L1440,0 L0,0 Z"></path>
        </svg>
      </div>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-500 rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-semibold">Automatiseringen</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Bespaar tijd met{" "}
            <span className="text-[#6a50ff]">slimme automatisering</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Laat ons de repetitieve taken overnemen. Meer tijd voor je klanten, minder stress.
          </p>
        </motion.div>

        {/* Review Management */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#6a50ff]/10 text-[#6a50ff] rounded-full px-3 py-1 mb-4">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Review management</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Automatisch reviews verzamelen
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              24 uur na elke afspraak ontvangen je klanten automatisch een reviewverzoek 
              via e-mail, SMS of WhatsApp. Verzamel positieve reviews en houd negatieve feedback intern.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Automatische review verzoeken na afspraak",
                "Keuze uit e-mail, SMS of WhatsApp",
                "Negatieve feedback eerst intern afhandelen",
                "Reviews tonen op je website",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#6a50ff]/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-[#6a50ff]" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/diensten">
              <Button>Meer over Review Management</Button>
            </Link>
          </motion.div>

          {/* Review Skeleton/Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-[#f5f5f7] rounded-3xl p-6 md:p-8">
              {/* Phone mockup with review request */}
              <div className="bg-white rounded-2xl shadow-card p-6 max-w-sm mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                    alt="Klant"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">Lisa van der Berg</p>
                    <p className="text-sm text-muted-foreground">Ontvangen via WhatsApp</p>
                  </div>
                </div>
                <div className="bg-[#f5f5f7] rounded-xl p-4 mb-4">
                  <p className="text-sm mb-3">
                    Hoi Lisa! Bedankt voor je bezoek gisteren. We hopen dat je tevreden bent! 
                    Zou je een review willen achterlaten? ⭐
                  </p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${star <= 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-700">
                    "Geweldige service! Zeer tevreden met het resultaat. Aanrader!" ⭐⭐⭐⭐⭐
                  </p>
                </div>
              </div>

              {/* Floating notification */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -right-4 top-8 bg-white rounded-xl shadow-lg p-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium">Nieuwe review!</p>
                  <p className="text-xs text-muted-foreground">5 sterren ontvangen</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Booking Calendar */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Calendar Skeleton/Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="bg-[#f5f5f7] rounded-3xl p-6 md:p-8">
              {/* Calendar mockup */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-bold text-lg">December 2024</h4>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-lg bg-[#f5f5f7] flex items-center justify-center">
                      ←
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-[#f5f5f7] flex items-center justify-center">
                      →
                    </button>
                  </div>
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((day) => (
                    <div key={day} className="text-center text-xs text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                  {[...Array(31)].map((_, i) => (
                    <div
                      key={i}
                      className={`text-center py-2 rounded-lg text-sm ${
                        i === 4 || i === 11 || i === 18
                          ? "bg-[#6a50ff] text-white font-medium"
                          : i === 7 || i === 14 || i === 21
                          ? "bg-orange-100 text-orange-600 font-medium"
                          : "hover:bg-[#f5f5f7]"
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Upcoming appointments */}
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-3">Aankomende afspraken</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-[#f5f5f7] rounded-lg">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                        alt="Klant"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Mark Jansen</p>
                        <p className="text-xs text-muted-foreground">10:00 - Consultatie</p>
                      </div>
                      <span className="text-xs bg-[#6a50ff]/10 text-[#6a50ff] px-2 py-1 rounded">Bevestigd</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-[#f5f5f7] rounded-lg">
                      <img
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
                        alt="Klant"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Sophie de Vries</p>
                        <p className="text-xs text-muted-foreground">14:30 - Intake</p>
                      </div>
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">Nieuw</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating reminder notification */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -left-4 bottom-8 bg-white rounded-xl shadow-lg p-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-[#6a50ff]/10 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-[#6a50ff]" />
                </div>
                <div>
                  <p className="text-xs font-medium">Herinnering verstuurd</p>
                  <p className="text-xs text-muted-foreground">Naar Mark Jansen</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-500 rounded-full px-3 py-1 mb-4">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Boekingssysteem</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Online boeken, 24/7
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              Klanten boeken zelf een afspraak via jouw website, op elk moment van de dag. 
              Automatische herinneringen zorgen voor minder no-shows.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "24/7 online boeken via je website",
                "Automatische bevestigingen & herinneringen",
                "Synchronisatie met Google/Outlook agenda",
                "Koppeling met review management",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-orange-500" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/diensten">
              <Button className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white" variant="outline">
                Meer over boekingssysteem
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

