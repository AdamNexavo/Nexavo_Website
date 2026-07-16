import type { LucideIcon } from "lucide-react";
import { Building2, CreditCard } from "lucide-react";

export type PortalPaymentMethodId =
  | "ideal"
  | "creditcard"
  | "apple_pay"
  | "google_pay"
  | "paypal"
  | "klarna"
  | "banktransfer";

export type PortalPaymentMethod = {
  id: PortalPaymentMethodId;
  name: string;
  description: string;
  logo?: string;
  icon?: LucideIcon;
  popular?: boolean;
  checkoutLabel: string;
};

export const PORTAL_PAYMENT_METHODS: PortalPaymentMethod[] = [
  {
    id: "ideal",
    name: "iDEAL / Wero",
    description: "Direct betalen via je eigen bank",
    logo: "/integrations/wero.svg",
    popular: true,
    checkoutLabel: "iDEAL / Wero",
  },
  {
    id: "creditcard",
    name: "Creditcard",
    description: "Visa, Mastercard en American Express",
    icon: CreditCard,
    popular: true,
    checkoutLabel: "creditcard",
  },
  {
    id: "apple_pay",
    name: "Apple Pay",
    description: "Snel en veilig op iPhone, iPad en Mac",
    logo: "/integrations/apple-pay.png",
    checkoutLabel: "Apple Pay",
  },
  {
    id: "google_pay",
    name: "Google Pay",
    description: "Betalen met je Google-account",
    logo: "/integrations/google-pay.png",
    checkoutLabel: "Google Pay",
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Betaal met je PayPal-saldo of kaart",
    logo: "/integrations/paypal.png",
    checkoutLabel: "PayPal",
  },
  {
    id: "klarna",
    name: "Klarna",
    description: "Betaal later of in termijnen",
    logo: "/integrations/klarna.png",
    checkoutLabel: "Klarna",
  },
  {
    id: "banktransfer",
    name: "Bankoverschrijving",
    description: "SEPA-overboeking met betaaltermijn",
    icon: Building2,
    checkoutLabel: "bankoverschrijving",
  },
];

export function getPaymentMethodById(id: PortalPaymentMethodId): PortalPaymentMethod {
  return PORTAL_PAYMENT_METHODS.find((m) => m.id === id) ?? PORTAL_PAYMENT_METHODS[0];
}

export function getPaymentMethodLabel(id: PortalPaymentMethodId): string {
  return getPaymentMethodById(id).checkoutLabel;
}
