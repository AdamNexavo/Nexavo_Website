import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Bell, CalendarCheck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { showcaseBorder, showcaseCardShadow } from "@/components/skeletons/showcase-tokens";

const reminders = [
  {
    icon: Bell,
    title: "Herinnering verstuurd",
    subtitle: "Naar Mark Jansen",
    iconClass: "text-muted-foreground",
  },
  {
    icon: CheckCircle2,
    title: "Bevestiging verstuurd",
    subtitle: "Naar Sophie de Vries",
    iconClass: "text-emerald-500",
  },
  {
    icon: CalendarCheck,
    title: "Nieuwe boeking",
    subtitle: "Mark Jansen · 10:00",
    iconClass: "text-primary",
  },
  {
    icon: Bell,
    title: "Herinnering verstuurd",
    subtitle: "Naar Sophie de Vries",
    iconClass: "text-muted-foreground",
  },
] as const;

type BookingReminderPopupProps = {
  className?: string;
};

export const BookingReminderPopup = ({ className }: BookingReminderPopupProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.35, once: false });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
      return;
    }

    setIsVisible(false);
    setActiveIndex(0);
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % reminders.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [isInView]);

  const active = reminders[activeIndex];
  const Icon = active.icon;

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute -left-8 bottom-6 hidden h-[4.5rem] w-[15.5rem] md:block",
        className,
      )}
    >
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.88, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -10 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className={cn(
              "absolute inset-0 flex items-center gap-3 rounded-2xl bg-white p-3.5",
              showcaseBorder,
              showcaseCardShadow,
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#ebe8e4] bg-[#fafaf9]">
              <Icon className={cn("h-4 w-4", active.iconClass)} strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{active.title}</p>
              <p className="truncate text-xs text-muted-foreground">{active.subtitle}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
