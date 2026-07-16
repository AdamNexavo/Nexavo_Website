import type { ClientAccount, PortalSession, PortalUser } from "./types";
import {
  createDefaultOnboarding,
  createDefaultProgress,
  generateClientNumberFromId,
} from "./types";
import {
  generateId,
  getClientByEmail,
  getInviteByToken,
  getSession,
  initPortalStorage,
  isRemotePortalStorage,
  refreshPortalStorage,
  setSession,
  upsertClient,
  upsertInvite,
} from "./storage";
import { getPlanById, getMaintenanceById } from "./constants";
import { ensureDemoAccounts } from "./demo-seed";
import {
  getSupabaseClient,
  isPortalAdminUser,
  isSupabasePortalEnabled,
} from "./supabase-client";
import {
  fetchClientByAuthUserId,
  insertPortalClientWithAuth,
} from "./supabase-sync";

const SALT = "nexavo-portal-v1";

/** Fallback hash voor admin@nexavo.works — gebruikt wanneer .env nog niet geladen is */
const DEFAULT_ADMIN_EMAIL = "admin@nexavo.works";
const DEFAULT_ADMIN_PASSWORD_HASH =
  "6fab38489fda6eb6e65a4934628239345ef91b82d3a363f56d351db54d118b75";

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + SALT);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function getAdminCredentials() {
  return {
    email: import.meta.env.VITE_PORTAL_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL,
    passwordHash:
      import.meta.env.VITE_PORTAL_ADMIN_PASSWORD_HASH || DEFAULT_ADMIN_PASSWORD_HASH,
  };
}

async function restoreSupabaseSession(): Promise<PortalSession | null> {
  if (!isSupabasePortalEnabled()) return getSession();

  await initPortalStorage();
  const supabase = getSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) return null;

  if (isPortalAdminUser(session.user)) {
    await refreshPortalStorage();
    const adminSession: PortalSession = {
      type: "admin",
      email: session.user.email ?? DEFAULT_ADMIN_EMAIL,
      loggedInAt: new Date().toISOString(),
    };
    setSession(adminSession);
    return adminSession;
  }

  const client = await fetchClientByAuthUserId(session.user.id);
  if (!client?.active) {
    await supabase.auth.signOut();
    setSession(null);
    return null;
  }

  await refreshPortalStorage();
  const clientSession: PortalSession = {
    type: "client",
    clientId: client.id,
    email: client.email,
    loggedInAt: new Date().toISOString(),
  };
  setSession(clientSession);
  return clientSession;
}

export async function bootstrapPortalAuth(): Promise<PortalSession | null> {
  if (isSupabasePortalEnabled()) {
    return restoreSupabaseSession();
  }
  ensureDemoAccounts();
  return getSession();
}

export async function loginAdmin(
  email: string,
  password: string,
): Promise<{ session: PortalSession | null; error?: string }> {
  if (isSupabasePortalEnabled()) {
    try {
      await initPortalStorage();
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });
      if (error) {
        return { session: null, error: "Onjuist e-mailadres of wachtwoord." };
      }
      if (!data.user) {
        return { session: null, error: "Inloggen mislukt. Probeer het opnieuw." };
      }
      if (!isPortalAdminUser(data.user)) {
        await supabase.auth.signOut();
        return {
          session: null,
          error: "Dit account heeft geen admin-rechten. Gebruik admin@nexavo.works.",
        };
      }
      await refreshPortalStorage();
      const session: PortalSession = {
        type: "admin",
        email: data.user.email ?? email.toLowerCase(),
        loggedInAt: new Date().toISOString(),
      };
      setSession(session);
      return { session };
    } catch (cause) {
      console.error("Admin login via Supabase mislukt:", cause);
      return {
        session: null,
        error: "Verbinding met Supabase mislukt. Probeer het opnieuw of neem contact op.",
      };
    }
  }

  const creds = getAdminCredentials();
  const hash = await hashPassword(password);
  const normalized = email.toLowerCase();
  const adminEmails = new Set([creds.email.toLowerCase(), DEFAULT_ADMIN_EMAIL.toLowerCase()]);
  if (adminEmails.has(normalized) && hash === creds.passwordHash) {
    const session: PortalSession = {
      type: "admin",
      email: creds.email,
      loggedInAt: new Date().toISOString(),
    };
    setSession(session);
    return { session };
  }
  return { session: null, error: "Onjuiste admin-gegevens." };
}

export async function loginClient(email: string, password: string): Promise<PortalSession | null> {
  if (isSupabasePortalEnabled()) {
    await initPortalStorage();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });
    if (error || !data.user) return null;

    const client = await fetchClientByAuthUserId(data.user.id);
    if (!client?.active) {
      await supabase.auth.signOut();
      return null;
    }

    await refreshPortalStorage();
    const session: PortalSession = {
      type: "client",
      clientId: client.id,
      email: client.email,
      loggedInAt: new Date().toISOString(),
    };
    setSession(session);
    return session;
  }

  ensureDemoAccounts();
  const client = getClientByEmail(email);
  if (!client || !client.active) return null;
  const hash = await hashPassword(password);
  if (hash !== client.passwordHash) return null;
  const session: PortalSession = {
    type: "client",
    clientId: client.id,
    email: client.email,
    loggedInAt: new Date().toISOString(),
  };
  setSession(session);
  return session;
}

export async function logout(): Promise<void> {
  if (isSupabasePortalEnabled()) {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
  }
  setSession(null);
}

export function getCurrentSession(): PortalSession | null {
  return getSession();
}

export async function registerClient(params: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName: string;
  inviteToken?: string;
}): Promise<{ client?: ClientAccount; error?: string }> {
  if (getClientByEmail(params.email)) {
    return { error: "Er bestaat al een account met dit e-mailadres." };
  }

  let planId = "start";
  let planName = "Start";
  let maintenanceId = "plus";
  let pendingSelection = false;

  if (params.inviteToken) {
    const invite = getInviteByToken(params.inviteToken);
    if (!invite) return { error: "Deze uitnodiging is ongeldig of verlopen." };
    if (new Date(invite.expiresAt) < new Date()) {
      return { error: "Deze uitnodiging is verlopen." };
    }
    if (invite.noPackage || invite.planId === "none") {
      planId = "none";
      planName = "Nog te kiezen";
      pendingSelection = true;
    } else {
      planId = invite.planId;
      planName = invite.planName;
      maintenanceId = invite.maintenanceId ?? "plus";
    }
    upsertInvite({ ...invite, used: true, usedAt: new Date().toISOString() });
  } else {
    planId = "none";
    planName = "Nog te kiezen";
    pendingSelection = true;
  }

  const plan = getPlanById(planId);
  const maintenance = getMaintenanceById(maintenanceId);
  const user: PortalUser = {
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    avatarInitials: `${params.firstName[0] ?? ""}${params.lastName[0] ?? ""}`.toUpperCase(),
  };

  const clientId = generateId();
  const client: ClientAccount = {
    id: clientId,
    clientNumber: generateClientNumberFromId(clientId),
    email: params.email.toLowerCase(),
    passwordHash: "",
    user,
    companyName: params.companyName,
    createdAt: new Date().toISOString(),
    phase: "build",
    onboarding: createDefaultOnboarding({
      company: {
        name: params.companyName,
        industry: "",
        location: "",
        contactPerson: `${params.firstName} ${params.lastName}`,
        targetAudience: "",
      },
    }),
    package: {
      planId,
      planName: plan?.name ?? planName,
      planPrice: plan?.price ?? "—",
      maintenanceId: pendingSelection ? undefined : maintenanceId,
      maintenanceName: pendingSelection ? undefined : (maintenance?.name ?? "Plus Beheer"),
      monthlyPrice: pendingSelection ? "—" : (maintenance?.price ?? "€99"),
      maintenanceIncluded: maintenance?.highlights ?? [],
      pendingSelection,
    },
    progress: createDefaultProgress(),
    payments: [],
    tickets: [],
    active: true,
  };

  if (isSupabasePortalEnabled()) {
    await initPortalStorage();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email: params.email.toLowerCase(),
      password: params.password,
      options: {
        data: {
          first_name: params.firstName,
          last_name: params.lastName,
          company_name: params.companyName,
        },
      },
    });
    if (error || !data.user) {
      return { error: error?.message ?? "Registratie mislukt. Probeer het opnieuw." };
    }

    try {
      await insertPortalClientWithAuth({ client, authUserId: data.user.id });
      await refreshPortalStorage();
    } catch (insertError) {
      await supabase.auth.signOut();
      return {
        error:
          insertError instanceof Error
            ? insertError.message
            : "Account kon niet worden opgeslagen.",
      };
    }

    const session: PortalSession = {
      type: "client",
      clientId: client.id,
      email: client.email,
      loggedInAt: new Date().toISOString(),
    };
    setSession(session);
    return { client };
  }

  const passwordHash = await hashPassword(params.password);
  upsertClient({ ...client, passwordHash });
  const session: PortalSession = {
    type: "client",
    clientId: client.id,
    email: client.email,
    loggedInAt: new Date().toISOString(),
  };
  setSession(session);
  return { client };
}

export function isProductionPortalBackend(): boolean {
  return isRemotePortalStorage();
}
