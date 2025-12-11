import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Contact } from "@/components/sections/Contact";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "E-mail",
    value: "info@nexavo.nl",
  },
  {
    icon: Phone,
    title: "Telefoon",
    value: "+31 (0)6 12 34 56 78",
  },
  {
    icon: MapPin,
    title: "Locatie",
    value: "Nederland",
  },
];

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="py-24 pt-32">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
                Contact
              </p>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Laten we{" "}
                <span className="text-[#6a50ff]">kennismaken</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Heb je een vraag of wil je weten wat we voor jou kunnen betekenen? 
                Neem contact op — we reageren binnen 24 uur.
              </p>
            </motion.div>
            
            {/* Contact info */}
            <div className="flex flex-wrap items-center justify-center gap-12 mb-16">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-[#6a50ff]/10 flex items-center justify-center">
                    <info.icon className="w-5 h-5 text-[#6a50ff]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{info.title}</p>
                    <p className="font-medium">{info.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
