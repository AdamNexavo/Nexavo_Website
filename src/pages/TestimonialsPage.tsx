import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Testimonials } from "@/components/sections/Testimonials";
import { BottomCTA } from "@/components/sections/BottomCTA";

const TestimonialsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Testimonials />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
};

export default TestimonialsPage;












