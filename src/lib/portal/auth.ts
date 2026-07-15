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
  setSession,
  upsertClient,
  upsertInvite,
} from "./storage";
import { getPlanById, getMaintenanceById } from "./constants";
import { createOneTimePackageInvoice } from "./invoices";

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

export async function loginAdmin(email: string, password: string): Promise<PortalSession | null> {
  const creds = getAdminCredentials();
  const hash = await hashPassword(password);
  if (
    email.toLowerCase() === creds.email.toLowerCase() &&
    hash === creds.passwordHash
  ) {
    const session: PortalSession = {
      type: "admin",
      email: creds.email,
      loggedInAt: new Date().toISOString(),
    };
    setSession(session);
    return session;
  }
  return null;
}

export async function loginClient(email: string, password: string): Promise<PortalSession | null> {
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

export function logout(): void {
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
  const passwordHash = await hashPassword(params.password);
  const user: PortalUser = {
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    avatarInitials: `${params.firstName[0] ?? ""}${params.lastName[0] ?? ""}`.toUpperCase(),
  };

  const clientId = generateId();
  const clientBase: ClientAccount = {
    id: clientId,
    clientNumber: generateClientNumberFromId(clientId),
    email: params.email.toLowerCase(),
    passwordHash,
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

  const client: ClientAccount = {
    ...clientBase,
    payments: pendingSelection
      ? []
      : [
          createOneTimePackageInvoice(
            clientBase,
            plan?.name ?? planName,
            plan?.price ?? "€1.495",
          ),
        ],
  };

  upsertClient(client);
  const session: PortalSession = {
    type: "client",
    clientId: client.id,
    email: client.email,
    loggedInAt: new Date().toISOString(),
  };
  setSession(session);
  return { client };
}
