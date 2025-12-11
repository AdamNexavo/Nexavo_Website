import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

const TestimonialsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default TestimonialsPage;












