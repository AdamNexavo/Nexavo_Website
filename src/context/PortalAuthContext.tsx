import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ClientAccount, PortalSession } from "@/lib/portal/types";
import {
  bootstrapPortalAuth,
  loginAdmin,
  loginClient,
  logout as authLogout,
  registerClient,
} from "@/lib/portal/auth";
import { getClientById, initPortalStorage, refreshPortalStorage } from "@/lib/portal/storage";
import { migrateClient } from "@/lib/portal/types";
import { isSupabasePortalEnabled } from "@/lib/portal/supabase-client";

interface PortalAuthContextValue {
  session: PortalSession | null;
  client: ClientAccount | null;
  isAdmin: boolean;
  isClient: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginAsAdmin: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (params: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName: string;
    inviteToken?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshClient: () => void;
}

const PortalAuthContext = createContext<PortalAuthContextValue | null>(null);

export function PortalAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<PortalSession | null>(null);
  const [client, setClient] = useState<ClientAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadClientFromSession = useCallback((current: PortalSession | null) => {
    if (current?.type === "client" && current.clientId) {
      const raw = getClientById(current.clientId);
      setClient(raw ? migrateClient(raw) : null);
    } else {
      setClient(null);
    }
  }, []);

  const refreshClient = useCallback(() => {
    const current = session;
    if (isSupabasePortalEnabled()) {
      void refreshPortalStorage().then(() => loadClientFromSession(current));
      return;
    }
    loadClientFromSession(current);
  }, [loadClientFromSession, session]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        await initPortalStorage();
        const current = await bootstrapPortalAuth();
        if (cancelled) return;

        setSessionState((existing) => {
          if (existing && !current) return existing;
          return current;
        });

        if (current?.type === "client" && current.clientId) {
          const loaded = getClientById(current.clientId);
          if (!loaded) {
            void authLogout();
            if (!cancelled) {
              setSessionState(null);
              setClient(null);
            }
            return;
          }
          if (!cancelled) setClient(migrateClient(loaded));
          return;
        }

        if (!cancelled) setClient(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginClient(email, password);
      if (!result) return { ok: false, error: "Onjuist e-mailadres of wachtwoord." };
      setSessionState(result);
      if (result.clientId) {
        const loaded = getClientById(result.clientId);
        setClient(loaded ? migrateClient(loaded) : null);
      }
      return { ok: true };
    },
    [],
  );

  const loginAsAdmin = useCallback(async (email: string, password: string) => {
    const result = await loginAdmin(email, password);
    if (!result.session) {
      return { ok: false, error: result.error ?? "Onjuiste admin-gegevens." };
    }
    setSessionState(result.session);
    setClient(null);
    return { ok: true };
  }, []);

  const register = useCallback(
    async (params: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      companyName: string;
      inviteToken?: string;
    }) => {
      const result = await registerClient(params);
      if (result.error) return { ok: false, error: result.error };
      if (result.client) {
        setSessionState({
          type: "client",
          clientId: result.client.id,
          email: result.client.email,
          loggedInAt: new Date().toISOString(),
        });
        setClient(result.client);
      }
      return { ok: true };
    },
    [],
  );

  const logout = useCallback(async () => {
    await authLogout();
    setSessionState(null);
    setClient(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      client,
      isAdmin: session?.type === "admin",
      isClient: session?.type === "client",
      isLoading,
      login,
      loginAsAdmin,
      register,
      logout,
      refreshClient,
    }),
    [session, client, isLoading, login, loginAsAdmin, register, logout, refreshClient],
  );

  return (
    <PortalAuthContext.Provider value={value}>{children}</PortalAuthContext.Provider>
  );
}

export function usePortalAuth() {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) throw new Error("usePortalAuth must be used within PortalAuthProvider");
  return ctx;
}
