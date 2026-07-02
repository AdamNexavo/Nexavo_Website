import type { ReactNode } from "react";
import { DenseGridBackground } from "@/components/backgrounds/dense-grid-background";
import { SectionLines } from "@/components/backgrounds/section-lines";
import { SectionBadge } from "@/components/ui/nex-ui";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: ReactNode[];
};

type LegalPageLayoutProps = {
  badge: string;
  title: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export const LegalPageLayout = ({
  badge,
  title,
  intro,
  lastUpdated,
  sections,
}: LegalPageLayoutProps) => (
  <>
    <section className="nex-page-hero-muted relative overflow-hidden border-b border-border/40">
      <SectionLines opacity="subtle" />
      <DenseGridBackground className="opacity-30" />
      <div className="nex-container relative z-10">
        <div className="mx-auto max-w-3xl">
          <SectionBadge className="mb-6">{badge}</SectionBadge>
          <h1 className="mb-4 font-sans text-[2rem] font-bold leading-[1.08] tracking-[-0.035em] text-foreground md:text-[2.5rem]">
            {title}
          </h1>
          <p className="nex-section-intro mb-3">{intro}</p>
          <p className="text-sm text-muted-foreground">Laatst bijgewerkt: {lastUpdated}</p>
        </div>
      </div>
    </section>

    <section className="bg-white py-14 md:py-20">
      <div className="nex-container">
        <div className="mx-auto max-w-3xl space-y-12">
          {sections.map((section) => (
            <article key={section.id} id={section.id} className="scroll-mt-28">
              <h2 className="mb-4 font-sans text-xl font-bold tracking-[-0.02em] text-foreground md:text-2xl">
                {section.title}
              </h2>
              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                {section.paragraphs.map((paragraph, index) => (
                  <div key={index}>{paragraph}</div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  </>
);
