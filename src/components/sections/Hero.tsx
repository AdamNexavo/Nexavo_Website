import { Button } from "@/components/ui/button";
import { HeroCardSkeleton } from "@/components/sections/HeroCardSkeletons";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getHeroPinScrollDistance } from "@/lib/heroScroll";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable, ScrollTrigger);
}

const businessTypes = ["B2C", "B2B"] as const;

/** B2B/B2C — zelfde grootte per teken, iets zwaarder dan de rest van de headline */
const HeroBusinessType = ({ label }: { label: string }) => (
  <span className="hero-business-type">
    {label.split("").map((char, index) => (
      <span key={`${label}-${index}`} className="hero-business-type-char">
        {char}
      </span>
    ))}
  </span>
);

const swipeableCards = [
  {
    id: 1,
    title: "Websites",
    subtitle: "Professioneel, snel en schaalbaar.",
    categories: ["Design", "Development", "CMS"],
  },
  {
    id: 2,
    title: "Boekingskalender",
    subtitle: "Automatisch afspraken laten binnenkomen.",
    categories: ["Automatisering", "Planning", "Conversie"],
  },
  {
    id: 3,
    title: "Review Management",
    subtitle: "Verzamel en toon reviews automatisch.",
    categories: ["Reputatie", "Feedback", "Insights"],
  },
];

const getCardTransform = (offset: number) => {
  if (offset === 0) {
    return { x: 0, scale: 1, rotation: -2, zIndex: 30 };
  }
  if (offset === 1) {
    return { x: 40, scale: 0.97, rotation: 2, zIndex: 20 };
  }
  if (offset === 2) {
    return { x: 80, scale: 0.94, rotation: 4, zIndex: 10 };
  }
  return {
    x: 120 * Math.sign(offset),
    scale: 0.9,
    rotation: 6 * Math.sign(offset),
    zIndex: 0,
  };
};

export const Hero = () => {
  const [currentType, setCurrentType] = useState(0);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentType((prev) => (prev + 1) % businessTypes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    if (!carouselRef.current || !scrollWrapperRef.current || !heroRef.current) {
      return;
    }

    const maxIndex = swipeableCards.length - 1;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    carouselRef.current.style.transformStyle = "preserve-3d";

    const applyCardLayout = (index: number, animate: boolean) => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        const { x, scale, rotation, zIndex } = getCardTransform(i - index);
        const props = {
          xPercent: -50,
          yPercent: -50,
          x,
          scale,
          rotationZ: rotation,
          zIndex,
        };

        if (animate) {
          gsap.to(card, {
            ...props,
            duration: 0.5,
            ease: "power3.out",
          });
        } else {
          gsap.set(card, props);
        }
      });
    };

    const syncScrollToIndex = (index: number) => {
      const st = scrollTriggerRef.current;
      if (!st || maxIndex === 0) return;

      const progress = index / maxIndex;
      const targetScroll = st.start + progress * (st.end - st.start);
      window.scrollTo(0, targetScroll);
    };

    const goToCard = (index: number, options?: { syncScroll?: boolean }) => {
      const clamped = Math.max(0, Math.min(maxIndex, index));
      if (clamped === activeIndexRef.current) return;

      activeIndexRef.current = clamped;
      applyCardLayout(clamped, true);

      if (options?.syncScroll) {
        syncScrollToIndex(clamped);
      }
    };

    applyCardLayout(0, false);
    gsap.set(carouselRef.current, { x: 0 });

    const draggable = Draggable.create(carouselRef.current, {
      type: "x",
      allowNativeTouchScrolling: false,
      onDrag() {
        gsap.set(this.target, { x: 0 });
      },
      onDragEnd() {
        const threshold = 40;
        let nextIndex = activeIndexRef.current;

        if (this.x <= -threshold && activeIndexRef.current < maxIndex) {
          nextIndex = activeIndexRef.current + 1;
        } else if (this.x >= threshold && activeIndexRef.current > 0) {
          nextIndex = activeIndexRef.current - 1;
        }

        gsap.set(this.target, { x: 0 });

        if (nextIndex !== activeIndexRef.current) {
          goToCard(nextIndex, { syncScroll: !prefersReducedMotion });
        }
      },
    })[0];

    if (!prefersReducedMotion && maxIndex > 0) {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: scrollWrapperRef.current,
        start: "top top",
        end: () => `+=${getHeroPinScrollDistance()}`,
        pin: heroRef.current,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: {
          snapTo: (value) => Math.round(value * maxIndex) / maxIndex,
          duration: { min: 0.1, max: 0.28 },
          delay: 0.02,
        },
        onUpdate(self) {
          const index = Math.round(self.progress * maxIndex);
          if (index !== activeIndexRef.current) {
            goToCard(index);
          }
        },
      });
    }

    ScrollTrigger.refresh();

    return () => {
      draggable.kill();
      scrollTriggerRef.current?.kill();
      scrollTriggerRef.current = null;
    };
  }, []);

  return (
    <div ref={scrollWrapperRef} className="relative w-full">
      <section
        ref={heroRef}
        className="relative z-0 h-screen w-full overflow-hidden pt-14 bg-[#0a0a0a]"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <div className="absolute inset-0 bg-[#0a0a0a] pointer-events-none" />

        <div
          className="absolute pointer-events-none z-[1] inset-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            mixBlendMode: "overlay",
          }}
        />

        <div
          className="absolute overflow-hidden pointer-events-none inset-0"
          style={{
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
          }}
        />

        <div
          className="absolute pointer-events-none inset-0"
          style={{
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
          }}
        />

        <div className="relative z-10 flex h-full w-full flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 1, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex h-full flex-col justify-center text-white"
            >
              <h1 className="nex-dual-heading mb-8 max-w-3xl md:mb-10">
                <span className="nex-type-display-sans block text-white">
                  Professionele
                </span>
                <span className="nex-type-display-sans block text-white">
                  websites voor
                </span>
                <span
                  className="nex-type-display-sans relative block min-w-[2.85em] pb-2 sm:min-w-[3em] md:min-w-[3.15em]"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <span className="relative block h-[1.08em] overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={currentType}
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "-100%", opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="absolute left-0 top-0 inline-block w-full"
                      >
                        <span className="relative inline-block">
                          <span className="sr-only">{businessTypes[currentType]}</span>
                          <HeroBusinessType label={businessTypes[currentType]} />
                          <motion.div
                            key={`line-${currentType}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="pointer-events-none absolute left-0 top-[calc(100%-2px)] h-2 w-full overflow-visible"
                            style={{
                              transform: "rotate(-2deg)",
                              transformOrigin: "left center",
                            }}
                          >
                            <motion.svg
                              className="h-full w-full"
                              viewBox="0 0 200 20"
                              preserveAspectRatio="none"
                              aria-hidden
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
                                transition={{
                                  duration: 0.6,
                                  ease: "easeInOut",
                                  delay: 0.1,
                                }}
                              />
                            </motion.svg>
                          </motion.div>
                        </span>
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </span>
              </h1>

              <p className="mb-8 font-sans text-lg leading-relaxed text-white/80 md:text-xl">
                Wij bouwen websites die resultaat opleveren. Inclusief hosting,
                onderhoud en automatiseringen.
              </p>

              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Link to="/contact">
                  <Button size="lg" variant="brand">
                    Plan een demo
                  </Button>
                </Link>
                <Link to="/projecten">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 bg-transparent text-white hover:border-white/30 hover:bg-white/10 hover:text-white"
                  >
                    Bekijk ons werk
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex h-full flex-col justify-center"
            >
              <div
                className="relative flex h-[500px] w-full items-center justify-center overflow-visible"
                style={{ perspective: "1000px" }}
              >
                <div
                  className="absolute right-0 top-0 z-20"
                  style={{ transform: "translate(20px, -20px)" }}
                >
                  <div
                    className="inline-block"
                    style={{ transform: "rotate(8deg)" }}
                  >
                    <p className="whitespace-nowrap text-sm font-semibold text-white">
                      Scroll of sleep om te bladeren
                    </p>
                    <div
                      className="relative mt-4 flex justify-center"
                      style={{ minHeight: "20px" }}
                    >
                      <img
                        src="/arrow.png?v=2"
                        alt=""
                        className="h-6 w-auto object-contain"
                        style={{
                          display: "block",
                          maxHeight: "24px",
                          filter: "brightness(0) invert(1)",
                          transform: "rotate(-32deg)",
                          maskImage:
                            "linear-gradient(to top, transparent 0%, black 40%, black 100%)",
                          WebkitMaskImage:
                            "linear-gradient(to top, transparent 0%, black 40%, black 100%)",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="relative h-full w-[420px] overflow-visible">
                  <div
                    ref={carouselRef}
                    className="relative z-[500] h-full w-full cursor-grab active:cursor-grabbing"
                    style={{
                      touchAction: "none",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {swipeableCards.map((card, index) => (
                      <div
                        key={card.id}
                        ref={(el) => {
                          if (el) cardsRef.current[index] = el;
                        }}
                        className="absolute left-1/2 top-1/2 h-[380px] w-[420px] will-change-transform rounded-2xl bg-white p-2 shadow-2xl"
                        style={{
                          transformOrigin: "center center",
                          transformStyle: "preserve-3d",
                          backfaceVisibility: "hidden",
                          zIndex: 1000,
                        }}
                      >
                        <div className="h-full overflow-hidden rounded-md bg-white">
                          <div className="flex h-full flex-col bg-gradient-to-b from-gray-50 to-white p-6">
                            <div className="mb-4">
                              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                                {card.title}
                              </h3>
                              <h4 className="text-xl font-semibold text-gray-800">
                                {card.subtitle}
                              </h4>
                            </div>

                            <div className="flex-1 overflow-hidden">
                              <HeroCardSkeleton type={card.id} />
                            </div>

                            <div className="mt-auto flex gap-2 border-t pt-4">
                              {card.categories.map((cat) => (
                                <div
                                  key={cat}
                                  className="rounded-lg bg-[#6a50ff]/10 px-3 py-2 text-sm font-medium text-[#6a50ff]"
                                >
                                  {cat}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
