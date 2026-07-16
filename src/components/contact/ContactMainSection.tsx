import { ArrowRight, Check, Mail, Phone } from "lucide-react";
import { DenseGridBackground } from "@/components/backgrounds/dense-grid-background";
import { ContactBookingPanel } from "@/components/contact/ContactBookingPanel";
import { ContactInlineForm } from "@/components/contact/ContactInlineForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { contactInfo } from "@/data/contact";
import { cn } from "@/lib/utils";

const highlights = [
  "In ruim 30 minuten bespreken we jouw situatie en wat slim is om als eerste op te pakken",
  "Ook als je nog geen website hebt of twijfelt tussen Nexavo en een andere partij",
  "Aan het einde weet je precies wat de eerstvolgende stap is. Zonder verplichtingen.",
];

export const ContactMainSection = () => (
  <section
    id="contact-form"
    className="nex-page-hero-muted relative overflow-hidden !pt-32 md:!pt-40 lg:!pt-44"
  >
    <DenseGridBackground />
    <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-primary/[0.04] blur-3xl" />

    <div className="nex-container relative z-10">
      <div className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 xl:gap-16">
        <div className="lg:pt-2">
          <h1 className="mb-5 font-sans text-[2.25rem] font-bold leading-[1.08] tracking-[-0.035em] text-foreground md:text-[2.75rem] lg:text-[3.15rem]">
            Eén gesprek richting resultaat
          </h1>
          <p className="mb-8 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            In een kort gesprek kijken we samen wat je nu nodig hebt: website, boekingen,
            koppelingen of automatisering. Eerlijk advies, zonder verkooppraatjes.
          </p>

          <ul className="mb-8 space-y-4">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
                </span>
                <span className="text-[15px] leading-relaxed text-foreground/90 md:text-base">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <Button asChild variant="default" size="lg" className="group mb-6 h-12 w-full justify-between md:h-[3.25rem]">
            <a href={`mailto:${contactInfo.primaryEmail}`}>
              <span className="inline-flex items-center gap-2.5">
                <Mail className="h-4 w-4" strokeWidth={2} />
                Stuur ons direct een mail
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Button>

          <div className="rounded-2xl border border-border/60 bg-white shadow-card">
            <div className="grid sm:grid-cols-2">
              <div className="border-b border-border/50 p-5 sm:border-b-0 sm:border-r">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                  Bellen
                </p>
                <a
                  href={`tel:${contactInfo.primaryPhone.replace(/[\s()]/g, "")}`}
                  className="inline-flex items-center gap-2 text-[15px] font-medium text-foreground transition-opacity hover:opacity-70"
                >
                  <Phone className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                  {contactInfo.primaryPhone}
                </a>
              </div>
              <div className="p-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                  Mailen
                </p>
                <a
                  href={`mailto:${contactInfo.primaryEmail}`}
                  className="inline-flex items-center gap-2 text-[15px] font-medium text-foreground transition-opacity hover:opacity-70"
                >
                  <Mail className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                  {contactInfo.primaryEmail}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-border/60 bg-white p-5 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.28)] md:p-6 lg:p-7">
          <Tabs defaultValue="book" className="w-full">
            <TabsList className="mb-6 grid h-auto w-full grid-cols-2 gap-1 rounded-xl bg-[#f5f5f7] p-1">
              <TabsTrigger
                value="book"
                className={cn(
                  "rounded-lg py-2.5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                )}
              >
                Direct boeken
              </TabsTrigger>
              <TabsTrigger
                value="form"
                className={cn(
                  "rounded-lg py-2.5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                )}
              >
                Formulier invullen
              </TabsTrigger>
            </TabsList>

            <TabsContent value="book" className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
              <ContactBookingPanel />
            </TabsContent>

            <TabsContent value="form" className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
              <div className="mb-5">
                <h3 className="font-sans text-xl font-bold tracking-[-0.02em] text-foreground">
                  Stuur ons een bericht
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Liever schriftelijk contact? Vul het formulier in en we reageren binnen 1 werkdag.
                </p>
              </div>
              <ContactInlineForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  </section>
);
