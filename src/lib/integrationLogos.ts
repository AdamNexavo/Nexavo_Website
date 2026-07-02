import type { Integration } from "@/data/integrations";
import iconColors from "@/data/integrationIconColors.json";

const localLogoPaths: Record<string, string> = {
  mollie: "/integrations/mollie.png",
  sumup: "/integrations/sumup.png",
  mailerlite: "/integrations/mailerlite.png",
  activecampaign: "/integrations/activecampaign.png",
  klaviyo: "/integrations/klaviyo.png",
  tally: "/integrations/tally.png",
  "acuity-scheduling": "/integrations/acuity-scheduling.png",
  simplybook: "/integrations/simplybook.png",
  fresha: "/integrations/fresha.png",
  treatwell: "/integrations/treatwell.png",
  salonized: "/integrations/salonized.png",
  booksy: "/integrations/booksy.png",
  tikkie: "/integrations/tikkie.png",
  jotform: "/integrations/jotform.svg",
  n8n: "/integrations/n8n.svg",
  fillout: "/integrations/fillout.svg",
  "outlook-calendar": "/integrations/outlook-calendar.png",
  "microsoft-bookings": "/integrations/microsoft-bookings.png",
  "linkedin-ads": "/integrations/linkedin-ads.png",
  "linkedin-insight-tag": "/integrations/linkedin-insight-tag.png",
  whatsapp: "/integrations/whatsapp.png",
  "whatsapp-business": "/integrations/whatsapp-business.png",
};

const jsdelivrSlugs = new Set(["microsoftoutlook", "microsoft", "linkedin"]);

export const getIntegrationLogoUrl = (integration: Integration) => {
  if (integration.logoUrl) {
    return integration.logoUrl;
  }

  const localPath = localLogoPaths[integration.slug];
  if (localPath) {
    return localPath;
  }

  if (jsdelivrSlugs.has(integration.iconSlug)) {
    const hex =
      iconColors[integration.iconSlug as keyof typeof iconColors] ?? "000000";
    return `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${integration.iconSlug}.svg?color=%23${hex}`;
  }

  const hex = iconColors[integration.iconSlug as keyof typeof iconColors];
  if (hex) {
    return `https://cdn.simpleicons.org/${integration.iconSlug}/${hex}`;
  }

  return `https://cdn.simpleicons.org/${integration.iconSlug}`;
};

export const getIntegrationLogoFallbackUrl = (integration: Integration) =>
  `/integrations/${integration.slug}.png`;

export const isSquareIntegrationLogo = (slug: string) => slug === "wero";
