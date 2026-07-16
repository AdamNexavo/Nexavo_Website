import type { ClientAccount, IntegrationRequestStatus } from "./types";
import { getAllClients } from "./store";
import { getClientReferenceNumber } from "./helpers";
import { getAllIntegrationApplications } from "./applications";

export type ApplicationType = "intake" | "koppeling" | "website" | "betaling" | "overig";
export type ApplicationStatus = "new" | "in_progress" | "completed" | "rejected" | "awaiting_payment";

export type ApplicationInboxItem = {
  id: string;
  type: ApplicationType;
  title: string;
  preview: string;
  clientId: string;
  clientName: string;
  clientRef: string;
  clientEmail: string;
  date: string;
  status: ApplicationStatus;
  unread: boolean;
  requestId?: string;
  internalNote?: string;
  note?: string;
  raw?: unknown;
};

function intakeStatus(client: ClientAccount): ApplicationStatus {
  const paid = client.payments.some((p) => p.status === "paid");
  if (paid) return "completed";
  return "awaiting_payment";
}

export function getApplicationInboxItems(clients?: ClientAccount[]): ApplicationInboxItem[] {
  const list = clients ?? getAllClients();
  const intakes: ApplicationInboxItem[] = list
    .filter((c) => c.onboarding.submittedAt || c.onboarding.completed)
    .map((c) => ({
      id: `intake-${c.id}`,
      type: "intake" as const,
      title: `Intake ontvangen — ${c.companyName}`,
      preview: `${c.package.planName} · ${c.onboarding.company.industry || "—"}`,
      clientId: c.id,
      clientName: c.companyName,
      clientRef: getClientReferenceNumber(c),
      clientEmail: c.email,
      date: c.onboarding.submittedAt ?? c.createdAt,
      status: intakeStatus(c),
      unread: !c.payments.some((p) => p.status === "paid"),
    }));

  const koppelingen: ApplicationInboxItem[] = getAllIntegrationApplications(list, getClientReferenceNumber).map(
    (app) => ({
      id: app.id,
      type: "koppeling" as const,
      title: `Koppeling aangevraagd: ${app.name}`,
      preview: app.note?.split("\n")[0] ?? "Aanvraag via klantportaal",
      clientId: app.clientId,
      clientName: app.clientName,
      clientRef: app.clientRef,
      clientEmail: app.clientEmail,
      date: app.requestedAt,
      status: app.status as ApplicationStatus,
      unread: app.status === "new",
      requestId: app.id,
      internalNote: app.internalNote,
      note: app.note,
    }),
  );

  return [...intakes, ...koppelingen].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export const APPLICATION_TYPE_LABELS: Record<ApplicationType, string> = {
  intake: "Intake",
  koppeling: "Koppeling",
  website: "Website",
  betaling: "Betaling",
  overig: "Overig",
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: "Nieuw",
  in_progress: "In behandeling",
  completed: "Afgehandeld",
  rejected: "Niet mogelijk",
  awaiting_payment: "Wacht op betaling",
};

export function mapIntegrationStatusToRequest(status: IntegrationRequestStatus): IntegrationRequestStatus {
  return status;
}
