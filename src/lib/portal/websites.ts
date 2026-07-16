import type { ClientAccount, ClientTechnicalSetup, TechnicalSetupChecklist, ClientWebsite } from "./types";
import { generateId } from "./storage";
import { getHostingProvider, resolveProviderLoginUrl } from "./hosting-providers";

export type ClientWebsiteWithMeta = ClientWebsite & {
  clientId: string;
  clientName: string;
  clientRef: string;
};

export const TECHNICAL_CHECKLIST_ITEMS: {
  key: keyof TechnicalSetupChecklist;
  label: string;
  required: boolean;
}[] = [
  { key: "intakeReceived", label: "Intake ontvangen", required: true },
  { key: "previewCreated", label: "Website preview aangemaakt", required: true },
  { key: "domainLinked", label: "Domein gekoppeld", required: true },
  { key: "dnsChecked", label: "DNS gecontroleerd", required: false },
  { key: "sslActive", label: "SSL actief", required: true },
  { key: "formsTested", label: "Formulieren getest", required: true },
  { key: "integrationsChecked", label: "Koppelingen gecontroleerd", required: true },
  { key: "pixelAdded", label: "Pixel toegevoegd", required: false },
  { key: "reviewFlowChecked", label: "Reviewflow gecontroleerd", required: false },
  { key: "bookingFlowChecked", label: "Boekingsflow gecontroleerd", required: false },
  { key: "technicallyComplete", label: "Website technisch compleet", required: true },
];

export function inferWebsiteStatus(client: ClientAccount): ClientWebsite["status"] {
  if (client.phase === "live" && client.progress.percent >= 100) return "live";
  if (client.previewSettings?.enabled || client.progress.previewUrl || client.progress.percent >= 25)
    return "preview";
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
    checklist: {
      intakeReceived: client.onboarding.completed,
    },
  };
}

export function getClientTechnicalSetup(client: ClientAccount): ClientTechnicalSetup {
  const base = client.technicalSetup ?? createDefaultTechnicalSetup(client);
  return {
    ...base,
    checklist: {
      intakeReceived: client.onboarding.completed,
      ...base.checklist,
    },
  };
}

export function getRequiredChecklistComplete(setup: ClientTechnicalSetup): boolean {
  const checklist = setup.checklist ?? {};
  return TECHNICAL_CHECKLIST_ITEMS.filter((i) => i.required).every((item) => checklist[item.key] === true);
}

export function isTechnicalSetupComplete(setup: ClientTechnicalSetup): boolean {
  if (setup.checklist?.technicallyComplete) {
    return getRequiredChecklistComplete(setup);
  }
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
  const checklist = setup.checklist ?? {};
  for (const item of TECHNICAL_CHECKLIST_ITEMS.filter((i) => i.required)) {
    if (!checklist[item.key]) missing.push(item.label);
  }
  if (!setup.hostingProvider?.trim()) missing.push("Hosting provider");
  if (!setup.domainName?.trim()) missing.push("Domeinnaam");
  if (!setup.domainOwnership) missing.push("Domein eigendom");
  const loginUrl = resolveProviderLoginUrl(setup.hostingProvider, setup.providerLoginUrl);
  if (!loginUrl && setup.hostingProvider !== "other") missing.push("Provider login-URL");
  return [...new Set(missing)];
}

export function syncTechnicalChecklist(setup: ClientTechnicalSetup): ClientTechnicalSetup {
  const checklist = setup.checklist ?? {};
  const requiredDone = getRequiredChecklistComplete(setup);
  const pixelOk = checklist.pixelAdded === true || setup.pixelInstalled === true;
  const technicallyComplete = requiredDone && (!checklist.pixelAdded || pixelOk);

  return {
    ...setup,
    pixelInstalled: setup.pixelInstalled ?? checklist.pixelAdded ?? false,
    checklist: {
      ...checklist,
      pixelAdded: checklist.pixelAdded ?? setup.pixelInstalled ?? false,
      technicallyComplete: checklist.technicallyComplete ? technicallyComplete : checklist.technicallyComplete,
    },
    completed: setup.completed && technicallyComplete ? true : setup.completed,
    updatedAt: new Date().toISOString(),
  };
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
