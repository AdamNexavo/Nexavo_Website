import { Link } from "react-router-dom";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

type PortalIntakeTermsProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  loading?: boolean;
};

const SHORT_TERMS = [
  "Je sluit een overeenkomst met Nexavo voor websiteontwikkeling en beheer.",
  "Eenmalige projectkosten zijn verschuldigd na bevestiging van je pakketkeuze, vóór start van de bouw.",
  "Maandelijks onderhoud is verplicht gedurende de initiële contractperiode van twaalf maanden.",
  "Opzegging onderhoud kan met één maand opzegtermijn vóór het einde van de contractperiode.",
  "Intellectuele eigendom van maatwerk gaat over na volledige betaling.",
  "Wijzigingen buiten scope vallen onder meerwerk en worden apart geoffreerd.",
];

export function PortalIntakeTerms({ checked, onCheckedChange, className, loading }: PortalIntakeTermsProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn("rounded-[14px] border border-[#E2E0DB] bg-[#FAFAF8] p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[14px] font-semibold text-[#111111]">Algemene voorwaarden</p>
          <p className="mt-1 text-[13px] leading-relaxed text-[#6B7280]">
            Door akkoord te gaan geef je Nexavo opdracht tot uitvoering van het gekozen pakket en accepteer je onze
            algemene voorwaarden.
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {SHORT_TERMS.map((item) => (
          <li key={item} className="flex gap-2 text-[13px] leading-snug text-[#6B7280]">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7547F8]" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link to={ROUTES.voorwaarden} target="_blank" rel="noopener noreferrer">
            Bekijk volledige algemene voorwaarden
            <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center gap-1 text-[13px] font-medium text-[#7547F8] hover:underline"
        >
          {expanded ? "Minder tonen" : "Meer details"}
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
        </button>
      </div>

      {expanded && (
        <div className="mt-4 max-h-[280px] overflow-y-auto rounded-[10px] border border-[#E2E0DB] bg-white p-4 text-[12px] leading-relaxed text-[#6B7280] [scrollbar-width:thin]">
          <p className="mb-3 font-medium text-[#111111]">Uitgebreide samenvatting</p>
          <div className="space-y-3">
            <section>
              <p className="font-medium text-[#111111]">1. Definities & partijen</p>
              <p className="mt-1">
                Nexavo levert websiteontwikkeling, hosting, onderhoud en gerelateerde digitale diensten. Opdrachtgever
                is de natuurlijke of rechtspersoon die via het klantportaal een pakket selecteert en de intake
                voltooit.
              </p>
            </section>
            <section>
              <p className="font-medium text-[#111111]">2. Totstandkoming overeenkomst</p>
              <p className="mt-1">
                De overeenkomst komt tot stand na acceptatie van deze voorwaarden in het portaal en bevestiging van de
                pakketkeuze. Nexavo bevestigt de opdracht schriftelijk of per e-mail.
              </p>
            </section>
            <section>
              <p className="font-medium text-[#111111]">3. Betaling & facturatie</p>
              <p className="mt-1">
                Eenmalige projectkosten worden gefactureerd na pakketbevestiging met een betaaltermijn van veertien
                dagen. Maandelijks onderhoud wordt vooraf gefactureerd. Bij niet-tijdige betaling kan Nexavo werkzaamheden
                opschorten en redelijke incassokosten in rekening brengen voor zover wettelijk toegestaan.
              </p>
            </section>
            <section>
              <p className="font-medium text-[#111111]">4. Levering & medewerking</p>
              <p className="mt-1">
                Opdrachtgever levert tijdig alle benodigde content, logo&apos;s, teksten en feedback. Vertraging door
                ontbrekende input kan de planning verschuiven zonder aansprakelijkheid voor Nexavo.
              </p>
            </section>
            <section>
              <p className="font-medium text-[#111111]">5. Intellectueel eigendom</p>
              <p className="mt-1">
                Maatwerk gaat over na volledige betaling. Nexavo behoudt rechten op generieke componenten, frameworks en
                interne tooling. Licenties van third-party software blijven van toepassing.
              </p>
            </section>
            <section>
              <p className="font-medium text-[#111111]">6. Aansprakelijkheid</p>
              <p className="mt-1">
                Nexavo is niet aansprakelijk voor indirecte schade, gevolgschade of gederfde winst. De totale
                aansprakelijkheid is beperkt tot het bedrag dat opdrachtgever in de twaalf maanden voorafgaand aan de
                claim heeft betaald, tenzij dwingend recht anders bepaalt.
              </p>
            </section>
            <section>
              <p className="font-medium text-[#111111]">7. Opzegging & duur</p>
              <p className="mt-1">
                Het onderhoudscontract loopt twaalf maanden en verlengt stilzwijgend, tenzij tijdig opgezegd met één
                maand opzegtermijn. Opzegging dient schriftelijk of via het portaal te geschieden.
              </p>
            </section>
            <section>
              <p className="font-medium text-[#111111]">8. Privacy & gegevensverwerking</p>
              <p className="mt-1">
                Nexavo verwerkt persoonsgegevens conform de AVG en het privacybeleid op nexavo.works. Acceptatie van
                voorwaarden omvat akkoord met verwerking voor uitvoering van de opdracht.
              </p>
            </section>
          </div>
        </div>
      )}

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-[10px] border border-[#E2E0DB] bg-white p-4">
        <Checkbox
          checked={checked}
          disabled={loading}
          onCheckedChange={(v) => onCheckedChange(v === true)}
          className="mt-0.5"
        />
        <span className="text-[13px] leading-snug text-[#111111]">
          Ik ga akkoord met de algemene voorwaarden en geef Nexavo toegang tot de benodigde gegevens voor uitvoering
          van mijn opdracht.
        </span>
      </label>
    </div>
  );
}
