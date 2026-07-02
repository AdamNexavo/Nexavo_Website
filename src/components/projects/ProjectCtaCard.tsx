import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const ProjectCtaCard = () => (
  <Link to="/contact" className="group block h-full">
    <article className="relative flex h-full min-h-[220px] flex-col justify-center overflow-hidden rounded-xl border border-[#e8e6e2] border-l-[3px] border-l-primary bg-white p-5 shadow-[0_8px_30px_-24px_rgba(15,23,42,0.28)] transition-shadow duration-200 hover:shadow-[0_16px_40px_-24px_rgba(15,23,42,0.32)] sm:p-6">
      <div
        className="pointer-events-none absolute inset-0 nex-bg-dots opacity-25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/[0.06] blur-2xl transition-opacity group-hover:opacity-100"
        aria-hidden
      />

      <div className="relative flex flex-col items-start gap-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          Volgende case
        </p>

        <div className="space-y-2">
          <h3 className="font-sans text-xl font-bold leading-[1.15] tracking-[-0.03em] text-foreground">
            Jouw nieuwe website hier?
          </h3>
          <p className="max-w-[26ch] text-sm leading-relaxed text-muted-foreground">
            Vertel ons over je plannen. We denken graag mee over wat er mogelijk is.
          </p>
        </div>

        <span className="mt-1 inline-flex h-9 items-center justify-center gap-2 rounded-[12px] border border-transparent bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors group-hover:bg-primary/90">
          Plan een gesprek
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  </Link>
);
