import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactMainSection } from "@/components/contact/ContactMainSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { contactFaqs } from "@/data/faq";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <ContactMainSection />
        <FaqSection
          faqs={contactFaqs}
          label="Support"
          titleSans="Uitstekende"
          titleSerif="support"
          intro="Bekijk de veelgestelde vragen en antwoorden hieronder. Staat jouw vraag er niet tussen? Dan staan we je graag persoonlijk te woord."
          showContactCta={false}
          kennisbankHint="Nog vragen? Bekijk de kennisbank"
          alignTitleWithAccordion
          titleInline
          purpleKennisbankLink
        />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
