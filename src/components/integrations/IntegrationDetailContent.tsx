import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Globe,
  Headphones,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getCategoryLabel,
  getIntegrationsByCategory,
  type Integration,
} from "@/data/integrations";
import { IntegrationAppCard } from "./IntegrationAppCard";
import { IntegrationIconTile } from "./IntegrationIcon";

type IntegrationDetailContentProps = {
  integration: Integration;
};

export const IntegrationDetailContent = ({
  integration,
}: IntegrationDetailContentProps) => {
  const relatedIntegrations = getIntegrationsByCategory(integration.category)
    .filter((item) => item.slug !== integration.slug)
    .slice(0, 6);

  return (
    <>
      <section className="nex-page-hero pb-10 md:pb-14">
        <div className="container">
          <Link
            to="/integraties"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Alle koppelingen
          </Link>

          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
            <IntegrationIconTile integration={integration} xl />
            <div className="flex-1 min-w-0">
              <h1 className="nex-display mb-3">{integration.name}</h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-6">
                {integration.tagline}
              </p>
              <Button
                asChild
                className="rounded-full bg-foreground hover:bg-foreground/90 text-white px-6"
              >
                <Link to="/contact">Plan demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            <aside className="lg:w-72 shrink-0">
              {integration.verified && (
                <div className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200/80 px-3 py-1.5 mb-6">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Officiële koppeling
                  </span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Gebouwd door
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {integration.builtBy}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Categorie
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Play className="w-3.5 h-3.5" />
                    {getCategoryLabel(integration.category)}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-3">
                    Bronnen
                  </p>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="https://nexavo.nl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Website
                      </a>
                    </li>
                    <li>
                      <Link
                        to="/diensten"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <BookOpen className="w-4 h-4" />
                        Documentatie
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Headphones className="w-4 h-4" />
                        Support
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <Button
                asChild
                variant="outline"
                className="mt-8 w-full rounded-full border-border"
              >
                <Link to="/contact">Plan demo</Link>
              </Button>
            </aside>

            <div className="flex-1 min-w-0 lg:border-l lg:border-border/40 lg:pl-16">
              <div className="space-y-10">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Overzicht
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {integration.overview}
                  </p>
                </div>

                <div className="border-t border-border/40 pt-10">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Hoe het werkt
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {integration.howItWorks}
                  </p>
                </div>

                <div className="border-t border-border/40 pt-10">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Configureren
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {integration.configure}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedIntegrations.length > 0 && (
        <section className="py-16 md:py-20 bg-[#fafafa] border-t border-border/40">
          <div className="container">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-6">
              Andere koppelingen in {getCategoryLabel(integration.category)}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedIntegrations.map((item) => (
                <IntegrationAppCard key={item.slug} integration={item} compact />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};
