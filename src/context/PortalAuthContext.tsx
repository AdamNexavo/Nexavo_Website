import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ClientAccount, PortalSession } from "@/lib/portal/types";
import {
  loginAdmin,
  loginClient,
  logout as authLogout,
  registerClient,
  resolvePortalSessionFromSupabaseUser,
} from "@/lib/portal/auth";
import { getClientById, getSession, initPortalStorage, refreshPortalStorage, setSession } from "@/lib/portal/storage";
import { migrateClient } from "@/lib/portal/types";
import { ensureDemoAccounts } from "@/lib/portal/demo-seed";
import { getSupabaseClient, isSupabasePortalEnabled } from "@/lib/portal/supabase-client";

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

function applyPortalSession(
  portalSession: PortalSession | null,
  setSessionState: (value: PortalSession | null) => void,
  setClient: (value: ClientAccount | null) => void,
) {
  setSessionState(portalSession);
  if (portalSession) setSession(portalSession);
  else setSession(null);

  if (portalSession?.type === "client" && portalSession.clientId) {
    const loaded = getClientById(portalSession.clientId);
    setClient(loaded ? migrateClient(loaded) : null);
    return;
  }

  setClient(null);
}

export function PortalAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<PortalSession | null>(null);
  const [client, setClient] = useState<ClientAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const manualLoginRef = useRef(false);

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
    let unsubscribeAuth: (() => void) | undefined;

    void (async () => {
      void initPortalStorage().catch((cause) => {
        console.warn("Portal storage init mislukt:", cause);
      });

      try {
        if (isSupabasePortalEnabled()) {
          const supabase = getSupabaseClient();
          const {
            data: { session: existingSession },
          } = await supabase.auth.getSession();

          if (!cancelled && existingSession?.user) {
            const portalSession = await resolvePortalSessionFromSupabaseUser(existingSession.user);
            if (portalSession && !cancelled) {
              applyPortalSession(portalSession, setSessionState, setClient);
            }
          }

          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            if (cancelled) return;

            void (async () => {
              if (!nextSession?.user) {
                if (manualLoginRef.current) return;
                applyPortalSession(null, setSessionState, setClient);
                return;
              }

              const portalSession = await resolvePortalSessionFromSupabaseUser(nextSession.user);
              if (!portalSession) {
                await supabase.auth.signOut();
                applyPortalSession(null, setSessionState, setClient);
                return;
              }

              applyPortalSession(portalSession, setSessionState, setClient);
            })();
          });

          unsubscribeAuth = () => subscription.unsubscribe();
          return;
        }

        ensureDemoAccounts();
        const current = getSession();
        if (!cancelled) applyPortalSession(current, setSessionState, setClient);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      unsubscribeAuth?.();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    manualLoginRef.current = true;
    try {
      const result = await loginClient(email, password);
      if (!result) return { ok: false, error: "Onjuist e-mailadres of wachtwoord." };
      applyPortalSession(result, setSessionState, setClient);
      return { ok: true };
    } finally {
      manualLoginRef.current = false;
    }
  }, []);

  const loginAsAdmin = useCallback(async (email: string, password: string) => {
    manualLoginRef.current = true;
    try {
      const result = await loginAdmin(email, password);
      if (!result.session) {
        return { ok: false, error: result.error ?? "Onjuiste admin-gegevens." };
      }
      applyPortalSession(result.session, setSessionState, setClient);
      return { ok: true };
    } finally {
      manualLoginRef.current = false;
    }
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
      manualLoginRef.current = true;
      try {
        const result = await registerClient(params);
        if (result.error) return { ok: false, error: result.error };
        if (result.client) {
          applyPortalSession(
            {
              type: "client",
              clientId: result.client.id,
              email: result.client.email,
              loggedInAt: new Date().toISOString(),
            },
            setSessionState,
            setClient,
          );
        }
        return { ok: true };
      } finally {
        manualLoginRef.current = false;
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    await authLogout();
    applyPortalSession(null, setSessionState, setClient);
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

  return <PortalAuthContext.Provider value={value}>{children}</PortalAuthContext.Provider>;
}

export function usePortalAuth() {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) throw new Error("usePortalAuth must be used within PortalAuthProvider");
  return ctx;
}
