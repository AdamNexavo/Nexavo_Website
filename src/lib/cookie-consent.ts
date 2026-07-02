export const COOKIE_CONSENT_KEY = "nexavo-cookie-consent";

/** Banner opnieuw tonen na 1 uur. */
export const COOKIE_CONSENT_TTL_MS = 60 * 60 * 1000;

export type CookieConsent = "accepted" | "rejected";

type StoredCookieConsent = {
  value: CookieConsent;
  decidedAt: number;
};

function parseStoredConsent(raw: string): StoredCookieConsent | null {
  if (raw === "accepted" || raw === "rejected") {
    return { value: raw, decidedAt: 0 };
  }

  try {
    const parsed = JSON.parse(raw) as StoredCookieConsent;
    if (
      (parsed.value === "accepted" || parsed.value === "rejected") &&
      typeof parsed.decidedAt === "number"
    ) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!raw) return null;

  const stored = parseStoredConsent(raw);
  if (!stored) return null;

  if (Date.now() - stored.decidedAt >= COOKIE_CONSENT_TTL_MS) {
    return null;
  }

  return stored.value;
}

export function shouldShowCookieBanner(): boolean {
  return getCookieConsent() === null;
}

export function setCookieConsent(value: CookieConsent) {
  const stored: StoredCookieConsent = {
    value,
    decidedAt: Date.now(),
  };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(stored));
}
