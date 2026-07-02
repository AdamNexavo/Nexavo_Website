import { motion } from "framer-motion";
import { Star, Calendar, Globe, Palette, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FeatureCheck, NexSection, SectionBadge } from "@/components/ui/nex-ui";
import { NexDualLineTitle } from "@/components/ui/nex-typography";
import { BookingShowcaseSkeleton } from "@/components/skeletons/BookingShowcaseSkeleton";
import { ReviewShowcaseSkeleton } from "@/components/skeletons/ReviewShowcaseSkeleton";
import { WebsiteShowcaseSkeleton } from "@/components/skeletons/WebsiteShowcaseSkeleton";

const diensten = [
  {
    icon: Palette,
    title: "Op maat gemaakt",
    description: "Uniek design dat perfect aansluit bij jouw merk en doelgroep.",
  },
  {
    icon: Zap,
    title: "Supersnel",
    description: "Geoptimaliseerd voor snelheid. Je website laadt in milliseconden.",
  },
  {
    icon: Globe,
    title: "Altijd online",
    description: "99.9% uptime met betrouwbare hosting en SSL inbegrepen.",
  },
];

export const Automations = () => {
  return (
    <NexSection surface="muted" divider>
      {/* Websites */}
      <div className="relative z-10 mb-32 grid items-center gap-12 lg:grid-cols-2 lg:gap-16 md:mb-40">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <WebsiteShowcaseSkeleton size="section" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <SectionBadge>Effectief & professioneel</SectionBadge>
          <NexDualLineTitle
            sans="Websites die"
            serif={<span className="text-primary">werken</span>}
            align="left"
            className="mb-4 text-black"
          />
          <p className="nex-body-lg mb-8">
            Geen standaard templates, maar oplossingen die écht bij jouw bedrijf passen.
            Ontworpen om je bedrijf vooruit te helpen.
          </p>
          <ul className="space-y-4">
            {diensten.map((dienst) => (
              <li key={dienst.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-[#fafafa] shadow-sm">
                  <dienst.icon className="h-5 w-5 text-brand-orange/75" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{dienst.title}</h3>
                  <p className="text-sm text-muted-foreground">{dienst.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Automatiseringen intro */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto mb-20 max-w-2xl border-t border-border/50 pt-16 text-center md:pt-24"
      >
        <SectionBadge className="mx-auto">Automatiseringen</SectionBadge>
        <NexDualLineTitle
          sans="Bespaar tijd met"
          serif="slimme automatisering"
          className="mb-4"
        />
        <p className="nex-body-lg">
          Laat ons de repetitieve taken overnemen. Meer tijd voor je klanten, minder stress.
        </p>
      </motion.div>

      {/* Review management */}
      <div className="relative z-10 mb-24 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionBadge icon={Star}>Review management</SectionBadge>
          <h3 className="mb-4 font-sans text-2xl font-bold tracking-tight text-black md:text-[1.875rem] lg:text-[2rem]">
            Automatisch reviews verzamelen
          </h3>
          <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
            24 uur na elke afspraak ontvangen je klanten automatisch een reviewverzoek
            via e-mail, SMS of WhatsApp. Verzamel positieve reviews en houd negatieve feedback intern.
          </p>
          <ul className="mb-8 space-y-1">
            {[
              "Automatische review verzoeken na afspraak",
              "Keuze uit e-mail, SMS of WhatsApp",
              "Negatieve feedback eerst intern afhandelen",
              "Reviews tonen op je website",
            ].map((item) => (
              <FeatureCheck key={item} variant="purple">
                {item}
              </FeatureCheck>
            ))}
          </ul>
          <Link to="/diensten">
            <Button>Meer over Review Management</Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <ReviewShowcaseSkeleton size="section" />
        </motion.div>
      </div>

      {/* Booking calendar */}
      <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative order-2 px-4 md:px-8 lg:order-1"
        >
          <div className="mx-auto w-full max-w-lg origin-center scale-[0.88] sm:scale-[0.9]">
            <BookingShowcaseSkeleton size="section" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="order-1 lg:order-2"
        >
          <SectionBadge icon={Calendar}>Boekingssysteem</SectionBadge>
          <h3 className="mb-4 font-sans text-2xl font-bold tracking-tight text-black md:text-[1.875rem] lg:text-[2rem]">
            Online boeken,{" "}
            <span className="nex-serif-line text-[calc(1em+2px)] font-bold text-brand-orange">24/7</span>
          </h3>
          <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
            Klanten boeken zelf een afspraak via jouw website, op elk moment van de dag.
            Automatische herinneringen zorgen voor minder no-shows.
          </p>
          <ul className="mb-8 space-y-1">
            {[
              "24/7 online boeken via je website",
              "Automatische bevestigingen & herinneringen",
              "Synchronisatie met Google/Outlook agenda",
              "Koppeling met review management",
            ].map((item) => (
              <FeatureCheck key={item}>{item}</FeatureCheck>
            ))}
          </ul>
          <Link to="/diensten">
            <Button>Meer over boekingssysteem</Button>
          </Link>
        </motion.div>
      </div>
    </NexSection>
  );
};
