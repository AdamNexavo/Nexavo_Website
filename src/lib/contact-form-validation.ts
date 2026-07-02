export type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  topic: string;
  message: string;
};

export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

export function validateContactForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!data.name.trim()) {
    errors.name = "Vul je voor- en achternaam in";
  }

  if (!data.email.trim()) {
    errors.email = "Vul je e-mailadres in";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Dit e-mailadres lijkt niet te kloppen";
  }

  if (!data.message.trim()) {
    errors.message = "Schrijf even kort waar we je mee kunnen helpen";
  }

  return errors;
}
