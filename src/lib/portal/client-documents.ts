import type {
  ClientAccount,
  ClientDocument,
  ClientDocumentCategory,
  ClientAssignedDocument,
  DocumentAttachment,
  MediaFile,
} from "./types";
import { generateId } from "./storage";
import { PORTAL_DOCUMENTS } from "@/data/revision-policy";

export type ClientVisibleDocument = {
  id: string;
  title: string;
  description?: string;
  href?: string;
  fileName?: string;
  external?: boolean;
  source?: "static" | "assigned";
  assignedAt?: string;
};

export function getClientVisibleDocuments(client: ClientAccount): ClientVisibleDocument[] {
  const staticDocs: ClientVisibleDocument[] = PORTAL_DOCUMENTS.map((doc) => ({
    id: doc.id,
    title: doc.title,
    description: doc.description,
    href: doc.href,
    external: doc.external,
    source: "static",
  }));

  const assigned: ClientVisibleDocument[] = (client.assignedDocuments ?? []).map((doc) => ({
    id: doc.id,
    title: doc.title,
    description: doc.description,
    href: doc.attachment?.dataUrl,
    fileName: doc.attachment?.fileName,
    source: "assigned",
    assignedAt: doc.assignedAt,
  }));

  return [...assigned, ...staticDocs];
}

export function createAssignedDocument(partial: {
  title: string;
  description?: string;
  attachment?: DocumentAttachment;
}): ClientAssignedDocument {
  return {
    id: generateId(),
    title: partial.title,
    description: partial.description,
    attachment: partial.attachment,
    assignedAt: new Date().toISOString(),
    assignedBy: "admin",
  };
}

function inferCategory(file: MediaFile): ClientDocumentCategory {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  if (name.includes("logo") || type.includes("svg")) return "logo";
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.includes("pdf")) return "pdf";
  return "file";
}

function mediaToDocument(client: ClientAccount, file: MediaFile): ClientDocument {
  return {
    id: file.id,
    customerId: client.id,
    name: file.name,
    type: file.type,
    category: inferCategory(file),
    size: file.size,
    uploadedAt: file.uploadedAt,
    uploadedBy: "client",
    dataUrl: file.dataUrl,
    status: "active",
    source: "onboarding",
  };
}

export function getClientUploadedDocuments(client: ClientAccount): ClientDocument[] {
  const fromMedia = (client.onboarding.media ?? []).map((f) => mediaToDocument(client, f));
  const stored = (client.clientDocuments ?? []).filter((d) => d.source !== "assigned");
  const byId = new Map<string, ClientDocument>();
  for (const doc of fromMedia) byId.set(doc.id, doc);
  for (const doc of stored) byId.set(doc.id, doc);
  return [...byId.values()]
    .filter((d) => d.status !== "archived")
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

function getSystemDocuments(client: ClientAccount): ClientDocument[] {
  const baseDate = client.termsAcceptance?.acceptedAt ?? client.createdAt;
  const systemDocs: ClientDocument[] = PORTAL_DOCUMENTS.map((doc) => ({
    id: `system-${doc.id}-${client.id}`,
    customerId: client.id,
    name: doc.title,
    type: doc.id === "onderhoud" ? "application/pdf" : "text/html",
    category: doc.id === "onderhoud" ? "pdf" : "generated",
    uploadedAt: baseDate,
    uploadedBy: "system",
    url: doc.href,
    status: "active",
    notes: doc.description,
    source: "assigned",
  }));

  if (client.termsAcceptance) {
    systemDocs.push({
      id: `terms-accept-${client.id}`,
      customerId: client.id,
      name: "Acceptatie algemene voorwaarden",
      type: "text/html",
      category: "generated",
      uploadedAt: client.termsAcceptance.acceptedAt,
      uploadedBy: "system",
      status: "active",
      notes: `Versie ${client.termsAcceptance.version ?? "—"} · ${client.termsAcceptance.source ?? "intake"}`,
      source: "generated",
    });
  }

  if (client.onboarding.completed) {
    systemDocs.push({
      id: `intake-${client.id}`,
      customerId: client.id,
      name: "Intake-document",
      type: "application/json",
      category: "intake",
      uploadedAt: client.onboarding.submittedAt ?? client.onboarding.termsAcceptedAt ?? baseDate,
      uploadedBy: "client",
      status: "active",
      notes: "Ingediende intakegegevens en websitewensen",
      source: "onboarding",
    });
  }

  return systemDocs;
}

export function getAllClientDocuments(client: ClientAccount): ClientDocument[] {
  const uploads = getClientUploadedDocuments(client);
  const assigned = (client.assignedDocuments ?? []).map((doc) => ({
    id: doc.id,
    customerId: client.id,
    name: doc.title,
    type: doc.attachment?.mimeType ?? "application/octet-stream",
    category: "pdf" as ClientDocumentCategory,
    size: doc.attachment?.size,
    uploadedAt: doc.assignedAt,
    uploadedBy: "admin" as const,
    dataUrl: doc.attachment?.dataUrl,
    status: "active" as const,
    notes: doc.description,
    source: "assigned" as const,
  }));
  const system = getSystemDocuments(client);
  const byId = new Map<string, ClientDocument>();
  for (const doc of [...system, ...uploads, ...assigned]) {
    byId.set(doc.id, doc);
  }
  return [...byId.values()].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  );
}

export function upsertClientDocument(client: ClientAccount, doc: ClientDocument): ClientAccount {
  const existing = client.clientDocuments ?? [];
  const next = existing.some((d) => d.id === doc.id)
    ? existing.map((d) => (d.id === doc.id ? doc : d))
    : [...existing, doc];
  return { ...client, clientDocuments: next };
}

export function renameClientDocument(client: ClientAccount, docId: string, name: string): ClientAccount {
  const media = client.onboarding.media.map((f) => (f.id === docId ? { ...f, name } : f));
  const docs = (client.clientDocuments ?? []).map((d) => (d.id === docId ? { ...d, name } : d));
  return {
    ...client,
    onboarding: { ...client.onboarding, media },
    clientDocuments: docs,
  };
}

export function removeClientDocument(client: ClientAccount, docId: string): ClientAccount {
  return {
    ...client,
    onboarding: {
      ...client.onboarding,
      media: client.onboarding.media.filter((f) => f.id !== docId),
    },
    clientDocuments: (client.clientDocuments ?? []).map((d) =>
      d.id === docId ? { ...d, status: "archived" as const } : d,
    ),
  };
}

export function addAdminClientDocument(
  client: ClientAccount,
  partial: Pick<ClientDocument, "name" | "type" | "category"> & {
    dataUrl?: string;
    size?: number;
    notes?: string;
  },
): ClientAccount {
  const doc: ClientDocument = {
    id: generateId(),
    customerId: client.id,
    name: partial.name,
    type: partial.type,
    category: partial.category,
    size: partial.size,
    uploadedAt: new Date().toISOString(),
    uploadedBy: "admin",
    dataUrl: partial.dataUrl,
    status: "active",
    notes: partial.notes,
    source: "admin",
  };
  return upsertClientDocument(client, doc);
}

export const DOCUMENT_CATEGORY_LABELS: Record<ClientDocumentCategory, string> = {
  logo: "Logo",
  image: "Afbeelding",
  video: "Video",
  pdf: "PDF",
  file: "Bestand",
  intake: "Intake",
  generated: "Gegenereerd",
  other: "Overig",
};
