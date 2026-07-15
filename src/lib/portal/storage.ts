import type { ClientAccount, ClientInvite, PortalSession } from "./types";
import { migrateClient } from "./types";
import { migratePaymentRecord } from "./invoices";

/**
 * DEMO / MVP STORAGE — NOT PRODUCTION READY
 *
 * All portal data lives in browser localStorage. Client-side password hashing and
 * session tokens are suitable for demos only. Production requires Supabase Auth,
 * a PostgreSQL database, and secure file storage for uploads.
 */
const KEYS = {
  clients: "nexavo_portal_clients",
  invites: "nexavo_portal_invites",
  session: "nexavo_portal_session",
} as const;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getClients(): ClientAccount[] {
  return readJson<ClientAccount[]>(KEYS.clients, []).map((c) => {
    const migrated = migrateClient(c);
    return {
      ...migrated,
      payments: migrated.payments.map((p) => migratePaymentRecord(p, migrated)),
    };
  });
}

export function saveClients(clients: ClientAccount[]): void {
  writeJson(KEYS.clients, clients);
}

export function getClientById(id: string): ClientAccount | undefined {
  return getClients().find((c) => c.id === id);
}

export function getClientByEmail(email: string): ClientAccount | undefined {
  return getClients().find((c) => c.email.toLowerCase() === email.toLowerCase());
}

export function upsertClient(client: ClientAccount): ClientAccount {
  const clients = getClients();
  const index = clients.findIndex((c) => c.id === client.id);
  if (index >= 0) clients[index] = client;
  else clients.push(client);
  saveClients(clients);
  return client;
}

export function deleteClient(id: string): void {
  saveClients(getClients().filter((c) => c.id !== id));
}

export function getInvites(): ClientInvite[] {
  return readJson<ClientInvite[]>(KEYS.invites, []);
}

export function saveInvites(invites: ClientInvite[]): void {
  writeJson(KEYS.invites, invites);
}

export function getInviteByToken(token: string): ClientInvite | undefined {
  return getInvites().find((i) => i.token === token && !i.used);
}

export function upsertInvite(invite: ClientInvite): ClientInvite {
  const invites = getInvites();
  const index = invites.findIndex((i) => i.id === invite.id);
  if (index >= 0) invites[index] = invite;
  else invites.push(invite);
  saveInvites(invites);
  return invite;
}

export function getSession(): PortalSession | null {
  return readJson<PortalSession | null>(KEYS.session, null);
}

export function setSession(session: PortalSession | null): void {
  if (session) writeJson(KEYS.session, session);
  else localStorage.removeItem(KEYS.session);
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function generateTicketNumber(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `NX-${num}`;
}

export function generateInviteToken(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 24);
}
