import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  FileText,
  Globe,
  LayoutTemplate,
  Link2,
  MessageSquare,
  MonitorSmartphone,
  Package,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FeatureCheck, SectionBadge } from "@/components/ui/nex-ui";
import { NexDualLineTitle } from "@/components/ui/nex-typography";
import type { ServiceDetail, ServiceContentSection } from "@/data/serviceDetails";
import { getRelatedServices } from "@/data/services";
import { getIntegrationBySlug } from "@/data/integrations";
import { IntegrationIconTile } from "@/components/integrations/IntegrationIcon";
import { ServiceCatalogCard } from "@/components/services/ServiceCatalogCard";
import { ServiceCatalogVisual } from "@/components/services/ServiceCatalogVisual";
import {
  ServiceDetailSectionVisual,
  ServiceDetailSkeleton,
} from "@/components/services/ServiceDetailSkeletons";
import { SectionBackdrop } from "@/components/backgrounds/section-backdrop";
import { BottomCTA } from "@/components/sections/BottomCTA";
import { FaqKennisbankLink } from "@/components/sections/FaqKennisbankLink";
import { cn } from "@/lib/utils";
import type { SectionSurface } from "@/components/backgrounds/section-backdrop";

type ServiceDetailContentProps = {
  service: ServiceDetail;
};

const websiteTypeIcons = [LayoutTemplate, Globe, Sparkles, Rocket];
const sectionSurfaces: SectionSurface[] = ["white", "subtle", "plain", "muted"];
const bookingIntegrationSlugs = [
  "calendly",
  "microsoft-bookings",
  "google-calendar",
  "outlook-calendar",
  "acuity-scheduling",
  "simplybook",
  "fresha",
  "booksy",
];

const bookingIntegrations = bookingIntegrationSlugs
  .map((slug) => getIntegrationBySlug(slug))
  .filter((integration): integration is NonNullable<typeof integration> =>
    Boolean(integration),
  );

const FlowSectionVisual = ({
  service,
  index,
}: {
  service: ServiceDetail;
  index: number;
}) => (
  <div className="relative flex min-h-[240px] items-center justify-center md:min-h-[280px]">
    {index === 0 ? (
      <ServiceDetailSkeleton id={service.skeleton} />
    ) : (
      <ServiceDetailSectionVisual id={service.skeleton} index={index - 1} />
    )}
  </div>
);

const DetailSection = ({
  children,
  surface = "plain",
  className,
  divider = true,
  glow = false,
}: {
  children: ReactNode;
  surface?: SectionSurface;
  className?: string;
  divider?: boolean;
  glow?: boolean;
}) => {
  const surfaceBg: Record<SectionSurface, string> = {
    plain: "bg-background",
    white: "bg-card",
    muted: "nex-surface-muted",
    subtle: "nex-surface-subtle",
    dots: "bg-background",
    grid: "bg-background",
    "dots-grid": "bg-background",
    bento: "bg-background",
    framed: "nex-bg-framed",
  };

  return (
    <section
      className={cn(
        "relative overflow-hidden py-14 md:py-20",
        divider && "nex-hairline-b",
        surfaceBg[surface],
        className,
      )}
    >
      <SectionBackdrop surface={surface} glow={glow} />
      <div className="nex-container relative z-10">{children}</div>
    </section>
  );
};

const ServiceSectionText = ({
  section,
  index,
}: {
  section: ServiceContentSection;
  index: number;
}) => (
  <div className="flex flex-col justify-center">
    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary/80">
      {String(index + 1).padStart(2, "0")}
    </p>
    <h2 className="nex-subsection-title mb-5">{section.title}</h2>
    <div className="space-y-4">
      {section.paragraphs.map((paragraph) => (
        <p
          key={paragraph.slice(0, 48)}
          className="leading-relaxed text-muted-foreground"
        >
          {paragraph}
        </p>
      ))}
    </div>
    {section.bullets && section.bullets.length > 0 && (
      <ul className="mt-6 space-y-2.5">
        {section.bullets.map((bullet) => (
          <FeatureCheck key={bullet} variant="purple">
            {bullet}
          </FeatureCheck>
        ))}
      </ul>
    )}
  </div>
);

const BookingSystemsBlock = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div>
    <h2 className="nex-subsection-title mb-3">{title}</h2>
    <p className="mb-6 leading-relaxed text-muted-foreground">{description}</p>

    <div className="rounded-[1.5rem] border border-border/50 bg-card p-4 shadow-sm sm:p-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {bookingIntegrations.map((integration) => (
          <Link
            key={integration.slug}
            to={`/integraties/${integration.slug}`}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-border/40 bg-[#f8f6f1] p-3 text-center transition-colors hover:border-primary/25 hover:bg-primary/[0.04]"
          >
            <IntegrationIconTile integration={integration} />
            <span className="text-[11px] font-semibold leading-tight text-foreground">
              {integration.name}
            </span>
          </Link>
        ))}
      </div>

      <Button asChild variant="outline" className="mt-4 w-full justify-center">
        <Link to="/integraties">
          Bekijk alle koppelingen
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  </div>
);

const splitExtraBlockItem = (item: string) => {
  const separatorIndex = item.indexOf(":");

  if (separatorIndex === -1) {
    return {
      title: item,
      description: null,
    };
  }

  return {
    title: item.slice(0, separatorIndex).trim(),
    description: item.slice(separatorIndex + 1).trim(),
  };
};

const ExtraBlockItemCard = ({
  item,
  tone = "warm",
}: {
  item: string;
  tone?: "warm" | "white";
}) => {
  const { title, description } = splitExtraBlockItem(item);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/40 p-4 transition-colors duration-200 hover:border-primary/20 hover:shadow-sm",
        tone === "warm"
          ? "bg-[#f8f6f1] hover:bg-white"
          : "bg-[#f8f6f1] hover:bg-[#f3f0e8]",
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
        <Check className="h-3.5 w-3.5" />
      </div>
      {description ? (
        <>
          <h3 className="mb-1.5 text-sm font-bold leading-snug text-foreground">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </>
      ) : (
        <p className="text-sm font-medium leading-relaxed text-foreground">
          {title}
        </p>
      )}
    </motion.div>
  );
};

const stepIcons = [
  FileText,
  LayoutTemplate,
  Workflow,
  Rocket,
  Calendar,
  MessageSquare,
  Link2,
  ShieldCheck,
  Search,
  MonitorSmartphone,
];

const stepGridClass = (count: number) =>
  count === 4
    ? "md:grid-cols-2 lg:grid-cols-4"
    : count === 3
      ? "md:grid-cols-3"
      : "md:grid-cols-2";

const ProcessCard = ({
  step,
  index,
  variant = "default",
}: {
  step: ServiceDetail["steps"][number];
  index: number;
  variant?: "default" | "numbered" | "compact";
}) => {
  const Icon = stepIcons[index % stepIcons.length];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-colors duration-200 hover:border-primary/25 hover:bg-[#f8f6f1] hover:shadow-md",
        variant === "numbered" && "bg-[#0f172a] text-white",
        variant === "compact" && "bg-[#f8f6f1]",
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div
        className={cn(
          "mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white",
          variant === "numbered" && "bg-white/10 text-white",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span
        className={cn(
          "mb-3 block text-xs font-bold uppercase tracking-wider text-primary/70",
          variant === "numbered" && "text-white/45",
        )}
      >
        {step.step}
      </span>
      <h3 className={cn("mb-2 font-bold text-foreground", variant === "numbered" && "text-white")}>
        {step.title}
      </h3>
      <p
        className={cn(
          "text-sm leading-relaxed text-muted-foreground",
          variant === "numbered" && "text-white/65",
        )}
      >
        {step.description}
      </p>
    </motion.div>
  );
};

const ServiceProcessSection = ({ service }: { service: ServiceDetail }) => {
  if (service.slug === "boekingskalender") {
    return (
      <DetailSection surface="dots-grid">
        <div className="mb-10 max-w-2xl">
          <SectionBadge className="mb-4">Werkwijze</SectionBadge>
          <h2 className="nex-subsection-title mb-3">Van agenda naar boekbare flow</h2>
          <p className="text-muted-foreground">
            We richten eerst je beschikbaarheid in, koppelen daarna je systeem en
            testen de volledige afspraakflow.
          </p>
        </div>
        <div className={cn("grid gap-5", stepGridClass(service.steps.length))}>
          {service.steps.map((step, index) => (
            <ProcessCard key={step.step} step={step} index={index} variant="compact" />
          ))}
        </div>
      </DetailSection>
    );
  }

  if (service.slug === "review-management") {
    return (
      <DetailSection surface="muted">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <SectionBadge className="mb-4">Werkwijze</SectionBadge>
            <h2 className="nex-subsection-title mb-3">Van ervaring naar review</h2>
            <p className="text-muted-foreground">
              De flow draait om timing: juiste trigger, juiste boodschap en daarna
              slim publiceren of intern opvolgen.
            </p>
          </div>
          <div className="space-y-4">
            {service.steps.map((step, index) => (
              <motion.div
                key={step.step}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="group flex gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-colors duration-200 hover:border-primary/25 hover:bg-[#f8f6f1]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange text-sm font-bold text-white transition-transform duration-200 group-hover:scale-105">
                  {index + 1}
                </span>
                <div>
                  <h3 className="mb-1 font-bold text-foreground">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </DetailSection>
    );
  }

  if (service.slug === "automatiseringen") {
    return (
      <DetailSection surface="dots-grid">
        <div className="mb-12 mx-auto max-w-2xl text-center">
          <SectionBadge className="mx-auto mb-4">Werkwijze</SectionBadge>
          <h2 className="nex-subsection-title mb-3">We tekenen je flow uit</h2>
          <p className="text-muted-foreground">
            Elke stap wordt eerst begrijpelijk gemaakt, daarna pas gebouwd en
            getest.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          {service.steps.map((step, index) => (
            <div key={step.step} className="relative">
              {index > 0 && (
                <div className="absolute -left-4 top-10 hidden h-px w-4 bg-border lg:block" />
              )}
              <ProcessCard step={step} index={index} />
            </div>
          ))}
        </div>
      </DetailSection>
    );
  }

  if (service.slug === "integraties") {
    return (
      <DetailSection surface="subtle">
        <div className="mb-10 max-w-2xl">
          <SectionBadge className="mb-4">Werkwijze</SectionBadge>
          <h2 className="nex-subsection-title mb-3">Koppelen zonder ruis</h2>
          <p className="text-muted-foreground">
            Bij integraties draait alles om één betrouwbare keten: tool kiezen,
            installeren en testen.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {service.steps.map((step, index) => (
            <ProcessCard key={step.step} step={step} index={index} variant="numbered" />
          ))}
        </div>
      </DetailSection>
    );
  }

  if (service.slug === "hosting-onderhoud") {
    return (
      <DetailSection surface="muted">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <SectionBadge className="mb-4">Werkwijze</SectionBadge>
            <h2 className="nex-subsection-title mb-3">Altijd online, zonder gedoe</h2>
            <p className="text-muted-foreground">
              Hosting en onderhoud houden we bewust compact: inrichten, monitoren
              en doorlopend onderhouden.
            </p>
          </div>
          <div className="space-y-3">
            {service.steps.map((step, index) => (
              <motion.div
                key={step.step}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-colors duration-200 hover:border-emerald-500/25 hover:bg-white"
              >
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-600 transition-transform duration-200 group-hover:scale-110" />
                <div>
                  <p className="mb-1 text-xs font-bold text-primary">{step.step}</p>
                  <h3 className="mb-1 font-bold text-foreground">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </DetailSection>
    );
  }

  if (service.slug === "content-seo") {
    return (
      <DetailSection surface="white">
        <div className="mb-10 max-w-2xl">
          <SectionBadge className="mb-4">Werkwijze</SectionBadge>
          <h2 className="nex-subsection-title mb-3">Van zoekwoord naar pagina</h2>
          <p className="text-muted-foreground">
            We starten bij intentie, schrijven daarna de juiste structuur en zetten
            alles technisch goed live.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {service.steps.map((step, index) => (
            <ProcessCard key={step.step} step={step} index={index} variant="compact" />
          ))}
        </div>
      </DetailSection>
    );
  }

  return (
    <DetailSection surface="dots-grid">
      <div className="mb-12 mx-auto max-w-2xl text-center">
        <SectionBadge className="mx-auto mb-4">Werkwijze</SectionBadge>
        <h2 className="nex-subsection-title mb-3">Zo werkt het</h2>
        <p className="text-muted-foreground">
          Van eerste gesprek tot livegang: heldere stappen en persoonlijke
          begeleiding.
        </p>
      </div>

      <div className={cn("grid gap-6", stepGridClass(service.steps.length))}>
        {service.steps.map((step, index) => (
          <ProcessCard key={step.step} step={step} index={index} />
        ))}
      </div>
    </DetailSection>
  );
};

export const ServiceDetailContent = ({ service }: ServiceDetailContentProps) => {
  const relatedServices = getRelatedServices(service.slug, 3);

  return (
    <>
      <section className="relative overflow-visible border-b border-border/40 bg-[#f8f6f1] nex-hairline-b">
        <SectionBackdrop surface="subtle" />
        <div className="nex-container relative z-10 py-10 md:py-14 lg:py-16">
          <Link
            to="/diensten"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Alle diensten
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.92fr] lg:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SectionBadge className="mb-4">{service.title}</SectionBadge>
              <h1 className="nex-display mb-4 max-w-xl">{service.title}</h1>
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {service.tagline}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg" variant="brand">
                  <Link to="/contact">Plan demo</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/pricing#hoofdpakketten">
                    Bekijk pakketten
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              <ServiceCatalogVisual slug={service.slug} skeletonId={service.skeleton} />
            </motion.div>
          </div>
        </div>
      </section>

      <DetailSection surface="white" className="py-8 md:py-10" divider>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {service.highlights.map((item, index) => (
            <motion.div
              key={item}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-xl border border-border/40 bg-[#fafafa] px-4 py-4 transition-colors duration-200 hover:border-primary/20 hover:bg-white hover:shadow-sm"
            >
              <span className="mb-3 block font-sans text-2xl font-bold text-primary/25 transition-colors group-hover:text-primary/40">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm font-medium leading-snug text-foreground">
                  {item}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </DetailSection>

      {service.sections.map((section, index) => {
        const flip = index % 2 === 1;

        return (
          <DetailSection
            key={section.title}
            surface={sectionSurfaces[index % sectionSurfaces.length]}
          >
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
              {flip ? (
                <>
                  <FlowSectionVisual service={service} index={index} />
                  <ServiceSectionText section={section} index={index} />
                </>
              ) : (
                <>
                  <ServiceSectionText section={section} index={index} />
                  <FlowSectionVisual service={service} index={index} />
                </>
              )}
            </div>
          </DetailSection>
        );
      })}

      {service.websiteTypes && service.websiteTypes.length > 0 && (
        <DetailSection surface="muted">
          <div className="mb-10 max-w-2xl">
            <SectionBadge className="mb-4">Website types</SectionBadge>
            <h2 className="nex-subsection-title mb-3">
              Welk type website past bij jou?
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Van een compacte funnel tot een volledig platform. Wij bouwen wat
              past bij je fase en ambities.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {service.websiteTypes.map((type, index) => {
              const Icon = websiteTypeIcons[index % websiteTypeIcons.length];
              return (
                <motion.div
                  key={type.title}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="group rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-colors duration-200 hover:border-primary/25 hover:bg-[#f8f6f1] hover:shadow-md md:p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground">
                    {type.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                    {type.description}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Past bij: {type.bestFor}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </DetailSection>
      )}

      {service.extraBlocks?.map((block, blockIndex) => (
        <DetailSection
          key={block.title}
          surface={blockIndex % 2 === 0 ? "subtle" : "white"}
        >
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {blockIndex % 2 === 0 ? (
              <>
                <ServiceDetailSectionVisual
                  id={service.skeleton}
                  index={service.sections.length + blockIndex}
                />
                {block.title === "Ondersteunde boekingssystemen" ? (
                  <BookingSystemsBlock
                    title={block.title}
                    description={block.description}
                  />
                ) : (
                  <div>
                    <h2 className="nex-subsection-title mb-3">{block.title}</h2>
                    <p className="mb-6 leading-relaxed text-muted-foreground">
                      {block.description}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {block.items.map((item) => (
                        <ExtraBlockItemCard key={item} item={item} tone="warm" />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {block.title === "Ondersteunde boekingssystemen" ? (
                  <BookingSystemsBlock
                    title={block.title}
                    description={block.description}
                  />
                ) : (
                  <div>
                    <h2 className="nex-subsection-title mb-3">{block.title}</h2>
                    <p className="mb-6 leading-relaxed text-muted-foreground">
                      {block.description}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {block.items.map((item) => (
                        <ExtraBlockItemCard key={item} item={item} tone="white" />
                      ))}
                    </div>
                  </div>
                )}
                <ServiceDetailSectionVisual
                  id={service.skeleton}
                  index={service.sections.length + blockIndex}
                />
              </>
            )}
          </div>
        </DetailSection>
      ))}

      <ServiceProcessSection service={service} />

      <section className="relative overflow-hidden border-y border-border/40 bg-[#f5f5f7] py-14 md:py-16 nex-hairline-b">
        <SectionBackdrop surface="subtle" glow />
        <div className="nex-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0f172a] p-7 text-white shadow-[0_24px_80px_-36px_rgba(15,23,42,0.65)] md:p-10 lg:p-12"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/30 blur-3xl transition-opacity duration-300 group-hover:opacity-80" />
            <div className="pointer-events-none absolute -bottom-28 left-1/4 h-52 w-52 rounded-full bg-brand-orange/20 blur-3xl" />
            <div className="relative z-10 flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                  <Package className="h-3.5 w-3.5 text-brand-orange" />
                  Aanbevolen: {service.recommendedPlans.join(" · ")}
                </div>
                <h2 className="mb-4 font-sans text-3xl font-bold tracking-[-0.03em] text-white md:text-4xl">
                  Bekijk het pakket dat bij deze dienst past
                </h2>
                <p className="max-w-xl leading-relaxed text-white/65">
                  {service.pricingTeaser}
                </p>
              </div>

              <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row md:flex-col lg:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-foreground hover:bg-white/90"
                >
                  <Link to="/pricing#hoofdpakketten">
                    Bekijk pakketten
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link to="/contact">Vrijblijvend advies</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {service.faqs.length > 0 && (
        <DetailSection surface="white">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14">
            <div>
              <SectionBadge className="mb-4">FAQ</SectionBadge>
              <NexDualLineTitle
                sans="Veelgestelde"
                serif="vragen"
                align="left"
                serifClassName="!font-sans !font-semibold text-foreground"
                className="mb-3 [&_.nex-type-section-sans]:text-xl [&_.nex-type-section-sans]:md:text-2xl [&_.nex-type-section-serif]:text-xl [&_.nex-type-section-serif]:md:text-2xl"
              />
              <p className="mb-4 leading-relaxed text-muted-foreground">
                Staat je vraag er niet tussen? Plan gerust een demo. We lopen
                alles met je door.
              </p>
              <FaqKennisbankLink />
            </div>

            <Accordion type="single" collapsible>
              {service.faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`faq-${index}`}
                  variant="flat"
                  className="border-b border-foreground/10"
                >
                  <AccordionTrigger className="py-5 text-left text-[15px] font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-[15px] leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </DetailSection>
      )}

      {relatedServices.length > 0 && (
        <section className="relative overflow-hidden border-t border-border/40 bg-background py-16 md:py-20">
          <SectionBackdrop surface="grid" />
          <div className="nex-container relative z-10">
            <SectionBadge className="mb-4">Meer diensten</SectionBadge>
            <h2 className="nex-subsection-title mb-8">
              Ontdek ook onze andere diensten
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((item) => (
                <ServiceCatalogCard key={item.slug} service={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <BottomCTA />
    </>
  );
};
