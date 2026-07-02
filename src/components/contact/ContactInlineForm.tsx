import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormFieldError, inputErrorClass } from "@/components/ui/form-field-error";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/ui/form-select";
import { Textarea } from "@/components/ui/textarea";
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

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  topic: "demo",
  message: "",
};

export const ContactInlineForm = () => {
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

  if (isSubmitted) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center px-2 py-10 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-9 w-9 text-primary" strokeWidth={1.75} />
        </div>
        <h3 className="mb-3 font-sans text-xl font-bold tracking-[-0.02em] text-foreground">
          Bericht ontvangen
        </h3>
        <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground md:text-base">
          Jouw bericht is in goede orde ontvangen en we nemen zo snel mogelijk contact met je op.
        </p>
        <Button type="button" variant="outline" size="lg" onClick={handleReset}>
          Verstuur nieuw bericht
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="inline-contact-name" className="mb-1.5 block text-sm font-medium">
          Naam
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="inline-contact-name"
            type="text"
            value={formData.name}
            onChange={(event) => {
              setFormData({ ...formData, name: event.target.value });
              clearError("name");
            }}
            placeholder="Voor- en achternaam"
            aria-invalid={Boolean(errors.name)}
            className={cn("h-11 border-border/60 bg-white pl-10", inputErrorClass(Boolean(errors.name)))}
          />
        </div>
        <FormFieldError message={errors.name} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="inline-contact-email" className="mb-1.5 block text-sm font-medium">
            E-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="inline-contact-email"
              type="email"
              value={formData.email}
              onChange={(event) => {
                setFormData({ ...formData, email: event.target.value });
                clearError("email");
              }}
              placeholder="jij@bedrijf.nl"
              aria-invalid={Boolean(errors.email)}
              className={cn("h-11 border-border/60 bg-white pl-10", inputErrorClass(Boolean(errors.email)))}
            />
          </div>
          <FormFieldError message={errors.email} />
        </div>
        <div>
          <label htmlFor="inline-contact-phone" className="mb-1.5 block text-sm font-medium">
            Telefoon <span className="text-muted-foreground">(optioneel)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="inline-contact-phone"
              type="tel"
              value={formData.phone}
              onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
              placeholder="06 12 34 56 78"
              className="h-11 border-border/60 bg-white pl-10"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="inline-contact-company" className="mb-1.5 block text-sm font-medium">
          Bedrijf <span className="text-muted-foreground">(optioneel)</span>
        </label>
        <div className="relative">
          <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="inline-contact-company"
            type="text"
            value={formData.company}
            onChange={(event) => setFormData({ ...formData, company: event.target.value })}
            placeholder="Naam van je bedrijf"
            className="h-11 border-border/60 bg-white pl-10"
          />
        </div>
      </div>

      <div>
        <label htmlFor="inline-contact-topic" className="mb-1.5 block text-sm font-medium">
          Waar gaat het over?
        </label>
        <FormSelect
          id="inline-contact-topic"
          value={formData.topic}
          onChange={(value) => {
            setFormData({ ...formData, topic: value });
            clearError("topic");
          }}
          options={topics}
        />
        <FormFieldError message={errors.topic} />
      </div>

      <div>
        <label htmlFor="inline-contact-message" className="mb-1.5 block text-sm font-medium">
          Bericht
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3.5 top-4 h-4 w-4 text-muted-foreground" />
          <Textarea
            id="inline-contact-message"
            value={formData.message}
            onChange={(event) => {
              setFormData({ ...formData, message: event.target.value });
              clearError("message");
            }}
            placeholder="Vertel kort wat je zoekt."
            aria-invalid={Boolean(errors.message)}
            rows={4}
            className={cn(
              "min-h-[110px] border-border/60 bg-white pl-10",
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
        Door te verzenden ga je akkoord dat we je gegevens gebruiken om contact met je op te nemen.
      </p>
    </form>
  );
};
