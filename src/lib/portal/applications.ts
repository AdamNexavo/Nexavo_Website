import type { ClientAccount, IntegrationRequest, IntegrationRequestStatus } from "./types";
import { migrateIntegrationRequest } from "./types";
import { generateId } from "./storage";
import { getAllClients } from "./store";

export type IntegrationApplication = IntegrationRequest & {
  clientId: string;
  clientName: string;
  clientRef: string;
  clientEmail: string;
};

export function hasOpenIntegrationRequests(client: ClientAccount): boolean {
  return (client.integrationRequests ?? []).some(
    (r) => r.status === "new" || r.status === "in_progress",
  );
}

export function countOpenIntegrationRequests(clients: ClientAccount[]): number {
  return clients.reduce((sum, c) => sum + countClientOpenRequests(c), 0);
}

export function countClientOpenRequests(client: ClientAccount): number {
  return (client.integrationRequests ?? []).filter(
    (r) => r.status === "new" || r.status === "in_progress",
  ).length;
}

export function getAllIntegrationApplications(
  clients: ClientAccount[],
  getRef: (c: ClientAccount) => string,
): IntegrationApplication[] {
  return clients.flatMap((client) =>
    (client.integrationRequests ?? []).map((req) => ({
      ...migrateIntegrationRequest(req),
      clientId: client.id,
      clientName: client.companyName,
      clientRef: getRef(client),
      clientEmail: client.email,
    })),
  );
}

export function createIntegrationRequest(params: {
  integrationId: string;
  name: string;
  note?: string;
}): IntegrationRequest {
  return migrateIntegrationRequest({
    id: generateId(),
    integrationId: params.integrationId,
    name: params.name,
    note: params.note,
    requestedAt: new Date().toISOString(),
    status: "new",
  });
}

export function updateIntegrationRequestStatus(
  client: ClientAccount,
  requestId: string,
  status: IntegrationRequestStatus,
  internalNote?: string,
): ClientAccount {
  const requests = (client.integrationRequests ?? []).map((r) => {
    const req = migrateIntegrationRequest(r);
    if (req.id !== requestId) return req;
    return { ...req, status, internalNote: internalNote ?? req.internalNote };
  });

  const target = requests.find((r) => r.id === requestId);
  const integrationStatuses = { ...client.integrationStatuses };
  if (target) {
    if (status === "completed") integrationStatuses[target.name] = "active";
    else if (status === "rejected") integrationStatuses[target.name] = "not_linked";
    else if (status === "in_progress") integrationStatuses[target.name] = "in_progress";
    else integrationStatuses[target.name] = "requested";
  }

  return {
    ...client,
    integrationRequests: requests,
    integrationStatuses,
  };
}

export function getOpenApplicationsForAdmin(): IntegrationApplication[] {
  const clients = getAllClients();
  return getAllIntegrationApplications(clients, (c) => c.clientNumber ?? c.id)
    .filter((a) => a.status === "new" || a.status === "in_progress")
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
}

export const INTEGRATION_REQUEST_STATUS_LABELS: Record<IntegrationRequestStatus, string> = {
  new: "Nieuw",
  in_progress: "In behandeling",
  completed: "Afgehandeld",
  rejected: "Niet mogelijk",
};
