import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { integrations } from "@/data/integrations";
import { IntegrationIconTile } from "./IntegrationIcon";
import { SectionBadge } from "@/components/ui/nex-ui";
import { NexDualLineTitle } from "@/components/ui/nex-typography";
import { DenseGridBackground } from "@/components/backgrounds/dense-grid-background";
import { SectionLines } from "@/components/backgrounds/section-lines";

const heroIntegrations = (() => {
  const list = [...integrations];
  const businessIndex = list.findIndex(
    (integration) => integration.slug === "whatsapp-business",
  );

  if (businessIndex === -1) return list;

  const [whatsappBusiness] = list.splice(businessIndex, 1);
  const insertIndex = Math.min(28, list.length);
  list.splice(insertIndex, 0, whatsappBusiness);

  return list;
})();

export const IntegrationsHero = () => {
  return (
    <section className="nex-page-hero-muted relative overflow-hidden">
      <SectionLines />
      <DenseGridBackground />
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[min(800px,90vw)] h-[400px] rounded-full bg-primary/[0.05] blur-3xl" />
      </div>
      <div className="nex-container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-14">
          <SectionBadge className="mx-auto">Koppelingen</SectionBadge>
          <NexDualLineTitle
            as="h1"
            size="display"
            sans="Eén platform,"
            serif="eindeloze mogelijkheden"
            className="mb-5"
          />
          <p className="nex-section-intro mx-auto mb-8">
            Laat je website en automatiseringen samenwerken met de tools die je
            team al gebruikt.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg">
              <a href="#integraties-catalogus">Bekijk koppelingen</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Plan demo</Link>
            </Button>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div
            className="overflow-hidden rounded-2xl border border-[#e8e6e2] bg-white"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 0%, black 48%, transparent 82%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 48%, transparent 82%, transparent 100%)",
            }}
          >
            <div className="grid max-h-[360px] grid-cols-4 divide-x divide-y divide-[#ebe8e4] overflow-hidden sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
              {heroIntegrations.map((integration) => (
                <Link
                  key={integration.slug}
                  to={`/integraties/${integration.slug}`}
                  className="flex h-14 items-center justify-center bg-[#f4f4f5] p-2 transition-colors hover:bg-[#ececee] sm:h-16"
                  title={integration.name}
                >
                  <IntegrationIconTile integration={integration} bare />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
