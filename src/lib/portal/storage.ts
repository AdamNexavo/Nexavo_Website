import type { ClientAccount, ClientInvite, PortalSession } from "./types";
import { migrateClient } from "./types";
import { migratePaymentRecord } from "./invoices";
import { isSupabasePortalEnabled } from "./supabase-client";
import {
  deleteClientFromSupabase,
  fetchAllClientsFromSupabase,
  fetchAllInvitesFromSupabase,
  subscribeToPortalClients,
  upsertClientToSupabase,
  upsertInviteToSupabase,
} from "./supabase-sync";

/**
 * Portal storage — localStorage (demo) of Supabase PostgreSQL (productie).
 */
const KEYS = {
  clients: "nexavo_portal_clients",
  invites: "nexavo_portal_invites",
  session: "nexavo_portal_session",
} as const;

let supabaseClientsCache: ClientAccount[] | null = null;
let supabaseInvitesCache: ClientInvite[] | null = null;
let storageInitPromise: Promise<void> | null = null;
let unsubscribeRealtime: (() => void) | null = null;

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

function migrateStoredClients(clients: ClientAccount[]): ClientAccount[] {
  return clients.map((c) => {
    const migrated = migrateClient(c);
    return {
      ...migrated,
      payments: migrated.payments.map((p) => migratePaymentRecord(p, migrated)),
    };
  });
}

export function isRemotePortalStorage(): boolean {
  return isSupabasePortalEnabled();
}

export async function initPortalStorage(): Promise<void> {
  if (!isSupabasePortalEnabled()) return;
  if (storageInitPromise) return storageInitPromise;

  storageInitPromise = (async () => {
    try {
      supabaseClientsCache = await fetchAllClientsFromSupabase();
      supabaseInvitesCache = await fetchAllInvitesFromSupabase();
    } catch (cause) {
      console.warn("Kon portaldata niet laden:", cause);
      supabaseClientsCache = [];
      supabaseInvitesCache = [];
    }

    try {
      unsubscribeRealtime?.();
      unsubscribeRealtime = subscribeToPortalClients(() => {
        void reloadSupabaseCache();
      });
    } catch (cause) {
      console.warn("Realtime sync niet beschikbaar:", cause);
    }
  })();

  return storageInitPromise;
}

async function reloadSupabaseCache(): Promise<void> {
  if (!isSupabasePortalEnabled()) return;
  supabaseClientsCache = await fetchAllClientsFromSupabase();
  supabaseInvitesCache = await fetchAllInvitesFromSupabase();
}

export async function refreshPortalStorage(): Promise<void> {
  if (!isSupabasePortalEnabled()) return;
  await reloadSupabaseCache();
}

export function getClients(): ClientAccount[] {
  if (isSupabasePortalEnabled()) {
    return migrateStoredClients(supabaseClientsCache ?? []);
  }
  return migrateStoredClients(readJson<ClientAccount[]>(KEYS.clients, []));
}

export function saveClients(clients: ClientAccount[]): void {
  if (isSupabasePortalEnabled()) {
    supabaseClientsCache = migrateStoredClients(clients);
    return;
  }
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

  if (isSupabasePortalEnabled()) {
    void upsertClientToSupabase(client).catch((error) => {
      console.error("Kon klant niet synchroniseren met Supabase:", error);
    });
  }

  return client;
}

export function deleteClient(id: string): void {
  saveClients(getClients().filter((c) => c.id !== id));
  if (isSupabasePortalEnabled()) {
    void deleteClientFromSupabase(id).catch((error) => {
      console.error("Kon klant niet verwijderen uit Supabase:", error);
    });
  }
}

export function getInvites(): ClientInvite[] {
  if (isSupabasePortalEnabled()) {
    return supabaseInvitesCache ?? [];
  }
  return readJson<ClientInvite[]>(KEYS.invites, []);
}

export function saveInvites(invites: ClientInvite[]): void {
  if (isSupabasePortalEnabled()) {
    supabaseInvitesCache = invites;
    return;
  }
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

  if (isSupabasePortalEnabled()) {
    void upsertInviteToSupabase(invite).catch((error) => {
      console.error("Kon uitnodiging niet synchroniseren met Supabase:", error);
    });
  }

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
