import { ContactReachability } from "./ContactReachability";
import { DenseGridBackground } from "@/components/backgrounds/dense-grid-background";
import { SectionLines } from "@/components/backgrounds/section-lines";

export const ContactHero = () => (
  <section className="relative overflow-hidden border-b border-border/40 bg-white pb-14 pt-20 md:pb-20 md:pt-32">
    <SectionLines opacity="subtle" />
    <DenseGridBackground className="opacity-[0.14]" />
    <div className="nex-container relative z-10">
      <ContactReachability />
    </div>
  </section>
);
