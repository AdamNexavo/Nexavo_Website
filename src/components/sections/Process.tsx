import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { NexDualLineTitle } from "@/components/ui/nex-typography";
import { MessageCircle, Paintbrush, Rocket } from "lucide-react";
import { NexSection, SectionBadge } from "@/components/ui/nex-ui";
import { ProcessDashboardSkeleton } from "@/components/sections/ProcessDashboardSkeleton";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: MessageCircle,
    title: "Kennis maken",
    description:
      "We bespreken je doelen, doelgroep en wensen. Zo weten we precies wat er nodig is voordat we starten.",
  },
  {
    icon: Paintbrush,
    title: "Ontwerp en bouw",
    description:
      "Wij ontwerpen en bouwen je website, inclusief koppelingen en automatiseringen. Jij geeft feedback, wij regelen de rest.",
  },
  {
    icon: Rocket,
    title: "Livegang",
    description:
      "Je website gaat live en alles wordt goed ingesteld. Daarna blijven we beschikbaar via onderhoud en support.",
  },
] as const;

export const Process = () => {
  const [activeStep, setActiveStep] = useState<0 | 1 | 2>(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.35, once: false });

  useEffect(() => {
    if (!isInView || !autoPlay) return;

    const intervalId = window.setInterval(() => {
      setActiveStep((current) => ((current + 1) % 3) as 0 | 1 | 2);
    }, 2000);

    return () => window.clearInterval(intervalId);
  }, [isInView, autoPlay]);

  const handleStepClick = (index: 0 | 1 | 2) => {
    setAutoPlay(false);
    setActiveStep(index);
  };

  const stepCardBg = (index: number, isActive: boolean) => {
    const isOuterStep = index === 0 || index === 2;
    const base = isOuterStep ? "bg-[#fafafa]" : "bg-[#f5f5f7]";
    const hover = isOuterStep ? "hover:bg-[#f5f5f5]" : "hover:bg-[#f0f0f2]";

    if (isActive) {
      return cn(
        base,
        "border-primary/30 shadow-[0_12px_32px_-20px_hsl(255_80%_60%_/_0.35)]",
      );
    }

    return cn(base, "border-border/50", hover, "hover:border-border");
  };

  return (
    <NexSection id="werkwijze" surface="dots-grid" divider className="scroll-mt-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto mb-12 max-w-2xl text-center md:mb-14"
      >
        <SectionBadge className="mx-auto">Zo simpel is het</SectionBadge>
        <NexDualLineTitle
          sans="Van idee tot"
          serif={
            <>
              <span className="text-primary">realisatie</span> in drie stappen
            </>
          }
          className="mb-5"
        />
        <p className="text-lg text-muted-foreground">
          Bij Nexavo nemen we je alle zorgen uit handen. Jij focust op ondernemen.
        </p>
      </motion.div>

      <div ref={sectionRef} className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] xl:grid-cols-1 xl:gap-6">
          <div className="space-y-3 xl:grid xl:grid-cols-3 xl:gap-4 xl:space-y-0">
            {steps.map((step, index) => {
              const isActive = activeStep === index;

              return (
                <motion.button
                  key={step.title}
                  type="button"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  onClick={() => handleStepClick(index as 0 | 1 | 2)}
                  className={cn(
                    "w-full rounded-2xl border p-5 text-left transition-all duration-200 xl:h-full",
                    stepCardBg(index, isActive),
                  )}
                >
                  <div className="flex gap-4">
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors",
                        isActive
                          ? "border-primary/20 bg-white text-primary"
                          : "border-border/60 bg-white text-muted-foreground",
                      )}
                    >
                      <step.icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                          Stap {index + 1}
                        </span>
                      </div>
                      <h3 className="nex-card-title mb-1.5">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="min-w-0 lg:sticky lg:top-28"
          >
            <ProcessDashboardSkeleton activeStep={activeStep} />
          </motion.div>
        </div>
      </div>
    </NexSection>
  );
};
