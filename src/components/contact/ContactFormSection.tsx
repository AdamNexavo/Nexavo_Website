import { motion } from "framer-motion";
import { useState } from "react";
import {
  Building2,
  Check,
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";
import { DenseGridBackground } from "@/components/backgrounds/dense-grid-background";
import { SectionLines } from "@/components/backgrounds/section-lines";
import { Button } from "@/components/ui/button";
import { FormFieldError, inputErrorClass } from "@/components/ui/form-field-error";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/ui/form-select";
import { Textarea } from "@/components/ui/textarea";
import { SectionBadge } from "@/components/ui/nex-ui";
import {
  type ContactFormErrors,
  validateContactForm,
} from "@/lib/contact-form-validation";
import { cn } from "@/lib/utils";

const topics = [
  { value: "demo", label: "Plan een demo" },
  { value: "pakket", label: "Vraag over pakketten" },
  { value: "project", label: "Nieuw project" },
  { value: "support", label: "Support (bestaande klant)" },
  { value: "anders", label: "Iets anders" },
];

const expectations = [
  "Je krijgt binnen 24 uur persoonlijk antwoord",
  "We stellen gerichte vragen over je doelen en planning",
  "Daarna ontvang je een concreet voorstel of vervolgstap",
];

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  topic: "demo",
  message: "",
};

export const ContactFormSection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<ContactFormErrors>({});

  const clearError = (field: keyof ContactFormErrors) => {
    if (!errors[field]) return;
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateContactForm(formData);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData(initialFormData);
    setErrors({});
  };

  return (
    <section
      id="contact-form"
      className="relative overflow-hidden border-b border-border/40 bg-white py-16 md:py-24"
    >
      <SectionLines opacity="subtle" />
      <DenseGridBackground className="opacity-[0.12]" />
      <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-primary/[0.05] blur-3xl" />

      <div className="nex-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-[1.75rem] border border-[#e8e6e2] border-l-[3px] border-l-primary bg-[#f5f5f7] p-6 shadow-card md:p-8 lg:p-10"
        >
          <div className="grid items-start gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 xl:gap-14">
            <div className="lg:sticky lg:top-28">
              <SectionBadge className="mb-4">Stuur een bericht</SectionBadge>
              <h2 className="mb-5 font-sans text-[2rem] font-bold leading-tight tracking-[-0.03em] text-foreground md:text-[2.5rem]">
                Wij helpen je graag verder
              </h2>
              <p className="mb-8 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                Hoe meer context je geeft, hoe gerichter we kunnen meedenken. Een
                korte omschrijving van je bedrijf en wensen is al genoeg om te starten.
              </p>

              <div className="rounded-2xl border border-border/40 bg-white p-5 md:p-6">
                <p className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Wat je kunt verwachten
                </p>
                <ul className="space-y-3">
                  {expectations.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange-light">
                        <Check className="h-3.5 w-3.5 text-brand-orange" strokeWidth={2.5} />
                      </span>
                      <span className="text-sm leading-relaxed text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-border/40 bg-white px-6 py-12 text-center md:px-10"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-9 w-9 text-primary" strokeWidth={1.75} />
                </div>
                <h3 className="mb-3 font-sans text-xl font-bold tracking-[-0.02em] text-foreground md:text-2xl">
                  Bericht ontvangen
                </h3>
                <p className="mb-8 max-w-sm text-base leading-relaxed text-muted-foreground">
                  Jouw bericht is in goede orde ontvangen en we nemen zo snel mogelijk
                  contact met je op.
                </p>
                <Button type="button" variant="outline" size="lg" onClick={handleReset}>
                  Verstuur nieuw bericht
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="contact-name" className="mb-2 block text-sm font-medium">
                      Naam
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="contact-name"
                        type="text"
                        value={formData.name}
                        onChange={(event) => {
                          setFormData({ ...formData, name: event.target.value });
                          clearError("name");
                        }}
                        placeholder="Voor- en achternaam"
                        aria-invalid={Boolean(errors.name)}
                        className={cn(
                          "h-11 border-border/60 bg-white pl-10",
                          inputErrorClass(Boolean(errors.name)),
                        )}
                      />
                    </div>
                    <FormFieldError message={errors.name} />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="mb-2 block text-sm font-medium">
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="contact-email"
                        type="email"
                        value={formData.email}
                        onChange={(event) => {
                          setFormData({ ...formData, email: event.target.value });
                          clearError("email");
                        }}
                        placeholder="jij@bedrijf.nl"
                        aria-invalid={Boolean(errors.email)}
                        className={cn(
                          "h-11 border-border/60 bg-white pl-10",
                          inputErrorClass(Boolean(errors.email)),
                        )}
                      />
                    </div>
                    <FormFieldError message={errors.email} />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="mb-2 block text-sm font-medium">
                      Telefoon <span className="text-muted-foreground">(optioneel)</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="contact-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="06 12 34 56 78"
                        className="h-11 border-border/60 bg-white pl-10"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="contact-company" className="mb-2 block text-sm font-medium">
                      Bedrijf <span className="text-muted-foreground">(optioneel)</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="contact-company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Naam van je bedrijf"
                        className="h-11 border-border/60 bg-white pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-topic" className="mb-2 block text-sm font-medium">
                    Waar gaat het over?
                  </label>
                  <FormSelect
                    id="contact-topic"
                    value={formData.topic}
                    onChange={(value) => setFormData({ ...formData, topic: value })}
                    options={topics}
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-2 block text-sm font-medium">
                    Bericht
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-4 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="contact-message"
                      value={formData.message}
                      onChange={(event) => {
                        setFormData({ ...formData, message: event.target.value });
                        clearError("message");
                      }}
                      placeholder="Vertel kort wat je zoekt, bijvoorbeeld een website met boekingen of een koppeling met je agenda."
                      aria-invalid={Boolean(errors.message)}
                      rows={5}
                      className={cn(
                        "min-h-[140px] border-border/60 bg-white pl-10",
                        inputErrorClass(Boolean(errors.message)),
                      )}
                    />
                  </div>
                  <FormFieldError message={errors.message} />
                </div>

                <Button type="submit" size="lg" variant="brand" className="w-full">
                  Verstuur bericht
                  <Send className="h-4 w-4" />
                </Button>

                <p className="text-center text-xs leading-relaxed text-muted-foreground">
                  Door te verzenden ga je akkoord dat we je gegevens gebruiken om contact
                  met je op te nemen over je aanvraag.
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
