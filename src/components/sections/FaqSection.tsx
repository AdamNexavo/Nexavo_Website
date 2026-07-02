import { motion } from "framer-motion";
import { NexDualLineTitle } from "@/components/ui/nex-typography";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
import { SectionBadge } from "@/components/ui/nex-ui";
import { SectionLines } from "@/components/backgrounds/section-lines";
import { FaqKennisbankLink } from "@/components/sections/FaqKennisbankLink";
import { cn } from "@/lib/utils";

export type FaqItem = {
  question: string;
  answer: string;
};

const DEFAULT_INTRO =
  "Alles wat je wilt weten over Nexavo. Staat je vraag er niet tussen? Neem gerust contact op. We helpen je graag verder.";

type FaqSectionProps = {
  faqs: FaqItem[];
  label?: string;
  titleSans?: ReactNode;
  titleSerif?: ReactNode;
  intro?: string;
  showContactCta?: boolean;
  kennisbankHint?: string;
  alignTitleWithAccordion?: boolean;
  purpleKennisbankLink?: boolean;
  titleInline?: boolean;
};

export const FaqSection = ({
  faqs,
  label = "Vragen",
  titleSans = "Veelgestelde",
  titleSerif = "vragen",
  intro = DEFAULT_INTRO,
  showContactCta = true,
  kennisbankHint,
  alignTitleWithAccordion = false,
  purpleKennisbankLink = false,
  titleInline = false,
}: FaqSectionProps) => {
  return (
    <section className="relative overflow-hidden bg-[#f5f5f7] py-20 md:py-24">
      <SectionLines />
      <div className="pointer-events-none absolute -left-28 top-24 h-72 w-72 rounded-full bg-primary/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-24 h-64 w-64 rounded-full bg-brand-orange/10 blur-3xl" />
      <div className="container relative z-10">
        <div
          className={cn(
            "grid items-start gap-12 lg:grid-cols-2 lg:gap-16",
            alignTitleWithAccordion && "lg:items-start",
          )}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn(
              "relative",
              alignTitleWithAccordion
                ? "lg:mt-6"
                : "lg:sticky lg:top-28",
            )}
          >
            <SectionBadge
              className={cn(alignTitleWithAccordion ? "!mb-3" : "mb-6")}
            >
              {label}
            </SectionBadge>
            <NexDualLineTitle
              sans={titleSans}
              serif={titleSerif}
              align="left"
              inline={titleInline}
              serifClassName="!font-sans !font-bold text-foreground"
              className={cn(
                "mb-5",
                titleInline
                  ? "[&_.nex-type-section-sans]:text-[1.75rem] [&_.nex-type-section-sans]:md:text-[2.25rem] [&_.nex-type-section-serif]:text-[1.75rem] [&_.nex-type-section-serif]:md:text-[2.25rem]"
                  : "[&_.nex-type-section-sans]:text-[2.25rem] [&_.nex-type-section-sans]:md:text-[3rem] [&_.nex-type-section-serif]:text-[2.25rem] [&_.nex-type-section-serif]:md:text-[3rem]",
              )}
            />
            <p className="nex-body-lg mb-8 max-w-md">{intro}</p>
            {(showContactCta || kennisbankHint) && (
              <div className="space-y-3">
                {kennisbankHint && (
                  <p className="text-sm text-muted-foreground">{kennisbankHint}</p>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  {showContactCta && (
                    <Link to="/contact">
                      <Button variant="brand" className="group">
                        Neem contact op
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Button>
                    </Link>
                  )}
                  <FaqKennisbankLink purple={purpleKennisbankLink} />
                </div>
              </div>
            )}
            {!showContactCta && !kennisbankHint && (
              <FaqKennisbankLink purple={purpleKennisbankLink} />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative min-h-0"
          >
            <div className="relative">
              <div className="max-h-[min(480px,58vh)] overflow-y-auto md:max-h-[min(520px,62vh)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <Accordion type="single" collapsible className="pb-16">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={faq.question}
                      value={`item-${index}`}
                      variant="flat"
                      className="border-b border-foreground/15 last:border-b-0"
                    >
                      <AccordionTrigger className="py-5 text-left text-[15px] font-semibold text-black hover:no-underline hover:text-black md:text-base">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 text-[15px] leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48 md:h-56"
                style={{
                  background:
                    "linear-gradient(to top, #f5f5f7 0%, rgba(245, 245, 247, 0.95) 12%, rgba(245, 245, 247, 0.72) 32%, rgba(245, 245, 247, 0.42) 58%, rgba(245, 245, 247, 0.15) 78%, transparent 100%)",
                }}
                aria-hidden
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
