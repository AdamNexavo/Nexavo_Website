import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProjectsHero } from "@/components/projects/ProjectsHero";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectCtaCard } from "@/components/projects/ProjectCtaCard";
import { motion } from "framer-motion";
import { DenseGridBackground } from "@/components/backgrounds/dense-grid-background";
import { SectionLines } from "@/components/backgrounds/section-lines";
import { BottomCTA } from "@/components/sections/BottomCTA";
import { projects } from "@/data/projects";

export default function Projecten() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProjectsHero />

        <section
          id="projecten-grid"
          className="nex-section relative overflow-hidden bg-[#f5f5f7] nex-hairline-b scroll-mt-28"
        >
          <SectionLines opacity="subtle" />
          <DenseGridBackground className="opacity-25" />
          <div className="nex-container relative z-10">
            <div className="mx-auto grid max-w-5xl items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
              {projects.map((project, index) => (
                <motion.div
                  key={project.slug}
                  className="h-full"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
              <motion.div
                className="h-full"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: projects.length * 0.05 }}
              >
                <ProjectCtaCard />
              </motion.div>
            </div>
          </div>
        </section>

        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
}
