import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DenseGridBackground } from "@/components/backgrounds/dense-grid-background";
import { SectionLines } from "@/components/backgrounds/section-lines";
import { NexDualLineTitle } from "@/components/ui/nex-typography";

type FrameFormat = "desktop" | "mobile";

type ShowcaseItem = {
  id: string;
  title: string;
  image: string;
  format: FrameFormat;
};

const showcaseProjects: ShowcaseItem[] = [
  {
    id: "crewstars",
    title: "Crewstars",
    image: "/projects/crewstars.png",
    format: "desktop",
  },
  {
    id: "hirefaces",
    title: "Hire Faces",
    image: "/projects/hirefaces.png",
    format: "desktop",
  },
  {
    id: "bibi",
    title: "Bibi",
    image: "/projects/bibi.png",
    format: "desktop",
  },
  {
    id: "four-gifts",
    title: "Four Gifts",
    image: "/projects/fourgifts.png",
    format: "desktop",
  },
  {
    id: "tap",
    title: "TAP Crew",
    image: "/projects/tap.png",
    format: "desktop",
  },
];

const topRowItems: ShowcaseItem[] = [
  showcaseProjects[0],
  showcaseProjects[1],
  showcaseProjects[2],
  showcaseProjects[3],
];

const bottomRowItems: ShowcaseItem[] = [
  showcaseProjects[4],
  showcaseProjects[0],
  showcaseProjects[1],
  showcaseProjects[2],
];

const MediaFrame = ({ item }: { item: ShowcaseItem }) => (
  <div
    className={cn(
      "shrink-0 overflow-hidden rounded-xl bg-[#141414] ring-1 ring-white/[0.1] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]",
      item.format === "desktop"
        ? "w-[min(380px,74vw)] aspect-[16/10]"
        : "h-[200px] md:h-[220px] w-auto aspect-[9/19.5]",
    )}
  >
    <img
      src={item.image}
      alt={`Website ${item.title}`}
      className="h-full w-full object-cover object-top"
      loading="lazy"
    />
  </div>
);

const ScrollMarqueeRow = ({
  items,
  x,
}: {
  items: ShowcaseItem[];
  x: MotionValue<number>;
}) => {
  const loop = [...items, ...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent sm:w-20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent sm:w-20"
        aria-hidden
      />
      <motion.div
        className="flex w-max items-center gap-3 py-1 will-change-transform md:gap-4"
        style={{ x }}
      >
        {loop.map((item, index) => (
          <MediaFrame key={`${item.id}-${index}`} item={item} />
        ))}
      </motion.div>
    </div>
  );
};

export const WorkShowcase = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 1.25", "end -0.15"],
  });

  /** Start pre-shifted left so the viewport is always filled; scroll down moves right. */
  const topRowX = useTransform(scrollYProgress, [0, 1], [-420, 140]);
  /** Staggered start vs top row; scroll down moves left. */
  const bottomRowX = useTransform(scrollYProgress, [0, 1], [100, -460]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0a0a0a] nex-hairline-b"
    >
      <SectionLines opacity="subtle" />
      <DenseGridBackground className="opacity-[0.12]" />

      <div className="nex-container relative z-10 py-20 md:py-24 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between md:mb-12"
        >
          <div>
            <Badge
              variant="outline"
              className="mb-3 rounded-lg border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-sm"
            >
              Ons werk
            </Badge>
            <NexDualLineTitle
              sans="Projecten waar we"
              serif="trots op zijn"
              align="left"
              serifClassName="text-white"
              sansClassName="text-white"
              className="[&_.nex-type-section-sans]:text-3xl [&_.nex-type-section-sans]:md:text-4xl [&_.nex-type-section-sans]:lg:text-[2.75rem] [&_.nex-type-section-serif]:text-3xl [&_.nex-type-section-serif]:md:text-4xl [&_.nex-type-section-serif]:lg:text-[2.75rem]"
            />
          </div>
          <Link
            to="/projecten"
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-white/90 sm:self-auto"
          >
            Bekijk ons werk
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="space-y-3 md:space-y-4">
          <ScrollMarqueeRow items={topRowItems} x={topRowX} />
          <ScrollMarqueeRow items={bottomRowItems} x={bottomRowX} />
        </div>
      </div>
    </section>
  );
};
