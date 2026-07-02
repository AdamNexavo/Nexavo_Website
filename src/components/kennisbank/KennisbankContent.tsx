import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, HelpCircle, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionBackdrop } from "@/components/backgrounds/section-backdrop";
import { SectionLines } from "@/components/backgrounds/section-lines";
import { SectionBadge } from "@/components/ui/nex-ui";
import { cn } from "@/lib/utils";
import {
  knowledgeCategories,
  knowledgeBaseStats,
  popularArticles,
  searchKnowledgeBase,
} from "@/data/knowledgeBase";

export const KennisbankHero = () => {
  const [query, setQuery] = useState("");

  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-[#f8f6f1]">
      <SectionLines opacity="subtle" />
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-brand-orange/10 blur-3xl" />

      <div className="nex-container relative z-10 pb-12 pt-20 md:pb-16 md:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <SectionBadge className="mx-auto mb-5">Kennisbank</SectionBadge>
          <h1 className="mb-4 font-sans text-[2.5rem] font-bold leading-tight tracking-[-0.03em] text-foreground md:text-[3.25rem]">
            Hoe kunnen we je helpen?
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Zoek in {knowledgeBaseStats.articles} artikelen over websites, pakketten,
            automatiseringen, boekingen en support. Alles op één plek, overzichtelijk per
            categorie.
          </p>

          <div className="relative mx-auto max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Zoek op onderwerp, vraag of trefwoord..."
              className="h-12 rounded-2xl border-border/60 bg-white pl-12 pr-4 text-base shadow-sm"
              aria-label="Zoek in de kennisbank"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-white/80 px-3 py-1">
              <BookOpen className="h-3.5 w-3.5" />
              {knowledgeBaseStats.categories} categorieën
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-white/80 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" />
              {knowledgeBaseStats.articles} artikelen
            </span>
          </div>
        </div>

        <KennisbankBrowse query={query} onQueryChange={setQuery} embedded />
      </div>
    </section>
  );
};

type KennisbankBrowseProps = {
  query?: string;
  onQueryChange?: (value: string) => void;
  embedded?: boolean;
};

export const KennisbankBrowse = ({
  query: externalQuery,
  onQueryChange,
  embedded = false,
}: KennisbankBrowseProps) => {
  const [internalQuery, setInternalQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");

  const query = externalQuery ?? internalQuery;
  const setQuery = onQueryChange ?? setInternalQuery;

  const searchResults = useMemo(() => searchKnowledgeBase(query), [query]);

  const visibleCategories = useMemo(() => {
    if (!query.trim()) {
      return activeCategory === "all"
        ? knowledgeCategories
        : knowledgeCategories.filter((category) => category.id === activeCategory);
    }

    const resultIds = new Set(searchResults.map((article) => article.categoryId));

    return knowledgeCategories
      .filter((category) => resultIds.has(category.id))
      .map((category) => ({
        ...category,
        articles: category.articles.filter((article) =>
          searchResults.some((result) => result.id === article.id),
        ),
      }))
      .filter((category) => category.articles.length > 0);
  }, [activeCategory, query, searchResults]);

  const showPopular = !query.trim() && activeCategory === "all";

  const content = (
    <div className={cn("grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-10", embedded && "mt-12")}>
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-2xl border border-border/40 bg-white p-4 shadow-sm md:p-5">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Categorieën
          </p>
          <nav className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={cn(
                "rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                activeCategory === "all"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-[#f5f5f7]",
              )}
            >
              Alle onderwerpen
              <span className="ml-1 text-muted-foreground">({knowledgeBaseStats.articles})</span>
            </button>
            {knowledgeCategories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-[#f5f5f7]",
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/50",
                      isActive ? "bg-white text-primary" : "bg-[#fafafa] text-muted-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-tight">{category.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {category.articles.length} artikelen
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="min-w-0 space-y-8">
        {query.trim() && (
          <div className="rounded-2xl border border-border/40 bg-white px-5 py-4">
            <p className="text-sm text-muted-foreground">
              {searchResults.length === 0 ? (
                <>
                  Geen resultaten voor <strong className="text-foreground">"{query}"</strong>.
                  Probeer een ander trefwoord of{" "}
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="font-semibold text-primary hover:underline"
                  >
                    wis je zoekopdracht
                  </button>
                  .
                </>
              ) : (
                <>
                  <strong className="text-foreground">{searchResults.length}</strong>{" "}
                  {searchResults.length === 1 ? "resultaat" : "resultaten"} voor{" "}
                  <strong className="text-foreground">"{query}"</strong>
                </>
              )}
            </p>
          </div>
        )}

        {showPopular && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-orange" />
              <h2 className="text-lg font-bold text-foreground">Populaire artikelen</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {popularArticles.map((article) => (
                <a
                  key={article.id}
                  href={`#${article.id}`}
                  className="group rounded-2xl border border-border/40 bg-white p-4 transition-all hover:border-primary/25 hover:shadow-sm"
                >
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    {article.categoryTitle}
                  </p>
                  <p className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
                    {article.question}
                  </p>
                </a>
              ))}
            </div>
          </motion.section>
        )}

        {visibleCategories.length === 0 && query.trim() ? (
          <div className="rounded-[1.5rem] border border-border/40 bg-white p-8 text-center md:p-10">
            <h2 className="mb-2 text-xl font-bold text-foreground">Niets gevonden</h2>
            <p className="mb-6 text-muted-foreground">
              Staat je vraag er niet tussen? Ons team helpt je graag persoonlijk verder.
            </p>
            <Button variant="brand" asChild>
              <Link to="/contact">
                Neem contact op
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          visibleCategories.map((category, categoryIndex) => {
            const Icon = category.icon;

            return (
              <motion.section
                key={category.id}
                id={category.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: categoryIndex * 0.04 }}
                className="scroll-mt-28"
              >
                <div className="mb-5 flex items-start gap-4 rounded-2xl border border-border/40 bg-[#f8f6f1] p-5 md:p-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-white">
                    <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground md:text-2xl">
                      {category.title}
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {category.description}
                    </p>
                  </div>
                </div>

                <Accordion type="single" collapsible className="space-y-3">
                  {category.articles.map((article, index) => (
                    <AccordionItem
                      key={article.id}
                      id={article.id}
                      value={`${category.id}-${index}`}
                      variant="flat"
                      className="scroll-mt-32 overflow-hidden rounded-2xl border border-border/40 bg-white px-5 md:px-6"
                    >
                      <AccordionTrigger className="py-5 text-left text-[15px] font-semibold text-foreground hover:no-underline md:text-base">
                        {article.question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 text-[15px] leading-relaxed text-muted-foreground">
                        {article.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.section>
            );
          })
        )}
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="nex-container">{content}</div>
    </section>
  );
};

export const KennisbankCta = () => (
  <section className="relative overflow-hidden border-t border-border/40 bg-[#f5f5f7] py-14 md:py-16">
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
              <HelpCircle className="h-3.5 w-3.5 text-brand-orange" />
              Nog vragen?
            </div>
            <h2 className="mb-4 font-sans text-3xl font-bold tracking-[-0.03em] text-white md:text-4xl">
              Staat je antwoord er niet tussen?
            </h2>
            <p className="max-w-xl leading-relaxed text-white/65">
              Geen probleem. Plan een vrijblijvende demo, stuur een bericht of bel ons team.
              We denken graag met je mee over de beste oplossing voor jouw situatie.
            </p>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row md:flex-col lg:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-white text-foreground hover:bg-white/90"
            >
              <Link to="/contact">
                Neem contact op
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/pricing">Bekijk pakketten</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);
