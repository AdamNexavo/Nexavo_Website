import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  KennisbankCta,
  KennisbankHero,
} from "@/components/kennisbank/KennisbankContent";

const KennisbankPage = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <main>
      <KennisbankHero />
      <KennisbankCta />
    </main>
    <Footer />
  </div>
);

export default KennisbankPage;
