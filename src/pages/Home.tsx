import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Benefits } from "@/components/sections/Benefits";
import { Automations } from "@/components/sections/Automations";
import { Testimonials } from "@/components/sections/Testimonials";
import { WorkShowcase } from "@/components/sections/WorkShowcase";
import { FAQ } from "@/components/sections/FAQ";
import { BottomCTA } from "@/components/sections/BottomCTA";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Automations />
        <Testimonials />
        <WorkShowcase />
        <FAQ />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
