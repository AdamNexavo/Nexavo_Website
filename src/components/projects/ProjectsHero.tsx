import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SectionBadge } from "@/components/ui/nex-ui";
import { NexDualLineTitle } from "@/components/ui/nex-typography";
import { DenseGridBackground } from "@/components/backgrounds/dense-grid-background";
import { SectionLines } from "@/components/backgrounds/section-lines";

export const ProjectsHero = () => (
  <section className="nex-page-hero-muted relative overflow-hidden">
    <SectionLines />
    <DenseGridBackground />
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <div className="absolute left-1/2 top-1/3 h-[400px] w-[min(800px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.05] blur-3xl" />
    </div>

    <div className="nex-container relative z-10">
      <div className="mx-auto max-w-3xl text-center">
        <SectionBadge className="mx-auto">Ons werk</SectionBadge>
        <NexDualLineTitle
          as="h1"
          size="display"
          sans="Projecten waar we"
          serif="trots op zijn"
          className="mb-5"
        />
        <p className="nex-section-intro mx-auto mb-8">
          Bekijk een selectie van websites die we hebben gemaakt voor ondernemers zoals jij.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a href="#projecten-grid">Bekijk projecten</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/contact">Plan demo</Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);
