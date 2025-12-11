import { motion } from "framer-motion";
import { Star, Calendar, Mail, Bell, Check, Palette, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const diensten = [
  {
    icon: Palette,
    title: "Op maat gemaakt",
    description: "Uniek design dat perfect aansluit bij jouw merk en doelgroep.",
    color: "orange",
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
    color: "orange",
  },
];

export const Automations = () => {
  return (
    <section className="py-24 bg-[#0a0a0a] overflow-hidden relative border-0 outline-none">
      {/* Top slanted divider - bottom-right to top-left */}
      <div 
        className="absolute top-0 left-0 right-0 pointer-events-none z-[2]"
        style={{
          height: '100px',
          clipPath: 'polygon(0 0, 100% 30%, 100% 0)',
          background: '#f5f5f7',
        }}
      />
      
      {/* Bottom slanted divider - bottom-left to top-right */}
      <div 
        className="absolute left-0 right-0 pointer-events-none z-[2]"
        style={{
          bottom: '-1px',
          height: '102px',
          clipPath: 'polygon(0 100%, 100% 100%, 100% 70%)',
          background: 'white',
        }}
      />
      
      {/* Base dark background */}
      <div 
        className="absolute bg-[#0a0a0a] pointer-events-none"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: '102px',
          width: '100%',
          margin: 0,
          padding: 0,
          transform: 'none',
          border: 'none',
          outline: 'none'
        }}
      />
      
      {/* Grain overlay - prominent texture over background */}
      <div 
        className="absolute pointer-events-none z-[1]"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat',
          backgroundPosition: '0 0',
          opacity: 0.5,
          mixBlendMode: 'overlay',
          margin: 0,
          padding: 0,
          transform: 'none'
        }}
      />
      
      {/* Additional fine grain layer for more texture */}
      <div 
        className="absolute pointer-events-none z-[1]"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.03) 2px,
              rgba(255, 255, 255, 0.03) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.03) 2px,
              rgba(255, 255, 255, 0.03) 4px
            )
          `,
          backgroundSize: '100% 100%, 100% 100%',
          backgroundRepeat: 'repeat',
          backgroundPosition: '0 0',
          opacity: 0.6,
          mixBlendMode: 'overlay',
          imageRendering: 'crisp-edges',
          margin: 0,
          padding: 0,
          transform: 'none'
        }}
      />
      
      {/* Sun rays from bottom-left corner - origin point hidden */}
      <div 
        className="absolute overflow-hidden pointer-events-none"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          background: `
            conic-gradient(
              from 315deg at -5% 105%,
              transparent 0deg,
              transparent 10deg,
              rgba(255, 255, 255, 0.12) 12deg,
              transparent 14deg,
              rgba(255, 255, 255, 0.1) 28deg,
              transparent 32deg,
              rgba(255, 255, 255, 0.08) 48deg,
              transparent 52deg,
              rgba(255, 255, 255, 0.06) 68deg,
              transparent 72deg,
              rgba(255, 255, 255, 0.04) 88deg,
              transparent 92deg,
              rgba(255, 255, 255, 0.02) 108deg,
              transparent 112deg
            )
          `,
          margin: 0,
          padding: 0
        }}
      />
      
      {/* Main spotlight from bottom-left - origin hidden */}
      <div 
        className="absolute pointer-events-none"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(
              ellipse 120% 80% at -5% 105%,
              transparent 0%,
              transparent 5%,
              rgba(255, 255, 255, 0.15) 15%,
              rgba(255, 255, 255, 0.1) 25%,
              rgba(255, 255, 255, 0.06) 40%,
              transparent 65%
            )
          `,
          margin: 0,
          padding: 0,
          transform: 'none'
        }}
      />
      
      {/* Additional sun ray streaks - origin outside viewport from bottom-left */}
      <div 
        className="absolute overflow-hidden pointer-events-none"
        style={{
          top: '-50%',
          left: '-50%',
          right: '-50%',
          bottom: '-50%',
          width: '200%',
          height: '200%',
          background: `
            repeating-linear-gradient(
              315deg,
              transparent,
              transparent 2%,
              rgba(255, 255, 255, 0.08) 2%,
              rgba(255, 255, 255, 0.08) 2.2%,
              transparent 2.2%,
              transparent 100%
            )
          `,
          transformOrigin: 'bottom left',
          transform: 'rotate(45deg)',
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          margin: 0,
          padding: 0
        }}
      />

      <div className="relative z-10 container">
        {/* Effectief & professioneel sectie */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-32">
          {/* Left - Browser mockup with real preview */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { type: "spring", stiffness: 400, damping: 17 }
              }}
            >
              <div className="bg-white rounded-2xl p-3 md:p-4">
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
            </motion.div>

            {/* Floating review card - buiten hover container */}
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
          </div>

          {/* Right - Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#6a50ff]/20 text-[#6a50ff] rounded-full px-4 py-2 mb-6 border border-[#6a50ff]/30">
              <span className="text-sm font-semibold">Effectief & professioneel</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
              Websites die{" "}
              <span className="text-[#6a50ff]">werken</span>
            </h2>
            <p className="text-lg text-white/80 mb-4">
              Geen standaard templates, maar oplossingen die écht bij jouw bedrijf passen. 
              Ontworpen om je bedrijf vooruit te helpen.
            </p>

            {/* Mini feature list */}
            <div className="space-y-1">
              {diensten.map((dienst, index) => (
                <div
                  key={dienst.title}
                  className="flex items-center gap-4 rounded-xl py-2"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    dienst.color === "orange" ? "bg-orange-100" : "bg-[#6a50ff]/10"
                  }`}>
                    <dienst.icon className={`w-6 h-6 ${
                      dienst.color === "orange" ? "text-orange-500" : "text-[#6a50ff]"
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{dienst.title}</h3>
                    <p className="text-sm text-white/70">{dienst.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Automatiseringen sectie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 rounded-full px-4 py-2 mb-6 border border-orange-500/30">
            <span className="text-sm font-semibold">Automatiseringen</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
            Bespaar tijd met{" "}
            <span className="text-[#6a50ff]">slimme automatisering</span>
          </h2>
          <p className="text-lg text-white/80">
            Laat ons de repetitieve taken overnemen. Meer tijd voor je klanten, minder stress.
          </p>
        </motion.div>

        {/* Review Management */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-32">
          <div className="p-6">
            <div className="inline-flex items-center gap-2 bg-[#6a50ff]/20 text-[#6a50ff] rounded-full px-3 py-1 mb-4 border border-[#6a50ff]/30">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Review management</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Automatisch reviews verzamelen
            </h3>
            <p className="text-lg text-white/80 mb-6">
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
                  <div className="w-5 h-5 rounded-full bg-[#6a50ff]/20 flex items-center justify-center border border-[#6a50ff]/30">
                    <Check className="w-3 h-3 text-[#6a50ff]" />
                  </div>
                  <span className="text-white/90">{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/diensten">
              <Button className="bg-[#6a50ff] hover:bg-[#5840e0] text-white">
                Meer over Review Management
              </Button>
            </Link>
          </div>

          {/* Review Skeleton/Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="p-8 md:p-12">
              {/* Google Review Mockup */}
              <motion.div 
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400, damping: 17 }
                }}
                className="bg-white rounded-2xl shadow-card p-8 md:p-10 max-w-lg mx-auto border border-gray-300"
              >
                {/* Google Review Header with Google branding */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm font-semibold text-gray-700">Google Review</span>
                  </div>
                </div>

                {/* Review Content */}
                <div className="space-y-4">
                  {/* User Info and Rating */}
                  <div className="flex items-start gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                      alt="Lisa van der Berg"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm">Lisa van der Berg</p>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="w-4 h-4 fill-[#FFB800] text-[#FFB800]"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">2 weken geleden</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        "Geweldige service! Zeer tevreden met het resultaat. Aanrader!"
                      </p>
                    </div>
                  </div>
                  
                  {/* Review Request Message (WhatsApp style) */}
                  <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-[#6a50ff]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-xs text-gray-500 font-medium">Ontvangen via WhatsApp</p>
                    </div>
                    <p className="text-xs text-gray-600">
                      Hoi Lisa! Bedankt voor je bezoek gisteren. We hopen dat je tevreden bent! 
                      Zou je een review willen achterlaten? ⭐
                    </p>
                  </div>
                </div>
              </motion.div>

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
            <div className="p-8 md:p-12">
              {/* Calendar mockup */}
              <motion.div 
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400, damping: 17 }
                }}
                className="bg-white rounded-2xl shadow-card p-8 md:p-10 max-w-lg mx-auto border border-gray-300"
              >
                  <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-base text-gray-900">December 2024</h4>
                  <div className="flex gap-1.5">
                    <button className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 text-sm">
                      ←
                    </button>
                    <button className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 text-sm">
                      →
                    </button>
                  </div>
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1.5 mb-3">
                  {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((day) => (
                    <div key={day} className="text-center text-[10px] text-gray-600 py-1 font-medium">
                      {day}
                    </div>
                  ))}
                  {[...Array(31)].map((_, i) => (
                    <div
                      key={i}
                      className={`text-center py-1 rounded-lg text-xs cursor-pointer transition-colors ${
                        i === 4 || i === 11 || i === 18
                          ? "bg-[#6a50ff] text-white font-medium hover:bg-[#5840e0]"
                          : i === 7 || i === 14 || i === 21
                          ? "bg-orange-100 text-orange-600 font-medium hover:bg-orange-200"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Upcoming appointments */}
                <div className="border-t pt-3">
                  <p className="text-xs font-medium mb-2">Aankomende afspraken</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-lg">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                        alt="Klant"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-900">Mark Jansen</p>
                        <p className="text-[10px] text-gray-600">10:00 - Consultatie</p>
                      </div>
                      <span className="text-[10px] bg-[#6a50ff]/10 text-[#6a50ff] px-1.5 py-0.5 rounded">Bevestigd</span>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-lg">
                      <img
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
                        alt="Klant"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-900">Sophie de Vries</p>
                        <p className="text-[10px] text-gray-600">14:30 - Intake</p>
                      </div>
                      <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">Nieuw</span>
                    </div>
                  </div>
                </div>
              </motion.div>

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
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 rounded-full px-3 py-1 mb-4 border border-orange-500/30">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Boekingssysteem</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Online boeken, 24/7
            </h3>
            <p className="text-lg text-white/80 mb-6">
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
                  <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                    <Check className="w-3 h-3 text-orange-400" />
                  </div>
                  <span className="text-white/90">{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/diensten">
              <Button className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white bg-transparent" variant="outline">
                Meer over boekingssysteem
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

