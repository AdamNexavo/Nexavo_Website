import { motion } from "framer-motion";
import { Bell, Globe, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const PricingHeroSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="relative w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[480px] mx-auto lg:mx-0 lg:ml-auto"
    >
      <motion.div
        whileHover={{
          y: -4,
          scale: 1.01,
          transition: { type: "spring", stiffness: 400, damping: 20 },
        }}
        className="rounded-xl border border-[#e8e6e2] bg-white p-2 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.14)]"
      >
        {/* Browser — website skeleton */}
        <div className="overflow-hidden rounded-lg border border-[#ebe8e4] bg-white">
          <div className="flex items-center gap-1.5 border-b border-[#ebe8e4] bg-[#f8f7f5] px-2 py-1.5">
            <div className="flex gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-[#e0ddd8]" />
              <div className="h-1.5 w-1.5 rounded-full bg-[#e0ddd8]" />
              <div className="h-1.5 w-1.5 rounded-full bg-[#e0ddd8]" />
            </div>
            <div className="mx-1 flex-1">
              <div className="mx-auto flex max-w-[200px] items-center gap-1 rounded-md border border-[#ebe8e4] bg-white px-2 py-0.5 text-[9px] text-muted-foreground">
                <Globe className="h-2.5 w-2.5 shrink-0 text-emerald-600" />
                <span className="truncate">jouwbedrijf.nl</span>
              </div>
            </div>
          </div>

          <div className="p-2">
            <div className="mb-2 flex items-center justify-between">
              <div className="h-3 w-14 rounded-lg bg-primary" />
              <div className="flex gap-3">
                <div className="h-1 w-10 rounded bg-[#eceae6]" />
                <div className="h-1 w-10 rounded bg-[#eceae6]" />
                <div className="h-1 w-10 rounded bg-[#eceae6]" />
              </div>
            </div>

            <div className="mb-2 flex gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-1 h-2 w-4/5 rounded bg-foreground/80" />
                <div className="mb-1.5 h-2 w-3/5 rounded bg-foreground/80" />
                <div className="mb-0.5 h-1 w-full rounded bg-[#eceae6]" />
                <div className="mb-1.5 h-1 w-11/12 rounded bg-[#eceae6]" />
                <div className="h-4 w-16 rounded-lg bg-primary" />
              </div>
              <div className="h-10 w-24 shrink-0 rounded-md border border-[#ebe8e4] bg-gradient-to-br from-primary/20 to-brand-orange/10" />
            </div>

            <div className="mb-2 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className={cn("flex-1 rounded-md border border-[#ebe8e4] bg-[#fafaf9] p-1")}>
                  <div
                    className={`mb-0.5 h-3.5 w-3.5 rounded ${
                      i === 1 ? "bg-brand-orange/20" : "bg-primary/20"
                    }`}
                  />
                  <div className="mb-0.5 h-1 w-full rounded bg-[#eceae6]" />
                  <div className="h-1 w-2/3 rounded bg-[#eceae6]" />
                </div>
              ))}
            </div>

            {/* Automatiseringen — ingebouwd onder website */}
            <div className="border-t border-[#ebe8e4] pt-2">
              <div className="mb-1.5 flex items-center justify-center">
                <Badge
                  variant="outline"
                  className="rounded-md px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-primary shadow-sm"
                >
                  Automatiseringen
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {/* Mini kalender */}
                <div className={cn("rounded-md border border-[#ebe8e4] bg-[#fafaf9] p-1")}>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="h-1.5 w-16 rounded bg-[#eceae6]" />
                    <div className="flex gap-0.5">
                      <div className="h-3 w-3 rounded-sm border border-[#ebe8e4] bg-white" />
                      <div className="h-3 w-3 rounded-sm border border-[#ebe8e4] bg-white" />
                    </div>
                  </div>
                  <div className="mb-1 grid grid-cols-7 gap-px">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className={`aspect-square rounded-[2px] ${
                          i === 1 || i === 5
                            ? "bg-primary"
                            : i === 3
                              ? "bg-brand-orange/30"
                              : "bg-[#eceae6]"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3.5 w-3.5 shrink-0 rounded-md bg-[#eceae6]" />
                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 h-1 w-full rounded bg-[#eceae6]" />
                      <div className="h-1 w-2/3 rounded bg-[#eceae6]" />
                    </div>
                  </div>
                </div>

                {/* Review flow */}
                <div className={cn("flex flex-col rounded-md border border-[#ebe8e4] bg-[#fafaf9] p-1")}>
                  <div className="mb-1 flex items-center gap-1">
                    <div className="h-4 w-4 shrink-0 rounded-md bg-[#eceae6]" />
                    <div className="flex-1">
                      <div className="mb-0.5 h-1.5 w-12 rounded bg-[#eceae6]" />
                      <div className="flex gap-px">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className="w-1.5 h-1.5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 rounded border border-[#ebe8e4] bg-white p-1">
                    <div className="mb-0.5 h-1 w-full rounded bg-[#eceae6]" />
                    <div className="mb-1 h-1 w-4/5 rounded bg-[#eceae6]" />
                    <div className="ml-auto h-2.5 w-14 rounded bg-[#f0fdf4]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating herinnering */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="absolute -left-3 bottom-8 hidden items-center gap-1.5 rounded-xl border border-[#e8e6e2] bg-white p-1.5 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.14)] sm:flex"
      >
        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Bell className="w-2.5 h-2.5 text-primary" />
        </div>
        <div>
          <p className="text-[9px] font-semibold leading-tight">Herinnering verstuurd</p>
          <p className="text-[8px] text-muted-foreground">Afspraak morgen 10:00</p>
        </div>
      </motion.div>

      {/* Floating review */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="absolute -right-3 top-8 hidden rounded-xl border border-[#e8e6e2] bg-white p-1.5 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.14)] sm:block"
      >
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
          </div>
          <div>
            <p className="text-[9px] font-semibold leading-tight">Nieuwe review</p>
            <p className="text-[8px] text-muted-foreground">5 sterren ontvangen</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
