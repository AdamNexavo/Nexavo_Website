export type IntegrationCategoryId =
  | "agenda"
  | "communicatie"
  | "marketing"
  | "betalingen"
  | "analytics"
  | "formulieren"
  | "automatisering";

export interface IntegrationCategory {
  id: IntegrationCategoryId;
  label: string;
}

export interface Integration {
  slug: string;
  name: string;
  iconSlug: string;
  logoUrl?: string;
  iconColor?: string;
  category: IntegrationCategoryId;
  tagline: string;
  cardDescription: string;
  builtBy: string;
  overview: string;
  howItWorks: string;
  configure: string;
  verified?: boolean;
}

export const integrationCategories: IntegrationCategory[] = [
  { id: "agenda", label: "Agenda & boekingen" },
  { id: "communicatie", label: "Communicatie" },
  { id: "marketing", label: "Marketing & ads" },
  { id: "betalingen", label: "Betalingen" },
  { id: "analytics", label: "Analytics & reviews" },
  { id: "formulieren", label: "Formulieren & enquêtes" },
  { id: "automatisering", label: "Automatisering" },
];

import {
  integrationEntries,
  pricingFeaturedSlugs,
} from "./integrationEntries";

export const integrations = integrationEntries;

export const pricingFeaturedIntegrations = integrationEntries.filter(
  (integration) => pricingFeaturedSlugs.includes(integration.slug),
);

export const getIntegrationBySlug = (slug: string) =>
  integrationEntries.find((integration) => integration.slug === slug);

export const getIntegrationsByCategory = (categoryId: IntegrationCategoryId) =>
  integrationEntries.filter((integration) => integration.category === categoryId);

export const getCategoryLabel = (categoryId: IntegrationCategoryId) =>
  integrationCategories.find((category) => category.id === categoryId)?.label ??
  categoryId;
