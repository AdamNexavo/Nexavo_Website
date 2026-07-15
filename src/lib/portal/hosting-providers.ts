export type HostingProviderId =
  | "vimexx"
  | "transip"
  | "cloudflare"
  | "mijnhost"
  | "siteground"
  | "nexavo"
  | "other";

export const HOSTING_PROVIDERS: {
  id: HostingProviderId;
  label: string;
  loginUrl: string;
}[] = [
  { id: "vimexx", label: "Vimexx", loginUrl: "https://www.vimexx.nl/inloggen" },
  { id: "transip", label: "TransIP", loginUrl: "https://www.transip.nl/cp/" },
  { id: "cloudflare", label: "Cloudflare", loginUrl: "https://dash.cloudflare.com/login" },
  { id: "mijnhost", label: "Mijn.host", loginUrl: "https://mijn.host/login" },
  { id: "siteground", label: "SiteGround", loginUrl: "https://login.siteground.com/" },
  { id: "nexavo", label: "Nexavo (eigen beheer)", loginUrl: "https://nexavo.works" },
  { id: "other", label: "Overig", loginUrl: "" },
];

export function getHostingProvider(id?: string) {
  return HOSTING_PROVIDERS.find((p) => p.id === id);
}

export function resolveProviderLoginUrl(providerId?: string, customUrl?: string): string | undefined {
  if (customUrl?.trim()) return customUrl.trim();
  const preset = getHostingProvider(providerId);
  return preset?.loginUrl || undefined;
}
