import { forwardRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ProcessDashboardSkeleton } from "@/components/sections/ProcessDashboardSkeleton";
import { IntegrationIcon } from "@/components/integrations/IntegrationIcon";
import { pricingFeaturedIntegrations } from "@/data/integrations";

export const MINI_DASHBOARD_W = 920;
export const MINI_DASHBOARD_H = 720;

function getResponsiveDashboardScale(width: number) {
  if (width >= 1536) return 0.6;
  if (width >= 1280) return 0.57;
  if (width >= 1024) return 0.54;
  if (width >= 768) return 0.48;
  if (width >= 640) return 0.44;
  return 0.4;
}

const heroIntegrationMask = {
  maskImage:
    "linear-gradient(to bottom, black 0%, black 48%, transparent 82%, transparent 100%)",
  WebkitMaskImage:
    "linear-gradient(to bottom, black 0%, black 48%, transparent 82%, transparent 100%)",
};

const benefitsCardShadow =
  "shadow-[0_20px_50px_-28px_rgba(15,23,42,0.22)]";

export const BenefitsMiniDashboard = forwardRef<HTMLDivElement>((_, ref) => {
  const [scale, setScale] = useState(() =>
    typeof window !== "undefined"
      ? getResponsiveDashboardScale(window.innerWidth)
      : 0.54,
  );

  useEffect(() => {
    const update = () => setScale(getResponsiveDashboardScale(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const visualW = MINI_DASHBOARD_W * scale;
  const visualH = MINI_DASHBOARD_H * scale;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: 0.1 }}
      className="relative shrink-0"
      style={{ width: visualW, height: visualH }}
    >
      <div
        className="pointer-events-none absolute -left-4 top-8 h-36 w-48 rounded-full bg-primary/[0.06] blur-3xl"
        aria-hidden
      />
      <div
        className={`absolute inset-0 overflow-hidden rounded-[1.25rem] md:rounded-[1.5rem] ${benefitsCardShadow}`}
      >
        <div
          className="origin-top-left"
          style={{
            width: MINI_DASHBOARD_W,
            transform: `scale(${scale})`,
          }}
        >
          <ProcessDashboardSkeleton activeStep={2} />
        </div>
      </div>
    </motion.div>
  );
});
BenefitsMiniDashboard.displayName = "BenefitsMiniDashboard";

export const BenefitsIntegrationsStrip = forwardRef<HTMLDivElement>((_, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.35 }}
    className="relative ml-4 w-full max-w-[17.5rem] sm:max-w-xs lg:ml-6"
  >
    <div
      className={`overflow-hidden rounded-xl border border-border bg-card ${benefitsCardShadow}`}
      style={heroIntegrationMask}
    >
      <div className="grid max-h-[9.5rem] grid-cols-4 divide-x divide-y divide-border/60 overflow-hidden sm:grid-cols-6">
        {pricingFeaturedIntegrations.map((integration) => (
          <Link
            key={integration.slug}
            to={`/integraties/${integration.slug}`}
            className="flex h-9 items-center justify-center bg-card p-1 transition-colors hover:bg-muted/50 sm:h-10"
            title={integration.name}
          >
            <IntegrationIcon
              integration={integration}
              size="sm"
              className="!h-4 !w-4 !max-h-4 !max-w-[1.125rem]"
            />
          </Link>
        ))}
        <Link
          to="/integraties"
          className="flex h-9 items-center justify-center bg-[#f5f5f7] p-1 transition-colors hover:bg-muted/50 sm:h-10"
        >
          <span className="font-sans text-sm font-bold tracking-tight text-primary">
            +40
          </span>
        </Link>
      </div>
    </div>
  </motion.div>
));
BenefitsIntegrationsStrip.displayName = "BenefitsIntegrationsStrip";
