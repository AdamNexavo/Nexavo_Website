import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import {
  comparisonSections,
  planIds,
  planLabels,
  cellValueLabels,
  type CellValue,
  type PlanId,
} from "@/data/pricing";
import { cn } from "@/lib/utils";

const isCellValue = (value: string): value is CellValue =>
  value in cellValueLabels;

const ComparisonCell = ({ value }: { value: string }) => {
  if (isCellValue(value)) {
    if (value === "included") {
      return (
        <span className="inline-flex items-center justify-center">
          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-muted-foreground" />
          </span>
        </span>
      );
    }

    if (value === "not_included") {
      return (
        <span className="inline-flex items-center justify-center">
          <X className="w-4 h-4 text-muted-foreground/50" />
        </span>
      );
    }

    return (
      <span className="text-sm text-muted-foreground">
        {cellValueLabels[value]}
      </span>
    );
  }

  return <span className="text-sm font-medium text-foreground">{value}</span>;
};

const gridCols =
  "grid grid-cols-[minmax(140px,1.2fr)_repeat(5,minmax(72px,1fr))] min-w-[880px]";

const getHeaderClass = (planId: PlanId, selectedPlan: PlanId) => {
  const isSelected = selectedPlan === planId;
  const idle =
    "bg-white text-foreground border border-border/80 hover:border-border hover:shadow-sm";

  if (!isSelected) return idle;

  if (selectedPlan === "groei") {
    return cn(
      "bg-white text-foreground border border-primary/35 shadow-pricing-highlight",
    );
  }

  return "bg-white text-foreground border border-foreground/30 shadow-sm";
};

const getColumnHighlightClass = (planId: PlanId, selectedPlan: PlanId) => {
  if (selectedPlan !== planId) return "";

  if (selectedPlan === "groei") {
    return "border border-primary/20 bg-primary/[0.05]";
  }

  return "border border-foreground/15 bg-foreground/[0.04]";
};

export const PricingComparisonTable = () => {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("groei");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      <p className="text-center text-sm text-muted-foreground -mt-4 mb-2">
        Klik op een pakket om die kolom te bekijken
      </p>

      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div
          className={cn(
            gridCols,
            "sticky top-[4.5rem] z-20 gap-4 items-end rounded-2xl bg-muted/80 backdrop-blur-sm px-6 py-4 border border-border",
          )}
        >
          <div />
          {planIds.map((planId) => (
            <div
              key={planId}
              className="flex flex-col items-center justify-end gap-2"
            >
              {planId === "groei" ? (
                <span className="inline-flex items-center rounded-full border border-brand-orange/25 bg-brand-orange/10 px-2 py-0.5 text-[10px] font-semibold leading-none text-brand-orange/90">
                  Populair
                </span>
              ) : (
                <span className="h-[22px]" aria-hidden="true" />
              )}
              <button
                type="button"
                onClick={() => setSelectedPlan(planId)}
                aria-pressed={selectedPlan === planId}
                className={cn(
                  "w-full cursor-pointer rounded-xl border px-2 py-2.5 text-center text-sm font-semibold transition-[border-color,box-shadow,background-color] duration-200",
                  getHeaderClass(planId, selectedPlan),
                )}
              >
                {planLabels[planId]}
              </button>
            </div>
          ))}
        </div>
      </div>

      {comparisonSections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: sectionIndex * 0.05 }}
          className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0"
        >
          <div className="bg-white rounded-xl border border-border/80 shadow-card overflow-hidden min-w-[880px]">
            <div className="px-6 py-4 border-b border-border/50 bg-[rgb(var(--surface-subtle))]">
              <h3 className="text-base font-bold text-foreground">
                {section.title}
              </h3>
            </div>

            <div className="relative">
              {section.rows.map((row, rowIndex) => (
                <div
                  key={`${section.title}-${row.label}`}
                  className="relative border-b border-border/40 last:border-b-0"
                >
                  {rowIndex % 2 === 1 && (
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-[#fafafa] pointer-events-none"
                    />
                  )}

                  <div
                    className={cn(
                      gridCols,
                      "relative z-10 gap-4 items-center px-6 py-4",
                    )}
                  >
                    <span className="relative z-10 text-sm font-medium text-foreground pr-2">
                      {row.label}
                    </span>
                    {planIds.map((planId) => (
                      <div
                        key={planId}
                        className="relative z-10 flex items-center justify-center py-1 px-2 min-h-[36px]"
                      >
                        <ComparisonCell
                          value={row.values[planId as PlanId]}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div
                aria-hidden
                className="absolute left-6 right-6 top-2 bottom-2 pointer-events-none z-[5]"
              >
                <div className={cn(gridCols, "gap-4 h-full")}>
                  <div />
                  {planIds.map((planId) => (
                    <div
                      key={planId}
                      className={cn(
                        "h-full",
                        getColumnHighlightClass(planId, selectedPlan),
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
