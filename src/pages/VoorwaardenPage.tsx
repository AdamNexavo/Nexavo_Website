import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { termsSections } from "@/data/legalContent";

const VoorwaardenPage = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <main>
      <LegalPageLayout
        badge="Juridisch"
        title="Algemene voorwaarden"
        intro="De voorwaarden die gelden voor diensten, offertes en overeenkomsten tussen Nexavo en haar klanten."
        lastUpdated="2 juli 2026"
        sections={termsSections}
      />
    </main>
    <Footer />
  </div>
);

export default VoorwaardenPage;
