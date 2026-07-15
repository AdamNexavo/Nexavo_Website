import type { ClientAccount, ClientTechnicalSetup, ClientWebsite } from "./types";
import { generateId } from "./storage";
import { getHostingProvider, resolveProviderLoginUrl } from "./hosting-providers";

export type ClientWebsiteWithMeta = ClientWebsite & {
  clientId: string;
  clientName: string;
  clientRef: string;
};

export function inferWebsiteStatus(client: ClientAccount): ClientWebsite["status"] {
  if (client.phase === "live" || client.progress.percent >= 100) return "live";
  if (client.progress.previewUrl || client.progress.percent >= 25) return "preview";
  return "draft";
}

/** Sync legacy websiteUrl / previewUrl naar websites[] */
export function getClientWebsites(client: ClientAccount): ClientWebsite[] {
  if (client.websites && client.websites.length > 0) {
    return client.websites;
  }

  const domain =
    client.websiteUrl?.replace(/^https?:\/\//, "") ??
    client.progress.previewUrl?.replace(/^https?:\/\//, "") ??
    client.onboarding.company.desiredDomain?.replace(/^https?:\/\//, "");

  if (!domain) return [];

  return [
    {
      id: `legacy-${client.id}`,
      name: client.companyName,
      url: client.websiteUrl,
      previewUrl: client.progress.previewUrl,
      status: inferWebsiteStatus(client),
      isPrimary: true,
      createdAt: client.createdAt,
    },
  ];
}

export function getAllClientWebsites(
  clients: ClientAccount[],
  getRef: (c: ClientAccount) => string,
): ClientWebsiteWithMeta[] {
  return clients.flatMap((client) =>
    getClientWebsites(client).map((site) => ({
      ...site,
      clientId: client.id,
      clientName: client.companyName,
      clientRef: getRef(client),
    })),
  );
}

export function createDefaultTechnicalSetup(client: ClientAccount): ClientTechnicalSetup {
  const domain =
    client.websiteUrl?.replace(/^https?:\/\//, "") ??
    client.onboarding.company.desiredDomain?.replace(/^https?:\/\//, "") ??
    "";
  return {
    hostingProvider: "",
    domainOwnership: "client",
    domainName: domain,
    dnsManagedBy: "client",
    pixelInstalled: false,
  };
}

export function getClientTechnicalSetup(client: ClientAccount): ClientTechnicalSetup {
  return client.technicalSetup ?? createDefaultTechnicalSetup(client);
}

export function isTechnicalSetupComplete(setup: ClientTechnicalSetup): boolean {
  if (!setup.hostingProvider?.trim()) return false;
  if (!setup.domainOwnership) return false;
  if (!setup.domainName?.trim()) return false;
  const loginUrl = resolveProviderLoginUrl(setup.hostingProvider, setup.providerLoginUrl);
  if (!loginUrl && setup.hostingProvider !== "other") return false;
  if (setup.hostingProvider === "other" && !setup.providerLoginUrl?.trim()) return false;
  return true;
}

export function getTechnicalSetupMissing(setup: ClientTechnicalSetup): string[] {
  const missing: string[] = [];
  if (!setup.hostingProvider?.trim()) missing.push("Hosting provider");
  if (!setup.domainName?.trim()) missing.push("Domeinnaam");
  if (!setup.domainOwnership) missing.push("Domein eigendom");
  const loginUrl = resolveProviderLoginUrl(setup.hostingProvider, setup.providerLoginUrl);
  if (!loginUrl) missing.push("Provider login-URL");
  return missing;
}

export function addClientWebsite(
  client: ClientAccount,
  partial: Pick<ClientWebsite, "name"> & Partial<Omit<ClientWebsite, "id" | "name">>,
): ClientWebsite[] {
  const existing = getClientWebsites(client);
  const site: ClientWebsite = {
    id: generateId(),
    name: partial.name,
    url: partial.url,
    previewUrl: partial.previewUrl,
    status: partial.status ?? "draft",
    isPrimary: partial.isPrimary ?? existing.length === 0,
    createdAt: new Date().toISOString(),
  };
  return [...existing, site];
}

export function getProviderLabel(setup: ClientTechnicalSetup): string {
  if (setup.hostingProvider === "other" && setup.hostingProviderLabel) {
    return setup.hostingProviderLabel;
  }
  return getHostingProvider(setup.hostingProvider)?.label ?? setup.hostingProvider ?? "—";
}
