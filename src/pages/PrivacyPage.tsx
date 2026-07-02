import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { privacySections } from "@/data/legalContent";

const PrivacyPage = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <main>
      <LegalPageLayout
        badge="Juridisch"
        title="Privacyverklaring"
        intro="Hoe Nexavo omgaat met jouw persoonsgegevens wanneer je onze website bezoekt, contact opneemt of klant bent."
        lastUpdated="2 juli 2026"
        sections={privacySections}
      />
    </main>
    <Footer />
  </div>
);

export default PrivacyPage;
