import { ArrowUpRight } from "lucide-react";
import type { ProjectItem } from "@/data/projects";

type ProjectCardProps = {
  project: ProjectItem;
};

export const ProjectCard = ({ project }: ProjectCardProps) => (
  <a
    href={project.href}
    target="_blank"
    rel="noopener noreferrer"
    className="group block h-full"
  >
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#e8e6e2] border-l-[3px] border-l-primary bg-white shadow-[0_8px_30px_-24px_rgba(15,23,42,0.28)] transition-shadow duration-200 hover:shadow-[0_16px_40px_-24px_rgba(15,23,42,0.32)]">
      <div className="aspect-[16/9] shrink-0 overflow-hidden bg-[#f5f5f7]">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <h3 className="font-sans text-sm font-bold tracking-[-0.02em] text-foreground">
            {project.title}
          </h3>
          <span className="shrink-0 rounded-[3px] border border-brand-orange/20 bg-brand-orange-light px-1.5 py-0.5 text-[9px] font-medium leading-none text-brand-orange">
            {project.type}
          </span>
        </div>

        <p className="mb-2 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary transition-colors group-hover:text-primary/80">
          Bekijk website
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  </a>
);
