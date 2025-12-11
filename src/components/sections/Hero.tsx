import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowDown, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

// Test wijziging voor automatische backup - verwijder deze regel na test

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable);
}

const businessTypes = ["B2C", "B2B"];

// Logo carousel configuration - easily replaceable
const logoCarouselItems = [
  { 
    logo: "Y", 
    badgeColor: "bg-white", 
    logoColor: "text-green-600",
    logoComponent: <span className="text-green-600 font-bold text-xl">Y</span>
  },
  { 
    logo: "up", 
    badgeColor: "bg-black", 
    logoColor: "text-white",
    logoComponent: <span className="text-white font-semibold text-sm">up</span>
  },
  { 
    logo: "R", 
    badgeColor: "bg-white", 
    logoColor: "text-[#6a50ff]",
    logoComponent: <span className="text-[#6a50ff] font-bold text-xl">R</span>
  },
  { 
    logo: "WELDER", 
    badgeColor: "bg-white", 
    logoColor: "text-green-600", 
    subtext: "THE MARKETING AGENCY",
    logoComponent: (
      <div className="text-center text-green-600 px-1.5">
        <div className="text-[10px] font-bold leading-tight">WELDER</div>
        <div className="text-[7px] font-light leading-tight mt-0.5">THE MARKETING AGENCY</div>
      </div>
    )
  }
];

// Rating configuration - easily replaceable
const ratingConfig = {
  stars: 5,
  score: "5/5",
  textColor: "text-white"
};

// Swipeable cards configuration
const swipeableCards = [
  {
    id: 1,
    title: "Websites",
    subtitle: "Professioneel, snel en schaalbaar.",
    stats: [
      { value: "—", color: "purple" }
    ],
    trustedBy: Array(6).fill("skeleton"),
    heading: "Bouw de fundering van je merk.",
    categories: ["Design", "Development", "CMS"],
    rotation: -2
  },
  {
    id: 2,
    title: "Boekingskalender",
    subtitle: "Automatisch afspraken laten binnenkomen.",
    stats: [
      { value: "—", color: "blue" }
    ],
    trustedBy: Array(6).fill("skeleton"),
    heading: "Altijd volle agenda. Geen handmatig werk.",
    categories: ["Automatisering", "Planning", "Conversie"],
    rotation: 1
  },
  {
    id: 3,
    title: "Review Management",
    subtitle: "Verzamel en toon reviews automatisch.",
    stats: [
      { value: "—", color: "green" }
    ],
    trustedBy: Array(6).fill("skeleton"),
    heading: "Groei met sociale bewijskracht.",
    categories: ["Reputatie", "Feedback", "Insights"],
    rotation: -1.5
  }
];


export const Hero = () => {
  const [currentType, setCurrentType] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentType((prev) => (prev + 1) % businessTypes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!carouselRef.current || cardsRef.current.length === 0) return;

    const maxIndex = swipeableCards.length - 1;
    let activeIndex = 0;

    carouselRef.current.style.transformStyle = "preserve-3d";

    // Initial setup: zet kaarten direct op hun positie zonder animatie
    const setupInitialCards = (index: number) => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        const offset = i - index;

        let x = 0;
        let scale = 1;
        let rotation = 0;
        let zIndex = 0;

        if (offset === 0) {
          x = 0;
          scale = 1;
          rotation = -2;
          zIndex = 30;
        } else if (offset === 1) {
          x = 40;
          scale = 0.97;
          rotation = 2;
          zIndex = 20;
        } else if (offset === 2) {
          x = 80;
          scale = 0.94;
          rotation = 4;
          zIndex = 10;
        } else {
          x = 120 * Math.sign(offset);
          scale = 0.9;
          rotation = 6 * Math.sign(offset);
          zIndex = 0;
        }

        // Gebruik gsap.set voor initial positie - geen animatie
        gsap.set(card, {
          xPercent: -50,
          yPercent: -50,
          x,
          scale,
          rotationZ: rotation,
          zIndex
        });
      });
    };

    // layoutCards: enige functie die kaarten animeert (alleen bij loslaten)
    const layoutCards = (index: number) => {
      activeIndex = index;

      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        const offset = i - index;

        let x = 0;
        let scale = 1;
        let rotation = 0;
        let zIndex = 0;

        if (offset === 0) {
          x = 0;
          scale = 1;
          rotation = -2;
          zIndex = 30;
        } else if (offset === 1) {
          x = 40;
          scale = 0.97;
          rotation = 2;
          zIndex = 20;
        } else if (offset === 2) {
          x = 80;
          scale = 0.94;
          rotation = 4;
          zIndex = 10;
        } else {
          x = 120 * Math.sign(offset);
          scale = 0.9;
          rotation = 6 * Math.sign(offset);
          zIndex = 0;
        }

        // Alleen layoutCards gebruikt gsap.to voor animatie
        gsap.to(card, {
          xPercent: -50,
          yPercent: -50,
          x,
          scale,
          rotationZ: rotation,
          zIndex,
          duration: 0.5,
          ease: "power3.out"
        });
      });
    };

    // Initial setup zonder animatie
    setupInitialCards(0);
    setCurrentCardIndex(0);

    // Zorg dat container altijd op x:0 blijft
    gsap.set(carouselRef.current, { x: 0 });

    // Draggable: uitsluitend als gesture detector, container beweegt NOOIT
    const draggable = Draggable.create(carouselRef.current, {
      type: "x",
      allowNativeTouchScrolling: false,
      // Geen bounds - container mag niet bewegen
      onDrag() {
        // Reset container direct naar x:0 - voorkomt elke beweging
        // this.x wordt alleen gebruikt als gesture input
        gsap.set(this.target, { x: 0 });
      },
      onDragEnd() {
        const threshold = 40;
        let nextIndex = activeIndex;

        // Gebruik this.x als gesture input (niet als transform)
        if (this.x <= -threshold && activeIndex < maxIndex) {
          nextIndex = activeIndex + 1;
        } else if (this.x >= threshold && activeIndex > 0) {
          nextIndex = activeIndex - 1;
        }

        // Reset de drag waarde intern - container blijft op x:0
        gsap.set(this.target, { x: 0 });

        // Alleen als index verandert: update kaart layout
        if (nextIndex !== activeIndex) {
          layoutCards(nextIndex);
          setCurrentCardIndex(nextIndex);
        }
      }
    })[0];

    return () => {
      draggable.kill();
    };
  }, []);

  return (
    <section className="relative z-0 h-screen bg-[#0a0a0a] overflow-hidden w-screen pt-12">
      {/* Base dark background */}
      <div 
        className="absolute bg-[#0a0a0a] pointer-events-none"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          transform: 'none'
        }}
      />
      
      {/* Film grain texture overlay - finer and more intense */}
      <div 
        className="absolute opacity-70 pointer-events-none"
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
              transparent 0.5px,
              rgba(255, 255, 255, 0.18) 0.5px,
              rgba(255, 255, 255, 0.18) 1px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 0.5px,
              rgba(255, 255, 255, 0.15) 0.5px,
              rgba(255, 255, 255, 0.15) 1px
            ),
            radial-gradient(circle at 0.3px 0.3px, rgba(255,255,255,0.5) 0.3px, transparent 0)
          `,
          backgroundSize: '100% 100%, 100% 100%, 0.5px 0.5px',
          backgroundRepeat: 'repeat, repeat, repeat',
          backgroundPosition: '0 0, 0 0, 0 0',
          imageRendering: 'crisp-edges',
          mixBlendMode: 'overlay',
          margin: 0,
          padding: 0,
          transform: 'none'
        }}
      />
      
      {/* Sun rays from top-right corner - origin point hidden */}
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
              from 135deg at 105% -5%,
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
      
      {/* Main spotlight from top-right - origin hidden */}
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
              ellipse 120% 80% at 105% -5%,
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
      
      {/* Additional sun ray streaks - origin outside viewport */}
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
              135deg,
              transparent,
              transparent 2%,
              rgba(255, 255, 255, 0.08) 2%,
              rgba(255, 255, 255, 0.08) 2.2%,
              transparent 2.2%,
              transparent 100%
            )
          `,
          transformOrigin: 'top right',
          transform: 'rotate(-45deg)',
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          margin: 0,
          padding: 0
        }}
      />
      
      {/* Extra fine grain layer for more texture */}
      <div 
        className="absolute opacity-45 pointer-events-none"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
          backgroundRepeat: 'repeat',
          backgroundPosition: '0 0',
          mixBlendMode: 'overlay',
          margin: 0,
          padding: 0,
          transform: 'none'
        }}
      />
      
      {/* Additional fine grain dots */}
      <div 
        className="absolute opacity-40 pointer-events-none"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `radial-gradient(circle at 0.2px 0.2px, rgba(255,255,255,0.6) 0.2px, transparent 0)`,
          backgroundSize: '0.8px 0.8px',
          backgroundRepeat: 'repeat',
          backgroundPosition: '0 0',
          imageRendering: 'crisp-edges',
          margin: 0,
          padding: 0,
          transform: 'none'
        }}
      />
      
      {/* Extra grain layer for more coverage */}
      <div 
        className="absolute opacity-35 pointer-events-none"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 0.3px,
              rgba(255, 255, 255, 0.1) 0.3px,
              rgba(255, 255, 255, 0.1) 0.6px
            )
          `,
          backgroundSize: '1px 1px',
          backgroundRepeat: 'repeat',
          backgroundPosition: '0 0',
          imageRendering: 'crisp-edges',
          margin: 0,
          padding: 0,
          transform: 'none'
        }}
      />

      <div className="relative h-full z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white flex flex-col justify-center h-full"
          >
            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-white">
              Professionele websites voor{" "}
              <span className="relative inline-block h-[1.1em] overflow-hidden align-bottom min-w-[120px] md:min-w-[150px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentType}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute left-0 top-0 text-[#6a50ff] inline-block"
                    style={{ width: '100%' }}
                  >
                    <span className="relative inline-block">
                      {businessTypes[currentType]}
                      {/* Orange clean curved underline */}
                      <motion.div
                        key={`line-${currentType}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="absolute left-0 top-full -mt-0.5 overflow-visible"
                        style={{
                          height: '8px',
                          width: '100%',
                          transform: 'rotate(-2deg)',
                          transformOrigin: 'left center'
                        }}
                      >
                        {/* Clean curved path */}
                        <motion.svg
                          className="w-full h-full"
                          viewBox="0 0 200 20"
                          preserveAspectRatio="none"
                          style={{ overflow: 'visible', width: '100%' }}
                        >
                          <motion.path
                            d="M 0 15 Q 50 5, 100 10 Q 150 15, 200 12"
                            stroke="#ff8c00"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
                          />
                        </motion.svg>
                      </motion.div>
                    </span>
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
              Wij bouwen websites die resultaat opleveren. Inclusief hosting, onderhoud en automatiseringen.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link to="/contact">
                <Button 
                  size="lg" 
                  className="bg-[#6a50ff] hover:bg-[#5840e0] text-white rounded-lg px-8 py-6 text-lg font-semibold"
                >
                  Plan een afspraak
                </Button>
              </Link>
              <Link to="/projecten">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-orange-500 text-orange-500 bg-transparent hover:bg-orange-500 hover:text-white hover:border-orange-500 rounded-lg px-8 py-6 text-lg font-semibold"
                >
                  Bekijk ons werk
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Visual Area - Swipeable Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex flex-col justify-center h-full"
          >
            {/* Swipeable Cards Carousel */}
            <div className="relative w-full h-[500px] overflow-visible flex items-center justify-center" style={{ perspective: "1000px" }}>
              {/* Swipeable hint - rechtsboven */}
              <div className="absolute top-0 right-0 z-20" style={{ transform: 'translate(20px, -20px)' }}>
                <div className="inline-block" style={{ transform: 'rotate(8deg)' }}>
                  <p className="text-white text-sm font-bold whitespace-nowrap">
                    Sleep om te bladeren
                  </p>
                  <div className="flex justify-center mt-4 relative" style={{ minHeight: '20px' }}>
                    <div className="relative">
                      <img 
                        src="/arrow.png?v=2" 
                        alt="Swipe arrow" 
                        className="h-6 w-auto object-contain"
                        style={{ 
                          display: 'block',
                          maxHeight: '24px',
                          filter: 'brightness(0) invert(1)',
                          opacity: 1,
                          visibility: 'visible',
                          transform: 'rotate(-32deg)',
                          maskImage: 'linear-gradient(to top, transparent 0%, black 40%, black 100%)',
                          WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 40%, black 100%)'
                        }}
                        onError={(e) => {
                          console.error('Arrow image failed to load:', e);
                        }}
                        onLoad={() => {
                          console.log('Arrow image loaded successfully');
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative w-[420px] h-full overflow-visible">
                <div
                  ref={carouselRef}
                  className="relative z-[500] w-full h-full cursor-grab active:cursor-grabbing"
                  style={{ 
                    touchAction: "none",
                    transformStyle: "preserve-3d"
                  }}
                >
                  {swipeableCards.map((card, index) => {
                    const colorClasses = {
                      purple: { bg: "bg-[#6a50ff]/10", text: "text-[#6a50ff]" },
                      blue: { bg: "bg-blue-100", text: "text-blue-600" },
                      green: { bg: "bg-green-100", text: "text-green-600" },
                      orange: { bg: "bg-orange-100", text: "text-orange-600" }
                    };

                    return (
                      <div
                        key={card.id}
                        ref={(el) => {
                          if (el) cardsRef.current[index] = el;
                        }}
                        className="absolute top-1/2 left-1/2 bg-white rounded-2xl shadow-2xl p-2 w-[420px] h-[380px] will-change-transform"
                        style={{
                          transformOrigin: "center center",
                          transformStyle: "preserve-3d",
                          backfaceVisibility: "hidden",
                          zIndex: 1000
                        }}
                      >
                        <div className="bg-white rounded-md overflow-hidden h-full">
                          {/* Service-specific Skeleton UI */}
                          <div className="p-6 bg-gradient-to-b from-gray-50 to-white h-full flex flex-col">
                            {/* Title and Subtitle */}
                            <div className="mb-4">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">{card.title}</h3>
                              <h4 className="text-xl font-semibold text-gray-800">{card.subtitle}</h4>
                            </div>

                            {/* Service-specific skeleton content */}
                            <div className="flex-1 overflow-hidden">
                            {card.id === 1 ? (
                              // WEBSITES - Browser window skeleton
                              <div className="space-y-2">
                                {/* Browser window */}
                                <div className="bg-gray-100 rounded-lg p-2 border border-gray-200">
                                  {/* Browser bar */}
                                  <div className="flex items-center gap-1.5 mb-2">
                                    <div className="flex gap-1">
                                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="flex-1 bg-white rounded px-2 py-1 flex items-center gap-1.5">
                                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                      <div className="bg-gray-200 h-2 w-24 rounded animate-pulse"></div>
                                    </div>
                                  </div>
                                  {/* Website content skeleton */}
                                  <div className="bg-white rounded p-2 space-y-2">
                                    {/* Hero section */}
                                    <div className="flex gap-2">
                                      <div className="flex-1 space-y-1.5">
                                        <div className="bg-[#6a50ff] h-6 w-16 rounded"></div>
                                        <div className="bg-gray-800 h-4 w-full rounded"></div>
                                        <div className="bg-gray-800 h-4 w-3/4 rounded"></div>
                                        <div className="bg-gray-300 h-2.5 w-full rounded"></div>
                                        <div className="bg-gray-300 h-2.5 w-5/6 rounded"></div>
                                        <div className="bg-[#6a50ff] h-6 w-20 rounded"></div>
                                      </div>
                                      <div className="flex-1">
                                        <div className="bg-gradient-to-br from-[#6a50ff]/20 to-orange-200 h-24 rounded"></div>
                                        <div className="flex gap-1 mt-1">
                                          <div className="bg-gray-200 h-1.5 w-8 rounded animate-pulse"></div>
                                          <div className="bg-gray-200 h-1.5 w-8 rounded animate-pulse"></div>
                                          <div className="bg-gray-200 h-1.5 w-8 rounded animate-pulse"></div>
                                        </div>
                                      </div>
                                    </div>
                                    {/* Cards section */}
                                    <div className="flex gap-2 pt-2">
                                      {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex-1 bg-gray-50 rounded p-1.5 space-y-1">
                                          <div className={`h-5 w-5 rounded ${i === 1 ? 'bg-[#6a50ff]/40' : i === 2 ? 'bg-orange-300' : 'bg-[#6a50ff]/40'}`}></div>
                                          <div className="bg-gray-200 h-2 w-full rounded animate-pulse"></div>
                                          <div className="bg-gray-200 h-2 w-2/3 rounded animate-pulse"></div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                {/* Review popup overlay */}
                                <div className="relative">
                                  <div className="absolute bottom-0 right-0 bg-white rounded shadow-md p-2 w-32 border border-gray-200">
                                    <div className="flex items-center gap-1.5 mb-1">
                                      <div className="w-5 h-5 rounded-full bg-gray-300"></div>
                                      <div className="flex-1">
                                        <div className="bg-gray-800 h-2 w-14 rounded mb-0.5"></div>
                                        <div className="flex gap-0.5">
                                          {[1,2,3,4,5].map((i) => (
                                            <div key={i} className="w-2 h-2 bg-yellow-400 rounded"></div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="bg-gray-200 h-2.5 w-full rounded animate-pulse"></div>
                                  </div>
                                </div>
                              </div>
                            ) : card.id === 2 ? (
                              // BOEKINGSKALENDER - Calendar skeleton
                              <div className="space-y-2">
                                <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
                                  {/* Calendar header */}
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="bg-gray-800 h-3 w-24 rounded animate-pulse"></div>
                                    <div className="flex gap-1.5">
                                      <div className="w-5 h-5 rounded-full bg-gray-200"></div>
                                      <div className="w-5 h-5 rounded-full bg-gray-200"></div>
                                    </div>
                                  </div>
                                  {/* Day headers */}
                                  <div className="grid grid-cols-7 gap-0.5 mb-1">
                                    {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((day) => (
                                      <div key={day} className="text-center text-[10px] text-gray-500 py-0.5">{day}</div>
                                    ))}
                                  </div>
                                  {/* Calendar grid */}
                                  <div className="grid grid-cols-7 gap-0.5 mb-2">
                                    {Array.from({ length: 35 }).map((_, i) => {
                                      const date = i + 1;
                                      const isPurple = [5, 12, 19].includes(date);
                                      const isOrange = [8, 15, 22].includes(date);
                                      return (
                                        <div
                                          key={i}
                                          className={`aspect-square flex items-center justify-center text-[10px] rounded ${
                                            isPurple ? 'bg-[#6a50ff] text-white' :
                                            isOrange ? 'bg-orange-300 text-gray-800' :
                                            'bg-gray-50 text-gray-600'
                                          }`}
                                        >
                                          {date <= 31 ? date : ''}
                                        </div>
                                      );
                                    })}
                                  </div>
                                  {/* Appointments section */}
                                  <div className="border-t pt-2">
                                    <div className="bg-gray-800 h-3 w-28 rounded mb-2 animate-pulse"></div>
                                    <div className="space-y-2">
                                      {/* Appointment 1 */}
                                      <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                                        <div className="flex-1">
                                          <div className="bg-gray-800 h-3 w-24 rounded mb-0.5"></div>
                                          <div className="bg-gray-300 h-2 w-32 rounded"></div>
                                        </div>
                                        <div className="bg-[#6a50ff]/10 text-[#6a50ff] px-2 py-0.5 rounded text-[10px] font-medium">
                                          Bevestigd
                                        </div>
                                      </div>
                                      {/* Appointment 2 */}
                                      <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                                        <div className="flex-1">
                                          <div className="bg-gray-800 h-3 w-28 rounded mb-0.5"></div>
                                          <div className="bg-gray-300 h-2 w-32 rounded"></div>
                                        </div>
                                        <div className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-medium">
                                          Nieuw
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* Notification popup */}
                                <div className="relative">
                                  <div className="absolute bottom-0 left-0 bg-white rounded shadow-md p-2 w-36 border border-gray-200">
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-5 h-5 rounded-full bg-[#6a50ff]/10 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 bg-[#6a50ff] rounded"></div>
                                      </div>
                                      <div className="flex-1">
                                        <div className="bg-gray-800 h-2.5 w-24 rounded mb-0.5"></div>
                                        <div className="bg-gray-300 h-2 w-20 rounded"></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : card.id === 3 ? (
                              // REVIEW MANAGEMENT - Chat interface skeleton
                              <div className="space-y-2">
                                <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
                                  {/* User profile */}
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                                    <div className="flex-1">
                                      <div className="bg-gray-800 h-3 w-24 rounded mb-0.5"></div>
                                      <div className="bg-gray-300 h-2 w-32 rounded"></div>
                                    </div>
                                  </div>
                                  {/* Message bubbles */}
                                  <div className="space-y-2">
                                    {/* Request message */}
                                    <div className="bg-gray-100 rounded-lg p-2 max-w-[80%]">
                                      <div className="space-y-1">
                                        <div className="bg-gray-300 h-2 w-full rounded animate-pulse"></div>
                                        <div className="bg-gray-300 h-2 w-5/6 rounded animate-pulse"></div>
                                        <div className="bg-gray-300 h-2 w-4/6 rounded animate-pulse"></div>
                                      </div>
                                      <div className="flex gap-0.5 mt-1.5">
                                        {[1,2,3,4,5].map((i) => (
                                          <div key={i} className="w-2.5 h-2.5 bg-gray-400 rounded"></div>
                                        ))}
                                      </div>
                                    </div>
                                    {/* Review response */}
                                    <div className="bg-green-100 rounded-lg p-2 max-w-[80%] ml-auto">
                                      <div className="space-y-1">
                                        <div className="bg-green-200 h-2 w-full rounded animate-pulse"></div>
                                        <div className="bg-green-200 h-2 w-5/6 rounded animate-pulse"></div>
                                      </div>
                                      <div className="flex gap-0.5 mt-1.5">
                                        {[1,2,3,4,5].map((i) => (
                                          <div key={i} className="w-2 h-2 bg-yellow-400 rounded"></div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* New review notification */}
                                <div className="relative">
                                  <div className="absolute top-0 right-0 bg-white rounded shadow-md p-2 w-32 border border-gray-200">
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 bg-green-500 rounded"></div>
                                      </div>
                                      <div className="flex-1">
                                        <div className="bg-gray-800 h-2.5 w-20 rounded mb-0.5"></div>
                                        <div className="bg-gray-300 h-2 w-24 rounded"></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                            </div>

                            {/* Categories */}
                            <div className="flex gap-2 mt-auto pt-4 border-t">
                              {card.categories.map((cat, i) => (
                                <div key={i} className="bg-[#6a50ff]/10 rounded-lg px-3 py-2 text-sm font-medium text-[#6a50ff]">
                                  {cat}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Logo Carousel and Rating Section - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative z-10 flex flex-col items-center justify-center gap-6 mt-8"
        >
          {/* Logo Carousel with overlapping circular badges */}
          <div className="flex items-center relative" style={{ width: 'fit-content' }}>
            {/* Logo badges with overlap - exact styling from screenshot */}
            {logoCarouselItems.map((item, index) => (
              <div
                key={index}
                className={`${item.badgeColor} border-4 border-black rounded-full flex items-center justify-center relative`}
                style={{
                  width: '56px',
                  height: '56px',
                  marginLeft: index > 0 ? '-14px' : '0',
                  zIndex: 10 - index,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
              >
                {item.logoComponent}
              </div>
            ))}
          </div>

          {/* Rating Section - exact styling */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(ratingConfig.stars)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className={`${ratingConfig.textColor} text-lg font-medium ml-1`}>
              {ratingConfig.score}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
