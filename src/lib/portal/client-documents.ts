import type { ClientAccount, ClientAssignedDocument, DocumentAttachment } from "./types";
import { PORTAL_DOCUMENTS } from "@/data/revision-policy";
import { generateId } from "./storage";

export type { ClientAssignedDocument, DocumentAttachment };

export type VisibleDocument = {
  id: string;
  title: string;
  description?: string;
  href?: string;
  external?: boolean;
  attachment?: DocumentAttachment;
  type?: "revision" | "maintenance" | "upsell" | "custom" | "link";
  content?: string;
  source: "standard" | "assigned";
  assignedAt?: string;
  fileName?: string;
};

export function getClientVisibleDocuments(client: ClientAccount): VisibleDocument[] {
  const standard: VisibleDocument[] = PORTAL_DOCUMENTS.map((doc) => ({
    id: doc.id,
    title: doc.title,
    description: doc.description,
    href: "href" in doc ? doc.href : undefined,
    external: "external" in doc ? doc.external : undefined,
    type: "type" in doc ? doc.type : "link",
    source: "standard" as const,
  }));

  const assigned: VisibleDocument[] = (client.assignedDocuments ?? []).map((doc) => ({
    id: doc.id,
    title: doc.title,
    description: doc.description,
    href: doc.attachment?.dataUrl ?? doc.href,
    external: doc.external ?? !!doc.attachment,
    content: doc.content,
    type: "custom",
    source: "assigned" as const,
    assignedAt: doc.assignedAt,
    fileName: doc.attachment?.fileName,
  }));

  return [...standard, ...assigned];
}

export function createAssignedDocument(
  partial: Pick<ClientAssignedDocument, "title"> &
    Partial<Omit<ClientAssignedDocument, "id" | "assignedAt" | "title">>,
): ClientAssignedDocument {
  return {
    id: generateId(),
    title: partial.title,
    description: partial.description,
    href: partial.href,
    external: partial.external,
    content: partial.content,
    assignedAt: new Date().toISOString(),
    assignedBy: partial.assignedBy ?? "admin",
    attachment: partial.attachment,
  };
}
