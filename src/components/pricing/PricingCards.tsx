import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PricingCard } from "@/components/ui/nex-ui";
import { Button } from "@/components/ui/button";
import { pricingPackages } from "@/data/pricing";

const standardPackages = pricingPackages.filter((pkg) => pkg.id !== "maatwerk");
const maatwerkPackage = pricingPackages.find((pkg) => pkg.id === "maatwerk")!;

const MaatwerkBanner = () => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, delay: 0.24 }}
    className="mt-5 md:mt-6 rounded-2xl border border-border/40 bg-[#f8f6f1] p-7 md:p-8 shadow-card"
  >
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
      <div className="min-w-0 flex-1 text-center sm:text-left">
        <p className="text-xl md:text-2xl font-bold text-foreground mb-1">
          {maatwerkPackage.name}
        </p>
        <p className="text-sm font-medium text-muted-foreground mb-4">
          {maatwerkPackage.price}
        </p>
        <p className="max-w-2xl text-sm md:text-base leading-relaxed text-muted-foreground mx-auto sm:mx-0">
          {maatwerkPackage.description}
        </p>
      </div>

      <Link to={maatwerkPackage.ctaHref} className="shrink-0 sm:w-auto w-full">
        <Button variant="brand" className="w-full sm:w-auto sm:min-w-[180px]">
          {maatwerkPackage.cta}
        </Button>
      </Link>
    </div>
  </motion.div>
);

export const PricingCards = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {standardPackages.map((pkg, index) => (
          <PricingCard
            key={pkg.id}
            index={index}
            name={pkg.name}
            price={pkg.price}
            pricePrefix={pkg.pricePrefix}
            priceDetail={pkg.priceDetail}
            description={pkg.description}
            features={pkg.features}
            cta={pkg.cta}
            ctaHref={pkg.ctaHref}
            highlighted={pkg.highlighted}
            badge={pkg.badge}
          />
        ))}
      </div>

      <MaatwerkBanner />
    </div>
  );
};
