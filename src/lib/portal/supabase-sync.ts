import type { ClientAccount, ClientInvite } from "./types";
import { migrateClient } from "./types";
import { migratePaymentRecord } from "./invoices";
import { getSupabaseClient, isSupabasePortalEnabled } from "./supabase-client";

type PortalClientRow = {
  id: string;
  auth_user_id: string | null;
  email: string;
  data: Record<string, unknown>;
  active: boolean;
  created_at: string;
  updated_at: string;
};

type PortalInviteRow = {
  id: string;
  token: string;
  data: Record<string, unknown>;
  used: boolean;
  created_at: string;
  expires_at: string;
};

function rowToClient(row: PortalClientRow): ClientAccount {
  const payload = row.data ?? {};
  const merged = migrateClient({
    ...(payload as ClientAccount),
    id: row.id,
    email: row.email.toLowerCase(),
    passwordHash: "",
    active: row.active,
    createdAt: (payload.createdAt as string) ?? row.created_at,
  });
  return {
    ...merged,
    payments: merged.payments.map((p) => migratePaymentRecord(p, merged)),
  };
}

function clientToRowData(client: ClientAccount): Record<string, unknown> {
  const { id: _id, email: _email, passwordHash: _hash, ...rest } = client;
  return rest as Record<string, unknown>;
}

export async function fetchAllClientsFromSupabase(): Promise<ClientAccount[]> {
  if (!isSupabasePortalEnabled()) return [];
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("portal_clients").select("*").order("updated_at", {
    ascending: false,
  });
  if (error) throw error;
  return (data as PortalClientRow[]).map(rowToClient);
}

export async function upsertClientToSupabase(client: ClientAccount): Promise<void> {
  if (!isSupabasePortalEnabled()) return;
  const supabase = getSupabaseClient();
  const row = {
    id: client.id,
    email: client.email.toLowerCase(),
    data: clientToRowData(client),
    active: client.active,
  };

  const { error } = await supabase.from("portal_clients").upsert(row, { onConflict: "id" });
  if (error) throw error;
}

export async function deleteClientFromSupabase(id: string): Promise<void> {
  if (!isSupabasePortalEnabled()) return;
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("portal_clients").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchClientByAuthUserId(authUserId: string): Promise<ClientAccount | null> {
  if (!isSupabasePortalEnabled()) return null;
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("portal_clients")
    .select("*")
    .eq("auth_user_id", authUserId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToClient(data as PortalClientRow);
}

function rowToInvite(row: PortalInviteRow): ClientInvite {
  const payload = row.data ?? {};
  return {
    ...(payload as ClientInvite),
    id: row.id,
    token: row.token,
    used: row.used,
    expiresAt: (payload.expiresAt as string) ?? row.expires_at,
    createdAt: (payload.createdAt as string) ?? row.created_at,
  };
}

function inviteToRowData(invite: ClientInvite): Record<string, unknown> {
  const { id: _id, token: _token, used: _used, ...rest } = invite;
  return rest as Record<string, unknown>;
}

export async function fetchAllInvitesFromSupabase(): Promise<ClientInvite[]> {
  if (!isSupabasePortalEnabled()) return [];
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("portal_invites").select("*").order("created_at", {
    ascending: false,
  });
  if (error) throw error;
  return (data as PortalInviteRow[]).map(rowToInvite);
}

export async function upsertInviteToSupabase(invite: ClientInvite): Promise<void> {
  if (!isSupabasePortalEnabled()) return;
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("portal_invites").upsert(
    {
      id: invite.id,
      token: invite.token,
      data: inviteToRowData(invite),
      used: invite.used,
      expires_at: invite.expiresAt,
    },
    { onConflict: "id" },
  );
  if (error) throw error;
}

export async function insertPortalClientWithAuth(params: {
  client: ClientAccount;
  authUserId: string;
}): Promise<void> {
  if (!isSupabasePortalEnabled()) return;
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("portal_clients").insert({
    id: params.client.id,
    auth_user_id: params.authUserId,
    email: params.client.email.toLowerCase(),
    data: clientToRowData(params.client),
    active: params.client.active,
  });
  if (error) throw error;
}

export function subscribeToPortalClients(onChange: () => void): () => void {
  if (!isSupabasePortalEnabled()) return () => undefined;
  const supabase = getSupabaseClient();
  const channel = supabase
    .channel("portal_clients_changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "portal_clients" }, () => {
      onChange();
    })
    .subscribe();
  return () => {
    void supabase.removeChannel(channel);
  };
}
